import React from 'react';
import RoboCar3DModel from './RoboCar3DModel';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  Zap, Trophy, Shield, Cpu, ExternalLink, Play, 
  RotateCw, Gauge, BatteryCharging, Radio, CheckCircle2 
} from 'lucide-react';

export default function NRLSection() {
  const { activeThemeObj } = useTheme();

  const specs = [
    { label: 'Competition League', value: 'National Robotics League (NRL)', icon: Trophy },
    { label: 'Event Classification', value: '2026 HYPERDRIVE (Presented by Amazon)', icon: Zap },
    { label: 'Chassis Armor', value: 'Hardened Titanium AR500 + 6061-T6 Billet', icon: Shield },
    { label: 'Drive Motors', value: '4x High-Torque Brushless + 12:1 Planetary', icon: Gauge },
    { label: 'Guidance & Telemetry', value: '360° Solid-State LiDAR + Edge AI Controller', icon: Cpu },
    { label: 'Power Plant', value: '6S 22.2V LiPo / 120C Ultra-High Discharge', icon: BatteryCharging },
  ];

  return (
    <div id="nrl-car" className="scroll-mt-28 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div 
          className="inline-flex items-center gap-2 font-mono text-xs px-3.5 py-1.5 rounded-full border backdrop-blur-md"
          style={{
            color: activeThemeObj.hex,
            borderColor: `${activeThemeObj.hex}40`,
            backgroundColor: `${activeThemeObj.hex}10`
          }}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>NATIONAL ROBOTICS LEAGUE // HYPERDRIVE 2026</span>
        </div>
        <h2 className="font-['Orbitron'] text-3xl sm:text-5xl font-black text-white">
          Our NRL Battle Robo Car
        </h2>
        <p className="text-slate-400 text-sm sm:text-base font-sans leading-relaxed">
          Engineered from the ground up by Cyber Champs for the 2026 National Robotics League HYPERDRIVE challenge. Combining autonomous edge guidance, hardened kinetic deflection, and ultra-high torque 4WD mobility.
        </p>
      </div>

      {/* Main Showcase Grid: 3D Model on Left, Specs & Video on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive 3D Model Viewer */}
        <div className="lg:col-span-7">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-2">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <RotateCw className="w-3.5 h-3.5" style={{ color: activeThemeObj.hex }} />
                INTERACTIVE 3D VEHICLE INSPECTOR
              </span>
              <span>Rotate, inspect components & toggle wireframe</span>
            </div>

            {/* 3D Component */}
            <div className="h-[460px] sm:h-[520px]">
              <RoboCar3DModel autoRotate={true} />
            </div>
          </div>
        </div>

        {/* Right: Technical Specs & YouTube Video Reference */}
        <div className="lg:col-span-5 space-y-6">
          {/* YouTube Video Banner Card */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-xl cut-corner-br">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-rose-400 font-bold flex items-center gap-1.5">
                <Play className="w-4 h-4 fill-rose-500 text-rose-500" />
                NRL HYPERDRIVE ARENA VIDEO
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                OFFICIAL VIDEO
              </span>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm font-sans mb-4 leading-relaxed">
              Watch the official competition overview and robot arena dynamics from the <strong className="text-white">2026 National Robotics League - HYPERDRIVE presented by Amazon</strong>:
            </p>

            <a
              href="https://youtu.be/C0-qp_30QFk?si=48g3O7u7qas8O-7q"
              target="_blank"
              rel="noreferrer"
              onClick={() => soundManager.playClick()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-red-950/50 group"
            >
              <span>WATCH ARENA VIDEO (YOUTUBE)</span>
              <ExternalLink className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Technical Specifications Grid */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-3">
            <div className="font-mono text-xs font-bold text-white tracking-wider uppercase border-b border-slate-800/80 pb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
              <span>VEHICLE TELEMETRY & SPECIFICATIONS</span>
            </div>

            <div className="space-y-2.5">
              {specs.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-start justify-between gap-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/60 font-mono text-xs">
                    <div className="flex items-center gap-2 text-slate-400 shrink-0">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.label}</span>
                    </div>
                    <div className="text-right text-white font-semibold truncate text-[11px]">
                      {item.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
