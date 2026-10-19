import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { Trophy, Zap, Users, ArrowDown, Sparkles, Play, Pause, Layers, ZoomIn, Eye } from 'lucide-react';
import { ROBOT_EXPLODED_PARTS } from '../data/robotParts';

const TOTAL_FRAMES = 300;

// Cues table: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in 0..1 relative stage progress
const CUES = [
  [0.00, 0.00, 0.22, 0.30],
  [0.32, 0.40, 0.58, 0.66],
  [0.68, 0.76, 0.96, 1.05]
];
const DRIFT = 22; // px travel

export default function ScrollScrubbedStage({ onSelectPart, onSelectMember }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const panelsRef = useRef([]);
  const meterRef = useRef(null);
  const bootBarRef = useRef(null);
  const bootPctRef = useRef(null);

  const { activeThemeObj } = useTheme();
  const [bootDone, setBootDone] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [stageProgress, setStageProgress] = useState(0);
  const [viewportBounds, setViewportBounds] = useState({
    renderX: 0,
    renderY: 0,
    renderW: 0,
    renderH: 0,
    cw: 0,
    ch: 0
  });

  // Cached Image elements
  const imagesRef = useRef([]);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let animId;
    let targetProgress = 0;
    let currentProgress = 0;
    let autoPlayProgress = 0;
    let autoPlaySpeed = 0.0014;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentProgress);
    };

    // Preload image sequence
    const images = new Array(TOTAL_FRAMES);
    imagesRef.current = images;

    const getFramePath = (idx) => {
      const num = String(idx + 1).padStart(3, '0');
      return `${import.meta.env.BASE_URL}car-frames/ezgif-frame-${num}.jpg`;
    };

    // Draw frame to canvas preserving 16:9 aspect ratio (contain)
    const drawFrame = (prog) => {
      if (!ctx) return;
      const fIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(prog * (TOTAL_FRAMES - 1))));

      let img = images[fIdx];
      // If requested frame isn't loaded yet, find nearest loaded frame
      if (!img || !img.complete) {
        for (let offset = 1; offset < 25; offset++) {
          if (images[fIdx - offset]?.complete) {
            img = images[fIdx - offset];
            break;
          }
          if (images[fIdx + offset]?.complete) {
            img = images[fIdx + offset];
            break;
          }
        }
      }

      if (!img || !img.complete) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || 1920;
      const ih = img.naturalHeight || 1080;

      // Fill dark studio background
      ctx.fillStyle = '#05070b';
      ctx.fillRect(0, 0, cw, ch);

      // Fit contain
      const hRatio = cw / iw;
      const vRatio = ch / ih;
      const ratio = Math.min(hRatio, vRatio);

      const renderW = iw * ratio;
      const renderH = ih * ratio;
      const renderX = (cw - renderW) / 2;
      const renderY = (ch - renderH) / 2;

      ctx.drawImage(img, renderX, renderY, renderW, renderH);

      // Update screen bounds for hotspot pin placement
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      setViewportBounds({
        renderX: renderX / dpr,
        renderY: renderY / dpr,
        renderW: renderW / dpr,
        renderH: renderH / dpr,
        cw: cw / dpr,
        ch: ch / dpr
      });
    };

    // Load Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      loadedCountRef.current++;
      drawFrame(0);
    };

    // Progressive Chunked Preloading
    const preloadQueue = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      preloadQueue.push(i);
    }

    let activeWorkers = 0;
    const MAX_CONCURRENT = 8;

    const nextImage = () => {
      if (preloadQueue.length === 0) return;
      if (activeWorkers >= MAX_CONCURRENT) return;

      activeWorkers++;
      const idx = preloadQueue.shift();
      const img = new Image();
      img.src = getFramePath(idx);

      img.onload = () => {
        images[idx] = img;
        loadedCountRef.current++;
        activeWorkers--;

        const pct = loadedCountRef.current / TOTAL_FRAMES;
        if (bootBarRef.current) bootBarRef.current.style.transform = `scaleX(${pct})`;
        if (bootPctRef.current) bootPctRef.current.textContent = `LOADING ${Math.round(pct * 100)}%`;

        if (loadedCountRef.current >= 30 && !bootDone) {
          setBootDone(true);
        }

        nextImage();
      };

      img.onerror = () => {
        activeWorkers--;
        nextImage();
      };

      nextImage();
    };

    for (let k = 0; k < MAX_CONCURRENT; k++) {
      nextImage();
    }

    // Scroll reading logic
    function clamp(v, a, b) {
      return Math.max(a, Math.min(b, v));
    }
    function smooth(t) {
      return t * t * (3 - 2 * t);
    }
    function ramp(p, a, b) {
      if (b <= a) return p >= b ? 1 : 0;
      return smooth(clamp((p - a) / (b - a), 0, 1));
    }

    const readScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalDist = container.offsetHeight - window.innerHeight;
      if (totalDist > 0) {
        const scrolled = -rect.top;
        targetProgress = clamp(scrolled / totalDist, 0, 1);
      } else {
        targetProgress = 0;
      }

      // Hairline meter for whole page
      const pageMax = document.documentElement.scrollHeight - window.innerHeight;
      const pageProg = pageMax > 0 ? clamp(window.pageYOffset / pageMax, 0, 1) : 0;
      if (meterRef.current) {
        meterRef.current.style.transform = `scaleX(${pageProg})`;
      }
    };

    const paintPanels = () => {
      panelsRef.current.forEach((el, i) => {
        if (!el) return;
        const c = CUES[i];
        const enter = ramp(currentProgress, c[0], c[1]);
        const leave = ramp(currentProgress, c[2], c[3]);
        const o = enter * (1 - leave);
        const y = (1 - enter) * DRIFT - leave * DRIFT;
        el.style.opacity = o;
        el.style.transform = `translate3d(0, ${y}px, 0)`;
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
      });
    };

    // Animation Render Loop
    const frameLoop = () => {
      animId = requestAnimationFrame(frameLoop);

      if (isAutoPlaying) {
        autoPlayProgress += autoPlaySpeed;
        if (autoPlayProgress > 1.0) autoPlayProgress = 0;
        currentProgress += (autoPlayProgress - currentProgress) * 0.10;
      } else {
        currentProgress += (targetProgress - currentProgress) * 0.085;
      }

      setStageProgress(currentProgress);
      drawFrame(currentProgress);
      paintPanels();
    };

    window.addEventListener('scroll', readScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    readScroll();
    frameLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', readScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isAutoPlaying, bootDone]);

  // Is the car exploded enough to show interactive part hotspots?
  const isExplodedPhase = stageProgress >= 0.38;
  const currentFrameNum = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(stageProgress * (TOTAL_FRAMES - 1)) + 1));

  return (
    <div ref={containerRef} className="relative w-full h-[380vh] bg-[#05070b]">
      {/* Hairline Scroll Progress Meter */}
      <i ref={meterRef} className="meter bg-amber-400" />

      {/* Boot Preloader */}
      <div className={`boot ${bootDone ? 'done' : ''}`}>
        <div className="bar">
          <i ref={bootBarRef} />
        </div>
        <p ref={bootPctRef}>LOADING 0%</p>
      </div>

      {/* Sticky Stage Area */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden z-10 bg-[#05070b]">
        {/* Full-Screen Image Sequence Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />

        {/* Ambient Subtle Vignette Overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070b]/90 via-transparent to-[#05070b]/80" />
        <div className="stage-grain pointer-events-none opacity-20" />

        {/* Top Floating Competition Badge */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-1.5 text-center">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-black px-4 py-1.5 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] bg-amber-300 text-slate-950">
            <Trophy className="w-3.5 h-3.5 text-slate-950" />
            <span>NRL 2026 // DELHI REGIONAL STATE LEVEL</span>
          </div>
        </div>

        {/* ========================================================
            INTERACTIVE CLICKABLE HOTSPOT PINS ON EXPLODED CAR
        ======================================================== */}
        {isExplodedPhase && viewportBounds.renderW > 0 && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {ROBOT_EXPLODED_PARTS.map((part) => {
              // Calculate screen coordinates
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
                  {/* Pulsing Beacon Ring */}
                  <span 
                    className="absolute -inset-2 rounded-full opacity-75 animate-ping"
                    style={{ backgroundColor: part.badgeColor || '#FEF08A' }}
                  />

                  {/* Hotspot Button Tag */}
                  <div 
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black font-mono text-[11px] font-black shadow-[3px_3px_0px_0px_#000] transition-all group-hover:scale-110 group-hover:shadow-[5px_5px_0px_0px_#000]"
                    style={{ backgroundColor: part.badgeColor || '#FEF08A' }}
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                    <span className="text-black font-black whitespace-nowrap">{part.tag}</span>
                    <span className="w-2 h-2 rounded-full bg-black ml-0.5" />
                  </div>

                  {/* Hover Tooltip Card */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex flex-col items-center w-56 p-2.5 rounded-xl border-2 border-black bg-[#FAF5E6] text-black shadow-[4px_4px_0px_0px_#000] z-30 pointer-events-none text-left">
                    <span className="font-['Orbitron'] text-xs font-black text-black">
                      {part.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-700 font-bold mt-1">
                      Click to inspect magnified specs &amp; team contributors
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Three Cross-Fading Text Panels */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Panel 1 */}
          <section
            ref={(el) => (panelsRef.current[0] = el)}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 will-change-[opacity,transform]"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-400 uppercase mb-4">
              <span>CYBER CHAMPS</span>
              <span>&middot;</span>
              <span>DELHI REGIONAL 2026</span>
            </div>
            <h1 className="font-['Orbitron'] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none max-w-4xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Built at four.<br />Out to conquer.
            </h1>
            <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-xl font-medium font-sans leading-relaxed drop-shadow-sm">
              9 students, one custom 4WD battle robo car, and an arena trial that begins at dawn.
            </p>
            <div className="mt-8 flex items-center gap-3 pointer-events-auto">
              <a
                href="#nrl-car"
                onClick={() => soundManager.playClick()}
                className="neo-btn px-6 py-3 rounded-full bg-amber-300 text-slate-950 font-mono text-xs font-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>Inspect 3D Robo Car</span>
              </a>
            </div>
          </section>

          {/* Panel 2 */}
          <section
            ref={(el) => (panelsRef.current[1] = el)}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 will-change-[opacity,transform]"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase mb-4">
              <span>EXPLODED MECHANICAL DISASSEMBLY</span>
              <span>&middot;</span>
              <span>SCROLL-SCRUBBED CAD</span>
            </div>
            <h1 className="font-['Orbitron'] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none max-w-4xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Every screw.<br />Every circuit.
            </h1>
            <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-xl font-medium font-sans leading-relaxed drop-shadow-sm">
              Scroll down to watch the 300-frame mechanical explosion, then click any component to magnify in high-res with full specs and team contributors.
            </p>
            <div className="mt-8 flex items-center gap-3 pointer-events-auto">
              <button
                onClick={() => {
                  soundManager.playModalOpen();
                  if (onSelectPart) onSelectPart(ROBOT_EXPLODED_PARTS[0]);
                }}
                className="neo-btn px-6 py-3 rounded-full bg-cyan-300 text-slate-950 font-mono text-xs font-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-2"
              >
                <ZoomIn className="w-4 h-4 text-slate-950" />
                <span>Magnify First Component</span>
              </button>
            </div>
          </section>

          {/* Panel 3: Final Exploded CAD Stage leading to CAD Design Panel */}
          <section
            ref={(el) => (panelsRef.current[2] = el)}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 will-change-[opacity,transform]"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-400 uppercase mb-4">
              <span>EXPLODED CAD ASSEMBLY</span>
              <span>&middot;</span>
              <span>300-FRAME DISASSEMBLY</span>
            </div>
            <h1 className="font-['Orbitron'] font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none max-w-4xl text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
              Precision-cut.<br />Battle-proven.
            </h1>
            <p className="mt-5 text-sm sm:text-lg text-slate-300 max-w-xl font-medium font-sans leading-relaxed drop-shadow-sm">
              Click any separated component pin above or pill below to magnify in high-res with full specs and team contributors, then scroll directly into our CAD Design Suite.
            </p>
            <div className="mt-8 flex items-center gap-3 pointer-events-auto">
              <a
                href="#nrl-car"
                onClick={() => soundManager.playClick()}
                className="neo-btn px-6 py-3 rounded-full bg-amber-300 text-slate-950 font-mono text-xs font-black shadow-[4px_4px_0px_0px_#000] flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-slate-950" />
                <span>Enter CAD Design Panel ↓</span>
              </a>
            </div>
          </section>
        </div>

        {/* ========================================================
            BOTTOM DOCK: EXPLODED PART QUICK SELECTOR & CONTROLS
        ======================================================== */}
        <div className="absolute bottom-6 left-4 right-4 sm:left-8 sm:right-8 z-30 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Scroll Callout or Exploded Status Callout */}
          <div className="flex items-center gap-2">
            {isExplodedPhase ? (
              <div className="font-mono text-[11px] font-black tracking-wider text-black bg-[#BBF7D0] px-4 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 animate-pulse">
                <ZoomIn className="w-3.5 h-3.5 text-black" />
                <span>CLICK ANY PART / PIN TO MAGNIFY (HIGH-RES)</span>
              </div>
            ) : (
              <div className="font-mono text-[11px] font-black tracking-widest text-black bg-[#FEF08A] px-4 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-black animate-spin" />
                <span>SCROLL DOWN TO EXPLODE LIKE A VIDEO</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            )}
          </div>

          {/* Quick Component Clickable Pills */}
          <div className="hidden lg:flex items-center gap-2 overflow-x-auto max-w-2xl py-1 px-2 bg-[#FAF5E6]/95 rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <span className="font-mono text-[10px] font-black text-slate-800 px-1">PARTS:</span>
            {ROBOT_EXPLODED_PARTS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  soundManager.playModalOpen();
                  if (onSelectPart) onSelectPart(p);
                }}
                className="px-2.5 py-1 rounded-lg border border-black font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] hover:-translate-y-0.5 active:translate-y-0 transition-transform whitespace-nowrap"
                style={{ backgroundColor: p.badgeColor || '#FEF08A' }}
              >
                {p.tag}
              </button>
            ))}
          </div>

          {/* Auto-Play Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsAutoPlaying(!isAutoPlaying);
              }}
              className={`px-3 py-2 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_#000] font-mono text-xs font-black flex items-center gap-1.5 transition-transform active:translate-x-0.5 active:translate-y-0.5 ${
                isAutoPlaying ? 'bg-[#BBF7D0] text-black' : 'bg-[#FFF9EB] text-black hover:bg-[#FEF08A]'
              }`}
              title={isAutoPlaying ? 'Pause Auto Demonstration' : 'Auto Play Assembly'}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-black" />}
              <span>{isAutoPlaying ? 'PAUSE' : 'AUTO DEMO'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
