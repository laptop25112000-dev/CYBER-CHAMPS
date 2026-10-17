import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { NRL_COMPETITION_DATA } from '../data/robotData';
import { 
  Trophy, CheckCircle2, Shield, Zap, Sparkles, 
  RotateCcw, Sliders, ArrowRight, Award, Compass, Timer, Layers 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MissionContextSection() {
  // Real Game Scoring State based on Table 4.5.1
  const [highPoleCores, setHighPoleCores] = useState(3);     // 3 pts each
  const [starPoleCores, setStarPoleCores] = useState(2);     // 5 pts each
  const [goldenStarCores, setGoldenStarCores] = useState(2); // 7 pts each
  const [apexPoleCores, setApexPoleCores] = useState(1);     // 9 pts each
  const [dropZoneCores, setDropZoneCores] = useState(2);     // 1 pt each
  const [starMapComplete, setStarMapComplete] = useState(true); // 10 pts
  const [payloadScored, setPayloadScored] = useState(true);   // 10 pts bonus
  const [stationState, setStationState] = useState('balance'); // 'none', 'engage' (3), 'dock' (8), 'balance' (15)

  const calculateTotalScore = () => {
    let score = 0;
    score += highPoleCores * 3;
    score += starPoleCores * 5;
    score += goldenStarCores * 7;
    score += apexPoleCores * 9;
    score += dropZoneCores * 1;
    if (starMapComplete) score += 10;
    if (payloadScored) score += 10;
    if (stationState === 'engage') score += 3;
    else if (stationState === 'dock') score += 8;
    else if (stationState === 'balance') score += 15;
    return score;
  };

  const totalScore = calculateTotalScore();

  const handleCelebrate = () => {
    soundManager.playAccessGranted();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#245DFF', '#059669', '#F59E0B', '#7C3AED', '#E11D48']
    });
  };

  return (
    <section id="competition" className="py-20 sm:py-28 bg-white border-b border-[#E4E7EB] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E4E7EB] bg-[#F6F7F8] text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>NRL HYPERDRIVE 2026 · PRESENTED BY AMAZON</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17191C]">
            Tournament Mission &amp; Engineering Rules.
          </h2>
          <p className="text-base sm:text-lg text-[#626A73] leading-relaxed">
            Every specification of our robot is tailored to the official <strong>NRL 2026 HYPERDRIVE Game Manual</strong> and verified against strict competition scrutineering checklists.
          </p>
        </div>

        {/* 4 Match Flow Phases Cards (Section 4.4) */}
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-[#626A73] mb-4 text-center sm:text-left">
            Official 2-Minute 30-Second Match Progression
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {NRL_COMPETITION_DATA.phases.slice(1).map((phase, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#F6F7F8] border border-[#E4E7EB] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#245DFF]">{phase.duration}</span>
                  <span className="text-[#626A73] font-semibold">PHASE 0{idx + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-[#17191C]">{phase.name}</h4>
                <p className="text-xs text-[#626A73] leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Split: Official Scrutineering Checks & Live HYPERDRIVE Match Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Robot Scrutineering Verification (Section 6) */}
          <div className="lg:col-span-6 bg-[#F6F7F8] p-7 sm:p-8 rounded-3xl border border-[#E4E7EB] space-y-6 text-left">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#245DFF]">
                Official Section 6 Inspection Checklist
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#17191C] mt-1">
                Scrutineering Verification Standards
              </h3>
              <p className="text-xs sm:text-sm text-[#626A73] mt-1">
                Referees inspect all physical, electrical, and telemetry properties prior to every match trial.
              </p>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {NRL_COMPETITION_DATA.rulesCompliance.map((rule, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E4E7EB] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17191C]">{rule.rule}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#BBF7D0] text-[#065F46]">
                      VERIFIED
                    </span>
                  </div>
                  <div className="text-xs text-[#626A73]">Limit: {rule.limit}</div>
                  <div className="text-xs font-semibold text-[#245DFF]">{rule.actual}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Live Table 4.5.1 League Match Scorer */}
          <div className="lg:col-span-6 bg-white p-7 sm:p-8 rounded-3xl border border-[#E4E7EB] shadow-sm space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#245DFF]">
                  Table 4.5.1 League Match Scorer
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#17191C] mt-1">
                  HYPERDRIVE Match Calculator
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#626A73] block">Calculated Match Score</span>
                <span className="text-3xl font-extrabold text-[#17191C]">{totalScore} PTS</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* High Pole (3 pts) */}
              <div className="p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#17191C]">High Pole COREs (3 pts each)</div>
                  <div className="text-[#626A73]">130mm vertical pole · Max 4 cores</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setHighPoleCores(Math.max(0, highPoleCores - 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >-</button>
                  <span className="font-bold text-sm w-4 text-center">{highPoleCores}</span>
                  <button 
                    onClick={() => setHighPoleCores(Math.min(4, highPoleCores + 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >+</button>
                </div>
              </div>

              {/* Star Pole (5 pts) */}
              <div className="p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#17191C]">Star Pole COREs (5 pts each)</div>
                  <div className="text-[#626A73]">100mm pole · Squad specific</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setStarPoleCores(Math.max(0, starPoleCores - 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >-</button>
                  <span className="font-bold text-sm w-4 text-center">{starPoleCores}</span>
                  <button 
                    onClick={() => setStarPoleCores(Math.min(3, starPoleCores + 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >+</button>
                </div>
              </div>

              {/* Golden Vault CORE on Star Pole (7 pts) */}
              <div className="p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#17191C]">Golden CORE on Star Pole (7 pts each)</div>
                  <div className="text-[#626A73]">Unlocked in STARBURST Mode from Vault</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setGoldenStarCores(Math.max(0, goldenStarCores - 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >-</button>
                  <span className="font-bold text-sm w-4 text-center">{goldenStarCores}</span>
                  <button 
                    onClick={() => setGoldenStarCores(Math.min(6, goldenStarCores + 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >+</button>
                </div>
              </div>

              {/* Apex Pole (9 pts) */}
              <div className="p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#17191C]">Apex Pole COREs (9 pts each)</div>
                  <div className="text-[#626A73]">365mm high pole · Stationed on Space Station</div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setApexPoleCores(Math.max(0, apexPoleCores - 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >-</button>
                  <span className="font-bold text-sm w-4 text-center">{apexPoleCores}</span>
                  <button 
                    onClick={() => setApexPoleCores(Math.min(6, apexPoleCores + 1))}
                    className="w-7 h-7 rounded-lg border border-[#E4E7EB] bg-white font-bold"
                  >+</button>
                </div>
              </div>

              {/* Space Station LEVEL UP End Game */}
              <div className="p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] space-y-2">
                <div className="font-bold text-[#17191C]">Space Station Platform (LEVEL UP)</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'None (0)', pts: 0 },
                    { id: 'engage', label: 'Engage (+3)', pts: 3 },
                    { id: 'dock', label: 'Dock (+8)', pts: 8 },
                    { id: 'balance', label: 'Balance (+15)', pts: 15 }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStationState(s.id)}
                      className={`py-1.5 px-2 rounded-lg font-semibold text-[11px] transition-colors ${
                        stationState === s.id 
                          ? 'bg-[#245DFF] text-white' 
                          : 'bg-white border border-[#E4E7EB] text-[#17191C]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star Map & Payload Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={starMapComplete}
                    onChange={(e) => setStarMapComplete(e.target.checked)}
                    className="w-4 h-4 accent-[#245DFF]" 
                  />
                  <div>
                    <div className="font-bold text-[#17191C]">Star Map Bonus</div>
                    <div className="text-[10px] text-[#626A73]">+10 pts (Matches Trifron)</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-[#F6F7F8] border border-[#E4E7EB] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={payloadScored}
                    onChange={(e) => setPayloadScored(e.target.checked)}
                    className="w-4 h-4 accent-[#245DFF]" 
                  />
                  <div>
                    <div className="font-bold text-[#17191C]">Payload Squad Bonus</div>
                    <div className="text-[10px] text-[#626A73]">+10 pts &amp; Early Starburst</div>
                  </div>
                </label>
              </div>

            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#E4E7EB] flex items-center justify-between">
              <button
                onClick={() => {
                  setHighPoleCores(0);
                  setStarPoleCores(0);
                  setGoldenStarCores(0);
                  setApexPoleCores(0);
                  setDropZoneCores(0);
                  setStarMapComplete(false);
                  setPayloadScored(false);
                  setStationState('none');
                }}
                className="text-xs font-semibold text-[#626A73] hover:text-[#17191C] flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Match</span>
              </button>

              <button
                onClick={handleCelebrate}
                className="px-5 py-2.5 rounded-xl bg-[#245DFF] hover:bg-[#1b4bd8] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Victory Celebration</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
