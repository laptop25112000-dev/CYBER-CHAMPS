import * as THREE from 'three';
import { OrbitControls } from '../lib/OrbitControls.js';
import { createWorld } from './physics.js';
import { buildField } from './field.js';
import { loadRobotModel, Robot } from './robot.js';
import { Game } from './game.js';
import { Input, HP_KEYS, applyKeyBindings } from './input.js';
import { Online, hostRoomFor } from './online.js';
import { UI } from './ui.js';
import { Account } from './account.js';
import { Settings, isTouch } from './settings.js';
import { TEAMS, HALF } from './config.js';

const STEP = 1 / 240;
const MAX_STEPS = 12;

// ---------------------------------------------------------------- audio
class Audio {
  constructor() {
    this.ctx = null; this.enabled = true;
    const unlock = () => { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { /* no audio */ } } };
    window.addEventListener('keydown', unlock); window.addEventListener('pointerdown', unlock);
  }
  tone(f, d, type = 'square', vol = 0.06, when = 0) {
    if (!this.ctx || !this.enabled) return;
    const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + d + 0.02);
  }
  beep(f, d) { this.tone(f, d, 'sine', 0.05); }
  buzzer(kind) {
    if (kind === 'start') { this.tone(330, 0.9, 'sawtooth', 0.08); this.tone(440, 0.9, 'sawtooth', 0.05); }
    else if (kind === 'end') { this.tone(196, 1.4, 'sawtooth', 0.09); this.tone(147, 1.4, 'sawtooth', 0.06); }
    else if (kind === 'levelup') { [523, 659, 784].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.08, i * 0.18)); }
    else if (kind === 'starburst') { [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.18, 'triangle', 0.06, i * 0.09)); }
  }
}

function setLoad(pct, text) {
  const bar = document.getElementById('load-bar'), st = document.getElementById('loading-status');
  if (bar) bar.style.width = `${pct}%`;
  if (st && text) st.textContent = text;
}

