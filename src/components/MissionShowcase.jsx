import React from 'react';
import { MISSIONS } from '../data/team';
import { soundManager } from '../utils/audio';
import { Shield, ExternalLink, Activity, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';


export default function MissionShowcase() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          ACTIVE CYBER OPERATIONS & R&D
        </div>
        <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-extrabold text-white">
          Flagship Deployments
        </h2>
        <p className="text-slate-400 text-sm sm:text-base font-sans">
          Proven cyber defense architectures, post-quantum protocols, and autonomous AI sentinels engineered and maintained by Cyber Champs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MISSIONS.map((mission) => (
          <div
            key={mission.id}
            className="group relative p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 backdrop-blur-md transition-all duration-300 cut-corner-br flex flex-col justify-between"
          >
            {/* Ambient Hover Glow */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />

            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-4 mb-4">
                <span className="font-mono text-xs text-cyan-400 tracking-wider">
                  {mission.category}
                </span>
                <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {mission.status}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors mb-1">
                {mission.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-400 mb-4">
                {mission.subtitle}
              </p>

              {/* Description */}
              <p className="text-slate-300 text-sm font-sans leading-relaxed mb-6">
                {mission.description}
              </p>

              {/* Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {mission.metrics.map((metric, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-center">
                    <span className="font-mono text-[11px] text-cyan-300 font-bold block truncate">
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
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
                <a
                  href={mission.codeUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 font-mono text-xs transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  Source Code
                </a>
                <a
                  href={mission.demoUrl}
                  onClick={() => soundManager.playClick()}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-500/60 font-mono text-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
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
