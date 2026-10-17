import React, { useState } from 'react';
import RoboCar3DModel from './RoboCar3DModel';
import ExplodedCADScrubber from './ExplodedCADScrubber';
import NRLArenaTactics from './NRLArenaTactics';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  Zap, Trophy, Shield, Cpu, ExternalLink, Play, 
  RotateCw, Gauge, BatteryCharging, Radio, CheckCircle2,
  Package, Image as ImageIcon, Eye, Layers, Wrench, X, Sparkles, Sliders, Target 
} from 'lucide-react';
import ScrollReveal from './motion/ScrollReveal';
import MotionTiltCard from './motion/MotionTiltCard';

export default function NRLSection({ onSelectPart }) {
  const { activeThemeObj } = useTheme();
  const [showKitImageModal, setShowKitImageModal] = useState(false);
  const [inspectorMode, setInspectorMode] = useState('exploded'); // 'exploded', 'webgl', or 'tactics'

  const kitInventory = [
    { item: 'Chassis & Arm Assembly', qty: 'x2', desc: 'Laser-cut polycarbonate deck & aluminum brackets' },
    { item: 'Motors & Actuator', qty: 'x1', desc: 'High-torque metal gear DC motors + servo actuator' },
    { item: 'HEXA Command Hub', qty: 'x1', desc: 'Main controller PCB with wireless telemetry & motor drivers' },
    { item: 'HEXA Handheld Controller', qty: 'x1', desc: 'Wireless 2.4GHz dual-joystick gamepad' },
    { item: 'Sensor & Wiring Harness', qty: 'x1', desc: 'Telemetry wiring leads, switch & quick-disconnect power' },
    { item: 'Fasteners & Allen Tools', qty: 'x1', desc: 'Hex hardware kit, standoffs & assembly tools' },
    { item: 'Robot Battery & Fast Charger', qty: 'x1', desc: 'High-discharge power cell with auto-cutoff charger' },
    { item: 'Robot Wheels (All-Terrain)', qty: 'x4', desc: 'Iconic white dish rims with knobby rubber gripper tires' },
    { item: 'Scoring Elements', qty: 'x3', desc: 'Official blue, red, and yellow arena tournament rings' },
    { item: 'Construction Manual & Guide', qty: 'x1', desc: 'Official NRL rules, safety protocol & build schematic' }
  ];

  return (
    <div id="nrl-car" className="scroll-mt-28 space-y-12">
      {/* Section Header */}
      <ScrollReveal animation="fade-up">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div 
            className="inline-flex items-center gap-2 font-mono text-xs font-black px-4 py-1.5 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_#000] bg-[#FEF08A] text-black"
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>NATIONAL ROBOTICS LEAGUE™ // DELHI REGIONAL COMPETITION</span>
          </div>

          <h2 className="font-['Orbitron'] text-3xl sm:text-5xl font-black text-black">
            CAD Design &amp; Hardware Architecture Panel
          </h2>

          <p className="text-slate-800 text-sm sm:text-base font-sans font-medium leading-relaxed">
            Engineered for the <strong>National Robotics League™ Delhi Regional State-Level Competition</strong> using the official tournament Robot Kit. Direct continuation from the scroll-scrubbed explosion above: inspect separated sub-assemblies, scrub with scroll wheel, examine real-time 3D WebGL telemetry, and plan arena match strategies.
          </p>

          {/* View Mode Switcher Pill */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setInspectorMode('exploded');
              }}
              className={`neo-btn px-5 py-2.5 rounded-full font-mono text-xs font-black flex items-center gap-2 transition-all ${
                inspectorMode === 'exploded'
                  ? 'bg-[#FEF08A] text-black shadow-[4px_4px_0px_0px_#000]'
                  : 'bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FEF08A]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>EXPLODED CAD ASSEMBLY</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setInspectorMode('webgl');
              }}
              className={`neo-btn px-5 py-2.5 rounded-full font-mono text-xs font-black flex items-center gap-2 transition-all ${
                inspectorMode === 'webgl'
                  ? 'bg-[#BAE6FD] text-black shadow-[4px_4px_0px_0px_#000]'
                  : 'bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#BAE6FD]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D WEBGL MODEL (HOVER TELEMETRY)</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setInspectorMode('tactics');
              }}
              className={`neo-btn px-5 py-2.5 rounded-full font-mono text-xs font-black flex items-center gap-2 transition-all ${
                inspectorMode === 'tactics'
                  ? 'bg-[#BBF7D0] text-black shadow-[4px_4px_0px_0px_#000]'
                  : 'bg-[#FFF9EB] text-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#BBF7D0]'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>ARENA STRATEGY &amp; LIVE SCORER</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Main 3D Model / Exploded CAD / Tactics Inspector */}
      <ScrollReveal animation="scale-up" delay={120}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-800 font-bold">
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
              <strong className="text-black uppercase">
                {inspectorMode === 'exploded' 
                  ? 'Interactive CAD Exploded View:' 
                  : inspectorMode === 'webgl'
                  ? '3D Real-Time Telemetry:'
                  : 'Tournament Arena Tactics & Score Projector:'}
              </strong>
              <span className="text-slate-700">
                {inspectorMode === 'exploded' 
                  ? 'Drag timeline slider or use Play button to see full mechanical disassembly.'
                  : inspectorMode === 'webgl'
                  ? 'Hover mouse over claw, wheels, PCB hub, or chassis to inspect specifications.'
                  : 'Interactive 12ft x 12ft field blueprint with real-time scoring calculator.'}
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowKitImageModal(true);
              }}
              className="neo-btn px-4 py-2 rounded-xl bg-[#FEF08A] text-black text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#fed7aa]"
            >
              <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
              <span>VIEW OFFICIAL KIT POSTER</span>
            </button>
          </div>

          {/* Dynamic Display Area */}
          <div className="min-h-[480px]">
            {inspectorMode === 'exploded' ? (
              <ExplodedCADScrubber onSelectPart={onSelectPart} />
            ) : inspectorMode === 'webgl' ? (
              <div className="h-[480px] sm:h-[560px]">
                <RoboCar3DModel autoRotate={false} />
              </div>
            ) : (
              <NRLArenaTactics />
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Kit Showcase: Actual Kit Image Preview & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kit Image & Drive Link */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl neo-box-lg relative overflow-hidden group">
            <div className="flex items-center justify-between mb-4 font-mono text-xs">
              <span className="font-black text-slate-950 flex items-center gap-2">
                <Package className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                NRL ROBOT KIT // SCHEMATIC & IMAGE
              </span>
              <a
                href="https://drive.google.com/file/d/11LmpkEE8BqA1X6jXp97maQr5XPHmI8QB/view"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="neo-btn px-2.5 py-1 rounded-lg bg-amber-200 text-slate-950 text-[11px]"
              >
                <span>Google Drive</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>

            {/* Clickable Image Preview */}
            <div 
              onClick={() => {
                soundManager.playClick();
                setShowKitImageModal(true);
              }}
              className="relative rounded-xl overflow-hidden border-3 border-black cursor-pointer shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-[#FAF5E6]"
            >
              <img
                src="./robo_kit.png"
                alt="National Robotics League Robot Kit Poster"
                className="w-full h-72 sm:h-80 object-cover object-top filter brightness-98 group-hover:brightness-105 transition-all group-hover:scale-102 duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-black bg-[#FEF08A] px-3.5 py-2 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000]">
                <span className="flex items-center gap-2 font-black">
                  <Eye className="w-4 h-4 text-black" />
                  Click to Expand Full Resolution Poster
                </span>
                <span className="text-[10px] font-bold text-slate-800">NRL_KIT.PNG</span>
              </div>
            </div>

            {/* Video Link */}
            <div className="mt-4 pt-4 border-t-2 border-black flex items-center justify-between">
              <div className="text-xs text-slate-800 font-sans font-semibold">
                Official HYPERDRIVE match arena rules and video:
              </div>
              <a
                href="https://youtu.be/C0-qp_30QFk?si=48g3O7u7qas8O-7q"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="neo-btn px-3.5 py-1.5 rounded-lg bg-[#FECDD3] text-black font-mono text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FDA4AF]"
              >
                <Play className="w-3.5 h-3.5 fill-black mr-1.5" />
                <span>Arena Video</span>
              </a>
            </div>
          </div>
        </div>

        {/* Kit Parts Inventory */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl neo-box-lg bg-[#FFF9EB] border-3 border-black shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="font-mono text-xs font-black tracking-wider flex items-center gap-2 text-black">
                <Wrench className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span>ROBOT KIT INVENTORY BREAKDOWN</span>
              </div>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded border-2 border-black bg-[#FEF08A] text-black shadow-[1.5px_1.5px_0px_0px_#000]">
                10 CORE ASSEMBLIES
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {kitInventory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border-2 border-black font-mono text-xs shadow-[3px_3px_0px_0px_#000] bg-[#FAF5E6]"
                >
                  <div>
                    <div className="font-black flex items-center gap-1.5 text-black">
                      <span className="w-2 h-2 rounded-full border border-black" style={{ backgroundColor: activeThemeObj.hex }} />
                      <span>{item.item}</span>
                    </div>
                    <div className="text-[11px] font-sans font-medium mt-0.5 text-slate-800">
                      {item.desc}
                    </div>
                  </div>
                  <span 
                    className="font-mono text-xs px-2.5 py-1 rounded-lg border-2 border-black font-black shrink-0 bg-[#FEF08A] text-black shadow-[1.5px_1.5px_0px_0px_#000]"
                  >
                    {item.qty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Kit Image Zoom Modal */}
      {showKitImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-3xl w-full border-4 border-black shadow-[8px_8px_0px_0px_#000] rounded-2xl overflow-hidden bg-[#FAF5E6]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-black bg-[#FFF9EB]">
              <div className="font-mono text-xs font-black flex items-center gap-2 text-black">
                <Package className="w-4 h-4" />
                <span>NRL ROBOT KIT // COMPLETE PARTS MANIFEST</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowKitImageModal(false);
                }}
                className="p-1.5 rounded-lg border-2 border-black bg-[#FEF08A] hover:bg-[#FED7AA] text-black shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[80vh] overflow-y-auto flex items-center justify-center bg-[#FAF5E6]">
              <img
                src="./robo_kit.png"
                alt="National Robotics League Robot Kit Poster Full"
                className="w-full h-auto rounded-lg object-contain border-2 border-black shadow-[4px_4px_0px_0px_#000]"
              />
            </div>

            <div className="px-5 py-3.5 bg-[#FFF9EB] border-t-2 border-black flex items-center justify-between font-mono text-xs">
              <a
                href="https://drive.google.com/file/d/11LmpkEE8BqA1X6jXp97maQr5XPHmI8QB/view"
                target="_blank"
                rel="noreferrer"
                className="text-black font-black hover:underline flex items-center gap-1.5"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setShowKitImageModal(false)}
                className="neo-btn px-4 py-1.5 rounded-lg bg-black text-[#FAF5E6] text-xs font-bold border-2 border-black hover:bg-[#1a1a1a]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
