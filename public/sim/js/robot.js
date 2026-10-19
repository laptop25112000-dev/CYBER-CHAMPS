import * as THREE from 'three';
import { toCreasedNormals, mergeGeometries } from '../lib/BufferGeometryUtils.js';
import {
  RAPIER, G, robotBit, groups, qrot, add, sub, scl, dot, cross, norm, pointVel, quatYaw,
} from './physics.js';
import { ROBOT, COLORS, PAYLOAD } from './config.js';

const DEG = Math.PI / 180;

// ---------------------------------------------------------------- CAD model (shared by all robots)
export async function loadRobotModel(base = 'assets/') {
  const [meta, bin] = await Promise.all([
    fetch(base + 'robot.json?v=2').then((r) => r.json()),
    fetch(base + 'robot.bin?v=2').then((r) => r.arrayBuffer()),
  ]);
  const parts = meta.parts.map((p) => {
    const geo = new THREE.BufferGeometry();
    let pos;
    if (meta.format === 'int16') { // quantised positions (±0.5 m, 15 µm steps)
      const q = new Int16Array(bin, p.pOff, p.pLen);
      pos = new Float32Array(q.length);
      for (let i = 0; i < q.length; i++) pos[i] = q[i] * meta.posScale;
    } else pos = new Float32Array(bin, p.pOff, p.pLen);
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setIndex(new THREE.BufferAttribute(p.i16 ? new Uint16Array(bin, p.iOff, p.iLen) : new Uint32Array(bin, p.iOff, p.iLen), 1));
    const g2 = toCreasedNormals(geo, 32 * DEG);
    g2.computeBoundingSphere();
    return { ...p, geo: g2, squadMarker: p.names.some((n) => n.startsWith('Squad Marker')) };
  });
  return { meta, parts };
}

function mergedParts(model, P) {
  if (model.merged) return model.merged;
  const pivots = { armLower: P.armLower, armUpper: P.armUpper, gearL: P.gearL, gearR: P.gearR, wheelFL: P.wheelFL, wheelFR: P.wheelFR, wheelRL: P.wheelRL, wheelRR: P.wheelRR };
  const buckets = new Map();
  for (const part of model.parts) {
    const translucent = part.names.includes('Top Plate');
    const key = part.squadMarker ? 'squad' : part.color.join(',') + (translucent ? 't' : '');
    const k = `${part.group}|${key}`;
    if (!buckets.has(k)) buckets.set(k, { group: part.group, key, part, geos: [] });
    const pv = pivots[part.group];
    const g = part.geo.clone();
    if (pv) g.translate(-pv[0], -pv[1], -pv[2]);
    buckets.get(k).geos.push(g);
  }
  model.merged = [...buckets.values()].map((b) => {
    const geo = b.geos.length > 1 ? mergeGeometries(b.geos) : b.geos[0];
    geo.computeBoundingSphere();
    return { group: b.group, key: b.key, part: b.part, geo };
  });
  return model.merged;
}

// ---------------------------------------------------------------- robot geometry (local: +X fwd, +Y up, +Z right)
const R = ROBOT.wheelR;
const SUSP_REST = 0.004;            // spring free length
const SUSP_STATIC = 0.002;          // static compression
const OMEGA_FREE = ROBOT.motorFreeRPM * 2 * Math.PI / 60;
const V_FREE = OMEGA_FREE * R;      // wheel surface speed at free running
// drive force at the tyre for a wheel surface speed u (DC motor: torque falls linearly with speed)
function motorForce(duty, u) {
  const tau = ROBOT.motorStallTorque * (duty - u / V_FREE);
  return Math.max(-ROBOT.motorStallTorque, Math.min(ROBOT.motorStallTorque, tau)) / R;
}

