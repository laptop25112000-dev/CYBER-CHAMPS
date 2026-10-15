import React from 'react';
import { SQUAD_STATS } from '../data/team';
import { useTheme } from '../context/ThemeContext';
import { Users, Trophy, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

export default function LiveThreatStats() {
  const { isLightMode, activeThemeObj } = useTheme();

  const iconMap = {
    Users: <Users className="w-5 h-5 text-cyan-500" />,
    Trophy: <Trophy className="w-5 h-5 text-amber-500" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-rose-500" />,
    Activity: <Activity className="w-5 h-5 text-emerald-500" />,
    CheckCircle2: <CheckCircle2 className="w-5 h-5 text-purple-500" />
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {SQUAD_STATS.map((stat, idx) => (
        <div
          key={idx}
          className={`relative p-5 rounded-xl border backdrop-blur-md transition-all duration-300 cut-corner-tl group ${
            isLightMode 
              ? 'bg-white/90 border-slate-200 shadow-sm hover:shadow-lg' 
              : 'bg-slate-900/70 border-slate-800 hover:border-cyan-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`p-2 rounded-lg border transition-colors ${
              isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800/80'
            }`}>
              {iconMap[stat.icon]}
            </span>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${
              isLightMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              LIVE
            </span>
          </div>

          <div className={`font-['Orbitron'] text-2xl sm:text-3xl font-extrabold transition-colors ${
            isLightMode ? 'text-slate-900' : 'text-white'
          }`}>
            {stat.value}
          </div>

          <div className={`font-mono text-xs mt-1 font-semibold ${
            isLightMode ? 'text-slate-700' : 'text-slate-300'
          }`}>
            {stat.label}
          </div>

          <div className={`font-mono text-[10px] mt-0.5 ${
            isLightMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            // {stat.unit}
          </div>
        </div>
      ))}
    </div>
  );
}
