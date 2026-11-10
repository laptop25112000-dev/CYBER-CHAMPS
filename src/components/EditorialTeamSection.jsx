import React, { useState } from 'react';
import { 
  Users, ChevronRight, CheckCircle2, GraduationCap, Sparkles,
  ExternalLink, X, Shield, Wrench, Search, Cpu, Lightbulb
} from 'lucide-react';
import { TEAM_MEMBERS, MENTORS } from '../data/team';

// Poster-style artistic SVG icons matching the official poster illustration
function PosterIcon({ type, className = "w-8 h-8" }) {
  switch (type) {
    case 'Crown':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M3 17l1.5-10 4.5 4.5L12 4l3 7.5 4.5-4.5L21 17H3z" />
          <circle cx="3.5" cy="6.5" r="1.2" fill="currentColor" />
          <circle cx="12" cy="3.5" r="1.2" fill="currentColor" />
          <circle cx="20.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
      );
    case 'Gamepad2':
    case 'SteeringWheel':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="9" />
          <line x1="4.2" y1="16.5" x2="9.4" y2="13.5" />
          <line x1="19.8" y1="16.5" x2="14.6" y2="13.5" />
        </svg>
      );
    case 'Lightbulb':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .5 2.5 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
        </svg>
      );
    case 'Cpu':
    case 'Settings':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="12" r="3.2" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'Wrench':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'UserCheck':
    case 'User':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="12" cy="7" r="4.2" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case 'Search':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 'HeartHandshake':
    case 'Handshake':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.6-4.6a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L13 12" />
          <path d="m3 7 4 4a2 2 0 0 0 2.8 0L12 9" />
          <path d="M14 6l3 3" />
          <path d="m6 18 5-5" />
        </svg>
      );
    case 'Shield':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    default:
      return <Users className={className} />;
  }
}

// Visual configuration matching the official poster colors
const POSTER_STYLE_MAP = {
  'mayank': {
    bubbleBg: 'bg-[#DCFCE7]',
    bubbleBorder: 'border-[#86EFAC]',
    iconColor: 'text-[#16A34A]',
    strokeColor: '#16A34A',
    roleColor: 'text-[#065F46]',
    accentDoodle: 'crown'
  },
  'sayan-kakkar': {
    bubbleBg: 'bg-[#E0F2FE]',
    bubbleBorder: 'border-[#7DD3FC]',
    iconColor: 'text-[#0284C7]',
    strokeColor: '#0284C7',
    roleColor: 'text-[#0369A1]',
    accentDoodle: 'driver'
  },
  'swastik': {
    bubbleBg: 'bg-[#F3E8FF]',
    bubbleBorder: 'border-[#D8B4FE]',
    iconColor: 'text-[#9333EA]',
    strokeColor: '#9333EA',
    roleColor: 'text-[#7E22CE]',
    accentDoodle: 'lightbulb'
  },
  'divyansh-mishra': {
    bubbleBg: 'bg-[#FFEDD5]',
    bubbleBorder: 'border-[#FDBA74]',
    iconColor: 'text-[#EA580C]',
    strokeColor: '#EA580C',
    roleColor: 'text-[#C2410C]',
    accentDoodle: 'tech'
  },
  'chirag-koli': {
    bubbleBg: 'bg-[#CCFBF1]',
    bubbleBorder: 'border-[#5EEAD4]',
    iconColor: 'text-[#0D9488]',
    strokeColor: '#0D9488',
    roleColor: 'text-[#0F766E]',
    accentDoodle: 'mech'
  },
  'mahika-singh': {
    bubbleBg: 'bg-[#FCE7F3]',
    bubbleBorder: 'border-[#F9A8D4]',
    iconColor: 'text-[#DB2777]',
    strokeColor: '#DB2777',
    roleColor: 'text-[#BE185D]',
    accentDoodle: 'player'
  },
  'shubh-shankar': {
    bubbleBg: 'bg-[#FEF9C3]',
    bubbleBorder: 'border-[#FDE047]',
    iconColor: 'text-[#CA8A04]',
    strokeColor: '#CA8A04',
    roleColor: 'text-[#A16207]',
    accentDoodle: 'search'
  },
  'samrat': {
    bubbleBg: 'bg-[#E0E7FF]',
    bubbleBorder: 'border-[#A5B4FC]',
    iconColor: 'text-[#4F46E5]',
    strokeColor: '#4F46E5',
    roleColor: 'text-[#4338CA]',
    accentDoodle: 'helping'
  },
  'dakshesh': {
    bubbleBg: 'bg-[#DCFCE7]',
    bubbleBorder: 'border-[#86EFAC]',
    iconColor: 'text-[#16A34A]',
    strokeColor: '#16A34A',
    roleColor: 'text-[#065F46]',
    accentDoodle: 'shield'
  }
};

