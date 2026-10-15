import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { soundManager } from '../utils/audio';
import { Palette, MousePointer, X, Check, Sparkles, Sliders, Sun, Moon } from 'lucide-react';

export default function ThemeCursorControls() {
  const { 
    currentTheme, 
    setCurrentTheme, 
    themeColors, 
    cursorStyle, 
    setCursorStyle, 
    cursorStyles, 
    activeThemeObj,
    isLightMode,
    themeMode,
    setThemeMode
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
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-xs font-mono shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 group ${
          isLightMode 
            ? 'bg-white/95 text-slate-800 border-slate-300 shadow-lg' 
            : 'bg-slate-900/90 text-white border-slate-700/80'
        }`}
        style={{
          boxShadow: `0 4px 20px ${activeThemeObj.bgGlow}`,
          borderColor: `${activeThemeObj.hex}60`
        }}
        title="Customize Website Appearance, Color Palette & Cursor"
      >
        <span 
          className="w-3 h-3 rounded-full animate-pulse" 
          style={{ backgroundColor: activeThemeObj.hex }} 
        />
        <Palette className="w-4 h-4 text-slate-400 group-hover:text-slate-800 transition-colors" />
        <span className="hidden sm:inline font-semibold tracking-wider">HUD THEME</span>
      </button>

      {/* Control Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150">
          <div 
            className={`relative w-full max-w-md border rounded-2xl shadow-2xl p-6 space-y-5 cut-corner-br ${
              isLightMode ? 'bg-white/98 text-slate-900' : 'bg-slate-900/95 text-white'
            }`}
            style={{ 
              borderColor: `${activeThemeObj.hex}50`,
              boxShadow: `0 0 40px ${activeThemeObj.bgGlow}`
            }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLightMode ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-2 font-mono text-sm font-bold">
                <Sliders className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span>CYBER HUD SETTINGS</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isLightMode ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Appearance Mode: Light vs Dark */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-semibold flex items-center gap-1.5">
                {isLightMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
                WEBSITE APPEARANCE
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setThemeMode('light');
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                    isLightMode 
                      ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm' 
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>LIGHT MODE</span>
                  {isLightMode && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setThemeMode('dark');
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                    !isLightMode 
                      ? 'bg-slate-950 border-cyan-400 text-cyan-300 shadow-sm' 
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Moon className="w-4 h-4 text-cyan-400" />
                  <span>DARK MODE</span>
                  {!isLightMode && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              </div>
            </div>

            {/* 2. Theme Color Selector */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-semibold flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" style={{ color: activeThemeObj.hex }} />
                  COLOR PALETTE (KEPT IN LIGHT & DARK)
                </label>
                <span className="font-mono text-[10px] text-slate-500">
                  {activeThemeObj.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {themeColors.map((theme) => {
                  const isActive = currentTheme === theme.id;
                  const previewColor = isLightMode ? theme.lightHex : theme.darkHex;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => {
                        soundManager.playClick();
                        setCurrentTheme(theme.id);
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border font-mono text-xs text-left transition-all ${
                        isActive 
                          ? 'border-2 shadow-sm font-bold' 
                          : isLightMode
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      style={{
                        borderColor: isActive ? previewColor : undefined
                      }}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: previewColor }}
                      />
                      <span className="truncate text-[11px]">{theme.name.split(' ')[0]}</span>
                      {isActive && <Check className="w-3 h-3 ml-auto" style={{ color: previewColor }} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Cursor Style Selector */}
            <div className="space-y-2.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-semibold flex items-center gap-1.5">
                  <MousePointer className="w-3.5 h-3.5 text-purple-500" />
                  CURSOR MODE
                </label>
                <span className="font-mono text-[10px] text-slate-500 capitalize">
                  {cursorStyle}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {cursorStyles.map((style) => {
                  const isCurActive = cursorStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        soundManager.playClick();
                        setCursorStyle(style.id);
                      }}
                      className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all ${
                        isCurActive
                          ? 'border-2 font-bold shadow-sm'
                          : isLightMode
                          ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                      style={{
                        borderColor: isCurActive ? activeThemeObj.hex : undefined
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate">{style.name}</span>
                        {isCurActive && <Check className="w-3 h-3 shrink-0" style={{ color: activeThemeObj.hex }} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
                className="w-full py-2.5 rounded-xl text-white font-mono text-xs font-bold transition-all hover:brightness-110 active:scale-98 shadow-md"
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
