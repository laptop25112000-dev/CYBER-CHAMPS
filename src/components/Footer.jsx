import React from 'react';
import { TEAM_MEMBERS } from '../data/team';
import { soundManager } from '../utils/audio';
import { Shield, ChevronUp, Terminal, Lock } from 'lucide-react';


export default function Footer({ onSelectMember }) {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-cyan-500/20 bg-slate-950/95 pt-16 pb-12 text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Ethos */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-['Orbitron'] text-xl font-bold text-white tracking-wider">
                CYBER <span className="text-cyan-400">CHAMPS</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Elite cybersecurity & autonomous engineering squad. Defending critical digital frontiers through continuous research, exploit mitigation, and post-quantum architectures.
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-md border border-emerald-500/30 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              STATUS: ALL NODES OPERATIONAL (GREEN)
            </div>
          </div>

          {/* Col 2: Squad Quick Directory */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono text-xs font-bold text-white tracking-wider uppercase">
              // SQUAD OPERATORS (09)
            </div>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {TEAM_MEMBERS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    soundManager.playClick();
                    if (onSelectMember) onSelectMember(m);
                  }}
                  className="text-left text-slate-400 hover:text-cyan-400 hover:translate-x-1 transition-all flex items-center gap-1.5 py-0.5"
                >
                  <span className="text-[10px] text-slate-600">›</span>
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Directives */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono text-xs font-bold text-white tracking-wider uppercase">
              // DEFENSE DIRECTIVES
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                Zero-Trust Verification
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Kernel-Level Hardening
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Continuous Red Teaming
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} CYBER CHAMPS SQUAD. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>RETURN TO APEX</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
