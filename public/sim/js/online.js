// Online match session (host-authoritative).
// The host's browser runs the physics and every rule exactly as in a local match. Guests send their
// controls to the host and render the host's state a little in the past (70 ms on a good connection, more
// when the network is jittery), interpolating between 30 Hz snapshots. They never simulate anything
// themselves, so they can never disagree with the host.
import { Room, newCode, cleanCode } from './net.js';
import { paintTrifron } from './field.js';

const POSE_HZ = 30, RELAY_POSE_HZ = 5, STATE_HZ = 10, KEYFRAME_S = 1;
const DELAY_MIN = 0.07, DELAY_MAX = 0.3, DELAY_RELAY = 0.45;   // interpolation delay (s); P2P adapts to jitter
const INPUT_HZ = 60, RELAY_INPUT_HZ = 5;
const COLORS = ['red', 'blue', 'gold'];
const r4 = (v) => Math.round(v * 1e4) / 1e4;
const r3 = (v) => Math.round(v * 1e3) / 1e3;
const tq = (b) => { const t = b.translation(), q = b.rotation(); return [r4(t.x), r4(t.y), r4(t.z), r4(q.x), r4(q.y), r4(q.z), r4(q.w)]; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const clock = () => performance.now() / 1000;
const SAVE_KEY = 'hyperdrive.hostRoom';
const loadHostRoom = () => { try { const s = JSON.parse(sessionStorage.getItem(SAVE_KEY)); return s && Date.now() - s.t < 15 * 60 * 1000 ? s : null; } catch { return null; } };
export const hostRoomFor = (code) => { const s = loadHostRoom(); return s && s.code === code ? s : null; };
// keep ?room=CODE in the address bar in step with the room you are actually in (sharing / refreshing it is safe)
function setRoomParam(code) {
  const p = new URLSearchParams(location.search);
  if (code) p.set('room', code); else p.delete('room');
  history.replaceState(null, '', location.pathname + (p.toString() ? `?${p}` : '') + location.hash);
}

export class Online {
  constructor(sim) {
    this.sim = sim;
    this.room = null; this.role = null; this.lobby = null;
    this.listeners = [];
    this.hooks = {};               // set by main.js: begin(mode), restart(), menu(), left(reason), hpAction(a, squad, robotId)
    this.inputs = []; this.applied = [];
    this.resetMirror();
  }
  get active() { return !!this.room; }
  get isHost() { return this.role === 'host'; }
  get isGuest() { return this.role === 'guest'; }
  get me() { return this.room ? this.room.id : null; }
  get inGame() { return !!(this.lobby && this.lobby.phase === 'game'); }
  mySeats() { return this.lobby ? this.lobby.seats.flatMap((id, i) => (id && id === this.me ? [i] : [])) : []; }
  mySquads() { return [...new Set(this.mySeats().map((i) => this.sim.robots[i].squad))]; }
  canAct(squad) { return this.mySquads().includes(squad); }
  hostLink() { const p = this.room && this.room.peers.get(this.room.hostId); return p ? p.state : 'connecting'; }
  onChange(fn) { this.listeners.push(fn); }
  changed() { for (const f of this.listeners) { try { f(this); } catch (e) { console.error(e); } } }

  // ================================================================ rooms
  // restore: a saved room from before this tab was refreshed (same code, same seats, back in the lobby)
  async host(name, restore = null) {
    for (let tries = 0; tries < 3; tries++) {
      const room = new Room({ code: restore && tries === 0 ? restore.code : newCode(), isHost: true, name });
      await room.open();
      await wait(1200);                                  // let presence settle, then make sure the code is ours
      if (room.members().some((m) => m.host && m.id !== room.id)) { await room.close(); continue; }
      const seats = restore && tries === 0 ? restore.seats.map((s) => (s === restore.hostId ? room.id : s)) : [null, null, null, null];
      this.lobby = { code: room.code, mode: restore ? restore.mode : 'match', phase: 'lobby', seats, players: [] };
      this.attach(room, 'host');
      setRoomParam(room.code);
      this.refreshPlayers();
      return room.code;
    }
    throw new Error('Could not create a room. Please try again.');
  }
  async join(codeIn, name) {
    const code = cleanCode(codeIn);
    if (code.length !== 4) throw new Error('Room codes are 4 characters.');
    const room = new Room({ code, isHost: false, name });
    await room.open();
    let host = null;
    for (let t = 0; t < 40 && !host; t++) { host = room.hostId || room.members().find((m) => m.host); if (!host) await wait(150); }
    if (!host) { await room.close(); throw new Error(`No room ${code} found. Check the code with the host.`); }
    this.lobby = { code, mode: 'match', phase: 'lobby', seats: [null, null, null, null], players: [] };
    this.attach(room, 'guest');
    setRoomParam(code);
    return code;
  }
  attach(room, role) {
    this.room = room; this.role = role;
    room.on('msg', (from, m) => this.onMsg(from, m));
    room.on('presence', () => { if (this.isHost) this.refreshPlayers(); else this.changed(); });
    room.on('peer-state', () => { if (this.isHost) this.refreshPlayers(); else this.changed(); });
    room.on('ready', (p) => { if (this.isHost) this.welcome(p.id); else this.changed(); });
    room.on('peer-left', (id) => { if (this.isHost) { this.freeSeats(id); this.refreshPlayers(); } });
    room.on('host-left', () => this.hostLost());
    if (role === 'host') this.wrapHost();
    this.changed();
  }
  async leave(reason = null) {
    if (!this.room) return;
    setRoomParam(null);
    this.stopWaiting();
    if (this.isHost) { try { sessionStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }
    const room = this.room;
    this.unwrapHost();
    this.room = null; this.role = null; this.lobby = null;
    this.resetMirror();
    await room.close();
    if (this.hooks.left) this.hooks.left(reason);
    this.changed();
  }

  hostLost() {
    if (!this.isGuest || this.reconnecting) return;
    this.reconnecting = Date.now();
    if (this.room.hostId) this.room.dropPeer(this.room.hostId);
    this.hiTimer = setInterval(() => this.room.sayHi(), 2000);
    this.giveUp = setTimeout(() => this.leave('The host did not come back, so the room has closed.'), 60000);
    this.changed();
  }
  stopWaiting() { clearInterval(this.hiTimer); clearTimeout(this.giveUp); this.reconnecting = null; }

  // ================================================================ lobby (host is authoritative)
  refreshPlayers() {
    if (!this.isHost) return;
    const mem = this.room.members();
    const players = [{ id: this.me, name: this.room.name, host: true, link: 'host', rtt: 0 }];
    const ids = new Set([...mem.map((m) => m.id), ...this.room.peers.keys()]);
    ids.delete(this.me);
    for (const id of ids) {
      const m = mem.find((x) => x.id === id), p = this.room.peers.get(id);
      const name = (m && m.name) || this.room.names.get(id) || (p && p.name) || 'Driver';
      players.push({ id, name: String(name).slice(0, 24), host: false, link: p ? p.state : 'connecting', rtt: p ? p.rtt : null });
    }
    this.lobby.players = players;
    this.sendLobby();
  }
  sendLobby() {
    if (!this.isHost) return;
    try { sessionStorage.setItem(SAVE_KEY, JSON.stringify({ code: this.lobby.code, seats: this.lobby.seats, mode: this.lobby.mode, hostId: this.me, t: Date.now() })); } catch { /* storage blocked */ }
    this.room.sendAll({ t: 'lobby', l: this.lobby });
    this.changed();
  }
  freeSeats(id) { this.lobby.seats = this.lobby.seats.map((s) => (s === id ? null : s)); }
  setSeat(id, seat, take) {
    const L = this.lobby;
    if (seat < 0 || seat > 3) return;
    const before = L.seats[seat];
    if (take && !L.seats[seat]) L.seats[seat] = id;
    else if (!take && L.seats[seat] === id) L.seats[seat] = null;
    if (L.seats[seat] !== before && this.inputs) { this.inputs[seat] = null; this.applied[seat] = null; }
    this.sendLobby();
  }
  // local player's seat requests (host applies directly, guests ask the host)
  takeSeat(seat) { if (this.isHost) this.setSeat(this.me, seat, true); else this.room.send(this.room.hostId, { t: 'seat', i: seat, take: true }); }
  leaveSeat(seat) { if (this.isHost) this.setSeat(this.me, seat, false); else this.room.send(this.room.hostId, { t: 'seat', i: seat, take: false }); }
  setMode(mode) { if (!this.isHost) return; this.lobby.mode = mode === 'practice' ? 'practice' : 'match'; this.sendLobby(); }
  // a guest that connects (or reconnects) gets the lobby, and the match if one is running
  welcome(id) {
    this.refreshPlayers();
    if (this.inGame) {
      this.room.send(id, { t: 'begin', mode: this.lobby.mode, e: this.epoch });
      this.room.send(id, this.lastState || this.stateMsg());
      this.room.send(id, this.pose(true));
    }
  }

  // ================================================================ match control (host)
  startMatch() {
    if (!this.isHost) return;
    this.lobby.phase = 'game';
    this.sendLobby();
    this.newEpoch();
    this.room.sendAll({ t: 'begin', mode: this.lobby.mode, e: this.epoch });
    this.hooks.begin(this.lobby.mode);
    this.forceKey = true; this.lastState = null; this.lastStateStr = null;
  }
  restartMatch() {
    if (!this.isHost) return;
    this.newEpoch();
    this.room.sendAll({ t: 'restart', e: this.epoch });
    this.hooks.restart();
    this.forceKey = true; this.lastState = null; this.lastStateStr = null;
  }
  newEpoch() { this.epoch = (this.epoch || 0) + 1; this.inputs = []; this.applied = []; this.sentCores = new Map(); }
  backToLobby() {
    if (!this.isHost) return;
    this.newEpoch();
    this.lobby.phase = 'lobby';
    this.sendLobby();
    this.room.sendAll({ t: 'menu' });
    this.hooks.menu();
  }

  // ================================================================ messages
  onMsg(from, m) {
    if (this.isHost) {
      const seats = this.lobby.seats;
      if (m.t === 'seat') this.setSeat(from, Number(m.i), !!m.take);
      else if (m.t === 'in' && Array.isArray(m.s)) {
        for (const e of m.s) {
          const i = e[0];
          if (seats[i] !== from) continue;              // only the seat's owner may drive it
          if (m.e !== this.epoch) continue;               // sent before the latest start / restart
          if (this.inputs[i] && this.inputs[i].n > m.n) continue;
          this.inputs[i] = { n: m.n, at: clock(), th: clamp(e[1]), tu: clamp(e[2]), ar: clamp(e[3]), g: e[4] | 0, c: e[5] | 0 };
        }
      } else if (m.t === 'bye') this.room.dropPeer(from);
      else if (m.t === 'hp') {
        const squad = m.sq === 'blue' ? 'blue' : 'red';
        if (!seats.some((id, i) => id === from && this.sim.robots[i].squad === squad)) return;
        this.actor = from;
        try { this.hooks.hpAction(m.a, squad, m.r); } finally { this.actor = null; }
      }
      return;
    }
    // ---- guest
    if (m.t === 'lobby') {
      const wasGame = this.lobby && this.lobby.phase === 'game';
      const back = !!this.reconnecting;
      this.stopWaiting();
      this.lobby = m.l;
      // the host came back after a refresh: the old match is gone, everyone returns to the lobby
      if (wasGame && m.l.phase === 'lobby') { this.resetMirror(); this.hooks.menu(); }
      void back;
      this.changed();
    }
    else if (m.t === 'begin') { this.resetMirror(); this.epoch = m.e; this.lobby.phase = 'game'; this.lobby.mode = m.mode; this.hooks.begin(m.mode); }
    else if (m.t === 'restart') { this.resetMirror(); this.epoch = m.e; this.hooks.restart(); }
    else if (m.t === 'menu') { this.resetMirror(); if (this.lobby) this.lobby.phase = 'lobby'; this.hooks.menu(); }
    else if (m.t === 'p') this.onPose(m);
    else if (m.t === 's') this.applyState(m);
    else if (m.t === 'ev') this.onEvent(m);
    else if (m.t === 'bye') this.leave('The host closed the room.');
  }
  onEvent(m) {
    const { sim } = this;
    if (m.k === 'sig') sim.game.signal(m.type, m.data);
    else if (m.k === 'snd' && typeof sim.audio[m.m] === 'function') sim.audio[m.m](...(m.a || []));
    else if (m.k === 'toast' && sim.hud) sim.hud.toast(m.text, m.kind || '');
  }

  // host: game signals, sounds and hints are forwarded to the guests
  wrapHost() {
    const { sim } = this;
    const audio = sim.audio;
    this.audioOrig = { beep: audio.beep, buzzer: audio.buzzer };
    for (const k of ['beep', 'buzzer']) {
      const orig = this.audioOrig[k];
      audio[k] = (...a) => { orig.apply(audio, a); if (this.inGame) this.room.sendAll({ t: 'ev', k: 'snd', m: k, a }); };
    }
    if (!this.sigHooked) {
      this.sigHooked = true;
      sim.game.onSignal((type, data) => { if (this.isHost && this.inGame) { this.flushState(); this.room.sendAll({ t: 'ev', k: 'sig', type, data }); } });
    }
  }
  unwrapHost() { if (this.audioOrig) { Object.assign(this.sim.audio, this.audioOrig); this.audioOrig = null; } }
  // a Human Player action requested by a guest: its feedback goes back to that guest
  routeHint(text) {
    if (!this.isHost || !this.actor) return false;
    this.room.send(this.actor, { t: 'ev', k: 'toast', text });
    return true;
  }

  // ================================================================ host: inputs + snapshots
  // remote seat -> robot command (zero if its driver went quiet)
  applyRemote(r) {
    const i = r.id, inp = this.inputs[i];
    if (!inp || clock() - inp.at > 1.5) { r.cmd = { throttle: 0, turn: 0, arm: 0 }; return; }
    const a = this.applied[i] || (this.applied[i] = { g: inp.g, c: inp.c });
    if (r.enabled) {
      r.cmd = { throttle: inp.th, turn: inp.tu, arm: inp.ar };
      this.actor = this.lobby.seats[i];
      try { for (; a.g < inp.g; a.g++) r.toggleGrip(); } finally { this.actor = null; }
      for (; a.c < inp.c; a.c++) r.cargoAction();
    } else { r.cmd = { throttle: 0, turn: 0, arm: 0 }; a.g = inp.g; a.c = inp.c; }
  }
  hostFrame() {
    if (!this.isHost || !this.inGame) return;
    const now = clock();
    if (this.forceKey || now - (this.lastKey || 0) >= KEYFRAME_S) {
      this.forceKey = false; this.lastKey = now; this.lastPose = now;
      const k = this.pose(true);
      this.room.sendAll(k, true);
      this.lastRelayPose = now;
    } else if (now - (this.lastPose || 0) >= 1 / POSE_HZ) {
      this.lastPose = now;
      const msg = this.pose(false);
      for (const p of this.room.peers.values()) if (p.state === 'p2p') this.room.send(p.id, msg, false);
      if (now - (this.lastRelayPose || 0) >= 1 / RELAY_POSE_HZ) { this.lastRelayPose = now; this.room.relayAll(msg, false); }
    }
    if (now - (this.lastStateCheck || 0) >= 1 / STATE_HZ) { this.lastStateCheck = now; this.flushState(); }
  }
  flushState() {
    const s = this.stateMsg(), str = JSON.stringify(s);
    if (str === this.lastStateStr) return;
    this.lastStateStr = str; this.lastState = s;
    this.room.sendAll(s);
  }
  pose(key) {
    const { sim } = this, g = sim.game;
    const T = r3(clock());
    const R = sim.robots.map((r) => { const v = r.body.linvel(); return [...tq(r.body), r4(r.theta), r4(r.finger), r3(r.tray), ...r.wheels.map((w) => r3(w.spin)), r3(v.x), r3(v.z)]; });
    const S = ['red', 'blue'].map((s) => { const st = sim.field.stations[s]; return [st.deckBody, ...st.ramps.map((x) => x.body)].flatMap(tq); });
    const P = g.payloads.map((p) => (p.body ? tq(p.body) : 0));
    const C = [];
    this.sentCores = this.sentCores || new Map();
    for (const c of g.cores) {
      const v = tq(c.body), last = this.sentCores.get(c.id);
      const moved = !last || v.some((x, j) => Math.abs(x - last.v[j]) > 2e-4);
      if (moved) this.sentCores.set(c.id, { v, t: T });
      if (key || moved || T - last.t < 0.5) C.push([c.id, COLORS.indexOf(c.color), c.owner === 'blue' ? 1 : 0, ...v]);
    }
    return { t: 'p', T, k: key ? 1 : 0, gt: r3(g.time), R, S, P, C };
  }
  stateMsg() {
    const { sim } = this, g = sim.game, F = sim.field;
    return {
      t: 's',
      g: { st: g.state, mode: g.mode, map: g.starMap, hp: [g.hp.red.cores, g.hp.blue.cores], sb: g.starburst, sc: g.score, fin: g.final },
      F: g.feed.slice(0, 8),
      R: sim.robots.map((r) => [r.enabled ? 1 : 0, r.gripClosed ? 1 : 0, r.heldCore ? r.heldCore.id : 0, r.payloadJoint ? 1 : 0, r.stationState, r.stationSquad, r.zone || null, r.number]),
      P: g.payloads.map((p) => [p.where, p.scored ? 1 : 0, p.number]),
      V: [F.vaults.red.open ? 1 : 0, F.vaults.blue.open ? 1 : 0],
    };
  }

  // ================================================================ guest: inputs
  queueInput(slot, c, blocked) {
    const q = this.outIn || (this.outIn = { n: 0, seats: {} });
    const e = q.seats[slot] || (q.seats[slot] = { g: 0, c: 0 });
    if (blocked) { e.th = 0; e.tu = 0; e.ar = 0; return; }
    e.th = r3(c.throttle); e.tu = r3(c.turn); e.ar = r3(c.arm);
    if (c.grip) e.g++;
    if (c.cargo) e.c++;
  }
  sendInputs() {
    if (!this.isGuest || !this.inGame || !this.outIn) return;
    const q = this.outIn, mine = this.mySeats();
    const s = mine.filter((i) => q.seats[i]).map((i) => { const e = q.seats[i]; return [i, e.th || 0, e.tu || 0, e.ar || 0, e.g, e.c]; });
    if (!s.length) return;
    const key = JSON.stringify(s), now = clock();
    const relay = this.hostLink() !== 'p2p';
    const minGap = 1 / (relay ? RELAY_INPUT_HZ : INPUT_HZ);
    const changed = key !== this.lastInKey;
    if (now - (this.lastInSent || 0) < minGap) return;
    if (!changed && now - (this.lastInSent || 0) < (relay ? 1 : 0.25)) return;   // heartbeat when idle
    const presses = s.map((e) => e[4] + e[5]).join(), pressed = presses !== this.lastPresses;
    this.lastInKey = key; this.lastInSent = now; this.lastPresses = presses;
    // edge counts (grip / cargo) only ever grow, so even a lost packet never loses a press
    this.room.send(this.room.hostId, { t: 'in', e: this.epoch, n: ++q.n, s }, pressed);
  }
  requestHp(a, squad, rid) { this.room.send(this.room.hostId, { t: 'hp', a, sq: squad, r: rid }); }

  // ================================================================ guest: mirroring the host
  resetMirror() {
    this.buf = { R: [[], [], [], []], S: [[], [], [], [], [], []], P: [[], [], [], []] };
    this.cores = new Map();          // host core id -> { core, list }
    this.offsets = [];
    this.gt = 0; this.lastPoseT = 0;
    this.feedObjs = new Map();
    this.outIn = null; this.lastInKey = null;
  }
  // a fresh, empty copy of the field before the host's state arrives
  guestReset() {
    const { sim } = this, g = sim.game;
    for (const r of sim.robots) { r.payloadJoint = null; r.heldCore = null; r.coreJoint = null; }
    g.reset({ guest: true });
    this.resetMirror();
  }
  onPose(m) {
    const now = clock();
    this.offsets.push([now, now - m.T]);
    while (this.offsets.length > 2 && now - this.offsets[0][0] > 4) this.offsets.shift();
    if (m.T >= (this.lastPoseT || 0)) { this.lastPoseT = m.T; this.gt = m.gt; }
    const push = (list, v) => {
      if (list.length && m.T <= list[list.length - 1].T) { if (list.some((s) => s.T === m.T)) return; list.push({ T: m.T, v }); list.sort((a, b) => a.T - b.T); }
      else list.push({ T: m.T, v });
      while (list.length > 40) list.shift();
    };
    m.R.forEach((v, i) => push(this.buf.R[i], v));
    m.S.forEach((v, i) => { for (let j = 0; j < 3; j++) push(this.buf.S[i * 3 + j], v.slice(j * 7, j * 7 + 7)); });
    m.P.forEach((v, i) => push(this.buf.P[i], v));
    const g = this.sim.game;
    if (m.k) {   // keyframe: the complete list of COREs
      const ids = new Set(m.C.map((e) => e[0]));
      for (const [id, e] of this.cores) if (!ids.has(id)) { this.removeCore(e.core); this.cores.delete(id); }
    }
    for (const e of m.C) {
      let rec = this.cores.get(e[0]);
      if (!rec) {
        const core = g.addCore(COLORS[e[1]] || 'red', e[2] ? 'blue' : 'red', { x: e[3], y: e[4], z: e[5] });
        rec = { core, list: [] }; this.cores.set(e[0], rec);
      }
      push(rec.list, e.slice(3));
    }
  }
  removeCore(core) {
    const g = this.sim.game;
    this.sim.unregisterBody(core.body); core.destroy();
    g.cores = g.cores.filter((c) => c !== core);
  }
  renderTime() {
    if (!this.offsets.length) return 0;
    const ds = this.offsets.map(([, d]) => d).sort((a, b) => a - b);
    const off = ds[0];
    // render far enough behind to cover the snapshot interval plus the jitter seen over the last few seconds
    const jitter = ds[Math.floor(ds.length * 0.95)] - off;
    const delay = this.hostLink() === 'p2p' ? Math.max(DELAY_MIN, Math.min(DELAY_MAX, 1.3 / POSE_HZ + jitter)) : DELAY_RELAY;
    return clock() - off - delay;
  }
  guestFrame() {
    if (!this.isGuest || !this.inGame || !this.offsets.length) return;
    const { sim } = this, g = sim.game, rt = this.renderTime();
    g.time = this.gt;
    sim.robots.forEach((r, i) => {
      const v = sample(this.buf.R[i], rt); if (!v) return;
      setTQ(r.body, v);
      r.body.setLinvel({ x: v[14], y: 0, z: v[15] }, false);
      r.theta = v[7]; r.finger = v[8]; r.tray = v[9];
      r.wheels.forEach((w, j) => { w.spin = v[10 + j]; });
    });
    ['red', 'blue'].forEach((s, i) => {
      const st = sim.field.stations[s];
      [st.deckBody, ...st.ramps.map((x) => x.body)].forEach((b, j) => { const v = sample(this.buf.S[i * 3 + j], rt); if (v) setTQ(b, v); });
    });
    g.payloads.forEach((p, i) => {
      const v = sample(this.buf.P[i], rt);
      if (!v) { if (p.body) { p.removeBody(); p.mesh.visible = false; } return; }
      if (!p.body) p.spawn({ x: v[0], y: v[1], z: v[2] }, { x: v[3], y: v[4], z: v[5], w: v[6] });
      setTQ(p.body, v);
    });
    for (const { core, list } of this.cores.values()) { const v = sample(list, rt); if (v) setTQ(core.body, v); }
    sim.world.updateSceneQueries();       // drop guides ray-cast against the mirrored scene
  }
  applyState(m) {
    const { sim } = this, g = sim.game, F = sim.field;
    const s = m.g;
    g.state = s.st; g.mode = s.mode; g.score = s.sc; g.final = s.fin;
    g.starburst = s.sb;
    g.hp = { red: { cores: s.hp[0] }, blue: { cores: s.hp[1] } };
    F.hpRacks.red.setCount(s.hp[0]); F.hpRacks.blue.setCount(s.hp[1]);
    if (g.starMap.join('') !== s.map.join('')) { g.starMap = s.map; paintTrifron(F, s.map); }
    g.updateLeds();
    ['red', 'blue'].forEach((sq, i) => { if (F.vaults[sq].open !== !!m.V[i]) F.vaults[sq].setOpen(!!m.V[i]); });
    // feed entries keep their identity so the HUD shows each one once
    g.feed = m.F.map((f) => { let o = this.feedObjs.get(f.id); if (!o) { o = f; this.feedObjs.set(f.id, o); } return o; });
    sim.robots.forEach((r, i) => {
      const e = m.R[i];
      r.enabled = !!e[0]; r.gripClosed = !!e[1];
      const held = e[2] ? this.cores.get(e[2]) : null;
      r.heldCore = held ? held.core : null;
      r.payloadJoint = e[3] ? true : null;
      r.stationState = e[4]; r.stationSquad = e[5]; r.zone = e[6] || {};
      if (e[7] && e[7] !== r.number) r.setNumber(e[7]);
    });
    g.payloads.forEach((p, i) => { const e = m.P[i]; p.where = e[0]; p.scored = !!e[1]; if (e[2] && e[2] !== p.number) p.setNumber(e[2]); });
  }
}

// ---------------------------------------------------------------- interpolation helpers
function clamp(v) { v = Number(v) || 0; return Math.max(-1, Math.min(1, v)); }
function sample(list, t) {
  if (!list || !list.length) return null;
  const n = list.length;
  if (t >= list[n - 1].T) return list[n - 1].v || null;
  if (t <= list[0].T) return list[0].v || null;
  let i = n - 2;
  while (i > 0 && list[i].T > t) i--;
  const a = list[i], b = list[i + 1];
  if (!a.v || !b.v) return (t - a.T < b.T - t ? a.v : b.v) || null;
  return lerpState(a.v, b.v, (t - a.T) / (b.T - a.T));
}
// [x, y, z, qx, qy, qz, qw, ...linear extras]
function lerpState(a, b, f) {
  const out = a.slice();
  for (let j = 0; j < 3; j++) out[j] = a[j] + (b[j] - a[j]) * f;
  const sgn = a[3] * b[3] + a[4] * b[4] + a[5] * b[5] + a[6] * b[6] < 0 ? -1 : 1;
  let n = 0;
  for (let j = 3; j < 7; j++) { out[j] = a[j] + (sgn * b[j] - a[j]) * f; n += out[j] * out[j]; }
  n = Math.sqrt(n) || 1;
  for (let j = 3; j < 7; j++) out[j] /= n;
  for (let j = 7; j < a.length; j++) out[j] = a[j] + (b[j] - a[j]) * f;
  return out;
}
function setTQ(body, v) {
  body.setTranslation({ x: v[0], y: v[1], z: v[2] }, false);
  body.setRotation({ x: v[3], y: v[4], z: v[5], w: v[6] }, false);
}
