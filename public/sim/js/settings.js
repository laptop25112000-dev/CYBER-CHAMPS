// Player settings: stored in localStorage and, when signed in, synced to the account profile.
const KEY = 'hyperdrive.settings.v1';
const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

export const DEFAULTS = {
  teams: ['009', '1002', '2001', '2002'],     // team numbers for Red 1, Red 2, Blue 1, Blue 2
  pads: [0, 1, 2, 3],                        // gamepad index per robot (-1 = none)
  labels: true,
  guides: true,
  quality: coarse ? 'low' : 'high',          // 'high' | 'low'
  sound: true,
  tank: false,
  touchRobot: 0,
  drivers: 1,                                // local match: drivers sharing this computer (1-4)
  keys: {},                                  // keyboard rebinds: { '0'..'3' | 'solo': { action: KeyboardEvent.code } }
};

function clean(s) {
  const out = { ...DEFAULTS };
  if (!s || typeof s !== 'object') return out;
  if (Array.isArray(s.teams) && s.teams.length === 4) out.teams = s.teams.map((t, i) => (/^\d{1,6}$/.test(String(t)) ? String(t) : DEFAULTS.teams[i]));
  if (Array.isArray(s.pads) && s.pads.length === 4) out.pads = s.pads.map((p) => (Number.isInteger(p) && p >= -1 && p <= 3 ? p : -1));
  for (const k of ['labels', 'guides', 'sound', 'tank']) if (typeof s[k] === 'boolean') out[k] = s[k];
  if (s.quality === 'high' || s.quality === 'low') out.quality = s.quality;
  if (Number.isInteger(s.touchRobot) && s.touchRobot >= 0 && s.touchRobot <= 3) out.touchRobot = s.touchRobot;
  if (Number.isInteger(s.drivers) && s.drivers >= 1 && s.drivers <= 4) out.drivers = s.drivers;
  if (s.keys && typeof s.keys === 'object') {
    out.keys = {};
    for (const [slot, map] of Object.entries(s.keys)) {
      if (!/^(0|1|2|3|solo)$/.test(slot) || !map || typeof map !== 'object') continue;
      out.keys[slot] = {};
      for (const [a, code] of Object.entries(map)) if (/^[a-z][A-Za-z]{1,7}$/.test(a) && /^[A-Za-z0-9]{2,20}$/.test(String(code))) out.keys[slot][a] = String(code);
    }
  }
  return out;
}

class SettingsStore {
  constructor() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY)); } catch { /* storage unavailable */ }
    this.data = clean(saved);
    this.listeners = [];
    this.syncFn = null;
    this._t = 0;
  }
  get(k) { return this.data[k]; }
  set(k, v) {
    this.data = clean({ ...this.data, [k]: v });
    this.persist();
  }
  replace(obj, { sync = false } = {}) {
    this.data = clean({ ...this.data, ...obj });
    this.persist(sync);
  }
  persist(sync = true) {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch { /* ignore */ }
    this.listeners.forEach((f) => f(this.data));
    if (sync && this.syncFn) { clearTimeout(this._t); this._t = setTimeout(() => this.syncFn(this.data), 800); }
  }
  onChange(fn) { this.listeners.push(fn); }
}

export const Settings = new SettingsStore();
export const isTouch = coarse;
