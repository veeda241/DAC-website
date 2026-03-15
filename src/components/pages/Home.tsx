import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import ThreeDMascot from '../ThreeDMascot';
import { PageView } from '../../types';
import { WHATSAPP_GROUP_LINK } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';



interface HomeProps {
    onLoginClick: () => void;
    setCurrentPage: (page: PageView) => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, setCurrentPage }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <>
            <section className="relative z-20 min-h-screen flex flex-col justify-center overflow-hidden">
                {/* Dynamic Background Elements - NOW FULL WIDTH AND BLENDED */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(0,0,0,0.4)_100%)] z-[1]"></div>
                    <div className={`absolute top-[-15%] left-[-10%] w-[800px] h-[800px] rounded-full filter blur-[150px] animate-blob ${isDark ? 'bg-purple-600 mix-blend-screen opacity-15' : 'bg-purple-300 mix-blend-multiply opacity-20'}`}></div>
                    <div className={`absolute top-[10%] right-[-10%] w-[800px] h-[800px] rounded-full filter blur-[150px] animate-blob animation-delay-2000 ${isDark ? 'bg-slate-500 mix-blend-screen opacity-15' : 'bg-slate-300 mix-blend-multiply opacity-20'}`}></div>
                    <div className={`absolute bottom-[-15%] left-[10%] w-[800px] h-[800px] rounded-full filter blur-[150px] animate-blob animation-delay-4000 ${isDark ? 'bg-indigo-900 mix-blend-screen opacity-15' : 'bg-indigo-300 mix-blend-multiply opacity-20'}`}></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 mt-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className={`md:w-1/2 space-y-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                                <span>Official Department Club</span>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
                                Unlock the <br />
                                <span className={`bg-clip-text text-transparent bg-gradient-to-r drop-shadow-sm ${isDark ? 'from-purple-500 via-slate-400 to-white' : 'from-purple-600 via-slate-500 to-slate-800'}`}>Power of Data</span>
                            </h1>

                            <p className="text-lg md:text-2xl text-slate-300 max-w-lg leading-relaxed font-light">
                                <span className="font-semibold text-white">St. Joseph's College of Engineering</span> <br />
                                Department of AI & Data Science.
                                <span className="block mt-4 text-base md:text-lg text-slate-400">Empowering the next generation of innovators directly from the campus.</span>
                            </p>

                            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                                <button
                                    onClick={() => setCurrentPage('events')}
                                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-slate-600 hover:from-purple-500 hover:to-slate-500 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                                >
                                    <span>View Events</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className={`md:w-1/2 mt-16 md:mt-0 flex justify-center items-center transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <ThreeDMascot />
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-500 cursor-pointer hover:text-purple-500 transition-colors" onClick={() => setCurrentPage('about')}>
                    <ChevronDown className="w-8 h-8 opacity-50" />
                </div>
            </section>





            {/* CTA Section - Glassy Card */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <div className={`backdrop-blur-2xl border rounded-[2.5rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group ${isDark ? 'bg-[#0A0A0A]/50 border-white/5' : 'bg-white/70 border-black/5'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-slate-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to shape the future?</h2>
                        <p className={`mb-10 max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Join a community of innovators, thinkers, and builders. Your data science journey starts here.</p>

                        <a
                            href={WHATSAPP_GROUP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative z-10 inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-slate-600 hover:from-purple-500 hover:to-slate-500 text-white px-10 py-5 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            <span>Join via WhatsApp</span>
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
