import { Core, Payload } from './elements.js';
import { qrot, cross, norm, dot, pointInPoly, polysOverlap, polyCircleOverlap, G } from './physics.js';
import { MATCH, POINTS, RP, CORE, PAYLOAD, RED, VAULT, STATION, wx, wz, squadPoint } from './config.js';
import { paintTrifron } from './field.js';

const OPP = { red: 'blue', blue: 'red' };
const COS40 = Math.cos(40 * Math.PI / 180);

export class Game {
  constructor(sim) {
    this.sim = sim;
    this.cores = [];
    this.payloads = sim.robots.map((r) => new Payload(sim, r));
    this.feed = [];
    this.listeners = [];
    this.signalListeners = [];
    this.mode = 'match';            // 'match' (2:30 clock) | 'practice' (no clock)
    this.feedSeq = 0;               // feed entry ids (stable across the network)
    this.reset();
  }
  onSignal(fn) { this.signalListeners.push(fn); }
  signal(type, data) { this.signalListeners.forEach((f) => f(type, data)); }

  // ------------------------------------------------------------ setup
  // guest: an online client mirrors the host, so it does not spawn its own COREs
  reset({ guest = false } = {}) {
    const { sim } = this;
    for (const r of sim.robots) r.reset();
    for (const c of this.cores) { sim.unregisterBody(c.body); c.destroy(); }
    this.cores = [];
    for (const p of this.payloads) p.reset();
    for (const s of ['red', 'blue']) { sim.field.stations[s].reset(); sim.field.vaults[s].setOpen(false); }
    this.state = 'pre';            // pre | running | paused | post | final
    this.time = 0;                 // seconds elapsed in the match
    this.postTimer = 0;
    this.starburst = { red: { active: false, how: null, at: null }, blue: { active: false, how: null, at: null } };
    this.hp = { red: { cores: MATCH.hpCores }, blue: { cores: MATCH.hpCores } };
    for (const s of ["red", "blue"]) sim.field.hpRacks[s].setCount(MATCH.hpCores);
    this.fouls = { red: [], blue: [] };      // fouls COMMITTED by squad (points go to the opponent)
    this.feed = [];
    this.flags = new Map();                  // per-occurrence foul latches
    this.pins = new Map();
    this.prevScored = new Map();
    this.final = null;
    // STAR MAP: two GOLDEN + one squad CORE, random order (3.4.2), shown top -> bottom
    const pos = Math.floor(Math.random() * 3);
    this.starMap = ['G', 'G', 'G']; this.starMap[pos] = 'C';
    paintTrifron(sim.field, this.starMap);
    // pre-placed COREs on spike marks + GOLDEN in vaults (4.3.3)
    if (!guest) for (const s of ['red', 'blue']) {
      for (const p of RED.spikeMarks) {
        const [X, Y] = squadPoint(s, p);
        this.addCore(s, s, { x: wx(X), y: CORE.h / 2 + 0.0001, z: wz(Y) }).body.sleep();
      }
      // staged elements start at rest (asleep) so the solver only works on what robots disturb
      const v = sim.field.vaults[s];
      for (let i = 0; i < VAULT.cores; i++) this.addCore('gold', s, { x: v.x, y: CORE.h / 2 + 0.0001 + i * (CORE.h + 0.0002), z: v.z }).body.sleep();
    }
    this.updateLeds();
    this.score = this.computeScore();
    this.emit();
  }

  addCore(color, owner, pos) {
    const c = new Core(this.sim, color, owner, pos);
    this.sim.registerBody(c.body, c.colliders, { type: 'core', core: c });
    this.cores.push(c);
    return c;
  }

