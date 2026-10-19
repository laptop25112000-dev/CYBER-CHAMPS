// Keyboard + Gamepad input. Each robot has its own keyboard cluster and can also be driven by a gamepad.

export const KEYMAP = [
  { fwd: ['KeyW'], back: ['KeyS'], left: ['KeyA'], right: ['KeyD'], armDown: ['KeyQ'], armUp: ['KeyE'], grip: ['KeyR'], cargo: ['KeyF'] },
  { fwd: ['KeyI'], back: ['KeyK'], left: ['KeyJ'], right: ['KeyL'], armDown: ['KeyU'], armUp: ['KeyO'], grip: ['KeyP'], cargo: ['Semicolon'] },
  { fwd: ['ArrowUp'], back: ['ArrowDown'], left: ['ArrowLeft'], right: ['ArrowRight'], armDown: ['Comma'], armUp: ['Period'], grip: ['Slash'], cargo: ['KeyM'] },
  { fwd: ['Numpad8'], back: ['Numpad5', 'Numpad2'], left: ['Numpad4'], right: ['Numpad6'], armDown: ['Numpad7'], armUp: ['Numpad9'], grip: ['Numpad1'], cargo: ['Numpad3'] },
];
// online play with one robot per laptop: WASD or the arrow keys, whichever the driver prefers
export const SOLO_KEYS = { fwd: ['KeyW', 'ArrowUp'], back: ['KeyS', 'ArrowDown'], left: ['KeyA', 'ArrowLeft'], right: ['KeyD', 'ArrowRight'], armDown: ['KeyQ', 'Comma'], armUp: ['KeyE', 'Period'], grip: ['KeyR', 'Slash'], cargo: ['KeyF', 'KeyM'] };
export const HP_KEYS = {
  red: { core: 'Digit1', payload: ['Digit2', 'Digit3'], starburst: 'Digit4' },
  blue: { core: 'Digit7', payload: ['Digit8', 'Digit9'], starburst: 'Digit0' },
};
// rebinding: an override replaces an action's keys (the defaults are kept to reset to)
export const ACTIONS = [['fwd', 'Forward'], ['back', 'Reverse'], ['left', 'Turn left'], ['right', 'Turn right'], ['armDown', 'Arm down'], ['armUp', 'Arm up'], ['grip', 'Gripper'], ['cargo', 'Cargo bay']];
const DEFAULT_KEYMAP = KEYMAP.map((k) => JSON.parse(JSON.stringify(k)));
const DEFAULT_SOLO = JSON.parse(JSON.stringify(SOLO_KEYS));
export function applyKeyBindings(over = {}) {
  KEYMAP.forEach((k, i) => { for (const [a] of ACTIONS) k[a] = over[i]?.[a] ? [over[i][a]] : [...DEFAULT_KEYMAP[i][a]]; });
  for (const [a] of ACTIONS) SOLO_KEYS[a] = over.solo?.[a] ? [over.solo[a]] : [...DEFAULT_SOLO[a]];
}
export const KEY_LABEL = (code) => code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ').replace('Semicolon', ';').replace('Comma', ',').replace('Period', '.').replace('Slash', '/').replace('Arrow', '');

