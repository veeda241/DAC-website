import React, { useState } from 'react';
import { GraduationCap, X } from 'lucide-react';
import { MOCK_MENTORS, MOCK_TEAM } from '../../constants';
import { TeamMember } from '../../types';
import ProfileCard from '../ProfileCard';
import { useTheme } from '../../contexts/ThemeContext';

interface MembersProps {
    teamMembers?: TeamMember[];
}

const Members: React.FC<MembersProps> = ({ teamMembers }) => {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const { isDark } = useTheme();

    // Use live data when provided; fall back to mocks only when not passed (Supabase unreachable)
    const allMembers = teamMembers ?? [
        ...MOCK_MENTORS.map((m, i) => ({ ...m, memberType: 'mentor' as const, displayOrder: i })),
        ...MOCK_TEAM.map((m, i) => ({ ...m, memberType: 'team' as const, displayOrder: i })),
    ];

    const mentors = allMembers
        .filter(m => m.memberType === 'mentor')
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

    const coreTeam = allMembers
        .filter(m => m.memberType !== 'mentor')
        .sort((a, b) => {
            // If displayOrder is available (Supabase data), use it directly
            if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
                return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
            }
            // Fallback: original year-based sort for mock data
            const getYearWeight = (yearStr: string) => {
                const y = yearStr.toLowerCase();
                if (y.includes('final year') && !y.includes('pre')) return 1;
                if (y.includes('pre final') || y.includes('pre-final')) return 2;
                if (y.includes('second year') || y.includes('2nd year')) return 3;
                return 4;
            };
            return getYearWeight(a.year) - getYearWeight(b.year);
        });

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.src = 'https://i.pravatar.cc/150?u=default';
    };

    return (
        <div className="animate-fade-in-up">
            {/* Hero Section */}
            <section className="pt-40 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="text-purple-500 font-bold tracking-widest uppercase text-sm mb-4 block">Our Team</span>
                    <h2 className={`text-4xl md:text-6xl font-extrabold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-800">Visionaries</span>
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
                        <div className="w-1 h-10 bg-gradient-to-b from-slate-400 to-slate-500 rounded-full"></div>
                        <h3 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Mentors &amp; Advisors</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                        {mentors.map((mentor) => (
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
                                behindGlowColor="rgba(147, 51, 234, 0.4)"
                                innerGradient="linear-gradient(145deg, rgba(147, 51, 234, 0.15) 0%, rgba(71, 85, 105, 0.1) 100%)"
                                onClick={() => setSelectedMember(mentor)}
                            />
                        ))}
                    </div>
                </div>

                {/* Core Team Section */}
                <div>
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-1 h-10 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full"></div>
                        <h3 className={`text-2xl md:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Core Team</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
                        {coreTeam.map((member) => (
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
                                behindGlowColor="rgba(147, 51, 234, 0.4)"
                                innerGradient="linear-gradient(145deg, rgba(147, 51, 234, 0.15) 0%, rgba(71, 85, 105, 0.1) 100%)"
                                onClick={() => setSelectedMember(member)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Member Detail Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <div className={`border rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#0A0A0C] border-white/10' : 'bg-white border-black/10'}`}>
                        <button
                            onClick={() => setSelectedMember(null)}
                            className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${isDark ? 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white' : 'bg-black/5 hover:bg-black/10 text-slate-500 hover:text-slate-900'}`}
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
                                <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent md:bg-gradient-to-r ${isDark ? 'from-[#0A0A0C]' : 'from-white'}`}></div>
                            </div>

                            <div className="md:w-3/5 p-8 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedMember.name}</h2>
                                    <p className="text-purple-500 text-lg font-bold tracking-wide">{selectedMember.role}</p>
                                    <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                                        <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {selectedMember.year}</span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Biography</h4>
                                    <p className={`leading-relaxed text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedMember.bio}</p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Expertise</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedMember.skills.map((skill, i) => (
                                            <span key={i} className={`px-3 py-1 rounded-lg text-xs border ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
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
