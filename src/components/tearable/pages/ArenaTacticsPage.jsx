import React from 'react';
import TearablePerforatedSlip from '../TearablePerforatedSlip';
import { Target, Trophy, Compass, ShieldAlert, Award, Play } from 'lucide-react';

export default function ArenaTacticsPage() {
  const tacticalSlips = [
    { label: 'Tactic A: Blitz Ring Grab', sub: 'Sprint to center spawn at T+0s; retrieve 2 blue rings', badge: 'OPENING', color: '#FEF08A' },
    { label: 'Tactic B: Perimeter Defense', sub: 'Angle 4mm chassis at 45° to deflect opponent ramming', badge: 'DEFENSE', color: '#BAE6FD' },
    { label: 'Tactic C: Low Goal Stacking', sub: 'Deposit 3 rings into 15-point lower scoring zone', badge: 'SCORING', color: '#BBF7D0' },
    { label: 'Tactic D: Endgame Parking', sub: 'Drive onto balanced platform in final 15s for +25 bonus', badge: 'ENDGAME', color: '#FECDD3' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-black bg-emerald-300 text-black">
            <Target className="w-3 h-3" />
            12FT × 12FT ARENA
          </div>
          <h3 className="font-['Orbitron'] text-xl font-black text-black mt-1">
            Tournament Arena Blueprint &amp; Tactics
          </h3>
        </div>
        <p className="font-mono text-xs font-bold text-slate-700 max-w-sm">
          Field routes, scoring priority zones, and state-level competition maneuvers mapped out for match day.
        </p>
      </div>

      {/* Hand-Drawn Style Arena Field Blueprint */}
      <div className="p-5 rounded-2xl border-3 border-black bg-[#FAF5E6] shadow-[4px_4px_0px_0px_#000] space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-800 border-b border-black/30 pb-2">
          <span>DELHI REGIONAL REGULATION FIELD DIAGRAM</span>
          <span className="px-2 py-0.5 rounded bg-black text-[#FEF08A] text-[10px] font-black">ARENA MAP // REV 2</span>
        </div>

        {/* 2D Field Grid Map */}
        <div className="relative w-full h-64 bg-[#FFFDF5] rounded-xl border-2 border-black p-4 flex flex-col justify-between overflow-hidden shadow-inner">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Top Opponent Zone */}
          <div className="relative z-10 flex justify-between items-center text-[10px] font-mono font-black text-rose-700">
            <span>[OPPONENT START ZONE]</span>
            <span className="px-2 py-0.5 rounded border border-rose-500 bg-rose-100">RED ALLIANCE</span>
            <span>[OPPONENT HIGH GOAL]</span>
          </div>

          {/* Center Arena Battle Ring */}
          <div className="relative z-10 mx-auto w-36 h-36 rounded-full border-2 border-dashed border-black/60 bg-amber-100/50 flex flex-col items-center justify-center p-2 text-center">
            <span className="font-['Orbitron'] text-xs font-black text-black">CENTER ARENA</span>
            <span className="font-mono text-[9px] text-slate-700 font-bold mt-1">RING SPAWN HUB (60 PTS)</span>
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping mt-1" />
          </div>

          {/* Bottom Cyber Champs Zone */}
          <div className="relative z-10 flex justify-between items-center text-[10px] font-mono font-black text-emerald-800">
            <span>[CYBER CHAMPS START TILE]</span>
            <span className="px-2 py-0.5 rounded border border-emerald-600 bg-emerald-100 font-black">
              BLUE ALLIANCE // 4WD BOT
            </span>
            <span>[LOW GOAL BUCKET]</span>
          </div>
        </div>

        {/* Strategic Target Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg border border-black bg-[#FFF9EB]">
            <div className="font-black text-black text-sm">115+ POINTS</div>
            <div className="text-[10px] text-slate-700 font-medium">Target match score projection</div>
          </div>
          <div className="p-3 rounded-lg border border-black bg-[#FFF9EB]">
            <div className="font-black text-black text-sm">&lt; 14 SECONDS</div>
            <div className="text-[10px] text-slate-700 font-medium">Autonomous cycle time to first ring</div>
          </div>
          <div className="p-3 rounded-lg border border-black bg-[#FFF9EB]">
            <div className="font-black text-black text-sm">3.4 KM/H</div>
            <div className="text-[10px] text-slate-700 font-medium">Sprint velocity down center corridor</div>
          </div>
        </div>
      </div>

      {/* Perforated Tactical Slips */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-black text-black uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-black" />
            TEARABLE MATCH MANEUVER CARDS:
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-700">
            CLICK TO TEAR &amp; ISSUE TO PIT CREW
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tacticalSlips.map((t, idx) => (
            <TearablePerforatedSlip
              key={idx}
              label={t.label}
              sublabel={t.sub}
              badgeText={t.badge}
              accentColor={t.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
