import React, { useState, useMemo } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';
import ThemeCursorControls from './components/ThemeCursorControls';
import Navbar from './components/Navbar';
import ScrollAnimated3DScene from './components/ScrollAnimated3DScene';
import NRLSection from './components/NRLSection';
import Member3DCard from './components/Member3DCard';
import MemberModal from './components/MemberModal';
import CyberLab3D from './components/CyberLab3D';
import MissionShowcase from './components/MissionShowcase';
import LiveThreatStats from './components/LiveThreatStats';
import InteractiveTerminal from './components/InteractiveTerminal';
import ContactTransmission from './components/ContactTransmission';
import Footer from './components/Footer';
import { TEAM_MEMBERS } from './data/team';
import { soundManager } from './utils/audio';
import { 
  Shield, Terminal, Cpu, Users, ChevronRight, 
  Search, Filter, Lock, Zap, Award, Trophy, ChevronDown 
} from 'lucide-react';

function MainAppContent() {
  const { activeThemeObj } = useTheme();
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
    <div className="min-h-screen bg-[#030712] text-slate-100 relative font-['Rajdhani'] selection:text-slate-950" style={{ selectionBackgroundColor: activeThemeObj.hex }}>
      {/* Background Cyber Grid with Dynamic Glow */}
      <div className="fixed inset-0 cyber-grid opacity-35 pointer-events-none -z-10" />
      <div className="fixed inset-0 scanlines opacity-35 pointer-events-none -z-10" />

      {/* Dynamic Ambient Background Aura */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-20 pointer-events-none -z-10 transition-colors duration-700"
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
                className="inline-flex items-center gap-2.5 font-mono text-xs px-3.5 py-1.5 rounded-full border backdrop-blur-md"
                style={{
                  color: activeThemeObj.hex,
                  borderColor: `${activeThemeObj.hex}50`,
                  backgroundColor: `${activeThemeObj.hex}12`
                }}
              >
                <Trophy className="w-3.5 h-3.5 animate-bounce" />
                <span>NRL 2026 // NATIONAL ROBOTICS LEAGUE HYPERDRIVE</span>
              </div>

              {/* Main Glitch Title */}
              <h1 className="font-['Orbitron'] text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
                CYBER <br />
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r transition-all duration-500"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${activeThemeObj.hex}, ${activeThemeObj.secondary}, #ffffff)`
                  }}
                >
                  CHAMPS
                </span>
              </h1>

              {/* Punchy Subheadline */}
              <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Official squad of 9 elite engineers competing in the National Robotics League (NRL) with our custom-engineered battle robo car, pioneering autonomous guidance, kinetic defense, and cyber systems.
              </p>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#nrl-car"
                  onClick={() => soundManager.playClick()}
                  className="px-6 py-3.5 rounded-xl text-slate-950 font-mono text-xs font-bold hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 shadow-md"
                  style={{
                    backgroundColor: activeThemeObj.hex,
                    boxShadow: `0 4px 25px ${activeThemeObj.bgGlow}`
                  }}
                >
                  <Zap className="w-4 h-4" />
                  INSPECT 3D ROBO CAR
                </a>

                <a
                  href="#squad"
                  onClick={() => soundManager.playClick()}
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 text-white hover:border-slate-500 border border-slate-800 font-mono text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <Users className="w-4 h-4" />
                  MEET SQUAD (09)
                </a>
              </div>

              {/* Directives Indicator */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3 font-mono text-xs text-slate-400">
                <span className="flex items-center gap-1.5" style={{ color: activeThemeObj.hex }}>
                  <Shield className="w-3.5 h-3.5" /> Titanium AR500 Chassis
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Cpu className="w-3.5 h-3.5" /> 360° Solid-State LiDAR
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Zap className="w-3.5 h-3.5" /> 4WD Brushless Motors
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
              className="inline-flex items-center gap-2 font-mono text-xs px-3.5 py-1 rounded-full border"
              style={{
                color: activeThemeObj.hex,
                borderColor: `${activeThemeObj.hex}40`,
                backgroundColor: `${activeThemeObj.hex}10`
              }}
            >
              <Users className="w-3.5 h-3.5" />
              SQUAD OPERATORS & ROBOTICS ENGINEERS
            </div>
            <h2 className="font-['Orbitron'] text-3xl sm:text-5xl font-black text-white">
              Meet The Cyber Champs
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans leading-relaxed">
              The 9 minds behind our robotics hardware, telemetry algorithms, and competitive cyber defense systems.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800 backdrop-blur-md space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search operator, skill, or tool (e.g., Mayank, LiDAR, python)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500 hover:text-white"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Counter Indicator */}
              <div className="font-mono text-xs text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeThemeObj.hex }} />
                SHOWING <span className="font-bold text-white">{filteredMembers.length}</span> OF 9 OPERATORS
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              {categories.map((cat) => {
                const isCatActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      soundManager.playHover();
                      setActiveCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                      isCatActive
                        ? 'text-slate-950 font-bold shadow-md'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
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
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <Shield className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="font-mono text-sm text-slate-300">
                No squad operators match "{searchQuery}" in this filter.
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="font-mono text-xs underline"
                style={{ color: activeThemeObj.hex }}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        {/* ========================================================
            3D LAB & ARSENAL SECTION
        ======================================================== */}
        <section id="lab" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <CyberLab3D 
            onSelectMemberByName={(name) => {
              const found = TEAM_MEMBERS.find(m => m.name.toLowerCase().includes(name.toLowerCase()));
              if (found) setSelectedMember(found);
            }} 
          />
        </section>

        {/* ========================================================
            FLAGSHIP MISSIONS SECTION
        ======================================================== */}
        <section id="missions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <MissionShowcase />
        </section>

        {/* ========================================================
            INTERACTIVE TERMINAL CONSOLE SECTION
        ======================================================== */}
        <section id="terminal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div 
              className="inline-flex items-center gap-2 font-mono text-xs px-3 py-1 rounded-full border"
              style={{
                color: activeThemeObj.hex,
                borderColor: `${activeThemeObj.hex}40`,
                backgroundColor: `${activeThemeObj.hex}10`
              }}
            >
              <Terminal className="w-3.5 h-3.5" />
              TACTICAL CLI ENVIRONMENT
            </div>
            <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-black text-white">
              Tactical Cyber Terminal
            </h2>
            <p className="text-slate-400 text-sm font-sans">
              Query squad operator profiles, NRL robo car diagnostics, and security clearances directly from the shell.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <InteractiveTerminal 
              onSelectMember={(m) => setSelectedMember(m)}
            />
          </div>
        </section>

        {/* ========================================================
            CONTACT / SECURE TRANSMISSION SECTION
        ======================================================== */}
        <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
          <ContactTransmission />
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
