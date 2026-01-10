import React from 'react';
import { Target, Lightbulb, Code, Award, BookOpen } from 'lucide-react';
import { LOGO_URL, COLLEGE_LOGO_URL } from '../../constants';

const About: React.FC = () => {
    return (
        <div className="animate-fade-in-up">
            {/* About Hero */}
            <section className="pt-40 pb-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md">
                        <span className="text-sm font-semibold text-indigo-300 uppercase tracking-widest">St. Joseph's College of Engineering</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
                        Department of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                            AI & Data Science
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                        A vibrant, inclusive community empowering students to learn, innovate, and lead in the fields of AI, Machine Learning, and Data Science.
                    </p>
                </div>
            </section>

            {/* College & Department Logos - Glass Cards */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* College Logo */}
                        <div className="group relative bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/5 p-10 rounded-[2rem] overflow-hidden hover:border-cyan-500/30 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-8 p-6 bg-white rounded-3xl shadow-2xl shadow-cyan-900/20 group-hover:scale-110 transition-transform duration-500">
                                    <img
                                        src={COLLEGE_LOGO_URL}
                                        alt="St. Joseph's College of Engineering Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">St. Joseph's College of Engineering</h3>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    Established in 1994, St. Joseph's College of Engineering is an autonomous institution affiliated to Anna University.
                                    <span className="text-cyan-400 font-medium"> NAAC 'A++' Grade</span> accredited.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <span className="text-xs font-bold bg-cyan-950 text-cyan-400 px-4 py-2 rounded-xl border border-cyan-900/50">NAAC A++</span>
                                    <span className="text-xs font-bold bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-700">Autonomous</span>
                                </div>
                            </div>
                        </div>

                        {/* Department Logo */}
                        <div className="group relative bg-[#0A0A0A]/60 backdrop-blur-xl border border-white/5 p-10 rounded-[2rem] overflow-hidden hover:border-violet-500/30 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-32 h-32 mb-8 p-6 bg-gradient-to-br from-slate-900 to-black rounded-3xl shadow-2xl shadow-violet-900/20 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center border border-white/10">
                                    <img
                                        src={LOGO_URL}
                                        alt="Department Logo"
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Department of AI & Data Science</h3>
                                <p className="text-slate-400 leading-relaxed mb-6">
                                    Dedicated to shaping the next generation of data scientists. Cutting-edge curriculum, industry partnerships, and
                                    <span className="text-violet-400 font-medium"> advanced research focus</span>.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <span className="text-xs font-bold bg-violet-950 text-violet-400 px-4 py-2 rounded-xl border border-violet-900/50">AI & ML Focus</span>
                                    <span className="text-xs font-bold bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-700">Industry Ready</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-[#0f0f11] p-10 rounded-[2rem] border border-white/5 hover:border-cyan-500/30 transition-all group">
                        <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            To democratize data science education and create opportunities for students to engage with cutting-edge technologies while building practical skills for their careers.
                        </p>
                    </div>

                    <div className="bg-[#0f0f11] p-10 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all group">
                        <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                            <Lightbulb className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            To be the premier platform for data science learning and innovation, fostering the next generation of data scientists and AI experts.
                        </p>
                    </div>
                </div>
            </section>

            {/* What You'll Learn - Shiny Pills */}
            <section className="py-24 relative border-t border-white/5">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 mb-12">
                        <Code className="text-cyan-400 w-6 h-6" />
                        <h3 className="text-3xl font-bold text-white">Technical Arsenal</h3>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            'Python', 'R', 'SQL', 'TensorFlow', 'PyTorch',
                            'Data Visualization', 'Statistical Analysis', 'Deep Learning',
                            'NLP', 'Computer Vision', 'Generative AI', 'Big Data Engineering'
                        ].map((skill, i) => (
                            <div key={i} className="group relative">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-100 transition duration-500"></div>
                                <span className="relative block px-6 py-3 bg-[#0A0A0A] rounded-full text-slate-300 border border-white/10 group-hover:text-white transition-colors cursor-default">
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
