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
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Category filter tabs
  const categories = [
    { id: 'all', label: 'All Operators', count: 9 },
    { id: 'leadership', label: 'Command & Arch', count: 1 },
    { id: 'offensive', label: 'Offensive & Red Team', count: 1 },
    { id: 'web3-crypto', label: 'Web3 & Cryptography', count: 2 },
    { id: 'defensive', label: 'Defensive & Forensics', count: 2 },
    { id: 'ai-cloud', label: 'AI & Systems', count: 1 },
    { id: 'systems', label: '3D UI & DevSecOps', count: 2 },
  ];

  // Filtered members based on tab and search
  const filteredMembers = useMemo(() => {
    return TEAM_MEMBERS.filter((m) => {
      const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.callsign.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.specialization.toLowerCase().includes(q) ||
        m.tools.some(t => t.toLowerCase().includes(q)) ||
        m.skills.some(s => s.name.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

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
                <span>NRL 2026 // NATIONAL ROBOTICS LEAGUE HYPERDRIVE</span>
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
                Official squad of 9 elite engineers competing in the National Robotics League (NRL) with our custom-engineered battle robo car, pioneering autonomous guidance, kinetic defense, and cyber systems.
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
                  MEET SQUAD (09)
                </a>
              </div>

              {/* Directives Indicator */}
              <div className={`pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 font-mono text-xs font-bold ${
                isLightMode ? 'text-slate-800' : 'text-slate-300'
              }`}>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000]">
                  <Shield className="w-3.5 h-3.5 text-cyan-600" /> Acrylic / Metal Chassis
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000]">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" /> HEXA Core Telemetry
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_#000]">
                  <Zap className="w-3.5 h-3.5 text-amber-600" /> 4WD Motors + Gripper
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
              SQUAD OPERATORS & ROBOTICS ENGINEERS
            </div>
            <h2 className={`font-['Orbitron'] text-3xl sm:text-5xl font-black ${
              isLightMode ? 'text-slate-950' : 'text-white'
            }`}>
              Meet The Cyber Champs
            </h2>
            <p className={`text-sm sm:text-base font-medium leading-relaxed ${
              isLightMode ? 'text-slate-700' : 'text-slate-300'
            }`}>
              The 9 minds behind our robotics hardware, telemetry algorithms, and competitive cyber defense systems.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className={`p-4 sm:p-6 rounded-2xl border-3 sm:border-4 border-slate-900 shadow-[6px_6px_0px_0px_#000] space-y-4 ${
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
                  placeholder="Search operator, skill, or tool (e.g., Mayank, LiDAR, python)..."
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
              <div className="font-mono text-xs font-black flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 border-slate-900 bg-amber-300 text-slate-950 shadow-[2px_2px_0px_0px_#000]">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950" />
                SHOWING <span>{filteredMembers.length}</span> OF 9 OPERATORS
              </div>
            </div>

            {/* Filter Tabs */}
            <div className={`flex flex-wrap items-center gap-2 pt-2 border-t-2 border-slate-900`}>
              {categories.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playHover();
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                      isCatActive
                        ? 'text-slate-950'
                        : isLightMode
                        ? 'bg-white text-slate-800 hover:bg-slate-100'
                        : 'bg-slate-950 text-slate-300 hover:text-white'
                    }`}
                    style={{
                      backgroundColor: isCatActive ? activeThemeObj.hex : undefined
                    }}
                  >
                    {cat.label} ({cat.count})
                  </button>
                );
              })}
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
              TACTICAL CLI ENVIRONMENT
            </div>
            <h2 className={`font-['Orbitron'] text-3xl sm:text-4xl font-black ${
              isLightMode ? 'text-slate-950' : 'text-white'
            }`}>
              Tactical Cyber Terminal
            </h2>
            <p className={`text-sm font-medium ${
              isLightMode ? 'text-slate-700' : 'text-slate-300'
            }`}>
              Query squad operator profiles, NRL robo car diagnostics, and security clearances directly from the shell.
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

      {/* OPERATOR DOSSIER MODAL */}
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
