import React from 'react';
import { ArrowUp, ExternalLink, ShieldCheck } from 'lucide-react';

export default function EditorialFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F7F7F4] border-t border-[#D8D8D3] text-[#171717] py-16">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-12">
        
        {/* Top Row: Wordmark & Back to Top */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#D8D8D3]">
          <div>
            <div className="font-mono text-xl sm:text-2xl font-black tracking-tight text-[#171717]">
              CYBER CHAMPS
            </div>
            <div className="font-mono text-[15px] text-[#595959] mt-1 font-semibold">
              TEAM #100 / NATIONAL ROBOTICS LEAGUE™ 2026
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 px-4 py-2 text-[15px] font-mono rounded-lg border border-[#D8D8D3] bg-white text-[#171717] hover:bg-[#ECECE7] transition-all font-semibold"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 text-[#F04438]" />
          </button>
        </div>

        {/* Middle Grid: The 5 Destinations + Team + Engineering Repositories + Context */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-[15px] font-mono">
          
          <div className="space-y-3">
            <span className="font-bold text-[#F04438] uppercase tracking-wider block">THE 5 DESTINATIONS</span>
            <ul className="space-y-2 text-[#595959]">
              <li><a href="#overview" className="hover:text-[#171717] transition-colors">01 / Overview</a></li>
              <li><a href="#robot" className="hover:text-[#171717] transition-colors">02 / Explore the Robot</a></li>
              <li><a href="#how-it-works" className="hover:text-[#171717] transition-colors">03 / How It Works</a></li>
              <li><a href="#gameplay" className="hover:text-[#171717] transition-colors">04 / Tournament Gameplay</a></li>
              <li><a href="#technical" className="hover:text-[#171717] transition-colors">05 / Technical Details</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-[#171717] uppercase tracking-wider block">PEOPLE & PROCESS</span>
            <ul className="space-y-2 text-[#595959]">
              <li><a href="#team" className="hover:text-[#171717] transition-colors">The 9 Student Engineers</a></li>
              <li><a href="#team" className="hover:text-[#171717] transition-colors">5-Step Engineering Workflow</a></li>
              <li><a href="#team" className="hover:text-[#171717] transition-colors">Hardware Rigging & Tuning</a></li>
              <li><a href="#team" className="hover:text-[#171717] transition-colors">NRL OpModes Programming</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-[#171717] uppercase tracking-wider block">ENGINEERING REPOSITORIES</span>
            <ul className="space-y-2 text-[#595959]">
              <li>
                <a
                  href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#171717] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Onshape 3D Assembly</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#F04438]" />
                </a>
              </li>
              <li>
                <span className="text-[#595959]">Firmware: NRL Engine OpModes</span>
              </li>
              <li>
                <span className="text-[#595959]">Radio: HexaLINK 2.4GHz FHSS</span>
              </li>
              <li>
                <span className="text-[#595959]">Brain: HEXA Hub Dual-Core 240MHz</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <span className="font-bold text-[#171717] uppercase tracking-wider block">LEAGUE & DIVISION</span>
            <p className="text-[#595959] leading-relaxed font-sans text-[15px]">
              National Robotics League™ (NRL) HYPERDRIVE Season 2026, presented by Amazon. Fabricated for the Delhi Regional State Championship.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[15px] text-[#059669] font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>100% Rules Compliant (R1.1 – R9.6)</span>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-8 border-t border-[#D8D8D3] flex flex-col sm:flex-row items-center justify-between text-[15px] font-mono text-[#595959] gap-4 font-semibold">
          <div>
            CYBER CHAMPS © 2026. ALL RIGHTS RESERVED.
          </div>
          <div>
            MINIMAL INTERFACE, MAXIMUM EXPLANATION.
          </div>
        </div>

      </div>
    </footer>
  );
}
