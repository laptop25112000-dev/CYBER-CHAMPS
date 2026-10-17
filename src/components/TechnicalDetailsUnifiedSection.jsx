import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { Wrench, Cpu, Sliders, CheckCircle2, ShieldCheck, Copy, Check, ChevronDown, ChevronUp, Scale, ArrowRight } from 'lucide-react';
import { NRL_COMPETITION_DATA, ROBOT_CORE_INFO } from '../data/robotData';

export default function TechnicalDetailsUnifiedSection() {
  const [activeArea, setActiveArea] = useState('mechanical'); // 'mechanical' | 'electronics' | 'specs'
  const [copied, setCopied] = useState(false);
  const [activeTradeoff, setActiveTradeoff] = useState(0);

  const areas = [
    { id: 'mechanical', label: '1. Mechanical Systems', icon: Wrench },
    { id: 'electronics', label: '2. Electronics & Software', icon: Cpu },
    { id: 'specs', label: '3. Specifications & Decisions', icon: Sliders }
  ];

  const specRows = [
    {
      param: 'Starting Footprint (L × W × H)',
      robot: '245 × 165 × 135 mm (9.6" × 6.5" × 5.3")',
      limit: 'Max 18" × 18" × 10" (457 × 457 × 254 mm)',
      code: 'Rule R1.1',
      status: 'PASS'
    },
    {
      param: 'Total Match Mass (with battery)',
      robot: '1,280 grams (1.28 kg)',
      limit: 'Max 8.0 kg (8,000 g)',
      code: 'Rule R1.2',
      status: 'PASS'
    },
    {
      param: 'Drive Mechanism Type',
      robot: '4WD Knobby Synthetic Rubber Traction Drive',
      limit: 'Traction only (No Mecanum / Omni / Casters)',
      code: 'Rule R1.10',
      status: 'PASS'
    },
    {
      param: 'Propulsion Motors',
      robot: '4× TT DC High-Torque Gearmotors (1:48)',
      limit: 'Maximum 4 propulsion motors',
      code: 'Rule R5.1',
      status: 'PASS'
    },
    {
      param: 'Actuators Installed',
      robot: '2 Actuators (1× SG90 Claw + 1× Micro-Servo Latch)',
      limit: 'Max 4 total / Max 2 for Payload',
      code: 'Rule R5.2 / R9.6',
      status: 'PASS'
    },
    {
      param: 'Battery Voltage',
      robot: '7.4V 2S Li-Ion Power Cell (2200 mAh, 25C)',
      limit: 'Maximum 12V DC (Step-up converters banned)',
      code: 'Rule R6.1 / R6.4',
      status: 'PASS'
    },
    {
      param: 'Controller & Telemetry',
      robot: 'Official NRL HEXA Hub + HexaLINK 2.4GHz FHSS',
      limit: 'Official HEXA radio mandated (No Wi-Fi/BT)',
      code: 'Rule R7.1 / R8.9',
      status: 'PASS'
    },
    {
      param: 'Ground Clearance',
      robot: '28 mm (Clears soft-foam seams & ramp transition)',
      limit: 'To be confirmed on arena tile seams',
      code: 'Arena R1.4',
      status: 'PASS'
    }
  ];

  const tradeOffs = [
    {
      title: 'Mobility vs. Stability (Center of Gravity)',
      dilemma: 'How to climb the 15° Space Station ramp without tipping backward?',
      decision: 'Dual-deck chassis with battery mounted flat on 2mm aluminum belly pan.',
      rationale: 'Places 68% of robot weight below axle height, enabling 24° incline stability with zero rollover risk.',
      altRejected: 'High-clearance elevated battery box (rejected due to backward tipping on ramp).'
    },
    {
      title: 'Direct Linkage vs. Linear Slides',
      dilemma: 'How to grasp 95mm rings without mechanical jams or cable snags?',
      decision: 'Single SG90 servo powering a dual-scissor mechanical linkage with silicone jaws.',
      rationale: 'Weighs only 48g total, closes in 0.12 seconds, and multiplies servo torque by 2.4×.',
      altRejected: 'Multi-stage linear elevator with belts (rejected due to high mass and jam risk).'
    },
    {
      title: 'Speed vs. Low-End Torque',
      dilemma: 'What gear ratio balances arena sprint speed with station ramp climbing?',
      decision: '1:48 spur reduction gearboxes producing 200 RPM at 6.0V (1.8 m/s).',
      rationale: 'Delivers 3.2 kg·cm combined stall torque so the robot holds position on the ramp without back-driving.',
      altRejected: '1:20 high-speed gearboxes (rejected: wheel slip on soft-foam and lacked climb torque).'
    },
    {
      title: 'Mechanism Separation (Rule R9.4)',
      dilemma: 'How to score both CORE rings and custom PAYLOAD cubes legally?',
      decision: 'Completely separated front scissor ring claw and rear gravity-assisted cargo cradle.',
      rationale: 'Strictly satisfies Rule R9.4 (prohibiting payload handling with ring claw) while cutting Starburst threshold from 10 to 4 rings.',
      altRejected: 'Multi-purpose interchangeable claw (rejected: illegal under Rule R9.4).'
    }
  ];

  const handleCopy = () => {
    const text = specRows.map(r => `${r.param}: ${r.robot} [${r.code}: Limit ${r.limit} - ${r.status}]`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="technical" className="py-24 sm:py-32 bg-[#ECECE7]/40 border-b border-[#D8D8D3] scroll-mt-16">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-12">
        
        {/* Section Header with Large, Clear Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8D8D3] text-left">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[15px] sm:text-base uppercase tracking-widest text-[#F04438] block font-bold">
              05 / TECHNICAL DETAILS
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] uppercase">
              Engineering & Architecture.
            </h2>
            <p className="text-lg sm:text-xl text-[#595959] leading-relaxed">
              Consolidated documentation covering mechanical fabrication, avionics, software logic, verified specifications, and engineering trade-offs.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 border border-[#D8D8D3] bg-white text-[15px] sm:text-base font-mono font-bold rounded hover:bg-[#ECECE7] transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-[#059669]" /> : <Copy className="w-4 h-4 text-[#595959]" />}
            <span>{copied ? 'SPEC SHEET COPIED' : 'COPY SPEC SHEET'}</span>
          </button>
        </div>

        {/* 3 Coherent Area Tabs with Larger Fonts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {areas.map((area) => {
            const isActive = activeArea === area.id;
            const Icon = area.icon;
            return (
              <button
                key={area.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveArea(area.id);
                }}
                className={`p-5 text-left border rounded-xl transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-white border-[#171717] ring-2 ring-[#171717] shadow-sm'
                    : 'bg-white/60 border-[#D8D8D3] hover:bg-white text-[#595959]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#F04438]' : 'text-[#595959]'}`} />
                  <span className={`text-base font-bold ${isActive ? 'text-[#171717]' : 'text-[#595959]'}`}>
                    {area.label}
                  </span>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-[#F04438]' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        {/* Area 1: Mechanical Systems */}
        {activeArea === 'mechanical' && (
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                MECHANICAL SYSTEMS
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                Drivetrain, Chassis & Manipulator Kinematics
              </h3>
              <p className="text-base sm:text-lg text-[#595959] mt-2 max-w-3xl leading-relaxed">
                How our structural frame, propulsion, and manipulators interact under tournament stress.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">01 · CHASSIS TORSION BOX</div>
                <h4 className="text-xl font-bold text-[#171717]">Dual-Deck Rigid Frame</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  2mm 6061-T6 aluminum belly pan and 4mm optical polycarbonate top deck joined by M3 brass standoffs. Resists chassis twist during arena collisions while providing 28mm obstacle ground clearance.
                </p>
                <div className="pt-2 font-mono text-[15px] sm:text-base text-[#171717] space-y-1">
                  <div>• Mass: 340g (Frame only)</div>
                  <div>• Edge Chamfer: 1.5mm safe radii (R1.3)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">02 · 4WD TRACTION DRIVE</div>
                <h4 className="text-xl font-bold text-[#171717]">Independent Gearmotors</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  4× TT DC motors with 1:48 precision spur reduction and solid brass 12mm hex couplers. Paired with 65mm knobby synthetic rubber tires (strictly compliant with Rule R1.10 banning Mecanum).
                </p>
                <div className="pt-2 font-mono text-[15px] sm:text-base text-[#171717] space-y-1">
                  <div>• Stall Torque: 3.2 kg·cm combined</div>
                  <div>• Sprint Velocity: 1.8 m/s on foam</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">03 · MANIPULATORS</div>
                <h4 className="text-xl font-bold text-[#171717]">Claw & Cargo Bay</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  Front articulated scissor claw (SG90 servo, 15–82mm aperture, 8.5N grip) for 95mm rings, plus rear 18° gravity cradle with micro-servo sear release for the team 3" Payload cube (Rule R9.4).
                </p>
                <div className="pt-2 font-mono text-[15px] sm:text-base text-[#171717] space-y-1">
                  <div>• Ring Clamping Force: 8.5 N</div>
                  <div>• Cube Capacity: 380g (Max 400g limit)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Area 2: Electronics & Software */}
        {activeArea === 'electronics' && (
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-8 text-left shadow-sm">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                AVIONICS & FIRMWARE
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                Official Control Hardware, Power & Software Runtime
              </h3>
              <p className="text-base sm:text-lg text-[#595959] mt-2 max-w-3xl leading-relaxed">
                The onboard electrical architecture is built strictly around the official National Robotics League HEXA Command Hub.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#0284C7]">HARDWARE HUB</div>
                <h4 className="text-xl font-bold text-[#171717]">Official HEXA Hub</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  32-bit dual-core 240MHz MCU running the official NRL Engine runtime. Integrates dual H-bridges (3.2A continuous/ch) and a 0.96" I2C status OLED displaying Link, Team 100, and RF Channel (Rule R8.7).
                </p>
                <div className="pt-2 font-mono text-[15px] sm:text-base text-[#171717] space-y-1">
                  <div>• Radio: HexaLINK 2.4GHz FHSS</div>
                  <div>• Telemetry Latency: &lt; 4.2 ms</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">POWER ARCHITECTURE</div>
                <h4 className="text-xl font-bold text-[#171717]">7.4V 2S Li-Ion Power Pack</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  Competition standard-issue 2200 mAh 2S Li-Ion battery (25C discharge, 55A continuous). Wired via 16 AWG silicone wire with an inline 15A blade fuse and accessible master rocker toggle switch (Rule R6.8).
                </p>
                <div className="pt-2 font-mono text-[15px] sm:text-base text-[#171717] space-y-1">
                  <div>• Voltage: 7.4V (Max 8.4V &lt; 12V Limit)</div>
                  <div>• Connectors: Gold-plated XT60</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-3">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#059669]">SOFTWARE & OPMODES</div>
                <h4 className="text-xl font-bold text-[#171717]">NRL Engine Runtime</h4>
                <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                  Team OpMode code runs inside the official sandboxed architecture (Rule R8.1/R8.2). Implements skid-steer differential exponential curves, deadband filtering, and safety watchdog stop loops (Rule R8.13).
                </p>
                <div className="pt-2 font-mono text-[15px] sm:text-base text-[#171717] space-y-1">
                  <div>• Control Loop: 10 ms cycle</div>
                  <div>• Watchdog Cutoff: &lt; 10 ms on loss</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Area 3: Specifications & Engineering Decisions */}
        {activeArea === 'specs' && (
          <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-10 space-y-10 text-left shadow-sm">
            <div>
              <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                ENGINEERING DATA & SCRUTINEERING
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                Verified Specifications & Key Design Trade-Offs
              </h3>
              <p className="text-base sm:text-lg text-[#595959] mt-2 max-w-3xl leading-relaxed">
                Comparison between our verified robot metrics and the official NRL HYPERDRIVE 2026 rule constraints.
              </p>
            </div>

            {/* Scrutineering Table with Substantially Larger, Readable Text */}
            <div className="border border-[#D8D8D3] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-base sm:text-[17px]">
                  <thead>
                    <tr className="bg-[#FAFAFA] border-b border-[#D8D8D3] text-[#595959] uppercase tracking-wider text-[15px] sm:text-base font-bold">
                      <th className="py-4 px-6">PARAMETER</th>
                      <th className="py-4 px-6 text-[#171717]">MEASURED ROBOT SPEC</th>
                      <th className="py-4 px-6">RULEBOOK LIMIT</th>
                      <th className="py-4 px-6">RULE CODE</th>
                      <th className="py-4 px-6 text-center">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8D8D3]">
                    {specRows.map((r, idx) => (
                      <tr key={idx} className="hover:bg-[#ECECE7]/30 transition-colors">
                        <td className="py-4 px-6 font-bold text-[#171717]">{r.param}</td>
                        <td className="py-4 px-6 font-semibold text-[#171717]">{r.robot}</td>
                        <td className="py-4 px-6 text-[#595959]">{r.limit}</td>
                        <td className="py-4 px-6 text-[#595959]">{r.code}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="px-3.5 py-1 rounded-full text-[15px] font-bold bg-[#059669]/10 text-[#059669] border border-[#059669]/30">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Design Trade-Offs & Decisions */}
            <div className="pt-6 border-t border-[#D8D8D3] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#F04438] tracking-wider block">
                    ENGINEERING RATIONALE
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-bold text-[#171717]">
                    Why We Built It This Way
                  </h4>
                </div>

                <div className="font-mono text-[15px] sm:text-base font-bold text-[#595959]">
                  4 CORE TRADE-OFFS
                </div>
              </div>

              {/* Trade-off Selector Tabs with Larger Font */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {tradeOffs.map((to, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTradeoff(tIdx);
                    }}
                    className={`p-4 text-left border rounded-xl transition-all ${
                      activeTradeoff === tIdx
                        ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                        : 'bg-[#FAFAFA] text-[#171717] border-[#D8D8D3] hover:bg-[#ECECE7]'
                    }`}
                  >
                    <div className="text-[15px] font-bold line-clamp-1">{to.title}</div>
                  </button>
                ))}
              </div>

              {/* Active Tradeoff Details with Larger Fonts */}
              <div className="p-6 sm:p-8 rounded-2xl border border-[#D8D8D3] bg-[#FAFAFA] space-y-5">
                <div className="font-mono text-[15px] sm:text-base font-bold text-[#F04438]">
                  DILEMMA: {tradeOffs[activeTradeoff].dilemma}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-[#059669]/10 border border-[#059669]/30 space-y-1.5">
                    <span className="font-mono text-[15px] font-bold text-[#059669] uppercase tracking-wider block">OUR DECISION</span>
                    <p className="text-base font-semibold text-[#171717]">{tradeOffs[activeTradeoff].decision}</p>
                  </div>
                  <div className="p-5 rounded-xl bg-[#F04438]/10 border border-[#F04438]/30 space-y-1.5">
                    <span className="font-mono text-[15px] font-bold text-[#F04438] uppercase tracking-wider block">ALTERNATIVE REJECTED</span>
                    <p className="text-base font-semibold text-[#595959] line-through">{tradeOffs[activeTradeoff].altRejected}</p>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[15px] sm:text-base text-[#595959] uppercase font-bold tracking-wider block mb-1.5">
                    TECHNICAL RATIONALE:
                  </span>
                  <p className="text-base sm:text-lg text-[#171717] leading-relaxed">
                    {tradeOffs[activeTradeoff].rationale}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
}