  start() {
    if (this.state === 'pre') {
      this.state = 'running';
      this.log(this.mode === 'practice' ? 'Practice started' : 'MATCH START', null, 'phase');
      this.sim.audio.buzzer('start');
      this.signal('start');
    }
    else if (this.state === 'paused') this.state = 'running';
    else if (this.state === 'running') this.state = 'paused';
    for (const r of this.sim.robots) r.enabled = this.state === 'running';
    this.emit();
  }
  get remaining() { return Math.max(0, MATCH.length - this.time); }
  // practice has no clock, so every scoring option (including the Apex Pole) is open
  isLevelUp() { return this.mode === 'practice' ? this.state !== 'pre' : this.state !== 'pre' && this.remaining <= MATCH.levelUp; }
  on(fn) { this.listeners.push(fn); }
  emit() { this.listeners.forEach((f) => f(this)); }
  log(text, squad, kind = 'info') {
    const t = this.state === 'pre' ? '--:--' : this.mode === 'practice' ? '·' : fmtTime(this.remaining);
    this.feed.unshift({ id: ++this.feedSeq, t, text, squad, kind });
    if (this.feed.length > 60) this.feed.pop();
  }

  // ------------------------------------------------------------ per-frame update (dt = simulated seconds)
  update(dt) {
    const { sim } = this;
    if (this.state === 'running' && this.mode === 'match') {
      const wasLevelUp = this.isLevelUp();
      this.time += dt;
      if (!wasLevelUp && this.isLevelUp()) { this.log('LEVEL UP — End Game (final 30 s)', null, 'phase'); sim.audio.buzzer('levelup'); this.signal('levelup'); }
      if (this.time >= MATCH.length) {
        this.time = MATCH.length;
        this.state = 'post';
        for (const r of sim.robots) { r.enabled = false; r.cmd = { throttle: 0, turn: 0, arm: 0 }; }
        this.log('MATCH END — robots disabled (G5.3)', null, 'phase');
        sim.audio.buzzer('end');
        this.signal('end');
      }
    } else if (this.state === 'post') {
      this.postTimer += dt;
      if (this.postTimer > 3) { this.finalize(); }
    }
    // payload housekeeping
    for (const p of this.payloads) {
      if (p.restoreFilterAt && sim.simTime >= p.restoreFilterAt && p.body) { p.setFilter(G.ALL); p.restoreFilterAt = 0; }
      if (p.where !== 'field' || !p.body) continue;
      const pos = p.body.translation();
      if (pos.y < -0.5 || Math.abs(pos.x) > 3 || Math.abs(pos.z) > 3) { this.returnPayload(p, 'left the field'); continue; }
      const low = boxLowestY(p.body);
      const c = [pos.x, pos.z];
      const inOk = pointInPoly(c, sim.field.dropZones[p.squad]) || pointInPoly(c, sim.field.sourceZones[p.squad]);
      if (low < 0.004 && !inOk) {
        p.outsideTimer += dt;
        if (!p.invalid) { p.invalid = true; this.log(`${p.robot.name} PAYLOAD touched the floor outside the Drop/Source Zone — must be returned (3.7)`, p.squad, 'warn'); }
        if (p.outsideTimer > 2) this.returnPayload(p, null);
      }
    }
    // cores that fell out of the arena
    for (const c of this.cores) {
      const t = c.body.translation();
      if (t.y < -0.5 || Math.abs(t.x) > 3.2 || Math.abs(t.z) > 3.2) { c.body.setTranslation({ x: 0, y: -10, z: 0 }, false); c.body.sleep(); }
    }
    if (this.state === 'running' || this.state === 'post') {
      this.updateRobotStates(dt);
      this.score = this.computeScore();
      if (this.state === 'running') this.checkStarburst();
      this.checkDescoring();
    } else {
      this.updateRobotStates(0);
      this.score = this.computeScore();
    }
  }

  returnPayload(p, why) {
    const robot = this.sim.robots[p.robot.id];
    if (robot.payloadJoint) robot.releasePayload(false);
    p.reset();
    if (why) this.log(`${p.robot.name} PAYLOAD ${why} — returned to Human Player`, p.squad, 'warn');
  }

  // ------------------------------------------------------------ robots: zones, station, fouls
  robotTouching(robot, set) {
    for (const w of robot.wheels) if (w.ground !== null && set.has(w.ground)) return true;
    for (const [h, n] of robot.contacts) if (n > 0 && set.has(h)) return true;
    return false;
  }
  robotsInContact(a, b) {
    for (const [h, n] of a.contacts) if (n > 0 && b.colliderSet.has(h)) return true;
    return false;
  }

