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

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;

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
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${isHovered ? 'translateY(-4px)' : ''}`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out, box-shadow 0.3s ease',
      }}
      className={`group relative cursor-pointer flex flex-col justify-between p-6 rounded-2xl border-2 border-slate-900 bg-white transition-all duration-200 ${
        isHovered ? 'shadow-[7px_7px_0px_0px_#0f172a]' : 'shadow-[4px_4px_0px_0px_#0f172a]'
      }`}
    >
      {/* Top Header: Clearance & Badge */}
      <div className="flex items-center justify-between gap-2 border-b-2 border-slate-900 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span 
            className="w-2.5 h-2.5 rounded-full border border-slate-900" 
            style={{ backgroundColor: member.accentColor }} 
          />
          <span className="font-mono text-[11px] font-black tracking-wider uppercase text-slate-900">
            {member.badgeType}
          </span>
        </div>
        <div className="font-mono text-[10px] px-2 py-0.5 rounded border border-slate-900 bg-slate-100 text-slate-900 font-extrabold shadow-[1.5px_1.5px_0px_0px_#0f172a]">
          ID: {member.id.toUpperCase().slice(0, 7)}
        </div>
      </div>

      {/* 3D Geometric Avatar Container */}
      <div className="relative w-full h-36 mb-4 flex items-center justify-center overflow-hidden rounded-xl border-2 border-slate-900 bg-slate-50 shadow-[2px_2px_0px_0px_#0f172a]">
        <div className="w-28 h-28">
          <Member3DAvatar 
            shape={member.shape} 
            accentColor={member.accentColor} 
            isHovered={isHovered} 
          />
        </div>
        <div className="absolute inset-0 neo-grid-dots opacity-40 pointer-events-none" />
      </div>

      {/* Identity & Callsign */}
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-['Orbitron'] text-xl font-black text-slate-950 group-hover:underline">
            {member.name}
          </h3>
          <span 
            className="font-mono text-xs px-2.5 py-0.5 rounded-lg border-2 border-slate-900 font-black shadow-[2px_2px_0px_0px_#0f172a]"
            style={{ 
              backgroundColor: `${member.accentColor}30`,
              color: '#0f172a'
            }}
          >
            {member.callsign}
          </span>
        </div>
        <p className="text-sm font-extrabold mt-1" style={{ color: member.accentColor }}>
          {member.role}
        </p>
      </div>

      {/* Bio excerpt */}
      <p className="text-xs font-sans font-medium text-slate-600 line-clamp-2 mb-4 leading-relaxed">
        {member.bio}
      </p>

      {/* Top 2 Skills with Progress Bars */}
      <div className="space-y-2 mb-4 pt-2 border-t-2 border-slate-900">
        {member.skills.slice(0, 2).map((skill, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-900 font-bold">
              <span className="truncate pr-2">{skill.name}</span>
              <span>{skill.level}%</span>
            </div>
            <div className="w-full h-2 rounded-full border border-slate-900 bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${skill.level}%`,
                  backgroundColor: member.accentColor
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
            className="font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-slate-900 bg-white shadow-[1.5px_1.5px_0px_0px_#0f172a] text-slate-800"
          >
            {tool}
          </span>
        ))}
        {member.tools.length > 4 && (
          <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-900 bg-slate-100 text-slate-600">
            +{member.tools.length - 4}
          </span>
        )}
      </div>

      {/* Action Footer */}
      <button 
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-slate-900 bg-slate-900 text-white font-mono text-xs font-black shadow-[3px_3px_0px_0px_#0f172a] group-hover:bg-slate-800 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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
