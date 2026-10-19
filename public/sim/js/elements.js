import * as THREE from 'three';
import { RAPIER, G, groups, ringBoxes, qrot } from './physics.js';
import { CORE, PAYLOAD, COLORS } from './config.js';

// ---------------------------------------------------------------- CORE (ring, 95/55 x 30 mm, 40 g)
let coreGeo = null;
const coreMats = {};
function getCoreGeo() {
  if (coreGeo) return coreGeo;
  const { rIn, rOut, h } = CORE; const f = 0.006; // fillet
  const pts = [];
  const arc = (cx, cy, a0, a1) => { for (let i = 0; i <= 6; i++) { const a = a0 + (a1 - a0) * (i / 6); pts.push(new THREE.Vector2(cx + Math.cos(a) * f, cy + Math.sin(a) * f)); } };
  arc(rIn + f, -h / 2 + f, Math.PI, Math.PI * 1.5);
  arc(rOut - f, -h / 2 + f, -Math.PI / 2, 0);
  arc(rOut - f, h / 2 - f, 0, Math.PI / 2);
  arc(rIn + f, h / 2 - f, Math.PI / 2, Math.PI);
  pts.push(pts[0].clone());
  coreGeo = new THREE.LatheGeometry(pts, 48);
  return coreGeo;
}
function getCoreMat(color) {
  if (!coreMats[color]) {
    const c = color === 'gold' ? COLORS.gold : color === 'red' ? COLORS.red : COLORS.blue;
    coreMats[color] = new THREE.MeshStandardMaterial({ color: c, roughness: color === 'gold' ? 0.35 : 0.55, metalness: color === 'gold' ? 0.35 : 0.0 });
  }
  return coreMats[color];
}
const BOXES = ringBoxes(CORE.rIn, CORE.rOut, CORE.h, 8);
const RING_VOL = BOXES.reduce((v, b) => v + 8 * b.hx * b.hy * b.hz, 0);

let NEXT_ID = 1;
export class Core {
  constructor(sim, color, owner, pos, rot = { x: 0, y: 0, z: 0, w: 1 }) {
    this.id = NEXT_ID++;
    this.kind = 'core';
    this.sim = sim;
    this.color = color;               // 'red' | 'blue' | 'gold'
    this.owner = owner;               // squad that may control it
    this.golden = color === 'gold';
    const { world, scene } = sim;
    this.body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(pos.x, pos.y, pos.z).setRotation(rot)
      .setCcdEnabled(true).setLinearDamping(0.05).setAngularDamping(0.15));
    this.body.userData = { core: this };
    this.colliders = BOXES.map((b) => world.createCollider(
      RAPIER.ColliderDesc.cuboid(b.hx, b.hy, b.hz).setTranslation(b.x, 0, b.z).setRotation(b.q)
        .setDensity(CORE.mass / RING_VOL).setFriction(0.45).setRestitution(0.05)
        .setCollisionGroups(groups(G.CORE, G.ALL)), this.body));
    this.mesh = new THREE.Mesh(getCoreGeo(), getCoreMat(color));
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    scene.add(this.mesh);
    this.heldBy = null;
    this.lastTouch = null;   // { robot, t }
    this.release = null;     // { robot, t, levelUp, stationed }
    this.scored = null;      // location key from last scoring pass
    this.sync();
  }
  setFilter(filterMask) { this.colliders.forEach((c) => c.setCollisionGroups(groups(G.CORE, filterMask))); }
  pos() { return this.body.translation(); }
  axis() { return qrot(this.body.rotation(), { x: 0, y: 1, z: 0 }); }
  sync() {
    const t = this.body.translation(), q = this.body.rotation();
    this.mesh.position.set(t.x, t.y, t.z); this.mesh.quaternion.set(q.x, q.y, q.z, q.w);
  }
  destroy() {
    this.sim.world.removeRigidBody(this.body);
    this.sim.scene.remove(this.mesh);
  }
}

// ---------------------------------------------------------------- PAYLOAD (team-built, <= 4 in cube, <= 400 g)
function payloadMaterials(squad, number) {
  const base = squad === 'red' ? '#e5484d' : '#4a64e8';
  const face = (withNum) => {
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 10; g.strokeRect(5, 5, 246, 246);
    if (withNum) {
      g.fillStyle = '#ffffff'; g.font = 'bold 84px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(number, 128, 132);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 });
  };
  const n = face(true), p = face(false);
  return [n, n, p, p, n, n];
}

export class Payload {
  constructor(sim, robot) {
    this.kind = 'payload';
    this.sim = sim;
    this.robot = robot;               // owning team (number displayed on it)
    this.squad = robot.squad;
    this.number = robot.number;
    this.body = null;
    this.colliders = [];
    const s = PAYLOAD.size;
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), payloadMaterials(this.squad, this.number));
    this.mesh.castShadow = true; this.mesh.receiveShadow = true;
    this.mesh.visible = false;
    sim.scene.add(this.mesh);
    this.reset();
  }
  reset() {
    this.removeBody();
    this.where = 'hp';        // 'hp' | 'field' | 'cargo'
    this.mesh.visible = false;
    this.viaCargo = false;    // last released by its own robot's CARGO BAY
    this.invalid = false;     // contacted floor outside drop/source zone, or controlled by the CORE mechanism
    this.outsideTimer = 0;
    this.scored = false;
  }
  removeBody() {
    if (this.body) {
      this.sim.unregisterBody(this.body);
      this.sim.world.removeRigidBody(this.body); this.body = null; this.colliders = [];
    }
    this.restoreFilterAt = 0;
  }
  spawn(pos, rot = { x: 0, y: 0, z: 0, w: 1 }, vel = null) {
    this.removeBody();
    const s = PAYLOAD.size;
    this.body = this.sim.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(pos.x, pos.y, pos.z).setRotation(rot).setCcdEnabled(true));
    this.body.userData = { payload: this };
    if (vel) this.body.setLinvel(vel, true);
    this.colliders = [this.sim.world.createCollider(RAPIER.ColliderDesc.roundCuboid(s / 2 - 0.006, s / 2 - 0.006, s / 2 - 0.006, 0.006)
      .setMass(PAYLOAD.mass).setFriction(0.5).setRestitution(0.05).setCollisionGroups(groups(G.PAYLOAD, G.ALL)), this.body)];
    this.sim.registerBody(this.body, this.colliders, { type: 'payload', payload: this });
    this.mesh.visible = true;
    this.sync();
  }
  setFilter(filterMask) { this.colliders.forEach((c) => c.setCollisionGroups(groups(G.PAYLOAD, filterMask))); }
  setNumber(num) {
    if (num === this.number) return;
    this.number = num;
    const old = this.mesh.material;
    this.mesh.material = payloadMaterials(this.squad, num);
    new Set(old).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
  }
  pos() { return this.body ? this.body.translation() : null; }
  sync() {
    if (!this.body) return;
    const t = this.body.translation(), q = this.body.rotation();
    this.mesh.position.set(t.x, t.y, t.z); this.mesh.quaternion.set(q.x, q.y, q.z, q.w);
  }
}