  updateRobotStates(dt) {
    const { sim } = this;
    const F = sim.field;
    const floorSet = new Set([F.floorCollider.handle]);
    for (const r of sim.robots) {
      const fp = r.footprint(); // chassis + gripper
      r.zone = {
        ownSource: polysOverlap(fp, F.sourceZones[r.squad]),
        oppSource: polysOverlap(fp, F.sourceZones[OPP[r.squad]]),
        ownVault: polyCircleOverlap(fp, F.vaultZones[r.squad].c, F.vaultZones[r.squad].r),
        oppVault: polyCircleOverlap(fp, F.vaultZones[OPP[r.squad]].c, F.vaultZones[OPP[r.squad]].r),
        ownDrop: polysOverlap(fp, F.dropZones[r.squad]),
      };
      // SPACE STATION state (3.3.3 / Fig 4.5)
      const onFloor = this.robotTouching(r, floorSet);
      r.stationState = 'none'; r.stationSquad = null;
      for (const s of ['red', 'blue']) {
        const st = F.stations[s];
        if (!this.robotTouching(r, st.colliderSet)) continue;
        // DOCK / BALANCE: fully supported (off the floor) and on top of the platform itself (3.3.3, Fig 4.5);
        // a robot still on a ramp, or with wheels on the floor, is only ENGAGED
        const deck = st.deckPoly();
        const onTop = this.chassisFootprint(r).every((p) => pointInPoly(p, deck));
        const supported = !onFloor && onTop;
        r.stationSquad = s;
        r.stationState = supported ? (Math.abs(st.tilt()) <= STATION.levelTol ? 'balance' : 'dock') : 'engage';
      }
      if (this.state !== 'running') continue;
      const opp = OPP[r.squad];
      // G4.17 opponent SOURCE ZONE
      this.latch(`src${r.id}`, r.zone.oppSource, () => this.foul(r, 'minor', 'G4.17', 'entered the opponent Source Zone'));
      // G4.12 DOCK/BALANCE on the opponent SPACE STATION
      const onOpp = r.stationSquad === opp && (r.stationState === 'dock' || r.stationState === 'balance');
      this.latch(`stn${r.id}`, onOpp, () => this.foul(r, 'major', 'G4.12', 'docked on the opponent Space Station'));
      // G4.19 contact with the opponent PAYLOAD; PAYLOAD controlled by the CORE mechanism (R9.4)
      for (const p of this.payloads) {
        if (!p.body) continue;
        const touching = p.colliders.some((c) => (r.contacts.get(c.handle) || 0) > 0);
        if (p.squad !== r.squad) this.latch(`pl${r.id}-${p.robot.id}`, touching, () => this.foul(r, 'minor', 'G4.19', `touched ${p.robot.name}'s Payload`));
        else if (touching && p.where === 'field' && !p.invalid) {
          const mech = p.colliders.some((c) => this.contactWithSet(r, c.handle, r.coreMechSet));
          if (mech) { p.invalid = true; this.log(`${p.robot.name} PAYLOAD contacted ${r.name}'s CORE mechanism — not scorable (R9.4)`, p.squad, 'warn'); }
        }
      }
      // robot-robot interactions
      for (const o of sim.robots) {
        if (o.squad === r.squad) continue;
        const touching = this.robotsInContact(r, o);
        // G4.18: contact with an opponent in its own VAULT ZONE while it is retrieving GOLDEN CORE
        const victimRetrieving = o.zone && o.zone.ownVault && this.starburst[o.squad].active;
        this.latch(`vz${r.id}-${o.id}`, touching && victimRetrieving && this.initiator(r, o), () => this.foul(r, 'minor', 'G4.18', `contacted ${o.name} in its Vault Zone`));
        // G4.9 pinning: r restricts o (o commanding motion but not moving) for > 3 s
        const key = `${r.id}>${o.id}`;
        const pin = this.pins.get(key) || { t: 0, apart: 0, fouls: 0 };
        const oTrying = Math.abs(o.cmd.throttle) + Math.abs(o.cmd.turn) > 0.3;
        if (touching && oTrying && o.speed() < 0.08 && this.pushing(r, o)) {
          pin.t += dt; pin.apart = 0;
          const n = Math.floor(pin.t / 3);
          if (n > pin.fouls) { pin.fouls = n; this.foul(r, 'minor', 'G4.9', `pinning ${o.name} (${(n * 3)} s)`); }
        } else if (pin.t > 0) {
          pin.apart += dt;
          if (pin.apart > 3) { pin.t = 0; pin.fouls = 0; }
        }
        this.pins.set(key, pin);
      }
    }
  }
  chassisFootprint(r) {
    return [[-0.151, -0.186], [0.149, -0.186], [0.149, 0.186], [-0.151, 0.186]].map(([x, z]) => { const w = r.toWorld({ x, y: 0, z }); return [w.x, w.z]; });
  }
  contactWithSet(robot, otherHandle, mySet) {
    // did one of robot's colliders in mySet touch otherHandle?
    const pairs = robot.pairContacts.get(otherHandle);
    if (!pairs) return false;
    for (const h of pairs) if (mySet.has(h)) return true;
    return false;
  }
  initiator(a, b) {
    const va = a.body.linvel(), vb = b.body.linvel();
    const pa = a.body.translation(), pb = b.body.translation();
    const d = norm({ x: pb.x - pa.x, y: 0, z: pb.z - pa.z });
    return dot(va, d) >= -dot(vb, d);
  }
  pushing(a, b) {
    const pa = a.body.translation(), pb = b.body.translation();
    const d = norm({ x: pb.x - pa.x, y: 0, z: pb.z - pa.z });
    const fwd = qrot(a.body.rotation(), { x: 1, y: 0, z: 0 });
    return dot(fwd, d) * a.cmd.throttle > 0.2;
  }
  latch(key, cond, fn) {
    const was = this.flags.get(key) || false;
    if (cond && !was) fn();
    this.flags.set(key, cond);
  }
  foul(robot, type, rule, text) {
    this.fouls[robot.squad].push({ type, rule, robot: robot.name, text, t: this.remaining });
    this.log(`${type === 'major' ? 'MAJOR' : 'MINOR'} FOUL ${rule}: ${robot.name} ${text} (+${type === 'major' ? POINTS.majorFoul : POINTS.minorFoul} ${OPP[robot.squad].toUpperCase()})`, robot.squad, 'foul');
    this.sim.audio.beep(type === 'major' ? 220 : 440, 0.12);
  }

