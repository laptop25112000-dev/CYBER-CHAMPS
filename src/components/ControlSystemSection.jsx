import React, { useState } from 'react';
import { Cpu, Zap, Wifi, Monitor, Radio, BatteryCharging, ShieldAlert, SlidersHorizontal, Check } from 'lucide-react';

export default function ControlSystemSection() {
  const [activeTab, setActiveTab] = useState('architecture'); // 'architecture' | 'components'
  const [selectedNode, setSelectedNode] = useState('hub');

  const systemNodes = {
    controller: {
      name: 'Official NRL Game Controller',
      rule: 'Rule R7.2',
      type: 'PILOT INPUT',
      role: 'Handheld Bluetooth controller operated by the team driver in the Driver Area.',
      specs: ['Dual precision analog thumbsticks', '4 mechanical trigger switches', 'Bluetooth 2.4GHz paired directly to HEXA radio', 'Instant E-Stop shortcut']
    },
    hub: {
      name: 'NRL HEXA Command Hub',
      rule: 'Rule R7.1 & R8.1',
      type: 'CENTRAL PROCESSING',
      role: 'The competition-certified microcontroller running our custom team OpMode in the NRL Engine environment.',
      specs: ['32-bit Dual-Core 240MHz RISC processor', 'Integrated dual dual-channel H-bridges (3.2A/ch)', 'Hardware watchdog timer (<10ms cutoff)', 'Regulated 5.0V / 3.3V low-dropout power rails']
    },
    battery: {
      name: '7.4V 2S Li-Ion Power System',
      rule: 'Rules R6.1–R6.4',
      type: 'ENERGY SOURCE',
      role: 'Competition standard-issue power pack providing clean, high-discharge power.',
      specs: ['7.4V Nominal (8.4V Peak, well below 12V Max Limit)', '2200 mAh capacity / 25C continuous discharge', 'Inline 15A blade fuse protection', 'Standardized master toggle switch & XT60 connector']
    },
    oled: {
      name: '0.96" I2C Telemetry OLED',
      rule: 'Rule R8.7',
      type: 'SCRUTINEERING DISPLAY',
      role: 'Top-deck display inspectable by referees during pre-match staging and live rounds.',
      specs: ['128 × 64 monochrome I2C interface', 'Displays: HexaLINK connection status', 'Displays: Team Name "CYBER CHAMPS"', 'Displays: Team #100 & Assigned RF Channel']
    },
    motors: {
      name: '4× TT DC Drivetrain Channels',
      rule: 'Rule R5.1',
      type: 'PROPULSION ACTUATION',
      role: 'Direct 4-motor differential skid-steer output channels.',
      specs: ['4 independent MOSFET H-bridge channels', 'PWM speed & direction modulation (20kHz)', 'EMC varistors + 100nF filtering against RF drops', '3.2 kg·cm combined stall torque']
    },
    servos: {
      name: 'Dual Servo Actuator Channels',
      rule: 'Rule R5.2 & R9.6',
      type: 'MECHANISM MANIPULATION',
      role: 'Regulated 5V PWM channels driving the CORE claw and PAYLOAD cargo latch.',
      specs: ['Actuator 1: SG90 front scissor claw (1000–2000µs PWM)', 'Actuator 2: Micro-servo rear cargo bay release pin', 'Dedicated 5V 2A regulator preventing MCU brownout', 'Strictly limited to 2 actuators for payload (R9.6)']
    }
  };

  const currentNode = systemNodes[selectedNode] || systemNodes.hub;

  return (
    <section id="control-system" className="py-24 sm:py-32 bg-[#F7F7F4] border-b border-[#D8D8D3] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#D8D8D3]">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F04438] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F04438]"></span>
              SECTION 05 / ELECTRONICS & CONTROL
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717]">
              THE LOGIC BEHIND THE MOTION.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B6B6B] max-w-2xl font-light">
              How electrical energy and software commands flow through the robot. An integrated, tournament-compliant architecture built on the official NRL HEXA Hub.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center self-start md:self-auto bg-[#ECECE7] p-1 rounded-lg border border-[#D8D8D3]">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-4 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                activeTab === 'architecture'
                  ? 'bg-white text-[#171717] shadow-sm font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              SIGNAL & POWER FLOW
            </button>
            <button
              onClick={() => setActiveTab('components')}
              className={`px-4 py-2 text-xs font-mono font-medium rounded-md transition-all ${
                activeTab === 'components'
                  ? 'bg-white text-[#171717] shadow-sm font-semibold'
                  : 'text-[#6B6B6B] hover:text-[#171717]'
              }`}
            >
              MODULE BREAKDOWN
            </button>
          </div>
        </div>

        {/* Legend: Power vs Signal */}
        <div className="flex flex-wrap items-center gap-6 py-4 my-4 font-mono text-xs border-b border-[#D8D8D3]">
          <span className="text-[#6B6B6B] uppercase font-bold">WIRING BUS ARCHITECTURE:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#F04438]"></span>
            <span className="text-[#171717] font-semibold">POWER BUS: 7.4V DC High-Current & 5V Regulated Rails</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#0284C7]"></span>
            <span className="text-[#171717] font-semibold">SIGNAL BUS: 2.4GHz FHSS Telemetry, I2C, & PWM Logic</span>
          </div>
        </div>

        {activeTab === 'architecture' ? (
          /* Interactive Flow Diagram */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
            
            {/* Visual Architecture Map (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D8D3]">
                <span className="font-mono text-xs text-[#6B6B6B] uppercase">SYSTEM TOPOLOGY MAP</span>
                <span className="font-mono text-xs text-[#F04438] font-bold">SELECT ANY NODE TO INSPECT</span>
              </div>

              {/* Node 1: Input Level */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-[#6B6B6B] uppercase tracking-wider block">1. PILOT TELEMETRY LAYER</span>
                <button
                  onClick={() => setSelectedNode('controller')}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedNode === 'controller'
                      ? 'border-[#0284C7] bg-[#0284C7]/5 ring-1 ring-[#0284C7]'
                      : 'border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Radio className="w-5 h-5 text-[#0284C7]" />
                      <div>
                        <div className="text-sm font-bold text-[#171717]">NRL Bluetooth Game Controller</div>
                        <div className="font-mono text-xs text-[#6B6B6B]">Dual joysticks → 2.4GHz FHSS HexaLINK Packet (2ms)</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-[#0284C7] font-semibold">SIGNAL</span>
                  </div>
                </button>
              </div>

              {/* Arrow Connector */}
              <div className="flex justify-center">
                <div className="h-6 w-0.5 bg-[#0284C7] relative">
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-r-2 border-b-2 border-[#0284C7] rotate-45"></div>
                </div>
              </div>

              {/* Node 2: Central Processing & Power Distribution */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-[#6B6B6B] uppercase tracking-wider block">2. ONBOARD BRAIN & DISPATCH</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setSelectedNode('hub')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedNode === 'hub'
                        ? 'border-[#171717] bg-[#171717]/5 ring-1 ring-[#171717]'
                        : 'border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="w-4 h-4 text-[#171717]" />
                      <span className="text-xs font-bold text-[#171717]">HEXA Command Hub</span>
                    </div>
                    <p className="font-mono text-[11px] text-[#6B6B6B]">32-bit Dual-Core 240MHz MCU running OpModes</p>
                  </button>

                  <button
                    onClick={() => setSelectedNode('battery')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedNode === 'battery'
                        ? 'border-[#F04438] bg-[#F04438]/5 ring-1 ring-[#F04438]'
                        : 'border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7]/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <BatteryCharging className="w-4 h-4 text-[#F04438]" />
                      <span className="text-xs font-bold text-[#171717]">7.4V Li-Ion Battery</span>
                    </div>
                    <p className="font-mono text-[11px] text-[#6B6B6B]">Master switch, 15A fuse, XT60 harness</p>
                  </button>
                </div>
              </div>

              {/* Arrow Connector */}
              <div className="flex justify-center">
                <div className="h-6 w-0.5 bg-[#F04438] relative">
                  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-r-2 border-b-2 border-[#F04438] rotate-45"></div>
                </div>
              </div>

              {/* Node 3: Outputs Level */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-[#6B6B6B] uppercase tracking-wider block">3. PHYSICAL ACTUATION & TELEMETRY</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedNode('motors')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedNode === 'motors'
                        ? 'border-[#059669] bg-[#059669]/5 ring-1 ring-[#059669]'
                        : 'border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7]/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#171717]">4WD Drive Motors</div>
                    <div className="font-mono text-[10px] text-[#6B6B6B] mt-1">4× TT 1:48 gearboxes (7.4V H-bridge)</div>
                  </button>

                  <button
                    onClick={() => setSelectedNode('servos')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedNode === 'servos'
                        ? 'border-[#245DFF] bg-[#245DFF]/5 ring-1 ring-[#245DFF]'
                        : 'border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7]/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#171717]">Dual Servos</div>
                    <div className="font-mono text-[10px] text-[#6B6B6B] mt-1">Claw + Cargo release (5V PWM)</div>
                  </button>

                  <button
                    onClick={() => setSelectedNode('oled')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedNode === 'oled'
                        ? 'border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]'
                        : 'border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7]/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-[#171717]">0.96" OLED Display</div>
                    <div className="font-mono text-[10px] text-[#6B6B6B] mt-1">Ref Inspection, Team 100 (I2C)</div>
                  </button>
                </div>
              </div>

            </div>

            {/* Selected Node Detail Panel (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#D8D8D3]">
                  <span className="font-mono text-xs text-[#F04438] font-bold">{currentNode.type}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#ECECE7] text-[#171717] font-semibold">
                    {currentNode.rule}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#171717]">
                    {currentNode.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#6B6B6B] leading-relaxed">
                    {currentNode.role}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="font-mono text-xs text-[#171717] font-bold uppercase block">
                    VERIFIED TECHNICAL SPECIFICATIONS
                  </span>
                  <div className="space-y-2">
                    {currentNode.specs.map((spec, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[#D8D8D3] bg-[#FAFAFA] text-xs font-mono text-[#171717]">
                        <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D8D8D3] mt-6 flex items-center justify-between text-xs text-[#6B6B6B]">
                <span>Tournament Safety Pass</span>
                <span className="font-mono text-[#171717] font-semibold">RULE COMPLIANT</span>
              </div>
            </div>

          </div>
        ) : (
          /* Grid of Modules */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {Object.entries(systemNodes).map(([key, node]) => (
              <div key={key} className="bg-white border border-[#D8D8D3] rounded-xl p-6 space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#F04438]">{node.type}</span>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#ECECE7] text-[#171717]">
                      {node.rule}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#171717]">{node.name}</h4>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">{node.role}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-[#D8D8D3]">
                  {node.specs.slice(0, 3).map((sp, sIdx) => (
                    <div key={sIdx} className="font-mono text-[11px] text-[#171717] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#171717]"></span>
                      <span className="truncate">{sp}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
