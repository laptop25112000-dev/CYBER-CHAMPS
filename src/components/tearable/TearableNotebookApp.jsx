import React, { useState } from 'react';
import TearablePaperPage from './TearablePaperPage';
import CoverDossierPage from './pages/CoverDossierPage';
import RoboCarBlueprintPage from './pages/RoboCarBlueprintPage';
import SquadScrapbookPage from './pages/SquadScrapbookPage';
import ArenaTacticsPage from './pages/ArenaTacticsPage';
import ScrutineeringCertificatePage from './pages/ScrutineeringCertificatePage';
import TearableLabPage from './pages/TearableLabPage';
import { tearAudio } from './TearableAudio';
import { 
  BookOpen, Scissors, RotateCcw, Volume2, VolumeX, 
  ChevronLeft, ChevronRight, ExternalLink, Trash2, ArrowLeft, Layers, Shield 
} from 'lucide-react';

export default function TearableNotebookApp() {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [tornPages, setTornPages] = useState({});
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showWastebasket, setShowWastebasket] = useState(false);

  const pages = [
    {
      id: 1,
      title: 'Mission Dossier & Team Credentials',
      subtitle: 'NRL 2026 Delhi Regional State-Level Robotics Competition',
      component: CoverDossierPage
    },
    {
      id: 2,
      title: '4WD Battle Robo Car Mechanical Blueprint',
      subtitle: 'Exploded Sub-Assemblies, Motor Specs & Tearable Pit Checklist',
      component: RoboCarBlueprintPage
    },
    {
      id: 3,
      title: 'Engineering Squad Scrapbook',
      subtitle: '9 Students, Hardware Contributions & Tearable Member Slips',
      component: SquadScrapbookPage
    },
    {
      id: 4,
      title: 'Arena Field Blueprint & Match Tactics',
      subtitle: '12ft × 12ft Regulation Arena Routes & Strategy Maneuvers',
      component: ArenaTacticsPage
    },
    {
      id: 5,
      title: 'Scrutineering Inspection & Certification',
      subtitle: 'Official Dimension, Mass, Electrical Checks & Tearable Pass',
      component: ScrutineeringCertificatePage
    },
    {
      id: 6,
      title: 'Interactive Tearable Physics Sandbox',
      subtitle: 'Real-Time Verlet Integration Cloth & Paper Shredding Lab',
      component: TearableLabPage
    }
  ];

  const handleTearPage = (pageNumber) => {
    setTornPages((prev) => ({
      ...prev,
      [pageNumber]: true
    }));

    // Auto-advance to next page if available
    if (activePageIndex < pages.length - 1) {
      setTimeout(() => {
        setActivePageIndex((prev) => prev + 1);
        tearAudio.playPaperFlip();
      }, 400);
    }
  };

  const restoreAllTornPages = () => {
    tearAudio.playTapeStick();
    setTornPages({});
    setActivePageIndex(0);
  };

  const restoreSinglePage = (pageNumber) => {
    tearAudio.playTapeStick();
    setTornPages((prev) => {
      const copy = { ...prev };
      delete copy[pageNumber];
      return copy;
    });
  };

  const toggleAudio = () => {
    const muted = tearAudio.toggleMute();
    setIsAudioMuted(muted);
  };

  const totalTornCount = Object.keys(tornPages).length;

  return (
    <div className="min-h-screen bg-[#FAF5E6] text-black font-['Rajdhani'] selection:bg-amber-300 selection:text-black">
      {/* Background Subtle Grid Texture */}
      <div className="fixed inset-0 cyber-grid opacity-15 pointer-events-none -z-10" />

      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF5E6] border-b-4 border-black shadow-[0_4px_0px_0px_#000] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border-2 border-black bg-amber-300 shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-['Orbitron'] text-base sm:text-lg font-black text-black leading-tight flex items-center gap-1.5">
              <span>CYBER</span>
              <span className="px-1.5 py-0.2 rounded bg-[#FEF08A] border border-black shadow-[1px_1px_0px_0px_#000]">
                CHAMPS
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 hidden sm:inline">
                // TEARABLE DOSSIER
              </span>
            </div>
            <div className="font-mono text-[9px] font-black text-slate-700 uppercase">
              DELHI REGIONAL ROBOTICS &middot; PHYSICAL PAPER NOTEBOOK EDITION
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl border-2 border-black bg-[#FFF9EB] hover:bg-[#FEF08A] shadow-[2px_2px_0px_0px_#000] text-black transition-transform active:translate-y-0.5"
            title={isAudioMuted ? 'Unmute Paper SFX' : 'Mute Paper SFX'}
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4 text-slate-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>

          {/* Wastebasket Button with Badge */}
          <button
            onClick={() => setShowWastebasket(!showWastebasket)}
            className="px-3 py-2 rounded-xl border-2 border-black bg-[#FFF9EB] hover:bg-rose-200 shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black text-black flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            title="View torn pages wastebasket"
          >
            <Trash2 className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">TORN:</span>
            <span className="px-1.5 py-0.2 rounded bg-black text-white font-mono text-[10px] font-black">
              {totalTornCount}
            </span>
          </button>

          {/* Restore All Torn Pages Button */}
          {totalTornCount > 0 && (
            <button
              onClick={restoreAllTornPages}
              className="px-3 py-2 rounded-xl border-2 border-black bg-[#BBF7D0] hover:bg-emerald-300 shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black text-black flex items-center gap-1.5 transition-transform active:translate-y-0.5"
              title="Tape all torn pages back into the notebook"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>TAPE BACK ALL</span>
            </button>
          )}

          {/* Link back to Main 3D Website */}
          <a
            href={`${import.meta.env.BASE_URL}index.html`}
            className="px-3.5 py-2 rounded-xl border-2 border-black bg-[#BAE6FD] hover:bg-cyan-300 shadow-[2px_2px_0px_0px_#000] font-mono text-xs font-black text-black flex items-center gap-1.5 transition-transform active:translate-y-0.5"
            title="Return to the 3D scroll explosion site"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>3D SITE</span>
          </a>
        </div>
      </header>

      {/* Main Dossier Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Switcher Pill Navigation Bar */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl border-3 border-black bg-[#FFF9EB] shadow-[4px_4px_0px_0px_#000] overflow-x-auto select-none">
          <button
            onClick={() => {
              if (activePageIndex > 0) {
                tearAudio.playPaperFlip();
                setActivePageIndex((prev) => prev - 1);
              }
            }}
            disabled={activePageIndex === 0}
            className="p-2 rounded-xl border-2 border-black bg-[#FAF5E6] hover:bg-[#FEF08A] disabled:opacity-40 disabled:hover:bg-[#FAF5E6] shadow-[2px_2px_0px_0px_#000] transition-transform active:translate-y-0.5"
          >
            <ChevronLeft className="w-4 h-4 text-black" />
          </button>

          {/* Page Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {pages.map((p, idx) => {
              const isPageTorn = tornPages[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    tearAudio.playPaperFlip();
                    setActivePageIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-black border-2 border-black transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    activePageIndex === idx
                      ? 'bg-black text-[#FEF08A] shadow-[2px_2px_0px_0px_#000] scale-102'
                      : isPageTorn
                      ? 'bg-[#EFE9D8] text-slate-500 line-through opacity-70'
                      : 'bg-[#FAF5E6] text-black hover:bg-[#FEF08A]'
                  }`}
                >
                  <span>P.0{p.id}</span>
                  {isPageTorn && <Scissors className="w-3 h-3 text-rose-600" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (activePageIndex < pages.length - 1) {
                tearAudio.playPaperFlip();
                setActivePageIndex((prev) => prev + 1);
              }
            }}
            disabled={activePageIndex === pages.length - 1}
            className="p-2 rounded-xl border-2 border-black bg-[#FAF5E6] hover:bg-[#FEF08A] disabled:opacity-40 disabled:hover:bg-[#FAF5E6] shadow-[2px_2px_0px_0px_#000] transition-transform active:translate-y-0.5"
          >
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Current Notebook Page Component */}
        <div className="relative">
          {pages.map((page, idx) => {
            if (idx !== activePageIndex) return null;
            const PageComponent = page.component;
            return (
              <TearablePaperPage
                key={page.id}
                pageNumber={page.id}
                totalPages={pages.length}
                title={page.title}
                subtitle={page.subtitle}
                onTear={handleTearPage}
                isTorn={tornPages[page.id]}
                isTopPage={true}
              >
                <PageComponent onTearPage={() => handleTearPage(page.id)} />
              </TearablePaperPage>
            );
          })}
        </div>
      </main>

      {/* Torn Pages Wastebasket Drawer Modal */}
      {showWastebasket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border-4 border-black bg-[#FAF5E6] shadow-[8px_8px_0px_0px_#000] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <h3 className="font-['Orbitron'] text-xl font-black text-black">
                  Torn Pages Wastebasket
                </h3>
              </div>
              <button
                onClick={() => setShowWastebasket(false)}
                className="p-1.5 rounded-lg border-2 border-black bg-[#FFF9EB] hover:bg-rose-300 font-mono text-xs font-black"
              >
                CLOSE
              </button>
            </div>

            {totalTornCount === 0 ? (
              <p className="font-mono text-xs font-bold text-slate-700 py-6 text-center">
                Wastebasket is empty! No pages have been torn off yet.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {Object.keys(tornPages).map((pId) => {
                  const pNum = parseInt(pId, 10);
                  const pObj = pages.find((p) => p.id === pNum);
                  return (
                    <div
                      key={pId}
                      className="p-3 rounded-xl border-2 border-black bg-[#FFF9EB] shadow-[2px_2px_0px_0px_#000] flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono text-xs font-black text-black">
                          SHEET {pNum}: {pObj?.title}
                        </div>
                        <div className="font-mono text-[10px] text-slate-700">
                          Torn from notebook
                        </div>
                      </div>
                      <button
                        onClick={() => restoreSinglePage(pNum)}
                        className="px-2.5 py-1 rounded-lg border border-black bg-[#BBF7D0] hover:bg-emerald-300 font-mono text-[10px] font-black text-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        TAPE BACK
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {totalTornCount > 0 && (
              <button
                onClick={() => {
                  restoreAllTornPages();
                  setShowWastebasket(false);
                }}
                className="w-full py-2.5 rounded-xl border-2 border-black bg-emerald-300 hover:bg-emerald-400 font-mono text-xs font-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESTORE ALL TORN PAGES TO NOTEBOOK</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