  // ------------------------------------------------------------ CORE events from robots
  onCoreGripped(robot, core) { core.lastTouch = { robot, t: this.time }; }
  onCoreReleased(robot, core) {
    core.release = {
      robot, t: this.time, levelUp: this.isLevelUp(),
      stationed: robot.stationSquad === robot.squad && robot.stationState !== 'none',
    };
  }

  // ------------------------------------------------------------ human players
  placeCore(squad) {
    if (this.state !== 'running') return this.hint('Human Players act only during the match');
    const F = this.sim.field;
    if (this.hp[squad].cores <= 0) return this.hint(`${squad.toUpperCase()} Human Player has no COREs left`);
    if (this.sim.robots.some((r) => r.squad === squad && r.zone && r.zone.ownSource)) return this.hint(`G4.10: a ${squad} robot is in the Source Zone — Human Player must stay behind the wall`);
    const inZone = this.cores.filter((c) => c.color === squad && !c.heldBy && pointInPoly([c.pos().x, c.pos().z], F.sourceZones[squad])).length;
    if (inZone >= MATCH.sourceZoneCap) return this.hint(`G4.3: Source Zone already holds ${MATCH.sourceZoneCap} ${squad} COREs`);
    const spot = this.freeSpot(F.sourceZones[squad], 0.055, 0.105);
    if (!spot) return this.hint('No free space in the Source Zone');
    this.addCore(squad, squad, { x: spot[0], y: CORE.h / 2 + 0.002, z: spot[1] });
    this.hp[squad].cores--;
    F.hpRacks[squad].setCount(this.hp[squad].cores);
    this.sim.audio.beep(660, 0.05);
  }
  payloadAction(robotId) {
    if (this.state !== 'running') return this.hint('Human Players act only during the match');
    const robot = this.sim.robots[robotId];
    const p = this.payloads[robotId];
    if (p.where !== 'hp') return this.hint(`${robot.name} PAYLOAD is already in play`);
    const F = this.sim.field;
    if (robot.zone && robot.zone.ownSource && !robot.payloadJoint && robot.tray < 2) {
      robot.loadPayload(p);                       // R9.2: loaded directly onto the robot in the Source Zone
      this.log(`${robot.name} PAYLOAD loaded into the Cargo Bay`, robot.squad);
    } else {
      if (this.sim.robots.some((r) => r.squad === robot.squad && r.zone && r.zone.ownSource)) return this.hint(`G4.10: drive ${robot.name} into the Source Zone to load it, or clear the zone first`);
      const spot = this.freeSpot(F.sourceZones[robot.squad], 0.075, 0.13);
      if (!spot) return this.hint('No free space in the Source Zone');
      p.spawn({ x: spot[0], y: PAYLOAD.size / 2 + 0.002, z: spot[1] });
      p.where = 'field'; p.viaCargo = false; p.invalid = false;
      this.log(`${robot.name} PAYLOAD placed in the Source Zone`, robot.squad);
    }
    this.sim.audio.beep(520, 0.05);
  }
  pressStarburst(squad) {
    if (this.state !== 'running') return this.hint('STARBURST can only be activated during the match');
    const sb = this.starburst[squad];
    if (sb.active) return this.hint(`${squad.toUpperCase()} STARBURST is already active`);
    const sc = this.score[squad];
    if (!sc.payloadScored) return this.hint(`Scorer: ${squad} has not scored a PAYLOAD yet (3.3.6)`);
    const thr = MATCH.starburstThreshold - MATCH.payloadReduction;
    if (sc.squadCores < thr) return this.hint(`Scorer: ${squad} has ${sc.squadCores}/${thr} COREs — threshold not met`);
    this.activateStarburst(squad, 'button');
  }
  hint(text) {
    if (this.sim.net && this.sim.net.routeHint(text)) return false;   // online: tell the player who asked
    this.sim.hud && this.sim.hud.toast(text); return false;
  }
  freeSpot(poly, margin, sep) {
    const xs = poly.map((p) => p[0]), zs = poly.map((p) => p[1]);
    const others = [...this.cores.map((c) => c.pos()), ...this.payloads.filter((p) => p.body).map((p) => p.pos())];
    for (let k = 0; k < 200; k++) {
      const x = Math.min(...xs) + Math.random() * (Math.max(...xs) - Math.min(...xs));
      const z = Math.min(...zs) + Math.random() * (Math.max(...zs) - Math.min(...zs));
      if (!pointInPoly([x, z], poly)) continue;
      if (distToPolyEdge([x, z], poly) < margin) continue;
      if (others.some((o) => Math.hypot(o.x - x, o.z - z) < sep)) continue;
      if (this.sim.robots.some((r) => pointInPoly([x, z], r.footprint()))) continue;
      return [x, z];
    }
    return null;
  }

