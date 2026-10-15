import React, { useState, useMemo } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';
import ThemeCursorControls from './components/ThemeCursorControls';
import Navbar from './components/Navbar';
import ScrollAnimated3DScene from './components/ScrollAnimated3DScene';
import NRLSection from './components/NRLSection';
import Member3DCard from './components/Member3DCard';
import MemberModal from './components/MemberModal';
import LiveThreatStats from './components/LiveThreatStats';
import InteractiveTerminal from './components/InteractiveTerminal';
import Footer from './components/Footer';
import { TEAM_MEMBERS } from './data/team';
import { soundManager } from './utils/audio';
import { 
  Shield, Terminal, Cpu, Users, ChevronRight, 
  Search, Filter, Lock, Zap, Award, Trophy, ChevronDown 
} from 'lucide-react';

function MainAppContent() {
  const { activeThemeObj, isLightMode } = useTheme();
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered members based on search (name, skills, or tools)
  const filteredMembers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return TEAM_MEMBERS;
    return TEAM_MEMBERS.filter((m) => {
      return (
        m.name.toLowerCase().includes(q) ||
        m.tools.some(t => t.toLowerCase().includes(q)) ||
        m.skills.some(s => s.name.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  return (
    <div 
      className={`min-h-screen relative font-['Rajdhani'] transition-colors duration-300 ${
        isLightMode ? 'bg-[#f8fafc] text-slate-800' : 'bg-[#030712] text-slate-100'
      }`}
    >
      {/* Background Cyber Grid with Dynamic Glow */}
      <div className="fixed inset-0 cyber-grid opacity-35 pointer-events-none -z-10" />
      <div className="fixed inset-0 scanlines opacity-35 pointer-events-none -z-10" />

      {/* Dynamic Ambient Background Aura */}
      <div 
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] pointer-events-none -z-10 transition-colors duration-700 ${
          isLightMode ? 'opacity-15' : 'opacity-20'
        }`}
        style={{ backgroundColor: activeThemeObj.hex }}
      />

      {/* Custom Interactive Cursor */}
      <CustomCursor />

      {/* Floating Theme & Cursor Switcher HUD */}
      <ThemeCursorControls />

      {/* Floating Header */}
      <Navbar />

      {/* MAIN CONTENT CONTAINER */}
      <main className="pt-24 space-y-24 sm:space-y-32">
        {/* ========================================================
            HERO SECTION: 3D SCROLL ANIMATED ROBO CAR & TEAM IDENTITY
        ======================================================== */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Tagline, CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
              {/* Competition Badge */}
              <div 
                className="inline-flex items-center gap-2.5 font-mono text-xs font-black px-4 py-2 rounded-full border-2 border-slate-900 shadow-[3px_3px_0px_0px_#000] bg-amber-300 text-slate-950"
              >
                <Trophy className="w-4 h-4 animate-bounce" />
                <span>NRL 2026 // DELHI REGIONAL STATE LEVEL COMPETITION</span>
              </div>

              {/* Main Glitch Title */}
              <h1 className={`font-['Orbitron'] text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none ${
                isLightMode ? 'text-slate-950' : 'text-white'
              }`}>
                CYBER <br />
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r transition-all duration-500"
                  style={{
                    backgroundImage: isLightMode
                      ? `linear-gradient(90deg, ${activeThemeObj.hex}, #0f172a, ${activeThemeObj.secondary})`
                      : `linear-gradient(90deg, ${activeThemeObj.hex}, ${activeThemeObj.secondary}, #ffffff)`
                  }}
                >
                  CHAMPS
                </span>
              </h1>

              {/* Punchy Subheadline */}
              <p className={`text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 ${
                isLightMode ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Official portfolio website of our 9-member student team competing in the National Robotics League (NRL) Delhi Regional state-level championship with our custom 4WD battle robo car.
              </p>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#nrl-car"
                  onClick={() => soundManager.playClick()}
                  className="px-6 py-3.5 rounded-xl text-slate-950 font-mono text-xs font-black border-3 border-slate-900 shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                  style={{
                    backgroundColor: activeThemeObj.hex
                  }}
                >
                  <Zap className="w-4 h-4" />
                  INSPECT 3D ROBO CAR
                </a>

                <a
                  href="#squad"
                  onClick={() => soundManager.playClick()}
                  className={`px-6 py-3.5 rounded-xl border-3 border-slate-900 font-mono text-xs font-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 ${
                    isLightMode 
                      ? 'bg-white text-slate-950 hover:bg-slate-100' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  MEET THE TEAM (09)
                </a>
              </div>

              {/* Directives Indicator */}
              <div className={`pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 font-mono text-xs font-bold ${
                isLightMode ? 'text-slate-800' : 'text-slate-300'
              }`}>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000]">
                  <Shield className="w-3.5 h-3.5 text-cyan-600" /> Delhi Regional State Level
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000]">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" /> 4WD Battle Robo Car
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000]">
                  <Zap className="w-3.5 h-3.5 text-amber-600" /> National Robotics League
                </span>
              </div>
            </div>

            {/* Right Column: 3D Scroll-Animated Scene */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="w-full relative">
                <ScrollAnimated3DScene />
              </div>
            </div>
          </div>

          {/* SQUAD LIVE METRICS BAR */}
          <div className="mt-14 sm:mt-18">
            <LiveThreatStats />
          </div>
        </section>

        {/* ========================================================
            NRL BATTLE ROBO CAR & 3D MODEL VIEWER SECTION
        ======================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NRLSection />
        </section>

        {/* ========================================================
            SQUAD ROSTER (9 MEMBERS) SECTION
        ======================================================== */}
        <section id="squad" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div 
              className="inline-flex items-center gap-2 font-mono text-xs font-black px-4 py-1.5 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] bg-cyan-300 text-slate-950"
            >
              <Users className="w-3.5 h-3.5" />
              DELHI REGIONAL // TEAM (09)
            </div>
            <h2 className={`font-['Orbitron'] text-3xl sm:text-5xl font-black ${
              isLightMode ? 'text-slate-950' : 'text-white'
            }`}>
              Meet The Team
            </h2>
            <p className={`text-sm sm:text-base font-medium leading-relaxed ${
              isLightMode ? 'text-slate-700' : 'text-slate-300'
            }`}>
              The 9 students from Cyber Champs competing in the Delhi Regional state-level robotics championship.
            </p>
          </div>

          {/* Search Bar */}
          <div className={`p-4 sm:p-5 rounded-2xl border-3 sm:border-4 border-slate-900 shadow-[6px_6px_0px_0px_#000] ${
            isLightMode ? 'bg-white' : 'bg-slate-900'
          }`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-950" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search team member by name or skill (e.g., Mayank, Arduino)..."
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] text-xs font-mono font-bold focus:outline-none transition-colors ${
                    isLightMode 
                      ? 'bg-slate-50 text-slate-950 placeholder-slate-500' 
                      : 'bg-slate-950 text-white placeholder-slate-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-black text-rose-600 hover:text-rose-800"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Counter Indicator */}
              <div className="font-mono text-xs font-black flex items-center gap-2 px-3.5 py-2 rounded-lg border-2 border-slate-900 bg-amber-300 text-slate-950 shadow-[2px_2px_0px_0px_#000]">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                SHOWING <span>{filteredMembers.length}</span> OF 9 TEAM MEMBERS
              </div>
            </div>
          </div>

          {/* Members 3D Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Member3DCard
                key={member.id}
                member={member}
                onSelect={(m) => setSelectedMember(m)}
              />
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className={`p-12 text-center rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#000] space-y-3 ${
              isLightMode ? 'bg-white' : 'bg-slate-900'
            }`}>
              <Shield className="w-8 h-8 text-slate-900 mx-auto" />
              <div className="font-mono text-sm font-bold text-slate-900">
                No squad operators match "{searchQuery}" in this filter.
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="font-mono text-xs font-black underline"
                style={{ color: activeThemeObj.hex }}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        {/* ========================================================
            INTERACTIVE TERMINAL CONSOLE SECTION
        ======================================================== */}
        <section id="terminal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div 
              className="inline-flex items-center gap-2 font-mono text-xs font-black px-4 py-1.5 rounded-full border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] bg-emerald-300 text-slate-950"
            >
              <Terminal className="w-3.5 h-3.5" />
              DELHI REGIONAL // INTERACTIVE TERMINAL
            </div>
            <h2 className={`font-['Orbitron'] text-3xl sm:text-4xl font-black ${
              isLightMode ? 'text-slate-950' : 'text-white'
            }`}>
              Interactive Team Terminal
            </h2>
            <p className={`text-sm font-medium ${
              isLightMode ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Query team member profiles, Delhi Regional robo car diagnostics, and tournament kit specs.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <InteractiveTerminal 
              onSelectMember={(m) => setSelectedMember(m)}
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer onSelectMember={(m) => setSelectedMember(m)} />

      {/* TEAM MEMBER MODAL */}
      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainAppContent />
    </ThemeProvider>
  );
}
