import React, { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { ClubEvent, ClubReport, Photo, PageView, TeamMember } from '../types';
import { LOGO_URL } from '../constants';
import GooeyNav from './GooeyNav';
import { useTheme } from '../contexts/ThemeContext';
import './HamburgerToggle.css';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Events from './pages/Events';
import Reports from './pages/Reports';
import GalleryPage from './pages/GalleryPage';
import Connect from './pages/Connect';

interface LandingPageProps {
  events: ClubEvent[];
  reports: ClubReport[];
  photos: Photo[];
  teamMembers: TeamMember[];
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ events, reports, photos, teamMembers, onLoginClick, onRegisterClick }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const { isDark } = useTheme();

  useEffect(() => {
    if (logoClickCount === 0) return;
    const timer = setTimeout(() => setLogoClickCount(0), 1000);
    if (logoClickCount === 3) {
      onLoginClick();
      setLogoClickCount(0);
    }
    return () => clearTimeout(timer);
  }, [logoClickCount, onLoginClick]);

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-transparent text-white' : 'bg-[#f8fafc] text-[#0f172a]'} overflow-x-hidden selection:bg-cyan-500/30 font-sans relative`}>

      {/* --- Premium Translucent Glass Navbar --- */}
      <nav
        className="fixed w-full z-50 backdrop-blur-2xl border-b transition-all duration-500"
        style={{
          backgroundColor: isDark ? 'rgba(0, 26, 48, 0.55)' : 'rgba(255, 255, 255, 0.65)',
          borderColor: isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(0, 0, 0, 0.06)',
          boxShadow: isDark
            ? '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 4px 30px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo area */}
            <div
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => {
                setCurrentPage('home');
                setLogoClickCount(prev => prev + 1);
              }}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <img src={LOGO_URL} alt="DAC Logo" className="relative h-11 w-11 object-contain" />
              </div>
              <span className={`text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r hidden sm:block tracking-tight transition-all duration-300 ${isDark
                ? 'from-white via-slate-200 to-slate-400 group-hover:from-cyan-400 group-hover:to-blue-400'
                : 'from-slate-800 via-slate-600 to-slate-500 group-hover:from-cyan-600 group-hover:to-blue-600'
                }`}>
                Data Analytics Club
              </span>
              <span className={`text-xl font-bold sm:hidden tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>DAC</span>
            </div>

            {/* Desktop Nav - GooeyNav with Particle Effects */}
            <div className="hidden md:flex items-center">
              <GooeyNav
                items={[
                  { label: 'Home', href: '#', onClick: () => setCurrentPage('home') },
                  { label: 'About', href: '#', onClick: () => setCurrentPage('about') },
                  { label: 'Members', href: '#', onClick: () => setCurrentPage('members') },
                  { label: 'Events', href: '#', onClick: () => setCurrentPage('events') },
                  { label: 'Reports', href: '#', onClick: () => setCurrentPage('reports') },
                  { label: 'Gallery', href: '#', onClick: () => setCurrentPage('photos') },
                  { label: 'Connect', href: '#', onClick: () => setCurrentPage('connect') }
                ]}
                particleCount={12}
                particleDistances={[70, 10]}
                particleR={80}
                initialActiveIndex={
                  currentPage === 'home' ? 0 :
                    currentPage === 'about' ? 1 :
                      currentPage === 'members' ? 2 :
                        currentPage === 'events' ? 3 :
                          currentPage === 'reports' ? 4 :
                            currentPage === 'photos' ? 5 :
                              currentPage === 'connect' ? 6 : 0
                }
                animationTime={500}
                timeVariance={250}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              />
            </div>

            {/* Mobile Hamburger */}
            <div className="flex items-center gap-3">
              {/* Animated Hamburger Toggle (mobile only) */}
              <div className="md:hidden">
                <input
                  type="checkbox"
                  id="hamburger-checkbox"
                  className="hamburger-checkbox"
                  checked={isMobileMenuOpen}
                  onChange={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
                <label htmlFor="hamburger-checkbox" className="hamburger-toggle">
                  <div className="hamburger-bar hamburger-bar-short hamburger-bar-top"></div>
                  <div className="hamburger-bar hamburger-bar-mid"></div>
                  <div className="hamburger-bar hamburger-bar-short hamburger-bar-bottom"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden backdrop-blur-xl border-b absolute w-full animate-fade-in-up"
            style={{
              backgroundColor: isDark ? 'rgba(0, 26, 48, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(0, 0, 0, 0.06)',
            }}
          >
            <div className="px-4 py-6 space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'members', label: 'Members' },
                { id: 'events', label: 'Events' },
                { id: 'reports', label: 'Reports' },
                { id: 'photos', label: 'Gallery' },
                { id: 'connect', label: 'Connect' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as PageView);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors ${currentPage === item.id
                    ? (isDark ? 'bg-cyan-900/20 text-cyan-400' : 'bg-cyan-50 text-cyan-700')
                    : (isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* --- Content Area --- */}
      <div>
        {currentPage === 'home' && <Home onLoginClick={onLoginClick} setCurrentPage={setCurrentPage} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'members' && <Members teamMembers={teamMembers} />}
        {currentPage === 'events' && (
          <Events
            events={events}
            photos={photos}
            onLoginClick={onLoginClick}
            onRegisterClick={onRegisterClick}
            setCurrentPage={setCurrentPage}
            setLightboxPhoto={setLightboxPhoto}
          />
        )}
        {currentPage === 'reports' && <Reports reports={reports} />}
        {currentPage === 'photos' && (
          <GalleryPage
            photos={photos}
            onLoginClick={onLoginClick}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === 'connect' && <Connect />}

        {/* Photo Lightbox */}
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up"
            onClick={() => setLightboxPhoto(null)}
          >
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            <div
              className="max-w-5xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.caption}
                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                <span className="inline-flex items-center gap-1 bg-cyan-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  <Calendar className="w-3 h-3" />
                  {events.find(e => e.id === lightboxPhoto.eventId)?.title || 'Event'}
                </span>
                <p className="text-white text-lg font-medium">{lightboxPhoto.caption}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Translucent Footer */}
      {currentPage !== 'connect' && (
        <footer
          className="border-t py-12 mt-20 backdrop-blur-xl transition-all duration-500"
          style={{
            backgroundColor: isDark ? 'rgba(2, 6, 23, 0.7)' : 'rgba(248, 250, 252, 0.75)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="mb-4 md:mb-0 flex items-center gap-3">
              <img src={LOGO_URL} alt="DAC Logo" className="h-8 w-8 object-contain" />
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Data Analytics Club</span>
            </div>
            <div className={`flex space-x-6 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <button onClick={() => setCurrentPage('about')} className="hover:text-cyan-500 transition-colors">About</button>
              <button onClick={() => setCurrentPage('members')} className="hover:text-cyan-500 transition-colors">Members</button>
              <button onClick={() => setCurrentPage('events')} className="hover:text-cyan-500 transition-colors">Events</button>
              <button onClick={() => setCurrentPage('reports')} className="hover:text-cyan-500 transition-colors">Reports</button>
              <button onClick={() => setCurrentPage('photos')} className="hover:text-cyan-500 transition-colors">Gallery</button>
              <button onClick={() => setCurrentPage('connect')} className="hover:text-cyan-500 transition-colors">Connect</button>
            </div>
            <div className={`text-sm text-center md:text-right mt-4 md:mt-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <p>&copy; 2025 Data Analytics Club.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LandingPage;
