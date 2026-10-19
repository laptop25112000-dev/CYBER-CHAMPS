import React from 'react';
import { soundManager } from '../utils/audio';
import { ChevronRight, ArrowDown, Layers, Shield } from 'lucide-react';

export default function HeroSection({ onExploreRobot, onSeeHowItWorks }) {
  const scrollTo = (id) => {
    soundManager.playClick();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 overflow-hidden bg-white border-b border-[#E4E7EB]">
      {/* Subtle ambient gradient mesh in the background */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#245DFF]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Brand & Hero Story */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E4E7EB] bg-[#F6F7F8] text-[#17191C] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#245DFF] animate-pulse" />
              <span>CYBER CHAMPS · NRL ROBOTICS</span>
            </div>

            {/* Main Heading - Generous line-height so accents are never clipped */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#17191C] leading-[1.25] sm:leading-[1.2] pb-1">
              Built to move.<br />
              <span className="text-[#245DFF]">Designed to compete.</span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-[#626A73] leading-relaxed max-w-xl font-normal">
              Meet the physical battle rover built by CYBER CHAMPS. Explore its design, understand its functions, and discover how its parts work together.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => {
                  if (onExploreRobot) onExploreRobot();
                  else scrollTo('#the-robot');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#245DFF] hover:bg-[#1b4bd8] text-white text-sm font-semibold tracking-wide shadow-sm hover:shadow transition-all active:scale-[0.98]"
              >
                <span>Explore the Robot</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (onSeeHowItWorks) onSeeHowItWorks();
                  else scrollTo('#how-it-works');
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-[#F6F7F8] border border-[#E4E7EB] text-[#17191C] text-sm font-semibold tracking-wide transition-all active:scale-[0.98]"
              >
                <span>See How It Works</span>
              </button>
            </div>
          </div>

          {/* Right Column: Physical Robot Presentation (Dominant visual) */}
          <div className="lg:col-span-6 relative flex flex-col items-center">
            {/* Robot Container with soft studio background */}
            <div className="relative w-full max-w-lg lg:max-w-none aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#F6F7F8] to-[#FFFFFF] border border-[#E4E7EB] shadow-sm flex items-center justify-center p-6 sm:p-8 overflow-hidden group">
              
              {/* Actual Robot Photograph & Official Onshape CAD Model */}
              <img 
                src={`${import.meta.env.BASE_URL}onshape-robot-cad.png`}
                alt="CYBER CHAMPS 4WD Battle Rover official CAD assembly" 
                className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
              />

              {/* Floating Verified Onshape CAD Tag */}
              <a
                href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E4E7EB] text-[11px] font-semibold text-[#17191C] shadow-sm hover:border-[#245DFF] hover:text-[#245DFF] transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-[#245DFF]" />
                <span>Onshape CAD: NRL-2026 Robot ↗</span>
              </a>

              {/* Quick Jump to Exploded View */}
              <button
                onClick={() => scrollTo('#exploded-view')}
                className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E4E7EB] text-xs font-semibold text-[#245DFF] hover:bg-[#245DFF] hover:text-white transition-all shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>See Exploded View</span>
              </button>
            </div>

            {/* Soft Studio Floor Reflection */}
            <div className="w-3/4 h-3 bg-gradient-to-r from-transparent via-[#17191C]/8 to-transparent rounded-full blur-sm mt-2" />
          </div>

        </div>
      </div>
    </section>
  );
}
