import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, MessageCircle } from 'lucide-react';
import ThreeDMascot from '../ThreeDMascot';
import { PageView } from '../../types';


interface HomeProps {
    onLoginClick: () => void;
    setCurrentPage: (page: PageView) => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick, setCurrentPage }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <>
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
                {/* Dynamic Background Elements - Updated to Cyan/Blue/Violet theme */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob"></div>
                    <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-violet-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>
                </div>

                <div className="flex flex-col md:flex-row items-center relative z-10">
                    <div className={`md:w-1/2 space-y-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                            <span>Official Department Club</span>
                        </div>

                        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Unlock the <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 drop-shadow-sm">Power of Data</span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-300 max-w-lg leading-relaxed font-light">
                            <span className="font-semibold text-white">St. Joseph's College of Engineering</span> <br />
                            Department of AI & Data Science.
                            <span className="block mt-4 text-base md:text-lg text-slate-400">Empowering the next generation of innovators directly from the campus.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4">
                            <button onClick={onLoginClick} className="relative group flex items-center justify-center space-x-2 bg-white text-black px-8 py-4 rounded-full font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                <span>Team Portal</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => setCurrentPage('events')}
                                className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-md"
                            >
                                <span>View Events</span>
                            </button>
                        </div>
                    </div>

                    <div className={`md:w-1/2 mt-16 md:mt-0 flex justify-center items-center transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <ThreeDMascot />
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-500 cursor-pointer hover:text-cyan-400 transition-colors" onClick={() => setCurrentPage('about')}>
                    <ChevronDown className="w-8 h-8 opacity-50" />
                </div>
            </section>



            {/* CTA Section - Glassy Card */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none"></div>
                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <div className="bg-[#0A0A0A]/50 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Ready to shape the future?</h2>
                        <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">Join a community of innovators, thinkers, and builders. Your data science journey starts here.</p>

                        <a
                            href="https://chat.whatsapp.com/I8x1vrpqdnHFfym2ilUMg0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-10 py-5 rounded-full font-bold transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
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
