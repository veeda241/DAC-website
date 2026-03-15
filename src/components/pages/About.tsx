import React from 'react';
import { Target, Lightbulb, Code, Award, BookOpen } from 'lucide-react';
import { LOGO_URL, COLLEGE_LOGO_URL, DEPT_LOGO_URL } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

const About: React.FC = () => {
    const { isDark } = useTheme();
    return (
        <div className="animate-fade-in-up">
            {/* About Hero */}
            <section className="pt-40 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-purple-600/20 rounded-full blur-[120px] -z-10"></div>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border-purple-500/30 bg-purple-500/10 backdrop-blur-md">
                        <span className="text-sm font-semibold text-purple-300 uppercase tracking-widest">St. Joseph's College of Engineering</span>
                    </div>
                    <h1 className={`text-5xl md:text-7xl font-extrabold mb-8 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Department of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">
                            AI & Data Science
                        </span>
                    </h1>
                    <p className={`text-xl max-w-2xl mx-auto leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        A vibrant, inclusive community empowering students to learn, innovate, and lead in the fields of AI, Machine Learning, and Data Science.
                    </p>
                </div>
            </section>

            {/* College & Department Logos - Glass Cards */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* College Logo */}
                        <div className={`group relative backdrop-blur-xl border p-10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-xl ${isDark ? 'bg-[#0A0A0A]/60 border-white/5 hover:border-purple-500/30' : 'bg-white/70 border-black/10 hover:border-purple-500/40'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-8 p-6 bg-white rounded-3xl shadow-2xl shadow-purple-900/20 group-hover:scale-110 transition-transform duration-500">
                                    <img
                                        src={COLLEGE_LOGO_URL}
                                        alt="St. Joseph's College of Engineering Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>St. Joseph's College of Engineering</h3>
                                <p className={`leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Established in 1994, St. Joseph's College of Engineering is an autonomous institution affiliated to Anna University.
                                    <span className="text-purple-500 font-medium"> NAAC 'A++' Grade</span> accredited.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <span className={`text-xs font-bold px-4 py-2 rounded-xl border ${isDark ? 'bg-purple-950 text-purple-500 border-purple-900/50' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>NAAC A++</span>
                                    <span className={`text-xs font-bold px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>Autonomous</span>
                                </div>
                            </div>
                        </div>

                        {/* Department Logo */}
                        <div className={`group relative backdrop-blur-xl border p-10 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-xl ${isDark ? 'bg-[#0A0A0A]/60 border-white/5 hover:border-purple-500/30' : 'bg-white/70 border-black/10 hover:border-purple-500/40'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-8 p-6 bg-gradient-to-br from-slate-900 to-black rounded-3xl shadow-2xl shadow-purple-900/20 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center border border-white/10">
                                    <img
                                        src={DEPT_LOGO_URL}
                                        alt="Department Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Department of AI & Data Science</h3>
                                <p className={`leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Dedicated to shaping the next generation of data scientists. Cutting-edge curriculum, industry partnerships, and
                                    <span className="text-purple-500 font-medium"> advanced research focus</span>.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <span className={`text-xs font-bold px-4 py-2 rounded-xl border ${isDark ? 'bg-purple-950 text-purple-500 border-purple-900/50' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>AI & ML Focus</span>
                                    <span className={`text-xs font-bold px-4 py-2 rounded-xl border ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>Industry Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-10 rounded-[2rem] border transition-all group ${isDark ? 'bg-[#0f0f11] border-white/5 hover:border-purple-500/30' : 'bg-white border-black/10 hover:border-purple-500/40 hover:shadow-lg'}`}>
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Mission</h3>
                        <p className={`leading-relaxed text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            To democratize data science education and create opportunities for students to engage with cutting-edge technologies while building practical skills for their careers.
                        </p>
                    </div>

                    <div className={`p-10 rounded-[2rem] border transition-all group ${isDark ? 'bg-[#0f0f11] border-white/5 hover:border-slate-500/30' : 'bg-white border-black/10 hover:border-slate-500/40 hover:shadow-lg'}`}>
                        <div className="w-16 h-16 bg-slate-500/10 rounded-2xl flex items-center justify-center mb-6 text-slate-500 group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-8 h-8" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Vision</h3>
                        <p className={`leading-relaxed text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            To be the premier platform for data science learning and innovation, fostering the next generation of data scientists and AI experts.
                        </p>
                    </div>
                </div>
            </section>

            {/* What You'll Learn - Shiny Pills */}
            <section className={`py-24 relative border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 mb-12">
                        <Code className="text-purple-500 w-6 h-6" />
                        <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Technical Arsenal</h3>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            'Python', 'R', 'SQL', 'TensorFlow', 'PyTorch',
                            'Data Visualization', 'Statistical Analysis', 'Deep Learning',
                            'NLP', 'Computer Vision', 'Generative AI', 'Big Data Engineering'
                        ].map((skill, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                                <span className={`relative block px-6 py-3 rounded-full border transition-colors cursor-default ${isDark ? 'bg-[#0A0A0A] text-slate-300 border-white/10 group-hover:text-white' : 'bg-white text-slate-700 border-black/10 group-hover:text-slate-900 shadow-sm hover:shadow-md'}`}>
                                    {skill}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
