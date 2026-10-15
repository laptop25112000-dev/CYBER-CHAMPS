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
          className="inline-flex items-center gap-2 font-mono text-xs font-black px-4 py-1.5 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] bg-white"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>NATIONAL ROBOTICS LEAGUE™ // DELHI REGIONAL COMPETITION</span>
        </div>

        <h2 className="font-['Orbitron'] text-3xl sm:text-5xl font-black text-slate-950">
          Our NRL Battle Robo Car
        </h2>

        <p className="text-slate-600 text-sm sm:text-base font-sans font-medium leading-relaxed">
          Engineered for the <strong>National Robotics League™ Delhi Regional State-Level Competition</strong> using the official tournament Robot Kit. Hover over any component on the 3D model below to inspect real-time hardware telemetry.
        </p>
      </div>

      {/* Main 3D Model & Interactive Hover Inspector */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 font-bold">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: activeThemeObj.hex }} />
            <strong className="text-slate-900 uppercase">3D Hyperrealistic Telemetry:</strong>
            <span className="text-slate-600">Hover mouse over claw, wheels, PCB hub, or chassis to inspect.</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowKitImageModal(true);
            }}
            className="neo-btn px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold"
          >
            <ImageIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>VIEW OFFICIAL KIT POSTER</span>
          </button>
        </div>

        {/* 3D Canvas Box */}
        <div className="h-[480px] sm:h-[560px]">
          <RoboCar3DModel autoRotate={false} />
        </div>
      </div>

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
              className="relative rounded-xl overflow-hidden border-2 border-slate-900 cursor-pointer shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all bg-white"
            >
              <img
                src="./robo_kit.png"
                alt="National Robotics League Robot Kit Poster"
                className="w-full h-72 sm:h-80 object-cover object-top filter brightness-98 group-hover:brightness-105 transition-all group-hover:scale-102 duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-slate-900 bg-white/95 px-3.5 py-2 rounded-lg border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000]">
                <span className="flex items-center gap-2 font-black">
                  <Eye className="w-4 h-4 text-slate-900" />
                  Click to Expand Full Resolution Poster
                </span>
                <span className="text-[10px] font-bold text-slate-600">NRL_KIT.PNG</span>
              </div>
            </div>

            {/* Video Link */}
            <div className="mt-4 pt-4 border-t-2 border-slate-900 flex items-center justify-between">
              <div className="text-xs text-slate-600 font-sans font-semibold">
                Official HYPERDRIVE match arena rules and video:
              </div>
              <a
                href="https://youtu.be/C0-qp_30QFk?si=48g3O7u7qas8O-7q"
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="neo-btn px-3.5 py-1.5 rounded-lg bg-red-400 text-slate-950 font-mono text-xs"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950 mr-1.5" />
                <span>Arena Video</span>
              </a>
            </div>
          </div>
        </div>

        {/* Kit Parts Inventory */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl neo-box-lg">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
              <div className="font-mono text-xs font-black text-slate-950 tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span>ROBOT KIT INVENTORY BREAKDOWN</span>
              </div>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded border border-slate-900 bg-slate-100">
                10 CORE ASSEMBLIES
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {kitInventory.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border-2 border-slate-900 bg-white shadow-[3px_3px_0px_0px_#000] font-mono text-xs"
                >
                  <div>
                    <div className="text-slate-950 font-black flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeThemeObj.hex }} />
                      <span>{item.item}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-sans font-medium mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  <span 
                    className="font-mono text-xs px-2.5 py-1 rounded-lg border-2 border-slate-900 font-black shrink-0"
                    style={{
                      backgroundColor: `${activeThemeObj.hex}30`
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-3xl w-full bg-white border-3 border-slate-900 shadow-[8px_8px_0px_0px_#000] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100 border-b-2 border-slate-900">
              <div className="font-mono text-xs text-slate-950 font-black flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>NRL ROBOT KIT // COMPLETE PARTS MANIFEST</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowKitImageModal(false);
                }}
                className="p-1.5 rounded-lg border-2 border-slate-900 bg-white hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-900" />
              </button>
            </div>

            <div className="p-4 max-h-[80vh] overflow-y-auto flex items-center justify-center bg-slate-50">
              <img
                src="./robo_kit.png"
                alt="National Robotics League Robot Kit Poster Full"
                className="w-full h-auto rounded-lg object-contain border-2 border-slate-900"
              />
            </div>

            <div className="px-5 py-3.5 bg-slate-100 border-t-2 border-slate-900 flex items-center justify-between font-mono text-xs">
              <a
                href="https://drive.google.com/file/d/11LmpkEE8BqA1X6jXp97maQr5XPHmI8QB/view"
                target="_blank"
                rel="noreferrer"
                className="text-slate-900 font-black hover:underline flex items-center gap-1.5"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setShowKitImageModal(false)}
                className="neo-btn px-4 py-1.5 rounded-lg bg-slate-900 text-white text-xs"
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