// ---------------------------------------------------------------- boot
async function boot() {
  setLoad(10, 'Starting renderer…');
  const modelPromise = loadRobotModel();   // download the CAD while everything else starts up
  Account.init();
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;   // soft PCF costs ~2x the frame time on integrated GPUs
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.98;
  document.getElementById('view').appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07090c);
  scene.fog = new THREE.Fog(0x07090c, 8, 20);
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.02, 60);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0); controls.maxPolarAngle = Math.PI * 0.495; controls.enableDamping = true; controls.minDistance = 0.3; controls.maxDistance = 12;

  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x23221f, 0.6));
  const sun = new THREE.DirectionalLight(0xfff8f0, 2.25);
  sun.position.set(2.5, 6, 1.8); sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -2.6, right: 2.6, top: 2.6, bottom: -2.6, near: 1, far: 14 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.01;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xc8d4ff, 0.4); fill.position.set(-3, 4, -2.5); scene.add(fill);

  setLoad(25, 'Starting the physics engine…');
  const { world, events } = await createWorld();

  const sim = {
    world, events, scene, renderer, camera, simTime: 0, showLabels: true, showGuides: true,
    audio: new Audio(), input: new Input(),
    owners: new Map(),
    registerCollider(c, info) { this.owners.set(c.handle, info); },
    registerBody(body, colliders, info) { for (const c of colliders) this.owners.set(c.handle, info); },
    unregisterBody(body) {
      const n = body.numColliders();
      for (let i = 0; i < n; i++) {
        const h = body.collider(i).handle;
        this.owners.delete(h);
        for (const r of this.robots || []) { r.contacts.delete(h); r.pairContacts.delete(h); }
      }
    },
  };

  setLoad(45, 'Building the HYPERDRIVE field…');
  await new Promise((r) => setTimeout(r, 0));
  sim.field = buildField(scene, world, renderer);
  sim.registerCollider(sim.field.floorCollider, { type: 'floor' });
  for (const s of ['red', 'blue']) for (const c of sim.field.stations[s].colliders) sim.registerCollider(c, { type: 'station', station: sim.field.stations[s] });

  setLoad(65, 'Loading the robot CAD…');
  const model = await modelPromise;
  sim.robots = TEAMS.map((t) => new Robot(sim, t, model));
  setLoad(85, 'Staging the match…');
  sim.game = new Game(sim);
  const game = sim.game, input = sim.input;
  const net = sim.net = new Online(sim);

  // ------------------------------------------------------------ cameras
  const CAMS = [
    // the drivers' own view (Fig 3.0): standing in the 25 in Driver Area right behind their start-zone wall, eye height
    { name: 'Red driver station', pos: [0, 1.95, -HALF - 1.0], target: [0, -0.5, 0], fov: 56 },
    { name: 'Blue driver station', pos: [0, 1.95, HALF + 1.0], target: [0, -0.5, 0], fov: 56 },
    // audience side chosen so Red is on the left of the screen, matching the HUD
    { name: 'Audience', pos: [-4.15, 3.25, 0.0], target: [0, -0.42, 0] },
    { name: 'Top-down', pos: [0, 6.6, 0.001], target: [0, -0.3, 0] },
  ];
  // local match: which robots the drivers at this computer control (the rest stay parked)
  const LOCAL_SEATS = { 1: [0], 2: [0, 2], 3: [0, 1, 2], 4: [0, 1, 2, 3] };
  const localSeats = () => LOCAL_SEATS[Settings.get('drivers')] || [0, 1, 2, 3];
  // default view: your squad's driver station (Red for a local match, the audience view for spectators)
  const defaultCam = () => {
    if (isTouch) { const mine = net.active ? net.mySeats() : []; return CAMS.length + (mine.length ? mine[0] : Settings.get('touchRobot')); }
    if (!net.active) return 0;
    const sq = net.mySquads();
    return sq.length === 1 ? (sq[0] === 'red' ? 0 : 1) : 2;
  };
  const camNames = [...CAMS.map((c) => c.name), ...sim.robots.map((r) => `Follow ${r.name}`)];
  let camMode = 0, view = 'menu', orbit = 0.6;
  const followPos = new THREE.Vector3(), followTgt = new THREE.Vector3();
  function setCamera(m) {
    camMode = m;
    const lbl = document.getElementById('cam-label'); if (lbl) lbl.textContent = camNames[m];
    if (m < CAMS.length) { const c = CAMS[m]; camera.position.set(...c.pos); controls.target.set(...c.target); controls.enabled = true; controls.update(); }
    else controls.enabled = false;
    camera.fov = (m < CAMS.length && CAMS[m].fov) || 45;
    if (m < 2 && window.innerHeight > window.innerWidth) camera.fov = 80;   // portrait: widen the driver-station lens to fit the field's width
    camera.updateProjectionMatrix();
  }
  sim.setCamera = setCamera;
  sim.controls = controls;

  // ------------------------------------------------------------ settings
  let quality = null;
  // render scale: lowered automatically when a laptop cannot hold ~50 fps (see the governor in tick)
  let renderScale = 1;
  const wantPixelRatio = () => Math.max(0.6, Math.min(window.devicePixelRatio || 1, quality === 'high' ? 1.5 : 1) * renderScale);
  function applySettings() {
    const s = Settings.data;
    applyKeyBindings(s.keys);
    sim.showLabels = s.labels; sim.showGuides = s.guides; sim.audio.enabled = s.sound;
    input.tank = s.tank; input.padAssign = [...s.pads];
    if (s.quality !== quality) {
      quality = s.quality;
      const hi = quality === 'high';
      renderer.setPixelRatio(wantPixelRatio());
      sun.shadow.mapSize.set(hi ? 2048 : 1024, hi ? 2048 : 1024);
      if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; }
    }
  }
  function applyTeams() {
    if (net.active && net.isGuest) return;   // online guests show the host's team numbers
    const t = Settings.get('teams');
    sim.robots.forEach((r, i) => { r.setNumber(t[i]); game.payloads[i].setNumber(t[i]); });
  }
  Settings.onChange(applySettings);
  applySettings(); applyTeams();

  // ------------------------------------------------------------ UI context
  let autoPaused = false;
  const online = () => net.active && view === 'game';
  function resetField() { if (net.active && net.isGuest) net.guestReset(); else { game.reset(); applyTeams(); } }
  function doHp(a, squad, robotId) {
    if (a === 'core') game.placeCore(squad);
    else if (a === 'pl') game.payloadAction(robotId);
    else if (a === 'sb') game.pressStarburst(squad);
  }
  const ctx = {
    startGame(mode) {
      ui.closeAll(); ui.stopCoach();
      game.mode = mode; game.reset(); applyTeams();
      view = 'game'; ui.setView('game');
      setCamera(defaultCam());
    },
    restart() {
      if (net.active) { if (net.isHost) net.restartMatch(); return; }
      game.reset(); applyTeams(); ui.setView('game');
    },
    toMenu() {
      ui.toggleHud(true); ui.detailsPinned = false; ui.stopCoach();
      if (net.active && view === 'game') { if (net.isHost) net.backToLobby(); else net.leave(); return; }
      game.mode = 'match'; game.reset(); applyTeams(); view = 'menu'; ui.setView('menu'); controls.enabled = false;
    },
    // Space / Start / the centre button: online, only the host runs the clock
    toggleStart() {
      if (online() && net.isGuest) { ui.toast('Only the host can start or pause the match'); return; }
      game.start();
    },
    // Human Player actions (keys, HUD buttons, gamepad X / Y)
    hp(a, squad, robotId) {
      if (online()) {
        if (!net.canAct(squad)) { ui.toast('Human Player actions are for your own squad'); return; }
        if (net.isGuest) { net.requestHp(a, squad, robotId); return; }
      }
      doHp(a, squad, robotId);
    },
    isOnline: online,
    localSeats,
    // coached practice: one driver, a red CORE placed in front of Red 1, and the HUD coach takes over
    startTutorial() {
      Settings.set('drivers', 1);
      ctx.startGame('practice');
      const r = sim.robots[0], p = r.toWorld({ x: 0.62, y: 0, z: 0 });
      game.addCore('red', 'red', { x: p.x, y: 0.0151, z: p.z });
      game.start();
      ui.startCoach();
    },
    cameras: () => camNames,
    cameraIndex: () => camMode,
    setCamera,
    applyTeams,
    followRobot(slot) { setCamera(CAMS.length + slot); },
    onModal(open) {
      if (view !== 'game' || net.active) return;   // online matches never pause because someone opened a menu
      if (open && game.state === 'running') { game.start(); autoPaused = true; }
      else if (!open && autoPaused) { autoPaused = false; if (game.state === 'paused') game.start(); }
    },
  };
  const ui = new UI(sim, ctx);
  sim.hud = ui;
  sim.ui = ui;
  input.active = () => view === 'game' && ui.modals.length === 0;
  net.hooks = {
    begin(mode) {
      ui.closeAll();
      game.mode = mode; resetField();
      view = 'game'; ui.setView('game');
      const mine = net.mySeats();
      if (isTouch && input.touch && mine.length) input.touch.slot = mine[0];
      setCamera(defaultCam());
    },
    restart() { ui.closeAll(); resetField(); ui.setView('game'); },
    menu() {
      ui.closeAll(); game.mode = 'match'; resetField();
      view = 'menu'; ui.setView('menu'); controls.enabled = false;
      ui.openOnline();
    },
    left(reason) {
      if (view === 'game') { ui.closeAll(); view = 'menu'; ui.setView('menu'); controls.enabled = false; }
      game.mode = 'match'; game.reset(); applyTeams();
      ui.onOnlineLeft(reason);
    },
    hpAction: doHp,
  };
  window.addEventListener('beforeunload', () => { if (net.active && net.isGuest) net.room.close(); });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ------------------------------------------------------------ collision bookkeeping
  function drainEvents() {
    events.drainCollisionEvents((h1, h2, started) => {
      for (const [a, b] of [[h1, h2], [h2, h1]]) {
        const info = sim.owners.get(a);
        if (!info || info.type !== 'robot') continue;
        const r = info.robot;
        let set = r.pairContacts.get(b);
        if (started) { if (!set) { set = new Set(); r.pairContacts.set(b, set); } set.add(a); }
        else if (set) { set.delete(a); if (!set.size) r.pairContacts.delete(b); }
        const n = r.pairContacts.get(b)?.size || 0;
        if (n) r.contacts.set(b, n); else r.contacts.delete(b);
      }
    });
  }

  // ------------------------------------------------------------ loop
  const stationBodies = ['red', 'blue'].flatMap((s) => [sim.field.stations[s].deckBody, ...sim.field.stations[s].ramps.map((r) => r.body)]);
  let last = performance.now(), acc = 0, hudT = 0, detailsOn = false;
  const perf = { t: 0, n: 0 };
  const size = new THREE.Vector2();
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3();

  function frame(now) {
    const dtReal = Math.min(0.05, (now - last) / 1000); last = now;
    tick(dtReal, true);
    requestAnimationFrame(frame);
  }
  // an online host keeps simulating while its tab is hidden (rAF stops there): a worker timer drives the loop
  const bgTimer = new Worker(URL.createObjectURL(new Blob(['setInterval(() => postMessage(0), 1000 / 30);'], { type: 'text/javascript' })));
  bgTimer.onmessage = () => {
    if (!document.hidden || !(net.active && net.isHost && view === 'game')) return;
    const now = performance.now();
    tick(Math.min(0.05, (now - last) / 1000), false); last = now;
  };
  function tick(dtReal, render) {
    input.update(dtReal);
    renderer.getSize(size);
    // performance governor: average real frame time over ~2 s; drop render resolution when slow
    perf.t += dtReal; perf.n++;
    if (perf.t > 2) {
      const avg = perf.t / perf.n; perf.t = 0; perf.n = 0;
      if (render && !document.hidden) {
        if (avg > 1 / 48 && renderScale > 0.6) renderScale = Math.max(0.6, renderScale - 0.15);
        else if (avg < 1 / 58 && renderScale < 1) renderScale = Math.min(1, renderScale + 0.05);
      }
    }
    const wantPR = wantPixelRatio();
    if (Math.abs(renderer.getPixelRatio() - wantPR) > 1e-3) renderer.setPixelRatio(wantPR);
    if (size.x !== window.innerWidth || size.y !== window.innerHeight) {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / Math.max(1, window.innerHeight); camera.updateProjectionMatrix();
    }
    const inGame = view === 'game', modalOpen = ui.modals.length > 0;
    // global keys
    const isOnline = net.active && inGame, guest = isOnline && net.isGuest;
    const mine = isOnline ? net.mySeats() : localSeats();
    if (inGame && !modalOpen) {
      if (input.hit('Space')) ctx.toggleStart();
      if (input.hit('Escape')) ui.openPause();
      if (input.hit('KeyC')) setCamera((camMode + 1) % camNames.length);
      if (input.hit('KeyH')) ui.openHowTo();
      if (input.hit('KeyV')) ui.toggleHud();
      // Human Player keys. Online, a driver whose robots are all in one squad can use either key row.
      const squads = [...new Set(mine.map((i) => sim.robots[i].squad))];
      const rows = squads.length === 1 ? [[squads[0], HP_KEYS.red], [squads[0], HP_KEYS.blue]] : squads.map((s) => [s, HP_KEYS[s]]);
      for (const [s, k] of rows) {
        if (input.hit(k.core)) ctx.hp('core', s);
        if (input.hit(k.starburst)) ctx.hp('sb', s);
        const ids = sim.robots.filter((r) => r.squad === s).map((r) => r.id);
        k.payload.forEach((code, j) => { if (input.hit(code) && ids[j] !== undefined) ctx.hp('pl', s, ids[j]); });
      }
    }
    const wantDetails = inGame && !modalOpen && input.down.has('Tab');
    if (wantDetails !== detailsOn) { detailsOn = wantDetails; ui.showDetails(wantDetails || ui.detailsPinned); }
    // robot controls
    sim.robots.forEach((r, i) => {
      if (!inGame) { r.cmd = { throttle: 0, turn: 0, arm: 0 }; return; }
      if (!mine.includes(i)) {                                   // someone else's seat, or a robot nobody drives
        if (isOnline && !guest) net.applyRemote(r); else if (!isOnline) r.cmd = { throttle: 0, turn: 0, arm: 0 };
        return;
      }
      const c = input.robot(i, mine.length === 1);
      if (c.start && !modalOpen) ctx.toggleStart();
      if (c.hpCore && !modalOpen) ctx.hp('core', r.squad);
      if (c.hpPayload && !modalOpen) ctx.hp('pl', r.squad, r.id);
      if (guest) { net.queueInput(i, c, modalOpen); return; }
      if (r.enabled && !modalOpen) {
        r.cmd = { throttle: c.throttle, turn: c.turn, arm: c.arm };
        if (c.grip) r.toggleGrip();
        if (c.cargo) r.cargoAction();
      } else r.cmd = { throttle: 0, turn: 0, arm: 0 };
    });
    if (guest) net.sendInputs();
    input.endFrame();

    // physics
    let simDt = 0;
    if (!guest && game.state !== 'paused' && game.state !== 'final') {
      acc += dtReal;
      let n = 0;
      while (acc >= STEP && n < MAX_STEPS) {
        for (const b of stationBodies) { b.resetForces(false); b.resetTorques(false); }
        for (const r of sim.robots) r.step(STEP);
        for (const s of ['red', 'blue']) sim.field.stations[s].step(STEP);
        world.step(events);
        drainEvents();
        // safety net: a robot can never physically exceed these (guards against deep-overlap explosions)
        for (const r of sim.robots) {
          const v = r.body.linvel(), w = r.body.angvel();
          const sv = Math.hypot(v.x, v.y, v.z), sw = Math.hypot(w.x, w.y, w.z);
          if (sv > 3) r.body.setLinvel({ x: v.x * 3 / sv, y: v.y * 3 / sv, z: v.z * 3 / sv }, true);
          if (sw > 25) r.body.setAngvel({ x: w.x * 25 / sw, y: w.y * 25 / sw, z: w.z * 25 / sw }, true);
        }
        sim.simTime += STEP; simDt += STEP;
        acc -= STEP; n++;
      }
      if (n === MAX_STEPS) acc = 0;
    } else acc = 0;
    if (guest) net.guestFrame(); else game.update(simDt);
    if (isOnline && net.isHost) net.hostFrame();

    // visuals
    for (const r of sim.robots) { r.sync(); r.label.visible = inGame && sim.showLabels && camMode !== CAMS.length + r.id; }
    for (const c of game.cores) c.sync();
    for (const p of game.payloads) p.sync();
    for (const s of ['red', 'blue']) sim.field.stations[s].sync();
    for (const s of ['red', 'blue']) sim.field.trifrons[s].group.rotation.y += dtReal * 0.25;

    if (!inGame) {
      // slow cinematic orbit behind the main menu
      orbit += dtReal * 0.07;
      const narrow = window.innerWidth < 860;
      const R = narrow ? 5.6 : 4.9, H = narrow ? 3.4 : 2.35;
      camera.position.set(Math.cos(orbit) * R, H, Math.sin(orbit) * R);
      tmpA.set(narrow ? 0 : Math.sin(orbit) * 0.9, narrow ? -0.5 : 0.05, narrow ? 0 : -Math.cos(orbit) * 0.9);
      camera.lookAt(tmpA);
      followPos.copy(camera.position);
    } else if (camMode >= CAMS.length) {
      const r = sim.robots[camMode - CAMS.length];
      const portrait = window.innerHeight > window.innerWidth;
      const behind = r.toWorld(portrait ? { x: -1.05, y: 1.35, z: 0 } : { x: -0.62, y: 0.78, z: 0 });
      const ahead = r.toWorld(portrait ? { x: 0.7, y: -0.1, z: 0 } : { x: 0.55, y: 0.0, z: 0 });
      followPos.lerp(tmpA.set(behind.x, behind.y, behind.z), Math.min(1, dtReal * 5));
      followTgt.lerp(tmpB.set(ahead.x, ahead.y, ahead.z), Math.min(1, dtReal * 8));
      camera.position.copy(followPos); camera.lookAt(followTgt);
    } else {
      controls.update();
      followPos.copy(camera.position); followTgt.copy(controls.target);
    }
    if (render) renderer.render(scene, camera);
    hudT += dtReal;
    if (hudT > 0.1) { hudT = 0; ui.update(); if (detailsOn || (ui.detailsPinned && inGame)) ui.showDetails(true); }
  }
  // test hook: advance the simulation without requestAnimationFrame
  sim.advance = (seconds, render = false) => { for (let t = 0; t < seconds - 1e-9; t += 1 / 60) tick(1 / 60, render); };
  sim.tick = tick;
  sim.ctx = ctx;

  setLoad(100, 'Ready');
  ui.setView('menu');
  const roomParam = new URLSearchParams(location.search).get('room');
  if (roomParam) setTimeout(() => ui.openOnline({ code: roomParam, restore: hostRoomFor(roomParam.toUpperCase()) }), 300);
  controls.enabled = false;
  requestAnimationFrame(frame);
  setTimeout(() => { const l = document.getElementById('loading'); l.classList.add('done'); setTimeout(() => l.remove(), 600); }, 150);
  window.__sim = sim; // handy for debugging in the console
}

boot().catch((e) => {
  console.error(e);
  const s = document.getElementById('loading-status');
  if (s) s.textContent = 'Failed to start: ' + e.message;
});
