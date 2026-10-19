import React from 'react';
import { soundManager } from '../utils/audio';
import { Shield, Compass, Cpu, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { ROBOT_CORE_INFO } from '../data/robotData';

export default function RobotIntroduction({ onExploreComponents }) {
  const scrollTo = (id) => {
    soundManager.playClick();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="the-robot" className="py-20 sm:py-28 bg-[#F6F7F8] border-b border-[#E4E7EB] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#E4E7EB] bg-white text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <span>Essential Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17191C]">
            A closer look at our robot.
          </h2>
          <p className="text-base sm:text-lg text-[#626A73] leading-relaxed">
            Every part of our robot has a job. Explore the machine and see how its different systems work together.
          </p>
        </div>

        {/* Dominant Visual + 3 Pillar Blocks */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Visual Display */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl bg-white border border-[#E4E7EB] p-6 sm:p-8 flex items-center justify-center shadow-sm overflow-hidden group">
              <img 
                src={`${import.meta.env.BASE_URL}onshape-robot-cad.png`}
                alt="CYBER CHAMPS robot official Onshape CAD assembly"
                className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-102"
              />
              
              {/* Corner Verified Tag */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E4E7EB] text-xs text-[#17191C] font-medium shadow-sm flex items-center gap-2">
                <span className="font-bold text-[#245DFF]">NRL HYPERDRIVE 2026</span> · Sizing Verified
                <a 
                  href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-2 text-[#245DFF] hover:underline font-semibold"
                >
                  Onshape Model ↗
                </a>
              </div>
            </div>
          </div>

          {/* Three Beginner-Friendly Information Blocks */}
          <div className="lg:col-span-5 space-y-4 text-left">
            
            {/* Block 1: What it does */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E7EB] shadow-sm hover:border-[#245DFF]/40 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#245DFF]/10 text-[#245DFF] flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#17191C]">What It Does</h3>
              </div>
              <p className="text-sm text-[#626A73] leading-relaxed">
                Navigates the 12ft × 12ft tournament field, collects scoring rings (COREs) with its motorized clamp, and climbs onto the tilting Space Station platform during the final 30 seconds.
              </p>
            </div>

            {/* Block 2: How it moves */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E7EB] shadow-sm hover:border-[#245DFF]/40 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/10 text-[#059669] flex items-center justify-center font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#17191C]">How It Moves</h3>
              </div>
              <p className="text-sm text-[#626A73] leading-relaxed">
                Uses 4 independent gearmotors and all-terrain traction rubber wheels. By turning the wheels in opposite directions, it can spin on the spot with zero turning radius.
              </p>
            </div>

            {/* Block 3: How it works */}
            <div className="p-6 rounded-2xl bg-white border border-[#E4E7EB] shadow-sm hover:border-[#245DFF]/40 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#17191C]">How It Operates</h3>
              </div>
              <p className="text-sm text-[#626A73] leading-relaxed">
                The driver sends commands from a handheld controller. The central onboard computer decodes the signal in under 5 milliseconds and directs electrical power to the motors and grabber.
              </p>
            </div>

          </div>

        </div>

        {/* Verified Specifications Grid (Moved from Hero Section) */}
        <div className="mt-10 p-6 sm:p-8 bg-white rounded-2xl border border-[#E4E7EB] shadow-sm">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#626A73] mb-4 text-left">
            Core Physical &amp; Engineering Specifications
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="p-4 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB]">
              <div className="text-xs text-[#626A73]">Dimensions (L×W×H)</div>
              <div className="text-sm sm:text-base font-bold text-[#17191C] mt-1">{ROBOT_CORE_INFO.dimensions.length} × {ROBOT_CORE_INFO.dimensions.width}</div>
              <div className="text-[11px] text-[#059669] font-medium mt-0.5">Under 18" Sizing Box</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB]">
              <div className="text-xs text-[#626A73]">Match Weight</div>
              <div className="text-sm sm:text-base font-bold text-[#17191C] mt-1">{ROBOT_CORE_INFO.dimensions.mass}</div>
              <div className="text-[11px] text-[#059669] font-medium mt-0.5">8.0 kg Limit Compliant</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB]">
              <div className="text-xs text-[#626A73]">Powertrain</div>
              <div className="text-sm sm:text-base font-bold text-[#17191C] mt-1">4WD Differential</div>
              <div className="text-[11px] text-[#059669] font-medium mt-0.5">1:48 Spur Reduction</div>
            </div>
            <div className="p-4 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB]">
              <div className="text-xs text-[#626A73]">Power Source</div>
              <div className="text-sm sm:text-base font-bold text-[#17191C] mt-1">7.4V 2S Li-Ion Cell</div>
              <div className="text-[11px] text-[#059669] font-medium mt-0.5">12V Ceiling Compliant</div>
            </div>
          </div>
        </div>

        {/* Transition prompt at the bottom */}
        <div className="mt-10 text-center border-t border-[#E4E7EB] pt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border">
          <div className="text-left">
            <h4 className="text-lg font-bold text-[#17191C]">Want to see what's inside?</h4>
            <p className="text-sm text-[#626A73]">Explore the separated sub-assemblies, motors, circuits, and chassis plates.</p>
          </div>
          <button
            onClick={() => {
              if (onExploreComponents) onExploreComponents();
              else scrollTo('#exploded-view');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#245DFF] hover:bg-[#1b4bd8] text-white text-sm font-semibold tracking-wide shadow-sm transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Explore the Components</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
