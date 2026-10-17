import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { 
  Shield, Menu, X, ArrowUpRight, Cpu, 
  ChevronRight, Volume2, VolumeX, Layers, Trophy 
} from 'lucide-react';

export default function CleanNavbar({ onExploreRobot }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const toggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsAudioMuted(muted);
  };

  const navLinks = [
    { label: 'The Robot', href: '#the-robot' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Exploded View', href: '#exploded-view' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Systems', href: '#systems' },
    { label: 'Our Team', href: '#team' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    soundManager.playClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E7EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand / Logo */}
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundManager.playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#245DFF] text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-['Inter'] font-extrabold text-base sm:text-lg tracking-tight text-[#17191C]">
              CYBER CHAMPS
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#626A73]">
              NRL Robotics · Delhi Regional
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#626A73] hover:text-[#17191C] hover:bg-[#F6F7F8] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Subtle Sound FX Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isAudioMuted ? "Enable sound effects" : "Mute sound effects"}
            className="p-2.5 rounded-xl border border-[#E4E7EB] bg-white text-[#626A73] hover:text-[#17191C] hover:bg-[#F6F7F8] transition-colors"
            title={isAudioMuted ? "Sound Muted" : "Sound Enabled"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#245DFF]" />}
          </button>

          {/* Primary CTA: Explore the Robot */}
          <button
            onClick={() => {
              soundManager.playClick();
              if (onExploreRobot) {
                onExploreRobot();
              } else {
                const target = document.querySelector('#the-robot');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#245DFF] hover:bg-[#1b4bd8] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all active:scale-[0.98]"
          >
            <span>Explore the Robot</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl border border-[#E4E7EB] text-[#17191C] hover:bg-[#F6F7F8] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E4E7EB] bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#17191C] hover:bg-[#F6F7F8] transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E4E7EB] flex flex-col gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
                const target = document.querySelector('#the-robot');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl bg-[#245DFF] text-white text-center text-sm font-semibold shadow-sm"
            >
              Explore the Robot
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
