import React from 'react';
import EditorialNavbar from './components/EditorialNavbar';
import EditorialHero from './components/EditorialHero';
import RobotExplorerSection from './components/RobotExplorerSection';
import HowItWorksUnifiedSection from './components/HowItWorksUnifiedSection';
import GameplaySection from './components/GameplaySection';
import TechnicalDetailsUnifiedSection from './components/TechnicalDetailsUnifiedSection';
import EditorialTeamSection from './components/EditorialTeamSection';
import EditorialFooter from './components/EditorialFooter';

export default function App() {
  const handleExploreRobot = () => {
    const el = document.querySelector('#robot');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSeeHowItWorks = () => {
    const el = document.querySelector('#how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#171717] font-['Geist','Inter',sans-serif] antialiased selection:bg-[#F04438] selection:text-white">
      {/* Sticky Navigation Bar (5 Destinations + Team + CAD) */}
      <EditorialNavbar />

      <main>
        {/* Destination 1: Overview — What is CYBER CHAMPS, and what does the robot do? */}
        <EditorialHero 
          onExploreRobot={handleExploreRobot}
          onSeeHowItWorks={handleSeeHowItWorks}
        />

        {/* Destination 2: Explore the Robot — Discover physical components & mechanisms */}
        <RobotExplorerSection />

        {/* Destination 3: How It Works — Understand movement, control & mechanical actions */}
        <HowItWorksUnifiedSection />

        {/* Destination 4: Gameplay — Understand HYPERDRIVE & verified competition capabilities */}
        <GameplaySection />

        {/* Destination 5: Technical Details — Specifications, electronics, software & engineering decisions */}
        <TechnicalDetailsUnifiedSection />

        {/* Secondary Destination: The Team & 5-Step Build Process */}
        <EditorialTeamSection />
      </main>

      {/* Editorial Footer */}
      <EditorialFooter />
    </div>
  );
}
