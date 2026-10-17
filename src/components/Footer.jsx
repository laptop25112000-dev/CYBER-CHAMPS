import React from 'react';
import { TEAM_MEMBERS } from '../data/team';
import { soundManager } from '../utils/audio';
import { Shield, ChevronUp, Terminal, Lock, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onSelectMember }) {
  const { isLightMode, activeThemeObj } = useTheme();

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t-4 border-black pt-16 pb-12 font-sans bg-[#FAF5E6] text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Ethos */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl border-3 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center"
                style={{ backgroundColor: activeThemeObj.hex }}
              >
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="font-['Orbitron'] text-2xl font-black tracking-wider text-black">
                CYBER <span style={{ color: activeThemeObj.hex }}>CHAMPS</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm max-w-sm leading-relaxed font-medium text-slate-800">
              Official portfolio of Team Cyber Champs for the National Robotics League (NRL) Delhi Regional State-Level Robotics Competition.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] font-black text-black bg-[#BBF7D0] px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
              STATUS: ALL 9 MEMBERS ACTIVE // DELHI REGIONAL READY
            </div>
          </div>

          {/* Col 2: Squad Quick Directory */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono text-xs font-black text-black tracking-wider uppercase flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" style={{ color: activeThemeObj.hex }} />
              // TEAM MEMBERS (09)
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {TEAM_MEMBERS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    soundManager.playClick();
                    if (onSelectMember) onSelectMember(m);
                  }}
                  className="text-left font-bold transition-all flex items-center gap-1.5 py-1 px-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-[#FFF9EB] text-black hover:bg-[#FEF08A]"
                >
                  <span className="text-[10px]" style={{ color: activeThemeObj.hex }}>›</span>
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Competition Specs */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-xs font-black text-black tracking-wider uppercase">
              // COMPETITION SPECS
            </div>
            <ul className="space-y-2 font-mono text-xs font-bold">
              <li className="flex items-center gap-2 p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-[#BAE6FD] text-black">
                <Trophy className="w-3.5 h-3.5 text-cyan-800" />
                Delhi Regional State Level
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-[#E9D5FF] text-black">
                <Shield className="w-3.5 h-3.5 text-purple-800" />
                Dual-Deck Acrylic Chassis
              </li>
              <li className="flex items-center gap-2 p-2 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-[#FEF08A] text-black">
                <Terminal className="w-3.5 h-3.5 text-amber-800" />
                4WD Motors + Servo Gripper
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-black flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="font-bold text-slate-800">
            &copy; {new Date().getFullYear()} CYBER CHAMPS SQUAD. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-black bg-[#FEF08A] font-mono font-black text-black shadow-[2px_2px_0px_0px_#000] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] hover:bg-[#FED7AA] active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>RETURN TO TOP</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
