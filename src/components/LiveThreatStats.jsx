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
          className={`relative p-5 rounded-xl border-2 sm:border-3 border-slate-900 shadow-[4px_4px_0px_0px_#000] transition-all duration-200 group hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] ${
            isLightMode 
              ? 'bg-white' 
              : 'bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className={`p-2 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] transition-colors ${
              isLightMode ? 'bg-amber-100' : 'bg-slate-950'
            }`}>
              {iconMap[stat.icon]}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded border border-slate-900 bg-emerald-300 text-slate-950 shadow-[1px_1px_0px_0px_#000]">
              LIVE
            </span>
          </div>

          <div className={`font-['Orbitron'] text-2xl sm:text-3xl font-black transition-colors ${
            isLightMode ? 'text-slate-950' : 'text-white'
          }`}>
            {stat.value}
          </div>

          <div className={`font-mono text-xs mt-1 font-bold ${
            isLightMode ? 'text-slate-900' : 'text-slate-200'
          }`}>
            {stat.label}
          </div>

          <div className={`font-mono text-[10px] mt-0.5 font-medium ${
            isLightMode ? 'text-slate-600' : 'text-slate-400'
          }`}>
            // {stat.unit}
          </div>
        </div>
      ))}
    </div>
  );
}
