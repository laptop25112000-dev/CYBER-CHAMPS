import * as THREE from 'three';
import { mergeGeometries } from '../lib/BufferGeometryUtils.js';
import { RAPIER, G, groups, quatAxis, qrot } from './physics.js';
import {
  IN, FIELD, HALF, WALL, TILE, wx, wz, rot180, RED, POLE, VAULT, STATION, COLORS, squadPoint, squadPoly,
} from './config.js';

const SQUADS = ['red', 'blue'];
const sqColor = (s) => (s === 'red' ? COLORS.red : COLORS.blue);
const tapeColor = (s) => (s === 'red' ? '#e0262c' : '#2050e0');

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.05, ...opts });
}
function shadow(m, cast = true, recv = true) { m.castShadow = cast; m.receiveShadow = recv; return m; }

// ---------------------------------------------------------------- floor texture
function floorTexture(renderer) {
  const PX = 16; // px per inch
  const S = 144 * PX;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = '#b4b7bb'; g.fillRect(0, 0, S, S);
  // subtle foam noise
  const img = g.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const P = (X) => X * PX;
  // zones
  for (const s of SQUADS) {
    const col = tapeColor(s);
    const sz = RED.startZone;
    const a = squadPoint(s, [sz.x0, sz.y0]), b = squadPoint(s, [sz.x1, sz.y1]);
    g.fillStyle = col;
    g.fillRect(P(Math.min(a[0], b[0])), P(Math.min(a[1], b[1])), P(Math.abs(b[0] - a[0])), P(Math.abs(b[1] - a[1])));
    // station floor area (0..24 x 48..96)
    const s0 = squadPoint(s, [0, 48]), s1 = squadPoint(s, [24, 96]);
    g.fillRect(P(Math.min(s0[0], s1[0])), P(Math.min(s0[1], s1[1])), P(24), P(48));
    // drop zone (filled)
    const dz = squadPoly(s, RED.dropZone);
    g.beginPath(); dz.forEach((p, i) => (i ? g.lineTo(P(p[0]), P(p[1])) : g.moveTo(P(p[0]), P(p[1])))); g.closePath(); g.fill();
    // source zone: 1 in tape on the diagonal (tape is inside the zone)
    const sc = squadPoly(s, RED.sourceZone);
    g.strokeStyle = col; g.lineWidth = P(1);
    g.beginPath(); g.moveTo(P(sc[1][0]), P(sc[1][1])); g.lineTo(P(sc[2][0]), P(sc[2][1])); g.stroke();
    // vault zone outline (dashed half disc)
    const v = squadPoint(s, RED.vault);
    g.setLineDash([P(2), P(1.5)]); g.lineWidth = P(0.5);
    g.beginPath();
    const start = s === 'red' ? Math.PI : 0;
    g.arc(P(v[0]), P(v[1]), P(RED.vaultZoneR), start, start + Math.PI);
    g.stroke(); g.setLineDash([]);
    // spike marks
    for (const p of squadPoly(s, RED.spikeMarks)) {
      g.lineWidth = P(0.5); g.beginPath(); g.arc(P(p[0]), P(p[1]), P(2.2), 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(P(p[0] - 1), P(p[1])); g.lineTo(P(p[0] + 1), P(p[1])); g.moveTo(P(p[0]), P(p[1] - 1)); g.lineTo(P(p[0]), P(p[1] + 1)); g.stroke();
    }
  }
  // puzzle seams between tiles
  g.strokeStyle = 'rgba(40,40,40,0.55)'; g.lineWidth = 2;
  for (let k = 1; k < 6; k++) {
    for (const vertical of [true, false]) {
      g.beginPath();
      const L = k * 24;
      for (let t = 0; t <= 144; t += 1) {
        const tooth = Math.floor(t / 1.5) % 2 ? 0.45 : -0.45;
        const x = vertical ? L + tooth : t, y = vertical ? t : L + tooth;
        if (t === 0) g.moveTo(P(x), P(y)); else g.lineTo(P(x), P(y));
      }
      g.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

let _ringGeo = null;
function coreRingGeometry() { // same 95/55 x 30 mm rounded ring as the game COREs
  if (_ringGeo) return _ringGeo;
  const rIn = 0.0275, rOut = 0.0475, h = 0.03, f = 0.006, pts = [];
  const arc = (cx, cy, a0, a1) => { for (let i = 0; i <= 5; i++) { const a = a0 + (a1 - a0) * (i / 5); pts.push(new THREE.Vector2(cx + Math.cos(a) * f, cy + Math.sin(a) * f)); } };
  arc(rIn + f, -h / 2 + f, Math.PI, Math.PI * 1.5); arc(rOut - f, -h / 2 + f, -Math.PI / 2, 0);
  arc(rOut - f, h / 2 - f, 0, Math.PI / 2); arc(rIn + f, h / 2 - f, Math.PI / 2, Math.PI);
  pts.push(pts[0].clone());
  _ringGeo = new THREE.LatheGeometry(pts, 40);
  return _ringGeo;
}

function textTexture(lines, w = 512, h = 512, bg = '#111', fg = '#fff') {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.fillStyle = fg; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((l, i) => { g.font = l.font || 'bold 60px sans-serif'; g.fillStyle = l.color || fg; g.fillText(l.text, w / 2, l.y ?? (h / (lines.length + 1)) * (i + 1)); });
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ---------------------------------------------------------------- build
export function buildField(scene, world, renderer) {
  const F = { poles: [], dropZones: {}, sourceZones: {}, startZones: {}, vaults: {}, stations: {}, vaultZones: {}, buttons: {}, trifrons: {}, floorCollider: null, envColliders: new Set(), hpRacks: {} };
  const fixed = world.createRigidBody(RAPIER.RigidBodyDesc.fixed());
  const envG = groups(G.ENV, G.ALL);
  const poleG = groups(G.POLE, G.ALL & ~G.STATION);
  const addCol = (desc, body = fixed) => world.createCollider(desc, body);

  // ----- floor + surroundings
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture(renderer), roughness: 0.95 });
  const floor = shadow(new THREE.Mesh(new THREE.PlaneGeometry(FIELD, FIELD), floorMat), false, true);
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const outside = shadow(new THREE.Mesh(new THREE.PlaneGeometry(12, 12), mat(0x1c1f24, { roughness: 1 })), false, true);
  outside.rotation.x = -Math.PI / 2; outside.position.y = -0.021; scene.add(outside);
  F.floorCollider = addCol(RAPIER.ColliderDesc.cuboid(8, 0.05, 8).setTranslation(0, -0.05, 0).setFriction(0.9).setCollisionGroups(envG));
  F.envColliders.add(F.floorCollider.handle);

  // ----- walls (outside the 144 in tile area)
  // black 18 mm walls with a light inner top edge (Fig 2.1)
  const wallMat = mat(0x1d1f23, { roughness: 0.7 });
  const trimMat = mat(0xd9dde3, { roughness: 0.5 });
  for (let i = 0; i < 4; i++) {
    const along = FIELD + 2 * WALL.thick;
    const isX = i < 2, sgn = i % 2 ? 1 : -1;
    const sx = isX ? along : WALL.thick, sz = isX ? WALL.thick : along;
    const px = isX ? 0 : sgn * (HALF + WALL.thick / 2), pz = isX ? sgn * (HALF + WALL.thick / 2) : 0;
    const m = shadow(new THREE.Mesh(new THREE.BoxGeometry(sx, WALL.height + 0.02, sz), wallMat));
    m.position.set(px, (WALL.height - 0.02) / 2, pz); scene.add(m);
    const tw = 0.006; // trim along the inner top edge
    const trim = new THREE.Mesh(new THREE.BoxGeometry(isX ? FIELD : tw, 0.005, isX ? tw : FIELD), trimMat);
    trim.position.set(isX ? 0 : sgn * (HALF + tw / 2), WALL.height + 0.0025, isX ? sgn * (HALF + tw / 2) : 0); scene.add(trim);
    const c = addCol(RAPIER.ColliderDesc.cuboid(sx / 2, WALL.height / 2 + 0.3, sz / 2).setTranslation(px, WALL.height / 2 + 0.3 - 0.02, pz).setFriction(0.3).setCollisionGroups(envG));
    F.envColliders.add(c.handle);
  }

  // ----- arena areas outside the wall (visual outlines, Fig 3.0)
  const outline = (x0, y0, x1, y1, color) => {
    const w = 2 * IN, h = 0.004, m = mat(color, { roughness: 0.8 });
    const segs = [[x0, y0, x1, y0], [x0, y1, x1, y1], [x0, y0, x0, y1], [x1, y0, x1, y1]];
    for (const [a, b, c2, d] of segs) {
      const L = Math.hypot(c2 - a, d - b) * IN;
      const box = new THREE.Mesh(new THREE.BoxGeometry(a === c2 ? w : L + w, h, a === c2 ? L + w : w), m);
      box.position.set(wx((a + c2) / 2), -0.018, wz((b + d) / 2)); scene.add(box);
    }
  };
  for (const s of SQUADS) {
    const col = sqColor(s);
    const da = RED.driverArea;
    const p0 = squadPoint(s, [da.x0, da.y0]), p1 = squadPoint(s, [da.x1, da.y1]);
    outline(Math.min(p0[0], p1[0]), Math.min(p0[1], p1[1]), Math.max(p0[0], p1[0]), Math.max(p0[1], p1[1]), col);
    // human player source area (bottom-left for red) and starburst area (top-left for red)
    const h0 = squadPoint(s, [-27, 118]), h1 = squadPoint(s, [-2, 172]);
    outline(Math.min(h0[0], h1[0]), Math.min(h0[1], h1[1]), Math.max(h0[0], h1[0]), Math.max(h0[1], h1[1]), col);
    const b0 = squadPoint(s, [-27, -27]), b1 = squadPoint(s, [-2, 27]);
    outline(Math.min(b0[0], b1[0]), Math.min(b0[1], b1[1]), Math.max(b0[0], b1[0]), Math.max(b0[1], b1[1]), col);
  }
  // referee & scorer areas (grey)
  outline(-27, 30, -2, 114, 0x555555); outline(146, 30, 171, 114, 0x555555);

  // ----- zones (world polygons in x,z)
  const toW = (poly) => poly.map(([X, Y]) => [wx(X), wz(Y)]);
  for (const s of SQUADS) {
    F.dropZones[s] = toW(squadPoly(s, RED.dropZone));
    F.sourceZones[s] = toW(squadPoly(s, RED.sourceZone));
    const sz = RED.startZone;
    F.startZones[s] = toW(squadPoly(s, [[sz.x0, sz.y0], [sz.x1, sz.y0], [sz.x1, sz.y1], [sz.x0, sz.y1]]));
    const v = squadPoint(s, RED.vault);
    F.vaultZones[s] = { c: [wx(v[0]), wz(v[1])], r: RED.vaultZoneR * IN, inward: s === 'red' ? -1 : 1 };
  }

  // ----- poles
  const poleMat = { red: mat(COLORS.red, { roughness: 0.45 }), blue: mat(COLORS.blue, { roughness: 0.45 }) };
  const shaftMat = { red: mat(0xc0c4c8, { metalness: 0.6, roughness: 0.3 }), blue: mat(0xc0c4c8, { metalness: 0.6, roughness: 0.3 }) };
  function addPole(s, type, X, Y) {
    const x = wx(X), z = wz(Y);
    const spec = POLE[type];
    const grp = new THREE.Group(); grp.position.set(x, 0, z); scene.add(grp);
    const base = shadow(new THREE.Mesh(new THREE.CylinderGeometry(POLE.baseR, POLE.baseR, POLE.baseH, 40), poleMat[s]));
    base.position.y = POLE.baseH / 2; grp.add(base);
    const shaftH = spec.top - POLE.baseH - POLE.capH * 0.5;
    const shaft = shadow(new THREE.Mesh(new THREE.CylinderGeometry(POLE.r, POLE.r, shaftH, 24), type === 'star' ? shaftMat[s] : poleMat[s]));
    shaft.position.y = POLE.baseH + shaftH / 2; grp.add(shaft);
    const cap = shadow(new THREE.Mesh(new THREE.SphereGeometry(POLE.capR, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), poleMat[s]));
    cap.scale.y = POLE.capH / POLE.capR; cap.position.y = spec.top - POLE.capH; grp.add(cap);
    addCol(RAPIER.ColliderDesc.cylinder(POLE.baseH / 2, POLE.baseR).setTranslation(x, POLE.baseH / 2, z).setFriction(0.5).setCollisionGroups(envG));
    addCol(RAPIER.ColliderDesc.cylinder((spec.top - POLE.baseH) / 2, POLE.r).setTranslation(x, (spec.top + POLE.baseH) / 2, z).setFriction(0.25).setCollisionGroups(poleG));
    addCol(RAPIER.ColliderDesc.cylinder(POLE.capH / 2, POLE.capR * 0.95).setTranslation(x, spec.top - POLE.capH / 2, z).setFriction(0.25).setCollisionGroups(poleG));
    F.poles.push({ squad: s, type, x, z, base: POLE.baseH, top: spec.top, capacity: spec.cap, id: F.poles.length });
  }
  for (const s of SQUADS) {
    for (const p of RED.starPoles) addPole(s, 'star', ...squadPoint(s, p));
    const hp = RED.highPoles.map((p) => squadPoint(s, p));
    hp.forEach((p) => addPole(s, 'high', ...p));
    // the floor bar joining the three high poles (Fig 3.3.1)
    const a = hp[0], b = hp[2];
    const L = Math.abs(b[0] - a[0]) * IN;
    const bar = shadow(new THREE.Mesh(new THREE.BoxGeometry(L, 0.006, 0.8 * IN), poleMat[s]), false, true);
    bar.position.set(wx((a[0] + b[0]) / 2), 0.003, wz(a[1])); scene.add(bar);
    addCol(RAPIER.ColliderDesc.cuboid(L / 2, 0.003, 0.4 * IN).setTranslation(wx((a[0] + b[0]) / 2), 0.003, wz(a[1])).setFriction(0.8).setCollisionGroups(envG));
  }

  // ----- space stations + apex frames
  for (const s of SQUADS) F.stations[s] = buildStation(scene, world, s, fixed, addCol);
  for (const s of SQUADS) buildApex(scene, s, addCol, envG, poleG, poleMat[s], F);

  // ----- vaults
  for (const s of SQUADS) F.vaults[s] = buildVault(scene, world, s, fixed, addCol, envG);

  // ----- STARBURST mode buttons (3 ft pillar + LED), trifrons, HP racks
  for (const s of SQUADS) {
    const [X, Y] = squadPoint(s, RED.starburstButton);
    // 3 ft black pipe pillar fed by a floor pipe from the field corner, squad-coloured LED cap (Fig 2.1 / 3.3.6)
    const grp = new THREE.Group(); grp.position.set(wx(X), -0.021, wz(Y)); scene.add(grp);
    const pipeMat = mat(0x18191c, { roughness: 0.55, metalness: 0.2 });
    const pillar = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.914, 28), pipeMat));
    pillar.position.y = 0.457; grp.add(pillar);
    const elbow = shadow(new THREE.Mesh(new THREE.SphereGeometry(0.042, 20, 12), pipeMat)); elbow.position.y = 0.042; grp.add(elbow);
    const ledMat = new THREE.MeshStandardMaterial({ color: sqColor(s), emissive: 0x000000, roughness: 0.3 });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.044, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), ledMat);
    led.position.y = 0.914; grp.add(led);
    const c = squadPoint(s, [0, 0]);
    const ax = wx(c[0]) - wx(X), az = wz(c[1]) - wz(Y), al = Math.hypot(ax, az) - 0.02;
    const arm = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.042, al, 24), pipeMat));
    arm.rotation.z = Math.PI / 2; arm.rotation.y = -Math.atan2(az, ax);
    arm.position.set(wx(X) + ax / 2, 0.021, wz(Y) + az / 2); scene.add(arm);
    F.buttons[s] = { led, ledMat, squad: s };

    // TRIFRON (equilateral triangular prism behind the space station, shows STAR MAP)
    const [tX, tY] = squadPoint(s, RED.trifron);
    const tri = new THREE.Group(); tri.position.set(wx(tX), -0.021, wz(tY)); scene.add(tri);
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.16, 12), mat(0x222222)); stand.position.y = 0.08; tri.add(stand);
    const faces = [];
    const R = 0.13, H = 0.26;
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2;
      const fm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
      const face = new THREE.Mesh(new THREE.PlaneGeometry(R * Math.sqrt(3), H), fm);
      face.position.set(Math.cos(a) * R / 2, 0.16 + H / 2, Math.sin(a) * R / 2);
      face.rotation.y = -a + Math.PI / 2; tri.add(face); faces.push(fm);
    }
    F.trifrons[s] = { group: tri, faces };

    // Human Player reserve: four stacks of five COREs on the Source Area floor (Fig 2.1, 20 COREs)
    const [hX, hY] = squadPoint(s, [-11, 134]);
    const rack = new THREE.Group(); rack.position.set(wx(hX), -0.021, wz(hY)); scene.add(rack);
    const ringGeo = coreRingGeometry();
    const ringMat = mat(sqColor(s), { roughness: 0.55 });
    // one instanced mesh: instance order = the order rings are handed out (bottom layer first)
    const spots = [[-0.06, -0.06], [0.06, -0.06], [-0.06, 0.06], [0.06, 0.06]];
    const rings = shadow(new THREE.InstancedMesh(ringGeo, ringMat, 20));
    const m4 = new THREE.Matrix4();
    let n = 0;
    for (let k = 0; k < 5; k++) for (const [dx, dz] of spots) rings.setMatrixAt(n++, m4.makeTranslation(dx, 0.015 + k * 0.0302, dz));
    rings.computeBoundingSphere();
    rack.add(rings);
    F.hpRacks[s] = {
      group: rack, rings,
      setCount(c) { rings.count = Math.max(0, Math.min(20, c)); },
    };
  }
  // static field pieces that share a material become one mesh (cuts draw calls ~3x)
  const dynamic = new Set(['red', 'blue'].flatMap((s) => [F.stations[s].deckGrp, ...F.stations[s].rampGrps, F.trifrons[s].group, F.hpRacks[s].group, F.vaults[s].gateVis, F.buttons[s].led]));
  mergeStatic(scene, dynamic);
  return F;
}

