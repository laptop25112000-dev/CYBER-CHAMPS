import React, { useState } from 'react';
import { tearAudio } from '../TearableAudio';
import { ShieldCheck, Award, CheckCircle2, AlertCircle, FileCheck, Scissors } from 'lucide-react';

export default function ScrutineeringCertificatePage() {
  const [certTorn, setCertTorn] = useState(false);
  const [certTearing, setCertTearing] = useState(false);

  const inspections = [
    { rule: 'Article 2.1: Sizing Cube', spec: 'Must fit inside 300mm × 300mm × 300mm box', measured: '245mm × 165mm × 135mm', status: 'PASSED' },
    { rule: 'Article 2.4: Total Machine Mass', spec: 'Maximum legal competition weight: 1.50 kg', measured: '0.94 kg (940 grams)', status: 'PASSED' },
    { rule: 'Article 3.2: Battery Chemistry', spec: '2S Li-Ion / LiPo (Maximum 8.4V fully charged)', measured: '7.4V Nominal (8.28V Tested)', status: 'PASSED' },
    { rule: 'Article 3.6: Emergency Cutoff', spec: 'Top-accessible mechanical master toggle switch', measured: 'Verified < 1s motor cutoff', status: 'PASSED' },
    { rule: 'Article 4.1: Gripper Extension', spec: 'Active arm extension must not exceed 150mm', measured: '82mm max extension', status: 'PASSED' },
    { rule: 'Article 5.3: Arena Flooring Safe', spec: 'Non-marking synthetic rubber tires only', measured: 'Synthetic rubber compound approved', status: 'PASSED' },
  ];

  const handleTearCert = () => {
    if (certTorn || certTearing) return;
    setCertTearing(true);
    tearAudio.playTear(1.0);
    setTimeout(() => {
      setCertTorn(true);
      setCertTearing(false);
      tearAudio.playStamp();
    }, 450);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-black bg-emerald-300 text-black">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% REGULATION COMPLIANT
          </div>
          <h3 className="font-['Orbitron'] text-xl font-black text-black mt-1">
            Hardware Scrutineering Inspection Log
          </h3>
        </div>
        <div className="px-3 py-1 rounded-lg border-2 border-black bg-[#FEF08A] font-mono text-xs font-black text-black shadow-[2px_2px_0px_0px_#000]">
          VERIFIED BY NRL OFFICIALS
        </div>
      </div>

      {/* Official Inspection Checklist Table */}
      <div className="rounded-xl border-3 border-black overflow-hidden shadow-[4px_4px_0px_0px_#000] bg-[#FFF9EB]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#FAF5E6] border-b-2 border-black font-black text-black uppercase">
            <tr>
              <th className="p-3">Rule &amp; Standard</th>
              <th className="p-3 hidden sm:table-cell">Regulation Requirement</th>
              <th className="p-3">Cyber Champs Measured</th>
              <th className="p-3 text-right">Scrutiny</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/20">
            {inspections.map((item, idx) => (
              <tr key={idx} className="hover:bg-amber-100/50 transition-colors">
                <td className="p-3 font-bold text-black">{item.rule}</td>
                <td className="p-3 text-slate-700 hidden sm:table-cell">{item.spec}</td>
                <td className="p-3 font-mono font-bold text-slate-900">{item.measured}</td>
                <td className="p-3 text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-300 text-black border border-black font-black text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tearable Official Competition Certificate */}
      <div className="pt-2">
        {!certTorn ? (
          <div
            onClick={handleTearCert}
            style={{
              transform: certTearing ? 'translate3d(0, 40px, 0) rotate(6deg)' : 'none',
              opacity: certTearing ? 0.3 : 1,
              transition: 'transform 450ms ease, opacity 450ms ease'
            }}
            className="group cursor-pointer p-6 rounded-2xl border-4 border-black bg-[#FEF08A] shadow-[6px_6px_0px_0px_#000] space-y-4 hover:-translate-y-1 transition-all select-none"
            title="Click to tear off your official certified competition pass"
          >
            {/* Top Perforation Line */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-black/50 pb-2 text-xs font-mono font-black text-black">
              <span className="flex items-center gap-1.5 text-rose-700">
                <Scissors className="w-3.5 h-3.5 text-rose-700" />
                PERFORATED CERTIFICATE // TEAR TO CLAIM PASS
              </span>
              <span className="px-2 py-0.5 rounded bg-black text-[#FEF08A] text-[10px]">
                CERTIFICATE ID: CC-NRL-2026-OK
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-['Orbitron'] text-xl font-black text-black">
                  OFFICIAL TOURNAMENT CERTIFICATION PASS
                </div>
                <div className="font-mono text-xs font-bold text-slate-800">
                  Awarded to TEAM CYBER CHAMPS &middot; 4WD Robo Car &middot; Delhi Regional State Level
                </div>
              </div>

              <div className="px-4 py-2 rounded-xl border-2 border-black bg-emerald-300 text-black font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000] shrink-0">
                TEAR CERTIFICATE ✂
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border-2 border-dashed border-black/40 bg-black/5 text-slate-700 font-mono text-xs font-bold flex items-center justify-between">
            <span className="line-through">[OFFICIAL CERTIFICATE TORN OFF &amp; ARCHIVED IN PIT FOLDER]</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-300 text-black border border-black">
              CLAIMED
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
