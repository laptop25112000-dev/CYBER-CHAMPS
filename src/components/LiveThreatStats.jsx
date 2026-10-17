import React from 'react';
import { SQUAD_STATS } from '../data/team';
import { useTheme } from '../context/ThemeContext';
import { Users, Trophy, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './motion/ScrollReveal';
import ScrollCountUp from './motion/ScrollCountUp';
import MotionTiltCard from './motion/MotionTiltCard';

const NEO_CARD_COLORS = [
  'bg-[#FEF08A]', // Yellow
  'bg-[#BAE6FD]', // Cyan
  'bg-[#FECDD3]', // Rose
  'bg-[#BBF7D0]', // Mint
  'bg-[#E9D5FF]', // Lavender
];

export default function LiveThreatStats() {
  const { isLightMode, activeThemeObj } = useTheme();

  const iconMap = {
    Users: <Users className="w-5 h-5 text-black stroke-[2.5]" />,
    Trophy: <Trophy className="w-5 h-5 text-black stroke-[2.5]" />,
    ShieldAlert: <ShieldAlert className="w-5 h-5 text-black stroke-[2.5]" />,
    Activity: <Activity className="w-5 h-5 text-black stroke-[2.5]" />,
    CheckCircle2: <CheckCircle2 className="w-5 h-5 text-black stroke-[2.5]" />
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {SQUAD_STATS.map((stat, idx) => (
        <ScrollReveal
          key={idx}
          animation="fade-up"
          delay={idx * 75}
          duration={600}
        >
          <MotionTiltCard
            maxTilt={6}
            scale={1.02}
            className={`p-5 rounded-2xl border-3 sm:border-4 border-black shadow-[5px_5px_0px_0px_#000] cursor-pointer ${
              NEO_CARD_COLORS[idx % NEO_CARD_COLORS.length]
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2 rounded-xl border-2 border-black bg-[#FAF5E6] shadow-[2px_2px_0px_0px_#000]">
                {iconMap[stat.icon]}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded border-2 border-black bg-black text-[#FAF5E6] shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
            </div>

            <div className="font-['Orbitron'] text-2xl sm:text-3xl font-black text-black tracking-tight">
              {stat.value === '09' ? (
                <ScrollCountUp end={9} prefix="0" duration={1200} />
              ) : stat.value === '100%' ? (
                <ScrollCountUp end={100} suffix="%" duration={1400} />
              ) : (
                stat.value
              )}
            </div>

            <div className="font-mono text-xs mt-1 font-black text-black uppercase">
              {stat.label}
            </div>

            <div className="font-mono text-[10px] mt-0.5 font-bold text-slate-800">
              // {stat.unit}
            </div>
          </MotionTiltCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
