import React, { useState } from 'react';
import { Briefcase, Users, GraduationCap, X, Linkedin, Github, Mail } from 'lucide-react';
import { MOCK_MENTORS, MOCK_TEAM } from '../../constants';
import { TeamMember } from '../../types';

const Members: React.FC = () => {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = 'https://i.pravatar.cc/150?u=default';
    };

    const renderMemberCard = (member: TeamMember, isMentor = false) => (
        <div
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className={`group relative bg-[#0A0A0A] rounded-[2rem] p-6 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-2`}
        >
            {/* Hover Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-32 h-32 rounded-full p-1 mb-5 bg-gradient-to-tr ${isMentor ? 'from-amber-400 to-orange-500' : 'from-cyan-500 to-blue-600'} opacity-90 group-hover:opacity-100 transition-opacity`}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-black border-4 border-black">
                        <img
                            src={member.imageUrl}
                            alt={member.name}
                            onError={handleImageError}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{member.name}</h3>
                <p className={`text-sm font-bold uppercase tracking-wider mb-3 ${isMentor ? 'text-amber-400' : 'text-blue-400'}`}>{member.role}</p>

                <div className="mt-auto">
                    {!isMentor && (
                        <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400">
                            {member.year}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in-up">
            <section className="pt-40 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Visionaries</span></h2>
                    <p className="text-xl text-slate-400">The brilliant minds and mentors driving innovation at Data Analytics Club.</p>
                </div>
            </section>

            <section className="py-12 max-w-7xl mx-auto px-4">
                {/* Mentors Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-10 pl-2 border-l-4 border-amber-500">
                        <h3 className="text-3xl font-bold text-white ml-2">Mentors & Advisors</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {MOCK_MENTORS.map((mentor) => renderMemberCard(mentor, true))}
                    </div>
                </div>

                {/* Students Section */}
                <div>
                    <div className="flex items-center gap-3 mb-10 pl-2 border-l-4 border-cyan-500">
                        <h3 className="text-3xl font-bold text-white ml-2">Core Team</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {MOCK_TEAM.map((member) => renderMemberCard(member))}
                    </div>
                </div>
            </section>

            {/* Member Detail Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up">
                    <div className="bg-[#0F0F11] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full">
                            <div className="md:w-2/5 h-72 md:h-auto relative">
                                <img
                                    src={selectedMember.imageUrl}
                                    alt={selectedMember.name}
                                    onError={handleImageError}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-transparent to-transparent md:bg-gradient-to-r"></div>
                            </div>

                            <div className="md:w-3/5 p-8 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold text-white mb-2">{selectedMember.name}</h2>
                                    <p className="text-cyan-400 text-lg font-bold tracking-wide">{selectedMember.role}</p>
                                    <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                                        <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {selectedMember.year}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Biography</h4>
                                    <p className="text-slate-300 leading-relaxed text-sm">{selectedMember.bio}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMember.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-xs text-indigo-200 border border-white/5">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;
