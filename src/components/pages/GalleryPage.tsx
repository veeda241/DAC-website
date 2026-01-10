import React, { useState } from 'react';
import { ArrowLeft, Users, Camera, Sparkles } from 'lucide-react';
import DomeGallery from '../DomeGallery';
import { Photo, PageView } from '../../types';

interface GalleryPageProps {
    photos: Photo[];
    onLoginClick: () => void;
    setCurrentPage: (page: PageView) => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ photos, onLoginClick, setCurrentPage }) => {
    const [galleryFilter] = useState<string>('all');

    const getFilteredPhotos = () => {
        if (galleryFilter === 'all') return photos;
        return photos.filter(p => p.eventId === galleryFilter);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#02040a]">
            {/* --- Premium Header Overlay --- */}
            <div className="absolute top-0 left-0 right-0 z-20 p-6 flex flex-col sm:flex-row items-center justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-none">

                {/* Left: Back & Title */}
                <div className="flex items-center gap-6 pointer-events-auto">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white transition-all backdrop-blur-md"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Back</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="h-8 w-px bg-white/10 hidden sm:block" />
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-md flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-cyan-400" /> 3D Gallery
                            </h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold hidden sm:block">Immersive Experience</p>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 pointer-events-auto mt-4 sm:mt-0">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/30 px-4 py-2 rounded-full border border-cyan-500/20 backdrop-blur-md">
                        {photos.length} Memories
                    </span>
                    <button
                        onClick={onLoginClick}
                        className="flex items-center gap-2 bg-white/5 hover:bg-cyan-600 hover:text-white border border-white/10 text-cyan-400 px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg"
                    >
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-bold">Admin Portal</span>
                    </button>
                </div>
            </div>

            {/* Dome Gallery */}
            <DomeGallery
                images={getFilteredPhotos().map(p => ({ src: p.url, alt: p.caption }))}
                overlayBlurColor="#02040a"
                segments={20}
                grayscale={false}
                imageBorderRadius="24px"
            />

            {/* --- Footer Instructions --- */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full max-w-md px-4">
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-full flex flex-col items-center gap-1 shadow-2xl">
                    <p className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
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
