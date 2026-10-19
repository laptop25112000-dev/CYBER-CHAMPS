// Account system: Supabase Auth (email + password) with a profile, synced settings,
// match history and a global leaderboard (see supabase/schema.sql).
import { SUPABASE_URL, SUPABASE_KEY } from './supabase-config.js';

const USERNAME_RE = /^[A-Za-z0-9_]{3,20}$/;

function friendly(err) {
  const m = (err && (err.message || err.error_description || String(err))) || 'Something went wrong';
  if (/invalid login credentials/i.test(m)) return 'Email or password is incorrect.';
  if (/missing email|missing phone|email.*required/i.test(m)) return 'Enter your email and password.';
  if (/same.*password|different from the old/i.test(m)) return 'Choose a password you have not used here before.';
  if (/already registered|already exists/i.test(m)) return 'An account with this email already exists. Try signing in.';
  if (/password should be at least|weak password/i.test(m)) return 'Choose a stronger password (at least 8 characters).';
  if (/rate limit|too many/i.test(m)) return 'Too many attempts. Please wait a minute and try again.';
  if (/database error saving new user/i.test(m)) return 'That username was just taken. Pick another one.';
  if (/failed to fetch|network/i.test(m)) return 'Could not reach the server. Check your connection.';
  if (/valid email|invalid format/i.test(m)) return 'Enter a valid email address.';
  return m;
}

class AccountService {
  constructor() {
    this.client = null;
    this.user = null;        // Supabase auth user
    this.profile = null;     // { username, display_name, settings, created_at }
    this.stats = null;
    this.listeners = [];
    this.ready = false;
  }

  get available() { return !!this.client; }
  get signedIn() { return !!(this.user && this.profile); }
  onChange(fn) { this.listeners.push(fn); }
  emit() { this.listeners.forEach((f) => f(this)); }