// materials that look identical can share one draw call (field parts each create their own material)
function matKey(m) {
  if (m.map || m.alphaMap || m.normalMap) return m.uuid;
  return [m.type, m.color && m.color.getHexString(), m.roughness, m.metalness, m.transparent, m.opacity, m.side, m.depthWrite,
    m.emissive && m.emissive.getHexString(), m.emissiveIntensity, m.vertexColors, m.flatShading].join('|');
}
function mergeStatic(scene, dynamic) {
  scene.updateMatrixWorld(true);
  const buckets = new Map();
  scene.traverse((o) => {
    if (!o.isMesh || o.isInstancedMesh || Array.isArray(o.material) || !o.visible) return;
    for (let p = o; p; p = p.parent) if (dynamic.has(p)) return;
    const key = `${matKey(o.material)}|${o.castShadow ? 1 : 0}${o.receiveShadow ? 1 : 0}|${o.geometry.attributes.uv ? 1 : 0}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(o);
  });
  for (const list of buckets.values()) {
    if (list.length < 2) continue;
    const geos = list.map((m) => {
      let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
      for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
      if (!g.attributes.normal) g.computeVertexNormals();
      g.applyMatrix4(m.matrixWorld);
      return g;
    });
    const merged = mergeGeometries(geos);
    if (!merged) continue;
    const mesh = new THREE.Mesh(merged, list[0].material);
    mesh.castShadow = list[0].castShadow; mesh.receiveShadow = list[0].receiveShadow;
    for (const m of list) m.parent.remove(m);
    scene.add(mesh);
  }
}

// ---------------------------------------------------------------- space station
function buildStation(scene, world, s, fixedBody, addCol) {
  const { width, deckLen, rampLen, deckH, thick } = STATION;
  const [cX, cY] = squadPoint(s, [RED.station.cx, RED.station.cy]);
  const cx = wx(cX), cz = wz(cY);
  const pivotY = deckH - thick;
  const stG = groups(G.STATION, G.ALL);
  const sgnCol = sqColor(s);

  // pivot base (fixed, visual) + deck body
  const deckBody = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(cx, pivotY, cz).setAngularDamping(0.2).setCanSleep(false)
    .setAdditionalMassProperties(STATION.deckMass, { x: 0, y: 0, z: 0 }, { x: 0.22, y: 0.35, z: 0.13 }, { x: 0, y: 0, z: 0, w: 1 }));
  const deckCol = world.createCollider(RAPIER.ColliderDesc.cuboid(width / 2, thick / 2, deckLen / 2).setTranslation(0, thick / 2, 0)
    .setDensity(0).setFriction(1.0).setCollisionGroups(stG), deckBody);
  const anchorBody = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(cx, pivotY, cz));
  const pivot = world.createImpulseJoint(RAPIER.JointData.revolute({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }), anchorBody, deckBody, true);
  pivot.setContactsEnabled(false);
  if (pivot.setLimits) pivot.setLimits(-STATION.maxTilt, STATION.maxTilt);
  // pivot friction + damping are applied by station.step() (see below)

  // ramps: hinged at the deck ends, knife-edge feet resting on the floor
  const alpha = Math.asin(deckH / rampLen);
  const taper = 0.09;
  const ramps = [];
  const colliders = [deckCol];
  for (const sg of [-1, 1]) {
    const hz = sg * deckLen / 2;
    const rot = quatAxis(1, 0, 0, sg * alpha);
    const rb = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(cx, deckH, cz + hz).setRotation(rot).setCanSleep(false)
      .setAdditionalMassProperties(STATION.rampMass, { x: 0, y: -thick / 2, z: sg * rampLen / 2 }, { x: 0.03, y: 0.06, z: 0.03 }, { x: 0, y: 0, z: 0, w: 1 }));
    const w2 = width / 2;
    const pts = new Float32Array([
      -w2, 0, 0, w2, 0, 0, -w2, 0, sg * rampLen, w2, 0, sg * rampLen,
      -w2, -thick, 0, w2, -thick, 0, -w2, -thick, sg * (rampLen - taper), w2, -thick, sg * (rampLen - taper),
    ]);
    const rc = world.createCollider(RAPIER.ColliderDesc.convexHull(pts).setDensity(0).setFriction(1.0).setCollisionGroups(stG), rb);
    const hinge = world.createImpulseJoint(RAPIER.JointData.revolute({ x: 0, y: thick, z: hz }, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }), deckBody, rb, true);
    hinge.setContactsEnabled(false);
    ramps.push({ body: rb, collider: rc, sg });
    colliders.push(rc);
  }

  // visuals (Fig 2.1 / 3.3.3): clear polycarbonate deck + ramps in a light frame, studs on the deck,
  // solid squad-coloured wedge skirts hiding the pivot
  const polyMat = new THREE.MeshStandardMaterial({ color: 0xdfe6f0, transparent: true, opacity: 0.5, roughness: 0.18, metalness: 0.05, depthWrite: false });
  const frameMat = mat(0xc9ced6, { roughness: 0.4, metalness: 0.5 });
  const deckGrp = new THREE.Group(); scene.add(deckGrp);
  const deckTop = new THREE.Mesh(new THREE.BoxGeometry(width, thick, deckLen), polyMat);
  deckTop.position.y = thick / 2; deckGrp.add(deckTop);
  for (const sx of [-1, 1]) { // side rails
    const rail = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.024, deckLen), frameMat));
    rail.position.set(sx * (width / 2 - 0.008), thick / 2 + 0.003, 0); deckGrp.add(rail);
  }
  for (const sz of [-1, 1]) {
    const bar = shadow(new THREE.Mesh(new THREE.BoxGeometry(width, 0.016, 0.02), frameMat));
    bar.position.set(0, thick / 2, sz * (deckLen / 2 - 0.01)); deckGrp.add(bar);
  }
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.72, deckLen * 0.62), new THREE.MeshStandardMaterial({ color: sgnCol, transparent: true, opacity: 0.3, depthWrite: false }));
  pad.rotation.x = -Math.PI / 2; pad.position.y = thick + 0.0006; deckGrp.add(pad);
  const studMat = mat(0x6d737d, { roughness: 0.4, metalness: 0.6 });
  for (const sx of [-1, 0, 1]) for (const sz of [-1, 0, 1]) { // fastener studs visible on the deck
    const st = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.006, 10), studMat));
    st.position.set(sx * width * 0.28, thick + 0.003, sz * deckLen * 0.3); deckGrp.add(st);
  }
  // wedge skirts on both long sides: their top stays under the deck edge at full tilt
  const skirtMat = mat(sgnCol, { roughness: 0.5 });
  const skH = pivotY - 0.02, skL = deckLen / 2 - 0.01;
  const skShape = new THREE.Shape(); skShape.moveTo(-skL, 0); skShape.lineTo(skL, 0); skShape.lineTo(0.02, skH); skShape.lineTo(-0.02, skH); skShape.closePath();
  const skGeo = new THREE.ExtrudeGeometry(skShape, { depth: 0.008, bevelEnabled: false });
  for (const sx of [-1, 1]) {
    const sk = shadow(new THREE.Mesh(skGeo, skirtMat));
    sk.rotation.y = Math.PI / 2; sk.position.set(cx + sx * (width / 2 - 0.02), 0, cz); scene.add(sk);
    const hull = new Float32Array([0, 0, -skL, 0, 0, skL, 0, skH, -0.02, 0, skH, 0.02, 0.008, 0, -skL, 0.008, 0, skL, 0.008, skH, -0.02, 0.008, skH, 0.02]);
    addCol(RAPIER.ColliderDesc.convexHull(hull).setTranslation(cx + sx * (width / 2 - 0.02), 0, cz).setFriction(0.5).setCollisionGroups(groups(G.ENV, G.ALL & ~G.STATION)));
  }
  const rampGrps = ramps.map(({ sg }) => {
    const grp = new THREE.Group(); scene.add(grp);
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); shape.lineTo(rampLen, 0); shape.lineTo(rampLen - taper, -thick); shape.lineTo(0, -thick); shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
    geo.translate(0, 0, -width / 2);
    geo.rotateY(sg > 0 ? -Math.PI / 2 : Math.PI / 2);
    const m = new THREE.Mesh(geo, polyMat); grp.add(m);
    const tint = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.92, rampLen * 0.8), new THREE.MeshStandardMaterial({ color: sgnCol, transparent: true, opacity: 0.35, depthWrite: false }));
    tint.rotation.x = -Math.PI / 2; tint.position.set(0, 0.0008, sg * rampLen * 0.45); grp.add(tint);
    for (let k = 0; k < 3; k++) { // dark traction strips (Fig 2.1)
      const st = new THREE.Mesh(new THREE.BoxGeometry(width * 0.78, 0.003, 0.014), mat(0x23262c, { roughness: 0.9 }));
      st.position.set(0, 0.0015, sg * rampLen * (0.3 + k * 0.2)); grp.add(st);
    }
    for (const sx of [-1, 1]) { // clear-frame side rails
      const rl = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.02, rampLen * 0.97), frameMat));
      rl.position.set(sx * (width / 2 - 0.007), 0.006, sg * rampLen * 0.485); grp.add(rl);
    }
    return grp;
  });
  // fixed pivot axle (visual)
  const base = new THREE.Group(); base.position.set(cx, 0, cz); scene.add(base);
  const axle = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, width * 0.95, 12), mat(0x888888, { metalness: 0.7 })));
  axle.rotation.z = Math.PI / 2; axle.position.y = pivotY; base.add(axle);

  // footprint: deck + ramps (world xz rectangle) - "enclosed volume"
  const halfLong = deckLen / 2 + rampLen * Math.cos(alpha);
  const footprint = [[cx - width / 2, cz - halfLong], [cx + width / 2, cz - halfLong], [cx + width / 2, cz + halfLong], [cx - width / 2, cz + halfLong]];

  const st = {
    squad: s, deckBody, deckCol, ramps, pivot, colliders, colliderSet: new Set(colliders.map((c) => c.handle)),
    deckGrp, rampGrps, footprint, cx, cz, pivotY,
    load: 0, stuck: true,
    tilt() { const q = deckBody.rotation(); return 2 * Math.atan2(q.x, q.w); },
    // the top platform only (tilts with the deck), projected to the floor: DOCK / BALANCE need the robot on it
    deckPoly() {
      const t = deckBody.translation(), q = deckBody.rotation();
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => { const p = qrot(q, { x: a * width / 2, y: thick, z: b * deckLen / 2 }); return [t.x + p.x, t.z + p.z]; });
    },
    // a wheel pushes on the deck or a ramp: accumulate its torque about the pivot axis (+x). A ramp passes the
    // share of a load that its hinge carries (the rest goes through its foot into the floor).
    addLoad(body, p, F) {
      if (body === deckBody) { this.load += (p.y - pivotY) * F.z - (p.z - cz) * F.y; return; }
      const r = ramps.find((x) => x.body === body); if (!r) return;
      const h = body.translation();
      const share = Math.max(0, Math.min(1, 1 - Math.abs(p.z - h.z) / (rampLen * Math.cos(alpha))));
      this.load += -(h.z - cz) * F.y * share;
    },
    // pivot bearing: static friction holds the deck while the load torque stays under the limit, then it turns
    // against sliding friction and viscous damping. Call once per substep, after the robots, before world.step.
    step(dt) {
      const w = deckBody.angvel().x, load = this.load;
      this.load = 0;
      let tau;
      if (this.stuck && Math.abs(load) <= STATION.pivotStatic) tau = -load - 0.3 * w / dt;     // cancel the load, stop residual spin
      else {
        this.stuck = false;
        const dir = Math.abs(w) > 1e-3 ? Math.sign(w) : Math.sign(load);
        tau = -STATION.pivotDamping * w - dir * STATION.pivotKinetic;
        if (Math.abs(w) < 0.02 && Math.abs(load) <= STATION.pivotStatic) this.stuck = true;
      }
      deckBody.addTorque({ x: tau, y: 0, z: 0 }, true);
    },
    sync() {
      const t = deckBody.translation(), q = deckBody.rotation();
      deckGrp.position.set(t.x, t.y, t.z); deckGrp.quaternion.set(q.x, q.y, q.z, q.w);
      ramps.forEach((r, i) => { const rt = r.body.translation(), rq = r.body.rotation(); rampGrps[i].position.set(rt.x, rt.y, rt.z); rampGrps[i].quaternion.set(rq.x, rq.y, rq.z, rq.w); });
    },
    reset() {
      deckBody.setTranslation({ x: cx, y: pivotY, z: cz }, true); deckBody.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
      deckBody.setLinvel({ x: 0, y: 0, z: 0 }, true); deckBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
      this.load = 0; this.stuck = true;
      ramps.forEach((r) => {
        r.body.setTranslation({ x: cx, y: deckH, z: cz + r.sg * deckLen / 2 }, true);
        r.body.setRotation(quatAxis(1, 0, 0, r.sg * alpha), true);
        r.body.setLinvel({ x: 0, y: 0, z: 0 }, true); r.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      });
    },
  };
  deckBody.userData = { station: st };
  for (const r of ramps) r.body.userData = { station: st };
  return st;
}

// ---------------------------------------------------------------- apex poles
function buildApex(scene, s, addCol, envG, poleG, poleMat, F) {
  const { top, collar } = POLE.apex;
  const pts = RED.apexPoles.map((p) => squadPoint(s, p));
  const grp = new THREE.Group(); scene.add(grp);
  const pipe = (x0, y0, z0, x1, y1, z1, r = 0.011) => {
    const a = new THREE.Vector3(x0, y0, z0), b = new THREE.Vector3(x1, y1, z1);
    const m = shadow(new THREE.Mesh(new THREE.CylinderGeometry(r, r, a.distanceTo(b), 12), poleMat));
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    grp.add(m);
  };
  const [p0, p1] = pts.map(([X, Y]) => [wx(X), wz(Y)]);
  for (const [x, z] of [p0, p1]) {
    pipe(x, 0, z, x, collar, z, 0.013);                                   // post
    const shaft = shadow(new THREE.Mesh(new THREE.CylinderGeometry(POLE.r, POLE.r, top - collar - POLE.capH * 0.5, 20), poleMat));
    shaft.position.set(x, collar + (top - collar - POLE.capH * 0.5) / 2, z); grp.add(shaft);
    const cap = shadow(new THREE.Mesh(new THREE.SphereGeometry(POLE.capR, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), poleMat));
    cap.scale.y = POLE.capH / POLE.capR; cap.position.set(x, top - POLE.capH, z); grp.add(cap);
    const col = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.012, 24), poleMat));
    col.position.set(x, collar - 0.006, z); grp.add(col);
    addCol(RAPIER.ColliderDesc.cylinder(0.006, 0.036).setTranslation(x, collar - 0.006, z).setFriction(0.5).setCollisionGroups(envG));
    addCol(RAPIER.ColliderDesc.cylinder(collar / 2, 0.013).setTranslation(x, collar / 2, z).setCollisionGroups(envG));
    addCol(RAPIER.ColliderDesc.cylinder((top - collar) / 2, POLE.r).setTranslation(x, (top + collar) / 2, z).setFriction(0.25).setCollisionGroups(poleG));
    F.poles.push({ squad: s, type: 'apex', x, z, base: collar, top, capacity: POLE.apex.cap, id: F.poles.length });
  }
  pipe(p0[0], collar - 0.03, p0[1], p1[0], collar - 0.03, p1[1]);
  pipe(p0[0], 0.012, p0[1], p1[0], 0.012, p1[1]);
}

// ---------------------------------------------------------------- vault
function buildVault(scene, world, s, fixedBody, addCol, envG) {
  const [X, Y] = squadPoint(s, RED.vault);
  const x = wx(X), z = wz(Y);
  const col = sqColor(s);
  const grp = new THREE.Group(); grp.position.set(x, 0, z); scene.add(grp);
  const tubeMat = new THREE.MeshStandardMaterial({ color: 0xe8eef8, transparent: true, opacity: 0.28, roughness: 0.1, depthWrite: false, side: THREE.DoubleSide });
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(VAULT.rOut, VAULT.rOut, VAULT.top - VAULT.gap, 32, 1, true), tubeMat);
  tube.position.y = (VAULT.top + VAULT.gap) / 2; grp.add(tube);
  const frame = mat(col);
  for (const y of [VAULT.gap + 0.006, VAULT.top - 0.004]) {
    const ring = shadow(new THREE.Mesh(new THREE.TorusGeometry(VAULT.rOut, 0.005, 8, 32), frame));
    ring.rotation.x = Math.PI / 2; ring.position.y = y; grp.add(ring);
  }
  const lid = shadow(new THREE.Mesh(new THREE.CylinderGeometry(VAULT.rOut + 0.004, VAULT.rOut + 0.004, 0.008, 32), frame));
  lid.position.y = VAULT.top + 0.004; grp.add(lid);
  // flared skirt + tripod legs to the wall
  const skirt = shadow(new THREE.Mesh(new THREE.CylinderGeometry(VAULT.rOut + 0.002, VAULT.rOut + 0.03, 0.03, 32, 1, true), frame));
  skirt.position.y = VAULT.gap + 0.015; grp.add(skirt);
  const inward = s === 'red' ? -1 : 1; // +z is toward blue; red vault sits on the blue-side wall facing -z
  for (const side of [-1, 1]) {
    const leg = shadow(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.008, 0.02), frame));
    leg.position.set(side * 0.09, VAULT.gap + 0.01, -inward * 0.03); leg.rotation.z = side * 0.35; grp.add(leg);
  }
  // physics: tube wall segments above the 50 mm opening + removable gate below it
  const segs = 16, rMid = (VAULT.rIn + VAULT.rOut) / 2, tw = (VAULT.rOut - VAULT.rIn) / 2;
  const segLen = 2 * Math.PI * rMid / segs * 0.55;
  const gate = [];
  for (let k = 0; k < segs; k++) {
    const a = (k / segs) * Math.PI * 2;
    const rot = { x: 0, y: Math.sin(-a / 2), z: 0, w: Math.cos(-a / 2) };
    const px = x + Math.cos(a) * rMid, pz = z + Math.sin(a) * rMid;
    addCol(RAPIER.ColliderDesc.cuboid(tw, (VAULT.top - VAULT.gap) / 2, segLen).setTranslation(px, (VAULT.top + VAULT.gap) / 2, pz).setRotation(rot).setFriction(0.3).setCollisionGroups(envG));
    gate.push(world.createCollider(RAPIER.ColliderDesc.cuboid(tw, VAULT.gap / 2, segLen).setTranslation(px, VAULT.gap / 2, pz).setRotation(rot).setFriction(0.3).setCollisionGroups(envG), fixedBody));
  }
  addCol(RAPIER.ColliderDesc.cylinder(0.004, VAULT.rOut).setTranslation(x, VAULT.top + 0.004, z).setCollisionGroups(envG));
  // gate visual: bars
  const gateVis = new THREE.Group(); grp.add(gateVis);
  const barMat = mat(0x222222, { metalness: 0.5 });
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, VAULT.gap, 6), barMat);
    b.position.set(Math.cos(a) * VAULT.rOut, VAULT.gap / 2, Math.sin(a) * VAULT.rOut); gateVis.add(b);
  }
  return {
    squad: s, x, z, gate, gateVis, open: false,
    setOpen(v) { this.open = v; gate.forEach((c) => c.setEnabled(!v)); gateVis.visible = !v; },
  };
}

export function paintTrifron(F, starMap) {
  for (const s of ['red', 'blue']) {
    const label = { C: s === 'red' ? 'RED' : 'BLUE', G: 'GOLD' };
    const fill = { C: s === 'red' ? '#d8232a' : '#1f4fd8', G: '#f2a81e' };
    const c = document.createElement('canvas'); c.width = 256; c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#fafafa'; g.fillRect(0, 0, 256, 512);
    g.fillStyle = '#111'; g.font = 'bold 34px sans-serif'; g.textAlign = 'center'; g.fillText('STAR MAP', 128, 52);
    g.fillStyle = '#e0a020'; g.fillRect(40, 70, 176, 3);
    starMap.forEach((k, i) => {
      const y = 100 + i * 130;
      g.fillStyle = fill[k]; roundRect(g, 20, y, 216, 100, 18); g.fill();
      g.fillStyle = k === 'G' ? '#7a4a00' : '#0a0a2a'; g.font = 'bold 46px sans-serif'; g.fillText(label[k], 128, y + 66);
    });
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    F.trifrons[s].faces.forEach((fm) => { fm.map = tex; fm.needsUpdate = true; });
  }
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
export { textTexture };
