import React, { useEffect, useRef, useState } from 'react';
import { tearAudio } from './TearableAudio';
import { Scissors, RotateCcw, Sparkles, Hand, Zap } from 'lucide-react';

export default function TearablePhysicsCanvas() {
  const canvasRef = useRef(null);
  const [tearCount, setTearCount] = useState(0);
  const [interactionMode, setInteractionMode] = useState('slice'); // 'slice' or 'drag'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const width = (canvas.width = canvas.parentElement.clientWidth || 700);
    const height = (canvas.height = 420);

    // Physics parameters
    const gravity = 0.25;
    const friction = 0.99;
    const tearDistance = 55;
    const spacing = 18;
    const cols = Math.floor((width - 40) / spacing);
    const rows = 16;
    const startX = (width - cols * spacing) / 2;
    const startY = 30;

    class Point {
      constructor(x, y, pinned = false) {
        this.x = x;
        this.y = y;
        this.px = x;
        this.py = y;
        this.pinned = pinned;
      }

      update() {
        if (this.pinned) return;
        const vx = (this.x - this.px) * friction;
        const vy = (this.y - this.py) * friction;
        this.px = this.x;
        this.py = this.y;
        this.x += vx;
        this.y += vy + gravity;
      }
    }

    class Constraint {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = spacing;
      }

      resolve() {
        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        const dist = Math.hypot(dx, dy);

        if (dist > tearDistance) {
          return false; // Break/Tear!
        }

        const diff = (this.length - dist) / dist;
        const offsetPercent = diff * 0.5;
        const offsetX = dx * offsetPercent;
        const offsetY = dy * offsetPercent;

        if (!this.p1.pinned) {
          this.p1.x -= offsetX;
          this.p1.y -= offsetY;
        }
        if (!this.p2.pinned) {
          this.p2.x += offsetX;
          this.p2.y += offsetY;
        }

        return true;
      }
    }

    // Build grid
    let points = [];
    let constraints = [];

    const initPhysics = () => {
      points = [];
      constraints = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
          const isPinned = r === 0 && (c % 2 === 0 || c === cols - 1);
          const p = new Point(startX + c * spacing, startY + r * spacing, isPinned);
          points[r][c] = p;

          if (c > 0) {
            constraints.push(new Constraint(points[r][c - 1], p));
          }
          if (r > 0) {
            constraints.push(new Constraint(points[r - 1][c], p));
          }
        }
      }
    };

    initPhysics();

    // Mouse Interaction Tracking
    let isMouseDown = false;
    let mouse = { x: 0, y: 0, px: 0, py: 0 };
    let dragPoint = null;

    const handlePointerDown = (e) => {
      isMouseDown = true;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.x = mouse.px = x;
      mouse.y = mouse.py = y;

      if (interactionMode === 'drag') {
        // Find nearest point
        let nearest = null;
        let minDist = 35;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = points[r][c];
            const dist = Math.hypot(p.x - x, p.y - y);
            if (dist < minDist) {
              minDist = dist;
              nearest = p;
            }
          }
        }
        dragPoint = nearest;
      }
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      if (isMouseDown && dragPoint && interactionMode === 'drag') {
        dragPoint.x = mouse.x;
        dragPoint.y = mouse.y;
      }

      if (isMouseDown && interactionMode === 'slice') {
        // Check intersections with constraints to slice
        let tornAny = false;
        constraints = constraints.filter((c) => {
          const intersects = lineIntersect(
            mouse.px, mouse.py, mouse.x, mouse.y,
            c.p1.x, c.p1.y, c.p2.x, c.p2.y
          );
          if (intersects) {
            tornAny = true;
            return false;
          }
          return true;
        });

        if (tornAny) {
          tearAudio.playTear(0.4);
          setTearCount((prev) => prev + 1);
        }
      }
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      dragPoint = null;
    };

    // Fast Line intersection helper
    function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
      const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
      if (denom === 0) return false;
      const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
      const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
      return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
    }

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Render & Physics Loop
    const loop = () => {
      animId = requestAnimationFrame(loop);

      // Physics steps
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          points[r][c].update();
        }
      }

      // Solve constraints multiple iterations for realism
      for (let iter = 0; iter < 3; iter++) {
        let broken = false;
        constraints = constraints.filter((c) => {
          const intact = c.resolve();
          if (!intact) broken = true;
          return intact;
        });
        if (broken) {
          tearAudio.playTear(0.5);
          setTearCount((prev) => prev + 1);
        }
      }

      // Draw canvas
      ctx.fillStyle = '#FAF5E6';
      ctx.fillRect(0, 0, width, height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Top Mounting Strip
      ctx.fillStyle = '#000000';
      ctx.fillRect(startX - 10, startY - 14, cols * spacing + 20, 10);
      for (let c = 0; c < cols; c += 2) {
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(startX + c * spacing, startY - 9, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Paper/Cloth Mesh
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < constraints.length; i++) {
        const c = constraints[i];
        ctx.moveTo(c.p1.x, c.p1.y);
        ctx.lineTo(c.p2.x, c.p2.y);
      }
      ctx.stroke();

      // Draw Central Stamp on Mesh
      if (points[6] && points[6][Math.floor(cols / 2)]) {
        const center = points[6][Math.floor(cols / 2)];
        ctx.font = '900 13px Orbitron, monospace';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.textAlign = 'center';
        ctx.fillText('CYBER CHAMPS // TEARABLE CANVAS', center.x, center.y);
      }

      // Slicing Trail Visualizer
      if (isMouseDown && interactionMode === 'slice') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(mouse.px, mouse.py);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [interactionMode]);

  return (
    <div className="space-y-3 select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-black text-black">TOOL MODE:</span>
          <button
            onClick={() => setInteractionMode('slice')}
            className={`px-3 py-1 rounded-lg border-2 border-black font-mono text-xs font-black flex items-center gap-1.5 transition-all ${
              interactionMode === 'slice'
                ? 'bg-rose-400 text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-[#FAF5E6] text-black hover:bg-rose-200'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>SLICE / CUT</span>
          </button>
          <button
            onClick={() => setInteractionMode('drag')}
            className={`px-3 py-1 rounded-lg border-2 border-black font-mono text-xs font-black flex items-center gap-1.5 transition-all ${
              interactionMode === 'drag'
                ? 'bg-[#FEF08A] text-black shadow-[2px_2px_0px_0px_#000]'
                : 'bg-[#FAF5E6] text-black hover:bg-amber-200'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>GRAB &amp; RIP</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-slate-800">
            TEARS TRIGGERED: <strong>{tearCount}</strong>
          </span>
          <button
            onClick={() => {
              tearAudio.playTapeStick();
              window.location.reload();
            }}
            className="px-2.5 py-1 rounded-lg border border-black bg-[#FAF5E6] hover:bg-slate-200 text-black font-mono text-xs font-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1"
            title="Reset cloth physics"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET</span>
          </button>
        </div>
      </div>

      {/* Physics Canvas Wrapper */}
      <div className="relative w-full h-[420px] rounded-2xl border-3 border-black shadow-[5px_5px_0px_0px_#000] overflow-hidden bg-[#FAF5E6] cursor-crosshair">
        <canvas ref={canvasRef} className="w-full h-full block" />
        <div className="absolute bottom-3 left-3 pointer-events-none font-mono text-[10px] font-bold text-slate-700 bg-[#FFF9EB]/90 px-3 py-1 rounded-lg border border-black">
          {interactionMode === 'slice'
            ? 'Drag mouse across fibers to slice and shred with realistic tear sounds'
            : 'Grab any point and pull beyond elastic limit to rip apart'}
        </div>
      </div>
    </div>
  );
}
