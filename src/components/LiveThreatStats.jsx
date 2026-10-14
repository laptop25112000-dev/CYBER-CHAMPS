import React from 'react';
import { SQUAD_STATS } from '../data/team';
import { Users, Trophy, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

export default function LiveThreatStats() {
  const iconMap = {
    Users: <Users className="w-5 h-5 text-cyan-400" />,
    Trophy: <Trophy className="w-5 h-5 text-amber-400" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-rose-400" />,
    Activity: <Activity className="w-5 h-5 text-emerald-400" />,
    CheckCircle2: <CheckCircle2 className="w-5 h-5 text-purple-400" />
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {SQUAD_STATS.map((stat, idx) => (
        <div
          key={idx}
          className="relative p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 backdrop-blur-md transition-all duration-300 cut-corner-tl group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 group-hover:border-cyan-500/30 transition-colors">
              {iconMap[stat.icon]}
            </span>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">
              LIVE
            </span>
          </div>

          <div className="font-['Orbitron'] text-2xl sm:text-3xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
            {stat.value}
          </div>

          <div className="font-mono text-xs text-slate-300 mt-1 font-semibold">
            {stat.label}
          </div>

          <div className="font-mono text-[10px] text-slate-400 mt-0.5">
            // {stat.unit}
          </div>
        </div>
      ))}
    </div>
  );
}
