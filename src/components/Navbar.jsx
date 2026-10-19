import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  Shield, Volume2, VolumeX, Menu, X, Terminal, 
  Trophy, Palette, Sun, Moon, Zap, Scissors 
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
    { label: 'TEAM (09)', href: '#squad' },
    { label: 'TERMINAL', href: '#terminal' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF5E6] border-b-4 border-black shadow-[0_4px_0px_0px_#000] text-black transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <a 
          href="#"
          onClick={() => soundManager.playClick()}
          className="flex items-center gap-3 group"
        >
          <div 
            className="w-11 h-11 rounded-xl border-2 border-black bg-amber-300 shadow-[3px_3px_0px_0px_#000] flex items-center justify-center transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5"
          >
            <Shield className="w-6 h-6 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="font-['Orbitron'] text-xl font-black tracking-tight flex items-center gap-1.5 text-black">
              <span>CYBER</span>
              <span className="bg-amber-300 px-1 rounded border border-black shadow-[1.5px_1.5px_0px_0px_#000]">CHAMPS</span>
            </div>
            <div className="font-mono text-[9px] tracking-widest uppercase font-black text-slate-800">
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
              className="px-3.5 py-1.5 font-mono text-xs font-black rounded-lg border-2 border-transparent hover:border-black hover:bg-[#FEF08A] transition-all flex items-center gap-1.5 text-black"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span 
                  className="font-mono text-[9px] px-1.5 py-0.2 rounded font-black border border-black shadow-[1px_1px_0px_0px_#000] bg-cyan-300 text-black"
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
            className="neo-btn p-2.5 rounded-xl text-xs font-bold bg-[#FFF9EB] text-black hover:bg-[#FEF08A]"
            title={isAudioEnabled ? 'Mute Cyber Audio' : 'Enable Web Audio Synth'}
          >
            {isAudioEnabled ? (
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span className="text-[11px] font-black">SFX ON</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <VolumeX className="w-4 h-4 text-slate-600 stroke-[2.5]" />
                <span className="text-[11px] font-black text-slate-600">SFX OFF</span>
              </span>
            )}
          </button>

          {/* Quick CTA to Robo Car */}
          <a
            href="#nrl-car"
            onClick={() => soundManager.playClick()}
            className="neo-btn px-4 py-2 rounded-xl text-black font-mono text-xs font-black bg-amber-300 hover:bg-amber-400 shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            ROBO CAR
          </a>

          {/* Standalone Tearable Notebook Website Button */}
          <a
            href={`${import.meta.env.BASE_URL}tearable.html`}
            className="neo-btn px-3.5 py-2 rounded-xl text-black font-mono text-xs font-black bg-[#BBF7D0] hover:bg-emerald-300 shadow-[3px_3px_0px_0px_#000] flex items-center gap-1.5"
            title="Open Separate Tearable UI Engineering Notebook Website"
          >
            <Scissors className="w-3.5 h-3.5 text-black" />
            <span>TEARABLE NOTEBOOK</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleAudio}
            className="p-2 rounded-lg border-2 border-black bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000]"
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border-2 border-black bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-3 border-black bg-[#FAF5E6] px-4 py-5 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 font-mono text-sm font-black text-black hover:bg-[#FEF08A] rounded-lg border-2 border-transparent hover:border-black"
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
            className="block text-center px-4 py-2.5 rounded-lg border-2 border-black font-mono text-xs font-black bg-amber-300 text-black shadow-[3px_3px_0px_0px_#000]"
          >
            VIEW ROBO CAR
          </a>
          <a
            href={`${import.meta.env.BASE_URL}tearable.html`}
            className="block text-center px-4 py-2.5 rounded-lg border-2 border-black font-mono text-xs font-black bg-[#BBF7D0] text-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2"
          >
            <Scissors className="w-4 h-4 text-black" />
            <span>OPEN TEARABLE NOTEBOOK</span>
          </a>
        </div>
      )}
    </header>
  );
}
