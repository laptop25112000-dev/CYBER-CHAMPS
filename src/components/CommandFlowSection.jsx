import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { ArrowDown, Radio, Cpu, Zap, RotateCw, Activity } from 'lucide-react';

export default function CommandFlowSection() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const flowStages = [
    {
      id: "driver-input",
      title: "DRIVER INPUT",
      subtitle: "Human Operator Action",
      desc: "The driver actuates the dual analog joysticks and trigger buttons on the official NRL handheld controller in the Driver Area.",
      input: "Analog thumbstick displacement (X, Y vectors) and button presses.",
      output: "Raw controller state formatted into digital control values.",
      next: "CONTROLLER RADIO"
    },
    {
      id: "controller",
      title: "CONTROLLER",
      subtitle: "Wireless Protocol Packaging",
      desc: "The handheld transmitter encodes driver inputs into encrypted packets and broadcasts them across the dedicated team radio channel.",
      input: "Raw digital gamepad states.",
      output: "2.4GHz FHSS radio packets broadcasted every 2 milliseconds.",
      next: "ROBOT CONTROL HUB"
    },
    {
      id: "robot-control-hub",
      title: "ROBOT CONTROL HUB",
      subtitle: "HEXA Dual-Core Processing",
      desc: "The onboard HEXA Command Hub parses the incoming HexaLINK packets, verifies safety watchdog bounds (Rule R8.13), and computes motor PWM curves.",
      input: "2.4GHz HexaLINK radio stream and battery voltage sense lines.",
      output: "High-speed PWM signals to onboard MOSFET H-bridges and 5V servo channels.",
      next: "MOTOR COMMANDS"
    },
    {
      id: "motor-commands",
      title: "MOTOR COMMANDS",
      subtitle: "Dual H-Bridge Power Modulation",
      desc: "The integrated motor driver channels pulse 7.4V direct-current power into the four independent DC drive motors and 5V to the SG90 claw servo.",
      input: "Logic-level PWM signals from the microcontroller.",
      output: "High-amperage current pulses (up to 3.2A peak per channel).",
      next: "MECHANICAL MOVEMENT"
    },
    {
      id: "mechanical-movement",
      title: "MECHANICAL MOVEMENT",
      subtitle: "Physical Robot Action",
      desc: "1:48 gearboxes convert high-speed motor rotation into 3.2 kg·cm torque, driving wheels across foam tiles and closing the scissor claw onto rings.",
      input: "Rotational motor shaft power.",
      output: "Forward sprint, 360° skid steering, and 2.2 kg·cm claw gripping force.",
      next: "ARENA SCORING"
    }
  ];

  const handleStageSelect = (idx) => {
    soundManager.playClick();
    setActiveStageIndex(idx);
  };

  const current = flowStages[activeStageIndex];

  return (
    <section id="flow" className="py-20 sm:py-28 border-b border-[#D8D8D3] bg-[#F7F7F4] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-left space-y-3 max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F04438] block font-bold">
            // INTERACTIVE FLOW DIAGRAM · SECTION 07
          </span>
          <h2 className="font-['Geist',sans-serif] text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#171717]">
            FROM COMMAND TO MOVEMENT.
          </h2>
          <p className="text-base sm:text-lg text-[#6B6B6B] leading-relaxed">
            Follow the real-time execution path from the driver's hands through the onboard electronics to physical mechanical action.
          </p>
        </div>

        {/* 5-Stage Interactive Flow Chain */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {flowStages.map((stage, idx) => {
            const isActive = activeStageIndex === idx;
            return (
              <div key={stage.id} className="relative flex flex-col">
                <button
                  onClick={() => handleStageSelect(idx)}
                  className={`p-5 border text-left transition-all h-full flex flex-col justify-between ${
                    isActive 
                      ? 'border-[#171717] bg-[#ECECE7] shadow-sm' 
                      : 'border-[#D8D8D3] bg-[#F7F7F4] hover:border-[#6B6B6B]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#6B6B6B]">
                      <span>STAGE 0{idx + 1}</span>
                      {isActive && <span className="w-2 h-2 bg-[#F04438]" />}
                    </div>
                    <h3 className="font-['Geist',sans-serif] text-base font-bold uppercase tracking-tight text-[#171717]">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed">
                      {stage.subtitle}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#D8D8D3] font-mono text-[10px] uppercase text-[#F04438] flex items-center gap-1 font-bold">
                    <span>{isActive ? 'ACTIVE STAGE' : 'INSPECT'}</span>
                    <span>→</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Stage Inspection Details Panel */}
        <div className="p-8 border border-[#D8D8D3] bg-[#ECECE7] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="font-mono text-xs uppercase tracking-wider text-[#F04438] font-bold">
              STAGE 0{activeStageIndex + 1} DEEP-DIVE: {current.title}
            </div>
            
            <h3 className="font-['Geist',sans-serif] text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#171717]">
              {current.subtitle}
            </h3>

            <p className="text-base text-[#171717] leading-relaxed">
              {current.desc}
            </p>

            <div className="pt-2 flex items-center gap-2 font-mono text-xs text-[#6B6B6B]">
              <span className="font-bold text-[#171717]">NEXT PIPELINE STAGE:</span>
              <span className="px-2 py-0.5 border border-[#D8D8D3] bg-[#F7F7F4] text-[#F04438] font-bold">
                {current.next}
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3 font-mono text-xs">
            <div className="p-4 border border-[#D8D8D3] bg-[#F7F7F4] space-y-1">
              <span className="text-[#6B6B6B] block text-[10px] uppercase font-bold">SIGNAL INPUT:</span>
              <p className="text-[#171717]">{current.input}</p>
            </div>

            <div className="p-4 border border-[#D8D8D3] bg-[#F7F7F4] space-y-1">
              <span className="text-[#F04438] block text-[10px] uppercase font-bold">PRODUCED OUTPUT:</span>
              <p className="text-[#171717]">{current.output}</p>
            </div>
          </div>

        </div>

        {/* Technical Architecture Disclaimer */}
        <div className="font-mono text-[11px] text-[#6B6B6B] text-left border-l-2 border-[#171717] pl-3 py-1">
          ARCHITECTURAL NOTE: This flow diagram represents the verified execution architecture of the CYBER CHAMPS robot running inside the official NRL Engine runtime (Rules R8.1/R8.2).
        </div>

      </div>
    </section>
  );
}