export default function EditorialTeamSection() {
  const [selectedMember, setSelectedMember] = useState(null);

  // Split team members into poster rows
  const row1 = TEAM_MEMBERS.slice(0, 4); // Mayank, Sayan, Swastik, Divyansh
  const row2 = TEAM_MEMBERS.slice(4, 8); // Chirag, Mahika, Shubh, Samrat
  const row3 = TEAM_MEMBERS.slice(8, 9); // Dakshesh

  const renderPosterCard = (member) => {
    const style = POSTER_STYLE_MAP[member.id] || {
      bubbleBg: 'bg-emerald-50',
      bubbleBorder: 'border-emerald-200',
      iconColor: 'text-emerald-600',
      strokeColor: '#059669',
      roleColor: 'text-[#065F46]'
    };

    return (
      <div
        key={member.id}
        onClick={() => setSelectedMember(member)}
        className="group relative bg-white rounded-2xl border-2 border-[#E2E8F0] hover:border-[#0284C7] p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col items-center justify-between text-center min-h-[190px]"
      >
        {/* Soft Organic Pastel Bubble with Icon and Hand-drawn Sparkles */}
        <div className="relative mb-3.5">
          <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-[22px] ${style.bubbleBg} border ${style.bubbleBorder} flex items-center justify-center ${style.iconColor} shadow-inner group-hover:scale-105 transition-transform duration-300`}>
            <PosterIcon type={member.roleIcon} className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          {/* Decorative Sparkle Doodles matching poster */}
          <div className="absolute -top-1 -right-2 text-xs font-mono font-bold opacity-80 select-none pointer-events-none" style={{ color: style.strokeColor }}>
            ✦
          </div>
          <div className="absolute -bottom-1 -left-2 text-[10px] font-mono font-bold opacity-60 select-none pointer-events-none" style={{ color: style.strokeColor }}>
            /
          </div>
        </div>

        {/* Official Role in Bold Dark Teal / Slate Caps */}
        <div className="space-y-1 w-full">
          <div className={`text-xs sm:text-sm font-extrabold tracking-wider uppercase font-mono ${style.roleColor}`}>
            {member.role}
          </div>

          {/* Member Name in Cursive Script Typography */}
          <div className="font-['Caveat',cursive] text-2xl sm:text-3xl font-bold text-[#1E3A8A] leading-tight group-hover:text-[#0284C7] transition-colors">
            {member.name}
          </div>
        </div>

        {/* Small subtle hover indicator */}
        <div className="mt-2 text-[11px] font-mono font-semibold text-slate-400 group-hover:text-slate-600 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <span>Inspect</span>
          <ChevronRight className="w-3 h-3 text-[#0284C7]" />
        </div>
      </div>
    );
  };

  return (
    <section id="team" className="py-20 sm:py-28 bg-[#F4F6F0] border-b border-[#D8D8D3] scroll-mt-20 relative overflow-hidden">
      
      {/* Background Subtle Paper Texture & Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 space-y-12">
        
        {/* POSTER MAIN CONTAINER (Matches the official competition poster sheet) */}
        <div className="bg-[#FAF9F2] border-2 border-[#DCE4CF] rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 lg:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.06)] relative overflow-hidden">
          
          {/* Poster Top Bar: NRL Logo on left, "Build · Innovate · Compete" sketch on right */}
          <div className="flex items-center justify-between gap-4 border-b border-[#E2E8D8] pb-6 mb-8">
            {/* NRL Gear Logo on Left */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-2 flex items-center justify-center text-white shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-mono text-xs sm:text-sm font-black tracking-wider text-[#065F46] uppercase leading-tight">
                  NATIONAL
                </div>
                <div className="font-mono text-xs sm:text-sm font-black tracking-wider text-[#0F766E] uppercase leading-tight">
                  ROBOTICS LEAGUE
                </div>
              </div>
            </div>

            {/* "Build · Innovate · Compete" Playful Sketch Badge on Right */}
            <div className="text-right">
              <div className="font-['Caveat',cursive] text-lg sm:text-2xl font-bold text-[#0284C7] leading-tight">
                Build · Innovate
              </div>
              <div className="font-['Caveat',cursive] text-lg sm:text-2xl font-bold text-[#0284C7] leading-tight flex items-center justify-end gap-1">
                <span>· Compete</span>
                <span className="text-amber-500 font-sans text-xs">✨</span>
              </div>
            </div>
          </div>

          {/* Poster Center Header Title */}
          <div className="text-center space-y-2 mb-10">
            {/* T E A M in playful spaced emerald letters */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-emerald-500 text-sm">✦</span>
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-[0.35em] text-[#059669] uppercase">
                T E A M
              </span>
              <span className="text-emerald-500 text-sm">✦</span>
            </div>

            {/* CYBER CHAMPS in large bold display font with soft green mint background highlight */}
            <div className="inline-block relative">
              <div className="absolute -inset-x-6 -inset-y-2 bg-[#D1FAE5]/60 rounded-full -z-10 blur-[1px]" />
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F4C5C] uppercase font-sans">
                CYBER CHAMPS
              </h2>
            </div>

            {/* — MEET OUR TEAM — */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="w-12 sm:w-16 h-0.5 bg-[#059669]/40" />
              <span className="font-mono text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#059669]">
                MEET OUR TEAM
              </span>
              <div className="w-12 sm:w-16 h-0.5 bg-[#059669]/40" />
            </div>

            {/* Poster Motto */}
            <p className="font-serif italic text-base sm:text-lg text-[#0F4C5C]/80 font-medium">
              Different Roles &nbsp;|&nbsp; One Goal &nbsp;|&nbsp; A Smarter Tomorrow
            </p>
          </div>

          {/* 9 MEMBERS POSTER GRID: 4 in Row 1, 4 in Row 2, 1 Centered in Row 3 */}
          <div className="space-y-4 sm:space-y-6">
            
            {/* Row 1: TEAM LEAD, DRIVER, STRATEGIST, TECHNICAL */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              {row1.map(renderPosterCard)}
            </div>

            {/* Row 2: MECHANICAL, HUMAN PLAYER, RESEARCH, HELPING */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
              {row2.map(renderPosterCard)}
            </div>

            {/* Row 3: SUPPORTING (Centered 1 Card) */}
            <div className="flex justify-center">
              <div className="w-full max-w-[280px]">
                {row3.map(renderPosterCard)}
              </div>
            </div>

          </div>

          {/* OUR MENTORS SECTION (With Vipul Gupta Sir, Iqbal Kaur Mam, and Cartoon Mascot) */}
          <div className="mt-10 pt-6">
            <div className="bg-[#EAF7EE] border-2 border-[#A3E0BA] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              
              {/* "Our Mentors" Badge Pill */}
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#059669] text-white font-['Caveat',cursive] text-lg sm:text-xl font-bold shadow-sm mb-6">
                <span>✦</span>
                <span>Our Mentors</span>
                <span>✦</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* 2 Mentors Cards (Span 8 on desktop) */}
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {MENTORS.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="bg-white rounded-2xl border-2 border-[#C6F0D8] p-5 shadow-sm text-center flex flex-col items-center space-y-3"
                    >
                      {/* Pastel Bubble Avatar */}
                      <div className={`w-14 h-14 rounded-full ${mentor.badgeColor.split(' ')[0]} border ${mentor.badgeColor.split(' ')[2]} flex items-center justify-center text-[#1E3A8A]`}>
                        <PosterIcon type="User" className="w-7 h-7" />
                      </div>

                      {/* Mentor Name in Cursive Script */}
                      <div className="space-y-1">
                        <div className="font-['Caveat',cursive] text-2xl sm:text-3xl font-bold text-[#1E3A8A]">
                          {mentor.name}
                        </div>
                        <div className="font-mono text-xs font-black uppercase tracking-widest text-[#059669]">
                          {mentor.role}
                        </div>
                        <div className="text-xs font-mono text-slate-500 pt-1">
                          {mentor.designation}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1 border-t border-slate-100">
                        {mentor.bio}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Cartoon Robot Mascot (Span 4 on desktop) */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 relative">
                  <div className="relative w-40 sm:w-48 h-40 sm:h-48 group">
                    <img
                      src={`${import.meta.env.BASE_URL}cyber-champs-logo-transparent.png`}
                      alt="Cyber Champs Robot Mascot"
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Little cute speech / doodle accents */}
                    <div className="absolute -top-2 right-2 text-xs font-mono font-bold text-[#059669] bg-white/90 px-2 py-0.5 rounded-full border border-emerald-200 shadow-xs">
                      Team #291
                    </div>
                  </div>
                  <div className="font-mono text-[11px] font-bold text-[#065F46] uppercase tracking-wider mt-2">
                    INNOVERTERS OF FUTURE
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Member Modal for Full Engineering Details */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border-2 border-slate-300 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 text-left relative">
              
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-xs font-mono font-bold uppercase tracking-wider mb-2 ${selectedMember.roleBadgeColor || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    <span>{selectedMember.role}</span>
                  </div>
                  <h3 className="font-['Caveat',cursive] text-4xl font-bold text-[#1E3A8A]">
                    {selectedMember.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    {selectedMember.roleCategory} · TEAM #291
                  </span>
                </div>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl text-slate-500 hover:text-black hover:bg-slate-100 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-base text-slate-800 leading-relaxed font-normal">
                {selectedMember.bio}
              </p>

              {selectedMember.quote && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm italic text-slate-700 font-serif">
                  "{selectedMember.quote}"
                </div>
              )}

              <div className="space-y-2">
                <span className="font-mono text-xs uppercase text-slate-600 block font-bold">
                  CORE TECHNICAL COMPETENCIES
                </span>
                <div className="space-y-1.5">
                  {(selectedMember.skills || []).map((sk, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAFAFA] border border-slate-200 text-sm font-mono text-slate-800">
                      <span>{sk.name}</span>
                      <span className="text-[#059669] font-bold">{sk.level}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMember.achievements && (
                <div className="space-y-1.5">
                  <span className="font-mono text-xs uppercase text-slate-600 block font-bold">
                    CONTRIBUTIONS TO ROBOT BUILD
                  </span>
                  {selectedMember.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#F04438] shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedMember(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F4C5C] text-white text-sm font-mono font-bold hover:bg-[#08303b] transition-colors shadow-sm"
                >
                  CLOSE PROFILE
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
