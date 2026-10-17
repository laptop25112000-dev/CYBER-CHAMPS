import React from 'react';
import { MISSIONS } from '../data/team';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { Shield, ExternalLink, Activity, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function MissionShowcase() {
  const { activeThemeObj } = useTheme();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="neo-badge px-3.5 py-1.5 rounded-full bg-[#FEF08A] text-black text-xs border-2 border-black font-black">
          <Activity className="w-4 h-4 mr-1.5 text-black" />
          ACTIVE CYBER & ROBOTICS LAB OPERATIONS
        </div>
        <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-black text-black">
          Flagship Deployments
        </h2>
        <p className="text-slate-800 text-sm sm:text-base font-sans font-medium">
          Combat telemetry, autonomous navigation models, and real-time security architectures maintained by Cyber Champs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MISSIONS.map((mission) => (
          <div
            key={mission.id}
            className="p-6 sm:p-8 rounded-2xl neo-box-lg bg-[#FFF9EB] border-3 border-black shadow-[6px_6px_0px_0px_#000] flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-black pb-4 mb-4">
                <span className="font-mono text-xs font-black text-black tracking-wider">
                  {mission.category}
                </span>
                <span className="neo-badge px-2.5 py-1 rounded-full bg-emerald-300 text-black text-[10px] border border-black font-black">
                  {mission.status}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-black text-black mb-1">
                {mission.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-800 font-bold mb-4">
                {mission.subtitle}
              </p>

              {/* Description */}
              <p className="text-slate-800 text-sm font-sans font-medium leading-relaxed mb-6">
                {mission.description}
              </p>

              {/* Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {mission.metrics.map((metric, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border-2 border-black bg-[#FAF5E6] text-center shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-mono text-[11px] text-black font-black block truncate">
                      {metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {mission.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="font-mono text-[10px] font-black px-2 py-0.5 rounded border border-black bg-[#FEF08A] shadow-[1px_1px_0px_0px_#000] text-black"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 pt-4 border-t-2 border-black">
                <a
                  href={mission.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="neo-btn px-4 py-2 rounded-xl bg-black text-[#FAF5E6] font-mono text-xs font-bold border-2 border-black"
                >
                  <GithubIcon className="w-3.5 h-3.5 mr-1.5" />
                  Source Code
                </a>
                <a
                  href={mission.demoUrl}
                  onClick={() => soundManager.playClick()}
                  className="neo-btn px-4 py-2 rounded-xl bg-[#FEF08A] text-black font-mono text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Mission Telemetry
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
