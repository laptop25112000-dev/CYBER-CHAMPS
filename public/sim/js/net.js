// Online rooms. Supabase Realtime carries the lobby (presence) and the WebRTC handshake; the game
// traffic then flows over direct peer-to-peer data channels. Realtime's free tier allows about
// 100 messages per second for the whole project, far too few for 20 Hz match state, so it is only
// used as a low-rate relay when a network blocks peer-to-peer connections.
import { Account } from './account.js';

const ICE_SERVERS = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
  { urls: 'stun:stun.cloudflare.com:3478' },
];
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // no 0/O or 1/I
const P2P_TIMEOUT = 9000;          // ms before a peer that has not connected directly falls back to the relay
const RELAY_BUDGET = 8;            // unreliable relay messages per second this client may send
const HOST_GRACE = 6000;           // ms the host may vanish from presence before the room counts as closed

const rand = (n) => { const a = new Uint32Array(n); crypto.getRandomValues(a); return a; };
export const newCode = () => Array.from(rand(4), (v) => CODE_CHARS[v % CODE_CHARS.length]).join('');
// the first RTCPeerConnection in a page initialises the browser's WebRTC stack, which can stall the page for
// a second or two; do it while the player is still on the online screen instead of mid-join
let warmed = false;
export function warmUpRTC() {
  if (warmed || typeof RTCPeerConnection === 'undefined') return;
  warmed = true;
  setTimeout(() => { try { new RTCPeerConnection().close(); } catch { /* unsupported: the relay still works */ } }, 60);
}
export const cleanCode = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
const newId = () => Array.from(rand(3), (v) => v.toString(36)).join('').slice(0, 12);

export class Room {
  constructor({ code, isHost, name }) {
    this.code = code; this.isHost = isHost; this.name = name;
    this.id = newId();
    this.hostId = isHost ? this.id : null;
    this.peers = new Map();        // peer id -> { id, name, pc, rel, unr, state: 'connecting' | 'p2p' | 'relay', rtt }
    this.handlers = new Map();
    this.earlyIce = new Map();     // candidates that arrived before their offer
    this.names = new Map();        // peer id -> display name (from hello / signalling)
    this.relayTimes = [];
    this.closed = false;
  }
  on(type, fn) { if (!this.handlers.has(type)) this.handlers.set(type, []); this.handlers.get(type).push(fn); }
  emit(type, ...a) { for (const f of this.handlers.get(type) || []) { try { f(...a); } catch (e) { console.error(e); } } }

