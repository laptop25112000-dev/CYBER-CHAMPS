import { icon, hydrateIcons } from './icons.js';
import { fmtTime } from './game.js';
import { KEYMAP, HP_KEYS, KEY_LABEL, SOLO_KEYS, ACTIONS } from './input.js';
import { MATCH, POINTS, RP, ROBOT } from './config.js';
import { Settings, isTouch } from './settings.js';
import { Account } from './account.js';
import { warmUpRTC } from './net.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const frag = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const SQ = { red: 'Red', blue: 'Blue' };
const kb = (code) => `<kbd>${esc(KEY_LABEL(code))}</kbd>`;
const initials = (n) => (String(n || '?').trim()[0] || '?').toUpperCase();
const fmtDate = (d) => new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
const ago = (d) => {
  const s = (Date.now() - new Date(d).getTime()) / 1000;
  if (s < 60) return 'just now'; if (s < 3600) return `${Math.floor(s / 60)} min ago`; if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return fmtDate(d);
};
function driveLabel(i) {
  const k = KEYMAP[i];
  if (k.fwd[0].startsWith('Arrow')) return ['↑', '←', '↓', '→'].map((c) => `<kbd>${c}</kbd>`).join('');
  if (k.fwd[0].startsWith('Numpad')) return `<span class="kgrp">Num</span>${[k.fwd[0], k.left[0], k.back[0], k.right[0]].map((c) => `<kbd>${c.slice(-1)}</kbd>`).join('')}`;
  return [k.fwd[0], k.left[0], k.back[0], k.right[0]].map(kb).join('');
}

