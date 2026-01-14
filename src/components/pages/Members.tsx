import React, { useState } from 'react';
import { GraduationCap, X } from 'lucide-react';
import { MOCK_MENTORS, MOCK_TEAM } from '../../constants';
import { TeamMember } from '../../types';
import ProfileCard from '../ProfileCard';

const Members: React.FC = () => {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = 'https://i.pravatar.cc/150?u=default';
    };

    return (
        <div className="animate-fade-in-up">
            {/* Hero Section */}
            <section className="pt-40 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Team</span>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Visionaries</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                        The brilliant minds and mentors driving innovation at Data Analytics Club.
                    </p>
                </div>
            </section>

            <section className="py-12 max-w-7xl mx-auto px-4">
                {/* Mentors Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1 h-10 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full"></div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">Mentors & Advisors</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {MOCK_MENTORS.map((mentor) => (
                            <ProfileCard
                                key={mentor.id}
                                name={mentor.name}
                                title={mentor.role}
                                avatarUrl={mentor.imageUrl}
                                handle={mentor.name.toLowerCase().replace(/\s+/g, '')}
                                status="Mentor"
                                contactText="View Profile"
                                showUserInfo={true}
                                enableTilt={true}
                                behindGlowColor="rgba(251, 191, 36, 0.4)"
                                innerGradient="linear-gradient(145deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%)"
                                onClick={() => setSelectedMember(mentor)}
                            />
                        ))}
                    </div>
                </div>

                {/* Core Team Section */}
                <div>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">Core Team</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                        {MOCK_TEAM.sort((a, b) => {
                            // Helper to determine year weight
                            const getYearWeight = (yearStr: string) => {
                                const y = yearStr.toLowerCase();
                                if (y.includes('final year') && !y.includes('pre')) return 1;
                                if (y.includes('pre final') || y.includes('pre-final')) return 2;
                                if (y.includes('second year') || y.includes('2nd year')) return 3;
                                return 4; // Others/Unknown
                            };
                            return getYearWeight(a.year) - getYearWeight(b.year);
                        }).map((member) => (
                            <ProfileCard
                                key={member.id}
                                name={member.name}
                                title={member.role}
                                avatarUrl={member.imageUrl}
                                handle={member.name.toLowerCase().replace(/\s+/g, '')}
                                status={member.year}
                                contactText="View Profile"
                                showUserInfo={true}
                                enableTilt={true}
                                behindGlowColor="rgba(6, 182, 212, 0.4)"
                                innerGradient="linear-gradient(145deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)"
                                onClick={() => setSelectedMember(member)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Member Detail Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <div className="bg-[#0A0A0C] border border-white/10 rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0C] via-transparent to-transparent md:bg-gradient-to-r"></div>
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
                                            <span key={i} className="px-3 py-1 bg-cyan-500/10 rounded-lg text-xs text-cyan-300 border border-cyan-500/20">
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
