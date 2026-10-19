import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldCheck, Zap, Sliders, CheckCircle2, RotateCw } from 'lucide-react';

export default function MechanismsSection() {
  const [mode, setMode] = useState('simple'); // 'simple' | 'technical'
  const [activeMechanism, setActiveMechanism] = useState('claw'); // 'claw' | 'cargobay'
  const [clawState, setClawState] = useState('hold'); // 'pickup' | 'hold' | 'lift' | 'release'
  const [cargoState, setCargoState] = useState('carry'); // 'load' | 'carry' | 'deposit'

  const mechanisms = [
    {
      id: 'claw',
      tag: '01 / CORE MANIPULATION',
      title: 'Articulated Scissor CORE Claw',
      shortRole: 'Picks up and threads 95mm rings onto arena poles.',
      image: './onshape-robot-cad.png',
      rule: 'Rule R1.7 & R5.2 Compliant',
      simple: {
        problem: 'During a match, rings are scattered flat on the foam arena floor. The robot needs to grab them securely and thread them down onto tall vertical poles without dropping them.',
        action: 'Pick up → Hold → Lift → Release onto pole.',
        howItScores: 'Each ring successfully threaded onto a High Pole earns 3 points. On Star Poles, it earns 5 points. On the Apex Pole during endgame, it scores 9 points.',
        parts: ['Miniature high-torque motor', 'Scissor scissor-action grabber arms', 'High-grip silicone pads', 'Front mounting bracket']
      },
      technical: {
        problem: 'Precise non-launching manipulation of 95mm OD × 55mm ID × 30mm thick PLA CORE rings (40g ± 5g) under strict Rule R1.7 horizontal expansion limits (≤ 18") and Rule G4.15 (anti-launching).',
        kinematics: 'Dual-scissor symmetrical linkage converting 0–180° rotary servo output into linear bilateral jaw aperture from 15mm (closed) to 82mm (open). Multiplies stall torque by 2.4×.',
        specs: [
          { label: 'Actuator', val: 'TowerPro SG90 9g Micro-Servo (Unmodified R5.3)' },
          { label: 'Supply Voltage', val: '5.0V Regulated Rail via HEXA Hub' },
          { label: 'Holding Torque', val: '2.20 kg·cm @ 6.0V (Effective 5.2 kg·cm linkage)' },
          { label: 'Aperture Range', val: '15 mm to 82 mm (55mm CORE hole matched)' },
          { label: 'Jaw Material', val: 'Laser-cut Acrylic with Shore 40A Silicone Pads' },
          { label: 'Cycle Time', val: '0.12s full open / close transition' }
        ],
        input: '5V PWM timing pulse (1000 µs to 2000 µs) from HEXA Hub Actuator Channel 1.',
        output: 'Clamping force of 8.5 N across ring circumference with zero slippage during 1.8 m/s field sprints.'
      }
    },
    {
      id: 'cargobay',
      tag: '02 / PAYLOAD TRANSPORT',
      title: 'Gravity-Assisted PAYLOAD Cargo Bay',
      shortRole: 'Transports team 3" cube & unlocks early Starburst Mode.',
      image: './onshape-robot-cad.png',
      rule: 'Rule R9.4 & R9.6 Compliant',
      simple: {
        problem: 'The official rules strictly ban using the ring claw to carry the team cube. The robot needs a completely separate way to carry the cube and release it into the scoring zone.',
        action: 'Load in Source Zone → Secure during sprint → Tilt & deposit into Drop Zone.',
        howItScores: 'Scoring the cube immediately drops the Starburst unlock requirement from 10 rings down to 4 rings! This gives our team early access to high-scoring Golden Vault rings and adds a 10-point bonus.',
        parts: ['Rear cargo bay cradle', 'Micro-servo retention latch', 'Beveled sliding ramp', 'Team "100" identifier plate']
      },
      technical: {
        problem: 'Compliance with Rule R9.4 (PAYLOAD cannot be handled by CORE manipulation mechanism) and Rule R9.6 (maximum 2 actuators dedicated to Payload), while securing a 380g 3" cube through 1.8 m/s arena decelerations.',
        kinematics: 'Passive 18° inclined gravity-assisted slide held by a micro-servo mechanical sear latch. Unlatching allows frictionless rollout into the 25" × 25" Drop Zone without recoil or bounce.',
        specs: [
          { label: 'Actuator', val: 'Micro-Servo Actuated Pin Latch' },
          { label: 'Payload Envelope', val: '3.0" × 3.0" × 3.0" (Rule: >2" and <4" cube)' },
          { label: 'Tested Mass', val: '380 grams (Complies with Rule Max 400g limit)' },
          { label: 'Slide Angle', val: '18° Low-Friction Fluoropolymer Ramp' },
          { label: 'Strategic Impact', val: 'Cuts Starburst threshold from 10 COREs to 4' },
          { label: 'Drop Accuracy', val: '100% containment within 25" Drop Zone' }
        ],
        input: 'Trigger signal from driver controller through HexaLINK telemetry.',
        output: 'Smooth 0.3-second gravity roll-out depositing the cube cleanly onto the arena mat.'
      }
    }
  ];

  const current = mechanisms.find(m => m.id === activeMechanism) || mechanisms[0];

  return (
    <section id="mechanisms" className="py-24 sm:py-32 bg-[#F7F7F4] border-b border-[#D8D8D3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D8D8D3]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F04438] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F04438]"></span>
              SECTION 03 / MECHANICAL SYSTEMS
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717]">
              ENGINEERING IN ACTION.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B6B6B] max-w-2xl font-light">
              How the robot interacts with the arena. Clean physical solutions designed around the official HYPERDRIVE 2026 rule constraints.
            </p>
          </div>

          {/* Simple vs Technical Switch */}
          <div className="flex items-center self-start md:self-auto bg-[#ECECE7] p-1 rounded-lg border border-[#D8D8D3]">
            <button
              onClick={() => setMode('simple')}
              className={`px-4 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                mode === 'simple'
                  ? 'bg-white text-[#171717] shadow-sm font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              SIMPLE EXPLANATION
            </button>
            <button
              onClick={() => setMode('technical')}
              className={`px-4 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                mode === 'technical'
                  ? 'bg-white text-[#171717] shadow-sm font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              TECHNICAL EXPLANATION
            </button>
          </div>
        </div>

        {/* Mechanism Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          {mechanisms.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMechanism(m.id)}
              className={`p-6 text-left border rounded-xl transition-all ${
                activeMechanism === m.id
                  ? 'bg-white border-[#171717] shadow-sm'
                  : 'bg-[#ECECE7]/60 border-[#D8D8D3] hover:bg-white/80'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-semibold text-[#F04438]">{m.tag}</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#ECECE7] text-[#171717] border border-[#D8D8D3]">
                  {m.rule}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#171717]">{m.title}</h3>
              <p className="text-sm text-[#6B6B6B] mt-1 font-light">{m.shortRole}</p>
            </button>
          ))}
        </div>

        {/* Active Mechanism Deep-Dive Panel */}
        <div className="bg-white border border-[#D8D8D3] rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#D8D8D3]">
            
            {/* Visual & Interactive State Column (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAFAFA]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#D8D8D3]">
                  <span className="font-mono text-xs text-[#6B6B6B] uppercase tracking-wider">MECHANISM VISUALIZATION</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#ECECE7] text-[#171717] font-semibold">
                    CAD VERIFIED
                  </span>
                </div>

                <div className="relative my-8 rounded-xl bg-white border border-[#D8D8D3] p-6 flex items-center justify-center overflow-hidden min-h-[260px]">
                  <img
                    src={current.image}
                    alt={current.title}
                    className="max-h-56 w-auto object-contain transition-transform duration-500 hover:scale-105"
                  />
                  
                  {/* Callout badge on image */}
                  <div className="absolute bottom-3 left-3 bg-[#171717] text-white text-[11px] font-mono px-2.5 py-1 rounded">
                    {activeMechanism === 'claw' ? 'FRONT MOUNTED / DUAL SCISSOR' : 'REAR COMPARTMENT / GRAVITY RAMP'}
                  </div>
                </div>

                {/* State simulation controls */}
                <div className="space-y-3 pt-2">
                  <span className="font-mono text-xs text-[#6B6B6B] uppercase block">
                    {activeMechanism === 'claw' ? 'INTERACTION CYCLE' : 'DEPLOYMENT SEQUENCE'}
                  </span>

                  {activeMechanism === 'claw' ? (
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'pickup', label: '1. Pick Up' },
                        { id: 'hold', label: '2. Hold' },
                        { id: 'lift', label: '3. Lift' },
                        { id: 'release', label: '4. Release' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setClawState(st.id)}
                          className={`py-2 px-1 text-center font-mono text-xs rounded border transition-all ${
                            clawState === st.id
                              ? 'bg-[#171717] text-white border-[#171717]'
                              : 'bg-white text-[#6B6B6B] border-[#D8D8D3] hover:text-[#171717]'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'load', label: '1. Load' },
                        { id: 'carry', label: '2. Transport' },
                        { id: 'deposit', label: '3. Deposit' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          onClick={() => setCargoState(st.id)}
                          className={`py-2 px-1 text-center font-mono text-xs rounded border transition-all ${
                            cargoState === st.id
                              ? 'bg-[#171717] text-white border-[#171717]'
                              : 'bg-white text-[#6B6B6B] border-[#D8D8D3] hover:text-[#171717]'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-[#ECECE7] rounded-lg text-xs font-mono text-[#171717] mt-3">
                    <span className="text-[#F04438] font-bold">STATE: </span>
                    {activeMechanism === 'claw' ? (
                      clawState === 'pickup' ? 'Claw opens to 82mm to encircle 95mm outer ring.' :
                      clawState === 'hold' ? 'Servo clamps 8.5N force; silicone pads lock onto 55mm inner wall.' :
                      clawState === 'lift' ? 'Arm aligns with 130mm High Pole clearance height.' :
                      'Jaws open to 82mm; ring drops cleanly over pole ring stop.'
                    ) : (
                      cargoState === 'load' ? 'Cube placed into 18° inclined bay during pre-match or Source Zone.' :
                      cargoState === 'carry' ? 'Sear pin latch engaged; prevents cube bounce during 1.8 m/s sprint.' :
                      'Sear unlatches; 380g cube rolls smoothly into 25" Drop Zone.'
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D8D8D3] mt-6 flex items-center justify-between text-xs text-[#6B6B6B]">
                <span>Tournament Certified</span>
                <span className="font-mono text-[#171717] font-semibold">NRL HYPERDRIVE 2026</span>
              </div>
            </div>

            {/* Explanation Content Column (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              
              {mode === 'simple' ? (
                /* Simple Explanation Content */
                <div className="space-y-8">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#F04438]">
                      WHAT PROBLEM DOES THIS SOLVE?
                    </span>
                    <p className="mt-2 text-base sm:text-lg text-[#171717] leading-relaxed font-light">
                      {current.simple.problem}
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-[#ECECE7]/60 border border-[#D8D8D3]">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#6B6B6B] block mb-2">
                      OPERATING PROCESS
                    </span>
                    <p className="text-sm font-mono text-[#171717] font-semibold">
                      {current.simple.action}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#F04438]">
                      HOW IT SCORES POINTS FOR THE TEAM
                    </span>
                    <p className="mt-2 text-base text-[#171717] leading-relaxed">
                      {current.simple.howScores}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#6B6B6B] block mb-3">
                      KEY COMPONENTS INVOLVED
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {current.simple.parts.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 rounded-lg border border-[#D8D8D3] bg-[#FAFAFA] text-sm text-[#171717]">
                          <CheckCircle2 className="w-4 h-4 text-[#F04438] shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Technical Engineering Explanation Content */
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#F04438]">
                      ENGINEERING OBJECTIVE & RULE CONSTRAINTS
                    </span>
                    <p className="mt-2 text-sm text-[#171717] leading-relaxed font-light">
                      {current.technical.problem}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#6B6B6B] block mb-1">
                      KINEMATIC BEHAVIOR
                    </span>
                    <p className="text-xs font-mono text-[#171717] p-3 rounded bg-[#ECECE7]/50 border border-[#D8D8D3]">
                      {current.technical.kinematics}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#6B6B6B] block mb-2">
                      MEASURED SPECIFICATIONS
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {current.technical.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded border border-[#D8D8D3] bg-[#FAFAFA]">
                          <div className="font-mono text-[10px] text-[#6B6B6B] uppercase">{spec.label}</div>
                          <div className="font-mono text-xs text-[#171717] font-semibold mt-0.5">{spec.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-lg bg-[#ECECE7]/40 border border-[#D8D8D3]">
                      <span className="font-mono text-[10px] uppercase text-[#6B6B6B] block">SYSTEM INPUT</span>
                      <p className="font-mono text-xs text-[#171717] mt-1">{current.technical.input}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#ECECE7]/40 border border-[#D8D8D3]">
                      <span className="font-mono text-[10px] uppercase text-[#F04438] block">SYSTEM OUTPUT</span>
                      <p className="font-mono text-xs text-[#171717] mt-1">{current.technical.output}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom rule reference indicator */}
              <div className="mt-8 pt-6 border-t border-[#D8D8D3] flex items-center justify-between text-xs text-[#6B6B6B]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F04438]" />
                  <span>Verified in CAD Assembly & NRL Game Manual</span>
                </div>
                <span className="font-mono font-medium text-[#171717]">TEAM #100</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