export class UI {
  constructor(sim, ctx) {
    this.sim = sim; this.ctx = ctx;
    this.view = 'menu';
    this.modals = [];
    this.feedShown = new WeakSet();
    this.cards = [];
    this.lastFinal = null;
    hydrateIcons();
    this.buildMenu();
    this.buildHud();
    if (isTouch) this.buildTouch();
    const onAccount = () => {
      this.renderAccount();
      const uid = Account.signedIn ? Account.user.id : null;
      if (uid && uid !== this._settingsFor) { // first load for this account: adopt its saved settings
        this._settingsFor = uid;
        const s = Account.profile.settings;
        if (s && Object.keys(s).length) { Settings.replace(s); this.ctx.applyTeams(); } else Settings.persist(true);
      }
      if (!uid) this._settingsFor = null;
      if (uid && this.lastFinal && this.lastFinal.pendingSave && !this.lastFinal.saved && !this.lastFinal.saving) this.saveLastMatch();
      if (Account.recovery && !this._recoveryShown) { this._recoveryShown = true; this.openSetPassword(); }
      if (Account.recoveryError) { this.toast(Account.recoveryError); Account.recoveryError = null; }
    };
    Account.onChange(onAccount);
    onAccount();
    sim.net.onChange(() => { this.renderOnline(); this.renderAccount(); this.renderReconnect(); });
    Settings.syncFn = (data) => Account.saveSettings(data);
    sim.game.onSignal((type, data) => this.onSignal(type, data));
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' && this.modals.length) { e.preventDefault(); this.sim.input.pressed.delete('Escape'); this.closeTop(); }
    });
    window.addEventListener('pointerdown', (e) => { if (this.dd && !this.dd.contains(e.target)) this.closeDropdown(); }, true);
  }

  // ================================================================ MENU
  buildMenu() {
    $('#menu').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const a = b.dataset.act;
      if (a === 'play') this.openLocalSetup('match');
      else if (a === 'online') this.openOnline();
      else if (a === 'practice') this.openLocalSetup('practice');
      else if (a === 'learn') this.ctx.startTutorial();
      else if (a === 'howto') this.openHowTo();
      else if (a === 'leaderboard') this.openLeaderboard();
      else if (a === 'settings') this.openSettings();
      else if (a === 'signin') this.openAuth('signin');
      else if (a === 'signup') this.openAuth('signup');
      else if (a === 'profile') this.openProfile();
      else if (a === 'privacy') this.openPrivacy();
    });
    this.renderAccount();
  }

  renderAccount() {
    const top = $('#menu-user'), line = $('#menu-account');
    const net = this.sim.net;
    // the online mode button doubles as the way back into an open room
    const ob = $('[data-act="online"] small');
    if (ob) ob.textContent = net.active ? `In room ${net.lobby?.code || ''} · open the lobby` : 'Every driver on their own laptop';
    if (!Account.available) {
      top.innerHTML = '';
      line.innerHTML = `${icon('globe')}<span>Offline: accounts and online play need an internet connection.</span>`;
      return;
    }
    if (Account.signedIn) {
      const p = Account.profile, st = Account.stats || { matches: 0, best: 0 };
      top.innerHTML = `<button class="user-chip" id="user-chip" aria-label="Account: ${esc(p.display_name)}"><span class="avatar">${esc(initials(p.display_name))}</span><span class="uname">${esc(p.display_name)}</span>${icon('chevron')}</button>`;
      $('#user-chip').addEventListener('click', (e) => this.openUserMenu(e.currentTarget));
      line.innerHTML = `<span>Signed in as <b>${esc(p.display_name)}</b></span><span class="sep">·</span><span>${st.matches} match${st.matches === 1 ? '' : 'es'}</span><span class="sep">·</span><span>best ${st.best}</span>`;
    } else {
      top.innerHTML = '<button class="btn sm" data-act="signin">Sign in</button>';
      line.innerHTML = '<button class="lnk" data-act="signup">Create a free account</button> or <button class="lnk" data-act="signin">sign in</button> to save matches and join the leaderboard.';
    }
  }

  openUserMenu(anchor) {
    this.dropdown(anchor, [
      { icon: 'user', label: 'Profile & history', fn: () => this.openProfile() },
      { icon: 'trophy', label: 'Leaderboard', fn: () => this.openLeaderboard() },
      { icon: 'sliders', label: 'Settings', fn: () => this.openSettings() },
      '-',
      { icon: 'logout', label: 'Sign out', fn: async () => { await Account.signOut(); this.toast('Signed out', 'ok'); } },
    ], 'right');
  }

  // ================================================================ DROPDOWN
  dropdown(anchor, items, align = 'left', header) {
    this.closeDropdown();
    const r = anchor.getBoundingClientRect();
    const dd = frag(`<div class="dropdown">${header ? `<div class="dd-h">${esc(header)}</div>` : ''}${items.map((it, i) => (it === '-' ? '<hr>' : `<button data-i="${i}" class="${it.on ? 'on' : ''}">${it.icon ? icon(it.icon) : ''}${esc(it.label)}${it.on ? `<span style="margin-left:auto">${icon('check')}</span>` : ''}</button>`)).join('')}</div>`);
    document.body.appendChild(dd);
    const w = dd.offsetWidth;
    dd.style.top = `${r.bottom + 8}px`;
    dd.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, align === 'right' ? r.right - w : r.left))}px`;
    dd.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; const it = items[Number(b.dataset.i)]; this.closeDropdown(); it.fn(); });
    this.dd = dd;
  }
  closeDropdown() { if (this.dd) { this.dd.remove(); this.dd = null; } }

  // ================================================================ HUD
  buildHud() {
    const { sim } = this;
    $('#btn-pause').addEventListener('click', () => this.openPause());
    $('#net-pill').addEventListener('click', () => this.openPause());
    $('#btn-cam').addEventListener('click', (e) => {
      const cams = this.ctx.cameras();
      this.dropdown(e.currentTarget, cams.map((c, i) => ({ icon: i >= cams.length - 4 ? 'target' : 'video', label: c, on: i === this.ctx.cameraIndex(), fn: () => this.ctx.setCamera(i) })), 'right', 'Camera · C');
    });
    const sb = $('#scorebar');
    const toggleDetails = () => { this.detailsPinned = !this.detailsPinned; sb.setAttribute('aria-expanded', String(this.detailsPinned)); this.showDetails(this.detailsPinned); };
    sb.addEventListener('click', toggleDetails);
    sb.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDetails(); } });
    for (const s of ['red', 'blue']) {
      const hk = HP_KEYS[s];
      const robots = sim.robots.filter((r) => r.squad === s);
      const hp = $(`#hp-${s}`);
      // Human Player: four icon buttons (key in the corner, details in the tooltip)
      // Human Player: labelled buttons (key in the corner, details in the tooltip)
      hp.innerHTML = `<button class="hp-btn" data-a="core" title="Human Player: place a CORE in the Source Zone">${icon('core')}<span class="cap">CORE <b data-k="left"></b></span>${kb(hk.core)}</button>
        ${robots.map((r, j) => `<button class="hp-btn" data-a="pl" data-r="${r.id}" title="Human Player: load or place ${esc(r.name)}'s Payload">${icon('box')}<span class="cap">PAYLOAD ${r.name.split(' ')[1]}</span><i class="st" data-k="pl${r.id}"></i>${kb(hk.payload[j])}</button>`).join('')}
        <button class="hp-btn sbt" data-a="sb" title="Human Player: press the STARBURST button">${icon('star')}<span class="cap">STARBURST</span>${kb(hk.starburst)}</button>`;
      $$('kbd', hp).forEach((k) => { k.dataset.orig = k.textContent; });
      hp.addEventListener('click', (e) => {
        const b = e.target.closest('[data-a]'); if (!b) return;
        if (b.dataset.a === 'core') this.ctx.hp('core', s);
        if (b.dataset.a === 'pl') this.ctx.hp('pl', s, Number(b.dataset.r));
        if (b.dataset.a === 'sb') this.ctx.hp('sb', s);
        b.blur();
      });
      const rc = $(`#rc-${s}`);
      for (const r of robots) {
        const card = frag(`<div class="rc ${r.squad}">
          <div class="rc-top"><b>${esc(r.name)}</b><span class="num" data-k="num"></span><span class="rc-st" data-k="tags"></span></div>
          <div class="rc-arm" title="Arm angle · marks: Star Pole and High Pole clearance"><div class="gauge"><i data-k="arm"></i><span class="mk" style="left:${this.armPct(29)}%"></span><span class="mk" style="left:${this.armPct(46)}%"></span></div><em data-k="deg"></em></div>
        </div>`);
        rc.appendChild(card);
        this.cards[r.id] = card;
      }
    }
  }
  toggleHud(force) { const h = $('#hud'); h.classList.toggle('off', force !== undefined ? !force : !h.classList.contains('off')); }
  armPct(deg) { return ((deg - ROBOT.armMin) / (ROBOT.armMax - ROBOT.armMin)) * 100; }

  setView(v) {
    this.view = v;
    $('#menu').classList.toggle('hidden', v !== 'menu');
    $('#hud').classList.toggle('hidden', v !== 'game');
    if (v === 'menu') { this.renderAccount(); $('#feed').innerHTML = ''; $('#banner').innerHTML = ''; }
    this.update();
  }

  showDetails(on) {
    const d = $('#details');
    if (!on) { d.classList.add('hidden'); return; }
    const S = this.sim.game.score;
    const rows = [
      [`High Pole`, 'high', POINTS.core.high], ['Star Pole', 'star', POINTS.core.star], ['Apex Pole', 'apex', POINTS.core.apex], ['Drop Zone', 'drop', POINTS.core.drop],
      ['Golden · Star Pole', 'gStar', POINTS.golden.star], ['Golden · Drop Zone', 'gDrop', POINTS.golden.drop], ['Star Maps', 'starMaps', POINTS.starBonus],
    ];
    d.innerHTML = `<table class="bd-table"><tr><th>Live score</th><th class="r red">Red</th><th class="r blue">Blue</th></tr>
      ${rows.map(([n, k, p]) => `<tr><td>${n}<small>×${p}</small></td><td class="r n">${S.red[k]}</td><td class="r n">${S.blue[k]}</td></tr>`).join('')}
      <tr><td>Payload bonus<small>both teams</small></td><td class="r n">${S.red.payloads}/2</td><td class="r n">${S.blue.payloads}/2</td></tr>
      <tr><td>Space Station</td><td class="r n">${S.red.station}</td><td class="r n">${S.blue.station}</td></tr>
      <tr><td>Foul points received</td><td class="r n">${S.red.foulPts}</td><td class="r n">${S.blue.foulPts}</td></tr>
      <tr class="tot"><td>Total</td><td class="r n">${S.red.total}</td><td class="r n">${S.blue.total}</td></tr></table>`;
    d.classList.remove('hidden');
  }

  update() {
    const { sim } = this;
    const g = sim.game, S = g.score;
    if (this.view !== 'game') return;
    // scoreboard
    for (const s of ['red', 'blue']) {
      const sc = S[s], sb = g.starburst[s];
      $(`#score-${s}`).textContent = sc.total;
      const thr = sc.payloadScored ? MATCH.starburstThreshold - MATCH.payloadReduction : MATCH.starburstThreshold;
      $(`#sbt-${s}`).classList.toggle('burst', sb.active);
      $(`#prog-${s}`).style.width = `${Math.min(100, (sc.squadCores / MATCH.starburstThreshold) * 100)}%`;
      $(`#sbt-${s}`).title = sb.active ? `${SQ[s]} STARBURST active` : `${SQ[s]}: ${sc.squadCores} / ${MATCH.starburstThreshold} COREs to STARBURST${sc.payloadScored ? ` (button at ${thr})` : ''}`;
      $(`#hp-${s} [data-k="left"]`).textContent = g.hp[s].cores;
      for (const r of sim.robots.filter((x) => x.squad === s)) {
        const p = g.payloads[r.id], dot = $(`#hp-${s} [data-k="pl${r.id}"]`);
        dot.className = 'st' + (p.where === 'cargo' ? ' bay' : p.scored ? ' on' : '');
        dot.title = p.where === 'hp' ? 'With Human Player' : p.where === 'cargo' ? 'In Cargo Bay' : p.scored ? 'Scored' : 'On field';
      }
      const btn = $(`#hp-${s} .sbt`);
      btn.classList.toggle('lit', sb.active);
      btn.classList.toggle('ready', !sb.active && sc.payloadScored && sc.squadCores >= thr && g.state === 'running');
    }
    const practice = g.mode === 'practice';
    $('#clock').textContent = practice ? '∞' : fmtTime(Math.ceil(g.remaining - 1e-6));
    const ph = $('#phase');
    ph.textContent = practice ? 'Practice' : g.state === 'pre' ? 'Pre-match' : g.state === 'paused' ? 'Paused' : g.state === 'post' ? 'Match over' : g.state === 'final' ? 'Final' : g.isLevelUp() ? 'Level up' : 'Core scoring';
    ph.className = practice ? 'practice' : g.isLevelUp() && g.state === 'running' ? 'levelup' : '';
    $('#scorebar').classList.toggle('levelup', !practice && g.isLevelUp() && g.state === 'running');
    const map = g.starMap.join('');
    if (this._map !== map) {
      this._map = map;
      $('#starmap').innerHTML = g.starMap.map((k) => `<i class="${k}"></i>`).join('');
      $('#starmap').title = `STAR MAP (top to bottom): ${g.starMap.map((k) => (k === 'G' ? 'Golden' : 'Squad')).join(', ')}`;
    }
    // center card
    this.renderCenter();
    // online: only your own robots' cards and your squad's Human Player bar
    const online = this.ctx.isOnline(), net = sim.net;
    const mine = online ? net.mySeats() : this.ctx.localSeats(), squads = [...new Set(mine.map((i) => sim.robots[i].squad))];
    for (const s of ['red', 'blue']) {
      $(`#dock-${s}`).classList.toggle('hidden', !squads.includes(s));
      const oneRow = squads.length === 1;
      $$(`#hp-${s} kbd`).forEach((k, j) => { const want = oneRow ? String(j + 1) : k.dataset.orig; if (k.textContent !== want) k.textContent = want; });
    }
    this.renderNetPill(online);
    // robot cards
    const pads = sim.input.pads();
    sim.robots.forEach((r, i) => {
      const c = this.cards[r.id]; if (!c) return;
      c.classList.toggle('hidden', !mine.includes(r.id));
      const set = (k, html) => { const e = $(`[data-k="${k}"]`, c); if (e._h !== html) { e.innerHTML = html; e._h = html; } };
      set('num', `#${esc(r.number)}`);
      const deg = (r.theta * 180) / Math.PI;
      const armEl = $('[data-k="arm"]', c); armEl.style.width = `${Math.max(0, Math.min(100, this.armPct(deg)))}%`;
      set('deg', `${Math.round(deg)}°`);
      const tags = [];
      const held = r.heldCore;
      if (held) tags.push(['<i class="ring"></i>', `hold-${held.golden ? 'gold' : held.color}`]);
      if (r.payloadJoint) tags.push([icon('box'), 'gold']);
      const z = r.zone || {};
      if (r.stationState !== 'none') {
        // parking aid: how far the deck is from level (BALANCE needs it within ±2.5°)
        const tilt = r.stationState === 'engage' ? '' : ` ${Math.abs(sim.field.stations[r.stationSquad].tilt() * 180 / Math.PI).toFixed(0)}°`;
        tags.push([(r.stationState === 'engage' ? 'Engage' : r.stationState === 'dock' ? 'Dock' : 'Balance') + tilt, r.stationSquad !== r.squad ? 'bad' : 'ok']);
      }
      else if (z.oppSource || z.oppVault) tags.push([z.oppSource ? 'Opp. zone' : 'Opp. vault', 'bad']);
      set('tags', tags.map(([h, cls]) => `<span class="chip ${cls}">${h}</span>`).join(''));
    });
    // feed
    for (const f of g.feed.slice(0, 3).reverse()) {
      if (this.feedShown.has(f)) continue;
      this.feedShown.add(f);
      const el = frag(`<div class="fi ${f.squad || ''} ${f.kind}"><i class="bul"></i><span class="t">${esc(f.t)}</span><span>${esc(f.text)}</span></div>`);
      const feed = $('#feed');
      feed.prepend(el);
      while (feed.children.length > 3) feed.lastElementChild.remove();
      setTimeout(() => el.classList.add('out'), f.kind === 'foul' ? 7000 : 5200);
      setTimeout(() => el.remove(), f.kind === 'foul' ? 7700 : 5900);
    }
    if (this.touch) this.updateTouch();
    if (this.tutorial) this.coachTick();
  }

  renderCenter() {
    const g = this.sim.game, c = $('#center');
    const online = this.ctx.isOnline(), net = this.sim.net;
    const want = g.state === 'pre' && !this.tutorial ? `pre-${g.mode}-${g.starMap.join('')}-${online ? net.role + net.mySeats().join('') : `local${Settings.get('drivers')}`}` : '';
    if (this._center === want) return;
    this._center = want;
    if (!want) { c.innerHTML = ''; return; }
    const practice = g.mode === 'practice';
    if (online) {
      const seats = net.mySeats().map((i) => this.sim.robots[i].name);
      const you = seats.length ? `You drive <b>${esc(seats.join(' and '))}</b>.` : 'You are watching this match.';
      const keys = net.mySeats().length === 1 ? ` ${kb('KeyW')}${kb('KeyA')}${kb('KeyS')}${kb('KeyD')} or arrows · ${kb('KeyQ')}${kb('KeyE')} arm · ${kb('KeyR')} grip · ${kb('KeyF')} cargo` : '';
      c.innerHTML = net.isHost ? `<div class="card center-card">
          <h2>${practice ? 'Online practice' : 'Ready for the match?'}</h2>
          <p>${you} Everyone sees the robots staged. Start when your drivers are ready.</p>
          <div class="starmap"><span class="lbl">STAR MAP</span>${g.starMap.map((k) => `<i class="sm-pill ${k}"></i>`).join('')}</div>
          <button class="btn primary lg block" id="btn-go">${icon('play')}${practice ? 'Start practice' : 'Start match'} for everyone</button>
          <div class="hint">${keys || `or press ${kb('Space')}`}</div></div>`
        : `<div class="card center-card">
          <h2>Waiting for the host</h2>
          <p>${you} The host starts the ${practice ? 'practice' : 'match'} for everyone.</p>
          <div class="starmap"><span class="lbl">STAR MAP</span>${g.starMap.map((k) => `<i class="sm-pill ${k}"></i>`).join('')}</div>
          <div class="hint">${keys || `${kb('C')} camera · ${kb('H')} controls`}</div></div>`;
      const go = $('#btn-go'); if (go) go.addEventListener('click', () => this.ctx.toggleStart());
      return;
    }
    c.innerHTML = `<div class="card center-card">
      <h2>${practice ? 'Practice mode' : 'Ready for the match?'}</h2>
      <p>${practice ? 'No clock, live scoring. Try anything: the Vault opens once you hit the STARBURST threshold.' : 'Robots are staged in their start zones. 2:30 on the clock, LEVEL UP in the final 30 seconds.'}</p>
      <div class="keys-mini">${this.ctx.localSeats().map((i) => { const r = this.sim.robots[i]; return `<div class="${r.squad}"><i></i>${esc(r.name)}<span>${this.ctx.localSeats().length === 1 ? `${kb('KeyW')}${kb('KeyA')}${kb('KeyS')}${kb('KeyD')}<span class="kgrp" style="margin:0 2px">or</span>${driveLabel(2)}` : driveLabel(i)}</span></div>`; }).join('')}</div>
      ${window.innerWidth < 600 && !isTouch ? '<div class="warn-note" style="margin:0 0 14px;text-align:left">This window is phone-sized. HYPERDRIVE plays best on a laptop or desktop with a keyboard; on a phone or tablet, touch controls appear automatically.</div>' : ''}
      <button class="btn primary lg block" id="btn-go">${icon('play')}${practice ? 'Start practice' : 'Start match'}</button>
      <div class="hint">or press ${kb('Space')} · ${kb('H')} controls · ${kb('C')} camera · ${kb('V')} hide HUD</div></div>`;
    $('#btn-go').addEventListener('click', () => this.sim.game.start());
  }

  onSignal(type, data) {
    const b = $('#banner');
    const show = (text, sub, cls) => { b.innerHTML = `<div class="bn ${cls}">${esc(text)}<small>${esc(sub)}</small></div>`; };
    if (type === 'start') show(this.sim.game.mode === 'practice' ? 'PRACTICE' : 'GO!', this.sim.game.mode === 'practice' ? 'no clock — drive freely' : '2:30 on the clock', 'gold');
    if (type === 'levelup') show('LEVEL UP', 'final 30 seconds · space station & apex', 'gold');
    if (type === 'starburst') show(`${data.squad.toUpperCase()} STARBURST`, data.how === 'button' ? 'activated by the human player · vault open' : '10 cores scored · vault open', data.squad);
    if (type === 'end') show('MATCH OVER', 'robots disabled', '');
    if (type === 'final') { this.lastFinal = { final: data, starMap: [...this.sim.game.starMap], saved: false }; setTimeout(() => this.showResults(), 600); }
  }

  // ================================================================ MODALS
  modal({ title, width = 560, body, footer = '', tabs = null, onClose, cls = '' }) {
    this.closeDropdown();
    const root = $('#modal-root');
    const el = frag(`<div class="scrim"><div class="modal ${cls}" style="--w:${width}px" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="modal-h"><h2>${esc(title)}</h2><button class="x" aria-label="Close">${icon('x')}</button></div>
      ${tabs ? `<div class="tabs" role="tablist">${tabs.map((t, i) => `<button role="tab" aria-selected="${i === 0}" data-tab="${i}" class="${i === 0 ? 'on' : ''}">${esc(t.label)}</button>`).join('')}</div>` : ''}
      <div class="modal-b"></div>${footer ? `<div class="modal-f">${footer}</div>` : ''}</div></div>`);
    const m = { el, body: $('.modal-b', el), onClose, close: () => this.closeModal(m), prevFocus: document.activeElement };
    const render = (content) => { m.body.innerHTML = ''; if (typeof content === 'string') m.body.innerHTML = content; else if (content) m.body.appendChild(content); };
    if (tabs) {
      const show = (i) => { $$('.tabs button', el).forEach((b, j) => { b.classList.toggle('on', i === j); b.setAttribute('aria-selected', String(i === j)); }); render(typeof tabs[i].body === 'function' ? tabs[i].body(m) : tabs[i].body); };
      $$('.tabs button', el).forEach((b) => b.addEventListener('click', () => show(Number(b.dataset.tab))));
      m.showTab = show;
      show(0);
    } else render(typeof body === 'function' ? body(m) : body);
    $('.x', el).addEventListener('click', () => m.close());
    el.addEventListener('pointerdown', (e) => { if (e.target === el) m.close(); });
    // keyboard: Tab cycles inside the dialog only
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = $$('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])', $('.modal', el)).filter((x) => !x.disabled && x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!$('.modal', el).contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    });
    root.appendChild(el);
    this.modals.push(m);
    this.syncInert();
    this.ctx.onModal(true);
    // move focus into the dialog (forms focus their own first field)
    setTimeout(() => {
      if (el.isConnected && !el.contains(document.activeElement)) ($('.modal-b input, .modal-b select, .modal-b button, .modal-f button, .tabs button', el) || $('.x', el)).focus();
    }, 60);
    return m;
  }
  // everything behind the top dialog is inert (no focus, no clicks, hidden from assistive tech)
  syncInert() {
    const open = this.modals.length > 0;
    for (const id of ['menu', 'hud', 'view']) { const e = document.getElementById(id); if (e) e.inert = open; }
    this.modals.forEach((x, i) => { x.el.inert = i < this.modals.length - 1; });
  }
  closeModal(m) {
    const i = this.modals.indexOf(m); if (i < 0) return;
    this.modals.splice(i, 1);
    m.el.remove();
    this.syncInert();
    if (m.onClose) m.onClose();
    if (!this.modals.length) this.ctx.onModal(false);
    // give focus back to whatever opened the dialog
    if (m.prevFocus && m.prevFocus.isConnected && typeof m.prevFocus.focus === 'function') m.prevFocus.focus();
  }
  closeTop() { const m = this.modals[this.modals.length - 1]; if (m) m.close(); }
  closeAll() { [...this.modals].forEach((m) => m.close()); }

  // ---------------------------------------------------------------- pause
  openPause() {
    if (this.modals.some((m) => m.kind === 'pause')) return;
    if (this.ctx.isOnline()) { this.openOnlinePause(); return; }
    const m = this.modal({
      title: 'Paused', width: 380,
      body: `<div class="form">
        <button class="btn primary lg block" data-p="resume">${icon('play')}Resume</button>
        <button class="btn block" data-p="restart">${icon('refresh')}Restart match</button>
        <button class="btn block" data-p="settings">${icon('sliders')}Settings</button>
        <button class="btn block" data-p="help">${icon('book')}How to play</button>
        <button class="btn ghost block" data-p="menu">${icon('home')}Quit to main menu</button></div>`,
    });
    m.kind = 'pause';
    m.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-p]'); if (!b) return;
      const a = b.dataset.p;
      if (a === 'resume') m.close();
      if (a === 'restart') this.confirmAction({ title: 'Restart the match?', text: 'The clock, score and field reset. This match is lost.', ok: 'Restart', fn: () => { this.closeAll(); this.ctx.restart(); } });
      if (a === 'settings') this.openSettings();
      if (a === 'help') this.openHowTo();
      if (a === 'menu') this.confirmAction({ title: 'Leave this match?', text: 'The match ends and you go back to the main menu.', ok: 'Quit to menu', fn: () => { this.closeAll(); this.ctx.toMenu(); } });
    });
  }

  // ---------------------------------------------------------------- how to play
  openHowTo() {
    const robots = this.sim.robots;
    const keysTab = `<table class="keys"><tr><th>Robot</th><th>Drive</th><th>Arm ↓ / ↑</th><th>Gripper</th><th>Cargo</th></tr>
      ${robots.map((r, i) => { const k = KEYMAP[i]; return `<tr class="${r.squad}"><td>${esc(r.name)}</td><td>${driveLabel(i)}</td><td>${kb(k.armDown[0])}${kb(k.armUp[0])}</td><td>${kb(k.grip[0])}</td><td>${kb(k.cargo[0])}</td></tr>`; }).join('')}</table>
      <h4>Human players</h4>
      <table class="keys"><tr><th>Squad</th><th>Place CORE</th><th>Payload robot 1 / 2</th><th>STARBURST</th></tr>
      ${['red', 'blue'].map((s) => { const k = HP_KEYS[s]; return `<tr class="${s}"><td>${SQ[s]}</td><td>${kb(k.core)}</td><td>${kb(k.payload[0])}${kb(k.payload[1])}</td><td>${kb(k.starburst)}</td></tr>`; }).join('')}</table>
      <h4>Everything else</h4>
      <p>${kb('Space')} start / pause · ${kb('Esc')} menu · ${kb('C')} camera (driver stations, audience, top-down, chase) · ${kb('V')} hide the HUD · hold ${kb('Tab')} score breakdown · ${kb('H')} this guide. Tap a drive key to creep at 30 %; hold it for full power.</p>
      <p>${icon('globe')} <b>Online</b> with one robot per laptop: ${kb('KeyW')}${kb('KeyA')}${kb('KeyS')}${kb('KeyD')} or the arrow keys drive, ${kb('KeyQ')}${kb('KeyE')} arm, ${kb('KeyR')} gripper, ${kb('KeyF')} cargo, ${kb('Digit1')}–${kb('Digit4')} Human Player. Any connected gamepad works.</p>
      <p>${icon('gamepad')} Gamepads: left stick drive, right stick turn, triggers or bumpers move the arm, <b>A</b> gripper, <b>B</b> cargo bay, <b>X</b> place CORE, <b>Y</b> payload, <b>Start</b> pause. Four drivers on one keyboard will hit key-rollover limits, so plug in pads for full matches.</p>`;
    const gameTab = `<ol class="steps">
      <li><b>Grab a CORE.</b> Open the gripper, lower the arm all the way, drive so the ring sits between the fingers and close the gripper. You can only control your own colour.</li>
      <li><b>Score it on a pole.</b> Raise the arm past the yellow marker on the arm gauge (Star Pole ≈ 29°, High Pole ≈ 46°). Let the pole slide into the slot in the front of the chassis, follow the white drop guide and open the gripper.</li>
      <li><b>Deliver your Payload.</b> Drive into your Source Zone and have the Human Player load it into your Cargo Bay. Back into your Drop Zone and dump it.</li>
      <li><b>Trigger STARBURST.</b> 10 COREs activates it automatically. With a Payload scored, the Human Player can press the button at 4 COREs. Your Vault opens: pull GOLDEN COREs from the bottom.</li>
      <li><b>Build the STAR MAP</b> on your Star Poles, matching the pattern top → bottom, for a 10-point bonus.</li>
      <li><b>LEVEL UP</b> in the final 30 s: Engage, Dock or Balance on your own Space Station.</li></ol>`;
    const P = POINTS;
    const scoreTab = `<div class="pts">
      <div class="pt"><b>${P.core.high}</b><span>CORE on a High Pole</span></div><div class="pt"><b>${P.core.star}</b><span>CORE on a Star Pole</span></div>
      <div class="pt"><b>${P.core.apex}</b><span>CORE on an Apex Pole (Level Up)</span></div><div class="pt"><b>${P.core.drop}</b><span>CORE in the Drop Zone</span></div>
      <div class="pt"><b>${P.golden.star}</b><span>GOLDEN CORE on a Star Pole</span></div><div class="pt"><b>${P.golden.drop}</b><span>GOLDEN CORE in the Drop Zone</span></div>
      <div class="pt"><b>${P.starBonus}</b><span>Completed STAR MAP</span></div><div class="pt"><b>${P.payloadBonus}</b><span>Both teams' Payloads scored</span></div>
      <div class="pt"><b>${P.station.engage}/${P.station.dock}/${P.station.balance}</b><span>Engage / Dock / Balance</span></div>
      <div class="pt"><b>+${P.minorFoul}/+${P.majorFoul}</b><span>Minor / Major foul to the opponent</span></div></div>
      <h4>Ranking points</h4><p>Win ${RP.win} · Tie ${RP.tie} · ${RP.starburstCores}+ COREs 1 · ${RP.patternPoints}+ Star Pole points 1 · ${RP.levelUpPoints}+ endgame points 1.</p>
      <h4>Fouls detected automatically</h4><p>G4.5 de-scoring · G4.9 pinning over 3 s · G4.12 docking on the opponent station · G4.17 opponent Source Zone · G4.18 Vault Zone contact · G4.19 opponent Payload contact.</p>`;
    this.modal({ title: 'How to play', width: 720, tabs: [{ label: 'Controls', body: keysTab }, { label: 'Gameplay', body: gameTab }, { label: 'Scoring', body: scoreTab }] });
  }

  // ---------------------------------------------------------------- settings
  openSettings() {
    const tog = (k, label, sub) => `<div class="set-row"><div class="l"><b id="set-${k}-l">${label}</b><span id="set-${k}-d">${sub}</span></div><label class="toggle"><input type="checkbox" role="switch" data-set="${k}" aria-labelledby="set-${k}-l" aria-describedby="set-${k}-d" ${Settings.get(k) ? 'checked' : ''}><i></i></label></div>`;
    const general = () => {
      const el = frag(`<div>
        ${tog('sound', 'Sound effects', 'Buzzers, Level Up and Starburst cues')}
        ${tog('labels', 'Robot name tags', 'Floating labels above each robot')}
        ${tog('guides', 'Drop guides', 'White line showing where a held CORE will land')}
        <div class="set-row"><div class="l"><b>Graphics</b><span>Performance mode lowers shadows and resolution</span></div>
          <div class="seg" role="group" aria-label="Graphics"><button data-q="high" aria-pressed="${Settings.get('quality') === 'high'}" class="${Settings.get('quality') === 'high' ? 'on' : ''}">Quality</button><button data-q="low" aria-pressed="${Settings.get('quality') === 'low'}" class="${Settings.get('quality') === 'low' ? 'on' : ''}">Performance</button></div></div>
      </div>`);
      $$('[data-set]', el).forEach((i) => i.addEventListener('change', () => Settings.set(i.dataset.set, i.checked)));
      $$('[data-q]', el).forEach((b) => b.addEventListener('click', () => { Settings.set('quality', b.dataset.q); $$('[data-q]', el).forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); }); }));
      return el;
    };
    const controls = () => {
      const pads = Settings.get('pads');
      const conn = this.sim.input.pads();
      const el = frag(`<div>
        <p>Gamepads add to the keyboard controls. Press any button on a pad so the browser detects it.</p>
        ${this.sim.robots.map((r, i) => `<div class="set-row"><div class="l"><b>${esc(r.name)}</b><span>${driveLabel(i)}</span></div>
          <select class="field-sel" style="width:170px" data-pad="${i}" aria-label="${esc(r.name)} gamepad"><option value="-1">Keyboard only</option>${[0, 1, 2, 3].map((p) => `<option value="${p}" ${pads[i] === p ? 'selected' : ''}>Gamepad ${p + 1}${conn[p] && conn[p].connected ? ' ●' : ''}</option>`).join('')}</select></div>`).join('')}
        ${tog('tank', 'Tank drive on gamepads', 'Left stick drives the left side, right stick the right side')}
      </div>`);
      $$('[data-pad]', el).forEach((s) => s.addEventListener('change', () => { const p = [...Settings.get('pads')]; p[Number(s.dataset.pad)] = Number(s.value); Settings.set('pads', p); }));
      $$('[data-set]', el).forEach((i) => i.addEventListener('change', () => Settings.set(i.dataset.set, i.checked)));
      return el;
    };
    const teams = () => {
      const t = Settings.get('teams');
      const el = frag(`<div><p>Team numbers appear on each robot's number plate, its name tag and its Payload.</p>
        ${this.sim.robots.map((r, i) => `<div class="set-row"><div class="l"><b>${esc(r.name)}</b><span>${SQ[r.squad]} squad</span></div><input class="field-in" style="width:120px" data-team="${i}" value="${esc(t[i])}" maxlength="6" inputmode="numeric" aria-label="${esc(r.name)} team number"></div>`).join('')}</div>`);
      $$('[data-team]', el).forEach((inp) => inp.addEventListener('change', () => {
        const v = inp.value.replace(/\D/g, '').slice(0, 6); const tt = [...Settings.get('teams')]; if (v) tt[Number(inp.dataset.team)] = v; inp.value = tt[Number(inp.dataset.team)];
        Settings.set('teams', tt); this.ctx.applyTeams();
      }));
      return el;
    };
    // keyboard rebinding: pick a driver layout, click a key, press the new key
    const keyboard = () => {
      let slot = this._kbSlot || 'solo';
      const el = frag('<div><p>Click a key, then press the key you want. Esc cancels. A key already used by the same driver swaps places.</p><div class="seg" role="group" aria-label="Driver layout" data-slots style="flex-wrap:wrap;margin-bottom:12px"></div><div data-rows></div><div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn sm ghost" data-reset>Reset this layout</button></div></div>');
      const slots = [['solo', 'One driver'], ...this.sim.robots.map((r, i) => [String(i), r.name])];
      const keysOf = (s) => (s === 'solo' ? SOLO_KEYS : KEYMAP[Number(s)]);
      const draw = () => {
        $('[data-slots]', el).innerHTML = slots.map(([s, n]) => `<button data-slot="${s}" aria-pressed="${s === slot}" class="${s === slot ? 'on' : ''}">${esc(n)}</button>`).join('');
        const k = keysOf(slot);
        $('[data-rows]', el).innerHTML = ACTIONS.map(([a, n]) => `<div class="set-row"><div class="l"><b id="kb-${a}">${n}</b></div><button class="btn sm keybtn" data-act-key="${a}" aria-labelledby="kb-${a}" aria-describedby="kb-${a}-v"><span id="kb-${a}-v">${k[a].map((c) => esc(KEY_LABEL(c))).join(' / ')}</span></button></div>`).join('');
      };
      draw();
      el.addEventListener('click', (e) => {
        const s = e.target.closest('[data-slot]');
        if (s) { slot = this._kbSlot = s.dataset.slot; draw(); return; }
        if (e.target.closest('[data-reset]')) { const all = { ...(Settings.get('keys') || {}) }; delete all[slot]; Settings.set('keys', all); draw(); return; }
        const b = e.target.closest('[data-act-key]'); if (!b) return;
        const action = b.dataset.actKey;
        b.classList.add('listening'); b.querySelector('span').textContent = 'Press a key…';
        const onKey = (ev) => {
          ev.preventDefault(); ev.stopPropagation();
          window.removeEventListener('keydown', onKey, true);
          b.classList.remove('listening');
          if (ev.code === 'Escape' || !/^[A-Za-z0-9]{2,20}$/.test(ev.code)) { draw(); return; }
          const all = JSON.parse(JSON.stringify(Settings.get('keys') || {}));
          const cur = keysOf(slot), mine = all[slot] || (all[slot] = {});
          // swap with an action of this driver that already uses the key
          const clash = ACTIONS.map(([x]) => x).find((x) => x !== action && cur[x].includes(ev.code));
          if (clash) mine[clash] = cur[action][0];
          mine[action] = ev.code;
          Settings.set('keys', all);
          draw();
          b.focus();
        };
        window.addEventListener('keydown', onKey, true);
      });
      return el;
    };
    this.modal({ title: 'Settings', width: 580, tabs: [{ label: 'General', body: general }, { label: 'Controls', body: controls }, { label: 'Keyboard', body: keyboard }, { label: 'Teams', body: teams }], footer: `<span style="margin-right:auto;color:var(--faint);font-size:12.5px;align-self:center">${Account.signedIn ? `${icon('check')} Synced to your account` : 'Saved on this device'}</span><button class="btn" data-close>Done</button>` });
    $('#modal-root .scrim:last-child [data-close]').addEventListener('click', () => this.closeTop());
  }

  // ---------------------------------------------------------------- auth
  openAuth(mode = 'signin') {
    if (!Account.available) { this.toast('Accounts need an internet connection.'); return; }
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // show one error in the form: announced (role=alert), tied to the field (aria-describedby) and focused
    const fail = (form, input, text) => {
      const msg = $('.msg', form);
      const id = `${form.dataset.f}-err`;
      msg.innerHTML = `<div class="form-err" role="alert" id="${id}">${esc(text)}</div>`;
      $$('[aria-invalid]', form).forEach((i) => { i.removeAttribute('aria-invalid'); i.setAttribute('aria-describedby', i.dataset.help || ''); });
      if (input) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', `${id} ${input.dataset.help || ''}`.trim()); input.focus(); }
    };
    const signin = (m) => {
      const el = frag(`<form class="form" data-f="si" novalidate>
        <p>Welcome back. Sign in to save matches and sync your settings.</p>
        <div class="fld"><label for="si-email">Email</label><input id="si-email" type="email" autocomplete="email" required></div>
        <div class="fld"><label for="si-pass">Password</label><input id="si-pass" type="password" autocomplete="current-password" required>
          <div class="help"><button type="button" class="lnk" data-forgot>Forgot your password?</button></div></div>
        <div class="msg"></div>
        <button class="btn primary lg block" type="submit">Sign in</button>
        <div class="switchline">New here? <button type="button" data-sw>Create an account</button></div></form>`);
      $('[data-sw]', el).addEventListener('click', () => m.showTab(1));
      $('[data-forgot]', el).addEventListener('click', () => this.openResetPassword($('#si-email', el).value.trim()));
      el.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = $('#si-email', el), pass = $('#si-pass', el), btn = $('button[type=submit]', el);
        if (!email.value.trim()) return fail(el, email, 'Enter the email you signed up with.');
        if (!EMAIL_RE.test(email.value.trim())) return fail(el, email, 'That email address does not look right.');
        if (!pass.value) return fail(el, pass, 'Enter your password.');
        btn.disabled = true; btn.textContent = 'Signing in…'; $('.msg', el).innerHTML = '';
        try {
          await Account.signIn({ email: email.value.trim(), password: pass.value });
          m.close(); this.toast(`Signed in as ${Account.profile?.display_name || 'driver'}`, 'ok');
        } catch (err) { btn.disabled = false; btn.textContent = 'Sign in'; fail(el, /password/i.test(err.message) ? pass : email, err.message); }
      });
      setTimeout(() => $('#si-email', el)?.focus(), 50);
      return el;
    };
    const signup = (m) => {
      const el = frag(`<form class="form" data-f="su" novalidate>
        <p>Free account: keep your match history, sync settings and get on the global leaderboard. <button type="button" class="lnk" data-privacy>What we store</button></p>
        <div class="fld"><label for="su-user">Username</label><input id="su-user" autocomplete="username" maxlength="20" placeholder="e.g. hexa_driver" aria-describedby="su-user-help" data-help="su-user-help"><div class="help" id="su-user-help" aria-live="polite">3–20 letters, numbers or underscores. Shown on the leaderboard.</div></div>
        <div class="fld"><label for="su-name">Display name <span style="color:var(--faint);font-weight:500">(optional)</span></label><input id="su-name" maxlength="32" placeholder="Your name or team"></div>
        <div class="fld"><label for="su-email">Email</label><input id="su-email" type="email" autocomplete="email"></div>
        <div class="fld"><label for="su-pass">Password</label><input id="su-pass" type="password" autocomplete="new-password" minlength="8" aria-describedby="su-pass-help" data-help="su-pass-help"><div class="help" id="su-pass-help">At least 8 characters.</div></div>
        <div class="msg"></div>
        <button class="btn primary lg block" type="submit">Create account</button>
        <div class="switchline">Already have one? <button type="button" data-sw>Sign in</button></div></form>`);
      $('[data-sw]', el).addEventListener('click', () => m.showTab(0));
      $('[data-privacy]', el).addEventListener('click', () => this.openPrivacy());
      const uIn = $('#su-user', el), uHelp = $('#su-user-help', el);
      let t = 0;
      uIn.addEventListener('input', () => {
        clearTimeout(t);
        const v = uIn.value.trim();
        if (!v) { uHelp.className = 'help'; uHelp.textContent = '3–20 letters, numbers or underscores. Shown on the leaderboard.'; return; }
        if (!/^[A-Za-z0-9_]{3,20}$/.test(v)) { uHelp.className = 'help bad'; uHelp.textContent = 'Use 3–20 letters, numbers or underscores.'; return; }
        uHelp.className = 'help'; uHelp.textContent = 'Checking…';
        t = setTimeout(async () => {
          try { const ok = await Account.usernameAvailable(v); if (uIn.value.trim() !== v) return; uHelp.className = `help ${ok ? 'ok' : 'bad'}`; uHelp.textContent = ok ? `✓ ${v} is available` : 'That username is taken.'; } catch { uHelp.textContent = ''; }
        }, 350);
      });
      el.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = $('button[type=submit]', el), email = $('#su-email', el), pass = $('#su-pass', el);
        if (!/^[A-Za-z0-9_]{3,20}$/.test(uIn.value.trim())) return fail(el, uIn, 'Pick a username: 3–20 letters, numbers or underscores.');
        if (!EMAIL_RE.test(email.value.trim())) return fail(el, email, 'Enter a valid email address.');
        if (pass.value.length < 8) return fail(el, pass, 'Your password needs at least 8 characters.');
        btn.disabled = true; btn.textContent = 'Creating account…'; $('.msg', el).innerHTML = '';
        try {
          const r = await Account.signUp({ username: uIn.value.trim(), displayName: $('#su-name', el).value.trim(), email: email.value.trim(), password: pass.value });
          if (r.needsConfirmation) { $('.msg', el).innerHTML = '<div class="form-ok" role="status">Check your inbox to confirm your email, then sign in.</div>'; btn.textContent = 'Create account'; btn.disabled = false; return; }
          m.close(); this.toast(`Welcome to HYPERDRIVE, ${Account.profile?.display_name}!`, 'ok');
        } catch (err) {
          btn.disabled = false; btn.textContent = 'Create account';
          const field = /username/i.test(err.message) ? uIn : /password/i.test(err.message) ? pass : email;
          fail(el, field, err.message);
        }
      });
      setTimeout(() => uIn.focus(), 50);
      return el;
    };
    const m = this.modal({ title: 'Your HYPERDRIVE account', width: 440, tabs: [{ label: 'Sign in', body: signin }, { label: 'Create account', body: signup }] });
    if (mode === 'signup') m.showTab(1);
  }

  openResetPassword(prefill = '') {
    const m = this.modal({
      title: 'Reset your password', width: 420,
      body: `<form class="form" novalidate>
        <p>Enter your account's email and we'll send a link to set a new password.</p>
        <div class="fld"><label for="rp-email">Email</label><input id="rp-email" type="email" autocomplete="email" value="${esc(prefill)}"></div>
        <div class="msg"></div>
        <button class="btn primary lg block" type="submit">Send reset link</button></form>`,
    });
    const form = $('form', m.body), email = $('#rp-email', form), msg = $('.msg', form), btn = $('button[type=submit]', form);
    setTimeout(() => email.focus(), 50);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { msg.innerHTML = '<div class="form-err" role="alert" id="rp-err">Enter a valid email address.</div>'; email.setAttribute('aria-invalid', 'true'); email.setAttribute('aria-describedby', 'rp-err'); email.focus(); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      try { await Account.resetPassword(email.value.trim()); msg.innerHTML = '<div class="form-ok" role="status">If an account uses that email, a reset link is on its way. Open it on this device.</div>'; btn.textContent = 'Sent'; }
      catch (err) { msg.innerHTML = `<div class="form-err" role="alert">${esc(err.message)}</div>`; btn.disabled = false; btn.textContent = 'Send reset link'; }
    });
  }

  // opened after following a reset link (Account.recovery)
  openSetPassword() {
    const m = this.modal({
      title: 'Set a new password', width: 420,
      body: `<form class="form" novalidate>
        <div class="fld"><label for="np-pass">New password</label><input id="np-pass" type="password" autocomplete="new-password" aria-describedby="np-help"><div class="help" id="np-help">At least 8 characters.</div></div>
        <div class="msg"></div>
        <button class="btn primary lg block" type="submit">Save password</button></form>`,
    });
    const form = $('form', m.body), pass = $('#np-pass', form), msg = $('.msg', form), btn = $('button[type=submit]', form);
    setTimeout(() => pass.focus(), 50);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (pass.value.length < 8) { msg.innerHTML = '<div class="form-err" role="alert" id="np-err">Your password needs at least 8 characters.</div>'; pass.setAttribute('aria-invalid', 'true'); pass.setAttribute('aria-describedby', 'np-err np-help'); pass.focus(); return; }
      btn.disabled = true; btn.textContent = 'Saving…';
      try { await Account.updatePassword(pass.value); m.close(); this.toast('Password updated. You are signed in.', 'ok'); }
      catch (err) { msg.innerHTML = `<div class="form-err" role="alert">${esc(err.message)}</div>`; btn.disabled = false; btn.textContent = 'Save password'; }
    });
  }

  openPrivacy() {
    const m = this.modal({
      title: 'Privacy & your data', width: 560,
      body: `<h4>What an account stores</h4>
        <p>Your email and password (handled by Supabase Auth, passwords are never visible to us), your username and display name, your settings (team numbers, controls, graphics) and the results of full matches you finish while signed in.</p>
        <h4>Who sees what</h4>
        <p>The leaderboard shows your username, display name and best squad score. Nothing else is public. Data is stored with Supabase and is only used to run HYPERDRIVE.</p>
        <h4>Online play</h4>
        <p>Rooms share the name you type with the people in that room. Game traffic goes directly between the players' browsers, with a Supabase relay as a fallback. Nothing from a room is stored.</p>
        <h4>Deleting your data</h4>
        <p>${Account.signedIn ? 'You can delete your account at any time. Your profile, settings and match history are removed permanently.' : 'Signed-in players can delete their account from here or from their profile; everything tied to it is removed permanently.'}</p>`,
      footer: Account.signedIn ? `<button class="btn danger" data-del>${icon('x')}Delete my account</button><button class="btn" data-close>Done</button>` : '<button class="btn" data-close>Done</button>',
    });
    $('[data-close]', m.el).addEventListener('click', () => m.close());
    const del = $('[data-del]', m.el);
    if (del) del.addEventListener('click', () => this.confirmAction({
      title: 'Delete your account?', text: 'This permanently removes your profile, settings and every saved match. It cannot be undone.', ok: 'Delete permanently', danger: true,
      fn: async () => { try { await Account.deleteAccount(); this.closeAll(); this.toast('Your account and its data were deleted.', 'ok'); } catch (err) { this.toast(err.message); } },
    }));
  }

  // small confirmation dialog for destructive actions
  confirmAction({ title, text, ok = 'Confirm', danger = false, fn }) {
    const m = this.modal({ title, width: 400, body: `<p>${esc(text)}</p>`, footer: `<button class="btn ghost" data-no>Cancel</button><button class="btn ${danger ? 'danger' : 'primary'}" data-yes>${esc(ok)}</button>` });
    $('[data-no]', m.el).addEventListener('click', () => m.close());
    $('[data-yes]', m.el).addEventListener('click', () => { m.close(); fn(); });
    setTimeout(() => $('[data-no]', m.el)?.focus(), 30);
    return m;
  }

  // ---------------------------------------------------------------- profile
  openProfile() {
    if (!Account.signedIn) { this.openAuth('signin'); return; }
    const p = Account.profile, st = Account.stats || { matches: 0, best: 0, avg: 0, star_maps: 0 };
    const m = this.modal({
      title: 'Profile', width: 600,
      body: `<div class="prof-head"><div class="avatar lg">${esc(initials(p.display_name))}</div><div><b>${esc(p.display_name)}</b><span>@${esc(p.username)} · member since ${fmtDate(p.created_at)}</span></div></div>
        <div class="stat-grid"><div class="stat"><strong>${st.matches}</strong><span>Matches</span></div><div class="stat"><strong>${st.best}</strong><span>Best squad score</span></div><div class="stat"><strong>${st.avg}</strong><span>Average score</span></div><div class="stat"><strong>${st.star_maps}</strong><span>Star maps built</span></div></div>
        <h4>Display name</h4>
        <form class="form" id="pf-form" style="grid-template-columns:1fr auto;align-items:end"><div class="fld"><input id="pf-name" value="${esc(p.display_name)}" maxlength="32"></div><button class="btn" type="submit" style="height:44px">Save</button></form>
        <h4>Recent matches</h4><div id="pf-matches"><div class="spinner"></div></div>`,
      footer: `<button class="btn ghost" data-privacy style="margin-right:auto">Privacy & data</button><button class="btn danger" data-out>${icon('logout')}Sign out</button><button class="btn" data-lb>${icon('trophy')}Leaderboard</button>`,
    });
    $('#pf-form', m.el).addEventListener('submit', async (e) => {
      e.preventDefault();
      try { await Account.updateProfile({ displayName: $('#pf-name', m.el).value }); this.toast('Display name saved', 'ok'); } catch (err) { this.toast(err.message); }
    });
    $('[data-out]', m.el).addEventListener('click', async () => { await Account.signOut(); m.close(); this.toast('Signed out', 'ok'); });
    $('[data-lb]', m.el).addEventListener('click', () => { m.close(); this.openLeaderboard(); });
    $('[data-privacy]', m.el).addEventListener('click', () => this.openPrivacy());
    Account.recentMatches(12).then((rows) => {
      const box = $('#pf-matches', m.el); if (!box) return;
      box.innerHTML = rows.length ? `<div class="list">${rows.map((r) => `<div class="li"><div><span class="sq ${r.winner === 'tie' ? '' : r.winner}">${r.winner === 'tie' ? 'TIE' : `${r.winner.toUpperCase()} WIN`}</span> <small style="margin-left:8px">${ago(r.created_at)} · map ${r.star_map.split('').map((k) => (k === 'G' ? 'G' : 'C')).join('')}</small></div><div class="sc"><span class="r">${r.red_score}</span> – <span class="b">${r.blue_score}</span></div></div>`).join('')}</div>`
        : '<div class="empty">No matches yet. Finish a full 2:30 match and it will appear here.</div>';
    }).catch((err) => { const box = $('#pf-matches', m.el); if (box) box.innerHTML = `<div class="empty">${esc(err.message)}</div>`; });
  }

  // ---------------------------------------------------------------- leaderboard
  openLeaderboard() {
    const m = this.modal({ title: 'Global leaderboard', width: 560, body: `<p>Best squad score from a full 2:30 match, one entry per driver.</p><div id="lb"><div class="spinner"></div></div>` });
    Account.leaderboard(25).then((rows) => {
      const box = $('#lb', m.el); if (!box) return;
      const me = Account.profile?.username;
      box.innerHTML = rows.length ? `<div class="list">${rows.map((r) => `<div class="lb-row ${r.username === me ? 'me' : ''}"><div class="lb-rank">${r.rank}</div><div class="lb-name"><b>${esc(r.display_name)}</b><small>@${esc(r.username)} · ${r.matches} match${r.matches === 1 ? '' : 'es'}</small></div><span class="sq ${r.squad}">${r.squad.toUpperCase()}</span><div class="lb-score">${r.best_score}</div></div>`).join('')}</div>`
        : `<div class="empty">No scores yet. Be the first on the board.</div>`;
    }).catch((err) => { const box = $('#lb', m.el); if (box) box.innerHTML = `<div class="empty">${esc(err.message)}</div>`; });
  }

  // ---------------------------------------------------------------- results
  async saveLastMatch() {
    const L = this.lastFinal; if (!L || L.saved || L.saving || !Account.signedIn) return;
    L.saving = true; this.renderSaveNote();
    try { await Account.saveMatch(L.final, L.starMap); L.saved = true; this.toast('Match saved to your profile', 'ok'); } catch (err) { this.toast(`Could not save: ${err.message}`); }
    L.saving = false;
    this.renderSaveNote();
  }
  renderSaveNote() {
    const n = $('#save-note'); if (!n || !this.lastFinal) return;
    const L = this.lastFinal;
    if (L.saved) { n.className = 'save-note ok'; n.innerHTML = `${icon('check')}Saved to your profile and the leaderboard.`; }
    else if (Account.signedIn && L.saving) { n.className = 'save-note'; n.innerHTML = '<div class="spinner" style="margin:0;width:16px;height:16px"></div>Saving…'; }
    else if (Account.signedIn) { n.className = 'save-note'; n.innerHTML = `<span style="flex:1">This result has not been saved.</span><button class="btn sm" data-retry>Retry</button>`; $('[data-retry]', n).addEventListener('click', () => this.saveLastMatch()); }
    else { n.className = 'save-note'; n.innerHTML = `${icon('user')}<span style="flex:1">Sign in to save this result and appear on the leaderboard.</span><button class="btn sm" data-save>Sign in to save</button>`; $('[data-save]', n).addEventListener('click', () => { L.pendingSave = true; this.openAuth('signup'); }); }
  }
  showResults() {
    const L = this.lastFinal; if (!L) return;
    const F = L.final, P = POINTS;
    const win = F.red.total > F.blue.total ? 'red' : F.blue.total > F.red.total ? 'blue' : 'tie';
    const row = (label, f) => `<tr><td>${label}</td><td class="r n">${f(F.red)}</td><td class="r n">${f(F.blue)}</td></tr>`;
    const m = this.modal({
      title: 'Match result', width: 640,
      body: `<div class="res-hero">
          <div class="res-side red"><div class="s">${F.red.total}</div><div class="n">RED SQUAD</div><span class="rp">${F.red.rpTotal} RP</span></div>
          <div class="res-vs"><div class="w ${win}">${win === 'tie' ? 'TIE' : `${win.toUpperCase()} WINS`}</div><small>FINAL</small></div>
          <div class="res-side blue"><div class="s">${F.blue.total}</div><div class="n">BLUE SQUAD</div><span class="rp">${F.blue.rpTotal} RP</span></div></div>
        <table class="bd-table"><tr><th>Breakdown</th><th class="r red">Red</th><th class="r blue">Blue</th></tr>
          ${row(`COREs on poles`, (s) => s.high * P.core.high + s.star * P.core.star + s.apex * P.core.apex)}
          ${row('COREs in Drop Zone', (s) => s.drop * P.core.drop)}
          ${row('GOLDEN COREs', (s) => s.gStar * P.golden.star + s.gDrop * P.golden.drop)}
          ${row('Star Map bonus', (s) => s.starBonus)}
          ${row('Payload bonus', (s) => s.payloadBonus)}
          ${row('Space Station', (s) => s.station)}
          ${row('Foul points', (s) => s.foulPts)}
          <tr class="tot"><td>Match score</td><td class="r n">${F.red.total}</td><td class="r n">${F.blue.total}</td></tr>
          ${row('Ranking points', (s) => `${s.rpTotal} <small>${[s.rp.win && 'win', s.rp.tie && 'tie', s.rp.starburst && 'starburst', s.rp.pattern && 'pattern', s.rp.endgame && 'endgame'].filter(Boolean).join(' · ') || '—'}</small>`)}</table>
        <div id="save-note" class="save-note"></div>`,
      footer: !this.ctx.isOnline() ? `<button class="btn ghost" data-r="menu">${icon('home')}Main menu</button><button class="btn" data-r="lb">${icon('trophy')}Leaderboard</button><button class="btn primary" data-r="again">${icon('refresh')}Play again</button>`
        : this.sim.net.isHost ? `<button class="btn ghost" data-r="menu">${icon('users')}Back to lobby</button><button class="btn" data-r="lb">${icon('trophy')}Leaderboard</button><button class="btn primary" data-r="again">${icon('refresh')}Play again</button>`
          : `<span class="ol-wait"><div class="spinner"></div>The host picks what's next</span><button class="btn ghost" data-r="menu">${icon('door')}Leave room</button><button class="btn" data-r="lb">${icon('trophy')}Leaderboard</button>`,
    });
    m.el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-r]'); if (!b) return;
      if (b.dataset.r === 'again') { this.closeAll(); this.ctx.restart(); }
      if (b.dataset.r === 'menu') { this.closeAll(); this.ctx.toMenu(); }
      if (b.dataset.r === 'lb') this.openLeaderboard();
    });
    this.renderSaveNote();
    if (Account.signedIn) this.saveLastMatch();
  }

  // ================================================================ TUTORIAL COACH
  startCoach() {
    const r = this.sim.robots[0], t = r.body.translation();
    this.tutorial = { step: 0, start: { x: t.x, z: t.z }, base: 0 };
    $('#coach').classList.remove('hidden');
    this._coach = '';
    this.coachTick();
  }
  stopCoach() { this.tutorial = null; const c = $('#coach'); if (c) { c.classList.add('hidden'); c.innerHTML = ''; } }
  coachTick() {
    const T = this.tutorial, g = this.sim.game, r = this.sim.robots[0];
    const deg = (r.theta * 180) / Math.PI, held = r.heldCore && r.heldCore.color === 'red';
    const scored = g.score.red.squadCores;
    const steps = [
      { t: 'Drive', d: `Drive Red 1 with ${kb('KeyW')}${kb('KeyA')}${kb('KeyS')}${kb('KeyD')} or the arrow keys. Tap for a gentle nudge, hold for full speed.`,
        done: () => { const p = r.body.translation(); return Math.hypot(p.x - T.start.x, p.z - T.start.z) > 0.5; } },
      { t: 'Lower the arm', d: `Hold ${kb('KeyQ')} until the arm is all the way down. The gauge on your robot card shows the angle.`, done: () => deg < -10 },
      { t: 'Open the gripper', d: `Press ${kb('KeyR')} to open the fingers.`, done: () => !r.gripClosed || held },
      { t: 'Grab a CORE', d: `Drive up to a red CORE. When it sits between the fingers a <b class="ok">green ring</b> lights up under it: press ${kb('KeyR')} to close the gripper.`, done: () => held },
      { t: 'Lift it', d: `Hold ${kb('KeyE')} to raise the arm past the second yellow mark on the gauge (about 46°), high enough for a High Pole.`, done: () => held && deg > 46, back: () => !held && 3 },
      { t: 'Score it', d: `Drive to the <b>red row of High Poles</b>. Let a pole slide into the slot at the front of the robot until the white drop line points at it, then press ${kb('KeyR')} to let go.`, done: () => scored > T.base, back: () => !held && scored <= T.base && 3 },
    ];
    if (T.step === 0 && T.base === 0) T.base = scored;
    const cur = steps[T.step];
    if (cur) {
      if (cur.done()) { T.step++; if (this.sim.audio) this.sim.audio.beep(880, 0.06); }
      else if (cur.back) { const b = cur.back(); if (b !== false && b !== undefined) T.step = b; }
    }
    const k = T.step, c = $('#coach');
    const html = k < steps.length
      ? `<div class="co-top"><span>Learn to play · ${k + 1} of ${steps.length}</span><button class="lnk" data-skip>Skip</button></div>
        <h3>${steps[k].t}</h3><p>${steps[k].d}</p>
        <div class="co-bar">${steps.map((_, j) => `<i class="${j < k ? 'done' : j === k ? 'now' : ''}"></i>`).join('')}</div>`
      : `<div class="co-top"><span>Learn to play · done</span></div><h3>You scored!</h3>
        <p>That is the core loop. Next: deliver your Payload, trigger STARBURST for the Golden COREs, and park on the Space Station in the last 30 seconds. <b>How to play</b> has the details.</p>
        <div class="co-acts"><button class="btn sm" data-help>How to play</button><button class="btn sm" data-keep>Keep practising</button><button class="btn sm primary" data-match>Play a match</button></div>`;
    if (html !== this._coach) {
      this._coach = html; c.innerHTML = html;
      const on = (sel, fn) => { const b = $(sel, c); if (b) b.addEventListener('click', fn); };
      on('[data-skip]', () => this.stopCoach());
      on('[data-help]', () => this.openHowTo());
      on('[data-keep]', () => this.stopCoach());
      on('[data-match]', () => { this.stopCoach(); this.openLocalSetup('match'); });
    }
  }

  // ================================================================ LOCAL SETUP
  openLocalSetup(mode) {
    const SEATS = { 1: [0], 2: [0, 2], 3: [0, 1, 2], 4: [0, 1, 2, 3] };
    const robots = this.sim.robots;
    const view = (n) => {
      const seats = SEATS[n];
      const rows = seats.map((i) => `<div class="lseat ${robots[i].squad}"><i></i><b>${esc(robots[i].name)}</b><span>${n === 1 ? `${kb('KeyW')}${kb('KeyA')}${kb('KeyS')}${kb('KeyD')} <span class="kgrp">or</span> ${driveLabel(2)}` : driveLabel(i)}</span></div>`).join('');
      const idle = robots.filter((r) => !seats.includes(r.id)).map((r) => r.name).join(', ');
      return `<div class="lseats">${rows}</div>
        ${idle ? `<p class="note">${esc(idle)} stay parked (no computer players).</p>` : ''}
        ${n >= 3 ? `<div class="warn-note">${icon('gamepad')}<span>${n} drivers on one keyboard will hit key-rollover limits: some key combinations stop registering. Plug in gamepads (Settings, Controls) for a full match.</span></div>` : ''}`;
    };
    let n = Settings.get('drivers');
    const m = this.modal({
      title: mode === 'practice' ? 'Practice' : 'Local match', width: 480,
      body: `<p>How many drivers are at this computer?</p>
        <div class="seg seg-lg" role="group" aria-label="Drivers">${[1, 2, 3, 4].map((k) => `<button data-n="${k}" aria-pressed="${k === n}" class="${k === n ? 'on' : ''}">${k}</button>`).join('')}</div>
        <div class="lsetup-body">${view(n)}</div>`,
      footer: `<button class="btn ghost" data-cancel>Cancel</button><button class="btn primary" data-go>${icon('play')}${mode === 'practice' ? 'Start practice' : 'Start match'}</button>`,
    });
    $$('[data-n]', m.el).forEach((b) => b.addEventListener('click', () => {
      n = Number(b.dataset.n);
      $$('[data-n]', m.el).forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', String(x === b)); });
      $('.lsetup-body', m.el).innerHTML = view(n);
    }));
    $('[data-cancel]', m.el).addEventListener('click', () => m.close());
    $('[data-go]', m.el).addEventListener('click', () => { Settings.set('drivers', n); this.ctx.startGame(mode); });
  }

  // ================================================================ ONLINE
  defaultName() {
    let n = Account.profile?.display_name;
    try { n = n || localStorage.getItem('hyperdrive.nick'); } catch { /* storage blocked */ }
    return (n || `Driver ${100 + Math.floor(Math.random() * 900)}`).slice(0, 20);
  }
  openOnline({ code = '', restore = null } = {}) {
    if (!Account.available) { this.toast('Online play needs an internet connection.'); return; }
    warmUpRTC();
    let m = this.modals.find((x) => x.kind === 'online');
    if (!m) { m = this.modal({ title: 'Play online', width: 620, body: '<div></div>' }); m.kind = 'online'; m.code = code; }
    this.renderOnline(true);
    // this tab hosted the room before a refresh: open it again with the same code and seats
    if (restore && !this.sim.net.active) {
      m.body.innerHTML = `<div class="ol-wait" style="margin:8px 0 14px"><div class="spinner"></div>Reopening room ${esc(restore.code)}…</div>`;
      this.sim.net.host(this.defaultName(), restore).then(() => this.renderOnline(true)).catch((err) => { this.renderOnline(true); this.toast(err.message); });
    }
  }
  // re-render the lobby modal (if open) whenever the room changes
  renderOnline(force = false) {
    const m = this.modals.find((x) => x.kind === 'online'); if (!m) return;
    const net = this.sim.net;
    const view = net.active ? 'lobby' : 'intro';
    if (!force && view === 'intro' && m.view === 'intro') return;      // don't wipe what the user is typing
    m.view = view;
    m.body.innerHTML = '';
    m.body.appendChild(view === 'intro' ? this.onlineIntro(m) : this.onlineLobby(m));
  }
  onlineIntro(m) {
    const net = this.sim.net;
    const el = frag(`<div class="ol-intro">
      <p>Every driver opens <b>${esc(location.host || 'the simulator')}</b> on their own laptop. One person hosts: the match runs on the host's computer and everyone else joins with the room code.</p>
      <div class="fld"><label for="ol-name">Your name</label><input id="ol-name" maxlength="20" value="${esc(this.defaultName())}" autocomplete="nickname"></div>
      <div class="ol-choices">
        <div class="ol-choice"><h4>Host a match</h4><p>Create a room and share its code.</p><button class="btn primary block" data-o="host">${icon('plus')}Create room</button></div>
        <div class="ol-choice"><h4>Join a match</h4><input class="code-in" id="ol-code" maxlength="4" placeholder="CODE" value="${esc((m.code || '').toUpperCase().slice(0, 4))}" autocomplete="off" spellcheck="false"><button class="btn block" data-o="join">${icon('door')}Join room</button></div>
      </div>
      <div class="msg"></div></div>`);
    const name = () => { const n = $('#ol-name', el).value.trim().slice(0, 20) || this.defaultName(); try { localStorage.setItem('hyperdrive.nick', n); } catch { /* ignore */ } return n; };
    const msg = $('.msg', el);
    const busy = (b, text) => { $$('[data-o]', el).forEach((x) => { x.disabled = !!b; }); if (b) msg.innerHTML = `<div class="ol-wait"><div class="spinner"></div>${esc(text)}</div>`; };
    const codeIn = $('#ol-code', el);
    codeIn.addEventListener('input', () => { codeIn.value = codeIn.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4); });
    codeIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') $('[data-o="join"]', el).click(); });
    el.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-o]'); if (!b) return;
      try {
        if (b.dataset.o === 'host') { busy(true, 'Creating a room…'); await net.host(name()); }
        if (b.dataset.o === 'join') {
          if (codeIn.value.length !== 4) { msg.innerHTML = '<div class="form-err">Enter the 4-character room code from the host.</div>'; return; }
          busy(true, `Joining room ${codeIn.value}…`); await net.join(codeIn.value, name());
        }
        m.code = '';
        this.renderOnline(true);
      } catch (err) { busy(false); msg.innerHTML = `<div class="form-err">${esc(err.message)}</div>`; }
    });
    setTimeout(() => (m.code ? $('[data-o="join"]', el) : $('#ol-name', el))?.focus(), 60);
    return el;
  }
  onlineLobby() {
    const net = this.sim.net, L = net.lobby, me = net.me;
    const players = L.players || [];
    const nameOf = (id) => (players.find((p) => p.id === id) || {}).name || 'Driver';
    const linkTag = (p) => {
      if (p.host) return `<span class="link-tag host">${icon('crown')}Host</span>`;
      const st = p.link || 'connecting';
      const label = st === 'p2p' ? 'Direct' : st === 'relay' ? 'Relay' : 'Connecting';
      return `<span class="link-tag ${st}" title="${st === 'relay' ? 'Peer-to-peer was blocked, so this driver goes through the slower relay' : ''}">${label}${p.rtt != null && st !== 'connecting' ? ` · ${p.rtt} ms` : ''}</span>`;
    };
    const connected = net.isHost || players.length > 0;
    const el = frag(`<div>
      <div class="ol-code"><div><div class="lbl">Room code</div><div class="cd">${esc(L.code)}</div></div>
        <div class="acts"><button class="btn sm" data-o="copy">${icon('link')}Copy invite link</button></div></div>
      ${!connected ? `<div class="ol-wait" style="margin:18px 0"><div class="spinner"></div>Connecting to the host…</div>` : `
      <h4>Seats</h4>
      <div class="seats">${this.sim.robots.map((r, i) => {
        const id = L.seats[i], mine = id && id === me;
        const btn = !id ? `<button class="btn sm" data-seat="${i}">Take seat</button>` : mine ? `<button class="btn sm ghost" data-unseat="${i}">Leave</button>` : '';
        return `<div class="seat ${r.squad} ${mine ? 'mine' : ''}"><div class="who"><b>${esc(r.name)}</b><span class="${id ? '' : 'open'}">${id ? esc(nameOf(id)) + (mine ? ' (you)' : '') : 'Open'}</span></div>${btn}</div>`;
      }).join('')}</div>
      <h4>In the room · ${players.length}</h4>
      <div class="players">${players.map((p) => `<div class="pl"><span class="nm">${esc(p.name)}${p.id === me ? '<small>you</small>' : ''}</span>${linkTag(p)}</div>`).join('')}</div>
      <p class="ol-note">${net.isHost ? 'The match runs on this computer, so keep this tab open. Take a seat yourself or just host. Anyone without a seat watches.' : 'Take a free seat to drive. Without a seat you watch the match.'}</p>`}
      <div class="modal-f" style="margin:18px -22px -22px">
        ${net.isHost ? `<div class="seg" role="group" aria-label="Mode" style="margin-right:auto"><button data-mode="match" aria-pressed="${L.mode === 'match'}" class="${L.mode === 'match' ? 'on' : ''}">Match 2:30</button><button data-mode="practice" aria-pressed="${L.mode === 'practice'}" class="${L.mode === 'practice' ? 'on' : ''}">Practice</button></div>
          <button class="btn ghost" data-o="leave">Close room</button>
          <button class="btn primary" data-o="start" ${L.seats.some(Boolean) ? '' : 'disabled'}>${icon('play')}${L.phase === 'game' ? 'Back to match' : 'Start'}</button>`
        : `<span class="ol-wait">${L.phase === 'game' ? 'A match is running' : `<div class="spinner"></div>Waiting for the host to start ${L.mode === 'practice' ? 'practice' : 'the match'}`}</span>
          <button class="btn ghost" data-o="leave">Leave room</button>`}
      </div></div>`);
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-o],[data-seat],[data-unseat],[data-mode]'); if (!b) return;
      if (b.dataset.seat !== undefined) net.takeSeat(Number(b.dataset.seat));
      else if (b.dataset.unseat !== undefined) net.leaveSeat(Number(b.dataset.unseat));
      else if (b.dataset.mode) net.setMode(b.dataset.mode);
      else if (b.dataset.o === 'copy') {
        const url = `${location.origin}${location.pathname}?room=${L.code}`;
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => this.toast('Invite link copied', 'ok'), () => this.toast(url));
      } else if (b.dataset.o === 'leave') { net.leave(); this.closeTop(); }
      else if (b.dataset.o === 'start') { if (L.phase === 'game') this.closeTop(); else net.startMatch(); }
    });
    return el;
  }
  renderReconnect() {
    const net = this.sim.net, waiting = !!(net.active && net.reconnecting);
    let m = this.modals.find((x) => x.kind === 'reconnect');
    if (waiting && !m) {
      m = this.modal({ title: 'Host disconnected', width: 400, body: `<div class="ol-wait" style="margin-bottom:10px"><div class="spinner"></div>Waiting for the host to come back…</div><p>If they refreshed their page the room reopens on its own. You will be returned to the lobby.</p>`, footer: '<button class="btn ghost" data-leave>Leave room</button>' });
      m.kind = 'reconnect';
      $('[data-leave]', m.el).addEventListener('click', () => { m.close(); net.leave(); });
    } else if (!waiting && m) m.close();
  }
  onOnlineLeft(reason) {
    if (reason) this.toast(reason);
    this.renderOnline(true);
    this.renderAccount();
  }
  openOnlinePause() {
    const net = this.sim.net, host = net.isHost, g = this.sim.game;
    const running = g.state === 'running', paused = g.state === 'paused';
    const m = this.modal({
      title: `Room ${net.lobby.code}`, width: 380,
      body: `<div class="form">
        <button class="btn primary lg block" data-p="resume">${icon('play')}Back to the field</button>
        ${host && (running || paused) ? `<button class="btn block" data-p="pause">${icon(paused ? 'play' : 'pause')}${paused ? 'Resume the match' : 'Pause for everyone'}</button>` : ''}
        ${host ? `<button class="btn block" data-p="restart">${icon('refresh')}Restart for everyone</button><button class="btn block" data-p="lobby">${icon('users')}Back to lobby</button>` : ''}
        <button class="btn block" data-p="settings">${icon('sliders')}Settings</button>
        <button class="btn block" data-p="help">${icon('book')}How to play</button>
        <button class="btn ghost block" data-p="leave">${icon('door')}${host ? 'Close the room' : 'Leave the room'}</button></div>`,
    });
    m.kind = 'pause';
    m.body.addEventListener('click', (e) => {
      const b = e.target.closest('[data-p]'); if (!b) return;
      const a = b.dataset.p;
      if (a === 'resume') m.close();
      if (a === 'pause') { m.close(); this.ctx.toggleStart(); }
      if (a === 'restart') this.confirmAction({ title: 'Restart for everyone?', text: 'The clock, score and field reset for every player in the room.', ok: 'Restart', fn: () => { this.closeAll(); this.ctx.restart(); } });
      if (a === 'lobby') { this.closeAll(); net.backToLobby(); }
      if (a === 'settings') this.openSettings();
      if (a === 'help') this.openHowTo();
      if (a === 'leave') { this.closeAll(); net.leave(); }
    });
  }
  renderNetPill(online) {
    const pill = $('#net-pill');
    pill.classList.toggle('hidden', !online);
    if (!online) return;
    const net = this.sim.net, L = net.lobby;
    const link = net.isHost ? 'p2p' : net.hostLink();
    const me = (L.players || []).find((p) => p.id === net.me);
    const others = (L.players || []).filter((p) => !p.host);
    const rtt = net.isHost ? (others.length ? Math.max(...others.map((p) => p.rtt || 0)) : null) : me && me.rtt;
    const html = `<span class="dot ${link}"></span><span class="cd">${esc(L.code)}</span><span class="sub">${(L.players || []).length} in room${rtt ? ` · ${rtt} ms` : ''}${link === 'relay' ? ' · relay' : ''}</span>`;
    if (pill._h !== html) { pill.innerHTML = html; pill._h = html; }
  }

  // ================================================================ TOAST
  toast(text, kind = '') {
    const t = $('#toast');
    t.className = kind; t.innerHTML = `${kind === 'ok' ? icon('check') : ''}<span>${esc(text)}</span>`;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ================================================================ TOUCH
  buildTouch() {
    const t = $('#touch');
    t.classList.remove('hidden');
    t.innerHTML = `
      <div class="joy" id="joy"><i></i></div>
      <div class="tbtns">
        <button class="tbtn" data-t="up">${icon('up')}ARM</button><button class="tbtn" data-t="grip">${icon('grip')}GRIP</button>
        <button class="tbtn" data-t="down">${icon('down')}ARM</button><button class="tbtn" data-t="cargo">${icon('box')}CARGO</button>
      </div>
      <div class="t-top"><button class="pill-btn" id="t-robot">${icon('swap')}<span></span></button><button class="pill-btn" id="t-core">${icon('core')}CORE</button><button class="pill-btn" id="t-pl">${icon('box')}LOAD</button><button class="pill-btn" id="t-sb">${icon('star')}</button></div>`;
    const input = this.sim.input;
    const state = { slot: Settings.get('touchRobot'), throttle: 0, turn: 0, arm: 0, grip: false, cargo: false };
    input.touch = state;
    this.touch = state;
    const joy = $('#joy'), knob = $('#joy i');
    let jid = null;
    const move = (e) => {
      const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, R = r.width / 2 - 20;
      let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy); if (d > R) { dx *= R / d; dy *= R / d; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      state.throttle = -dy / R; state.turn = (dx / R) * 0.75;
    };
    joy.addEventListener('pointerdown', (e) => { jid = e.pointerId; joy.setPointerCapture(jid); move(e); });
    joy.addEventListener('pointermove', (e) => { if (e.pointerId === jid) move(e); });
    const end = (e) => { if (e.pointerId !== jid) return; jid = null; knob.style.transform = ''; state.throttle = 0; state.turn = 0; };
    joy.addEventListener('pointerup', end); joy.addEventListener('pointercancel', end);
    $$('.tbtn', t).forEach((b) => {
      const k = b.dataset.t;
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); b.classList.add('on'); if (k === 'up') state.arm = 1; if (k === 'down') state.arm = -1; if (k === 'grip') state.grip = true; if (k === 'cargo') state.cargo = true; });
      const up = () => { b.classList.remove('on'); if (k === 'up' || k === 'down') state.arm = 0; };
      b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('pointerleave', up);
    });
    $('#t-robot').addEventListener('click', () => { state.slot = (state.slot + 1) % 4; Settings.set('touchRobot', state.slot); this.ctx.followRobot(state.slot); });
    const robot = () => this.sim.robots[state.slot];
    $('#t-core').addEventListener('click', () => this.sim.game.placeCore(robot().squad));
    $('#t-pl').addEventListener('click', () => this.sim.game.payloadAction(robot().id));
    $('#t-sb').addEventListener('click', () => this.sim.game.pressStarburst(robot().squad));
  }
  updateTouch() {
    const r = this.sim.robots[this.touch.slot];
    const s = $('#t-robot span'); if (s && s.textContent !== r.name) s.textContent = r.name;
    $('#t-robot').style.borderColor = r.squad === 'red' ? 'rgba(255,71,89,.6)' : 'rgba(63,125,255,.6)';
  }
}
