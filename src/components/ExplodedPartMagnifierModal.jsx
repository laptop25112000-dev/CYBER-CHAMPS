import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  X, ZoomIn, ZoomOut, Maximize2, Shield, Wrench, Users, 
  ChevronRight, Award, Zap, Sliders, CheckCircle2, RotateCw 
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/team';

export default function ExplodedPartMagnifierModal({ part, onClose, onSelectMember }) {
  const { activeThemeObj } = useTheme();
  const [zoomLevel, setZoomLevel] = useState(2.2);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showWireframe, setShowWireframe] = useState(false);
  const canvasRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        soundManager.playModalClose();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // High-Resolution Magnified Canvas Rendering
  useEffect(() => {
    if (!part) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = '/car-frames/ezgif-frame-300.jpg';

    img.onload = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || 1920;
      const ih = img.naturalHeight || 1080;

      // Clear
      ctx.fillStyle = '#05070b';
      ctx.fillRect(0, 0, cw, ch);

      // Part normalized crop box
      const crop = part.cropBox || { x: 0.35, y: 0.35, width: 0.3, height: 0.3 };
      const sourceX = crop.x * iw;
      const sourceY = crop.y * ih;
      const sourceW = crop.width * iw;
      const sourceH = crop.height * ih;

      // Apply Zoom & Pan
      const scaledW = cw * zoomLevel;
      const scaledH = ch * zoomLevel;
      const destX = (cw - scaledW) / 2 + panOffset.x;
      const destY = (ch - scaledH) / 2 + panOffset.y;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the cropped portion scaled onto the canvas
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceW, sourceH,
        destX, destY, scaledW, scaledH
      );

      // Draw subtle Neobrutalist CAD grid & crosshairs
      if (showWireframe) {
        ctx.strokeStyle = '#FEF08A';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(destX + 10, destY + 10, scaledW - 20, scaledH - 20);

        // Center crosshair
        ctx.beginPath();
        ctx.moveTo(cw / 2 - 20, ch / 2);
        ctx.lineTo(cw / 2 + 20, ch / 2);
        ctx.moveTo(cw / 2, ch / 2 - 20);
        ctx.lineTo(cw / 2, ch / 2 + 20);
        ctx.stroke();

        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#FEF08A';
        ctx.fillText(`CAD MAGNIFY: ${zoomLevel.toFixed(1)}X // ${part.tag}`, 16, 26);
      }
    };
  }, [part, zoomLevel, panOffset, showWireframe]);

  if (!part) return null;

  // Find full member objects for the team members who worked on this part
  const enrichedTeamMembers = part.teamMembers.map((tm) => {
    const full = TEAM_MEMBERS.find((m) => m.id === tm.id) || {};
    return {
      ...tm,
      ...full
    };
  });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetZoom = () => {
    soundManager.playClick();
    setZoomLevel(2.2);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl border-4 border-black shadow-[10px_10px_0px_0px_#000] bg-[#FAF5E6] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b-4 border-black bg-[#FFF9EB] shadow-[0_4px_0px_0px_#000]">
          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-1 rounded-lg border-2 border-black font-mono text-xs font-black shadow-[2px_2px_0px_0px_#000]"
              style={{ backgroundColor: part.badgeColor || '#FEF08A' }}
            >
              {part.tag}
            </span>
            <span className="font-mono text-xs font-bold text-slate-800 uppercase hidden sm:inline">
              // NRL 2026 HIGH-RES INSPECTION
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playModalClose();
              onClose();
            }}
            className="p-2 rounded-xl border-2 border-black bg-rose-300 hover:bg-rose-400 text-black shadow-[3px_3px_0px_0px_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5"
            title="Close Inspector (Esc)"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Title & Category */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-black tracking-widest text-slate-700 uppercase">
              {part.category}
            </div>
            <h2 className="font-['Orbitron'] text-2xl sm:text-4xl font-black text-black">
              {part.name}
            </h2>
            <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed max-w-3xl">
              {part.description}
            </p>
          </div>

          {/* TWO COLUMN INSPECTOR: Magnified View Left, Specs Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Interactive High-Resolution Magnifier Canvas */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between font-mono text-xs font-black text-black px-1">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4 text-black" />
                  HIGH-RESOLUTION MAGNIFIED MACRO VIEW
                </span>
                <span className="text-slate-700">DRAG TO PAN &middot; SCROLL/BUTTONS TO ZOOM</span>
              </div>

              {/* Canvas Container */}
              <div 
                className="relative w-full h-[320px] sm:h-[400px] rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden bg-[#05070b] cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <canvas 
                  ref={canvasRef} 
                  width={960} 
                  height={600} 
                  className="w-full h-full object-cover"
                />

                {/* Floating Lens / Zoom Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 pointer-events-auto bg-[#FAF5E6]/95 p-1.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setZoomLevel((prev) => Math.min(4.5, prev + 0.5));
                      }}
                      className="p-1.5 rounded-lg border border-black bg-[#FEF08A] hover:bg-[#fed7aa] text-black font-black"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-xs font-black px-2 text-black">
                      {zoomLevel.toFixed(1)}x
                    </span>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setZoomLevel((prev) => Math.max(1.0, prev - 0.5));
                      }}
                      className="p-1.5 rounded-lg border border-black bg-[#FEF08A] hover:bg-[#fed7aa] text-black font-black"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetZoom}
                      className="p-1.5 rounded-lg border border-black bg-[#FAF5E6] hover:bg-slate-200 text-black font-mono text-[10px] font-black"
                      title="Reset View"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setShowWireframe(!showWireframe);
                    }}
                    className={`pointer-events-auto px-3 py-1.5 rounded-xl border-2 border-black font-mono text-xs font-black shadow-[3px_3px_0px_0px_#000] transition-colors ${
                      showWireframe ? 'bg-cyan-300 text-black' : 'bg-[#FAF5E6] text-black hover:bg-[#FEF08A]'
                    }`}
                  >
                    {showWireframe ? 'CAD HUD: ON' : 'CAD HUD: OFF'}
                  </button>
                </div>
              </div>

              {/* Key Features Bullet Pills */}
              <div className="space-y-2 pt-2">
                <div className="font-mono text-xs font-black text-black">
                  CRITICAL ENGINEERING HIGHLIGHTS:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {part.keyFeatures.map((feat, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl border-2 border-black bg-[#FFF9EB] text-xs font-bold text-slate-900 shadow-[2px_2px_0px_0px_#000] flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Technical Specifications Sheet */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl border-3 border-black shadow-[6px_6px_0px_0px_#000] bg-[#FFF9EB] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b-2 border-black">
                  <span className="font-mono text-xs font-black flex items-center gap-1.5 text-black">
                    <Sliders className="w-4 h-4 text-black" />
                    TECHNICAL SPECIFICATIONS
                  </span>
                  <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-emerald-300 border border-black shadow-[1px_1px_0px_0px_#000]">
                    SCRUTINEERED
                  </span>
                </div>

                <div className="space-y-2.5">
                  {part.specs.map((spec, sIdx) => (
                    <div 
                      key={sIdx}
                      className="p-2.5 rounded-xl border border-black bg-[#FAF5E6] flex flex-col justify-between gap-1 text-xs font-mono"
                    >
                      <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        {spec.label}
                      </span>
                      <span className="font-black text-black text-xs leading-snug">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              WHO WORKED ON IT AND ALL (TEAM MEMBERS HIGHLIGHT)
          ======================================================== */}
          <div className="p-6 rounded-2xl border-3 sm:border-4 border-black shadow-[6px_6px_0px_0px_#000] bg-[#FFF9EB] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-black">
              <div>
                <div className="inline-flex items-center gap-2 font-mono text-xs font-black px-3 py-1 rounded-full border-2 border-black bg-amber-300 text-black shadow-[2px_2px_0px_0px_#000] mb-1">
                  <Users className="w-3.5 h-3.5" />
                  SUB-ASSEMBLY WORKFORCE
                </div>
                <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-black text-black">
                  Who Engineered This Part
                </h3>
              </div>
              <p className="font-mono text-xs font-bold text-slate-700">
                {part.teamMembers.length} Members Collaborated on this Component
              </p>
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {enrichedTeamMembers.map((member) => (
                <div 
                  key={member.id}
                  className="p-4 rounded-xl border-2 border-black bg-[#FAF5E6] shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between space-y-3 hover:-translate-y-1 transition-transform"
                >
                  <div className="space-y-2.5">
                    {/* Header with Avatar Gradient */}
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-10 h-10 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_#000] bg-gradient-to-br ${
                          member.avatarGradient || 'from-amber-400 to-orange-500'
                        } flex items-center justify-center font-['Orbitron'] text-sm font-black text-white shrink-0`}
                      >
                        {member.name ? member.name.charAt(0) : 'C'}
                      </div>
                      <div>
                        <div className="font-['Orbitron'] text-base font-black text-black">
                          {member.name}
                        </div>
                        <div className="font-mono text-[10px] font-bold text-slate-700 uppercase">
                          CYBER CHAMPS TEAM
                        </div>
                      </div>
                    </div>

                    {/* Specific Contribution to this part */}
                    <p className="text-xs font-medium text-slate-900 leading-relaxed bg-[#FFF9EB] p-2.5 rounded-lg border border-black/40">
                      "{member.contribution}"
                    </p>
                  </div>

                  {/* Button to View Full Member Profile */}
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      onSelectMember(member);
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg border-2 border-black bg-[#FEF08A] hover:bg-[#fed7aa] text-black font-mono text-[11px] font-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <span>VIEW {member.name.toUpperCase()}'S FULL PROFILE</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
