import React, { useEffect, useState } from 'react';
import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import {
    WHATSAPP_GROUP_LINK,
    SOCIAL_LINKS,
} from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

const Connect: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const socialPlatforms = [
        {
            name: 'GitHub',
            url: SOCIAL_LINKS.github,
            gradientFrom: 'from-gray-700',
            gradientTo: 'to-gray-900',
            borderColor: 'border-gray-600/50',
            hoverGlow: 'hover:shadow-gray-500/30',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            ),
        },
        {
            name: 'LinkedIn',
            url: SOCIAL_LINKS.linkedin,
            gradientFrom: 'from-blue-600',
            gradientTo: 'to-blue-800',
            borderColor: 'border-blue-500/50',
            hoverGlow: 'hover:shadow-blue-500/30',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        {
            name: 'YouTube',
            url: SOCIAL_LINKS.youtube,
            gradientFrom: 'from-purple-600',
            gradientTo: 'to-purple-800',
            borderColor: 'border-purple-500/50',
            hoverGlow: 'hover:shadow-purple-500/30',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
        },
        {
            name: 'Discord',
            url: SOCIAL_LINKS.discord,
            gradientFrom: 'from-purple-600',
            gradientTo: 'to-purple-800',
            borderColor: 'border-purple-500/50',
            hoverGlow: 'hover:shadow-purple-500/30',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                </svg>
            ),
        },
        {
            name: 'Instagram',
            url: SOCIAL_LINKS.instagram,
            gradientFrom: 'from-pink-500',
            gradientTo: 'to-purple-600',
            borderColor: 'border-pink-500/50',
            hoverGlow: 'hover:shadow-pink-500/30',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
            ),
        },
        {
            name: 'WhatsApp',
            url: WHATSAPP_GROUP_LINK,
            gradientFrom: 'from-green-600',
            gradientTo: 'to-green-800',
            borderColor: 'border-green-500/50',
            hoverGlow: 'hover:shadow-green-500/30',
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="animate-fade-in-up">
            {/* SVG Clip Path Definition */}
            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
                        <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5" />
                    </clipPath>
                </defs>
            </svg>

            {/* Hero Section */}
            <section className="pt-40 pb-16 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] -z-10"></div>
                <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
                        <span className="text-sm font-semibold text-purple-500 uppercase tracking-widest">Stay Connected</span>
                    </div>
                    <h1 className={`text-5xl md:text-7xl font-extrabold mb-6 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Connect{' '}
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-slate-500 ${isDark ? 'to-white' : 'to-slate-600'}`}>
                            With Us
                        </span>
                    </h1>
                    <p className={`text-xl max-w-2xl mx-auto leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        Follow our journey, join the community, and stay updated with the latest from the Data Analytics Club.
                    </p>
                </div>
            </section>

            {/* Social Media Dock Section */}
            <section className="py-16 px-4">
                <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {/* Glassmorphism Card Container */}
                    <div className="relative">
                        <div className={`absolute inset-0 backdrop-blur-xl rounded-3xl border shadow-2xl ${isDark ? 'bg-black/20 border-white/10' : 'bg-white/80 border-black/10'}`}></div>

                        <div className="relative p-8 md:p-12">
                            <h2 className={`text-2xl font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Platforms</h2>
                            <p className="text-slate-500 text-center mb-10">Click on any platform to visit us</p>

                            {/* Social Media Dock */}
                            <div className="flex flex-wrap items-end justify-center gap-4 md:gap-6">
                                {socialPlatforms.filter(p => p.url).map((platform) => (
                                    <a
                                        key={platform.name}
                                        href={platform.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col items-center gap-3"
                                        id={`connect-${platform.name.toLowerCase()}`}
                                    >
                                        <div className="relative">
                                            <div
                                                style={{ clipPath: 'url(#squircleClip)' }}
                                                className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${platform.gradientFrom} ${platform.gradientTo} flex items-center justify-center shadow-lg ${platform.borderColor} cursor-pointer transform transition-all duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-3 group-hover:shadow-2xl ${platform.hoverGlow}`}
                                            >
                                                {platform.icon}
                                            </div>
                                        </div>
                                        <span className={`text-xs md:text-sm font-medium transition-colors ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}>
                                            {platform.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Information Cards */}
            <section className="py-16 px-4">
                <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Email Card */}
                        <div className={`group relative backdrop-blur-xl border p-8 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-[#0A0A0A]/60 border-white/5 hover:border-purple-500/30' : 'bg-white/70 border-black/5 hover:border-purple-500/40 shadow-sm'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Email Us</h3>
                                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Reach out for collaborations, queries, or feedback.</p>
                                <a
                                    href="mailto:dataanalytics@stjosephs.ac.in"
                                    className="text-purple-500 hover:text-purple-400 transition-colors text-sm font-medium inline-flex items-center gap-1"
                                >
                                    dataanalytics@stjosephs.ac.in
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className={`group relative backdrop-blur-xl border p-8 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-[#0A0A0A]/60 border-white/5 hover:border-slate-500/30' : 'bg-white/70 border-black/5 hover:border-slate-500/40 shadow-sm'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-slate-500/10 rounded-2xl flex items-center justify-center mb-6 text-slate-500 group-hover:scale-110 transition-transform duration-300">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Visit Us</h3>
                                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Department of AI & Data Science</p>
                                <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    St. Joseph's College of Engineering, Chennai
                                </span>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className={`group relative backdrop-blur-xl border p-8 rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-[#0A0A0A]/60 border-white/5 hover:border-purple-500/30' : 'bg-white/70 border-black/5 hover:border-purple-500/40 shadow-sm'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Call Us</h3>
                                <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Available on weekdays during office hours.</p>
                                <span className="text-purple-500 text-sm font-medium">
                                    +91 99405 19002
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Connect;
