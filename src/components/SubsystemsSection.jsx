import React from 'react';
import { soundManager } from '../utils/audio';
import { ArrowRight, Compass, Shield, Cpu, Zap, Activity, Box } from 'lucide-react';
import { ROBOT_SYSTEMS, ROBOT_COMPONENTS } from '../data/robotData';

export default function SubsystemsSection({ onSelectSystem }) {
  const subsystems = [
    {
      num: "01",
      name: "Drivetrain",
      desc: "How the robot moves, turns, and positions itself across the 36 soft-foam tournament tiles with zero-radius differential steering.",
      tech: "4× independent TT DC gearmotors with 1:48 gearboxes and 65mm knobby all-terrain rubber tires.",
      targetAnchor: "#explorer",
      componentId: "gearmotors-4wd"
    },
    {
      num: "02",
      name: "Manipulator",
      desc: "How the active front linkage securely clamps 95mm tournament scoring rings (COREs) and elevates them to thread onto poles.",
      tech: "SG90 micro-servo driving an articulating dual-scissor linkage with silicone friction pads.",
      targetAnchor: "#explorer",
      componentId: "claw-linkage"
    },
    {
      num: "03",
      name: "Game-Element Handling",
      desc: "How the robot collects CORE rings from Spike Marks and transports custom team PAYLOAD cubes to the Drop Zone.",
      tech: "Dedicated rear Payload Cargo Bay with micro-servo tilt release, strictly separated from the CORE claw per Rule R9.4.",
      targetAnchor: "#explorer",
      componentId: "cargo-bay"
    },
    {
      num: "04",
      name: "Control System",
      desc: "How the driver sends wireless commands and how the central onboard computer decodes and executes them in real time.",
      tech: "Official NRL HEXA Command Hub running team OpModes inside the NRL Engine runtime with <4.2ms latency.",
      targetAnchor: "#control",
      componentId: "hexa-pcb"
    },
    {
      num: "05",
      name: "Sensors & Feedback",
      desc: "How the robot monitors hardware health and displays match status to referees without tilting or opening plates.",
      tech: "Onboard 0.96\" I2C OLED screen (displaying Team 100, Link, Channel per R8.7), status LED, and battery voltage telemetry.",
      targetAnchor: "#control",
      componentId: "hexa-pcb"
    },
    {
      num: "06",
      name: "Chassis & Power",
      desc: "How the structural skeleton protects electronics from collisions while delivering steady, high-amperage current.",
      tech: "Dual-deck 4mm polycarbonate and 6061-T6 aluminum belly pan, powered by a standard-issue 7.4V 2S Li-Ion cell.",
      targetAnchor: "#explorer",
      componentId: "chassis-plates"
    }
  ];

  const handleCardClick = (sub) => {
    soundManager.playClick();
    if (onSelectSystem) {
      const comp = ROBOT_COMPONENTS.find(c => c.id === sub.componentId);
      if (comp) onSelectSystem(comp);
    }
    const el = document.querySelector(sub.targetAnchor);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="robot" className="py-20 sm:py-28 border-b border-[#D8D8D3] bg-[#F7F7F4] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-left space-y-3 max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F04438] block font-bold">
            // SUBSYSTEM ARCHITECTURE
          </span>
          <h2 className="font-['Geist',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#171717]">
            ONE ROBOT. MULTIPLE SYSTEMS.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            Explore the six core engineering subsystems that power our competition robot on the NRL HYPERDRIVE field.
          </p>
        </div>

        {/* 6 Numbered Editorial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subsystems.map((sub) => (
            <div 
              key={sub.num}
              onClick={() => handleCardClick(sub)}
              className="p-8 border border-[#D8D8D3] bg-[#ECECE7] hover:border-[#171717] transition-all cursor-pointer flex flex-col justify-between group text-left"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono text-xs text-[#6B6B6B] border-b border-[#D8D8D3] pb-3">
                  <span className="font-bold text-[#F04438]">{sub.num}</span>
                  <span className="uppercase">SUBSYSTEM</span>
                </div>

                <h3 className="font-['Geist',sans-serif] text-2xl font-bold uppercase tracking-tight text-[#171717] group-hover:text-[#F04438] transition-colors">
                  {sub.name}
                </h3>

                {/* Beginner Plain Language Description */}
                <p className="text-sm text-[#171717] leading-relaxed">
                  {sub.desc}
                </p>

                {/* Technical Description */}
                <div className="p-3 bg-[#F7F7F4] border border-[#D8D8D3] text-xs font-mono text-[#6B6B6B] leading-relaxed">
                  <span className="text-[#171717] font-bold block mb-1">SPECIFICATION:</span>
                  {sub.tech}
                </div>
              </div>

              {/* Action link */}
              <div className="pt-6 mt-6 border-t border-[#D8D8D3] flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#171717]">
                <span>Explore System</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5 text-[#F04438]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
