import React from 'react';
import { soundManager } from '../utils/audio';
import { ArrowRight, ShieldCheck, Cpu, Zap, Compass } from 'lucide-react';

export default function EditorialHero({ onExploreRobot, onSeeHowItWorks }) {
  const handleScroll = (id) => {
    soundManager.playClick();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="overview" className="pt-24 sm:pt-32 pb-20 sm:pb-28 bg-[#F7F7F4] border-b border-[#D8D8D3] scroll-mt-16 overflow-hidden">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-16">
        
        {/* Top Technical Metadata Bar (Stretching across widescreen) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D8D8D3] font-mono text-[15px] sm:text-base text-[#595959] text-left">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#F04438]" />
            <span className="font-bold text-[#171717]">NATIONAL ROBOTICS LEAGUE · HYPERDRIVE 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-medium">DELHI REGIONAL CHAMPIONSHIP</span>
            <span className="hidden sm:inline font-medium">ROBOT IDENTIFIER: #100</span>
            <span className="hidden md:inline font-bold text-[#059669]">RULES COMPLIANT</span>
          </div>
        </div>

        {/* 1. The Clean Asymmetric Hero (Filling Widescreen Width) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left Column: Headline, Purpose, 2 Actions */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 sm:space-y-8 text-left">
            
            <div className="space-y-4">
              <span className="font-mono text-[15px] uppercase tracking-widest text-[#F04438] block font-bold">
                OFFICIAL COMPETITION SHOWCASE · TEAM 100
              </span>
              
              <h1 className="font-['Geist',sans-serif] text-4xl sm:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold tracking-tight text-[#171717] uppercase leading-[0.98]">
                ENGINEERED<br />
                TO MOVE.<br />
                <span className="text-[#595959]">BUILT TO COMPETE.</span>
              </h1>
            </div>

            {/* Clear 18-20px Body Paragraph */}
            <p className="text-lg sm:text-xl xl:text-2xl text-[#595959] leading-relaxed font-normal max-w-2xl">
              Meet the CYBER CHAMPS competition robot. A 4-wheel drive machine engineered by high school students to collect and thread scoring rings, transport team payload cubes, and conquer arena obstacles in the 2026 Delhi Regional Championship.
            </p>

            {/* Exactly Two Primary Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  if (onExploreRobot) onExploreRobot();
                  else handleScroll('#robot');
                }}
                className="px-8 py-4 bg-[#171717] text-[#F7F7F4] hover:bg-[#F04438] font-mono text-[15px] sm:text-base uppercase tracking-wider font-semibold transition-all rounded-sm flex items-center gap-2 shadow-sm"
              >
                <span>Explore the Robot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (onSeeHowItWorks) onSeeHowItWorks();
                  else handleScroll('#how-it-works');
                }}
                className="px-8 py-4 border border-[#D8D8D3] bg-[#ECECE7] text-[#171717] hover:border-[#171717] font-mono text-[15px] sm:text-base uppercase tracking-wider font-semibold transition-all rounded-sm"
              >
                Understand How It Works
              </button>
            </div>

            {/* Verified Quick Telemetry Strip - Larger, High-Legibility Font */}
            <div className="pt-8 border-t border-[#D8D8D3] grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono">
              <div>
                <span className="text-[15px] text-[#595959] uppercase font-semibold tracking-wider block mb-1.5">
                  CONFIGURATION
                </span>
                <span className="text-base sm:text-lg xl:text-xl font-bold text-[#171717] tracking-tight">
                  4WD SKID-STEER
                </span>
              </div>
              <div>
                <span className="text-[15px] text-[#595959] uppercase font-semibold tracking-wider block mb-1.5">
                  MATCH MASS
                </span>
                <span className="text-base sm:text-lg xl:text-xl font-bold text-[#171717] tracking-tight">
                  1,280 GRAMS
                </span>
              </div>
              <div>
                <span className="text-[15px] text-[#595959] uppercase font-semibold tracking-wider block mb-1.5">
                  FOOTPRINT
                </span>
                <span className="text-base sm:text-lg xl:text-xl font-bold text-[#171717] tracking-tight">
                  245 × 165 MM
                </span>
              </div>
              <div>
                <span className="text-[15px] text-[#595959] uppercase font-semibold tracking-wider block mb-1.5">
                  RADIO LINK
                </span>
                <span className="text-base sm:text-lg xl:text-xl font-bold text-[#171717] tracking-tight">
                  2.4GHz FHSS
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Actual Robot Visual (Expansive Studio Panel) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative aspect-[16/11] xl:aspect-[16/10] max-h-[620px] w-full border border-[#D8D8D3] bg-[#ECECE7] p-6 sm:p-10 xl:p-12 flex items-center justify-center rounded-2xl overflow-hidden group shadow-sm">
              <img 
                src={`${import.meta.env.BASE_URL}onshape-robot-cad.png`}
                alt="CYBER CHAMPS competition robot actual Onshape CAD model" 
                className="w-full h-full object-contain filter drop-shadow-md transition-transform duration-500 group-hover:scale-102"
              />

              <div className="absolute top-4 left-4 bg-[#F7F7F4]/95 border border-[#D8D8D3] px-3.5 py-1.5 font-mono text-[15px] uppercase tracking-wider text-[#171717] shadow-sm font-semibold">
                ONSHAPE CAD ASSEMBLY · TEAM #100
              </div>

              <div className="absolute bottom-4 right-4 bg-[#F7F7F4]/95 border border-[#D8D8D3] px-3.5 py-1.5 font-mono text-[15px] text-[#595959] shadow-sm hidden sm:block font-semibold">
                SCALE: 1:1 TOURNAMENT RIG
              </div>
            </div>
          </div>

        </div>

        {/* 2. Overview: What is CYBER CHAMPS and What does the robot do? */}
        <div className="pt-16 border-t border-[#D8D8D3] space-y-12 text-left">
          <div className="max-w-4xl space-y-3">
            <span className="font-mono text-[15px] uppercase tracking-widest text-[#F04438] font-bold">
              01 / OVERVIEW
            </span>
            <h2 className="text-2xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-[#171717]">
              Built for high-contact tournament robotics.
            </h2>
            <p className="text-base sm:text-lg xl:text-xl text-[#595959] leading-relaxed">
              Every match in NRL HYPERDRIVE lasts just 2 minutes and 30 seconds. To win, our robot must rapidly collect 95mm ring elements, deposit custom payload cubes, and balance on a central platform while resisting high-speed arena collisions.
            </p>
          </div>

          {/* 3 Core Roles - Stretching across full width */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12 pt-4">
            <div className="p-6 rounded-2xl bg-white border border-[#D8D8D3] space-y-3 shadow-sm">
              <div className="font-mono text-[15px] font-bold text-[#F04438]">01 · AGILITY & TRACTION</div>
              <h3 className="text-xl font-bold text-[#171717]">Agile 4WD Skid-Steering</h3>
              <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                Four independent DC gearmotors drive knobby rubber wheels to deliver zero-radius spot turns and rapid sprint acceleration across 20mm soft-foam arena tiles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D8D8D3] space-y-3 shadow-sm">
              <div className="font-mono text-[15px] font-bold text-[#F04438]">02 · RING MANIPULATION</div>
              <h3 className="text-xl font-bold text-[#171717]">Articulated Scissor Claw</h3>
              <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                A servo-driven dual-scissor mechanism clamps 95mm outer-diameter ring elements and threads them securely over vertical High Poles and Star Poles without slipping.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#D8D8D3] space-y-3 shadow-sm">
              <div className="font-mono text-[15px] font-bold text-[#F04438]">03 · PAYLOAD DELIVERY</div>
              <h3 className="text-xl font-bold text-[#171717]">Independent Cargo Bay</h3>
              <p className="text-base sm:text-[17px] text-[#595959] leading-relaxed">
                A dedicated rear gravity cradle transports our 3" team cube into the Drop Zone. Scoring it cuts the Starburst unlock requirement from 10 down to 4 rings.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
