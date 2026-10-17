import React, { useState, useRef, useEffect } from 'react';
import { tearAudio } from './TearableAudio';
import { Scissors, CornerDownRight, RotateCcw, AlertTriangle } from 'lucide-react';

export default function TearablePaperPage({
  pageNumber,
  totalPages,
  title,
  subtitle,
  children,
  onTear,
  isTorn,
  isTopPage
}) {
  const pageRef = useRef(null);
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startX, setStartX] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isTearingAnimation, setIsTearingAnimation] = useState(false);
  const [flutterTransform, setFlutterTransform] = useState('');

  // Perforation hole count
  const holes = Array.from({ length: 14 });

  const handlePointerDown = (e) => {
    if (isTorn || !isTopPage || isTearingAnimation) return;
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    setStartX(clientX);
    setStartY(clientY);
    setCurrentX(clientX);
    setCurrentY(clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isTorn) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    setCurrentX(clientX);
    setCurrentY(clientY);

    const deltaY = Math.max(0, clientY - startY);
    const progress = Math.min(1.0, deltaY / 180);
    setDragProgress(progress);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragProgress >= 0.65) {
      triggerTear();
    } else {
      // Snap back
      setDragProgress(0);
    }
  };

  const triggerTear = () => {
    if (isTearingAnimation || isTorn) return;
    setIsTearingAnimation(true);
    tearAudio.playTear(1.1);

    // Realistic paper flutter drop transform
    const randomAngle = (Math.random() - 0.5) * 45;
    const randomX = (Math.random() - 0.5) * 200;
    setFlutterTransform(`translate3d(${randomX}px, 600px, 0) rotateZ(${randomAngle}deg) scale(0.92)`);

    setTimeout(() => {
      setIsTearingAnimation(false);
      setDragProgress(0);
      if (onTear) onTear(pageNumber);
    }, 550);
  };

  // If already torn, do not render or render as torn stub
  if (isTorn) {
    return (
      <div className="relative w-full mb-3 pointer-events-none select-none">
        {/* Torn Perforation Stub remaining in notebook */}
        <div className="h-10 w-full bg-[#EFE9D8] border-b-2 border-dashed border-slate-700/60 rounded-t-2xl flex items-center justify-between px-6 shadow-inner">
          <div className="flex gap-4">
            {holes.slice(0, 6).map((_, i) => (
              <span key={i} className="w-3.5 h-3.5 rounded-full bg-slate-800/80 shadow-inner" />
            ))}
          </div>
          <span className="font-mono text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
            <Scissors className="w-3 h-3 text-rose-600" />
            PAGE {pageNumber} TORN OFF // ARCHIVED
          </span>
          <div className="flex gap-4">
            {holes.slice(0, 6).map((_, i) => (
              <span key={i} className="w-3.5 h-3.5 rounded-full bg-slate-800/80 shadow-inner" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate drag displacement and rotation
  const dragTranslateY = dragProgress * 110;
  const dragRotate = (currentX - startX) * 0.05 * dragProgress;

  return (
    <div
      ref={pageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform: isTearingAnimation
          ? flutterTransform
          : isDragging
          ? `translate3d(0, ${dragTranslateY}px, 0) rotateZ(${dragRotate}deg)`
          : 'translate3d(0, 0, 0)',
        transition: isTearingAnimation
          ? 'transform 550ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease'
          : isDragging
          ? 'none'
          : 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isTearingAnimation ? 0.3 : 1
      }}
      className={`relative w-full rounded-2xl border-4 border-black bg-[#FFFDF5] shadow-[8px_8px_0px_0px_#000] select-none transition-shadow ${
        isDragging ? 'shadow-[12px_18px_0px_0px_rgba(0,0,0,0.85)] cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* ========================================================
          TOP BINDER SPIRAL / PERFORATION TEAR STRIP
      ======================================================== */}
      <div className="relative pt-4 pb-3 px-6 bg-[#EFE9D8] border-b-3 border-black rounded-t-xl flex flex-col justify-between">
        {/* Spiral Binder Ring Holes */}
        <div className="flex items-center justify-between gap-1 w-full mb-3">
          {holes.map((_, i) => (
            <div key={i} className="relative flex flex-col items-center">
              {/* Binder Wire Graphic */}
              <div className="w-2.5 h-5 rounded-full bg-gradient-to-r from-slate-400 via-slate-200 to-slate-500 border border-black shadow-[1px_1px_0px_0px_#000] -mt-6 mb-0.5 z-10" />
              {/* Perforation Punch Hole */}
              <div className="w-4 h-4 rounded-full bg-[#201D1A] border-2 border-black/40 shadow-inner" />
            </div>
          ))}
        </div>

        {/* Perforated Rip Guideline */}
        <div className="flex items-center justify-between text-slate-800 text-[10px] font-mono font-black border-t-2 border-dashed border-black/40 pt-2">
          <div className="flex items-center gap-1.5 text-black">
            <Scissors className="w-3.5 h-3.5 text-rose-600 rotate-90" />
            <span>PERFORATED TEAR LINE // GRAB &amp; PULL DOWN TO TEAR</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded border border-black bg-amber-300 text-black">
              SHEET {pageNumber} OF {totalPages}
            </span>

            {/* Quick One-Click Tear Button */}
            {isTopPage && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  triggerTear();
                }}
                className="px-2.5 py-0.5 rounded-md border border-black bg-rose-400 hover:bg-rose-500 text-black font-mono text-[10px] font-black shadow-[1.5px_1.5px_0px_0px_#000] active:translate-y-0.5 transition-transform flex items-center gap-1"
                title="Tear off this page"
              >
                <Scissors className="w-3 h-3" />
                <span>TEAR OFF PAGE</span>
              </button>
            )}
          </div>
        </div>

        {/* Visual Tear Strain Bar during active drag */}
        {isDragging && (
          <div className="w-full mt-2 h-1.5 bg-black/20 rounded-full overflow-hidden border border-black/40">
            <div
              className="h-full bg-rose-500 transition-all duration-75"
              style={{ width: `${Math.round(dragProgress * 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* ========================================================
          PAGE INTERIOR CONTENT (GRAPH PAPER / NOTEBOOK SURFACE)
      ======================================================== */}
      <div className="p-6 sm:p-8 space-y-6 relative overflow-hidden bg-[radial-gradient(#00000015_1px,transparent_1px)] [background-size:16px_16px]">
        {/* Header Block with Stamped Seal */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-black/20 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] font-black px-3 py-1 rounded-full border border-black bg-[#FEF08A] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
              <span>CYBER CHAMPS</span>
              <span>&middot;</span>
              <span>DELHI REGIONAL DOSSIER</span>
            </div>
            <h2 className="font-['Orbitron'] text-2xl sm:text-3xl font-black text-black tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-mono text-xs font-bold text-slate-700">
                // {subtitle}
              </p>
            )}
          </div>

          {/* Stamped Red Seal of Certification */}
          <div className="self-start sm:self-auto px-3 py-1.5 rounded-lg border-2 border-red-700 text-red-700 font-mono text-[10px] font-black tracking-widest uppercase rotate-[-3deg] shadow-[2px_2px_0px_0px_rgba(185,28,28,0.4)] bg-red-50/60 pointer-events-none select-none">
            [OFFICIAL NRL 2026]
          </div>
        </div>

        {/* Page Main Slot Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Page Footer Note */}
        <div className="pt-6 border-t-2 border-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[10px] text-slate-700 font-bold">
          <div>NATIONAL ROBOTICS LEAGUE // 4WD BATTLE CAR ENGINEERING LOG</div>
          <div className="flex items-center gap-1.5 text-black">
            <CornerDownRight className="w-3.5 h-3.5" />
            <span>PULL DOWN SHEET TO ADVANCE TO NEXT PAGE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
