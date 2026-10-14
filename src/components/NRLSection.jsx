import React, { useState } from 'react';
import RoboCar3DModel from './RoboCar3DModel';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { 
  Zap, Trophy, Shield, Cpu, ExternalLink, Play, 
  RotateCw, Gauge, BatteryCharging, Radio, CheckCircle2,
  Package, Image as ImageIcon, Eye, Layers, Wrench, X 
} from 'lucide-react';

export default function NRLSection() {
  const { activeThemeObj } = useTheme();
  const [showKitImageModal, setShowKitImageModal] = useState(false);

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
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div 
          className="inline-flex items-center gap-2 font-mono text-xs px-3.5 py-1.5 rounded-full border backdrop-blur-md"
          style={{
            color: activeThemeObj.hex,
            borderColor: `${activeThemeObj.hex}40`,
            backgroundColor: `${activeThemeObj.hex}10`
          }}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>NATIONAL ROBOTICS LEAGUE™ // OFFICIAL ROBOT KIT</span>
        </div>

        <h2 className="font-['Orbitron'] text-3xl sm:text-5xl font-black text-white">
          Our NRL Battle Robo Car
        </h2>

        <p className="text-slate-400 text-sm sm:text-base font-sans leading-relaxed">
          Built from the official <strong>National Robotics League™ (Presented by Amazon) Robot Kit</strong>. Hover over any component on the 3D model below to inspect real-time telemetry and hardware specs.
        </p>
      </div>

      {/* Main 3D Model & Interactive Hover Inspector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
            <strong className="text-white uppercase">Interactive 3D Hardware Telemetry:</strong>
            <span className="text-slate-400">Hover mouse over claw, wheels, PCB hub, or chassis to inspect.</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowKitImageModal(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 font-mono text-xs text-cyan-300 transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>VIEW OFFICIAL KIT POSTER</span>
          </button>
        </div>

        {/* 3D Canvas Box */}
        <div className="h-[460px] sm:h-[540px]">
          <RoboCar3DModel autoRotate={false} />
        </div>
      </div>

      {/* Kit Showcase: Actual Kit Image Preview & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kit Image & Drive Link */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3 font-mono text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                NRL ROBOT KIT // SCHEMATIC & IMAGE
              </span>
              <a
                href="https://drive.google.com/file/d/11LmpkEE8BqA1X6jXp97maQr5XPHmI8QB/view"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="text-cyan-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <span>Google Drive File</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Clickable Image Preview */}
            <div 
              onClick={() => {
                soundManager.playClick();
                setShowKitImageModal(true);
              }}
              className="relative rounded-xl overflow-hidden border border-slate-800 cursor-pointer group-hover:border-slate-700 transition-all bg-slate-950"
            >
              <img
                src="./robo_kit.png"
                alt="National Robotics League Robot Kit Poster"
                className="w-full h-72 sm:h-80 object-cover object-top filter brightness-95 group-hover:brightness-105 transition-all group-hover:scale-102 duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800/90 backdrop-blur-md">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" style={{ color: activeThemeObj.hex }} />
                  Click to Expand Full Resolution Poster
                </span>
                <span className="text-[10px] text-slate-400">NRL_KIT.PNG</span>
              </div>
            </div>

            {/* Video Link */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-400 font-sans">
                Official HYPERDRIVE match arena rules and video:
              </div>
              <a
                href="https://youtu.be/C0-qp_30QFk?si=48g3O7u7qas8O-7q"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 text-red-300 hover:text-white border border-red-500/30 font-mono text-xs transition-colors"
              >
                <Play className="w-3 h-3 fill-red-400" />
                <span>Arena Video</span>
              </a>
            </div>
          </div>
        </div>

        {/* Kit Parts Inventory */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/85 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="font-mono text-xs font-bold text-white tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span>ROBOT KIT INVENTORY BREAKDOWN</span>
              </div>
              <span className="font-mono text-[10px] text-slate-400">
                10 CORE ASSEMBLIES
              </span>
            </div>

            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {kitInventory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 font-mono text-xs hover:border-slate-700 transition-colors"
                >
                  <div>
                    <div className="text-white font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeThemeObj.hex }} />
                      <span>{item.item}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <span 
                    className="font-mono text-xs px-2 py-0.5 rounded border font-bold shrink-0"
                    style={{
                      color: activeThemeObj.hex,
                      borderColor: `${activeThemeObj.hex}40`,
                      backgroundColor: `${activeThemeObj.hex}10`
                    }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
              <div className="font-mono text-xs text-white font-bold flex items-center gap-2">
                <Package className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span>NRL ROBOT KIT // COMPLETE PARTS MANIFEST</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowKitImageModal(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 max-h-[80vh] overflow-y-auto flex items-center justify-center bg-slate-950/60">
              <img
                src="./robo_kit.png"
                alt="National Robotics League Robot Kit Poster Full"
                className="w-full h-auto rounded-lg object-contain"
              />
            </div>

            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
              <a
                href="https://drive.google.com/file/d/11LmpkEE8BqA1X6jXp97maQr5XPHmI8QB/view"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setShowKitImageModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
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
