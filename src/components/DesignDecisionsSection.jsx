import React, { useState } from 'react';
import { Scale, Zap, Shield, HelpCircle, ArrowRight, Check, X } from 'lucide-react';

export default function DesignDecisionsSection() {
  const [activeDecision, setActiveDecision] = useState(0);

  const decisions = [
    {
      id: 'tradeoff-1',
      tag: 'TRADE-OFF 01',
      title: 'Mobility vs. Stability',
      coreQuestion: 'How to climb the 15° Space Station ramp without tipping backward?',
      chosen: 'Ultra-low center of gravity dual-deck chassis with 28mm ground clearance',
      rejected: 'High-clearance suspension with elevated battery tray',
      rationale: 'During the final 30 seconds (LEVEL UP), climbing the Space Station to BALANCE (15 pts) requires driving up a 15° incline while carrying scoring elements. Placing the 2S Li-Ion pack flat on the bottom aluminum plate places 68% of total robot mass below the wheel axle line, eliminating any risk of flipping backward.',
      ruleImpact: 'Complies with Rule R1.1 (< 10" height) and maintains smooth clearance over 20mm soft-foam seams.',
      metrics: [
        { label: 'Center of Gravity Height', val: '38 mm above mat' },
        { label: 'Max Incline Angle', val: '24° before tip (15° required)' },
        { label: 'Chassis Mass', val: '340 g total frame' }
      ]
    },
    {
      id: 'tradeoff-2',
      tag: 'TRADE-OFF 02',
      title: 'Direct Linkage vs. Linear Slides',
      coreQuestion: 'How to manipulate 95mm rings reliably without risking mechanical jams?',
      chosen: 'Single SG90 micro-servo with dual-scissor mechanical linkage',
      rejected: 'Motorized multi-stage vertical elevator with lead screws or timing belts',
      rationale: 'Multi-stage linear elevators introduce high mass (400g+), string or belt slippage risks, and complexity that can fail in high-impact heats. Our dual-scissor linkage weighs only 48g, closes in 0.12 seconds, and uses 2.4× mechanical leverage to lock rings with silicone pads.',
      ruleImpact: 'Strictly satisfies Rule R5.2 (actuator count ≤ 4) and prevents horizontal expansion violations (Rule R1.7).',
      metrics: [
        { label: 'Mechanism Mass', val: '48 g (vs 420g elevator)' },
        { label: 'Grip Transition Time', val: '0.12 seconds' },
        { label: 'Holding Force', val: '8.5 N slip-free' }
      ]
    },
    {
      id: 'tradeoff-3',
      tag: 'TRADE-OFF 03',
      title: 'Speed vs. Torque & Control',
      coreQuestion: 'What gearbox ratio provides arena agility without spinning tires on soft foam?',
      chosen: '1:48 precision spur reduction gearboxes (200 RPM @ 6V)',
      rejected: '1:20 high-speed gearboxes (480 RPM @ 6V)',
      rationale: 'Top speed is useless if wheels spin uselessly on soft-foam floor tiles. 1:48 gearing delivers 3.2 kg·cm combined stall torque, ensuring instantaneous launches, millimeter-precise alignment at High Poles, and enough torque to hold position on the Space Station ramp without motor brownouts.',
      ruleImpact: 'Meets Rule R5.1 (4 propulsion motors only) with zero back-drive during station balancing.',
      metrics: [
        { label: 'Sprint Speed', val: '1.8 m/s controlled' },
        { label: 'Combined Torque', val: '3.2 kg·cm stall' },
        { label: 'Tile Bite', val: 'Zero initial wheel slip' }
      ]
    },
    {
      id: 'tradeoff-4',
      tag: 'TRADE-OFF 04',
      title: 'Dedicated vs. Multi-Use Mechanism',
      coreQuestion: 'How to handle both CORE rings and the team PAYLOAD cube?',
      chosen: 'Independent rear Cargo Bay cradle strictly separated from front claw',
      rejected: 'Reconfigurable single claw designed to clamp both rings and cubes',
      rationale: 'Official Rule R9.4 explicitly prohibits using the CORE manipulation mechanism to control PAYLOAD. Designing a single dual-use clamp would have caused instant disqualification during scrutineering. By dedicating an 18° rear gravity slide with a micro-servo pin, we fully satisfy R9.4 and cut the Starburst unlock requirement from 10 to 4 COREs.',
      ruleImpact: 'Rule R9.4 (Mechanism Separation) and Rule R9.6 (Payload Actuators ≤ 2) 100% compliant.',
      metrics: [
        { label: 'Rule R9.4 Compliance', val: '100% Verified Pass' },
        { label: 'Starburst Unlock Cut', val: 'From 10 down to 4 rings' },
        { label: 'Delivery Cycle', val: '0.3s gravity roll-out' }
      ]
    }
  ];

  const current = decisions[activeDecision];

  return (
    <section id="design-decisions" className="py-24 sm:py-32 bg-[#ECECE7]/40 border-b border-[#D8D8D3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D8D8D3]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F04438] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F04438]"></span>
              SECTION 07 / DESIGN PHILOSOPHY
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717]">
              WHY WE BUILT IT THIS WAY.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B6B6B] max-w-2xl font-light">
              Engineering is about deliberate choices. Every millimeter and gram of the CYBER CHAMPS robot was selected to solve specific tournament challenges.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D8D8D3] bg-white font-mono text-xs text-[#171717] self-start md:self-auto">
            <Scale className="w-4 h-4 text-[#F04438]" />
            <span>4 CORE TRADE-OFFS</span>
          </div>
        </div>

        {/* 4 Decision Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-8">
          {decisions.map((d, idx) => (
            <button
              key={d.id}
              onClick={() => setActiveDecision(idx)}
              className={`p-4 text-left rounded-xl border transition-all ${
                activeDecision === idx
                  ? 'bg-white border-[#171717] ring-1 ring-[#171717] shadow-sm'
                  : 'bg-white/60 border-[#D8D8D3] hover:bg-white'
              }`}
            >
              <span className="font-mono text-xs text-[#F04438] font-bold block mb-1">{d.tag}</span>
              <div className="text-sm font-bold text-[#171717] line-clamp-1">{d.title}</div>
            </button>
          ))}
        </div>

        {/* Active Trade-Off Card */}
        <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="font-mono text-xs font-bold text-[#F04438] uppercase mb-1">
                  ENGINEERING DILEMMA
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                  {current.coreQuestion}
                </h3>
              </div>

              {/* Chosen vs Rejected Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#059669]/5 border border-[#059669]/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#059669]">
                    <Check className="w-4 h-4" />
                    <span>OUR SELECTION</span>
                  </div>
                  <p className="text-sm text-[#171717] font-semibold">{current.chosen}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#F04438]/5 border border-[#F04438]/30 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#F04438]">
                    <X className="w-4 h-4" />
                    <span>ALTERNATIVE REJECTED</span>
                  </div>
                  <p className="text-sm text-[#6B6B6B] line-through">{current.rejected}</p>
                </div>
              </div>

              {/* Engineering Rationale */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs text-[#171717] uppercase font-bold tracking-wider block">
                  TECHNICAL RATIONALE
                </span>
                <p className="text-base text-[#171717] leading-relaxed font-light">
                  {current.rationale}
                </p>
              </div>

              {/* Rulebook Compliance */}
              <div className="p-4 rounded-xl bg-[#ECECE7]/50 border border-[#D8D8D3] text-xs font-mono text-[#171717]">
                <strong className="text-[#F04438]">OFFICIAL NRL IMPACT: </strong>
                {current.ruleImpact}
              </div>
            </div>

            {/* Right Metrics Panel (4 cols) */}
            <div className="lg:col-span-4 bg-[#FAFAFA] border border-[#D8D8D3] rounded-xl p-6 space-y-6">
              <span className="font-mono text-xs uppercase text-[#6B6B6B] block pb-3 border-b border-[#D8D8D3]">
                QUANTITATIVE ADVANTAGE
              </span>

              <div className="space-y-4">
                {current.metrics.map((m, mIdx) => (
                  <div key={mIdx} className="p-3.5 rounded-lg bg-white border border-[#D8D8D3]">
                    <div className="font-mono text-[10px] text-[#6B6B6B] uppercase">{m.label}</div>
                    <div className="font-mono text-base font-bold text-[#171717] mt-0.5">{m.val}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#D8D8D3] text-xs text-[#6B6B6B] font-mono">
                CAD verified in SolidWorks & Onshape models.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
