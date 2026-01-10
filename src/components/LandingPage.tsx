import React, { useEffect, useState } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { ClubEvent, ClubReport, Photo, PageView } from '../types';
import { LOGO_URL } from '../constants';
import Beams from './Beams';

// Page Components
import Home from './pages/Home';
import About from './pages/About';
import Members from './pages/Members';
import Events from './pages/Events';
import Reports from './pages/Reports';
import GalleryPage from './pages/GalleryPage';

interface LandingPageProps {
  events: ClubEvent[];
  reports: ClubReport[];
  photos: Photo[];
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ events, reports, photos, onLoginClick }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30 font-sans relative">
      {/* Background Animation - Updated Color */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Beams lightColor="#06b6d4" />
      </div>

      {/* --- Premium Glass Navbar --- */}
      <nav className="fixed w-full z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5 transition-all duration-300 supports-[backdrop-filter]:bg-opacity-60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo area */}
            <div
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                <img src={LOGO_URL} alt="DAC Logo" className="relative h-11 w-11 object-contain" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 hidden sm:block tracking-tight group-hover:from-cyan-400 group-hover:to-blue-400 transition-all duration-300">
                Data Analytics Club
              </span>
              <span className="text-xl font-bold text-white sm:hidden tracking-tight">DAC</span>
            </div>

            {/* Desktop Nav - Pill Design */}
            <div className="hidden md:flex items-center p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
              {[
                { id: 'about', label: 'About' },
                { id: 'members', label: 'Members' },
                { id: 'events', label: 'Events' },
                { id: 'reports', label: 'Reports' },
                { id: 'photos', label: 'Gallery' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id as PageView)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentPage === item.id
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Login Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={onLoginClick}
                className="hidden md:block relative group px-6 py-2.5 rounded-full overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-[1px] bg-[#050505] rounded-full group-hover:bg-transparent transition-colors duration-300"></div>
                <span className="relative text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:text-white transition-colors duration-300">
                  Team Portal
                </span>
              </button>

              <button
                className="md:hidden text-slate-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 absolute w-full animate-fade-in-up">
            <div className="px-4 py-6 space-y-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'members', label: 'Members' },
                { id: 'events', label: 'Events' },
                { id: 'reports', label: 'Reports' },
                { id: 'photos', label: 'Gallery' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as PageView);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-colors ${currentPage === item.id
                    ? 'bg-indigo-900/20 text-indigo-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  onLoginClick();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-3 rounded-lg text-base font-semibold transition-colors text-center"
              >
                Team Portal
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* --- Content Area --- */}
      <div>
        {currentPage === 'home' && <Home onLoginClick={onLoginClick} setCurrentPage={setCurrentPage} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'members' && <Members />}
        {currentPage === 'events' && (
          <Events
            events={events}
            photos={photos}
            onLoginClick={onLoginClick}
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
              <X className="w-6 h-6" />
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
                <span className="inline-flex items-center gap-1 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full mb-2">
                  <Calendar className="w-3 h-3" />
                  {events.find(e => e.id === lightboxPhoto.eventId)?.title || 'Event'}
                </span>
                <p className="text-white text-lg font-medium">{lightboxPhoto.caption}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {/* Hide footer on full-screen pages like Gallery if preferred, but keeping for others */}
      {currentPage !== 'photos' && (
        <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="mb-4 md:mb-0 flex items-center gap-3">
              <img src={LOGO_URL} alt="DAC Logo" className="h-8 w-8 object-contain" />
              <span className="text-xl font-bold text-white">Data Analytics Club</span>
            </div>
            <div className="flex space-x-6 text-sm text-slate-400">
              <button onClick={() => setCurrentPage('about')} className="hover:text-indigo-400">About</button>
              <button onClick={() => setCurrentPage('members')} className="hover:text-indigo-400">Members</button>
              <button onClick={() => setCurrentPage('events')} className="hover:text-indigo-400">Events</button>
              <button onClick={() => setCurrentPage('reports')} className="hover:text-indigo-400">Reports</button>
              <button onClick={() => setCurrentPage('photos')} className="hover:text-indigo-400">Gallery</button>
            </div>
            <div className="text-sm text-slate-500 text-center md:text-right mt-4 md:mt-0">
              <p>&copy; 2025 Data Analytics Club.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default LandingPage;
