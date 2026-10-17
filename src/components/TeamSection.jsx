import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { TEAM_MEMBERS } from '../data/team';
import { Users, Wrench, Shield, CheckCircle2, ChevronRight, X, ArrowRight } from 'lucide-react';

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);

  const engineeringProcess = [
    { title: "Planning & Strategy", desc: "Analyzing arena rules, sizing constraints, and match scoring strategies." },
    { title: "CAD & Structural Rigging", desc: "Modeling dual-deck chassis plates, standoff loads, and motor mounts in SolidWorks." },
    { title: "Prototyping & Assembly", desc: "Precision laser cutting, wiring harness fabrication, and mechanical calibration." },
    { title: "Testing & Refinement", desc: "Benchtop oscilloscope voltage checks, obstacle climbing tests, and pit drills." }
  ];

  return (
    <section id="team" className="py-20 sm:py-28 bg-[#F6F7F8] border-b border-[#E4E7EB] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E7EB] bg-white text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>The Engineers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17191C]">
            People behind the machine.
          </h2>
          <p className="text-base sm:text-lg text-[#626A73] leading-relaxed">
            Meet the team bringing engineering ideas to life.
          </p>
        </div>

        {/* 9 Member Clean Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div 
              key={member.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedMember(member);
              }}
              className="p-6 rounded-2xl bg-white border border-[#E4E7EB] shadow-sm hover:border-[#245DFF]/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#245DFF]/15 to-[#245DFF]/5 border border-[#245DFF]/20 flex items-center justify-center font-bold text-[#245DFF] text-base group-hover:scale-105 transition-transform">
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-[11px] font-semibold text-[#626A73] px-2.5 py-0.5 rounded-full bg-[#F6F7F8] border border-[#E4E7EB]">
                    CYBER CHAMPS
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#17191C] group-hover:text-[#245DFF] transition-colors">
                    {member.name}
                  </h3>
                  {/* Concise verified contribution statement */}
                  <p className="text-xs text-[#626A73] line-clamp-2 mt-1 leading-relaxed">
                    {member.bio}
                  </p>
                </div>

                {/* Primary Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(member.skills || []).slice(0, 2).map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F6F7F8] text-[#17191C] border border-[#E4E7EB]"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E4E7EB] flex items-center justify-between text-xs font-semibold text-[#245DFF]">
                <span>View Full Contribution</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Team Engineering Methodology */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E7EB] shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#17191C]">
              How CYBER CHAMPS Approaches Engineering
            </h3>
            <p className="text-xs sm:text-sm text-[#626A73]">
              From concept sketches to high-speed arena heats, our team follows a structured engineering workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {engineeringProcess.map((step, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#F6F7F8] border border-[#E4E7EB] space-y-2 text-left">
                <span className="text-xs font-mono font-bold text-[#245DFF]">0{idx + 1}</span>
                <h4 className="text-sm font-bold text-[#17191C]">{step.title}</h4>
                <p className="text-xs text-[#626A73] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Member Details Modal */}
        {selectedMember && (
          <div 
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedMember(null)}
          >
            <div 
              className="bg-white rounded-3xl border border-[#E4E7EB] shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-left animate-in fade-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#245DFF] text-white flex items-center justify-center text-lg font-bold">
                    {selectedMember.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#17191C]">{selectedMember.name}</h3>
                    <div className="text-xs text-[#626A73]">CYBER CHAMPS · Delhi Regional Team</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedMember(null)}
                  aria-label="Close modal"
                  className="p-2 rounded-xl border border-[#E4E7EB] text-[#626A73] hover:text-[#17191C] hover:bg-[#F6F7F8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-[#626A73] leading-relaxed">
                {selectedMember.bio}
              </p>

              {/* Verified Achievements */}
              {selectedMember.achievements && (
                <div className="space-y-2">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#626A73]">
                    Verified Engineering Contributions
                  </div>
                  <ul className="space-y-1.5">
                    {selectedMember.achievements.map((ach, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#17191C]">
                        <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tools Used */}
              {selectedMember.tools && (
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#626A73] mb-2">
                    Tools &amp; Equipment
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMember.tools.map((t, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-[#F6F7F8] border border-[#E4E7EB] text-[#17191C]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#E4E7EB]">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="w-full py-2.5 rounded-xl bg-[#F6F7F8] hover:bg-[#E4E7EB] text-xs font-semibold text-[#17191C] transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
