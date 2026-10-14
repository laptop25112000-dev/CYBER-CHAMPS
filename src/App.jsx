import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import CyberHeroCanvas from './components/CyberHeroCanvas';
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
  Search, Filter, Lock, Zap, Award, Sparkles 
} from 'lucide-react';

export default function App() {
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
    <div className="min-h-screen bg-[#030712] text-slate-100 relative selection:bg-cyan-500 selection:text-slate-950 font-['Rajdhani']">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 cyber-grid opacity-35 pointer-events-none -z-10" />

      {/* Subtle Scanlines */}
      <div className="fixed inset-0 scanlines opacity-40 pointer-events-none -z-10" />

      {/* Floating Header */}
      <Navbar />

      {/* MAIN CONTENT CONTAINER */}
      <main className="pt-24 space-y-24 sm:space-y-32">
        {/* ========================================================
            HERO SECTION: 3D CYBER CORE & SQUAD IDENTITY
        ======================================================== */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Heading, Tagline, CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 font-mono text-xs px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>OFFICIAL PORTFOLIO // 9 ELITE OPERATORS</span>
              </div>

              {/* Main Glitch Title */}
              <h1 className="font-['Orbitron'] text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
                CYBER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-glow-cyan">
                  CHAMPS
                </span>
              </h1>

              {/* Punchy Subheadline */}
              <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                A multidisciplinary strike team of 9 cybersecurity researchers, exploit developers, post-quantum cryptographers, and autonomous systems engineers.
              </p>

              {/* Quick Action CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#squad"
                  onClick={() => soundManager.playClick()}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono text-xs font-bold hover:shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Users className="w-4 h-4" />
                  EXPLORE THE SQUAD (09)
                </a>

                <a
                  href="#terminal"
                  onClick={() => soundManager.playClick()}
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-mono text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <Terminal className="w-4 h-4" />
                  LAUNCH CLI TERMINAL
                </a>
              </div>

              {/* Security Directives Pills */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 font-mono text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Lock className="w-3.5 h-3.5" /> 100% Defense Verified
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1.5 text-purple-400">
                  <Shield className="w-3.5 h-3.5" /> Zero-Day Research
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Cpu className="w-3.5 h-3.5" /> Post-Quantum Ready
                </span>
              </div>
            </div>

            {/* Right Column: 3D Holographic Cyber Hero Canvas */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="w-full relative">
                <CyberHeroCanvas />
              </div>
            </div>
          </div>

          {/* SQUAD LIVE METRICS BAR */}
          <div className="mt-14 sm:mt-20">
            <LiveThreatStats />
          </div>
        </section>

        {/* ========================================================
            SQUAD ROSTER (9 MEMBERS) SECTION
        ======================================================== */}
        <section id="squad" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
              <Users className="w-3.5 h-3.5" />
              TACTICAL COMBAT ROSTER
            </div>
            <h2 className="font-['Orbitron'] text-3xl sm:text-5xl font-black text-white">
              Meet The Cyber Champs
            </h2>
            <p className="text-slate-400 text-sm sm:text-base font-sans leading-relaxed">
              Nine specialists united by a single mission: uncovering critical vulnerabilities, neutralizing nation-state attacks, and engineering resilient digital defense systems.
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
                  placeholder="Search operator, skill, or tool (e.g., Mayank, kernel, python)..."
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
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                SHOWING <span className="text-cyan-300 font-bold">{filteredMembers.length}</span> OF 9 OPERATORS
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playHover();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                    activeCategory === cat.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
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
                className="font-mono text-xs text-cyan-400 underline"
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
            <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/30">
              <Terminal className="w-3.5 h-3.5" />
              RESTRICTED SHELL ACCESS
            </div>
            <h2 className="font-['Orbitron'] text-3xl sm:text-4xl font-black text-white">
              Tactical Cyber Terminal
            </h2>
            <p className="text-slate-400 text-sm font-sans">
              Interact directly with the Cyber Champs squad database. Query member records, execute diagnostics, and review classified mission files.
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
