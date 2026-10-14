import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { Palette, MousePointer, X, Check, Sparkles, Sliders } from 'lucide-react';

export default function ThemeCursorControls() {
  const { 
    currentTheme, 
    setCurrentTheme, 
    themeColors, 
    cursorStyle, 
    setCursorStyle, 
    cursorStyles, 
    activeThemeObj 
  } = useTheme();

  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    soundManager.playClick();
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating HUD Trigger Button */}
      <button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 text-white font-mono text-xs shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
        style={{
          boxShadow: `0 4px 20px ${activeThemeObj.bgGlow}`,
          borderColor: `${activeThemeObj.hex}60`
        }}
        title="Customize Website Color Theme & Cursor"
      >
        <span 
          className="w-3 h-3 rounded-full animate-pulse" 
          style={{ backgroundColor: activeThemeObj.hex }} 
        />
        <Palette className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
        <span className="hidden sm:inline font-semibold tracking-wider">HUD THEME</span>
      </button>

      {/* Control Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-md bg-slate-900/95 border rounded-2xl shadow-2xl p-6 space-y-6 cut-corner-br"
            style={{ 
              borderColor: `${activeThemeObj.hex}50`,
              boxShadow: `0 0 40px ${activeThemeObj.bgGlow}`
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Sliders className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span>CYBER HUD SETTINGS</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Theme Color Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-slate-300 flex items-center gap-1.5 font-semibold">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  WEBSITE COLOR PALETTE
                </label>
                <span className="font-mono text-[11px] text-slate-400">
                  Active: {activeThemeObj.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {themeColors.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        soundManager.playClick();
                        setCurrentTheme(theme.id);
                      }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border font-mono text-xs text-left transition-all ${
                        isActive 
                          ? 'bg-slate-950 border-white text-white font-bold ring-2' 
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      style={{
                        ringColor: isActive ? theme.hex : 'transparent',
                        borderColor: isActive ? theme.hex : undefined
                      }}
                    >
                      <span 
                        className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: theme.hex }}
                      />
                      <span className="truncate text-[11px]">{theme.name.split(' ')[0]}</span>
                      {isActive && <Check className="w-3 h-3 ml-auto" style={{ color: theme.hex }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Cursor Style Selector */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-slate-300 flex items-center gap-1.5 font-semibold">
                  <MousePointer className="w-3.5 h-3.5 text-purple-400" />
                  CURSOR MODE
                </label>
                <span className="font-mono text-[11px] text-slate-400 capitalize">
                  {cursorStyle}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {cursorStyles.map((style) => {
                  const isCurActive = cursorStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        soundManager.playClick();
                        setCursorStyle(style.id);
                      }}
                      className={`p-3 rounded-xl border text-left font-mono text-xs transition-all ${
                        isCurActive
                          ? 'bg-slate-950 border-cyan-400 text-white font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      style={{
                        borderColor: isCurActive ? activeThemeObj.hex : undefined
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-xs">{style.name}</span>
                        {isCurActive && <Check className="w-3 h-3" style={{ color: activeThemeObj.hex }} />}
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans">{style.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer close */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-slate-950 font-mono text-xs font-bold transition-all hover:brightness-110 active:scale-98"
                style={{ backgroundColor: activeThemeObj.hex }}
              >
                APPLY & CLOSE HUD
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
