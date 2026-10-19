// NRL 2026 HYPERDRIVE — all game constants, taken from NRL_2026_HYPERDRIVE_GAME_MANUAL.pdf
// unless marked ASSUMPTION (value not given in the manual; estimated from its figures).
//
// World frame: meters, +Y up. Field diagram coordinates (Fig. 3.0 / 3.1) are inches measured
// from the top-left inner corner: X to the right, Y down. Red drives from the top (Y = 0),
// Blue from the bottom (Y = 144). The field is 180° rotationally symmetric.

export const IN = 0.0254;
export const FIELD_IN = 144;                       // 3.1: 12 ft x 12 ft
export const FIELD = FIELD_IN * IN;                // 3.6576 m
export const HALF = FIELD / 2;
export const WALL = { height: 9 * IN, thick: 0.018 }; // 3.2.1: 9 in tall, 18 mm thick
export const TILE = 24 * IN;                       // 36 foam tiles, 24 in

// diagram inches -> world x/z
export const wx = (X) => (X - 72) * IN;
export const wz = (Y) => (Y - 72) * IN;
export const rot180 = ([X, Y]) => [FIELD_IN - X, FIELD_IN - Y];

export const MATCH = {
  length: 150,          // 2:30 (4.4)
  levelUp: 30,          // final 30 s (4.4)
  starburstThreshold: 10,   // Table 4.5.2 regional
  payloadReduction: 6,      // 4.5.1 -> reduced threshold 4
  sourceZoneCap: 6,         // G4.3
  hpCores: 20,              // 3.4.1: 20 per squad at the HP station
  controlLimit: 2,          // G4.2
};

export const POINTS = {
  core: { high: 3, star: 5, apex: 9, drop: 1 },
  golden: { star: 7, drop: 3 },
  station: { engage: 3, dock: 8, balance: 15 },
  starBonus: 10, payloadBonus: 10,
  minorFoul: 3, majorFoul: 15,
};

export const RP = {               // Table 4.5.1 / 4.5.2 (Regional Championship values)
  win: 3, tie: 1,
  starburstCores: 12,             // "SUPERCHARGE RP 12 Cores"
  patternPoints: 36,              // STAR-MAP RP 36 points
  levelUpPoints: 25,              // LEVEL-UP RP 25 points
};

// ---------- scoring elements ----------
export const CORE = {               // 3.4.1
  rOut: 0.095 / 2, rIn: 0.055 / 2, h: 0.030, mass: 0.040,
};
export const PAYLOAD = {            // 3.4.3: must fit a 4 in cube, > 2 in cube, <= 400 g
  size: 0.100,                      // ASSUMPTION: team payload modelled as a 100 mm cube
  mass: 0.200,                      // ASSUMPTION: 200 g (rule only caps it at 400 g)
};

// ---------- field elements (red; blue is rot180) ----------
export const POLE = {               // Fig. 3.3.1 / 3.3.2 / 3.3.4
  r: 0.0254 / 2,                    // 1.0 in dia
  baseR: 0.105 / 2,                 // 105 mm dia base
  baseH: 0.008,                     // ASSUMPTION: base disc thickness
  capR: 0.019, capH: 0.010,         // ASSUMPTION: dome cap (must pass through the 55 mm hole)
  high: { top: 0.130, cap: 4 },
  star: { top: 0.100, cap: 3 },
  apex: { top: 0.365, collar: 0.365 - 0.170, cap: 6 },
};