// collider boxes [center, halfExtents] (from the STEP model, see README)
const CH_BOXES = [
  [[-0.0745, 0.057, 0], [0.0745, 0.039, 0.111]],     // rear block (under top plate)
  [[0.033, 0.0265, 0], [0.033, 0.0085, 0.111]],      // drive base middle section
  [[0.0745, 0.057, -0.0805], [0.0745, 0.039, 0.0305]], // left prong (front cut-out is 100 mm wide)
  [[0.0745, 0.057, 0.0805], [0.0745, 0.039, 0.0305]],  // right prong
  [[-0.045, 0.104, 0], [0.04, 0.0065, 0.05]],        // HEXA hub on top plate
];
const END_BOXES = {                  // gripper parts that follow the parallelogram coupler (pose at CAD angle)
  coupler: [[0.1285, 0.1116, 0], [0.0075, 0.025, 0.010]],
  gripBase: [[0.153, 0.0941, 0], [0.034, 0.0105, 0.035]],
  servo: [[0.152, 0.1306, 0], [0.014, 0.026, 0.036]],
};
const FINGER = { c: [0.213, 0.0991], h: [0.034, 0.0105, 0.007], zL: -0.025, zR: 0.0285 };
const TRAY = { hinge: [-0.150, 0.113], len: 0.125, width: 0.13, wall: 0.035 };

export class Robot {
  constructor(sim, team, model) {
    this.sim = sim;
    this.id = team.id; this.name = team.name; this.squad = team.squad; this.number = team.number;
    this.team = team;
    this.bit = robotBit(team.id);
    const P = model.meta.pivots;
    this.P = P;
    this.theta0 = model.meta.armAngle0Deg * DEG;
    this.L = model.meta.armLinkLength;
    this.buildVisual(model);
    this.buildPhysics();
    this.reset();
  }

