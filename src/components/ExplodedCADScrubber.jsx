import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { Play, Pause, RotateCcw, Sparkles, Layers, Sliders, ChevronRight, ZoomIn } from 'lucide-react';
import { ROBOT_EXPLODED_PARTS } from '../data/robotParts';

const TOTAL_FRAMES = 300;

export default function ExplodedCADScrubber({ onSelectPart }) {
  const canvasRef = useRef(null);
  const { activeThemeObj } = useTheme();

  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loadedCount, setLoadedCount] = useState(0);
  const [viewportBounds, setViewportBounds] = useState({
    renderX: 0,
    renderY: 0,
    renderW: 0,
    renderH: 0
  });

  const imagesRef = useRef([]);
  const frameIndexRef = useRef(0);
  frameIndexRef.current = frameIndex;

  const getFramePath = (idx) => {
    const num = String(idx + 1).padStart(3, '0');
    return `${import.meta.env.BASE_URL}car-frames/ezgif-frame-${num}.jpg`;
  };

  // Preload frames
  useEffect(() => {
    const images = new Array(TOTAL_FRAMES);
    imagesRef.current = images;
    let count = 0;

    // Load first frame immediately
    const img0 = new Image();
    img0.src = getFramePath(0);
    img0.onload = () => {
      images[0] = img0;
      count++;
      setLoadedCount(count);
      draw(0);
    };

    // Load remaining frames in small batches
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        images[i] = img;
        count++;
        setLoadedCount(count);
      };
    }
  }, []);

  const draw = (idx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = imagesRef.current[idx];
    if (!img || !img.complete) {
      // Find nearest loaded frame
      for (let offset = 1; offset < 20; offset++) {
        if (imagesRef.current[idx - offset]?.complete) {
          img = imagesRef.current[idx - offset];
          break;
        }
        if (imagesRef.current[idx + offset]?.complete) {
          img = imagesRef.current[idx + offset];
          break;
        }
      }
    }

    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    ctx.fillStyle = '#05070b';
    ctx.fillRect(0, 0, cw, ch);

    const ratio = Math.min(cw / iw, ch / ih);
    const rw = iw * ratio;
    const rh = ih * ratio;
    const rx = (cw - rw) / 2;
    const ry = (ch - rh) / 2;

    ctx.drawImage(img, rx, ry, rw, rh);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    setViewportBounds({
      renderX: rx / dpr,
      renderY: ry / dpr,
      renderW: rw / dpr,
      renderH: rh / dpr
    });
  };

  // Playback Loop
  useEffect(() => {
    let animId;
    let lastTime = performance.now();
    const fps = 30 * playbackSpeed;
    const interval = 1000 / fps;

    const loop = (now) => {
      animId = requestAnimationFrame(loop);
      if (!isPlaying) return;

      const elapsed = now - lastTime;
      if (elapsed >= interval) {
        lastTime = now - (elapsed % interval);
        setFrameIndex((prev) => {
          const next = (prev + 1) % TOTAL_FRAMES;
          draw(next);
          return next;
        });
      }
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackSpeed]);

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    setFrameIndex(idx);
    setIsPlaying(false);
    draw(idx);
  };

  const handleWheel = (e) => {
    // Scroll wheel scrubs CAD disassembly directly
    setIsPlaying(false);
    const delta = e.deltaY > 0 ? 4 : -4;
    setFrameIndex((prev) => {
      const next = Math.max(0, Math.min(TOTAL_FRAMES - 1, prev + delta));
      draw(next);
      return next;
    });
  };

  const jumpTo = (idx) => {
    soundManager.playClick();
    setFrameIndex(idx);
    draw(idx);
  };

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      draw(frameIndexRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const progressPct = Math.round((frameIndex / (TOTAL_FRAMES - 1)) * 100);
  const isExplodedPhase = frameIndex >= 120;

  return (
    <div className="relative w-full h-full rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden flex flex-col justify-between select-none bg-[#05070b]">
      {/* 1080p Canvas with Scroll Wheel Scrubbing */}
      <div 
        onWheel={handleWheel}
        className="relative w-full h-[400px] sm:h-[480px] flex items-center justify-center bg-[#05070b] cursor-ns-resize"
        title="Scroll with mouse wheel or drag slider below to scrub CAD explosion"
      >
        <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-wrap items-center gap-2">
          <div className="font-mono text-xs font-black px-3.5 py-1.5 rounded-lg border-2 border-slate-900 bg-amber-300 text-slate-950 shadow-[3px_3px_0px_0px_#000]">
            NRL BATTLE CAR // EXPLODED CAD VIEW
          </div>
          <div className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 text-slate-300 hidden sm:block">
            {progressPct}% EXPANSION
          </div>
          <div className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-black bg-[#BBF7D0] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
            SCROLL WHEEL ENABLED
          </div>
        </div>

        {/* Top Right Quick Jump Anchors */}
        <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2">
          <button
            onClick={() => jumpTo(0)}
            className={`neo-btn px-2.5 py-1 rounded-md font-mono text-[10px] font-bold ${
              frameIndex === 0 ? 'bg-cyan-300 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            ASSEMBLED
          </button>
          <button
            onClick={() => jumpTo(149)}
            className={`neo-btn px-2.5 py-1 rounded-md font-mono text-[10px] font-bold ${
              frameIndex === 149 ? 'bg-amber-300 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            AVIONICS LIFT
          </button>
          <button
            onClick={() => jumpTo(299)}
            className={`neo-btn px-2.5 py-1 rounded-md font-mono text-[10px] font-bold ${
              frameIndex === 299 ? 'bg-rose-300 text-slate-950' : 'bg-slate-900 text-slate-200'
            }`}
          >
            FULL EXPLODED
          </button>
        </div>

        {/* Hotspots on exploded parts */}
        {isExplodedPhase && viewportBounds.renderW > 0 && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {ROBOT_EXPLODED_PARTS.map((part) => {
              const pinLeft = viewportBounds.renderX + part.normalizedPos.x * viewportBounds.renderW;
              const pinTop = viewportBounds.renderY + part.normalizedPos.y * viewportBounds.renderH;

              return (
                <div
                  key={part.id}
                  style={{
                    position: 'absolute',
                    left: `${pinLeft}px`,
                    top: `${pinTop}px`,
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'auto'
                  }}
                  className="group cursor-pointer select-none"
                  onClick={() => {
                    soundManager.playModalOpen();
                    if (onSelectPart) onSelectPart(part);
                  }}
                >
                  <span 
                    className="absolute -inset-1.5 rounded-full opacity-75 animate-ping"
                    style={{ backgroundColor: part.badgeColor || '#FEF08A' }}
                  />
                  <div 
                    className="relative flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-black font-mono text-[10px] font-black shadow-[2px_2px_0px_0px_#000] hover:scale-110 transition-transform"
                    style={{ backgroundColor: part.badgeColor || '#FEF08A' }}
                  >
                    <ZoomIn className="w-3 h-3 text-black" />
                    <span className="text-black">{part.tag}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Scrub & Playback Controller Bar */}
      <div className="p-4 bg-[#FFF9EB] border-t-3 border-black space-y-3">
        {/* Timeline Range Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-black">
            <span className="flex items-center gap-1.5 text-black font-bold">
              <Sliders className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
              DRAG TIMELINE TO SCRUB CAD DISASSEMBLY
            </span>
            <span className="font-black text-black">
              {progressPct}% EXPANDED
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={TOTAL_FRAMES - 1}
            value={frameIndex}
            onChange={handleSliderChange}
            className="w-full h-3 bg-[#FAF5E6] rounded-lg appearance-none cursor-pointer accent-amber-500 border-2 border-black"
          />
        </div>

        {/* Playback Controls & Part Quick Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="neo-btn px-4 py-2 rounded-xl bg-amber-300 text-black font-mono text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_#000]"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY ANIMATION'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                jumpTo(0);
              }}
              className="neo-btn p-2 rounded-xl bg-[#FAF5E6] text-black border border-black hover:bg-[#FEF08A]"
              title="Reset to Start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Component Magnifier Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="font-mono text-[10px] font-black text-black">MAGNIFY:</span>
            {ROBOT_EXPLODED_PARTS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  soundManager.playModalOpen();
                  if (onSelectPart) onSelectPart(p);
                }}
                className="px-2 py-1 rounded-md border border-black font-mono text-[10px] font-black text-black shadow-[1px_1px_0px_0px_#000] hover:-translate-y-0.5 transition-transform"
                style={{ backgroundColor: p.badgeColor || '#FEF08A' }}
              >
                {p.tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
