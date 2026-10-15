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
        <div className="neo-badge px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs">
          <Activity className="w-4 h-4 mr-1.5 text-slate-900" />
          ACTIVE CYBER & ROBOTICS LAB OPERATIONS
        </div>
        <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-black text-slate-950">
          Flagship Deployments
        </h2>
        <p className="text-slate-600 text-sm sm:text-base font-sans font-medium">
          Combat telemetry, autonomous navigation models, and real-time security architectures maintained by Cyber Champs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MISSIONS.map((mission) => (
          <div
            key={mission.id}
            className="p-6 sm:p-8 rounded-2xl neo-box-lg flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b-2 border-slate-900 pb-4 mb-4">
                <span className="font-mono text-xs font-black text-slate-900 tracking-wider">
                  {mission.category}
                </span>
                <span className="neo-badge px-2.5 py-1 rounded-full bg-emerald-300 text-slate-950 text-[10px]">
                  {mission.status}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-black text-slate-950 mb-1">
                {mission.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-600 font-bold mb-4">
                {mission.subtitle}
              </p>

              {/* Description */}
              <p className="text-slate-700 text-sm font-sans font-medium leading-relaxed mb-6">
                {mission.description}
              </p>

              {/* Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {mission.metrics.map((metric, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border-2 border-slate-900 bg-slate-50 text-center shadow-[2px_2px_0px_0px_#000]">
                    <span className="font-mono text-[11px] text-slate-950 font-black block truncate">
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
                    className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-900 bg-white shadow-[1px_1px_0px_0px_#000] text-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-900">
                <a
                  href={mission.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="neo-btn px-4 py-2 rounded-xl bg-slate-900 text-white font-mono text-xs"
                >
                  <GithubIcon className="w-3.5 h-3.5 mr-1.5" />
                  Source Code
                </a>
                <a
                  href={mission.demoUrl}
                  onClick={() => soundManager.playClick()}
                  className="neo-btn px-4 py-2 rounded-xl bg-white text-slate-900 font-mono text-xs"
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
