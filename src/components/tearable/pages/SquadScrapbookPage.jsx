import React from 'react';
import { TEAM_MEMBERS } from '../../../data/team';
import TearablePerforatedSlip from '../TearablePerforatedSlip';
import { Users, Award, Shield, Sparkles } from 'lucide-react';

export default function SquadScrapbookPage() {
  const memberColors = ['#FEF08A', '#BAE6FD', '#BBF7D0', '#FECDD3', '#E9D5FF', '#FED7AA'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-black bg-cyan-300 text-black">
            <Users className="w-3 h-3" />
            9 REGISTERED STUDENTS
          </div>
          <h3 className="font-['Orbitron'] text-xl font-black text-black mt-1">
            Official Squad Scrapbook
          </h3>
        </div>
        <p className="font-mono text-xs font-bold text-slate-700 max-w-sm">
          No artificial corporate titles — 9 dedicated teammates building, coding, and driving together for Delhi State glory.
        </p>
      </div>

      {/* 9 Members Scrapbook Polaroid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEAM_MEMBERS.map((member, idx) => (
          <div
            key={member.id}
            className="p-4 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[3px_3px_0px_0px_#000] flex flex-col justify-between space-y-3 relative overflow-hidden"
          >
            {/* Scrapbook Tape Accent in Top Right Corner */}
            <div className="absolute -top-1 -right-4 w-16 h-5 bg-amber-200/70 border border-black/30 rotate-12 shadow-sm pointer-events-none" />

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-10 h-10 rounded-xl border-2 border-black bg-gradient-to-br ${member.avatarGradient} flex items-center justify-center font-['Orbitron'] text-sm font-black text-white shadow-[2px_2px_0px_0px_#000]`}
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="font-['Orbitron'] text-base font-black text-black">
                    {member.name}
                  </div>
                  <div className="font-mono text-[10px] font-bold text-slate-700 uppercase">
                    CYBER CHAMPS 2026
                  </div>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-800 leading-snug line-clamp-3 bg-[#FAF5E6] p-2 rounded-lg border border-black/30">
                "{member.bio}"
              </p>
            </div>

            {/* Top Skills Preview */}
            <div className="space-y-1 pt-1 border-t border-black/20 text-[10px] font-mono">
              <div className="font-bold text-slate-700">CORE FOCUS:</div>
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 2).map((s, sIdx) => (
                  <span key={sIdx} className="px-1.5 py-0.5 rounded bg-black text-[#FEF08A] font-bold">
                    {s.name} ({s.level}%)
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Perforated Member Credential Tear Slips */}
      <div className="space-y-3 pt-4 border-t-2 border-dashed border-black/40">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-black text-black uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            TEARABLE MEMBER ROSTER SLIPS:
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-700">
            TEAR OFF TO CLAIM SQUAD PROFILE SLIPS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {TEAM_MEMBERS.map((m, idx) => (
            <TearablePerforatedSlip
              key={m.id}
              label={m.name}
              sublabel={m.achievements[0]}
              badgeText={`NO. 0${idx + 1}`}
              accentColor={memberColors[idx % memberColors.length]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