  // ------------------------------------------------------------ Realtime channel (lobby + signalling)
  async open() {
    const client = Account.client;
    if (!client) throw new Error('Online play needs an internet connection.');
    this.ch = client.channel(`hyperdrive-room-${this.code}`, { config: { broadcast: { self: false, ack: false }, presence: { key: this.id } } });
    this.ch.on('broadcast', { event: 'sig' }, ({ payload }) => { if (payload && payload.to === this.id) this.onSignal(payload); });
    this.ch.on('broadcast', { event: 'msg' }, ({ payload }) => this.onRelay(payload));
    this.ch.on('broadcast', { event: 'hi' }, ({ payload }) => {
      if (!payload || payload.from === this.id) return;
      this.names.set(payload.from, payload.name);
      if (this.isHost) this.signal(payload.from, { kind: 'host' });        // "I'm the host, connect to me"
    });
    this.ch.on('presence', { event: 'sync' }, () => this.onPresence());
    await new Promise((resolve, reject) => {
      let done = false;
      const fail = (msg) => { if (!done) { done = true; reject(new Error(msg)); } };
      const timer = setTimeout(() => fail('Could not reach the game server. Check your connection and try again.'), 12000);
      this.ch.subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && !done) {
          clearTimeout(timer);
          // presence acknowledgements can take seconds: do not wait for them (leave detection only)
          this.ch.track({ name: this.name, host: this.isHost, t: Date.now() }).catch(() => {});
          if (!this.isHost) this.ch.send({ type: 'broadcast', event: 'hi', payload: { from: this.id, name: this.name } });
          done = true; resolve();
        } else if ((status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') && !done) { clearTimeout(timer); fail('Could not connect to the room. Try again in a moment.'); }
      });
    });
    this.pingTimer = setInterval(() => this.pingAll(), 2000);
  }

  members() {
    if (!this.ch) return [];
    const st = this.ch.presenceState();
    return Object.entries(st).map(([id, metas]) => ({ id, ...(metas[metas.length - 1] || {}) }));
  }

  onPresence() {
    if (this.closed) return;
    const mem = this.members();
    if (this.isHost) {
      // forget guests that left (after a short grace period: presence can blip on reconnects)
      for (const p of this.peers.values()) {
        const here = mem.some((m) => m.id === p.id);
        if (here) { p.seen = true; clearTimeout(p.goneTimer); p.goneTimer = null; }
        else if (p.seen && !p.goneTimer) p.goneTimer = setTimeout(() => this.dropPeer(p.id), 3000);
      }
      // a guest whose WebRTC offer never arrived still gets served through the relay
      for (const m of mem) {
        if (m.id === this.id || this.peers.has(m.id) || this.pendingRelay?.has(m.id)) continue;
        (this.pendingRelay ||= new Map()).set(m.id, setTimeout(() => {
          this.pendingRelay.delete(m.id);
          if (this.closed || this.peers.has(m.id) || !this.members().some((x) => x.id === m.id)) return;
          this.relayPeer(m.id);
        }, P2P_TIMEOUT + 2000));
      }
    } else {
      const host = mem.find((m) => m.host);
      if (host) {
        this.hostSeen = true;
        clearTimeout(this.hostGone); this.hostGone = null;
        if (host.id !== this.hostId || !this.peers.has(host.id)) { this.hostId = host.id; this.connectToHost(host); }
      } else if (this.hostId && this.hostSeen && !this.hostGone) {
        this.hostGone = setTimeout(() => this.emit('host-left'), HOST_GRACE);
      }
    }
    this.emit('presence', mem);
  }

  signal(to, data) {
    if (!this.ch || this.closed) return;
    this.ch.send({ type: 'broadcast', event: 'sig', payload: { ...data, to, from: this.id, name: this.name } });
  }

  // ------------------------------------------------------------ WebRTC peers
  makePeer(id, name) {
    const old = this.peers.get(id);
    if (old) this.closePeer(old, true);
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
    const p = { id, name, pc, rel: null, unr: null, state: 'connecting', rtt: null, ice: [], remoteSet: false };
    pc.onicecandidate = (e) => { if (e.candidate) this.signal(id, { kind: 'ice', c: e.candidate.toJSON() }); };
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' && this.peers.get(id) === p) this.setPeerState(p, 'relay');
    };
    pc.ondatachannel = (e) => { if (e.channel.label === 'r') p.rel = e.channel; else p.unr = e.channel; this.wire(p, e.channel); };
    p.timer = setTimeout(() => { if (p.state === 'connecting') this.setPeerState(p, 'relay'); }, P2P_TIMEOUT);
    this.peers.set(id, p);
    return p;
  }
  wire(p, dc) {
    dc.onopen = () => { if (p.rel && p.rel.readyState === 'open') this.setPeerState(p, 'p2p'); };
    dc.onclose = () => { if (this.peers.get(p.id) === p && p.state === 'p2p' && !this.closed) this.setPeerState(p, 'relay'); };
    dc.onmessage = (e) => { let m; try { m = JSON.parse(e.data); } catch { return; } this.deliver(p.id, m); };
    if (dc.readyState === 'open') dc.onopen();
  }
  setPeerState(p, state) {
    if (p.state === state) return;
    const first = p.state === 'connecting';
    p.state = state;
    clearTimeout(p.timer);
    if (first) this.emit('ready', p);      // send the newcomer the lobby / match state
    this.emit('peer-state', p);
  }
  async connectToHost(host) {
    let p;
    try { p = this.makePeer(host.id, host.name); } catch (e) {
      console.warn('WebRTC unavailable, using the relay', e);
      const old = this.peers.get(host.id); if (old) this.closePeer(old);
      this.relayPeer(host.id);
      this.relay(host.id, { t: 'hello' }, true);        // let the host know to serve us through the relay
      return;
    }
    p.rel = p.pc.createDataChannel('r', { ordered: true });
    p.unr = p.pc.createDataChannel('u', { ordered: false, maxRetransmits: 0 });
    this.wire(p, p.rel); this.wire(p, p.unr);
    try {
      const offer = await p.pc.createOffer();
      await p.pc.setLocalDescription(offer);
      this.signal(host.id, { kind: 'offer', sdp: { type: offer.type, sdp: offer.sdp } });
    } catch (e) { console.warn('offer', e); this.setPeerState(p, 'relay'); }
  }
  async onSignal({ from, kind, sdp, c, name }) {
    if (name) this.names.set(from, name);
    try {
      if (kind === 'host' && !this.isHost) {
        if (this.hostId !== from || !this.peers.has(from)) { this.hostId = from; this.connectToHost({ id: from, name }); }
        return;
      }
      if (kind === 'offer' && this.isHost) {
        let p;
        try { p = this.makePeer(from, name); } catch { if (!this.peers.has(from)) this.relayPeer(from); return; }
        await p.pc.setRemoteDescription(sdp);
        p.remoteSet = true;
        for (const x of [...(this.earlyIce.get(from) || []), ...p.ice]) await p.pc.addIceCandidate(x).catch(() => {});
        this.earlyIce.delete(from); p.ice = [];
        const ans = await p.pc.createAnswer();
        await p.pc.setLocalDescription(ans);
        this.signal(from, { kind: 'answer', sdp: { type: ans.type, sdp: ans.sdp } });
      } else if (kind === 'answer') {
        const p = this.peers.get(from); if (!p || p.remoteSet) return;
        await p.pc.setRemoteDescription(sdp);
        p.remoteSet = true;
        for (const x of p.ice) await p.pc.addIceCandidate(x).catch(() => {});
        p.ice = [];
      } else if (kind === 'ice') {
        const p = this.peers.get(from);
        if (!p) { if (!this.earlyIce.has(from)) this.earlyIce.set(from, []); this.earlyIce.get(from).push(c); return; }
        if (p.remoteSet) await p.pc.addIceCandidate(c).catch(() => {}); else p.ice.push(c);
      }
    } catch (e) { console.warn('signal', kind, e); }
  }
  relayPeer(id) {
    const p = { id, name: this.names.get(id) || 'Driver', pc: null, rel: null, unr: null, state: 'connecting', rtt: null, ice: [] };
    this.peers.set(id, p);
    this.setPeerState(p, 'relay');
    return p;
  }
  closePeer(p, replaced = false) {
    clearTimeout(p.timer); clearTimeout(p.goneTimer);
    try { if (p.pc) p.pc.close(); } catch { /* already closed */ }
    if (!replaced) this.peers.delete(p.id);
  }
  dropPeer(id) {
    const p = this.peers.get(id); if (!p) return;
    this.closePeer(p);
    this.emit('peer-left', id);
  }

  // ------------------------------------------------------------ sending
  // reliable: lobby, events, keyframes. unreliable: 20 Hz poses and inputs (latest wins)
  send(id, msg, reliable = true) {
    const p = this.peers.get(id);
    if (!p) return false;
    if (p.state === 'p2p') {
      const dc = !reliable && p.unr && p.unr.readyState === 'open' ? p.unr : p.rel;
      if (dc && dc.readyState === 'open') { try { dc.send(JSON.stringify(msg)); return true; } catch { /* fall through to relay */ } }
    }
    if (p.state === 'relay' || p.state === 'p2p') return this.relay(id, msg, reliable);
    return false;
  }
  sendAll(msg, reliable = true) { for (const id of this.peers.keys()) this.send(id, msg, reliable); }
  // one relayed broadcast that every relayed peer reads (cheaper than one message each)
  relayAll(msg, reliable = false) {
    if ([...this.peers.values()].some((p) => p.state === 'relay')) this.relay('*', msg, reliable);
  }
  relay(to, msg, reliable) {
    if (!this.ch || this.closed) return false;
    const now = performance.now();
    this.relayTimes = this.relayTimes.filter((t) => now - t < 1000);
    if (!reliable && this.relayTimes.length >= RELAY_BUDGET) return false;
    this.relayTimes.push(now);
    this.ch.send({ type: 'broadcast', event: 'msg', payload: { from: this.id, to, m: msg } });
    return true;
  }
  onRelay(payload) {
    if (!payload || payload.from === this.id) return;
    if (payload.to !== this.id && payload.to !== '*') return;
    let p = this.peers.get(payload.from);
    if (payload.to === '*' && p && p.state === 'p2p') return;   // already receiving this directly
    if (!p && this.isHost && payload.to === this.id) p = this.relayPeer(payload.from);   // a guest that cannot go peer-to-peer
    else if (p && p.state === 'connecting' && payload.to === this.id) this.setPeerState(p, 'relay');
    this.deliver(payload.from, payload.m);
  }

  deliver(from, m) {
    if (!m || typeof m !== 'object') return;
    if (m.t === 'ping') { this.send(from, { t: 'pong', ts: m.ts }); return; }
    if (m.t === 'pong') { const p = this.peers.get(from); if (p) { p.rtt = Math.round(performance.now() - m.ts); this.emit('peer-state', p); } return; }
    this.emit('msg', from, m);
  }
  pingAll() { const ts = performance.now(); for (const p of this.peers.values()) if (p.state !== 'connecting') this.send(p.id, { t: 'ping', ts }); }

  // ask the host to (re)introduce itself: used while waiting for a host that dropped out
  sayHi() { if (this.ch && !this.closed) this.ch.send({ type: 'broadcast', event: 'hi', payload: { from: this.id, name: this.name } }); }
  async close(bye = true) {
    if (this.closed) return;
    if (bye) this.sendAll({ t: 'bye' });
    this.closed = true;
    clearInterval(this.pingTimer); clearTimeout(this.hostGone);
    for (const p of [...this.peers.values()]) this.closePeer(p);
    for (const t of (this.pendingRelay || new Map()).values()) clearTimeout(t);
    if (this.ch) { try { await this.ch.untrack(); } catch { /* ignore */ } try { await Account.client.removeChannel(this.ch); } catch { /* ignore */ } }
  }
}
