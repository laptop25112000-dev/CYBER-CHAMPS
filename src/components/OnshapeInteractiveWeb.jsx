import React, { useState, useRef } from 'react';
import { soundManager } from '../utils/audio';
import { 
  Globe, ExternalLink, RotateCcw, Maximize2, Minimize2, 
  Copy, Check, Box, ShieldCheck, Compass, Sparkles, AlertCircle
} from 'lucide-react';
import OnshapeCadViewer from './OnshapeCadViewer';

export default function OnshapeInteractiveWeb({
  selectedCompId = null,
  onSelectComponent = null
}) {
  const containerRef = useRef(null);
  const [iframeKey, setIframeKey] = useState(1);
  const [activeMode, setActiveMode] = useState('onshape-web'); // 'onshape-web' | 'webgl-model'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const exactOnshapeUrl = "https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb";

  const handleReload = () => {
    soundManager.playClick();
    setIframeKey(k => k + 1);
  };

  const handleCopy = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(exactOnshapeUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const toggleFullscreen = () => {
    soundManager.playClick();
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleOpenExactOnshape = () => {
    soundManager.playClick();
    window.open(exactOnshapeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      ref={containerRef}
      id="onshape-web-container"
      className="w-full bg-[#171717] border-2 border-[#171717] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left transition-all select-none"
    >
      {/* Top CAD Control Bar */}
      <div className="px-5 py-4 bg-[#1F1F1F] border-b border-[#2C2C2C] flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Title & Status */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F04438] text-white rounded-lg shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-white tracking-wide uppercase">
                PTC ONSHAPE™ Interactive Web CAD
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#059669]/20 border border-[#059669]/60 text-[#10B981] font-mono text-[15px] font-bold">
                LIVE CLOUD WORKSPACE
              </span>
            </div>
            <div className="font-mono text-[15px] text-[#A3A3A3] hidden sm:block">
              Official Production Assembly · 1:1 Parametric Rig · Document b9775324604f
            </div>
          </div>
        </div>

        {/* Center / Right: Mode Switcher & Direct Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Mode Switcher Toggle: Onshape Web vs WebGL 3D Model */}
          <div className="flex items-center gap-1 p-1 bg-[#121212] rounded-lg border border-[#333333]">
            <button
              onClick={() => {
                soundManager.playClick();
                setActiveMode('onshape-web');
              }}
              className={`px-3 py-1.5 rounded font-mono text-[15px] font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'onshape-web'
                  ? 'bg-[#F04438] text-white shadow-sm'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>ONSHAPE WEB</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setActiveMode('webgl-model');
              }}
              className={`px-3 py-1.5 rounded font-mono text-[15px] font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'webgl-model'
                  ? 'bg-[#F04438] text-white shadow-sm'
                  : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>WEBGL 3D MODEL</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white border border-[#404040] font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
            title="Copy Public Onshape Document Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copiedLink ? 'COPIED' : 'COPY LINK'}</span>
          </button>

          {activeMode === 'onshape-web' && (
            <button
              onClick={handleReload}
              className="px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white border border-[#404040] font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
              title="Reload Onshape Frame"
            >
              <RotateCcw className="w-4 h-4 text-[#F04438]" />
              <span className="hidden sm:inline">RELOAD</span>
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white border border-[#404040] font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden md:inline">FULLSCREEN</span>
          </button>

          <button
            onClick={handleOpenExactOnshape}
            className="px-4 py-2 bg-[#F04438] hover:bg-[#D9382C] text-white font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <span>OPEN EXACT ONSHAPE</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Viewport */}
      {activeMode === 'onshape-web' ? (
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] min-h-[540px] sm:min-h-[640px] lg:min-h-[720px] bg-[#0E1117] overflow-hidden">
          
          {/* Exact Onshape Interactive Web Iframe */}
          <iframe
            key={iframeKey}
            src={exactOnshapeUrl}
            title="CYBER CHAMPS Onshape CAD Cloud Workspace"
            className="w-full h-full border-0 absolute inset-0 z-0 bg-[#0E1117]"
            allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking; clipboard-write; web-share"
          />

          {/* Floating Instructions & Browser Compatibility Helper */}
          <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06080C]/85 backdrop-blur-md border border-[#2C2C2C] text-[#F7F7F4] font-mono text-[15px] shadow-lg pointer-events-none">
            <span className="text-[#F04438] font-bold">🌐 ONSHAPE CLOUD:</span>
            <span>Interactive Web Workspace</span>
            <span className="text-[#595959]">·</span>
            <span>Right-Click Drag (Orbit)</span>
            <span className="text-[#595959]">·</span>
            <span>Scroll Wheel (Zoom)</span>
          </div>

          {/* Bottom Floating Fallback Dock */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#171717]/95 text-white backdrop-blur-md border border-white/10 shadow-xl font-mono">
            <div className="text-[15px] text-[#D4D4D4] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#F04438]" />
              <span>Full parametric CAD tools: Assembly Tree, Exploded View, Section Analysis & Measurement</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleOpenExactOnshape}
                className="w-full sm:w-auto px-4 py-2 bg-[#F04438] hover:bg-[#D9382C] text-white text-[15px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Launch in Onshape Tab</span>
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveMode('webgl-model');
                }}
                className="w-full sm:w-auto px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white text-[15px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 border border-[#404040]"
              >
                <Box className="w-4 h-4 text-[#F04438]" />
                <span>Switch to WebGL 3D Model</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* Real-Time Three.js WebGL 3D CAD Model */
        <div className="w-full">
          <OnshapeCadViewer 
            selectedCompId={selectedCompId}
            onSelectComponent={onSelectComponent}
          />
        </div>
      )}

      {/* Bottom CAD Details & Quick Tips Strip */}
      <div className="p-5 sm:p-6 bg-[#1A1A1A] border-t border-[#2C2C2C] grid grid-cols-1 md:grid-cols-3 gap-5 text-left font-mono">
        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#F04438] uppercase flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Onshape Cloud Architecture</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Running directly from PTC Onshape servers. Parametrically constrained parts, assemblies, and sub-assemblies update in real time.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#10B981] uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Interactive Assembly Tools</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Select parts to inspect mate connectors, degrees of freedom, and mass properties directly in the Onshape web viewport.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#3B82F6] uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Production Verification</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Document <strong className="text-white">b9775324604f</strong>. Full 1:1 CAD model verified for National Robotics League HYPERDRIVE 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
