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
      <div className="relative w-full max-w-4xl bg-[#FAF5E6] border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] overflow-hidden my-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#FFF9EB] border-b-3 border-black">
          <div className="flex items-center gap-3">
            <div 
              className="w-3.5 h-3.5 rounded-full border border-black" 
              style={{ backgroundColor: member.accentColor }}
            />
            <div className="font-mono text-xs tracking-wider text-black font-extrabold">
              TEAM MEMBER PROFILE // <span style={{ color: member.accentColor }}>{member.name.toUpperCase()}</span>
            </div>
            <span className="font-mono text-[10px] px-2.5 py-0.5 rounded border-2 border-black bg-[#FEF08A] text-black font-black shadow-[1.5px_1.5px_0px_0px_#000]">
              DELHI REGIONAL
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border-2 border-black bg-[#FEF08A] hover:bg-[#FED7AA] transition-colors shadow-[2px_2px_0px_0px_#000]"
            title="Close Profile (Esc)"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Hero Row: 3D Shape & Core Identity */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b-2 border-black pb-8">
            {/* 3D Model Column */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl bg-[#FFF9EB] border-3 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center overflow-hidden">
                <Member3DAvatar 
                  shape={member.shape} 
                  accentColor={member.accentColor} 
                  isHovered={true} 
                />
                <div className="absolute inset-0 neo-grid-dots opacity-40 pointer-events-none" />
                <div className="absolute bottom-2 font-mono text-[10px] text-black font-black tracking-widest uppercase bg-[#FEF08A] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
                  {member.shape}
                </div>
              </div>
            </div>

            {/* Member Bio Column */}
            <div className="md:col-span-7 space-y-3">
              <h2 className="font-['Orbitron'] text-3xl font-black text-black">
                {member.name}
              </h2>

              <p className="text-slate-800 text-sm leading-relaxed font-sans font-medium">
                {member.bio}
              </p>

              <blockquote className="border-l-4 border-black pl-4 py-2 text-xs italic text-slate-800 bg-[#FFF9EB] rounded-r border border-y-0 border-r-0">
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
                    className="neo-btn px-3 py-1.5 rounded-lg bg-[#FFF9EB] hover:bg-[#FEF08A] text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]"
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
                    className="neo-btn px-3 py-1.5 rounded-lg bg-[#FFF9EB] hover:bg-[#BAE6FD] text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]"
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
                    className="neo-btn px-3 py-1.5 rounded-lg bg-[#FFF9EB] hover:bg-[#BBF7D0] text-black text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000]"
                  >
                    <TwitterIcon className="w-3.5 h-3.5 mr-1.5" />
                    X.com
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Technical Skills & Engineering Focus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="p-5 rounded-xl neo-box">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs font-black text-black tracking-wider">
                <Cpu className="w-4 h-4 text-black" />
                ROBOTICS & ENGINEERING SKILLS
              </div>
              <div className="space-y-3">
                {member.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold text-black">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full border border-black bg-[#FAF5E6] overflow-hidden">
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

            {/* Technical Focus Metrics */}
            <div className="p-5 rounded-xl neo-box">
              <div className="flex items-center gap-2 mb-4 font-mono text-xs font-black text-black tracking-wider">
                <Shield className="w-4 h-4 text-black" />
                TECHNICAL FOCUS METRICS
              </div>
              <div className="space-y-3">
                {Object.entries(member.stats).map(([statKey, value], idx) => {
                  const label = statKey.replace(/([A-Z])/g, ' $1').toUpperCase();
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono font-bold text-black">
                        <span>{label}</span>
                        <span>{value} / 100</span>
                      </div>
                      <div className="w-full h-2 rounded-full border border-black bg-[#FAF5E6] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-black"
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

          {/* Tools & Hardware */}
          <div className="p-5 rounded-xl neo-box">
            <div className="flex items-center gap-2 mb-3 font-mono text-xs font-black text-black tracking-wider">
              <Lock className="w-4 h-4" />
              HARDWARE TOOLS & SOFTWARE
            </div>
            <div className="flex flex-wrap gap-2">
              {member.tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs font-bold px-3 py-1 rounded-lg border-2 border-black bg-[#FEF08A] text-black shadow-[2px_2px_0px_0px_#000]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#FFF9EB] border-t-2 border-black flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="neo-btn px-6 py-2 rounded-xl bg-black text-[#FAF5E6] font-mono text-xs font-bold border-2 border-black hover:bg-[#1a1a1a]"
          >
            CLOSE PROFILE
          </button>
        </div>
      </div>
    </div>
  );
}
