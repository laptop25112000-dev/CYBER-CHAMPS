import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { ROBOT_SYSTEMS, ROBOT_COMPONENTS } from '../data/robotData';
import { 
  Shield, Compass, Cpu, Zap, BatteryCharging, 
  CheckCircle2, ArrowRight, Layers 
} from 'lucide-react';

export default function EngineeringSystemsSection({ onSelectComponent }) {
  const [activeSystemId, setActiveSystemId] = useState('structure');

  const activeSystem = ROBOT_SYSTEMS.find(s => s.id === activeSystemId) || ROBOT_SYSTEMS[0];

  const handleComponentClick = (compId) => {
    soundManager.playClick();
    const found = ROBOT_COMPONENTS.find(c => c.id === compId);
    if (found && onSelectComponent) {
      onSelectComponent(found);
      const target = document.querySelector('#exploded-view');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="systems" className="py-20 sm:py-28 bg-[#F6F7F8] border-b border-[#E4E7EB] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E7EB] bg-white text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <span>Hardware Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17191C]">
            The engineering behind the machine.
          </h2>
          <p className="text-base sm:text-lg text-[#626A73] leading-relaxed">
            Select an engineering subsystem to see its key responsibilities, components, and relationship to the overall robot.
          </p>
        </div>

        {/* Subsystem Selection Bar */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2">
          {ROBOT_SYSTEMS.map((sys) => {
            const isActive = sys.id === activeSystemId;
            return (
              <button
                key={sys.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveSystemId(sys.id);
                }}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#245DFF] text-white border-[#245DFF] shadow-sm'
                    : 'bg-white text-[#17191C] border-[#E4E7EB] hover:border-[#245DFF]/40'
                }`}
              >
                {sys.name}
              </button>
            );
          })}
        </div>

        {/* Selected System Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-10 rounded-3xl border border-[#E4E7EB] shadow-sm">
          
          {/* Left Column: System Details & Specifications */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#245DFF] mb-1">
                {activeSystem.subtitle}
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#17191C]">
                {activeSystem.name}
              </h3>
              <p className="text-base text-[#626A73] mt-2 leading-relaxed">
                {activeSystem.shortDesc}
              </p>
            </div>

            {/* Confirmed Architectural Points */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#626A73]">
                System Engineering Highlights
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeSystem.points.map((pt, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#17191C] p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB]">
                    <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Link to Inspect Associated Components */}
            <div className="pt-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#626A73] mb-2">
                Subsystem Components:
              </div>
              <div className="flex flex-wrap gap-2">
                {activeSystem.componentIds.map((cid) => {
                  const comp = ROBOT_COMPONENTS.find(c => c.id === cid);
                  if (!comp) return null;
                  return (
                    <button
                      key={cid}
                      onClick={() => handleComponentClick(cid)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F7F8] border border-[#E4E7EB] hover:border-[#245DFF] text-xs font-semibold text-[#17191C] transition-colors"
                    >
                      <span>{comp.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#245DFF]" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Diagram / Component Overview */}
          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl bg-[#F6F7F8] border border-[#E4E7EB] p-6 flex flex-col justify-center items-center text-center">
            <img 
              src="/onshape-robot-cad.png" 
              alt="CYBER CHAMPS robot Onshape CAD architecture overview"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
            <div className="absolute bottom-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E4E7EB] text-xs font-semibold text-[#17191C]">
              Onshape CAD Subsystem Architecture
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
