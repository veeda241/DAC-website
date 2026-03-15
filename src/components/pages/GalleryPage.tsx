import React, { useState } from 'react';
import { ArrowLeft, Users, Camera, Sparkles } from 'lucide-react';
import DomeGallery from '../DomeGallery';
import { Photo, PageView } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface GalleryPageProps {
    photos: Photo[];
    onLoginClick: () => void;
    setCurrentPage: (page: PageView) => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ photos, onLoginClick, setCurrentPage }) => {
    const [galleryFilter] = useState<string>('all');
    const { isDark } = useTheme();

    const getFilteredPhotos = () => {
        if (galleryFilter === 'all') return photos;
        return photos.filter(p => p.eventId === galleryFilter);
    };

    return (
        <div className={`relative w-full h-[80vh] md:h-[90vh] mt-24 overflow-hidden ${isDark ? 'bg-transparent' : 'bg-[#f8fafc]'}`}>
            {/* RemovedStandalone Header to show common Navbar */}

            {/* Dome Gallery */}
            <DomeGallery
                images={getFilteredPhotos().map(p => ({ src: p.url, alt: p.caption }))}
                overlayBlurColor={isDark ? '#02040a' : '#f8fafc'}
                segments={20}
                grayscale={false}
                imageBorderRadius="24px"
            />

            {/* --- Footer Instructions --- */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full max-w-md px-4">
                <div className={`backdrop-blur-xl border px-6 py-3 rounded-full flex flex-col items-center gap-1 shadow-2xl ${isDark ? 'bg-black/40 border-white/5' : 'bg-white/80 border-black/10'}`}>
                    <p className={`text-sm font-medium flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                        Drag to explore
                    </p>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Camera className="w-3 h-3" /> Powered by WebGL
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;
