import React, { useState } from 'react';
import { soundManager } from '../utils/audio';
import { ROBOT_COMPONENTS } from '../data/robotData';
import OnshapeInteractiveWeb from './OnshapeInteractiveWeb';
import OnshapeCadViewer from './OnshapeCadViewer';
import Interactive3DCadViewer from './Interactive3DCadViewer';
import { RotateCcw, ZoomIn, ZoomOut, ChevronDown, ChevronUp, ArrowRight, Crosshair, Box, Compass, ExternalLink, Globe } from 'lucide-react';

export default function RobotExplorerSection() {
  const [selectedCompId, setSelectedCompId] = useState(null); // Default to full robot reset view (100%)
  const [viewMode, setViewMode] = useState('3d'); // Default to interactive 3D GLB model viewer
  const [manualZoom, setManualZoom] = useState(1);
  const [showTechDetails, setShowTechDetails] = useState(false);

  const selectedComponent = ROBOT_COMPONENTS.find(c => c.id === selectedCompId) || null;

  // Magnification calculation: when a component is clicked, smoothly zoom in 2.2x onto its coordinates
  const currentZoom = (selectedComponent ? 2.2 : 1.0) * manualZoom;
  const originX = selectedComponent ? selectedComponent.normalizedPos.x * 100 : 50;
  const originY = selectedComponent ? selectedComponent.normalizedPos.y * 100 : 50;

  const handleSelect = (comp) => {
    soundManager.playClick();
    setSelectedCompId(comp.id);
    setManualZoom(1); // reset manual zoom multiplier to default focus
  };

  const handleReset = () => {
    soundManager.playClick();
    setSelectedCompId(null);
    setManualZoom(1);
    setShowTechDetails(false);
  };

  return (
    <section id="robot" className="py-20 sm:py-28 bg-[#F7F7F4] border-b border-[#D8D8D3] scroll-mt-16">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 space-y-8">
        
        {/* Section Header with View Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#D8D8D3] text-left">
          <div className="space-y-3 max-w-3xl">
            <span className="font-mono text-[15px] sm:text-base uppercase tracking-widest text-[#F04438] block font-bold">
              02 / EXPLORE THE ROBOT
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#171717] uppercase">
              The Physical Machine.
            </h2>
            <p className="text-lg sm:text-xl text-[#595959] leading-relaxed">
              Explore the robot in <strong className="text-[#171717] font-semibold">interactive 3D</strong>, inspect the <strong className="text-[#171717] font-semibold">exact Onshape CAD</strong>, or examine the <strong className="text-[#171717] font-semibold">2D blueprint</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 3D vs Onshape vs 2D Mode Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-lg bg-[#ECECE7] border border-[#D8D8D3]">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('3d');
                }}
                className={`px-3.5 py-1.5 rounded font-mono text-[15px] font-bold transition-all flex items-center gap-2 ${
                  viewMode === '3d'
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-[#595959] hover:text-[#171717]'
                }`}
              >
                <Box className="w-4 h-4 text-[#F04438]" />
                <span>3D CAD MODEL (GLB)</span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#F04438] text-white font-extrabold tracking-wider">
                  OFFICIAL
                </span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('onshape');
                }}
                className={`px-3.5 py-1.5 rounded font-mono text-[15px] font-bold transition-all flex items-center gap-2 ${
                  viewMode === 'onshape'
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-[#595959] hover:text-[#171717]'
                }`}
              >
                <ExternalLink className="w-4 h-4 text-[#059669]" />
                <span>EXACT ONSHAPE CAD</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setViewMode('2d');
                }}
                className={`px-3.5 py-1.5 rounded font-mono text-[15px] font-bold transition-all flex items-center gap-2 ${
                  viewMode === '2d'
                    ? 'bg-[#171717] text-white shadow-sm'
                    : 'text-[#595959] hover:text-[#171717]'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>2D BLUEPRINT</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 border border-[#D8D8D3] bg-[#ECECE7] hover:border-[#171717] font-mono text-[15px] uppercase tracking-wider text-[#171717] font-semibold flex items-center gap-2 transition-all rounded-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{selectedCompId ? 'Reset / View Full Robot' : 'Reset View'}</span>
            </button>
          </div>
        </div>

        {/* Main View Area: When onshape, full width cinema scale (just like Hyperdrive simulator); when 3d/2d, split with component inspector */}
        {viewMode === 'onshape' ? (
          <div className="w-full space-y-6">
            <OnshapeInteractiveWeb 
              selectedCompId={selectedCompId}
              onSelectComponent={handleSelect}
            />

            {/* When a component is clicked on the 3D model, show its detailed breakdown right below! */}
            {selectedComponent && (
              <div className="bg-white border border-[#D8D8D3] rounded-3xl p-6 sm:p-10 shadow-lg text-left animate-in fade-in slide-in-from-top-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8D8D3]">
                  <div>
                    <span className="font-mono text-[15px] sm:text-base font-bold text-[#F04438] uppercase tracking-wider block mb-1">
                      {selectedComponent.category} · COMPONENT INSPECTION
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-extrabold text-[#171717]">
                      {selectedComponent.name}
                    </h3>
                  </div>
                  <button
                    onClick={handleReset}
                    className="self-start sm:self-auto px-4 py-2 bg-[#ECECE7] hover:bg-[#D8D8D3] text-[#171717] font-mono text-[15px] font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset Focus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                  <div className="space-y-2">
                    <span className="font-mono text-[15px] font-bold text-[#F04438] uppercase tracking-wider block">
                      1. WHAT IS IT?
                    </span>
                    <p className="text-base sm:text-lg text-[#171717] leading-relaxed">
                      {selectedComponent.whatIsIt}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[15px] font-bold text-[#F04438] uppercase tracking-wider block">
                      2. WHAT DOES IT DO?
                    </span>
                    <p className="text-base sm:text-lg text-[#171717] leading-relaxed">
                      {selectedComponent.whatDoesItDo}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[15px] font-bold text-[#F04438] uppercase tracking-wider block">
                      3. HOW DOES IT WORK?
                    </span>
                    <div className="space-y-2">
                      {selectedComponent.howItWorksSteps ? (
                        selectedComponent.howItWorksSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-[15px] font-mono text-[#171717] p-2.5 rounded bg-[#FAFAFA] border border-[#D8D8D3]">
                            {step}
                          </div>
                        ))
                      ) : (
                        <p className="text-base sm:text-lg text-[#171717]">{selectedComponent.howItWorksWithOtherParts}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                {selectedComponent.technicalDetails && (
                  <div className="mt-6 pt-6 border-t border-[#D8D8D3]">
                    <span className="font-mono text-[15px] font-bold text-[#171717] uppercase tracking-wider block mb-3">
                      VERIFIED TECHNICAL SPECIFICATIONS
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(selectedComponent.technicalDetails).map(([k, v]) => (
                        <div key={k} className="p-3 rounded-xl bg-[#FAFAFA] border border-[#D8D8D3] font-mono">
                          <div className="text-[15px] text-[#595959]">{k}</div>
                          <div className="text-[15px] sm:text-base font-bold text-[#171717] mt-0.5">{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Component Selection Row when no part is selected */}
            {!selectedComponent && (
              <div className="bg-white border border-[#D8D8D3] rounded-2xl p-6 text-left shadow-sm space-y-4">
                <span className="font-mono text-[15px] sm:text-base font-bold text-[#171717] uppercase tracking-wider block">
                  CLICK TO FOCUS SPECIFIC ROBOT MECHANISM:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {ROBOT_COMPONENTS.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => handleSelect(comp)}
                      className="p-3 rounded-xl border border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7] hover:border-[#171717] transition-all text-left flex flex-col justify-between group"
                    >
                      <div className="w-2 h-2 rounded-full bg-[#F04438] mb-2 group-hover:scale-125 transition-transform" />
                      <div className="text-[15px] font-bold text-[#171717] group-hover:text-[#F04438] transition-colors leading-snug">
                        {comp.name}
                      </div>
                      <div className="text-[15px] font-mono text-[#595959] mt-1">
                        {comp.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
            
            {/* Main Area: 3D CAD or 2D Blueprint (7-8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-3">
              {viewMode === '3d' ? (
                <Interactive3DCadViewer 
                  selectedCompId={selectedCompId}
                  onSelectComponent={handleSelect}
                  onReset={handleReset}
                />
              ) : (
                <>
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] border border-[#D8D8D3] bg-[#ECECE7] p-4 sm:p-8 flex items-center justify-center overflow-hidden rounded-2xl select-none group">
              
              {/* Dynamic Camera Stage with Smooth Zoom & Pan */}
              <div 
                className="w-full h-full relative flex items-center justify-center"
                style={{
                  transform: `scale(${currentZoom})`,
                  transformOrigin: `${originX}% ${originY}%`,
                  transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform-origin 0.65s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <img 
                  src={`${import.meta.env.BASE_URL}onshape-robot-cad.png`}
                  alt="CYBER CHAMPS robot CAD model" 
                  className="w-full h-full object-contain filter drop-shadow-md"
                />

                {/* Sleek Circular Target Hotspots Directly on the Model */}
                {ROBOT_COMPONENTS.map((comp) => {
                  const isSelected = selectedCompId === comp.id;
                  // Inverse scale compensation to keep pins sharp & compact regardless of zoom level
                  const pinScale = isSelected 
                    ? 1.05 / Math.pow(currentZoom, 0.45) 
                    : 0.85 / Math.pow(currentZoom, 0.45);

                  return (
                    <div
                      key={comp.id}
                      style={{
                        position: 'absolute',
                        left: `${comp.normalizedPos.x * 100}%`,
                        top: `${comp.normalizedPos.y * 100}%`,
                        transform: `translate(-50%, -50%) scale(${pinScale})`,
                        zIndex: isSelected ? 30 : 20
                      }}
                      className="cursor-pointer group/pin focus:outline-none"
                      onClick={() => handleSelect(comp)}
                    >
                      {/* Pulse beacon */}
                      <span className={`absolute -inset-2 rounded-full transition-opacity ${
                        isSelected 
                          ? 'bg-[#F04438] animate-ping opacity-75' 
                          : 'bg-[#171717] opacity-20 group-hover/pin:opacity-50'
                      }`} />

                      {/* Circular pin badge */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-md transition-all ${
                        isSelected 
                          ? 'bg-[#F04438] border-white text-white shadow-[#F04438]/50 ring-2 ring-[#F04438]' 
                          : 'bg-[#F7F7F4] border-[#171717] text-[#171717] hover:bg-[#171717] hover:border-white'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-[#F04438]'}`} />
                      </div>

                      {/* Floating Label on hover or active */}
                      <div className={`absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[15px] uppercase tracking-wider font-bold px-3 py-1 rounded shadow-md transition-all pointer-events-none ${
                        isSelected
                          ? 'bg-[#F04438] text-white opacity-100 scale-100 ring-1 ring-white/40'
                          : 'bg-[#171717] text-white opacity-0 group-hover/pin:opacity-100 scale-95 group-hover/pin:scale-100'
                      }`}>
                        {comp.shortTag}
                      </div>

                      {/* Focus reticle bracket for selected component */}
                      {isSelected && (
                        <div className="absolute -inset-4 border border-[#F04438]/70 border-dashed rounded-lg animate-pulse pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Status Indicator (Bottom Left) */}
              <div className="absolute bottom-4 left-4 bg-[#F7F7F4]/95 backdrop-blur-sm border border-[#D8D8D3] px-3.5 py-1.5 font-mono text-[15px] sm:text-base text-[#171717] font-semibold rounded shadow-sm flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${selectedComponent ? 'bg-[#F04438] animate-pulse' : 'bg-[#059669]'}`} />
                <span>
                  {selectedComponent 
                    ? `MAGNIFIED: ${selectedComponent.name.toUpperCase()}` 
                    : 'FULL ROVER VIEW (100%)'}
                </span>
              </div>

              {/* Compact Floating Zoom Controls (Bottom Right) */}
              <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#F7F7F4]/95 border border-[#D8D8D3] p-1.5 rounded shadow-sm">
                <button
                  onClick={() => setManualZoom(prev => Math.max(0.5, prev - 0.2))}
                  aria-label="Zoom out"
                  className="p-1.5 text-[#171717] hover:bg-[#ECECE7] rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono text-[15px] sm:text-base text-[#171717] px-2 min-w-[55px] text-center font-bold">
                  {Math.round(currentZoom * 100)}%
                </span>
                <button
                  onClick={() => setManualZoom(prev => Math.min(2.0, prev + 0.2))}
                  aria-label="Zoom in"
                  className="p-1.5 text-[#171717] hover:bg-[#ECECE7] rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick helper note under image with bigger font */}
            <div className="flex items-center justify-between text-[15px] sm:text-base font-mono text-[#595959] px-1">
              <span>👉 Click any pin on the robot to fly the camera into that mechanism</span>
              <span className="font-semibold text-[#171717]">MAGNIFICATION: {Math.round(currentZoom * 100)}%</span>
            </div>
          </>
        )}
          </div>

          {/* Information Area: "Tells" Everything with Larger, Comfortable Typography */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white border border-[#D8D8D3] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm text-left">
            {selectedComponent ? (
              <div className="space-y-6">
                
                {/* Header & Category */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[15px] sm:text-base text-[#F04438] font-bold mb-1.5">
                    <span className="uppercase tracking-wider">{selectedComponent.category}</span>
                    <span className="text-[15px] px-2.5 py-0.5 rounded bg-[#ECECE7] text-[#171717] font-semibold">
                      INSPECTED
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717]">
                    {selectedComponent.name}
                  </h3>
                </div>

                {/* The 4 Ordered Details with Bigger Fonts */}
                <div className="space-y-5 pt-2 border-t border-[#D8D8D3]">
                  
                  {/* 1. What is it? */}
                  <div>
                    <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#F04438] tracking-wider block mb-1.5">
                      1. WHAT IS IT?
                    </span>
                    <p className="text-base sm:text-lg text-[#171717] leading-relaxed">
                      {selectedComponent.whatIsIt}
                    </p>
                  </div>

                  {/* 2. What does it do? */}
                  <div>
                    <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#F04438] tracking-wider block mb-1.5">
                      2. WHAT DOES IT DO?
                    </span>
                    <p className="text-base sm:text-lg text-[#171717] leading-relaxed">
                      {selectedComponent.whatDoesItDo}
                    </p>
                  </div>

                  {/* 3. How does it work? */}
                  <div>
                    <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#F04438] tracking-wider block mb-2">
                      3. HOW DOES IT WORK?
                    </span>
                    <div className="space-y-2">
                      {selectedComponent.howItWorksSteps ? (
                        selectedComponent.howItWorksSteps.map((step, sIdx) => (
                          <div key={sIdx} className="text-base sm:text-[17px] font-mono text-[#171717] p-2.5 rounded bg-[#FAFAFA] border border-[#D8D8D3]">
                            {step}
                          </div>
                        ))
                      ) : (
                        <p className="text-base sm:text-lg text-[#171717]">{selectedComponent.howItWorksWithOtherParts}</p>
                      )}
                    </div>
                  </div>

                  {/* 4. Technical details (Expandable) */}
                  <div className="pt-1">
                    <button
                      onClick={() => setShowTechDetails(!showTechDetails)}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-[#D8D8D3] bg-[#ECECE7]/60 text-[15px] sm:text-base font-mono font-bold text-[#171717] hover:bg-[#ECECE7] transition-colors"
                    >
                      <span>SEE TECHNICAL SPECIFICATIONS</span>
                      {showTechDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showTechDetails && (
                      <div className="mt-3 p-4 rounded-lg bg-[#FAFAFA] border border-[#D8D8D3] space-y-2 text-[15px] sm:text-base font-mono">
                        {Object.entries(selectedComponent.technicalDetails || {}).map(([key, val]) => (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-[#D8D8D3]/50 gap-1">
                            <span className="text-[#595959]">{key}:</span>
                            <span className="font-bold text-[#171717] text-left sm:text-right">{val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            ) : (
              /* Overview Default State */
              <div className="space-y-6">
                <div>
                  <span className="font-mono text-[15px] sm:text-base uppercase font-bold text-[#F04438] tracking-wider block mb-1.5">
                    ROBOT OVERVIEW
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                    CYBER CHAMPS Assembly
                  </h3>
                </div>

                <p className="text-base sm:text-lg text-[#595959] leading-relaxed">
                  Click any pin directly on the 3D robot model to magnify into that mechanism and inspect how it was engineered.
                </p>

                <div className="space-y-2 pt-2">
                  <span className="font-mono text-[15px] sm:text-base font-bold text-[#171717] uppercase tracking-wider block">
                    AVAILABLE MECHANISMS:
                  </span>
                  {ROBOT_COMPONENTS.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => handleSelect(comp)}
                      className="w-full text-left p-3 rounded border border-[#D8D8D3] bg-[#FAFAFA] hover:bg-[#ECECE7] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#F04438]" />
                        <span className="text-base sm:text-lg font-bold text-[#171717] group-hover:text-[#F04438] transition-colors">
                          {comp.name}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#595959] group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      </div>
    </section>
  );
}
