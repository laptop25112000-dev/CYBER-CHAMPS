import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CustomCursor() {
  const { cursorStyle, activeThemeObj } = useTheme();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const trailRef = useRef({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (cursorStyle === 'default') return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
         target.tagName === 'A' ||
         target.tagName === 'INPUT' ||
         target.tagName === 'SELECT' ||
         target.tagName === 'TEXTAREA' ||
         target.closest('button') ||
         target.closest('a') ||
         target.classList?.contains('cursor-pointer'))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Smooth lerp loop for the trailing ring
    let animId;
    const updateTrail = () => {
      trailRef.current.x += (pos.x - trailRef.current.x) * 0.22;
      trailRef.current.y += (pos.y - trailRef.current.y) * 0.22;
      setTrailPos({ x: trailRef.current.x, y: trailRef.current.y });
      animId = requestAnimationFrame(updateTrail);
    };
    animId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [cursorStyle, pos.x, pos.y]);

  if (cursorStyle === 'default') return null;

  const color = activeThemeObj.hex;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* 1. Main Cursor Dot / Center */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 z-50"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${isClicking ? 0.7 : isHovering ? 1.6 : 1})`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`
        }}
      />

      {/* 2. Style-Specific Trailing Elements */}
      {cursorStyle === 'crosshair' && (
        <div
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0) scale(${isHovering ? 1.4 : 1})`,
          }}
        >
          {/* Circular reticle */}
          <div
            className={`w-9 h-9 rounded-full border border-dashed transition-all duration-200 ${isHovering ? 'rotate-45 scale-110' : ''}`}
            style={{ borderColor: `${color}90` }}
          />
          {/* Crosshair ticks */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-0.5 h-2" style={{ backgroundColor: color }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-0.5 h-2" style={{ backgroundColor: color }} />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 h-0.5 w-2" style={{ backgroundColor: color }} />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 h-0.5 w-2" style={{ backgroundColor: color }} />
        </div>
      )}

      {cursorStyle === 'glow' && (
        <div
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out"
          style={{
            transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0) scale(${isHovering ? 1.5 : 1})`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full border"
            style={{
              borderColor: color,
              boxShadow: `0 0 16px ${color}60`,
              backgroundColor: `${color}15`
            }}
          />
        </div>
      )}

      {cursorStyle === 'laser' && (
        <div
          className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0)`,
          }}
        >
          <div
            className="w-5 h-5 rounded-full animate-ping opacity-60"
            style={{ backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}
