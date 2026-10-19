import React, { useEffect, useRef, useState } from 'react';
import { soundManager } from '../utils/audio';
import { ROBOT_COMPONENTS } from '../data/robotData';
import ComponentInformationPanel from './ComponentInformationPanel';
import { 
  Play, Pause, RotateCcw, ZoomIn, ZoomOut, Layers, 
  Sliders, Maximize2, Sparkles, Check, ChevronRight, Eye 
} from 'lucide-react';

const TOTAL_FRAMES = 300;

export default function InteractiveExplodedSection({ 
  selectedComponent, 
  onSelectComponent 
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // States
  const [frameIndex, setFrameIndex] = useState(0);
  const [isAssembled, setIsAssembled] = useState(true);
  const [viewMode, setViewMode] = useState('full'); // 'full' or 'magnified'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  // Cached Image elements
  const imagesRef = useRef([]);
  const animRef = useRef(null);

  const getFramePath = (idx) => {
    const num = String(idx + 1).padStart(3, '0');
    return `${import.meta.env.BASE_URL}car-frames/ezgif-frame-${num}.jpg`;
  };

  // Preload frames
  useEffect(() => {
    const images = new Array(TOTAL_FRAMES);
    imagesRef.current = images;
    let count = 0;

    // Load Frame 1 immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      count++;
      setLoadedCount(count);
      setIsLoaded(true);
      draw();
    };

    // Load remaining frames
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

  // Sync animation when frameIndex changes
  useEffect(() => {
    draw();
  }, [frameIndex, viewMode, zoomLevel, panOffset, selectedComponent]);

  // Handle selectedComponent focus/magnification
  useEffect(() => {
    if (selectedComponent) {
      if (frameIndex < 200) {
        animateToFrame(TOTAL_FRAMES - 1);
      }
      setViewMode('magnified');
      setZoomLevel(2.0);
    } else {
      setViewMode('full');
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
    }
  }, [selectedComponent]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete) {
      for (let offset = 1; offset < 30; offset++) {
        if (imagesRef.current[frameIndex - offset]?.complete) {
          img = imagesRef.current[frameIndex - offset];
          break;
        }
        if (imagesRef.current[frameIndex + offset]?.complete) {
          img = imagesRef.current[frameIndex + offset];
          break;
        }
      }
    }

    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || 1920;
    const ih = img.naturalHeight || 1080;

    // Clean neutral light background matching #F6F7F8 / #FFFFFF aesthetic
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, cw, ch);

    if (viewMode === 'magnified' && selectedComponent?.cropBox) {
      const crop = selectedComponent.cropBox;
      const sx = crop.x * iw;
      const sy = crop.y * ih;
      const sw = crop.width * iw;
      const sh = crop.height * ih;

      const scale = zoomLevel;
      const dw = cw * 0.85 * scale;
      const dh = ch * 0.85 * scale;
      const dx = (cw - dw) / 2 + panOffset.x;
      const dy = (ch - dh) / 2 + panOffset.y;

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);

      // Subtle framing box
      ctx.strokeStyle = '#245DFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(dx + 8, dy + 8, dw - 16, dh - 16);

      // Component identification overlay
      ctx.fillStyle = '#245DFF';
      ctx.fillRect(dx + 8, dy + 8, 150, 24);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`MAGNIFIED: ${selectedComponent.shortTag}`, dx + 14, dy + 24);

    } else {
      const hRatio = cw / iw;
      const vRatio = ch / ih;
      const ratio = Math.min(hRatio, vRatio) * zoomLevel;

      const rw = iw * ratio;
      const rh = ih * ratio;
      const rx = (cw - rw) / 2 + panOffset.x;
      const ry = (ch - rh) / 2 + panOffset.y;

      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, rx, ry, rw, rh);
    }
  };

  const animateToFrame = (target) => {
    cancelAnimationFrame(animRef.current);
    const step = () => {
      setFrameIndex(prev => {
        if (Math.abs(prev - target) <= 3) {
          setIsAssembled(target === 0);
          return target;
        }
        const delta = (target - prev) * 0.15;
        return Math.round(prev + delta);
      });
      if (frameIndex !== target) {
        animRef.current = requestAnimationFrame(step);
      }
    };
    animRef.current = requestAnimationFrame(step);
  };

  const handleToggleExplode = () => {
    soundManager.playClick();
    if (frameIndex > 50) {
      animateToFrame(0);
      setIsAssembled(true);
      if (onSelectComponent) onSelectComponent(null);
    } else {
      animateToFrame(TOTAL_FRAMES - 1);
      setIsAssembled(false);
    }
  };

  const handleResetCamera = () => {
    soundManager.playClick();
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setViewMode('full');
    if (onSelectComponent) onSelectComponent(null);
  };

  return (
    <section id="exploded-view" className="py-20 sm:py-28 bg-[#F6F7F8] border-b border-[#E4E7EB] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E4E7EB] bg-white text-[#245DFF] text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>INSIDE THE MACHINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#17191C]">
            Every part has a purpose.
          </h2>
          <p className="text-base sm:text-lg text-[#626A73] leading-relaxed">
            Take a closer look at the components that make our robot work. Select any identified part to learn what it does.
          </p>
        </div>

        {/* Main Layout: 2/3 Interactive Viewport + 1/3 Component Information Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Exploded Viewport */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            
            {/* Viewport Frame (Integrated light-grey/white studio aesthetic) */}
            <div 
              ref={containerRef}
              className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl bg-white border border-[#E4E7EB] shadow-sm overflow-hidden flex items-center justify-center select-none"
            >
              {/* Canvas Renderer */}
              <canvas 
                ref={canvasRef}
                width={1280}
                height={720}
                className="w-full h-full object-contain cursor-crosshair"
              />

              {/* Status Pill on Top Left */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#E4E7EB] text-xs font-semibold text-[#17191C] shadow-sm">
                  <span className={`w-2 h-2 rounded-full ${frameIndex > 50 ? 'bg-[#059669]' : 'bg-[#245DFF]'}`} />
                  <span>{frameIndex > 50 ? 'Exploded Assembly' : 'Assembled Robot'}</span>
                </div>
              </div>

              {/* Exploded Part Hotspot Pins */}
              {frameIndex > 100 && viewMode === 'full' && (
                <div className="absolute inset-0 pointer-events-none">
                  {ROBOT_COMPONENTS.map((comp) => {
                    const isSelected = selectedComponent?.id === comp.id;
                    return (
                      <div
                        key={comp.id}
                        style={{
                          position: 'absolute',
                          left: `${comp.normalizedPos.x * 100}%`,
                          top: `${comp.normalizedPos.y * 100}%`,
                          transform: 'translate(-50%, -50%)',
                          pointerEvents: 'auto'
                        }}
                        className="group cursor-pointer"
                        onClick={() => {
                          soundManager.playClick();
                          onSelectComponent(comp);
                        }}
                      >
                        {/* Ping beacon */}
                        <span 
                          className="absolute -inset-1.5 rounded-full opacity-60 animate-ping"
                          style={{ backgroundColor: comp.badgeColor }}
                        />

                        {/* Interactive Pin Tag */}
                        <div 
                          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-sans text-xs font-bold shadow-md transition-all group-hover:scale-105 ${
                            isSelected 
                              ? 'bg-[#245DFF] text-white border-[#245DFF] ring-2 ring-[#245DFF]/30' 
                              : 'bg-white text-[#17191C] border-[#E4E7EB] hover:border-[#245DFF]'
                          }`}
                        >
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: comp.badgeColor }}
                          />
                          <span>{comp.shortTag}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Instruction Banner at Bottom */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#E4E7EB] text-xs text-[#626A73] font-medium shadow-sm">
                  {viewMode === 'magnified' 
                    ? 'Focused component view. Click "Back to Full Robot" to restore overview.' 
                    : 'Drag slider or click "Explode the Robot" to separate components.'}
                </div>
              </div>

            </div>

            {/* Viewer Controls Toolbar */}
            <div className="p-4 rounded-xl bg-white border border-[#E4E7EB] shadow-sm flex flex-wrap items-center justify-between gap-4">
              
              {/* Primary Actions */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleToggleExplode}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    frameIndex > 50
                      ? 'bg-white border border-[#E4E7EB] text-[#17191C] hover:bg-[#F6F7F8]'
                      : 'bg-[#245DFF] text-white hover:bg-[#1b4bd8]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>{frameIndex > 50 ? 'Assemble Robot' : 'Explode the Robot'}</span>
                </button>

                <button
                  onClick={handleResetCamera}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#E4E7EB] bg-white text-xs font-semibold text-[#626A73] hover:text-[#17191C] hover:bg-[#F6F7F8] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset View</span>
                </button>
              </div>

              {/* Scrubber Range Bar */}
              <div className="flex-1 min-w-[180px] max-w-sm flex items-center gap-3">
                <span className="text-xs font-semibold text-[#626A73] whitespace-nowrap">Assembled</span>
                <input
                  type="range"
                  min="0"
                  max={TOTAL_FRAMES - 1}
                  value={frameIndex}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFrameIndex(val);
                    setIsAssembled(val === 0);
                  }}
                  className="w-full accent-[#245DFF] cursor-pointer"
                  aria-label="Exploded assembly progress scrubber"
                />
                <span className="text-xs font-semibold text-[#626A73] whitespace-nowrap">Exploded</span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.2))}
                  aria-label="Zoom out"
                  className="p-2 rounded-lg border border-[#E4E7EB] text-[#626A73] hover:text-[#17191C] hover:bg-[#F6F7F8]"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-[#17191C] w-10 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(3.0, prev + 0.2))}
                  aria-label="Zoom in"
                  className="p-2 rounded-lg border border-[#E4E7EB] text-[#626A73] hover:text-[#17191C] hover:bg-[#F6F7F8]"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Component Discovery Buttons (No dark strip, clean responsive scroll) */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E4E7EB] flex items-center gap-2 overflow-x-auto scrollbar-thin">
              <span className="text-xs font-bold text-[#626A73] uppercase tracking-wider pl-1 whitespace-nowrap">
                Identified Parts:
              </span>
              {ROBOT_COMPONENTS.map((comp) => {
                const isActive = selectedComponent?.id === comp.id;
                return (
                  <button
                    key={comp.id}
                    onClick={() => {
                      soundManager.playClick();
                      onSelectComponent(comp);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                      isActive
                        ? 'bg-[#245DFF] text-white border-[#245DFF]'
                        : 'bg-[#F6F7F8] text-[#17191C] border-[#E4E7EB] hover:border-[#245DFF]'
                    }`}
                  >
                    {comp.shortTag}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Component Information Panel */}
          <div className="lg:col-span-5 xl:col-span-4 h-[600px] lg:h-[680px]">
            <ComponentInformationPanel
              selectedComponent={selectedComponent}
              onSelectComponent={onSelectComponent}
              onResetView={handleResetCamera}
              allComponents={ROBOT_COMPONENTS}
            />
          </div>

        </div>

      </div>
    </section>
  );
}