  async init() {
    if (!window.supabase || !window.supabase.createClient) { this.ready = true; this.emit(); return; }
    this.client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'hyperdrive.auth' },
    });
    // a password-reset email links back with ?reset=1: the session from the link lets the user set a new password
    const params = new URLSearchParams(location.search);
    const resetLink = params.get('reset') === '1';
    try {
      const { data } = await this.client.auth.getSession();
      if (data.session) { this.user = data.session.user; await this.loadProfile(); }
      if (resetLink) {
        this.recovery = !!data.session;
        this.recoveryError = data.session ? null : 'This reset link has expired or was already used. Request a new one.';
        params.delete('reset'); params.delete('code');
        history.replaceState(null, '', location.pathname + (params.toString() ? `?${params}` : ''));
      }
    } catch (e) { console.warn('auth init', e); }
    this.client.auth.onAuthStateChange((event, session) => {
      const uid = session?.user?.id || null;
      if (uid === (this.user?.id || null)) return;
      this.user = session?.user || null;
      if (this.user) this.loadProfile().then(() => this.emit()); else { this.profile = null; this.stats = null; this.emit(); }
    });
    this.ready = true;
    this.emit();
  }

  async loadProfile() {
    if (!this.user) return;
    const { data, error } = await this.client.from('profiles').select('username, display_name, settings, created_at').eq('id', this.user.id).maybeSingle();
    if (error) { console.warn('profile', error); return; }
    this.profile = data;
    await this.loadStats();
  }
  async loadStats() {
    const { data, error } = await this.client.rpc('my_stats');
    if (!error) this.stats = data;
  }

  async usernameAvailable(name) {
    if (!USERNAME_RE.test(name)) return false;
    const { data, error } = await this.client.rpc('username_available', { name });
    if (error) throw new Error(friendly(error));
    return !!data;
  }

  async signUp({ email, password, username, displayName }) {
    if (!this.client) throw new Error('Accounts are unavailable right now.');
    if (!USERNAME_RE.test(username)) throw new Error('Username: 3–20 letters, numbers or underscores.');
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    if (!(await this.usernameAvailable(username))) throw new Error('That username is taken.');
    const { data, error } = await this.client.auth.signUp({
      email, password, options: { data: { username, display_name: (displayName || username).slice(0, 32) } },
    });
    if (error) throw new Error(friendly(error));
    if (!data.session) return { needsConfirmation: true };
    this.user = data.session.user;
    await this.loadProfile();
    this.emit();
    return { needsConfirmation: false };
  }

  async signIn({ email, password }) {
    if (!this.client) throw new Error('Accounts are unavailable right now.');
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw new Error(friendly(error));
    this.user = data.user;
    await this.loadProfile();
    this.emit();
  }

  async signOut() {
    if (!this.client) return;
    await this.client.auth.signOut();
    this.user = null; this.profile = null; this.stats = null;
    this.emit();
  }

  async resetPassword(email) {
    if (!this.client) throw new Error('Accounts are unavailable right now.');
    const { error } = await this.client.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}${location.pathname}?reset=1` });
    if (error) throw new Error(friendly(error));
  }
  async updatePassword(password) {
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    const { error } = await this.client.auth.updateUser({ password });
    if (error) throw new Error(friendly(error));
    this.recovery = false;
  }
  // permanently deletes the account; its profile and match history go with it (see delete_my_account in schema.sql)
  async deleteAccount() {
    const { error } = await this.client.rpc('delete_my_account');
    if (error) throw new Error(friendly(error));
    try { await this.client.auth.signOut({ scope: 'local' }); } catch { /* the user no longer exists */ }
    this.user = null; this.profile = null; this.stats = null;
    this.emit();
  }

  async updateProfile({ displayName }) {
    const name = String(displayName || '').trim().slice(0, 32);
    if (!name) throw new Error('Display name cannot be empty.');
    const { error } = await this.client.from('profiles').update({ display_name: name, updated_at: new Date().toISOString() }).eq('id', this.user.id);
    if (error) throw new Error(friendly(error));
    this.profile.display_name = name;
    this.emit();
  }

  async saveSettings(settings) {
    if (!this.signedIn) return;
    const { error } = await this.client.from('profiles').update({ settings, updated_at: new Date().toISOString() }).eq('id', this.user.id);
    if (!error) this.profile.settings = settings;
  }

  async saveMatch(final, starMap) {
    if (!this.signedIn) return false;
    const pick = (s) => ({
      total: s.total, high: s.high, star: s.star, apex: s.apex, drop: s.drop, gStar: s.gStar, gDrop: s.gDrop,
      starMaps: s.starMaps, payloads: s.payloads, station: s.station, foulPts: s.foulPts, rp: s.rpTotal,
    });
    const balances = [...final.red.stationDetail, ...final.blue.stationDetail].filter((d) => d.state === 'balance').length;
    const row = {
      red_score: final.red.total, blue_score: final.blue.total,
      winner: final.red.total > final.blue.total ? 'red' : final.blue.total > final.red.total ? 'blue' : 'tie',
      red_rp: final.red.rpTotal, blue_rp: final.blue.rpTotal, star_map: starMap.join(''),
      details: { red: pick(final.red), blue: pick(final.blue), red_maps: final.red.starMaps, blue_maps: final.blue.starMaps, balances },
    };
    const { error } = await this.client.from('matches').insert(row);
    if (error) throw new Error(friendly(error));
    await this.loadStats();
    this.emit();
    return true;
  }

  async recentMatches(limit = 12) {
    const { data, error } = await this.client.from('matches').select('red_score, blue_score, winner, red_rp, blue_rp, star_map, created_at').order('created_at', { ascending: false }).limit(limit);
    if (error) throw new Error(friendly(error));
    return data;
  }

  async leaderboard(limit = 25) {
    if (!this.client) throw new Error('Leaderboard is unavailable offline.');
    const { data, error } = await this.client.rpc('leaderboard', { lim: limit });
    if (error) throw new Error(friendly(error));
    return data;
  }
}

export const Account = new AccountService();