  // ------------------------------------------------------------ STARBURST
  checkStarburst() {
    for (const s of ['red', 'blue']) {
      if (this.starburst[s].active) continue;
      if (this.score[s].squadCores >= MATCH.starburstThreshold) this.activateStarburst(s, 'auto');
    }
  }
  activateStarburst(s, how) {
    const sb = this.starburst[s];
    sb.active = true; sb.how = how; sb.at = this.remaining;
    this.sim.field.vaults[s].setOpen(true);
    this.updateLeds();
    this.log(`${s.toUpperCase()} STARBURST MODE ${how === 'button' ? 'activated by Human Player (early, Payload scored)' : 'activated automatically (10+ COREs)'} — Vault open`, s, 'phase');
    this.sim.audio.buzzer('starburst');
    this.signal('starburst', { squad: s, how });
  }
  updateLeds() {
    for (const s of ['red', 'blue']) {
      const b = this.sim.field.buttons[s];
      const on = this.starburst[s].active;
      b.ledMat.color.setHex(on ? (s === 'red' ? 0xff3030 : 0x3060ff) : 0x333333);
      b.ledMat.emissive.setHex(on ? (s === 'red' ? 0xff1010 : 0x1040ff) : 0x000000);
      b.ledMat.emissiveIntensity = on ? 2 : 0;
    }
  }

