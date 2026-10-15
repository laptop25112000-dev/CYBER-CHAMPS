import React, { useState, useRef } from 'react';
import Member3DAvatar from './Member3DAvatar';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { Shield, ChevronRight, Terminal, Award, Cpu } from 'lucide-react';

export default function Member3DCard({ member, onSelect }) {
  const { isLightMode, activeThemeObj } = useTheme();
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    soundManager.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleClick = () => {
    soundManager.playClick();
    onSelect(member);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'translateY(-6px)' : ''}`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out, box-shadow 0.4s ease',
      }}
      className={`group relative cursor-pointer flex flex-col justify-between p-6 rounded-xl border backdrop-blur-md transition-all duration-300 cut-corner-tl ${
        isLightMode
          ? 'bg-white/95 border-slate-200/90 shadow-md hover:shadow-2xl hover:border-slate-300'
          : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/60'
      }`}
    >
      {/* Background Neon Glow */}
      <div 
        className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-20 transition duration-500 blur-xl -z-10"
        style={{ background: `radial-gradient(circle, ${member.accentColor}, transparent 70%)` }}
      />

      {/* Top Header: Clearance & Badge */}
      <div className={`flex items-center justify-between gap-2 border-b pb-3 mb-4 ${
        isLightMode ? 'border-slate-200' : 'border-slate-800/80'
      }`}>
        <div className="flex items-center gap-2">
          <span 
            className="w-2 h-2 rounded-full animate-ping" 
            style={{ backgroundColor: member.accentColor }} 
          />
          <span className={`font-mono text-[10px] tracking-wider uppercase ${
            isLightMode ? 'text-slate-500 font-semibold' : 'text-slate-400'
          }`}>
            {member.badgeType}
          </span>
        </div>
        <div className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
          isLightMode 
            ? 'bg-slate-100 text-slate-700 border-slate-200 font-bold' 
            : 'bg-slate-950/80 text-cyan-400/90 border-cyan-500/20'
        }`}>
          ID: {member.id.toUpperCase().slice(0, 7)}
        </div>
      </div>

      {/* 3D Geometric Avatar Container */}
      <div className={`relative w-full h-36 mb-4 flex items-center justify-center overflow-hidden rounded-lg border transition-colors ${
        isLightMode 
          ? 'bg-slate-50 border-slate-200 group-hover:border-slate-300' 
          : 'bg-slate-950/50 border-slate-800/60 group-hover:border-cyan-500/30'
      }`}>
        <div className="w-28 h-28">
          <Member3DAvatar 
            shape={member.shape} 
            accentColor={member.accentColor} 
            isHovered={isHovered} 
          />
        </div>
        <div className="absolute inset-0 cyber-grid-dense opacity-20 pointer-events-none" />
      </div>

      {/* Identity & Callsign */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className={`font-['Orbitron'] text-xl font-bold transition-colors ${
            isLightMode ? 'text-slate-900 group-hover:text-slate-950' : 'text-white group-hover:text-cyan-300'
          }`}>
            {member.name}
          </h3>
          <span 
            className="font-mono text-xs px-2 py-0.5 rounded border tracking-wider font-semibold"
            style={{ 
              color: member.accentColor,
              borderColor: `${member.accentColor}40`,
              backgroundColor: `${member.accentColor}12`
            }}
          >
            {member.callsign}
          </span>
        </div>
        <p className="text-sm font-semibold mt-1" style={{ color: member.accentColor }}>
          {member.role}
        </p>
      </div>

      {/* Bio excerpt */}
      <p className={`text-xs line-clamp-2 mb-4 leading-relaxed font-sans ${
        isLightMode ? 'text-slate-600' : 'text-slate-400'
      }`}>
        {member.bio}
      </p>

      {/* Top 2 Skills with Progress Bars */}
      <div className={`space-y-2 mb-4 pt-2 border-t ${
        isLightMode ? 'border-slate-200' : 'border-slate-800/70'
      }`}>
        {member.skills.slice(0, 2).map((skill, idx) => (
          <div key={idx} className="space-y-1">
            <div className={`flex justify-between text-[11px] font-mono ${
              isLightMode ? 'text-slate-700 font-semibold' : 'text-slate-300'
            }`}>
              <span className="truncate pr-2">{skill.name}</span>
              <span style={{ color: member.accentColor }}>{skill.level}%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${
              isLightMode ? 'bg-slate-200' : 'bg-slate-800/90'
            }`}>
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${skill.level}%`,
                  background: `linear-gradient(90deg, ${member.accentColor}80, ${member.accentColor})`
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tools pills */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {member.tools.slice(0, 4).map((tool, idx) => (
          <span
            key={idx}
            className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
              isLightMode 
                ? 'bg-slate-100 text-slate-700 border-slate-200' 
                : 'bg-slate-950/70 text-slate-300 border-slate-800 group-hover:border-slate-700'
            }`}
          >
            {tool}
          </span>
        ))}
        {member.tools.length > 4 && (
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
            isLightMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-950/70 text-slate-400'
          }`}>
            +{member.tools.length - 4}
          </span>
        )}
      </div>

      {/* Action Footer */}
      <button 
        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-lg border font-mono text-xs font-semibold transition-all duration-200 ${
          isLightMode
            ? 'bg-slate-100 border-slate-200 text-slate-700 group-hover:bg-slate-900 group-hover:text-white'
            : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5" />
          INSPECT DOSSIER
        </span>
        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
