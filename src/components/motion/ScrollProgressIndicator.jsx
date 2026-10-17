import React, { useEffect, useState } from 'react';
import { soundManager } from '../../utils/audio';

export default function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const prog = Math.min(100, Math.max(0, Math.round((window.pageYOffset / totalHeight) * 100)));
        setScrollProgress(prog);
      }

      // Check current section
      const nrlEl = document.getElementById('nrl-car');
      const squadEl = document.getElementById('squad');
      const termEl = document.getElementById('terminal');

      const scrollY = window.pageYOffset + 250;

      if (termEl && scrollY >= termEl.offsetTop) {
        setActiveSection('terminal');
      } else if (squadEl && scrollY >= squadEl.offsetTop) {
        setActiveSection('squad');
      } else if (nrlEl && scrollY >= nrlEl.offsetTop) {
        setActiveSection('car');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: 'hero', label: 'EXPLOSION', href: '#' },
    { id: 'car', label: 'CAD PANEL', href: '#nrl-car' },
    { id: 'squad', label: 'SQUAD (09)', href: '#squad' },
    { id: 'terminal', label: 'TERMINAL', href: '#terminal' }
  ];

  return (
    <div className="fixed top-24 right-6 z-40 hidden xl:flex flex-col items-end gap-2 pointer-events-none select-none">
      {/* Scroll % Pill */}
      <div className="pointer-events-auto px-3 py-1 rounded-full border-2 border-black bg-[#FAF5E6] shadow-[2px_2px_0px_0px_#000] font-mono text-[10px] font-black text-black flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <span>SCROLL: {scrollProgress}%</span>
      </div>

      {/* Mini Section Nav Track */}
      <div className="pointer-events-auto p-1.5 rounded-2xl border-2 border-black bg-[#FAF5E6] shadow-[3px_3px_0px_0px_#000] flex flex-col gap-1">
        {sections.map((sec) => (
          <a
            key={sec.id}
            href={sec.href}
            onClick={() => soundManager.playClick()}
            className={`px-2.5 py-1 rounded-lg font-mono text-[9px] font-black transition-all flex items-center gap-1.5 ${
              activeSection === sec.id
                ? 'bg-black text-[#FEF08A] shadow-[1px_1px_0px_0px_#000] scale-105'
                : 'text-black hover:bg-[#FEF08A]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                activeSection === sec.id ? 'bg-[#FEF08A]' : 'bg-black/30'
              }`}
            />
            <span>{sec.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
