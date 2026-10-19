import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { HOW_IT_WORKS_STEPS, ROBOT_COMPONENTS } from '../data/robotData';
import { Radio, Cpu, Zap, Trophy, ArrowRight } from 'lucide-react';

export default function HowItWorksSection({ onSelectComponent }) {
  const [activeStep, setActiveStep] = useState(0);

  const stepIcons = [
    <Radio className="w-5 h-5 text-[#245DFF]" />,
    <Cpu className="w-5 h-5 text-[#0284C7]" />,
    <Zap className="w-5 h-5 text-[#059669]" />,
    <Trophy className="w-5 h-5 text-[#7C3AED]" />
  ];

  // Visual cues for each operating stage
  const stageVisuals = [
    {
      label: "HexaLINK 2.4GHz Radio Link",
      tag: "INPUT CONTROL",
      diagram: "/onshape-robot-cad.png",
      caption: "Driver transmits steering & claw commands via the paired wireless controller."
    },
    {
      label: "HEXA Dual-Core 240MHz MCU",
      tag: "COMPUTATION & SAFETY",
      diagram: "/onshape-robot-cad.png",
      caption: "Onboard processor evaluates motor acceleration curves & safety watchdog in <5ms."
    },
    {
      label: "4WD Gearmotors & Actuators",
      tag: "PHYSICAL POWER",
      diagram: "./onshape-robot-cad.png",
      caption: "Dual H-bridge MOSFETs pulse high-amperage current to wheels and the grabber claw."
    },
    {
      label: "Poles Scored & Space Station Dock",
      tag: "ARENA EXECUTION",
      diagram: "./onshape-robot-cad.png",
      caption: "Robot scores rings on High/Star Poles and climbs the Space Station for 15 End Game pts."
    }
  ];

  const handleStepClick = (index) => {
    soundManager.playClick();
    setActiveStep(index);
  };

  const handleInspectComponent = (compId) => {
    soundManager.playClick();
    const found = ROBOT_COMPONENTS.find(c => c.id === compId);
    if (found && onSelectComponent) {
      onSelectComponent(found);
      const target = document.querySelector('#exploded-view');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const current = HOW_IT_WORKS_STEPS[activeStep];
  const visual = stageVisuals[activeStep];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-[#E4E7EB] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E7EB] bg-[#F6F7F8] text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <span>Operating Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17191C]">
            From command to action.
          </h2>
          <p className="text-base sm:text-lg text-[#626A73] leading-relaxed">
            See how the different systems work together to make the robot perform its task.
          </p>
        </div>

        {/* 4 Sequential Interactive Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.step}
                onClick={() => handleStepClick(idx)}
                className={`p-6 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-[#F6F7F8] border-[#245DFF] shadow-sm ring-1 ring-[#245DFF]'
                    : 'bg-white border-[#E4E7EB] hover:border-[#245DFF]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                      isActive ? 'bg-[#245DFF] text-white' : 'bg-[#E4E7EB] text-[#17191C]'
                    }`}>
                      {step.phase}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#626A73]">
                      STAGE {step.step}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#17191C] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#626A73] leading-relaxed">
                    {step.summary}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-[#E4E7EB] flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#E4E7EB] flex items-center justify-center">
                    {stepIcons[idx]}
                  </div>
                  <span className={`text-xs font-bold ${isActive ? 'text-[#245DFF]' : 'text-[#626A73]'}`}>
                    {isActive ? 'Active Stage' : 'Select Stage'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Visual Spotlight connecting the active stage to the robot architecture */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F6F7F8] border border-[#E4E7EB] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Stage Explanation */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#245DFF]">
              <span>Stage {current.step} · {current.phase}</span>
              <span>·</span>
              <span className="text-[#059669]">{visual.tag}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17191C]">
              {current.title}
            </h3>
            <p className="text-sm sm:text-base text-[#626A73] leading-relaxed">
              {current.details}
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleInspectComponent(current.componentId)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#245DFF] hover:bg-[#1b4bd8] text-white text-xs sm:text-sm font-semibold tracking-wide shadow-sm transition-all"
              >
                <span>Inspect Associated Component</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Connection Diagram */}
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl bg-white border border-[#E4E7EB] p-6 flex flex-col justify-center items-center text-center overflow-hidden">
            <img 
              src={visual.diagram} 
              alt={visual.label}
              className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-300"
            />
            <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#E4E7EB] text-[11px] font-semibold text-[#17191C] shadow-sm truncate">
              {visual.caption}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
