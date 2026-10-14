import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  Shield, Volume2, VolumeX, Menu, X, Terminal, 
  Radio, Send, ChevronRight, Zap, Trophy, Palette 
} from 'lucide-react';

export default function Navbar({ onOpenThemeModal }) {
  const { activeThemeObj } = useTheme();
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    const isMuted = soundManager.toggleMute();
    setIsAudioEnabled(!isMuted);
  };

  const navItems = [
    { label: 'NRL ROBO CAR', href: '#nrl-car', badge: 'NEW' },
    { label: 'SQUAD ROSTER', href: '#squad' },
    { label: '3D ARSENAL', href: '#lab' },
    { label: 'MISSIONS', href: '#missions' },
    { label: 'TERMINAL', href: '#terminal' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b transition-colors duration-300"
      style={{ borderColor: `${activeThemeObj.hex}25` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <a 
          href="#"
          onClick={() => soundManager.playClick()}
          className="flex items-center gap-3 group"
        >
          <div 
            className="relative w-10 h-10 rounded-xl bg-slate-900 border flex items-center justify-center transition-colors"
            style={{ borderColor: `${activeThemeObj.hex}60` }}
          >
            <Shield className="w-5 h-5 transition-colors" style={{ color: activeThemeObj.hex }} />
            <span 
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-ping" 
              style={{ backgroundColor: activeThemeObj.hex }}
            />
          </div>
          <div>
            <div className="font-['Orbitron'] text-xl font-black tracking-wider text-white flex items-center gap-1.5">
              <span>CYBER</span>
              <span style={{ color: activeThemeObj.hex }}>CHAMPS</span>
            </div>
            <div className="font-mono text-[9px] text-slate-400 tracking-widest uppercase">
              NRL 2026 // ROBOTICS & CYBER SQUAD
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
              className="px-3 py-1.5 font-mono text-xs text-slate-300 hover:text-white hover:bg-slate-900/60 rounded-lg transition-colors border border-transparent hover:border-slate-800 flex items-center gap-1.5"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span 
                  className="font-mono text-[9px] px-1.5 py-0.2 rounded font-bold"
                  style={{
                    backgroundColor: `${activeThemeObj.hex}20`,
                    color: activeThemeObj.hex,
                    border: `1px solid ${activeThemeObj.hex}40`
                  }}
                >
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Controls & CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2.5 rounded-xl border flex items-center gap-2 font-mono text-xs bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 transition-all"
            title={isAudioEnabled ? 'Mute Cyber Audio' : 'Enable Web Audio Synth'}
          >
            {isAudioEnabled ? (
              <>
                <Volume2 className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span className="flex items-center gap-0.5">
                  <span className="w-1 h-3 animate-pulse" style={{ backgroundColor: activeThemeObj.hex }} />
                  <span className="w-1 h-4 animate-pulse delay-75" style={{ backgroundColor: activeThemeObj.hex }} />
                  <span className="w-1 h-2 animate-pulse delay-150" style={{ backgroundColor: activeThemeObj.hex }} />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="text-[11px] text-slate-400">SFX OFF</span>
              </>
            )}
          </button>

          {/* Secure Transmission CTA */}
          <a
            href="#contact"
            onClick={() => soundManager.playClick()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-950 font-mono text-xs font-bold transition-all active:scale-95 shadow-md"
            style={{ 
              backgroundColor: activeThemeObj.hex,
              boxShadow: `0 0 20px ${activeThemeObj.bgGlow}`
            }}
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
            {isAudioEnabled ? <Volume2 className="w-4 h-4" style={{ color: activeThemeObj.hex }} /> : <VolumeX className="w-4 h-4" />}
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
              className="block px-3 py-2 font-mono text-sm text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg"
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
            className="block text-center px-4 py-2.5 rounded-lg text-slate-950 font-mono text-xs font-bold"
            style={{ backgroundColor: activeThemeObj.hex }}
          >
            INITIATE TRANSMISSION
          </a>
        </div>
      )}
    </header>
  );
}
