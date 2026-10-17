import React from 'react';
import { Shield, ChevronUp } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function CleanFooter() {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <footer className="border-t border-[#E4E7EB] bg-white py-12 text-[#626A73]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#245DFF] text-white flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base text-[#17191C] tracking-tight">CYBER CHAMPS</span>
              <span className="text-xs block text-[#626A73]">NRL Robotics Team · Delhi Regional</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#626A73]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-[#17191C] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl border border-[#E4E7EB] hover:bg-[#F6F7F8] text-[#17191C] transition-colors flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-[#E4E7EB] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#626A73] gap-4">
          <p>© {new Date().getFullYear()} CYBER CHAMPS Robotics Team. All rights reserved.</p>
          <p>National Robotics League™ (NRL) Delhi Regional Competition Entry.</p>
        </div>

      </div>
    </footer>
  );
}
