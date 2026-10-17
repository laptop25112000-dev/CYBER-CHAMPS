import React from 'react';
import TearablePhysicsCanvas from '../TearablePhysicsCanvas';
import { Sparkles, Scissors, Layers, Zap } from 'lucide-react';

export default function TearableLabPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black px-2.5 py-0.5 rounded-full border border-black bg-[#FEF08A] text-black">
            <Sparkles className="w-3 h-3" />
            INTERACTIVE PHYSICS LAB
          </div>
          <h3 className="font-['Orbitron'] text-xl font-black text-black mt-1">
            Real-Time Tearable Canvas Sandbox
          </h3>
        </div>
        <p className="font-mono text-xs font-bold text-slate-700 max-w-sm">
          Slice with cursor or grab and pull beyond the elastic threshold to physically shred the particle-spring cloth!
        </p>
      </div>

      {/* Physics Canvas */}
      <TearablePhysicsCanvas />

      {/* Physics Engine Specs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[2px_2px_0px_0px_#000]">
          <div className="font-black text-black">VERLET INTEGRATION</div>
          <div className="text-[10px] text-slate-700 font-medium mt-0.5">3-iteration constraint solver</div>
        </div>
        <div className="p-3 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[2px_2px_0px_0px_#000]">
          <div className="font-black text-black">DYNAMIC FIBER TEARING</div>
          <div className="text-[10px] text-slate-700 font-medium mt-0.5">Breaks at &gt;55px elastic strain</div>
        </div>
        <div className="p-3 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[2px_2px_0px_0px_#000]">
          <div className="font-black text-black">SYNTHESIZED AUDIO RIP</div>
          <div className="text-[10px] text-slate-700 font-medium mt-0.5">Frequency-modulated noise bursts</div>
        </div>
      </div>
    </div>
  );
}
