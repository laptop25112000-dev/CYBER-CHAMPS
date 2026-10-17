import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { 
  Trophy, Target, Shield, CheckCircle2, RotateCcw, 
  Flag, Award, Zap, Sparkles, Plus, Minus, Info, Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NRLArenaTactics() {
  // Score Calculator State
  const [autoCross, setAutoCross] = useState(true);
  const [lowRings, setLowRings] = useState(4);
  const [midRings, setMidRings] = useState(3);
  const [highRings, setHighRings] = useState(2);
  const [endgameParked, setEndgameParked] = useState(true);

  // Scrutineering Checks State
  const [checks, setChecks] = useState({
    dimensions: true,
    weight: true,
    voltage: true,
    radio: true,
    clawSafety: true,
    acrylicShield: true
  });

  const toggleCheck = (key) => {
    soundManager.playClick();
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateTotalScore = () => {
    let score = 0;
    if (autoCross) score += 5;
    score += lowRings * 2;
    score += midRings * 5;
    score += highRings * 10;
    if (endgameParked) score += 15;
    return score;
  };

  const totalScore = calculateTotalScore();

  const handleCelebrate = () => {
    soundManager.playAccessGranted();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#000000', '#fbbf24', '#38bdf8', '#4ade80', '#fb7185']
    });
  };

  const resetScore = () => {
    soundManager.playClick();
    setAutoCross(false);
    setLowRings(0);
    setMidRings(0);
    setHighRings(0);
    setEndgameParked(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF9EB] border-3 border-black shadow-[5px_5px_0px_0px_#000]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded bg-[#FEF08A] border-2 border-black text-black">
              TOURNAMENT BLUEPRINT
            </span>
            <span className="font-mono text-xs font-bold text-slate-800">
              HYPERDRIVE TOURNAMENT ARENA SPECIFICATIONS
            </span>
          </div>
          <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-black text-black">
            Match Arena Strategy &amp; Live Scorer
          </h3>
        </div>

        <button
          onClick={handleCelebrate}
          className="neo-btn px-4 py-2.5 rounded-xl bg-[#BBF7D0] text-black font-mono text-xs font-black flex items-center gap-2 border-2 border-black shadow-[3px_3px_0px_0px_#000]"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>SIMULATE WIN PROTOCOL</span>
        </button>
      </div>

      {/* Main Grid: Interactive Arena Field & Live Point Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 2D Tactical Arena Blueprint */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#FFF9EB] border-3 border-black shadow-[5px_5px_0px_0px_#000] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-black text-black">
              <Target className="w-4 h-4" />
              <span>DELHI REGIONAL ARENA LAYOUT (12FT x 12FT)</span>
            </div>
            <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#BAE6FD] border border-black text-black">
              2 MIN MATCH
            </span>
          </div>

          {/* Tactical Schematic Canvas */}
          <div className="relative w-full aspect-[16/10] bg-[#FAF5E6] rounded-xl border-2 border-black p-4 flex flex-col justify-between overflow-hidden shadow-[3px_3px_0px_0px_#000]">
            <div className="absolute inset-0 neo-grid-dots opacity-40 pointer-events-none" />

            {/* Arena Top Quadrant */}
            <div className="flex justify-between items-center z-10">
              <div className="p-2.5 rounded-lg border-2 border-black bg-[#FECDD3] font-mono text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000]">
                RED START ZONE
                <div className="text-[9px] font-bold text-slate-700">0:00 - 0:30 AUTO</div>
              </div>

              {/* High Goal Center */}
              <div className="p-3 rounded-xl border-3 border-black bg-[#FEF08A] font-mono text-xs font-black text-black text-center shadow-[3px_3px_0px_0px_#000] animate-pulse">
                HIGH GOAL POST (+10 PTS)
                <div className="text-[10px] font-bold text-slate-800">ELEVATED PINNACLE</div>
              </div>

              <div className="p-2.5 rounded-lg border-2 border-black bg-[#BAE6FD] font-mono text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000]">
                BLUE START ZONE
                <div className="text-[9px] font-bold text-slate-700">0:00 - 0:30 AUTO</div>
              </div>
            </div>

            {/* Arena Center Battle Zone */}
            <div className="flex justify-around items-center z-10 py-4">
              <div className="p-2.5 rounded-lg border-2 border-black bg-[#FAF5E6] font-mono text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000] text-center">
                LOW PEG (+2)
                <div className="text-[9px] font-bold text-slate-600">CLUSTER A</div>
              </div>

              {/* Battle Car Representation */}
              <div className="p-3 rounded-xl border-3 border-black bg-black text-[#FEF08A] font-mono text-xs font-black text-center shadow-[4px_4px_0px_0px_#000] rotate-3 hover:rotate-0 transition-transform">
                CYBER CHAMPS 4WD
                <div className="text-[9px] font-mono text-[#BBF7D0]">CLAW ENGAGED</div>
              </div>

              <div className="p-2.5 rounded-lg border-2 border-black bg-[#FAF5E6] font-mono text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000] text-center">
                LOW PEG (+2)
                <div className="text-[9px] font-bold text-slate-600">CLUSTER B</div>
              </div>
            </div>

            {/* Arena Bottom Quadrant */}
            <div className="flex justify-between items-center z-10">
              <div className="p-2.5 rounded-lg border-2 border-black bg-[#E9D5FF] font-mono text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000]">
                MID TOWER (+5)
                <div className="text-[9px] font-bold text-slate-700">WEST CRADLE</div>
              </div>

              <div className="p-3 rounded-xl border-3 border-black bg-[#BBF7D0] font-mono text-xs font-black text-black shadow-[3px_3px_0px_0px_#000] text-center">
                ENDGAME PLATFORM (+15 PTS)
                <div className="text-[10px] font-bold text-slate-800">1:45 - 2:00 PARK</div>
              </div>

              <div className="p-2.5 rounded-lg border-2 border-black bg-[#E9D5FF] font-mono text-[11px] font-black text-black shadow-[2px_2px_0px_0px_#000]">
                MID TOWER (+5)
                <div className="text-[9px] font-bold text-slate-700">EAST CRADLE</div>
              </div>
            </div>
          </div>

          {/* Tactical Specs Footnote */}
          <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px] text-center font-bold">
            <div className="p-2 rounded-lg border-2 border-black bg-[#FAF5E6]">
              <span className="block font-black text-black">AUTONOMOUS</span>
              30 SEC
            </div>
            <div className="p-2 rounded-lg border-2 border-black bg-[#FAF5E6]">
              <span className="block font-black text-black">DRIVER CONTROL</span>
              90 SEC
            </div>
            <div className="p-2 rounded-lg border-2 border-black bg-[#FAF5E6]">
              <span className="block font-black text-black">ENDGAME LOCK</span>
              FINAL 15 SEC
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Point Calculator & Scrutineering */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Scorecard Box */}
          <div className="p-6 rounded-2xl bg-[#FFF9EB] border-3 border-black shadow-[5px_5px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-black text-black">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>PROJECTED MATCH SCORE</span>
              </div>
              <button 
                onClick={resetScore}
                className="font-mono text-[10px] font-black text-slate-600 hover:text-black underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Giant Score Display */}
            <div className="p-4 rounded-xl border-3 border-black bg-[#FEF08A] shadow-[4px_4px_0px_0px_#000] flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-black tracking-widest text-black uppercase block">
                  DELHI REGIONAL TOTAL
                </span>
                <span className="font-['Orbitron'] text-5xl font-black text-black leading-none">
                  {totalScore}
                </span>
                <span className="font-mono text-xs font-bold text-slate-800 ml-2">PTS</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] font-black px-2.5 py-1 rounded-full bg-black text-[#FEF08A] border border-black shadow-[1px_1px_0px_0px_#000] inline-block mb-1">
                  {totalScore >= 50 ? 'STATE CHAMPION GRADE' : totalScore >= 30 ? 'PLAYOFF ADVANCEMENT' : 'REGIONAL QUALIFIED'}
                </span>
                <div className="text-[10px] font-mono text-slate-800 font-bold">100% LEGAL SCORING</div>
              </div>
            </div>

            {/* Point Sliders / Steppers */}
            <div className="space-y-3 font-mono text-xs">
              {/* Auto Cross */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF5E6]">
                <span className="font-bold text-black">Autonomous Line Cross (+5)</span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setAutoCross(!autoCross);
                  }}
                  className={`px-3 py-1 rounded font-black border border-black shadow-[1px_1px_0px_0px_#000] transition-all ${
                    autoCross ? 'bg-[#BBF7D0] text-black' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {autoCross ? 'SCORED (+5)' : 'MISSED (0)'}
                </button>
              </div>

              {/* Low Peg Rings */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF5E6]">
                <div>
                  <span className="font-bold text-black block">Low Peg Rings (+2 ea)</span>
                  <span className="text-[10px] text-slate-600">{lowRings * 2} pts total</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setLowRings(Math.max(0, lowRings - 1));
                    }}
                    className="p-1 rounded border border-black bg-white hover:bg-slate-100 font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-sm w-5 text-center">{lowRings}</span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setLowRings(lowRings + 1);
                    }}
                    className="p-1 rounded border border-black bg-white hover:bg-slate-100 font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mid Goal Rings */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF5E6]">
                <div>
                  <span className="font-bold text-black block">Mid Tower Rings (+5 ea)</span>
                  <span className="text-[10px] text-slate-600">{midRings * 5} pts total</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setMidRings(Math.max(0, midRings - 1));
                    }}
                    className="p-1 rounded border border-black bg-white hover:bg-slate-100 font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-sm w-5 text-center">{midRings}</span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setMidRings(midRings + 1);
                    }}
                    className="p-1 rounded border border-black bg-white hover:bg-slate-100 font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* High Goal Rings */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF5E6]">
                <div>
                  <span className="font-bold text-black block">High Goal Rings (+10 ea)</span>
                  <span className="text-[10px] text-slate-600">{highRings * 10} pts total</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setHighRings(Math.max(0, highRings - 1));
                    }}
                    className="p-1 rounded border border-black bg-white hover:bg-slate-100 font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-black text-sm w-5 text-center">{highRings}</span>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setHighRings(highRings + 1);
                    }}
                    className="p-1 rounded border border-black bg-white hover:bg-slate-100 font-black shadow-[1px_1px_0px_0px_#000]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Endgame Platform Parked */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border-2 border-black bg-[#FAF5E6]">
                <span className="font-bold text-black">Endgame Platform Park (+15)</span>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setEndgameParked(!endgameParked);
                  }}
                  className={`px-3 py-1 rounded font-black border border-black shadow-[1px_1px_0px_0px_#000] transition-all ${
                    endgameParked ? 'bg-[#BBF7D0] text-black' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {endgameParked ? 'PARKED (+15)' : 'NO PARK (0)'}
                </button>
              </div>
            </div>
          </div>

          {/* Official Tournament Scrutineering Checklist */}
          <div className="p-5 rounded-2xl bg-[#FFF9EB] border-3 border-black shadow-[5px_5px_0px_0px_#000] space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <span className="font-mono text-xs font-black text-black flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                DELHI REGIONAL SCRUTINEERING
              </span>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#BBF7D0] border border-black text-black">
                ALL 6 CLEARED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              {Object.entries({
                dimensions: 'Max 18"x18"x18" Box',
                weight: 'Under 12 lbs Legal Limit',
                voltage: '12V Sealed Battery Cell',
                radio: '2.4GHz Direct Paring',
                clawSafety: 'Servo Limit Protection',
                acrylicShield: 'Dual Deck Impact Shield'
              }).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => toggleCheck(key)}
                  className={`p-2 rounded-lg border-2 border-black text-left flex items-center gap-1.5 transition-all shadow-[1.5px_1.5px_0px_0px_#000] ${
                    checks[key] ? 'bg-[#BBF7D0] text-black font-black' : 'bg-[#FAF5E6] text-slate-500'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${checks[key] ? 'text-black' : 'text-slate-400'}`} />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
