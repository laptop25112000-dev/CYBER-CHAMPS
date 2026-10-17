import React, { useState } from 'react';
import { tearAudio } from './TearableAudio';
import { Scissors, Check } from 'lucide-react';

export default function TearablePerforatedSlip({
  label,
  sublabel,
  accentColor = '#FEF08A',
  badgeText,
  onTearSlip,
  className = ''
}) {
  const [isTorn, setIsTorn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTear = () => {
    if (isTorn || isAnimating) return;
    setIsAnimating(true);
    tearAudio.playTear(0.8);

    setTimeout(() => {
      setIsTorn(true);
      setIsAnimating(false);
      if (onTearSlip) onTearSlip(label);
    }, 400);
  };

  if (isTorn) {
    return (
      <div className={`p-3 rounded-lg border-2 border-dashed border-black/40 bg-black/5 opacity-60 font-mono text-[10px] text-slate-600 flex items-center justify-between ${className}`}>
        <span className="line-through">[TORN SLIP: {label}]</span>
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-300 text-black border border-black font-black flex items-center gap-1">
          <Check className="w-2.5 h-2.5" /> CLAIMED
        </span>
      </div>
    );
  }

  return (
    <div
      onClick={handleTear}
      style={{
        transform: isAnimating ? 'translate3d(0, 45px, 0) rotate(8deg) scale(0.95)' : 'none',
        opacity: isAnimating ? 0.4 : 1,
        transition: 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 400ms ease'
      }}
      className={`group relative p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000] cursor-pointer hover:-translate-y-0.5 active:translate-y-1 transition-all select-none ${className}`}
      style={{ backgroundColor: accentColor }}
      title="Click to tear off this slip"
    >
      {/* Top Perforated Line with Scissors Icon */}
      <div className="flex items-center justify-between border-b border-dashed border-black/50 pb-1.5 mb-2 text-[9px] font-mono font-bold text-slate-800">
        <span className="flex items-center gap-1">
          <Scissors className="w-2.5 h-2.5 text-black" />
          TEAR SLIP
        </span>
        {badgeText && (
          <span className="px-1.5 py-0.2 rounded bg-black text-white font-black text-[8px]">
            {badgeText}
          </span>
        )}
      </div>

      <div className="font-['Orbitron'] text-xs font-black text-black">
        {label}
      </div>
      {sublabel && (
        <div className="font-mono text-[10px] font-medium text-slate-800 mt-0.5">
          {sublabel}
        </div>
      )}
    </div>
  );
}