  // ------------------------------------------------------------ G4.5 descoring by an opponent
  checkDescoring() {
    const now = new Map();
    for (const c of this.cores) now.set(c, c.scored);
    if (this.state === 'running') {
      for (const [c, was] of this.prevScored) {
        if (!was || now.get(c)) continue;
        const opp = this.sim.robots.find((r) => r.squad !== c.owner && c.colliders.some((cc) => (r.contacts.get(cc.handle) || 0) > 0));
        if (opp) this.foul(opp, 'major', 'G4.5', `de-scored a ${c.color} CORE`);
      }
    }
    this.prevScored = now;
  }

  // ------------------------------------------------------------ scoring (4.5) — evaluated continuously, final at match end
  computeScore() {
    const F = this.sim.field;
    const S = {};
    for (const s of ['red', 'blue']) {
      S[s] = { high: 0, star: 0, apex: 0, drop: 0, gStar: 0, gDrop: 0, starMaps: 0, station: 0, stationDetail: [], payloadScored: false, payloads: 0, payloadBonus: 0, squadCores: 0, foulPts: 0, total: 0, starPolePts: 0, endgamePts: 0 };
    }
    const threaded = new Map(F.poles.map((p) => [p, []]));
    for (const c of this.cores) {
      c.scored = null;
      if (c.heldBy) continue;
      const t = c.pos();
      if (t.y < -0.2) continue;
      const a = c.axis();
      const up = Math.abs(a.y);
      for (const p of F.poles) {
        const d = Math.hypot(t.x - p.x, t.z - p.z);
        if (d > CORE.rIn - 0.0127 + 0.006) continue;
        if (up < COS40) continue;
        if (t.y < p.base || t.y > p.top - 0.003) continue;   // fully threaded: ring centre below the pole top
        threaded.get(p).push(c);
        c.scored = 'pole';
        break;
      }
      if (c.scored) continue;
      // DROP ZONE: completely inside the taped zone and touching the tile (3.6.1)
      const rim = ringRim(t, a);
      const lowest = t.y - (CORE.h / 2) * up - CORE.rOut * Math.sqrt(Math.max(0, 1 - up * up));
      if (lowest > 0.004) continue;
      for (const s of ['red', 'blue']) {
        if (rim.every((p) => pointInPoly(p, F.dropZones[s]))) {
          if (c.golden && c.owner === s) { S[s].gDrop++; c.scored = 'drop'; }
          else if (c.color === s) { S[s].drop++; S[s].squadCores++; c.scored = 'drop'; }
        }
      }
    }
    for (const [p, list] of threaded) {
      list.sort((u, v) => u.pos().y - v.pos().y);
      const scored = list.slice(0, p.capacity);
      const s = p.squad, sc = S[s];
      for (const c of scored) {
        if (p.type === 'high' && c.color === s) { sc.high++; sc.squadCores++; }
        else if (p.type === 'star') {
          if (c.color === s) { sc.star++; sc.squadCores++; } else if (c.golden && c.owner === s) sc.gStar++;
        } else if (p.type === 'apex' && c.color === s) {
          const r = c.release;
          if (r && r.levelUp && r.stationed && r.robot.squad === s) { sc.apex++; sc.squadCores++; }
        }
      }
      if (p.type === 'star' && scored.length === 3) {
        const seq = [...scored].reverse().map((c) => (c.color === s ? 'C' : c.golden && c.owner === s ? 'G' : 'X'));
        if (seq.join('') === this.starMap.join('')) sc.starMaps++;
      }
    }
    // PAYLOADS (3.7)
    for (const p of this.payloads) {
      p.scored = false;
      if (p.where !== 'field' || !p.body || !p.viaCargo || p.invalid) continue;
      const corners = boxCorners(p.body);
      const low = Math.min(...corners.map((c) => c.y));
      if (low > 0.004) continue;
      if (corners.every((c) => pointInPoly([c.x, c.z], F.dropZones[p.squad]))) { p.scored = true; S[p.squad].payloads++; }
    }
    // SPACE STATION (own station only): End Game points, so they count during LEVEL UP and at the final buzzer
    const endgame = this.isLevelUp() || this.state === 'post' || this.state === 'final';
    for (const r of this.sim.robots) {
      const st = r.stationSquad === r.squad ? r.stationState : 'none';
      const pts = st === 'none' || !endgame ? 0 : POINTS.station[st];
      S[r.squad].station += pts;
      S[r.squad].stationDetail.push({ robot: r.name, state: r.stationSquad && r.stationSquad !== r.squad ? `${r.stationState} (opp.)` : st, pts });
    }
    for (const s of ['red', 'blue']) {
      const sc = S[s];
      sc.payloadScored = sc.payloads > 0;
      const teams = this.sim.robots.filter((r) => r.squad === s).length;
      sc.payloadBonus = sc.payloads >= teams ? POINTS.payloadBonus : 0;
      sc.corePts = sc.high * POINTS.core.high + sc.star * POINTS.core.star + sc.apex * POINTS.core.apex + sc.drop * POINTS.core.drop
        + sc.gStar * POINTS.golden.star + sc.gDrop * POINTS.golden.drop;
      sc.starBonus = sc.starMaps * POINTS.starBonus;
      sc.starPolePts = sc.star * POINTS.core.star + sc.gStar * POINTS.golden.star + sc.starBonus;
      sc.endgamePts = sc.station + sc.apex * POINTS.core.apex;
      sc.foulPts = this.fouls[OPP[s]].reduce((a, f) => a + (f.type === 'major' ? POINTS.majorFoul : POINTS.minorFoul), 0);
      sc.total = sc.corePts + sc.starBonus + sc.payloadBonus + sc.station + sc.foulPts;
    }
    return S;
  }