export class Input {
  constructor() {
    this.down = new Set();
    this.pressed = new Set();       // edge-triggered this frame
    this.padPrev = new Map();
    this.padAssign = [0, 1, 2, 3];  // robot slot -> gamepad index (-1 = keyboard only)
    this.tank = false;
    // the game only takes the keyboard while a match is on screen with no menu or dialog open; everywhere else
    // Tab, Space, Enter and the arrows keep their normal browser meaning (keyboard navigation, buttons, scrolling)
    this.active = () => true;                // set by main.js
    window.addEventListener('keydown', (e) => {
      const t = e.target, tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      if (!this.active()) return;
      if ((tag === 'BUTTON' || tag === 'A') && (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter')) return;   // operate the focused control
      if (!this.down.has(e.code)) this.pressed.add(e.code);
      this.down.add(e.code);
      if (e.code.startsWith('Arrow') || e.code === 'Space' || e.code === 'Slash' || e.code === 'Tab' || e.code === 'Quote' || e.code.startsWith('Numpad')) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => { this.down.delete(e.code); this.held.delete(e.code); });
    window.addEventListener('blur', () => { this.down.clear(); this.held.clear(); });
    this.held = new Map();           // code -> seconds held (keyboard throttle ramp)
  }
  // call once per frame before reading robots
  update(dt) { for (const c of this.down) this.held.set(c, (this.held.get(c) || 0) + dt); }
  any(codes) { return codes.some((c) => this.down.has(c)); }
  // keyboard "analog": a tap moves gently, holding ramps up to max over ~0.35 s
  ramp(codes, base = 0.3, max = 1) {
    let t = -1;
    for (const c of codes) if (this.down.has(c)) t = Math.max(t, this.held.get(c) || 0);
    return t < 0 ? 0 : Math.min(max, base + 2 * t);
  }
  hit(code) { return this.pressed.has(code); }
  hitAny(codes) { return codes.some((c) => this.pressed.has(c)); }

  pads() { return navigator.getGamepads ? [...navigator.getGamepads()] : []; }

  // returns { throttle, turn, arm, grip, cargo, hpCore, hpPayload, start, source }
  // solo: this laptop drives a single robot (online) -> SOLO_KEYS and the first connected gamepad
  robot(slot, solo = false) {
    const k = solo ? SOLO_KEYS : KEYMAP[slot];
    let throttle = this.ramp(k.fwd) - this.ramp(k.back);
    let turn = this.ramp(k.right, 0.22, 0.55) - this.ramp(k.left, 0.22, 0.55);
    let arm = (this.any(k.armUp) ? 1 : 0) - (this.any(k.armDown) ? 1 : 0);
    let grip = this.hitAny(k.grip), cargo = this.hitAny(k.cargo);
    let hpCore = false, hpPayload = false, start = false, source = 'keys';
    if (throttle !== 0 && turn !== 0) turn *= 1.25;     // arcs: keep a useful turn radius at speed
    const pi = solo ? this.pads().findIndex((p) => p && p.connected) : this.padAssign[slot];
    const pad = pi >= 0 ? this.pads()[pi] : null;
    if (pad && pad.connected) {
      const dz = (v) => (Math.abs(v) < 0.12 ? 0 : Math.sign(v) * ((Math.abs(v) - 0.12) / 0.88) ** 1.6);
      const prev = this.padPrev.get(pi) || [];
      const btn = (i) => pad.buttons[i] && pad.buttons[i].pressed;
      const edge = (i) => btn(i) && !prev[i];
      let pt, pr;
      if (this.tank) {
        const l = -dz(pad.axes[1] || 0), r = -dz(pad.axes[3] || 0);
        pt = (l + r) / 2; pr = (l - r) / 2;
      } else { pt = -dz(pad.axes[1] || 0); pr = dz(pad.axes[2] || 0) * 0.8; }
      const rt = pad.buttons[7] ? pad.buttons[7].value : 0, lt = pad.buttons[6] ? pad.buttons[6].value : 0;
      let pa = rt - lt + (btn(12) ? 1 : 0) - (btn(13) ? 1 : 0) + (btn(5) ? 1 : 0) - (btn(4) ? 1 : 0);
      if (Math.abs(pt) + Math.abs(pr) + Math.abs(pa) > 0.01) source = 'pad';
      throttle = clamp(throttle + pt); turn = clamp(turn + pr); arm = clamp(arm + pa);
      grip = grip || edge(0); cargo = cargo || edge(1);
      hpCore = edge(2); hpPayload = edge(3); start = edge(9);
      this.padPrev.set(pi, pad.buttons.map((b) => b.pressed));
    }
    const t = this.touch;
    if (t && t.slot === slot) {
      throttle = clamp(throttle + t.throttle); turn = clamp(turn + t.turn); arm = clamp(arm + t.arm);
      grip = grip || t.grip; cargo = cargo || t.cargo;
      t.grip = false; t.cargo = false;
      if (Math.abs(t.throttle) + Math.abs(t.turn) > 0.01) source = 'touch';
    }
    return { throttle, turn, arm, grip, cargo, hpCore, hpPayload, start, source };
  }
  endFrame() { this.pressed.clear(); }
}
const clamp = (v) => Math.max(-1, Math.min(1, v));
