import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { 
  Shield, Volume2, VolumeX, Menu, X, Terminal, 
  Radio, Send, ChevronRight 
} from 'lucide-react';

export default function Navbar({ activeSection, onNavigate }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    const isMuted = soundManager.toggleMute();
    setIsAudioEnabled(!isMuted);
  };

  const navItems = [
    { label: 'SQUAD ROSTER', href: '#squad' },
    { label: '3D ARSENAL', href: '#lab' },
    { label: 'MISSIONS', href: '#missions' },
    { label: 'TERMINAL', href: '#terminal' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <a 
          href="#"
          onClick={() => soundManager.playClick()}
          className="flex items-center gap-3 group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 via-slate-900 to-purple-600/30 border border-cyan-500/50 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <div className="font-['Orbitron'] text-xl font-black tracking-wider text-white flex items-center gap-1.5">
              <span>CYBER</span>
              <span className="text-cyan-400 text-glow-cyan">CHAMPS</span>
            </div>
            <div className="font-mono text-[9px] text-slate-400 tracking-widest uppercase">
              DEFENSE // RESEARCH // EXPLOITS
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => soundManager.playHover()}
              className="px-3 py-1.5 font-mono text-xs text-slate-300 hover:text-cyan-400 hover:bg-slate-900/60 rounded-lg transition-colors border border-transparent hover:border-cyan-500/30"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Controls & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs transition-all ${
              isAudioEnabled 
                ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20' 
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
            title={isAudioEnabled ? 'Mute Cyber Audio' : 'Enable Web Audio Synth'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-cyan-400 animate-pulse" />
                  <span className="w-1 h-4 bg-cyan-400 animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-cyan-400 animate-pulse delay-150" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-[11px]">SFX OFF</span>
              </>
            )}
          </button>

          {/* Secure Transmission CTA */}
          <a
            href="#contact"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all active:scale-95"
          >
            <Radio className="w-3.5 h-3.5" />
            TRANSMIT
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-6 space-y-3">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 font-mono text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-900 rounded-lg"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-center px-4 py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold"
          >
            INITIATE TRANSMISSION
          </a>
        </div>
      )}
    </header>
  );
}