  finalize() {
    if (this.state === 'final') return;
    const S = this.computeScore();
    const res = {};
    for (const s of ['red', 'blue']) {
      const o = OPP[s];
      const rp = { win: 0, tie: 0, starburst: 0, pattern: 0, endgame: 0 };
      if (S[s].total > S[o].total) rp.win = RP.win; else if (S[s].total === S[o].total) rp.tie = RP.tie;
      if (S[s].squadCores >= RP.starburstCores) rp.starburst = 1;
      if (S[s].starPolePts >= RP.patternPoints) rp.pattern = 1;
      if (S[s].endgamePts >= RP.levelUpPoints) rp.endgame = 1;
      res[s] = { ...S[s], rp, rpTotal: Object.values(rp).reduce((a, b) => a + b, 0) };
    }
    this.final = res;
    this.score = S;
    this.state = 'final';
    this.log(`FINAL: RED ${S.red.total} — BLUE ${S.blue.total}`, null, 'phase');
    this.emit();
    this.signal('final', res);
  }
}

// ---------------------------------------------------------------- helpers
export function fmtTime(s) {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}
function ringRim(t, a) {
  // 8 points on each rim circle of a ring with axis a, projected to x/z
  let u = cross(a, { x: 0, y: 1, z: 0 });
  if (Math.hypot(u.x, u.y, u.z) < 1e-3) u = { x: 1, y: 0, z: 0 }; else u = norm(u);
  const v = norm(cross(a, u));
  const pts = [];
  for (const sgn of [-1, 1]) {
    for (let k = 0; k < 8; k++) {
      const ang = (k / 8) * Math.PI * 2, cs = Math.cos(ang) * CORE.rOut, sn = Math.sin(ang) * CORE.rOut;
      pts.push([t.x + u.x * cs + v.x * sn + a.x * sgn * CORE.h / 2, t.z + u.z * cs + v.z * sn + a.z * sgn * CORE.h / 2]);
    }
  }
  return pts;
}
function boxCorners(body) {
  const t = body.translation(), q = body.rotation(), h = PAYLOAD.size / 2;
  const out = [];
  for (const x of [-h, h]) for (const y of [-h, h]) for (const z of [-h, h]) {
    const r = qrot(q, { x, y, z }); out.push({ x: t.x + r.x, y: t.y + r.y, z: t.z + r.z });
  }
  return out;
}
function boxLowestY(body) { return Math.min(...boxCorners(body).map((c) => c.y)); }
function distToPolyEdge(c, poly) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const abx = b[0] - a[0], abz = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((c[0] - a[0]) * abx + (c[1] - a[1]) * abz) / (abx * abx + abz * abz)));
    best = Math.min(best, Math.hypot(a[0] + abx * t - c[0], a[1] + abz * t - c[1]));
  }
  return best;
}
