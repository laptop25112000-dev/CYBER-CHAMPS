import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import { Menu, X, ExternalLink, ArrowRight } from 'lucide-react';

export default function EditorialNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Exactly the 5 main destinations required by information architecture
  const mainNavLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Explore the Robot', href: '#robot' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Gameplay & Sim', href: '#gameplay' },
    { label: 'Technical Details', href: '#technical' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['overview', 'robot', 'how-it-works', 'gameplay', 'technical', 'team'];
      const scrollPos = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    soundManager.playClick();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F7F7F4]/95 backdrop-blur-md border-b border-[#D8D8D3] transition-colors">
      <div className="w-full max-w-[1720px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 h-16 sm:h-18 flex items-center justify-between">
        
        {/* Brand Wordmark */}
        <a 
          href="#overview"
          onClick={(e) => handleLinkClick(e, '#overview')}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-2.5 h-2.5 bg-[#F04438]" />
          <div className="flex flex-col text-left">
            <span className="font-mono text-[15px] sm:text-base font-bold uppercase tracking-widest text-[#171717] group-hover:text-[#F04438] transition-colors">
              CYBER CHAMPS
            </span>
            <span className="text-[15px] font-mono text-[#595959] tracking-tight">
              NRL HYPERDRIVE 2026
            </span>
          </div>
        </a>

        {/* Desktop 5 Destination Navigation */}
        <nav className="hidden lg:flex items-center gap-3 xl:gap-6">
          {mainNavLinks.map((link) => {
            const id = link.href.substring(1);
            const isActive = activeSection === id;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`px-3 py-2 text-[15px] xl:text-base font-medium transition-all border-b-2 rounded-t-sm ${
                  isActive 
                    ? 'text-[#171717] border-[#F04438] font-bold' 
                    : 'text-[#595959] border-transparent hover:text-[#171717] hover:border-[#D8D8D3]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Secondary Links: Team & CAD */}
        <div className="hidden sm:flex items-center gap-5">
          <a
            href="#team"
            onClick={(e) => handleLinkClick(e, '#team')}
            className={`text-[15px] font-mono uppercase tracking-wider transition-colors ${
              activeSection === 'team' ? 'text-[#F04438] font-bold' : 'text-[#595959] hover:text-[#171717]'
            }`}
          >
            The Team
          </a>

          <a
            href={`${import.meta.env.BASE_URL}tearable.html`}
            className="px-3.5 py-1.5 border border-[#D8D8D3] bg-white text-[#171717] hover:border-[#171717] font-mono text-[14px] uppercase tracking-wider transition-all flex items-center gap-1.5 rounded-sm"
            title="Open Interactive Tearable Notebook"
          >
            <span>Tearable Dossier</span>
          </a>

          <a
            href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-[#171717] bg-[#171717] text-[#F7F7F4] hover:bg-[#F04438] hover:border-[#F04438] font-mono text-[15px] uppercase tracking-wider transition-all flex items-center gap-2 rounded-sm"
          >
            <span>Onshape CAD</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => {
            soundManager.playClick();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="lg:hidden p-2 text-[#171717] hover:bg-[#ECECE7] border border-[#D8D8D3] rounded-sm transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D8D8D3] bg-[#F7F7F4] px-6 py-6 space-y-4 shadow-xl">
          <div className="font-mono text-[15px] uppercase text-[#595959] tracking-wider mb-2 font-bold">
            DESTINATIONS
          </div>
          <div className="flex flex-col space-y-2">
            {mainNavLinks.map((link) => {
              const id = link.href.substring(1);
              const isActive = activeSection === id;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`p-3 text-base font-medium rounded-lg transition-colors flex items-center justify-between ${
                    isActive 
                      ? 'bg-[#ECECE7] text-[#171717] font-bold border-l-4 border-[#F04438]' 
                      : 'text-[#595959] hover:bg-[#ECECE7]/60 hover:text-[#171717]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#595959]" />
                </a>
              );
            })}

            <div className="pt-3 border-t border-[#D8D8D3] flex flex-col gap-2">
              <a
                href={`${import.meta.env.BASE_URL}tearable.html`}
                className="p-3 text-[15px] font-mono bg-[#ECECE7] text-[#171717] font-semibold flex items-center justify-between rounded-sm"
              >
                <span>OPEN TEARABLE DOSSIER NOTEBOOK</span>
                <ArrowRight className="w-4 h-4 text-[#F04438]" />
              </a>
              <a
                href="#team"
                onClick={(e) => handleLinkClick(e, '#team')}
                className="p-3 text-[15px] font-mono text-[#595959] hover:text-[#171717]"
              >
                MEET THE 9 TEAM MEMBERS →
              </a>
              <a
                href="https://cad.onshape.com/documents/b9775324604f1e712d8677c5/w/42798f7711b0b207da9310d3/e/2e8391d232133dd053e4cffb"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-[15px] font-mono bg-[#171717] text-white flex items-center justify-center gap-2 rounded-sm"
              >
                <span>OPEN ONSHAPE CAD MODEL</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
