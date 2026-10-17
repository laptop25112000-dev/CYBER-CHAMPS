import React, { useEffect, useRef } from 'react';
import { soundManager } from '../utils/audio';
import { X, Award, Shield, Terminal, Zap, Sparkles, Printer, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SquadSynergyModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    soundManager.playAccessGranted();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Draw Radar Chart
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;
      const cX = width / 2;
      const cY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      const axes = [
        { label: 'MECHANICAL CAD', val: 0.96 },
        { label: 'AVIONICS & POWER', val: 0.92 },
        { label: 'DRIVER REFLEX', val: 0.98 },
        { label: 'AUTONOMOUS CODE', val: 0.94 },
        { label: 'ARENA STRATEGY', val: 0.95 },
        { label: 'FABRICATION SPEED', val: 0.97 }
      ];

      const numSides = axes.length;
      ctx.clearRect(0, 0, width, height);

      // Draw concentric polygons
      [0.25, 0.5, 0.75, 1.0].forEach(level => {
        ctx.beginPath();
        for (let i = 0; i < numSides; i++) {
          const angle = (Math.PI * 2 / numSides) * i - Math.PI / 2;
          const x = cX + Math.cos(angle) * (radius * level);
          const y = cY + Math.sin(angle) * (radius * level);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = level === 1.0 ? '#000000' : 'rgba(0,0,0,0.18)';
        ctx.lineWidth = level === 1.0 ? 2.5 : 1.5;
        ctx.stroke();
      });

      // Draw axis spoke lines
      for (let i = 0; i < numSides; i++) {
        const angle = (Math.PI * 2 / numSides) * i - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.lineTo(cX + Math.cos(angle) * radius, cY + Math.sin(angle) * radius);
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw data polygon
      ctx.beginPath();
      axes.forEach((axis, i) => {
        const angle = (Math.PI * 2 / numSides) * i - Math.PI / 2;
        const x = cX + Math.cos(angle) * (radius * axis.val);
        const y = cY + Math.sin(angle) * (radius * axis.val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.65)'; // Neo yellow fill
      ctx.fill();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#000000';
      ctx.stroke();

      // Draw dots & labels
      axes.forEach((axis, i) => {
        const angle = (Math.PI * 2 / numSides) * i - Math.PI / 2;
        const x = cX + Math.cos(angle) * (radius * axis.val);
        const y = cY + Math.sin(angle) * (radius * axis.val);

        // Dot
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();

        // Label
        const labelX = cX + Math.cos(angle) * (radius + 28);
        const labelY = cY + Math.sin(angle) * (radius + 28);
        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${axis.label} (${Math.round(axis.val * 100)}%)`, labelX, labelY);
      });
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const handleCelebrate = () => {
    soundManager.playAccessGranted();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#000000', '#fbbf24', '#38bdf8', '#4ade80']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-[#FAF5E6] border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] overflow-hidden my-auto space-y-4 p-6 sm:p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-3 border-black pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-[#FEF08A] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <Award className="w-5 h-5 text-black" />
            </span>
            <div>
              <div className="font-mono text-[10px] font-black uppercase text-slate-800">
                TEAM CYBER CHAMPS // DELHI REGIONAL STATE LEVEL
              </div>
              <h3 className="font-['Orbitron'] text-xl sm:text-2xl font-black text-black">
                Squad Synergy Radar (9 Members)
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg border-2 border-black bg-[#FEF08A] hover:bg-[#fed7aa] text-black shadow-[2px_2px_0px_0px_#000] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border-3 border-black bg-[#FFF9EB] shadow-[4px_4px_0px_0px_#000]">
          <canvas
            ref={canvasRef}
            width={480}
            height={360}
            className="w-full max-w-[440px] h-auto"
          />
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-3 gap-3 font-mono text-center">
          <div className="p-3 rounded-xl border-2 border-black bg-[#BBF7D0] shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-bold text-slate-800 block">TOTAL MEMBERS</span>
            <span className="text-xl font-black text-black">09 MEMBERS</span>
          </div>
          <div className="p-3 rounded-xl border-2 border-black bg-[#BAE6FD] shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-bold text-slate-800 block">AVERAGE SYNERGY</span>
            <span className="text-xl font-black text-black">95.3%</span>
          </div>
          <div className="p-3 rounded-xl border-2 border-black bg-[#FEF08A] shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[10px] font-bold text-slate-800 block">STATE LEVEL STATUS</span>
            <span className="text-xl font-black text-black">DELHI READY</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-black">
          <button
            onClick={handlePrint}
            className="neo-btn px-4 py-2 rounded-xl bg-[#FFF9EB] text-black font-mono text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 hover:bg-[#FEF08A]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Squad Sheet</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCelebrate}
              className="neo-btn px-4 py-2 rounded-xl bg-[#FEF08A] text-black font-mono text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Celebrate Squad</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="neo-btn px-4 py-2 rounded-xl bg-black text-[#FAF5E6] font-mono text-xs font-bold border-2 border-black"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
