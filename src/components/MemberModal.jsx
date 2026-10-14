import React, { useEffect } from 'react';
import Member3DAvatar from './Member3DAvatar';
import { soundManager } from '../utils/audio';
import { 
  X, Shield, Award, Terminal, 
  Mail, ExternalLink, Cpu, Lock, CheckCircle2 
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './Icons';


export default function MemberModal({ member, onClose }) {
  useEffect(() => {
    soundManager.playAccessGranted();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      {/* Modal Dialog */}
      <div 
        className="relative w-full max-w-4xl bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden my-auto cut-corner-both"
        style={{
          boxShadow: `0 0 50px -10px ${member.accentColor}30`
        }}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse" 
              style={{ backgroundColor: member.accentColor }}
            />
            <div className="font-mono text-xs tracking-wider text-slate-300">
              OPERATOR DOSSIER // <span className="text-cyan-400 font-bold">{member.callsign}</span>
            </div>
            <span className="hidden sm:inline-block font-mono text-[10px] px-2 py-0.5 rounded bg-red-950/40 text-red-400 border border-red-500/30">
              {member.clearanceLevel}
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Dossier (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Hero Row: 3D Badge & Core Identity */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-slate-800 pb-8">
            {/* 3D Model Column */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-slate-950 border border-cyan-500/30 flex items-center justify-center overflow-hidden">
                <Member3DAvatar 
                  shape={member.shape} 
                  accentColor={member.accentColor} 
                  isHovered={true} 
                />
                <div className="absolute inset-0 cyber-grid-dense opacity-25 pointer-events-none" />
                <div className="absolute bottom-2 font-mono text-[9px] text-cyan-400/80 tracking-widest uppercase">
                  3D_GEOMETRY // {member.shape}
                </div>
              </div>
              <div className="mt-2 text-center text-xs font-mono text-slate-400">
                Interactive Holo-Mesh
              </div>
            </div>

            {/* Operator Bio Column */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-['Orbitron'] text-3xl font-black text-white">
                  {member.name}
                </h2>
                <span 
                  className="font-mono text-sm px-2.5 py-1 rounded-md border font-bold"
                  style={{
                    color: member.accentColor,
                    borderColor: `${member.accentColor}60`,
                    backgroundColor: `${member.accentColor}15`
                  }}
                >
                  {member.callsign}
                </span>
              </div>

              <div className="text-cyan-400 font-medium text-base">
                {member.role}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-sans">
                {member.bio}
              </p>

              <blockquote className="border-l-2 border-cyan-500 pl-4 py-1 text-xs italic text-slate-400 bg-slate-950/40 rounded-r">
                "{member.quote}"
              </blockquote>

              {/* Social Channels */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {member.socials?.github && (
                  <a
                    href={member.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    GitHub
                  </a>
                )}
                {member.socials?.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    LinkedIn
                  </a>
                )}
                {member.socials?.twitter && (
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono transition-colors"
                  >
                    <TwitterIcon className="w-3.5 h-3.5" />
                    X.com
                  </a>
                )}
                {member.socials?.email && (
                  <a
                    href={`mailto:${member.socials.email}`}
                    onClick={() => soundManager.playClick()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/30 text-cyan-400 hover:text-cyan-200 border border-cyan-500/30 text-xs font-mono transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {member.socials.email}
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Technical Skills & Combat Radar Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs text-cyan-400 tracking-wider">
                <Cpu className="w-4 h-4" />
                PRIMARY CAPABILITIES MATRIX
              </div>
              <div className="space-y-3">
                {member.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono text-slate-300">
                      <span>{skill.name}</span>
                      <span className="text-cyan-400 font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.level}%`,
                          background: `linear-gradient(90deg, ${member.accentColor}60, ${member.accentColor})`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Combat / Intel Stats */}
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs text-purple-400 tracking-wider">
                <Shield className="w-4 h-4" />
                TACTICAL PROFILE METRICS
              </div>
              <div className="space-y-3">
                {Object.entries(member.stats).map(([statKey, value], idx) => {
                  const label = statKey.replace(/([A-Z])/g, ' $1').toUpperCase();
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono text-slate-300">
                        <span>{label}</span>
                        <span className="text-purple-400 font-bold">{value} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${value}%`,
                            background: `linear-gradient(90deg, #9333ea, #bc13fe)`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tools & Frameworks */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-slate-400 tracking-wider">
              <Lock className="w-4 h-4 text-cyan-400" />
              DEPLOYED ARSENAL & TOOLSETS
            </div>
            <div className="flex flex-wrap gap-2">
              {member.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs px-3 py-1 rounded bg-slate-900 text-cyan-300 border border-cyan-500/20"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Hall of Fame Achievements */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs text-amber-400 tracking-wider">
              <Award className="w-4 h-4" />
              COMMENDATIONS & ACHIEVEMENTS
            </div>
            <ul className="space-y-2">
              {member.achievements.map((ach, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Missions */}
          {member.projects && member.projects.length > 0 && (
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="flex items-center gap-2 mb-3 font-mono text-xs text-cyan-400 tracking-wider">
                <Terminal className="w-4 h-4" />
                CONTRIBUTED MISSIONS & PROJECTS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {member.projects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-white">{proj.name}</span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                        {proj.tag}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-sans">{proj.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors"
          >
            DISMISS DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
}
