import React, { useState } from 'react';
import { tearAudio } from '../TearableAudio';
import { Shield, Trophy, Users, Award, Lock, Unlock, ArrowDown, Scissors, CheckCircle2 } from 'lucide-react';

export default function CoverDossierPage({ onTearPage }) {
  const [sealTorn, setSealTorn] = useState(false);
  const [sealTearing, setSealTearing] = useState(false);

  const handleTearSeal = () => {
    if (sealTorn || sealTearing) return;
    setSealTearing(true);
    tearAudio.playTear(0.9);
    setTimeout(() => {
      setSealTorn(true);
      setSealTearing(false);
      tearAudio.playStamp();
    }, 450);
  };

  return (
    <div className="space-y-6">
      {/* Classified Header Banner */}
      <div className="relative p-6 rounded-2xl border-3 border-black bg-[#FEF08A] shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="font-mono text-[10px] font-black uppercase tracking-widest text-slate-900 px-2 py-0.5 rounded bg-black text-[#FEF08A]">
            CLASSIFIED TOURNAMENT LOG // ENTRY CC-09
          </span>
          <h1 className="font-['Orbitron'] text-3xl sm:text-5xl font-black text-black tracking-tight">
            CYBER CHAMPS
          </h1>
          <p className="font-mono text-xs font-bold text-slate-800">
            NRL 2026 DELHI REGIONAL STATE-LEVEL ROBOTICS COMPETITION
          </p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="w-14 h-14 rounded-2xl border-2 border-black bg-[#BAE6FD] shadow-[3px_3px_0px_0px_#000] flex items-center justify-center">
            <Trophy className="w-8 h-8 text-black" />
          </div>
          <span className="font-mono text-[9px] font-black text-slate-800">REGIONAL STATE CHAMPIONSHIP</span>
        </div>
      </div>

      {/* Perforated Security Seal / Unlocking Mechanism */}
      <div className="relative my-4">
        {!sealTorn ? (
          <div
            onClick={handleTearSeal}
            style={{
              transform: sealTearing ? 'translate3d(0, 30px, 0) rotate(4deg)' : 'none',
              opacity: sealTearing ? 0.4 : 1,
              transition: 'transform 450ms ease, opacity 450ms ease'
            }}
            className="group cursor-pointer p-4 rounded-xl border-3 border-black bg-rose-400 hover:bg-rose-500 shadow-[4px_4px_0px_0px_#000] flex items-center justify-between transition-all"
            title="Click to tear open the classified security seal"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-black" />
              <div>
                <div className="font-['Orbitron'] text-sm font-black text-black flex items-center gap-2">
                  <span>CONFIDENTIAL SECURITY SEAL</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white">CLICK TO TEAR OPEN</span>
                </div>
                <div className="font-mono text-[11px] font-bold text-slate-900">
                  Perforated tamper-evident barrier. Tear seal to authorize full engineering access.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 font-mono text-xs font-black text-black border-2 border-black bg-[#FFFDF5] px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_#000]">
              <Scissors className="w-3.5 h-3.5 text-rose-600" />
              <span>TEAR SEAL ✂</span>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border-2 border-dashed border-emerald-600 bg-emerald-50 text-emerald-950 font-mono text-xs font-bold flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>SECURITY SEAL BROKEN // FULL DOSSIER UNLOCKED &amp; VERIFIED</span>
            </div>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-300 text-black border border-black">
              AUTHORIZED
            </span>
          </div>
        )}
      </div>

      {/* Dossier Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[3px_3px_0px_0px_#000] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-black text-slate-700 uppercase">TEAM STRUCTURE</span>
            <Users className="w-4 h-4 text-black" />
          </div>
          <div className="font-['Orbitron'] text-2xl font-black text-black">
            09 STUDENTS
          </div>
          <p className="text-xs font-medium text-slate-800">
            Dedicated multi-disciplinary crew covering mechanics, firmware, drivetrain, and arena tactics.
          </p>
        </div>

        <div className="p-4 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[3px_3px_0px_0px_#000] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-black text-slate-700 uppercase">BATTLE MACHINE</span>
            <Shield className="w-4 h-4 text-black" />
          </div>
          <div className="font-['Orbitron'] text-2xl font-black text-black">
            4WD HYPERDRIVE
          </div>
          <p className="text-xs font-medium text-slate-800">
            Dual-deck polycarbonate chassis, 4 independent gearmotors, and SG90 servo gripper arm.
          </p>
        </div>

        <div className="p-4 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[3px_3px_0px_0px_#000] space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-black text-slate-700 uppercase">SCRUTINEERING</span>
            <Award className="w-4 h-4 text-black" />
          </div>
          <div className="font-['Orbitron'] text-2xl font-black text-black">
            100% PASSED
          </div>
          <p className="text-xs font-medium text-slate-800">
            All NRL dimensional, electrical, and mechanical regulations audited and stamped.
          </p>
        </div>
      </div>

      {/* How to Use Tearable Notebook Guide */}
      <div className="p-4 rounded-xl border-2 border-dashed border-black/40 bg-[#FAF5E6] font-mono text-xs font-bold text-slate-800 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <ArrowDown className="w-4 h-4 text-rose-600 animate-bounce" />
          <span>INSTRUCTIONS: Drag the page downward or click the red "TEAR OFF PAGE" button at top to rip this sheet and advance to Page 2!</span>
        </span>
      </div>
    </div>
  );
}
