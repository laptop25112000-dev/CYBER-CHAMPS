import RAPIER from '../lib/rapier.es.js';

export { RAPIER };

// Collision group bits (Rapier InteractionGroups = membership << 16 | filter)
export const G = {
  ENV: 1 << 0,      // floor, walls, fixed field structures
  STATION: 1 << 1,  // space-station deck + ramps (dynamic)
  CORE: 1 << 2,
  PAYLOAD: 1 << 3,
  ROBOT0: 1 << 4,   // robots use bits 4..7
  POLE: 1 << 8,     // pole shafts / caps (excluded from wheel rays)
  ALL: 0xffff,
};
export const robotBit = (i) => G.ROBOT0 << i;
export const groups = (membership, filter) => ((membership & 0xffff) << 16) | (filter & 0xffff);

export async function createWorld() {
  await RAPIER.init();
  const world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
  world.timestep = 1 / 240;
  if ('numSolverIterations' in world) world.numSolverIterations = 4;
  const events = new RAPIER.EventQueue(true);
  return { world, events };
}

export const v3 = (x, y, z) => ({ x, y, z });

// quaternion helpers (plain objects, Rapier-compatible)
export function quatYaw(a) { return { x: 0, y: Math.sin(a / 2), z: 0, w: Math.cos(a / 2) }; }
export function quatAxis(ax, ay, az, a) {
  const s = Math.sin(a / 2);
  return { x: ax * s, y: ay * s, z: az * s, w: Math.cos(a / 2) };
}
export function qmul(a, b) {
  return {
    w: a.w * b.w - a.x * b.x - a.y * b.y - a.z * b.z,
    x: a.w * b.x + a.x * b.w + a.y * b.z - a.z * b.y,
    y: a.w * b.y - a.x * b.z + a.y * b.w + a.z * b.x,
    z: a.w * b.z + a.x * b.y - a.y * b.x + a.z * b.w,
  };
}
export function qrot(q, v) {
  // v' = q v q*
  const ix = q.w * v.x + q.y * v.z - q.z * v.y;
  const iy = q.w * v.y + q.z * v.x - q.x * v.z;
  const iz = q.w * v.z + q.x * v.y - q.y * v.x;
  const iw = -q.x * v.x - q.y * v.y - q.z * v.z;
  return {
    x: ix * q.w + iw * -q.x + iy * -q.z - iz * -q.y,
    y: iy * q.w + iw * -q.y + iz * -q.x - ix * -q.z,
    z: iz * q.w + iw * -q.z + ix * -q.y - iy * -q.x,
  };
}
export function qinv(q) { return { x: -q.x, y: -q.y, z: -q.z, w: q.w }; }
export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const scl = (a, s) => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a, b) => ({ x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x });
export const len = (a) => Math.hypot(a.x, a.y, a.z);
export const norm = (a) => { const l = len(a) || 1; return scl(a, 1 / l); };

// velocity of a rigid body at a world point
export function pointVel(body, p) {
  const lv = body.linvel(), av = body.angvel(), c = body.worldCom ? body.worldCom() : body.translation();
  return add(lv, cross(av, sub(p, c)));
}

// annulus as a ring of boxes (for CORE rings). Box-box contacts are far cheaper than general
// convex hulls, and the inner faces sit exactly on the 55 mm hole so threading a pole is unchanged.
export function ringBoxes(rIn, rOut, h, segs) {
  const rc = (rIn + rOut) / 2, half = Math.PI / segs;
  const out = [];
  for (let s = 0; s < segs; s++) {
    const a = (s + 0.5) * 2 * half;
    out.push({ hx: (rOut - rIn) / 2, hy: h / 2, hz: rc * Math.tan(half), x: Math.cos(a) * rc, z: Math.sin(a) * rc, q: { x: 0, y: Math.sin(-a / 2), z: 0, w: Math.cos(-a / 2) } });
  }
  return out;
}
// annulus as a compound of convex segments
export function ringHullPoints(rIn, rOut, h, segs) {
  const out = [];
  for (let s = 0; s < segs; s++) {
    const a0 = (s / segs) * Math.PI * 2, a1 = ((s + 1) / segs) * Math.PI * 2, am = (a0 + a1) / 2;
    const pts = [];
    for (const y of [-h / 2, h / 2]) {
      pts.push(Math.cos(a0) * rIn, y, Math.sin(a0) * rIn);
      pts.push(Math.cos(a1) * rIn, y, Math.sin(a1) * rIn);
      pts.push(Math.cos(a0) * rOut, y, Math.sin(a0) * rOut);
      pts.push(Math.cos(am) * rOut, y, Math.sin(am) * rOut);
      pts.push(Math.cos(a1) * rOut, y, Math.sin(a1) * rOut);
    }
    out.push(new Float32Array(pts));
  }
  return out;
}

// 2D geometry helpers (x, z plane)
export function pointInPoly(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > p[1]) !== (b[1] > p[1]) && p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
// separating-axis test for two convex polygons [[x,z],...]
export function polysOverlap(A, B) {
  for (const P of [A, B]) {
    for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length];
      const nx = q[1] - p[1], nz = p[0] - q[0];
      let aMin = Infinity, aMax = -Infinity, bMin = Infinity, bMax = -Infinity;
      for (const v of A) { const d = v[0] * nx + v[1] * nz; aMin = Math.min(aMin, d); aMax = Math.max(aMax, d); }
      for (const v of B) { const d = v[0] * nx + v[1] * nz; bMin = Math.min(bMin, d); bMax = Math.max(bMax, d); }
      if (aMax < bMin || bMax < aMin) return false;
    }
  }
  return true;
}
export function polyInsidePoly(inner, outer) { return inner.every((p) => pointInPoly(p, outer)); }
export function polyCircleOverlap(poly, c, r) {
  if (pointInPoly(c, poly)) return true;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const abx = b[0] - a[0], abz = b[1] - a[1];
    const t = Math.max(0, Math.min(1, ((c[0] - a[0]) * abx + (c[1] - a[1]) * abz) / (abx * abx + abz * abz)));
    const dx = a[0] + abx * t - c[0], dz = a[1] + abz * t - c[1];
    if (dx * dx + dz * dz <= r * r) return true;
  }
  return false;
}
