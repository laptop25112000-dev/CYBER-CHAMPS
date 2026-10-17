import React, { useState } from 'react';
import { Users, Wrench, Shield, CheckCircle2, ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/team';

export default function EditorialTeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);

  const workflowSteps = [
    {
      step: '01',
      phase: 'STRATEGIZE',
      title: 'Game Manual Analysis',
      desc: 'Dissecting NRL HYPERDRIVE 2026 scoring tables, Rule R1.1 18" envelope bounds, and Rule R9.4 mechanism separation.'
    },
    {
      step: '02',
      phase: 'CAD & SIMULATE',
      title: 'Digital Prototyping',
      desc: '3D modeling in Onshape and SolidWorks to verify weight distribution, claw leverage, and center of gravity.'
    },
    {
      step: '03',
      phase: 'FABRICATE',
      title: 'Precision Assembly',
      desc: 'CNC laser cutting 4mm optical polycarbonate, deburring 6061-T6 aluminum plates, and fitting brass standoffs.'
    },
    {
      step: '04',
      phase: 'WIRE & PROGRAM',
      title: 'Avionics Integration',
      desc: 'Laying 16 AWG silicone harnesses, mounting HEXA Command Hub, calibrating 0.96" OLED, and writing OpModes.'
    },
    {
      step: '05',
      phase: 'TEST & REFINE',
      title: 'Arena Drills & Scrutineering',
      desc: 'Executing 2:30 match simulations on 20mm soft-foam tiles, ramp climbing tests, and referee inspection checks.'
    }
  ];

  return (
    <section id="team" className="py-24 sm:py-32 bg-[#F7F7F4] border-b border-[#D8D8D3] scroll-mt-20">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D8D8D3]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[15px] uppercase tracking-widest text-[#F04438] mb-3 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F04438]"></span>
              SECTION 08 / THE PEOPLE BEHIND THE MACHINE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717]">
              DESIGNED. BUILT. TESTED.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B6B6B] max-w-2xl font-light">
              Meet the 9 student engineers of CYBER CHAMPS who took this robot from initial CAD sketches to tournament arena readiness.
            </p>
          </div>

          <div className="font-mono text-[15px] text-[#6B6B6B] self-start md:self-auto font-semibold">
            TEAM #100 / DELHI REGIONAL
          </div>
        </div>

        {/* 5-Step Engineering Workflow */}
        <div className="my-12">
          <div className="font-mono text-[15px] uppercase tracking-wider text-[#6B6B6B] mb-4 font-bold">
            HOW WE APPROACH ENGINEERING
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {workflowSteps.map((wf, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white border border-[#D8D8D3] space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[15px] font-bold text-[#F04438]">{wf.step}</span>
                  <span className="font-mono text-[15px] text-[#6B6B6B] uppercase font-semibold">{wf.phase}</span>
                </div>
                <h4 className="text-base font-bold text-[#171717]">{wf.title}</h4>
                <p className="text-[15px] text-[#6B6B6B] leading-relaxed font-light">{wf.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 9 Team Members Grid */}
        <div className="my-12">
          <div className="font-mono text-[15px] uppercase tracking-wider text-[#6B6B6B] mb-4 font-bold">
            THE 9 ENGINEERS OF CYBER CHAMPS
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="p-6 rounded-xl bg-white border border-[#D8D8D3] hover:border-[#171717] transition-all cursor-pointer shadow-sm group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#ECECE7] flex items-center justify-center font-mono text-base font-bold text-[#171717] group-hover:bg-[#171717] group-hover:text-white transition-colors">
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-mono text-[15px] text-[#6B6B6B] px-2.5 py-0.5 rounded bg-[#FAFAFA] border border-[#D8D8D3] font-semibold">
                      TEAM #100
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[#171717] group-hover:text-[#F04438] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[15px] text-[#6B6B6B] mt-1 line-clamp-2 leading-relaxed font-light">
                      {member.bio}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(member.skills || []).slice(0, 2).map((sk, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[15px] font-mono px-2.5 py-0.5 rounded bg-[#ECECE7] text-[#171717] font-medium"
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#D8D8D3] flex items-center justify-between text-[15px] font-mono text-[#171717] font-semibold">
                  <span>INSPECT VERIFIED ROLE</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F04438]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Member Modal for Full Details */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#D8D8D3] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[15px] text-[#F04438] font-bold">CYBER CHAMPS VERIFIED MEMBER</span>
                  <h3 className="text-2xl font-extrabold text-[#171717] mt-1">{selectedMember.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1 rounded-md text-[#6B6B6B] hover:text-[#171717] hover:bg-[#ECECE7]"
                >
                  ✕
                </button>
              </div>

              <p className="text-base sm:text-[17px] text-[#171717] leading-relaxed font-normal">
                {selectedMember.bio}
              </p>

              {selectedMember.quote && (
                <div className="p-3.5 rounded-xl bg-[#ECECE7]/60 border border-[#D8D8D3] text-[15px] italic text-[#171717]">
                  "{selectedMember.quote}"
                </div>
              )}

              <div className="space-y-2">
                <span className="font-mono text-[15px] uppercase text-[#6B6B6B] block font-bold">
                  CORE TECHNICAL COMPETENCIES
                </span>
                <div className="space-y-1.5">
                  {(selectedMember.skills || []).map((sk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#FAFAFA] border border-[#D8D8D3] text-[15px] font-mono text-[#171717]">
                      <span>{sk.name}</span>
                      <span className="text-[#059669] font-bold">{sk.level}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMember.achievements && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[15px] uppercase text-[#6B6B6B] block font-bold">
                    CONTRIBUTIONS TO ROBOT BUILD
                  </span>
                  {selectedMember.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[15px] text-[#6B6B6B]">
                      <CheckCircle2 className="w-4 h-4 text-[#F04438] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-[#D8D8D3] flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2.5 rounded-lg bg-[#171717] text-white text-[15px] font-mono font-medium hover:bg-black"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
