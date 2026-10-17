import React, { useState } from 'react';
import TearablePerforatedSlip from '../TearablePerforatedSlip';
import { Cpu, Zap, Radio, Shield, Gauge, Wrench, CheckCircle2 } from 'lucide-react';
import { ROBOT_EXPLODED_PARTS } from '../../../data/robotParts';

export default function RoboCarBlueprintPage() {
  const [selectedSubsystem, setSelectedSubsystem] = useState(ROBOT_EXPLODED_PARTS[0]);

  const checklistItems = [
    { label: 'Check 1: Li-Ion Power > 7.4V', sub: 'Audited with digital multimeter on XT60 leads', badge: 'CRITICAL', color: '#FEF08A' },
    { label: 'Check 2: 2.4GHz Radio Link Verified', sub: 'Zero packet loss within 100m arena perimeter', badge: 'AVIONICS', color: '#BAE6FD' },
    { label: 'Check 3: SG90 Claw Jaw Calibration', sub: 'Tested 180° sweep with tournament ring pickup', badge: 'ACTUATOR', color: '#BBF7D0' },
    { label: 'Check 4: 4WD Independent Gearboxes', sub: '200 RPM verified on optical tachometer', badge: 'DRIVETRAIN', color: '#FECDD3' },
    { label: 'Check 5: M3 Fasteners & Loctite 242', sub: 'All deck standoffs torqued to impact spec', badge: 'CHASSIS', color: '#E9D5FF' },
  ];

  return (
    <div className="space-y-6">
      {/* Blueprint Schematic Banner */}
      <div className="p-5 rounded-2xl border-3 border-black bg-[#121824] text-cyan-300 font-mono space-y-3 shadow-[5px_5px_0px_0px_#000]">
        <div className="flex items-center justify-between border-b border-cyan-800 pb-2 text-xs">
          <span className="flex items-center gap-1.5 font-black text-cyan-400">
            <Cpu className="w-4 h-4" />
            CAD BLUEPRINT // 4WD BATTLE CAR CAD REV 3.2
          </span>
          <span className="text-[10px] text-cyan-600 font-bold uppercase">
            SCALE: 1:1 // 245mm × 165mm
          </span>
        </div>

        {/* Blueprint Vector Visual */}
        <div className="relative w-full h-48 bg-[#0a0e17] rounded-xl border border-cyan-900/60 p-4 flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* Wireframe Outline Representation */}
          <div className="relative z-10 text-center space-y-1">
            <div className="font-['Orbitron'] text-xl font-black text-cyan-300 tracking-wider">
              NRL HYPERDRIVE 4WD
            </div>
            <div className="text-[11px] text-cyan-500 font-bold">
              DUAL-DECK POLYCARBONATE &middot; INDEPENDENT 4-MOTOR DIFFERENTIAL &middot; ARTICULATING GRIPPER
            </div>
            <div className="inline-block mt-2 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500 text-[10px] text-cyan-300">
              SCRUTINEERING WEIGHT: 940g &middot; CLEARANCE: 28mm &middot; VOLTAGE: 7.4V
            </div>
          </div>
        </div>
      </div>

      {/* Subsystem Selector */}
      <div className="space-y-3">
        <div className="font-mono text-xs font-black text-black uppercase">
          EXPLODE SUB-ASSEMBLY SPECS:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ROBOT_EXPLODED_PARTS.map((part) => (
            <button
              key={part.id}
              onClick={() => setSelectedSubsystem(part)}
              className={`p-2.5 rounded-xl border-2 border-black font-mono text-xs font-black text-left transition-all ${
                selectedSubsystem.id === part.id
                  ? 'bg-black text-[#FEF08A] shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#FFF9EB] text-black hover:bg-[#FEF08A]'
              }`}
            >
              <div className="text-[10px] opacity-70">{part.category}</div>
              <div className="truncate">{part.tag}</div>
            </button>
          ))}
        </div>

        {/* Selected Part Specs Table */}
        <div className="p-4 rounded-xl border-2 border-black bg-[#FAF5E6] shadow-[3px_3px_0px_0px_#000] space-y-3">
          <div className="flex items-center justify-between border-b border-black/30 pb-2">
            <span className="font-['Orbitron'] text-base font-black text-black">
              {selectedSubsystem.name}
            </span>
            <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-emerald-300 border border-black">
              INSPECTION READY
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {selectedSubsystem.specs.slice(0, 4).map((s, idx) => (
              <div key={idx} className="p-2 rounded-lg border border-black bg-[#FFF9EB]">
                <div className="text-[10px] font-bold text-slate-700 uppercase">{s.label}</div>
                <div className="font-black text-black mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tearable Pit Crew Checklist */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-black text-black flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-black" />
            TEARABLE PIT CREW PRE-MATCH CHECKLIST:
          </span>
          <span className="font-mono text-[10px] text-slate-700 font-bold">
            CLICK ANY SLIP TO TEAR OFF ON COMPLETION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {checklistItems.map((item, idx) => (
            <TearablePerforatedSlip
              key={idx}
              label={item.label}
              sublabel={item.sub}
              badgeText={item.badge}
              accentColor={item.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
