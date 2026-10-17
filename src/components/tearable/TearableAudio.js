// Web Audio API Synthesizer for Realistic Paper Tearing, Ripping, Rustling, and Taping SFX

class TearableAudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Realistic Paper Ripping Sound (burst of filtered white noise with randomized crackles)
  playTear(intensity = 1.0) {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const duration = 0.28 * intensity;
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate fibrous tearing noise
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise smoothing with micro-crackles
        lastVal = (lastVal + 0.04 * white) / 1.04;
        const crackle = Math.random() > 0.94 ? (Math.random() * 2 - 1) * 1.5 : 0;
        data[i] = (lastVal * 2.2 + crackle * 0.6) * (1 - i / bufferSize);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to mimic fiber tearing frequency
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + duration);
      filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Ignore if blocked by browser audio policy
    }
  }

  // Paper Rustle / Flip Sound
  playPaperFlip() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const duration = 0.18;
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Ignore
    }
  }

  // Scotch Tape Sticking / Restoration Sound
  playTapeStick() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(740, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Ignore
    }
  }

  // Stamp Thud Sound (Official Stamped Approval)
  playStamp() {
    if (this.isMuted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {
      // Ignore
    }
  }
}

export const tearAudio = new TearableAudioSynthesizer();
