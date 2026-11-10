import React, { useState } from 'react';
import { 
  Users, Wrench, Shield, CheckCircle2, ChevronRight, ArrowRight, 
  ExternalLink, Crown, Gamepad2, Lightbulb, Cpu, UserCheck, 
  Search, HeartHandshake, GraduationCap, Sparkles 
} from 'lucide-react';
import { TEAM_MEMBERS, MENTORS } from '../data/team';

// Mapping role icons to Lucide icon components
const ROLE_ICONS = {
  Crown: Crown,
  Gamepad2: Gamepad2,
  Lightbulb: Lightbulb,
  Cpu: Cpu,
  Wrench: Wrench,
  UserCheck: UserCheck,
  Search: Search,
  HeartHandshake: HeartHandshake,
  Shield: Shield
};

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
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D8D8D3] text-left">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-[#F04438] font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F04438]"></span>
              NATIONAL ROBOTICS LEAGUE · MEET OUR TEAM
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] uppercase">
              TEAM CYBER CHAMPS.
            </h2>
            <p className="text-lg sm:text-xl text-[#595959] leading-relaxed font-normal">
              <strong className="text-[#171717]">Different Roles | One Goal | A Smarter Tomorrow</strong>. 
              Meet the 9 student engineers and faculty mentors of Team #291 driving our robot in the Delhi Regional Championship.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 font-mono text-sm self-start md:self-auto">
            <span className="font-bold text-[#171717] px-3 py-1 rounded bg-[#ECECE7] border border-[#D8D8D3]">
              TEAM #291 / DELHI REGIONAL
            </span>
            <span className="text-xs text-[#059669] font-semibold">
              BUILD · INNOVATE · COMPETE
            </span>
          </div>
        </div>

        {/* 5-Step Engineering Workflow */}
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm uppercase tracking-wider text-[#595959] font-bold">
              HOW WE APPROACH ENGINEERING
            </span>
            <span className="font-mono text-xs text-[#059669] font-semibold hidden sm:inline">
              5-STAGE TOURNAMENT PIPELINE
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {workflowSteps.map((wf, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-[#D8D8D3] space-y-2.5 shadow-sm hover:border-[#171717] transition-all">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-base font-bold text-[#F04438]">{wf.step}</span>
                  <span className="font-mono text-xs text-[#595959] uppercase font-bold tracking-wider">{wf.phase}</span>
                </div>
                <h4 className="text-base font-bold text-[#171717]">{wf.title}</h4>
                <p className="text-sm text-[#595959] leading-relaxed font-light">{wf.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 9 Team Members Grid (Roles strictly mapped from the official team poster) */}
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#F04438] font-bold block mb-1">
                9 STUDENT SPECIALISTS
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                The Squad · Assigned Competition Roles
              </h3>
            </div>
            <span className="font-mono text-xs text-[#595959]">
              CLICK ANY MEMBER TO INSPECT TECHNICAL SKILLS & CONTRIBUTIONS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM_MEMBERS.map((member) => {
              const IconComponent = ROLE_ICONS[member.roleIcon] || Users;
              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className="p-6 rounded-2xl bg-white border border-[#D8D8D3] hover:border-[#171717] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header: Initial Avatar + Official Role Badge with Icon */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-12 h-12 rounded-xl bg-[#ECECE7] flex items-center justify-center font-mono text-lg font-bold text-[#171717] group-hover:bg-[#171717] group-hover:text-white transition-colors">
                        {member.name.charAt(0)}
                      </div>

                      {/* Official Role Badge with Matching Icon */}
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${member.roleBadgeColor || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{member.role}</span>
                      </div>
                    </div>

                    {/* Member Name & Role Category */}
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-[#171717] group-hover:text-[#F04438] transition-colors">
                        {member.name}
                      </h3>
                      <div className="text-xs font-mono font-semibold text-[#595959] uppercase tracking-wider mt-0.5">
                        {member.roleCategory} · TEAM #291
                      </div>
                      <p className="text-sm text-[#595959] mt-2 line-clamp-2 leading-relaxed">
                        {member.bio}
                      </p>
                    </div>

                    {/* Technical Competencies Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(member.skills || []).slice(0, 2).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-[#ECECE7] text-[#171717] font-medium"
                        >
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-3 border-t border-[#D8D8D3] flex items-center justify-between text-xs font-mono text-[#171717] font-semibold">
                    <span>INSPECT FULL PROFILE</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F04438]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Our Mentors Section (Sourced directly from the official team sheet) */}
        <div className="pt-10 border-t border-[#D8D8D3] space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-[#059669] font-bold block mb-1">
                FACULTY & TECHNICAL GUIDANCE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717] flex items-center gap-2.5">
                <GraduationCap className="w-7 h-7 text-[#059669]" />
                <span>Our Mentors</span>
              </h3>
            </div>
            <div className="font-mono text-xs text-[#595959]">
              ENGINEERING ADVICE & TOURNAMENT PREPARATION
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {MENTORS.map((mentor) => (
              <div 
                key={mentor.id}
                className="p-6 rounded-2xl bg-white border border-[#D8D8D3] shadow-sm flex items-start gap-4 hover:border-[#171717] transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#ECECE7] flex items-center justify-center text-[#171717] font-bold flex-shrink-0">
                  <UserCheck className="w-6 h-6 text-[#059669]" />
                </div>
                <div className="space-y-1 text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-300">
                    <span>{mentor.role}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-extrabold text-[#171717]">{mentor.name}</h4>
                  <div className="text-xs font-mono font-semibold text-[#F04438]">{mentor.designation}</div>
                  <p className="text-xs text-[#595959] leading-relaxed pt-1.5">{mentor.bio}</p>
                </div>
              </div>
            ))}

            {/* Mascot Robot Banner Card (Matching the official poster artwork) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-[#ECECE7] border border-emerald-300/80 shadow-sm flex items-center gap-4">
              <div className="w-20 h-20 flex-shrink-0">
                <img 
                  src={`${import.meta.env.BASE_URL}cyber-champs-logo-transparent.png`}
                  alt="Cyber Champs Mascot Logo"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div className="space-y-1 text-left">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#059669]">
                  CYBER CHAMPS #291
                </span>
                <div className="text-base font-extrabold text-[#171717]">
                  Build · Innovate · Compete
                </div>
                <div className="text-xs text-[#595959]">
                  Different Roles | One Goal | A Smarter Tomorrow
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Member Modal for Full Details */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-[#D8D8D3] rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-2 ${selectedMember.roleBadgeColor || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    <span>{selectedMember.role}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">{selectedMember.name}</h3>
                  <span className="text-xs font-mono text-[#595959] uppercase tracking-wider font-semibold">
                    {selectedMember.roleCategory} · TEAM #291
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1 rounded-md text-[#595959] hover:text-[#171717] hover:bg-[#ECECE7] transition-colors"
                >
                  ✕
                </button>
              </div>

              <p className="text-base text-[#171717] leading-relaxed font-normal">
                {selectedMember.bio}
              </p>

              {selectedMember.quote && (
                <div className="p-3.5 rounded-xl bg-[#ECECE7]/60 border border-[#D8D8D3] text-sm italic text-[#171717]">
                  "{selectedMember.quote}"
                </div>
              )}

              <div className="space-y-2">
                <span className="font-mono text-xs uppercase text-[#595959] block font-bold">
                  CORE TECHNICAL COMPETENCIES
                </span>
                <div className="space-y-1.5">
                  {(selectedMember.skills || []).map((sk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#FAFAFA] border border-[#D8D8D3] text-sm font-mono text-[#171717]">
                      <span>{sk.name}</span>
                      <span className="text-[#059669] font-bold">{sk.level}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMember.achievements && (
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase text-[#595959] block font-bold">
                    CONTRIBUTIONS TO ROBOT BUILD
                  </span>
                  {selectedMember.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-[#595959]">
                      <CheckCircle2 className="w-4 h-4 text-[#F04438] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-[#D8D8D3] flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-5 py-2.5 rounded-lg bg-[#171717] text-white text-sm font-mono font-medium hover:bg-black transition-colors"
                >
                  CLOSE PROFILE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