export const RED = {
  startZone: { x0: 48, x1: 96, y0: 0, y1: 24 },                       // 48 x 24 in
  dropZone: [[0, 0], [25, 0], [0, 25]],                                // 25 x 25 in corner
  sourceZone: [[0, 144], [0, 118], [26, 144]],                         // 26 x 26 in corner
  vault: [24, 144 - 2.6],                                              // Fig 3.1 (center 2.6 in off wall)
  vaultZoneR: 15,                     // ASSUMPTION: 15 in radius half-disc around the vault
  starPoles: [[48, 12], [96, 12]],
  highPoles: [[48, 48], [72, 48], [96, 48]],
  spikeMarks: [[72, 76], [48, 88], [96, 88]],                          // red COREs
  station: { cx: 13.25, cy: 72 },                                      // left wall
  // Fig 3.1 puts the apex poles against the wall, ±6 in from the station centre. They are set
  // 2.0 in off the wall so a 95 mm CORE threaded on them clears the 9 in wall.
  apexPoles: [[2.0, 66], [2.0, 78]],
  starburstButton: [-13.5, -13.5],
  trifron: [-16, 72],
  driverArea: { x0: 30, x1: 114, y0: -27, y1: -2 },
  hpArea: [-27, 124],
};

export const VAULT = {              // Fig. 3.3.5: 108 mm dia, 205 mm tall, opening 50 mm above floor
  rIn: 0.0505, rOut: 0.054, top: 0.205, gap: 0.050, cores: 6,
};

export const STATION = {
  // ASSUMPTION: the manual gives no station dimensions. Measured from Fig 3.0/3.1 and 3.3.3:
  width: 20.3 * IN,                 // across (perpendicular to wall)
  deckLen: 26 * IN, rampLen: 18 * IN,
  deckH: 0.110,                     // deck surface height when BALANCED
  thick: 0.018,
  maxTilt: 15 * Math.PI / 180,
  levelTol: 2.5 * Math.PI / 180,    // "parallel to the ground" tolerance
  deckMass: 6.0, rampMass: 1.5,
  // pivot bearing: static / sliding friction torque (N·m) and viscous damping (N·m·s/rad). A lone 3.5 kg robot
  // holds the deck still within about ±4 cm of the pivot, two robots within about ±2 cm of their shared centre.
  pivotStatic: 1.3, pivotKinetic: 0.9, pivotDamping: 5,
};

// ---------- robot (from NRL Robot Final Assembly.step) ----------
export const ROBOT = {
  mass: 3.5,                // ASSUMPTION: kit robot mass (rule R1.2 caps it at 8 kg)
  wheelR: 0.0565,           // CAD: 113 mm wheels
  motorFreeRPM: 300,        // ASSUMPTION: 37 mm 12 V 300 RPM gear motor
  motorStallTorque: 1.0,    // ASSUMPTION: N·m at the wheel
  gearHold: 2.6,            // N per wheel static back-drive resistance of the gearbox
  mu: 0.95,                 // rubber on EVA foam (static)
  muKinetic: 0.8,           // sliding / scrubbing
  armMin: -16.9, armMax: 90, // deg (CAD: gripper base plate is 1 mm above the floor at -16.9°)
  armRate: 150, servoMax: 300, // deg/s (driver command rate, MG996R no-load speed)
  fingerClosed: 0.000, fingerOpen: 0.0425, fingerHold: 0.0285, // per-side lateral finger travel
  fingerRate: 0.20,          // m/s
  trayDump: 115, trayRate: 260,
};

export const COLORS = {
  red: 0xc21b26, blue: 0x1c46c4, gold: 0xe9a81a,
  redTape: 0xe0262c, blueTape: 0x2050e0,
  tile: 0xa9adb3, wall: 0x2a2d33,
};

export const TEAMS = [
  { id: 0, name: 'Red 1', squad: 'red', number: '009',    startX: 60 },
  { id: 1, name: 'Red 2', squad: 'red', number: '1002', startX: 84 },
  { id: 2, name: 'Blue 1', squad: 'blue', number: '2001', startX: 84 },
  { id: 3, name: 'Blue 2', squad: 'blue', number: '2002', startX: 60 },
];

// helpers producing blue coordinates
export function squadPoint(squad, p) { return squad === 'red' ? p : rot180(p); }
export function squadPoly(squad, poly) { return poly.map((p) => squadPoint(squad, p)); }
