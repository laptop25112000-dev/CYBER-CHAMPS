import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEME_COLORS = [
  { id: 'cyan', name: 'Cyber Cyan', hex: '#00f0ff', secondary: '#3b82f6', bgGlow: 'rgba(0, 240, 255, 0.25)' },
  { id: 'emerald', name: 'Laser Emerald', hex: '#10b981', secondary: '#06b6d4', bgGlow: 'rgba(16, 185, 129, 0.25)' },
  { id: 'crimson', name: 'Crimson Fury', hex: '#ff0055', secondary: '#ec4899', bgGlow: 'rgba(255, 0, 85, 0.25)' },
  { id: 'amber', name: 'Solar Amber', hex: '#f59e0b', secondary: '#ef4444', bgGlow: 'rgba(245, 158, 11, 0.25)' },
  { id: 'purple', name: 'Hyperdrive Purple', hex: '#a855f7', secondary: '#6366f1', bgGlow: 'rgba(168, 85, 247, 0.25)' },
  { id: 'orange', name: 'Robo Orange', hex: '#ff6b00', secondary: '#eab308', bgGlow: 'rgba(255, 107, 0, 0.25)' },
];

export const CURSOR_STYLES = [
  { id: 'crosshair', name: 'Cyber Crosshair', desc: 'Tactical targeting reticle' },
  { id: 'glow', name: 'Neon Ring Glow', desc: 'Fluid trailing pulse' },
  { id: 'laser', name: 'Laser Precision', desc: 'High-speed combat dot' },
  { id: 'default', name: 'System Default', desc: 'Standard pointer' },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('cyber_theme') || 'cyan';
  });

  const [cursorStyle, setCursorStyle] = useState(() => {
    return localStorage.getItem('cyber_cursor') || 'crosshair';
  });

  const activeThemeObj = THEME_COLORS.find(t => t.id === currentTheme) || THEME_COLORS[0];

  useEffect(() => {
    localStorage.setItem('cyber_theme', currentTheme);
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', activeThemeObj.hex);
    root.style.setProperty('--theme-secondary', activeThemeObj.secondary);
    root.style.setProperty('--theme-glow', activeThemeObj.bgGlow);
  }, [currentTheme, activeThemeObj]);

  useEffect(() => {
    localStorage.setItem('cyber_cursor', cursorStyle);
    if (cursorStyle === 'default') {
      document.body.style.cursor = 'auto';
    } else {
      document.body.style.cursor = 'none';
    }
  }, [cursorStyle]);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setCurrentTheme,
      activeThemeObj,
      cursorStyle,
      setCursorStyle,
      themeColors: THEME_COLORS,
      cursorStyles: CURSOR_STYLES
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
