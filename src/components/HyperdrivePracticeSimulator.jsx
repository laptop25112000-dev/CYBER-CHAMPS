import React, { useState, useRef, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import { 
  Play, RotateCcw, Maximize2, ExternalLink, Gamepad2, 
  Sparkles, ShieldCheck, Monitor, HelpCircle, Check, Compass
} from 'lucide-react';

export default function HyperdrivePracticeSimulator() {
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [simStatus, setSimStatus] = useState('loading'); // 'loading' | 'ready' | 'running'
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-trigger practice mode when iframe loads
  const handleIframeLoad = () => {
    setSimStatus('ready');
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        // Attempt to click the Practice mode button in the simulator DOM
        const tryTriggerPractice = () => {
          const practiceBtn = iframeDoc.querySelector('button[data-act="practice"]');
          if (practiceBtn) {
            practiceBtn.click();
            setSimStatus('running');
            setTimeout(() => {
              const startBtn = iframeDoc.querySelector('#btn-go, button[data-go]');
              if (startBtn) startBtn.click();
            }, 300);
            return true;
          }
          return false;
        };

        if (!tryTriggerPractice()) {
          const timer = setInterval(() => {
            if (tryTriggerPractice()) {
              clearInterval(timer);
            }
          }, 400);
          setTimeout(() => clearInterval(timer), 8000);
        }
      }
    } catch {
      // Cross-origin fallback if proxied headers differ
      setSimStatus('ready');
    }
  };

  const restartPracticeMode = () => {
    soundManager.playClick();
    if (iframeRef.current) {
      setSimStatus('loading');
      iframeRef.current.src = '/sim-proxy/?mode=practice&t=' + Date.now();
    }
  };

  const toggleFullscreen = () => {
    soundManager.playClick();
    const container = document.getElementById('hyperdrive-sim-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const copyShareLink = () => {
    soundManager.playClick();
    navigator.clipboard.writeText('https://hyperdrive-sim.vercel.app');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      id="hyperdrive-sim-container"
      className="w-full bg-[#171717] border-2 border-[#171717] rounded-3xl overflow-hidden shadow-2xl flex flex-col text-left transition-all"
    >
      {/* Top Simulator Control Bar */}
      <div className="px-5 py-4 bg-[#1F1F1F] border-b border-[#2C2C2C] flex flex-wrap items-center justify-between gap-4">
        
        {/* Title & Live Status */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F04438] text-white rounded-lg shadow-sm">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold text-white tracking-wide uppercase">
                HYPERDRIVE Match Simulator
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#059669]/20 border border-[#059669]/60 text-[#10B981] font-mono text-[15px] font-bold">
                PRACTICE MODE ACTIVE
              </span>
            </div>
            <div className="font-mono text-[15px] text-[#A3A3A3] hidden sm:block">
              Official 12 × 12 ft Arena · Physics-Accurate Robot CAD · Free Practice
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={restartPracticeMode}
            className="px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white border border-[#404040] font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
            title="Reload and restart practice session"
          >
            <RotateCcw className="w-4 h-4 text-[#F04438]" />
            <span className="hidden sm:inline">RESET ARENA</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3.5 py-2 bg-[#2C2C2C] hover:bg-[#383838] text-white border border-[#404040] font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="hidden md:inline">FULLSCREEN</span>
          </button>

          <a
            href="https://hyperdrive-sim.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#F04438] hover:bg-[#D9382C] text-white font-mono text-[15px] font-bold rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <span>LAUNCH EXTERNAL</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Interactive WebGL Simulator Viewport */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] min-h-[500px] sm:min-h-[580px] bg-[#06080C] overflow-hidden">
        
        {/* The Live Interactive Iframe via zero-restriction proxy */}
        <iframe
          ref={iframeRef}
          src="/sim-proxy/"
          title="HYPERDRIVE Simulator - Practice Mode"
          className="w-full h-full border-0"
          allow="fullscreen; gamepad; accelerometer; gyroscope"
          onLoad={handleIframeLoad}
        />

        {/* Keypad & Driving Guidance Floating Bar */}
        <div className="absolute top-4 left-4 z-20 hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#06080C]/85 backdrop-blur-md border border-[#2C2C2C] text-[#F7F7F4] font-mono text-[15px] shadow-lg pointer-events-none">
          <span className="text-[#F04438] font-bold">🎮 CONTROLS:</span>
          <span>WASD / Arrow Keys (Drive)</span>
          <span className="text-[#595959]">·</span>
          <span>Space (Start)</span>
          <span className="text-[#595959]">·</span>
          <span>C (Cycle Camera)</span>
          <span className="text-[#595959]">·</span>
          <span>Esc (Menu)</span>
        </div>

      </div>

      {/* Bottom Practice Details & Quick Tips Strip */}
      <div className="p-5 sm:p-6 bg-[#1A1A1A] border-t border-[#2C2C2C] grid grid-cols-1 md:grid-cols-3 gap-5 text-left font-mono">
        
        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#F04438] uppercase flex items-center gap-2">
            <Compass className="w-4 h-4" />
            <span>Practice Objective</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Drive freely without match countdown clocks. Practice gripping 95mm CORE rings, threading them onto 130mm High Poles, and climbing the Space Station.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#10B981] uppercase flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Driver Training Tips</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Press <strong className="text-white">C</strong> to switch into <strong>Driver Station</strong> or <strong>Follow Cam</strong>. Press <strong className="text-white">V</strong> to toggle the live telemetry HUD.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-[15px] font-bold text-[#3B82F6] uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Live Scoring Engine</span>
          </div>
          <p className="text-[15px] text-[#D4D4D4] leading-relaxed">
            Scoring feedback is evaluated in real-time. Hit the ring threshold to unlock the Golden Vault and practice balancing on the 15° inclined ramp.
          </p>
        </div>

      </div>
    </div>
  );
}
