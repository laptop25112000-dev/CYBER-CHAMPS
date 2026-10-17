import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { ROBOT_CAPABILITIES, ROBOT_COMPONENTS } from '../data/robotData';
import { 
  RotateCw, Gauge, Zap, Shield, Wrench, 
  ChevronRight, ArrowRight, Activity, ChevronDown 
} from 'lucide-react';

export default function CapabilitiesSection({ onSelectComponent }) {
  const [expandedTechId, setExpandedTechId] = useState(null);

  const iconMap = {
    'SCORING': <Zap className="w-5 h-5 text-[#245DFF]" />,
    'STRATEGY': <Wrench className="w-5 h-5 text-[#F59E0B]" />,
    'DRIVETRAIN': <RotateCw className="w-5 h-5 text-[#059669]" />,
    'ENDGAME': <Gauge className="w-5 h-5 text-[#7C3AED]" />,
    'TELEMETRY': <Activity className="w-5 h-5 text-[#0284C7]" />,
    'CHASSIS': <Shield className="w-5 h-5 text-[#E11D48]" />
  };

  const handleCardAction = (compKey) => {
    soundManager.playClick();
    const found = ROBOT_COMPONENTS.find(c => c.id === compKey);
    if (found && onSelectComponent) {
      onSelectComponent(found);
      const target = document.querySelector('#exploded-view');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleTechnical = (id) => {
    soundManager.playClick();
    setExpandedTechId(expandedTechId === id ? null : id);
  };

  return (
    <section id="capabilities" className="py-20 sm:py-28 bg-white border-b border-[#E4E7EB] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E7EB] bg-[#F6F7F8] text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <span>Verified Functions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17191C]">
            What can our robot do?
          </h2>
          <p className="text-base sm:text-lg text-[#626A73] leading-relaxed">
            Discover its main functions and the engineering behind each one.
          </p>
        </div>

        {/* 3-Column Grid on Desktop */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ROBOT_CAPABILITIES.map((cap) => {
            const isTechOpen = expandedTechId === cap.id;
            return (
              <div 
                key={cap.id}
                className="p-7 rounded-2xl bg-white border border-[#E4E7EB] hover:border-[#245DFF]/40 hover:shadow-md transition-all flex flex-col justify-between group text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] flex items-center justify-center transition-transform group-hover:scale-105">
                      {iconMap[cap.tag] || <Zap className="w-5 h-5 text-[#245DFF]" />}
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#626A73] px-2.5 py-1 rounded-md bg-[#F6F7F8] border border-[#E4E7EB]">
                      {cap.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#17191C] group-hover:text-[#245DFF] transition-colors">
                      {cap.title}
                    </h3>
                    <div className="text-xs font-semibold text-[#626A73] mt-0.5">
                      {cap.subtitle}
                    </div>
                  </div>

                  {/* Plain-Language 1-2 sentence explanation */}
                  <p className="text-sm text-[#626A73] leading-relaxed">
                    {cap.description}
                  </p>

                  {/* Expandable Technical Details Disclosure */}
                  <div>
                    <button
                      onClick={() => toggleTechnical(cap.id)}
                      className="text-xs font-medium text-[#626A73] hover:text-[#17191C] flex items-center gap-1 transition-colors pt-1"
                    >
                      <span>Technical Details</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isTechOpen ? 'rotate-180 text-[#245DFF]' : ''}`} />
                    </button>
                    {isTechOpen && (
                      <div className="mt-2 p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] text-xs text-[#17191C] space-y-1 animate-in fade-in duration-150">
                        {cap.id === 'core-pole-scoring' && (
                          <p>Uses an SG90 micro-servo with 2.2 kg·cm torque to clamp 95mm outer-diameter rings and stack them on 130mm vertical poles.</p>
                        )}
                        {cap.id === 'payload-cargo-bay' && (
                          <p>Dedicated rear gravity cradle strictly compliant with NRL Rule R9.4, cutting the Starburst activation threshold from 10 to 4 COREs.</p>
                        )}
                        {cap.id === 'skid-steering' && (
                          <p>Driven by four independent TT DC motors with 1:48 gearboxes, enabling zero-radius skid steering inside 26" zones.</p>
                        )}
                        {cap.id === 'space-station-level-up' && (
                          <p>Delivers 3.2 kg·cm combined stall torque to climb the 15° inclined ramp and balance horizontally during the final 30 seconds.</p>
                        )}
                        {cap.id === 'hexalink-telemetry' && (
                          <p>Official 2.4GHz FHSS HexaLINK radio with sub-5ms packet turnaround time and an onboard 0.96" OLED showing Team 100.</p>
                        )}
                        {cap.id === 'torsion-box-impact' && (
                          <p>Dual-deck 4mm polycarbonate and 6061-T6 aluminum construction with chamfered safe edges (Rule R1.3 compliant).</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Link to Exploded View Component */}
                <div className="pt-5 mt-5 border-t border-[#E4E7EB]">
                  <button
                    onClick={() => handleCardAction(cap.componentId)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#245DFF] hover:text-[#1b4bd8] transition-colors"
                  >
                    <span>See How It Works</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
