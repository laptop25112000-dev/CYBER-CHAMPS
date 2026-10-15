import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  Shield, Volume2, VolumeX, Menu, X, Terminal, 
  Trophy, Palette, Sun, Moon 
} from 'lucide-react';

export default function Navbar() {
  const { activeThemeObj, isLightMode, toggleThemeMode } = useTheme();
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleAudio = () => {
    const isMuted = soundManager.toggleMute();
    setIsAudioEnabled(!isMuted);
  };

  const navItems = [
    { label: 'NRL ROBO CAR', href: '#nrl-car', badge: 'KIT 2026' },
    { label: 'TEAM', href: '#squad' },
    { label: 'TERMINAL', href: '#terminal' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b-3 border-slate-900 shadow-[0_4px_0px_0px_#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <a 
          href="#"
          onClick={() => soundManager.playClick()}
          className="flex items-center gap-3 group"
        >
          <div 
            className="w-11 h-11 rounded-xl border-2 border-slate-900 bg-amber-300 shadow-[3px_3px_0px_0px_#0f172a] flex items-center justify-center transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <Shield className="w-6 h-6 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="font-['Orbitron'] text-xl font-black tracking-tight text-slate-950 flex items-center gap-1.5">
              <span>CYBER</span>
              <span style={{ color: activeThemeObj.hex }}>CHAMPS</span>
            </div>
            <div className="font-mono text-[9px] tracking-widest uppercase font-black text-slate-600">
              NRL DELHI REGIONAL // TEAM PORTFOLIO
            </div>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => soundManager.playHover()}
              className="px-3.5 py-1.5 font-mono text-xs font-bold rounded-lg border-2 border-transparent hover:border-slate-900 hover:bg-slate-100 transition-all flex items-center gap-1.5 text-slate-800"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span 
                  className="font-mono text-[9px] px-1.5 py-0.2 rounded font-black border border-slate-900 shadow-[1px_1px_0px_0px_#000]"
                  style={{
                    backgroundColor: activeThemeObj.hex,
                    color: '#0f172a'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </nav>

        {/* Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className="neo-btn p-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold"
            title={isAudioEnabled ? 'Mute Cyber Audio' : 'Enable Web Audio Synth'}
          >
            {isAudioEnabled ? (
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px]">SFX ON</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="text-[11px] text-slate-500">SFX OFF</span>
              </span>
            )}
          </button>

          {/* Quick CTA to Robo Car */}
          <a
            href="#nrl-car"
            onClick={() => soundManager.playClick()}
            className="neo-btn px-4 py-2 rounded-xl text-slate-950 font-mono text-xs font-black shadow-[3px_3px_0px_0px_#000]"
            style={{ backgroundColor: activeThemeObj.hex }}
          >
            ROBO CAR 3D
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg border-2 border-slate-900 bg-white"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border-2 border-slate-900 bg-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-slate-900 bg-white px-4 py-5 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 font-mono text-sm font-bold text-slate-800 hover:bg-slate-100 rounded-lg"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#nrl-car"
            onClick={() => {
              soundManager.playClick();
              setMobileMenuOpen(false);
            }}
            className="block text-center px-4 py-2.5 rounded-lg border-2 border-slate-900 font-mono text-xs font-black"
            style={{ backgroundColor: activeThemeObj.hex }}
          >
            VIEW ROBO CAR 3D
          </a>
        </div>
      )}
    </header>
  );
}