  // ------------------------------------------------------------ visual
  buildVisual(model) {
    const root = new THREE.Group();
    const groupsMap = {};
    const P = this.P;
    const mk = (name, pivot) => {
      const g = new THREE.Group();
      if (pivot) g.position.set(...pivot);
      groupsMap[name] = g;
      return g;
    };
    const chassis = mk('chassis'); root.add(chassis);
    const lower = mk('armLower', P.armLower); root.add(lower);
    const upper = mk('armUpper', P.armUpper); root.add(upper);
    const end = mk('end'); root.add(end);
    for (const f of ['fingerL', 'fingerR', 'linkL', 'linkR']) end.add(mk(f));
    end.add(mk('gearL', P.gearL)); end.add(mk('gearR', P.gearR));
    for (const w of ['wheelFL', 'wheelFR', 'wheelRL', 'wheelRR']) root.add(mk(w, P[w]));
    const squadCol = this.squad === 'red' ? COLORS.red : COLORS.blue;
    const matCache = {};
    // CAD parts that move together and share a material are drawn as one mesh (built once, shared by all robots)
    for (const { group, key, geo, part } of mergedParts(model, P)) {
      const g = groupsMap[group] || chassis;
      if (!matCache[key]) {
        const c = part.squadMarker ? new THREE.Color(squadCol) : new THREE.Color(part.color[0], part.color[1], part.color[2]);
        const translucent = part.names.includes('Top Plate');
        matCache[key] = new THREE.MeshStandardMaterial({
          color: c, roughness: 0.55, metalness: part.color[0] > 0.55 && part.color[0] < 0.9 && !part.squadMarker ? 0.35 : 0.05,
          transparent: translucent, opacity: translucent ? 0.55 : 1, depthWrite: !translucent,
        });
      }
      const m = new THREE.Mesh(geo, matCache[key]);
      m.castShadow = true; m.receiveShadow = true;
      g.add(m);
    }
    // CARGO BAY (not in the CAD model: a rear dump tray on the top plate, see README)
    const tray = new THREE.Group(); tray.position.set(TRAY.hinge[0], TRAY.hinge[1], 0); root.add(tray);
    const trayMat = new THREE.MeshStandardMaterial({ color: 0x9aa3ad, roughness: 0.5, metalness: 0.4 });
    const tb = new THREE.Mesh(new THREE.BoxGeometry(TRAY.len, 0.004, TRAY.width), trayMat); tb.position.set(TRAY.len / 2, 0.002, 0); tray.add(tb);
    for (const sz of [-1, 1]) {
      const w = new THREE.Mesh(new THREE.BoxGeometry(TRAY.len, TRAY.wall, 0.004), trayMat); w.position.set(TRAY.len / 2, TRAY.wall / 2, sz * TRAY.width / 2); tray.add(w);
    }
    const fw = new THREE.Mesh(new THREE.BoxGeometry(0.004, TRAY.wall, TRAY.width), trayMat); fw.position.set(TRAY.len, TRAY.wall / 2, 0); tray.add(fw);
    [tb].forEach((m) => { m.castShadow = true; });
    groupsMap.tray = tray;
    // team number plate (R4) on the back + floating label
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(3.5 * 0.0254, 2 * 0.0254), new THREE.MeshBasicMaterial({ map: numberTexture(this.number, squadCol) }));
    plate.position.set(-0.151, 0.06, 0); plate.rotation.y = -Math.PI / 2; root.add(plate);
    this.plate = plate; this.squadCol = squadCol;
    // name tag: a constant size on screen, however near or far the robot is
    const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(this.name, this.number, squadCol), depthTest: false, transparent: true, sizeAttenuation: false }));
    label.scale.set(0.084, 0.021, 1); label.position.set(0, 0.36, 0); label.renderOrder = 10; root.add(label);
    this.label = label;
    this.root = root; this.g = groupsMap;
    this.sim.scene.add(root);
    // driver aid: vertical guide under a held CORE (shows where it will drop)
    const gm = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false });
    this.guide = new THREE.Mesh(new THREE.CylinderGeometry(0.0015, 0.0015, 1, 6), gm);
    const dot = new THREE.Mesh(new THREE.RingGeometry(0.0115, 0.0135, 24), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, depthWrite: false, side: THREE.DoubleSide }));
    dot.rotation.x = -Math.PI / 2;
    this.guideDot = dot;
    this.target = new THREE.Mesh(new THREE.RingGeometry(0.051, 0.068, 48), new THREE.MeshBasicMaterial({ color: 0x5dffa8, transparent: true, opacity: 1, depthWrite: false, side: THREE.DoubleSide }));
    this.target.rotation.x = -Math.PI / 2; this.target.visible = false; this.target.renderOrder = 4;
    this.sim.scene.add(this.target);
    this.guide.visible = dot.visible = false;
    this.sim.scene.add(this.guide, dot);
  }

  // ------------------------------------------------------------ physics
  buildPhysics() {
    const { world } = this.sim;
    const team = this.team;
    const start = this.startPose();
    this.body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(start.x, 0.0005, start.z).setRotation(quatYaw(start.yaw))
      .setCanSleep(false).setCcdEnabled(true).setLinearDamping(0.02).setAngularDamping(0.05)
      .setAdditionalMassProperties(ROBOT.mass, { x: -0.01, y: 0.05, z: 0 }, { x: 0.043, y: 0.066, z: 0.029 }, { x: 0, y: 0, z: 0, w: 1 }));
    this.body.userData = { robot: this };
    const gr = groups(this.bit, G.ALL);
    const ev = RAPIER.ActiveEvents.COLLISION_EVENTS;
    const box = ([c, h], fr = 0.4) => world.createCollider(RAPIER.ColliderDesc.cuboid(h[0], h[1], h[2]).setTranslation(c[0], c[1], c[2])
      .setDensity(0).setFriction(fr).setCollisionGroups(gr).setActiveEvents(ev), this.body);
    this.colliders = [];
    this.chassisCols = CH_BOXES.map((b) => box(b));
    this.colliders.push(...this.chassisCols);
    // wheels (side contact only; traction comes from the ray-cast wheel model)
    this.hard = [];
    this.wheels = ['wheelFL', 'wheelFR', 'wheelRL', 'wheelRR'].map((k) => {
      const p = this.P[k];
      const c = world.createCollider(RAPIER.ColliderDesc.cylinder(0.028, R - 0.0045).setTranslation(p[0], p[1], p[2])
        .setRotation({ x: Math.SQRT1_2, y: 0, z: 0, w: Math.SQRT1_2 }).setDensity(0).setFriction(0.6).setCollisionGroups(gr).setActiveEvents(ev), this.body);
      this.colliders.push(c);
      const hard = { x: p[0], y: p[1] + SUSP_STATIC, z: p[2] };
      this.hard.push(hard);
      return { key: k, left: p[2] < 0, collider: c, spin: 0, omega: 0, ground: null, load: 0 };
    });
    // arm + gripper (moving colliders on the robot body)
    const link = () => world.createCollider(RAPIER.ColliderDesc.cuboid(this.L / 2 + 0.012, 0.006, 0.014).setDensity(0).setFriction(0.4).setCollisionGroups(gr).setActiveEvents(ev), this.body);
    this.lowerCol = link(); this.upperCol = link();
    this.endCols = {};
    for (const [k, b] of Object.entries(END_BOXES)) this.endCols[k] = box(b, 0.5);
    const fh = FINGER.h;
    this.fingerL = world.createCollider(RAPIER.ColliderDesc.cuboid(fh[0], fh[1], fh[2]).setDensity(0).setFriction(0.8).setCollisionGroups(gr).setActiveEvents(ev), this.body);
    this.fingerR = world.createCollider(RAPIER.ColliderDesc.cuboid(fh[0], fh[1], fh[2]).setDensity(0).setFriction(0.8).setCollisionGroups(gr).setActiveEvents(ev), this.body);
    this.coreMechCols = [this.lowerCol, this.upperCol, ...Object.values(this.endCols), this.fingerL, this.fingerR];
    this.colliders.push(...this.coreMechCols);
    this.colliderSet = new Set(this.colliders.map((c) => c.handle));
    this.coreMechSet = new Set(this.coreMechCols.map((c) => c.handle));
    for (const c of this.colliders) this.sim.registerCollider(c, { type: 'robot', robot: this, coreMech: this.coreMechSet.has(c.handle) });
  }

  startPose() {
    const X = this.team.startX;
    const red = this.squad === 'red';
    // touching the field wall (G3.4), inside the 48 x 24 in START ZONE, facing the field
    const Y = red ? 6.0 : 144 - 6.0;
    return { x: (X - 72) * 0.0254, z: (Y - 72) * 0.0254, yaw: red ? -Math.PI / 2 : Math.PI / 2 };
  }

  reset() {
    const s = this.startPose();
    this.releaseCore(false);
    this.releasePayload(false);
    this.body.setTranslation({ x: s.x, y: 0.0005, z: s.z }, true);
    this.body.setRotation(quatYaw(s.yaw), true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true); this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    this.theta = this.theta0; this.thetaTarget = this.theta0;
    this.finger = ROBOT.fingerClosed; this.fingerTarget = ROBOT.fingerClosed; this.gripClosed = true;
    this.tray = 0; this.trayTarget = 0;
    this.cmd = { throttle: 0, turn: 0, arm: 0 };
    this.enabled = false;
    this.heldCore = null; this.coreJoint = null;
    this.payloadJoint = null;
    this.contacts = new Map();        // other collider handle -> number of my colliders touching it
    this.pairContacts = new Map();    // other collider handle -> Set(my collider handles)
    this.wheels.forEach((w) => { w.ground = null; w.spin = 0; w.omega = 0; });
    this.stationState = 'none'; this.stationSquad = null;
    this.updateMechColliders();
  }

  // team number shown on the number plate (R4) and the name tag
  setNumber(num) {
    if (num === this.number) return;
    this.number = num;
    const swap = (mat, tex) => { if (mat.map) mat.map.dispose(); mat.map = tex; mat.needsUpdate = true; };
    swap(this.plate.material, numberTexture(num, this.squadCol));
    swap(this.label.material, labelTexture(this.name, num, this.squadCol));
  }

  // move the robot (and anything it carries) instantly — used by tests / debugging
  teleport(x, z, yaw) {
    const q = quatYaw(yaw);
    this.body.setTranslation({ x, y: 0.001, z }, true); this.body.setRotation(q, true);
    this.body.setLinvel({ x: 0, y: 0, z: 0 }, true); this.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
    const carry = (b, local) => { b.setTranslation(this.toWorld(local), true); b.setRotation(q, true); b.setLinvel({ x: 0, y: 0, z: 0 }, true); b.setAngvel({ x: 0, y: 0, z: 0 }, true); };
    if (this.heldCore) carry(this.heldCore.body, this.holdLocal());
    if (this.payloadJoint) carry(this.sim.game.payloads[this.id].body, this.trayPointLocal());
  }

  // hold point of the gripper (center of a gripped CORE) in robot-local coords
  holdLocal(theta = this.theta) {
    const h = this.P.holdPoint;
    return { x: h[0] + this.L * (Math.cos(theta) - Math.cos(this.theta0)), y: h[1] + this.L * (Math.sin(theta) - Math.sin(this.theta0)), z: h[2] };
  }
  endOffset() {
    return [this.L * (Math.cos(this.theta) - Math.cos(this.theta0)), this.L * (Math.sin(this.theta) - Math.sin(this.theta0))];
  }
  toWorld(p) { return add(this.body.translation(), qrot(this.body.rotation(), p)); }
  toLocal(p) {
    const q = this.body.rotation();
    return qrot({ x: -q.x, y: -q.y, z: -q.z, w: q.w }, sub(p, this.body.translation()));
  }

  updateMechColliders() {
    const th = this.theta;
    const qz = { x: 0, y: 0, z: Math.sin(th / 2), w: Math.cos(th / 2) };
    const P = this.P;
    const half = this.L / 2;
    this.lowerCol.setTranslationWrtParent({ x: P.armLower[0] + Math.cos(th) * half, y: P.armLower[1] + Math.sin(th) * half, z: 0 });
    this.lowerCol.setRotationWrtParent(qz);
    this.upperCol.setTranslationWrtParent({ x: P.armUpper[0] + Math.cos(th) * half, y: P.armUpper[1] + Math.sin(th) * half, z: 0 });
    this.upperCol.setRotationWrtParent(qz);
    const [dx, dy] = this.endOffset();
    for (const [k, b] of Object.entries(END_BOXES)) this.endCols[k].setTranslationWrtParent({ x: b[0][0] + dx, y: b[0][1] + dy, z: b[0][2] });
    this.fingerL.setTranslationWrtParent({ x: FINGER.c[0] + dx, y: FINGER.c[1] + dy, z: FINGER.zL - this.finger });
    this.fingerR.setTranslationWrtParent({ x: FINGER.c[0] + dx, y: FINGER.c[1] + dy, z: FINGER.zR + this.finger });
  }

  trayPointLocal() {
    const a = this.tray * DEG;
    // payload center sits 0.055 above tray floor, 0.065 from the hinge
    const lx = 0.065, ly = PAYLOAD.size / 2 + 0.004;
    return { x: TRAY.hinge[0] + lx * Math.cos(a) - ly * Math.sin(a), y: TRAY.hinge[1] + lx * Math.sin(a) + ly * Math.cos(a), z: 0 };
  }

  // ------------------------------------------------------------ per-substep physics
  step(dt) {
    const world = this.sim.world;
    const b = this.body;
    const t = b.translation(), q = b.rotation();
    const up = qrot(q, { x: 0, y: 1, z: 0 }), fwd = qrot(q, { x: 1, y: 0, z: 0 });
    const down = scl(up, -1);
    const m = ROBOT.mass;
    const k = (m * 9.81 / 4) / SUSP_STATIC, c = 2 * 0.7 * Math.sqrt(k * m / 4);
    let L = 0, Rt = 0;
    if (this.enabled) {
      L = this.cmd.throttle + this.cmd.turn; Rt = this.cmd.throttle - this.cmd.turn;
      const mx = Math.max(1, Math.abs(L), Math.abs(Rt)); L /= mx; Rt /= mx;
    }
    const qGroups = groups(G.ALL, G.ENV | G.STATION);
    // pass 1: evaluate every wheel against the same velocity snapshot; pass 2: apply impulses
    const apply = [];
    for (let i = 0; i < 4; i++) {
      const w = this.wheels[i];
      const duty = w.left ? L : Rt;
      const hp = add(t, qrot(q, this.hard[i]));
      const hit = world.castRayAndGetNormal(new RAPIER.Ray(hp, down), SUSP_REST + R, true, undefined, qGroups, undefined, b);
      if (!hit) { w.ground = null; w.load = 0; w.omega += (duty * OMEGA_FREE - w.omega) * Math.min(1, dt * 20); continue; }
      const s = hit.toi - R;
      const p = add(hp, scl(down, hit.toi));
      let n = hit.normal; if (dot(n, up) < 0) n = scl(n, -1);
      const other = hit.collider.parent();
      const otherDyn = other && other.isDynamic();
      let vrel = pointVel(b, p);
      if (otherDyn) vrel = sub(vrel, pointVel(other, p));
      let N = k * (SUSP_REST - s) + c * dot(vrel, down);
      if (N < 0) N = 0;
      let f = sub(fwd, scl(n, dot(fwd, n))); f = norm(f);
      const l = cross(n, f);
      const vl = dot(vrel, f), vlat = dot(vrel, l);
      const omega = vl / R;
      let tau = ROBOT.motorStallTorque * (duty - omega / OMEGA_FREE);
      tau = Math.max(-ROBOT.motorStallTorque, Math.min(ROBOT.motorStallTorque, tau));
      let Fx = tau / R;
      // static terms predict this step's gravity pull so a parked robot does not creep
      const gl = -9.81 * f.y * dt, glat = -9.81 * l.y * dt;
      if (Math.abs(duty) < 0.05) { // gearbox back-drive resistance (holds the robot on a tilted station)
        const fs = -(vl + gl) * (m / 4) / dt - Fx;
        Fx += Math.max(-ROBOT.gearHold, Math.min(ROBOT.gearHold, fs));
      }
      let Fy = -(vlat + glat) * (m / 4) / dt * 0.9;
      const lim = ROBOT.mu * N;
      let spin = omega;
      if (Math.hypot(Fx, Fy) > lim) {
        // the tyre slides: kinetic friction acts against the slip velocity (the contact patch's motion over the
        // floor), and the wheel spins at the speed where motor torque equals the friction torque. This is what
        // lets a skid-steer robot turn: wheels spinning past the ground speed put their grip into drive force.
        const fk = ROBOT.muKinetic * N;
        const g = (u) => { const sx = u - vl, s = Math.hypot(sx, vlat) || 1e-9; return motorForce(duty, u) - fk * sx / s; };
        let lo = -3 * V_FREE, hi = 3 * V_FREE;
        for (let it = 0; it < 22; it++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
        const u = (lo + hi) / 2, sx = u - vl, s = Math.hypot(sx, vlat) || 1e-9;
        Fx = fk * sx / s; Fy = -fk * vlat / s;
        spin = u / R;
      }
      const F = add(add(scl(f, Fx), scl(l, Fy)), scl(n, N));
      apply.push([F, p, otherDyn ? other : null]);
      w.ground = hit.collider.handle; w.load = N;
      w.omega += (spin - w.omega) * Math.min(1, dt * 30);
    }
    // applied as forces so the solver integrates them in every substep, exactly like gravity
    b.resetForces(false); b.resetTorques(false);
    for (const [F, p, other] of apply) {
      b.addForceAtPoint(F, p, true);
      if (other) {
        const back = scl(F, -1);
        other.addForceAtPoint(back, p, true);
        const st = other.userData && other.userData.station;
        if (st) st.addLoad(other, p, back);
      }
    }
    // servos (arm, gripper, cargo tray) — powered only while enabled (G1.4, G5.3)
    if (this.enabled) {
      this.thetaTarget = Math.max(ROBOT.armMin * DEG, Math.min(ROBOT.armMax * DEG, this.thetaTarget + this.cmd.arm * ROBOT.armRate * DEG * dt));
      const d = this.thetaTarget - this.theta, mxs = ROBOT.servoMax * DEG * dt;
      this.theta += Math.max(-mxs, Math.min(mxs, d));
      const df = this.fingerTarget - this.finger, mf = ROBOT.fingerRate * dt;
      this.finger += Math.max(-mf, Math.min(mf, df));
      const dtr = this.trayTarget - this.tray, mt = ROBOT.trayRate * dt;
      this.tray += Math.max(-mt, Math.min(mt, dtr));
      if (this.payloadJoint && this.tray > 62) this.releasePayload(true);
      if (this.tray >= ROBOT.trayDump - 0.5) this.trayTarget = 0;
    }
    this.updateMechColliders();
    if (this.coreJoint) this.coreJoint.setAnchor1(this.holdLocal());
    if (this.payloadJoint) this.payloadJoint.setAnchor1(this.trayPointLocal());
    for (const w of this.wheels) w.spin += w.omega * dt;
  }

  // ------------------------------------------------------------ gripper
  toggleGrip() {
    if (!this.enabled) return;
    if (this.gripClosed) { // open
      this.gripClosed = false; this.fingerTarget = ROBOT.fingerOpen;
      this.releaseCore(true);
    } else {
      this.gripClosed = true;
      const core = this.findGrippableCore();
      if (core) { this.attachCore(core); this.fingerTarget = ROBOT.fingerHold; } else { this.fingerTarget = ROBOT.fingerClosed; this.explainMiss(); }
    }
  }
  // the open fingers (85 mm apart) catch a ring anywhere between them and centre it as they close
  findGrippableCore(loose = 1) {
    if (this.finger < ROBOT.fingerHold - 0.002) return null;   // fingers must be open wide enough to surround the ring
    const h = this.holdLocal();
    const myUp = qrot(this.body.rotation(), { x: 0, y: 1, z: 0 });
    let best = null, bestD = Infinity;
    for (const core of this.sim.game.cores) {
      if (core.heldBy) continue;
      if (core.golden && !this.sim.game.starburst[core.owner].active) continue; // VAULT locked until STARBURST
      const lp = this.toLocal(core.pos());
      const dx = lp.x - h.x, dy = lp.y - h.y, dz = lp.z - h.z;
      if (Math.abs(dx) > 0.045 * loose || Math.abs(dz) > 0.045 * loose || Math.abs(dy) > 0.03 * loose) continue;
      if (Math.abs(dot(core.axis(), myUp)) < Math.cos(35 * DEG)) continue;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < bestD) { bestD = d; best = core; }
    }
    return best;
  }
  // tell the driver why the gripper closed on nothing
  explainMiss() {
    const g = this.sim.game, h = this.holdLocal();
    let near = null, nd = Infinity;
    for (const core of g.cores) {
      if (core.heldBy) continue;
      const lp = this.toLocal(core.pos()), d = Math.hypot(lp.x - h.x, lp.z - h.z);
      if (d < nd) { nd = d; near = { core, lp }; }
    }
    if (!near || nd > 0.2) return;
    const { core, lp } = near;
    if (core.golden && !g.starburst[core.owner].active) g.hint('The VAULT stays locked until STARBURST');
    else if (lp.y - h.y < -0.03) g.hint(`${this.name}: lower the arm to reach the CORE`);
    else if (lp.y - h.y > 0.03) g.hint(`${this.name}: raise the arm to reach the CORE`);
    else g.hint(`${this.name}: line the CORE up between the fingers`);
  }
  attachCore(core) {
    const world = this.sim.world;
    core.heldBy = this; core.release = null;
    // G4.6: controlling an opponent's CORE is a Minor Foul (once per CORE per robot)
    if (core.owner !== this.squad) { core.foulBy = core.foulBy || new Set(); if (!core.foulBy.has(this.id)) { core.foulBy.add(this.id); this.sim.game.foul(this, 'minor', 'G4.6', `controlled an opponent ${core.golden ? 'GOLDEN ' : ''}CORE`); } }
    core.setFilter(G.ALL & ~this.bit);
    this.heldCore = core;
    this.coreJoint = world.createImpulseJoint(RAPIER.JointData.fixed(this.holdLocal(), { x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0, w: 1 }), this.body, core.body, true);
    this.coreJoint.setContactsEnabled(false);
    this.sim.game.onCoreGripped(this, core);
  }
  releaseCore(record) {
    if (!this.heldCore) return;
    const core = this.heldCore;
    if (this.coreJoint) this.sim.world.removeImpulseJoint(this.coreJoint, true);
    this.coreJoint = null; this.heldCore = null;
    core.heldBy = null;
    core.setFilter(G.ALL);
    if (record) this.sim.game.onCoreReleased(this, core);
  }

  // ------------------------------------------------------------ cargo bay
  cargoAction() {
    if (!this.enabled) return;
    if (this.payloadJoint) { this.trayTarget = ROBOT.trayDump; return; }
    // intake: own PAYLOAD lying just behind the robot
    const pl = this.sim.game.payloads[this.id];
    if (pl.where !== 'field' || !pl.body || this.tray > 5) return;
    const lp = this.toLocal(pl.pos());
    if (lp.x > -0.14 || lp.x < -0.32 || Math.abs(lp.z) > 0.09 || lp.y > 0.09) return;
    this.loadPayload(pl);
  }
  loadPayload(pl) {
    const world = this.sim.world;
    const wp = this.toWorld(this.trayPointLocal());
    pl.spawn(wp, this.body.rotation(), this.body.linvel());
    pl.setFilter(G.ALL & ~this.bit);
    pl.where = 'cargo'; pl.invalid = false; pl.viaCargo = false; pl.outsideTimer = 0;
    this.payloadJoint = world.createImpulseJoint(RAPIER.JointData.fixed(this.trayPointLocal(), { x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0, w: 1 }), this.body, pl.body, true);
    this.payloadJoint.setContactsEnabled(false);
  }
  releasePayload(record) {
    if (!this.payloadJoint) return;
    const pl = this.sim.game.payloads[this.id];
    this.sim.world.removeImpulseJoint(this.payloadJoint, true);
    this.payloadJoint = null;
    if (!record) { pl.reset(); return; }
    pl.where = 'field'; pl.viaCargo = true;
    // tip it off the rear lip of the tray
    const back = qrot(this.body.rotation(), { x: -0.55, y: 0.15, z: 0 });
    const v = add(pl.body.linvel(), back);
    pl.body.setLinvel(v, true);
    pl.body.setAngvel(qrot(this.body.rotation(), { x: 0, y: 0, z: 4 }), true);
    pl.restoreFilterAt = this.sim.simTime + 0.35; // stay clear of the tray while it falls away
  }

  // ------------------------------------------------------------ status helpers
  footprint() {
    const front = Math.max(0.149, this.holdLocal().x + 0.05);
    const pts = [[-0.151, -0.186], [front, -0.186], [front, 0.186], [-0.151, 0.186]];
    return pts.map(([x, z]) => { const w = this.toWorld({ x, y: 0, z }); return [w.x, w.z]; });
  }
  speed() { const v = this.body.linvel(); return Math.hypot(v.x, v.z); }

  sync() {
    const t = this.body.translation(), q = this.body.rotation();
    this.root.position.set(t.x, t.y, t.z); this.root.quaternion.set(q.x, q.y, q.z, q.w);
    const d = this.theta - this.theta0;
    this.g.armLower.rotation.z = d; this.g.armUpper.rotation.z = d;
    const [dx, dy] = this.endOffset();
    this.g.end.position.set(dx, dy, 0);
    this.g.fingerL.position.z = -this.finger; this.g.fingerR.position.z = this.finger;
    this.g.linkL.position.z = -this.finger * 0.5; this.g.linkR.position.z = this.finger * 0.5;
    this.g.gearL.rotation.y = this.finger * 14; this.g.gearR.rotation.y = -this.finger * 14;
    this.g.tray.rotation.z = this.tray * DEG;
    for (const w of this.wheels) this.g[w.key].rotation.z = -w.spin;
    const cand = !this.heldCore && !this.gripClosed && this.enabled && this.sim.showGuides !== false ? this.findGrippableCore() : null;
    this.target.visible = !!cand;
    if (cand) { const p = cand.pos(); this.target.position.set(p.x, Math.max(0.001, p.y - 0.0145), p.z); }
    const show = !!this.heldCore && this.sim.showGuides !== false;
    this.guide.visible = this.guideDot.visible = show;
    if (show) {
      const c = this.heldCore.pos();
      const hit = this.sim.world.castRay(new RAPIER.Ray({ x: c.x, y: c.y - 0.016, z: c.z }, { x: 0, y: -1, z: 0 }), 2, true, undefined, groups(G.ALL, G.ENV | G.STATION | G.POLE | G.CORE), undefined, this.heldCore.body);
      const d = hit ? hit.toi : c.y;
      this.guide.scale.y = Math.max(0.001, d); this.guide.position.set(c.x, c.y - 0.016 - d / 2, c.z);
      this.guideDot.position.set(c.x, c.y - 0.016 - d + 0.002, c.z);
    }
  }
}

function numberTexture(num, col) {
  const c = document.createElement('canvas'); c.width = 350; c.height = 200;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, 350, 200);
  g.fillStyle = '#' + new THREE.Color(col).getHexString(); g.fillRect(0, 0, 350, 20); g.fillRect(0, 180, 350, 20);
  g.fillStyle = '#111'; g.font = 'bold 120px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(num, 175, 104);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function labelTexture(name, num, col) {
  const c = document.createElement('canvas'); c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = 'rgba(10,12,16,0.78)'; g.beginPath(); g.roundRect(4, 4, 504, 120, 28); g.fill();
  g.fillStyle = '#' + new THREE.Color(col).getHexString(); g.beginPath(); g.roundRect(4, 4, 24, 120, [28, 0, 0, 28]); g.fill();
  g.fillStyle = '#fff'; g.font = 'bold 56px sans-serif'; g.textBaseline = 'middle'; g.fillText(`${name}`, 48, 66);
  g.fillStyle = '#c8ccd4'; g.font = '48px sans-serif'; g.textAlign = 'right'; g.fillText(`#${num}`, 490, 66);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
