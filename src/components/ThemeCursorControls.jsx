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
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full border-2 border-black text-xs font-mono shadow-[4px_4px_0px_0px_#000] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none bg-[#FEF08A] text-black group font-black"
        title="Customize Website Appearance, Color Palette & Cursor"
      >
        <span 
          className="w-3 h-3 rounded-full border border-black animate-pulse" 
          style={{ backgroundColor: activeThemeObj.hex }} 
        />
        <Palette className="w-4 h-4 text-black" />
        <span className="hidden sm:inline font-black tracking-wider">HUD THEME</span>
      </button>

      {/* Control Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="relative w-full max-w-md border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_#000] p-6 space-y-5 bg-[#FAF5E6] text-black"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2 font-mono text-sm font-black text-black">
                <Sliders className="w-4 h-4" style={{ color: activeThemeObj.hex }} />
                <span>CYBER HUD SETTINGS</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsOpen(false);
                }}
                className="p-1 rounded-lg border-2 border-black bg-[#FEF08A] hover:bg-[#FED7AA] text-black shadow-[2px_2px_0px_0px_#000] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Appearance Mode: Light vs Dark */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-black flex items-center gap-1.5 text-black">
                {isLightMode ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : <Moon className="w-3.5 h-3.5 text-cyan-600" />}
                WEBSITE APPEARANCE
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setThemeMode('light');
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-black font-mono text-xs font-black transition-all ${
                    isLightMode 
                      ? 'bg-[#FEF08A] text-black shadow-[3px_3px_0px_0px_#000]' 
                      : 'bg-[#FFF9EB] text-slate-700 hover:bg-[#FEF08A]'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>NEOBRUTALIST</span>
                  {isLightMode && <Check className="w-3.5 h-3.5 text-black" />}
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setThemeMode('dark');
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 border-black font-mono text-xs font-black transition-all ${
                    !isLightMode 
                      ? 'bg-black text-[#FAF5E6] shadow-[3px_3px_0px_0px_#000]' 
                      : 'bg-[#FFF9EB] text-slate-700 hover:bg-[#FEF08A]'
                  }`}
                >
                  <Moon className="w-4 h-4 text-cyan-500" />
                  <span>DARK MODE</span>
                  {!isLightMode && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              </div>
            </div>

            {/* 2. Theme Color Selector */}
            <div className="space-y-2.5 pt-2 border-t-2 border-black">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-black flex items-center gap-1.5 text-black">
                  <Palette className="w-3.5 h-3.5" style={{ color: activeThemeObj.hex }} />
                  COLOR PALETTE ACCENT
                </label>
                <span className="font-mono text-[10px] text-slate-700 font-bold">
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
                      className={`flex items-center gap-2 p-2 rounded-xl border-2 border-black font-mono text-xs text-left transition-all ${
                        isActive 
                          ? 'bg-[#FEF08A] font-black shadow-[2px_2px_0px_0px_#000]' 
                          : 'bg-[#FFF9EB] text-black hover:bg-[#FEF08A]'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-black"
                        style={{ backgroundColor: previewColor }}
                      />
                      <span className="truncate text-[11px] font-bold">{theme.name.split(' ')[0]}</span>
                      {isActive && <Check className="w-3 h-3 ml-auto text-black" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Cursor Style Selector */}
            <div className="space-y-2.5 pt-2 border-t-2 border-black">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs font-black flex items-center gap-1.5 text-black">
                  <MousePointer className="w-3.5 h-3.5 text-purple-700" />
                  CURSOR MODE
                </label>
                <span className="font-mono text-[10px] text-slate-700 capitalize font-bold">
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
                      className={`p-2.5 rounded-xl border-2 border-black text-left font-mono text-xs transition-all ${
                        isCurActive
                          ? 'bg-[#FEF08A] font-black shadow-[2px_2px_0px_0px_#000]'
                          : 'bg-[#FFF9EB] text-black hover:bg-[#FEF08A]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs truncate font-bold">{style.name}</span>
                        {isCurActive && <Check className="w-3 h-3 shrink-0 text-black" />}
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
                className="w-full py-2.5 rounded-xl text-[#FAF5E6] font-mono text-xs font-black transition-all bg-black border-2 border-black hover:bg-[#1a1a1a] shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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
