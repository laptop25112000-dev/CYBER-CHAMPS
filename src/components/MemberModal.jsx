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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      {/* Neobrutalist Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white border-3 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_#000] overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-100 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div 
              className="w-3.5 h-3.5 rounded-full border border-slate-900" 
              style={{ backgroundColor: member.accentColor }}
            />
            <div className="font-mono text-xs tracking-wider text-slate-900 font-extrabold">
              OPERATOR DOSSIER // <span style={{ color: member.accentColor }}>{member.callsign}</span>
            </div>
            <span className="hidden sm:inline-block font-mono text-[10px] px-2.5 py-0.5 rounded border border-slate-900 bg-red-200 text-slate-900 font-black">
              {member.clearanceLevel}
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-200 transition-colors shadow-[2px_2px_0px_0px_#000]"
            title="Close Dossier (Esc)"
          >
            <X className="w-5 h-5 text-slate-900" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Hero Row: 3D Badge & Core Identity */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b-2 border-slate-900 pb-8">
            {/* 3D Model Column */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-slate-50 border-2 border-slate-900 shadow-[4px_4px_0px_0px_#000] flex items-center justify-center overflow-hidden">
                <Member3DAvatar 
                  shape={member.shape} 
                  accentColor={member.accentColor} 
                  isHovered={true} 
                />
                <div className="absolute inset-0 neo-grid-dots opacity-40 pointer-events-none" />
                <div className="absolute bottom-2 font-mono text-[10px] text-slate-900 font-black tracking-widest uppercase bg-white/90 px-2 py-0.5 rounded border border-slate-900">
                  {member.shape}
                </div>
              </div>
            </div>

            {/* Operator Bio Column */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-['Orbitron'] text-3xl font-black text-slate-950">
                  {member.name}
                </h2>
                <span 
                  className="font-mono text-xs px-3 py-1 rounded-lg border-2 border-slate-900 font-black shadow-[2px_2px_0px_0px_#000]"
                  style={{
                    backgroundColor: `${member.accentColor}30`,
                    color: '#0f172a'
                  }}
                >
                  {member.callsign}
                </span>
              </div>

              <div className="font-extrabold text-base" style={{ color: member.accentColor }}>
                {member.role}
              </div>

              <p className="text-slate-700 text-sm leading-relaxed font-sans font-medium">
                {member.bio}
              </p>

              <blockquote className="border-l-4 border-slate-900 pl-4 py-2 text-xs italic text-slate-700 bg-slate-100 rounded-r border border-y-0 border-r-0">
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
                    className="neo-btn px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                  >
                    <GithubIcon className="w-3.5 h-3.5 mr-1.5" />
                    GitHub
                  </a>
                )}
                {member.socials?.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="neo-btn px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5 mr-1.5" />
                    LinkedIn
                  </a>
                )}
                {member.socials?.twitter && (
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => soundManager.playClick()}
                    className="neo-btn px-3 py-1.5 rounded-lg bg-white text-slate-900 text-xs"
                  >
                    <TwitterIcon className="w-3.5 h-3.5 mr-1.5" />
                    X.com
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Technical Skills & Combat Radar Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="p-5 rounded-xl neo-box">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs font-black text-slate-900 tracking-wider">
                <Cpu className="w-4 h-4 text-slate-900" />
                PRIMARY CAPABILITIES MATRIX
              </div>
              <div className="space-y-3">
                {member.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold text-slate-900">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full border border-slate-900 bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${skill.level}%`,
                          backgroundColor: member.accentColor
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Combat / Intel Stats */}
            <div className="p-5 rounded-xl neo-box">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs font-black text-slate-900 tracking-wider">
                <Shield className="w-4 h-4 text-slate-900" />
                TACTICAL PROFILE METRICS
              </div>
              <div className="space-y-3">
                {Object.entries(member.stats).map(([statKey, value], idx) => {
                  const label = statKey.replace(/([A-Z])/g, ' $1').toUpperCase();
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-900">
                        <span>{label}</span>
                        <span>{value} / 100</span>
                      </div>
                      <div className="w-full h-2 rounded-full border border-slate-900 bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-900"
                          style={{
                            width: `${value}%`
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
          <div className="p-5 rounded-xl neo-box">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs font-black text-slate-900 tracking-wider">
              <Lock className="w-4 h-4" />
              DEPLOYED ARSENAL & TOOLSETS
            </div>
            <div className="flex flex-wrap gap-2">
              {member.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs font-bold px-3 py-1 rounded-lg border border-slate-900 bg-slate-100 text-slate-900 shadow-[1.5px_1.5px_0px_0px_#000]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t-2 border-slate-900 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="neo-btn px-6 py-2 rounded-xl bg-slate-950 text-white font-mono text-xs font-bold"
          >
            DISMISS DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
}
