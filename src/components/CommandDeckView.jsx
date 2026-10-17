import React, { useState, useEffect } from 'react';
import RoboCar3DModel from './RoboCar3DModel';
import ExplodedCADScrubber from './ExplodedCADScrubber';
import NRLArenaTactics from './NRLArenaTactics';
import InteractiveTerminal from './InteractiveTerminal';
import Member3DAvatar from './Member3DAvatar';
import { TEAM_MEMBERS } from '../data/team';
import { soundManager } from '../utils/audio';
import { 
  Trophy, Shield, Terminal, Zap, Sparkles, Users, 
  Target, Cpu, Clock, Play, Pause, RotateCcw, Award, CheckCircle2, ChevronRight, Eye
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CommandDeckView({ onSelectMember }) {
  const [activeTab, setActiveTab] = useState('3d'); // '3d' or 'exploded'
  const [selectedSquadMember, setSelectedSquadMember] = useState(TEAM_MEMBERS[0]);
  
  // Arena Match Countdown Clock
  const [matchSeconds, setMatchSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && matchSeconds > 0) {
      interval = setInterval(() => {
        setMatchSeconds(s => s - 1);
      }, 1000);
    } else if (matchSeconds === 0) {
      soundManager.playAccessGranted();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#000000', '#fbbf24', '#38bdf8', '#4ade80']
      });
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, matchSeconds]);

  const toggleTimer = () => {
    soundManager.playClick();
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    soundManager.playClick();
    setIsTimerRunning(false);
    setMatchSeconds(120);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Pit-Wall Master Status Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9EB] border-4 border-black shadow-[6px_6px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl border-3 border-black bg-[#FEF08A] shadow-[3px_3px_0px_0px_#000] flex items-center justify-center font-black">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-black uppercase text-slate-800">
              <span>DELHI REGIONAL PIT-WALL COMMAND</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE TELEMETRY STREAM</span>
            </div>
            <h1 className="font-['Orbitron'] text-xl sm:text-2xl font-black text-black">
              Cyber Champs Tactical Deck
            </h1>
          </div>
        </div>

        {/* Live Match Clock HUD */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="p-2 sm:p-3 rounded-xl border-2 border-black bg-[#FEF08A] shadow-[3px_3px_0px_0px_#000] flex items-center gap-3 font-mono">
            <div>
              <span className="text-[9px] font-black uppercase text-black block">HYPERDRIVE CLOCK</span>
              <span className="font-['Orbitron'] text-2xl font-black text-black">
                {formatTime(matchSeconds)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTimer}
                className="p-1.5 rounded-lg border border-black bg-black text-[#FAF5E6] hover:bg-[#1a1a1a]"
                title={isTimerRunning ? 'Pause Match Clock' : 'Start Match Clock'}
              >
                {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-1.5 rounded-lg border border-black bg-[#FAF5E6] text-black hover:bg-slate-200"
                title="Reset Match Clock"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 font-mono text-xs font-black">
            <div className="px-3 py-2 rounded-xl border-2 border-black bg-[#BBF7D0] shadow-[2px_2px_0px_0px_#000]">
              VOLTS: 12.4V
            </div>
            <div className="px-3 py-2 rounded-xl border-2 border-black bg-[#BAE6FD] shadow-[2px_2px_0px_0px_#000]">
              RF: 2.4GHz LINK
            </div>
            <div className="px-3 py-2 rounded-xl border-2 border-black bg-[#FECDD3] shadow-[2px_2px_0px_0px_#000]">
              MEMBERS: 09/09
            </div>
          </div>
        </div>
      </div>

      {/* Primary Cockpit Grid: 3D Viewport on Left, Tactical Control on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 3D Robo Car Viewport & Exploded Disassembly */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main 3D Viewport Card */}
          <div className="rounded-2xl border-4 border-black bg-[#FFF9EB] shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            {/* Viewport Sub-header */}
            <div className="flex items-center justify-between p-4 bg-[#FEF08A] border-b-3 border-black font-mono text-xs font-black">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-black" />
                <span>NRL 4WD ROBO CAR // LIVE VIEWPORT</span>
              </div>

              {/* View Switcher: WebGL vs CAD Exploded */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('3d');
                  }}
                  className={`px-3 py-1 rounded-lg border border-black font-black text-xs transition-all ${
                    activeTab === '3d' ? 'bg-black text-[#FEF08A] shadow-[2px_2px_0px_0px_#000]' : 'bg-[#FFF9EB] text-black'
                  }`}
                >
                  3D TELEMETRY &amp; DRIVE
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveTab('exploded');
                  }}
                  className={`px-3 py-1 rounded-lg border border-black font-black text-xs transition-all ${
                    activeTab === 'exploded' ? 'bg-black text-[#FEF08A] shadow-[2px_2px_0px_0px_#000]' : 'bg-[#FFF9EB] text-black'
                  }`}
                >
                  CAD DISASSEMBLY (300 FRAMES)
                </button>
              </div>
            </div>

            {/* Viewport Content */}
            <div className="p-3">
              {activeTab === '3d' ? (
                <div className="h-[460px] sm:h-[520px]">
                  <RoboCar3DModel autoRotate={false} />
                </div>
              ) : (
                <div className="min-h-[460px]">
                  <ExplodedCADScrubber />
                </div>
              )}
            </div>
          </div>

          {/* Arena Strategy Blueprint Card */}
          <div className="rounded-2xl border-4 border-black bg-[#FFF9EB] shadow-[6px_6px_0px_0px_#000] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <span className="font-mono text-xs font-black text-black flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-600" />
                TOURNAMENT MATCH TACTICS &amp; POINT PROJECTOR
              </span>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#FEF08A] border border-black">
                HYPERDRIVE RULES
              </span>
            </div>
            <NRLArenaTactics />
          </div>
        </div>

        {/* RIGHT COLUMN: Squad Operative Selector (9 Members) & Terminal */}
        <div className="lg:col-span-5 space-y-6">
          {/* Squad Roster Interactive Dock */}
          <div className="p-6 rounded-2xl border-4 border-black bg-[#FFF9EB] shadow-[6px_6px_0px_0px_#000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2 font-mono text-xs font-black text-black">
                <Users className="w-4 h-4" />
                <span>SQUAD DOSSIER DIRECTORY (09 MEMBERS)</span>
              </div>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-[#BBF7D0] border border-black text-black">
                DELHI REGIONAL
              </span>
            </div>

            {/* 9 Member Mini-Tabs */}
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {TEAM_MEMBERS.map((m) => {
                const isSelected = selectedSquadMember.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedSquadMember(m);
                    }}
                    className={`p-2.5 rounded-xl border-2 border-black text-left font-black transition-all shadow-[2px_2px_0px_0px_#000] ${
                      isSelected 
                        ? 'bg-[#FEF08A] text-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5' 
                        : 'bg-[#FAF5E6] text-black hover:bg-[#FED7AA]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full border border-black" style={{ backgroundColor: m.accentColor }} />
                      <span className="text-[10px] font-bold text-slate-700">#0{TEAM_MEMBERS.indexOf(m)+1}</span>
                    </div>
                    <div className="truncate font-black text-xs">{m.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Member Spotlight Card */}
            {selectedSquadMember && (
              <div className="p-4 rounded-xl border-3 border-black bg-[#FAF5E6] shadow-[4px_4px_0px_0px_#000] space-y-3">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: selectedSquadMember.accentColor }} />
                    <h3 className="font-['Orbitron'] text-lg font-black text-black">
                      {selectedSquadMember.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      soundManager.playClick();
                      if (onSelectMember) onSelectMember(selectedSquadMember);
                    }}
                    className="font-mono text-[11px] font-black px-2.5 py-1 rounded-lg border border-black bg-[#FEF08A] text-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-[#fed7aa] flex items-center gap-1"
                  >
                    <span>Full Profile</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Geometric 3D Shape Preview */}
                  <div className="w-24 h-24 shrink-0 rounded-xl border-2 border-black bg-[#FFF9EB] flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_#000]">
                    <div className="w-20 h-20">
                      <Member3DAvatar 
                        shape={selectedSquadMember.shape} 
                        accentColor={selectedSquadMember.accentColor} 
                        isHovered={true} 
                      />
                    </div>
                  </div>

                  {/* Member Bio & Core Tools */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-xs font-sans font-medium text-slate-800 line-clamp-3 leading-relaxed">
                      {selectedSquadMember.bio}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedSquadMember.tools.slice(0, 3).map((t, i) => (
                        <span key={i} className="font-mono text-[9px] font-black px-1.5 py-0.5 rounded border border-black bg-[#FEF08A] text-black">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Skills Bars */}
                <div className="space-y-1.5 pt-2 border-t border-black/20">
                  {selectedSquadMember.skills.slice(0, 2).map((s, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between font-mono text-[10px] font-bold text-black">
                        <span>{s.name}</span>
                        <span>{s.level}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full border border-black bg-[#FFF9EB] overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${s.level}%`, backgroundColor: selectedSquadMember.accentColor }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Command Terminal */}
          <div className="space-y-3">
            <InteractiveTerminal onSelectMember={onSelectMember} />
          </div>
        </div>
      </div>
    </div>
  );
}
