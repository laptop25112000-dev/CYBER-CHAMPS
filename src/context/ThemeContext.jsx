import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEME_COLORS = [
  { 
    id: 'cyan', 
    name: 'Cyber Cyan', 
    darkHex: '#00f0ff', 
    lightHex: '#0284c7', 
    secondary: '#3b82f6', 
    bgGlow: 'rgba(2, 132, 199, 0.2)' 
  },
  { 
    id: 'emerald', 
    name: 'Laser Emerald', 
    darkHex: '#10b981', 
    lightHex: '#059669', 
    secondary: '#06b6d4', 
    bgGlow: 'rgba(5, 150, 105, 0.2)' 
  },
  { 
    id: 'crimson', 
    name: 'Crimson Fury', 
    darkHex: '#ff0055', 
    lightHex: '#e11d48', 
    secondary: '#ec4899', 
    bgGlow: 'rgba(225, 29, 72, 0.2)' 
  },
  { 
    id: 'amber', 
    name: 'Solar Amber', 
    darkHex: '#f59e0b', 
    lightHex: '#d97706', 
    secondary: '#ef4444', 
    bgGlow: 'rgba(217, 119, 6, 0.2)' 
  },
  { 
    id: 'purple', 
    name: 'Hyperdrive Purple', 
    darkHex: '#a855f7', 
    lightHex: '#7c3aed', 
    secondary: '#6366f1', 
    bgGlow: 'rgba(124, 58, 237, 0.2)' 
  },
  { 
    id: 'orange', 
    name: 'Robo Orange', 
    darkHex: '#ff6b00', 
    lightHex: '#ea580c', 
    secondary: '#eab308', 
    bgGlow: 'rgba(234, 88, 12, 0.2)' 
  },
];

export const CURSOR_STYLES = [
  { id: 'crosshair', name: 'Cyber Crosshair', desc: 'Tactical targeting reticle' },
  { id: 'glow', name: 'Neon Ring Glow', desc: 'Fluid trailing pulse' },
  { id: 'laser', name: 'Laser Precision', desc: 'High-speed combat dot' },
  { id: 'default', name: 'System Default', desc: 'Standard pointer' },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Default to 'light' mode as requested!
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('cyber_mode') || 'light';
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('cyber_theme') || 'cyan';
  });

  const [cursorStyle, setCursorStyle] = useState(() => {
    return localStorage.getItem('cyber_cursor') || 'crosshair';
  });

  const isLightMode = themeMode === 'light';
  const rawTheme = THEME_COLORS.find(t => t.id === currentTheme) || THEME_COLORS[0];
  
  // Use lightHex in light mode and darkHex in dark mode for optimal contrast & aesthetics
  const activeHex = isLightMode ? rawTheme.lightHex : rawTheme.darkHex;
  const activeThemeObj = {
    ...rawTheme,
    hex: activeHex
  };

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    localStorage.setItem('cyber_mode', themeMode);
    const root = document.documentElement;
    if (themeMode === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('cyber_theme', currentTheme);
    const root = document.documentElement;
    root.style.setProperty('--theme-accent', activeHex);
    root.style.setProperty('--theme-secondary', rawTheme.secondary);
    root.style.setProperty('--theme-glow', rawTheme.bgGlow);
  }, [currentTheme, activeHex, rawTheme]);

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
      themeMode,
      setThemeMode,
      toggleThemeMode,
      isLightMode,
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
