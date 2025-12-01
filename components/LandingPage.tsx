
import React, { useEffect, useState } from 'react';
import { ClubEvent, TeamMember, ClubReport, Photo } from '../types';
import { MOCK_TEAM, MOCK_MENTORS, MASCOT_URL, LOGO_URL } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ArrowRight, Calendar, Users, TrendingUp, ChevronDown, Camera, MapPin, Clock, CheckCircle, GraduationCap, X, Target, Lightbulb, Code, Briefcase, FileText, Download, ExternalLink } from 'lucide-react';

interface LandingPageProps {
  events: ClubEvent[];
  reports: ClubReport[];
  photos: Photo[];
  onLoginClick: () => void;
}

type PageView = 'home' | 'about' | 'members' | 'events' | 'photos' | 'reports';

const LandingPage: React.FC<LandingPageProps> = ({ events, reports, photos, onLoginClick }) => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    setIsVisible(true);
    // Handle fixed header offset for anchor links logic if needed, 
    // but here we are switching views, so we scroll top.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);
  
  // Data Logic
  const currentDate = new Date().toISOString().split('T')[0];
  const upcomingEvents = events.filter(e => e.date >= currentDate).sort((a, b) => a.date.localeCompare(b.date));
  const pastEvents = events.filter(e => e.date < currentDate).sort((a, b) => b.date.localeCompare(a.date));

  const chartData = [
    { name: 'Jan', members: 40 },
    { name: 'Feb', members: 55 },
    { name: 'Mar', members: 70 },
    { name: 'Apr', members: 90 },
    { name: 'May', members: 120 },
    { name: 'Jun', members: 150 },
  ];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://i.pravatar.cc/150?u=default';
  };

  const renderMemberCard = (member: TeamMember, isMentor = false) => (
    <div 
      key={member.id} 
      onClick={() => setSelectedMember(member)}
      className={`group bg-slate-900 rounded-2xl p-6 border ${isMentor ? 'border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-slate-800'} hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden`}
    >
      <div className={`w-32 h-32 rounded-full overflow-hidden mb-4 border-4 ${isMentor ? 'border-indigo-500/50' : 'border-slate-800'} group-hover:border-indigo-500 transition-colors`}>
        <img 
          src={member.imageUrl} 
          alt={member.name} 
          onError={handleImageError}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <h3 className="text-xl font-bold text-white">{member.name}</h3>
      <p className="text-indigo-400 font-bold text-sm mb-2">{member.role}</p>
      <span className="text-xs text-slate-500 px-3 py-1 bg-slate-800 rounded-full">{member.year}</span>
      
      <div className="absolute inset-0 bg-indigo-600/90 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
         <p className="text-white font-semibold text-lg mb-2">View Profile</p>
         <p className="text-indigo-100 text-xs">Click to see bio & skills</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-indigo-500/30 font-sans">
      
      {/* --- Navbar --- */}
      <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 group cursor-pointer" 
              onClick={() => setCurrentPage('home')}
            >
              <img src={LOGO_URL} alt="DAC Logo" className="h-10 w-10 object-contain drop-shadow-lg" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">Data Analytics Club</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'about', label: 'About' },
                { id: 'members', label: 'Members' },
                { id: 'events', label: 'Events' },
                { id: 'reports', label: 'Reports' },
                { id: 'photos', label: 'Gallery' }
              ].map((item) => (
                <button 
                  key={item.id} 
                  onClick={() => setCurrentPage(item.id as PageView)}
                  className={`text-sm font-medium transition-all duration-300 relative group py-2 hover:-translate-y-0.5 ${
                    currentPage === item.id ? 'text-indigo-400' : 'text-slate-300 hover:text-indigo-300'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(99,102,241,0.5)] ${
                    currentPage === item.id ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}></span>
                </button>
              ))}
            </div>

            {/* Login Button */}
            <button 
              onClick={onLoginClick}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:-translate-y-0.5"
            >
              Member Login
            </button>
          </div>
        </div>
      </nav>

      {/* --- Content Area --- */}
      <div className="pt-20">
        
        {/* === HOME PAGE === */}
        {currentPage === 'home' && (
          <>
            <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
              {/* Dynamic Background Elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
              </div>

              <div className="flex flex-col md:flex-row items-center relative z-10">
                <div className={`md:w-1/2 space-y-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-medium uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                    <span>Official Website</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                    Unlock the <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Power of Data</span>
                  </h1>
                  
                  <p className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed">
                    St. Joseph's College of Engineering – Department of AI & Data Science. A vibrant, inclusive community empowering students to learn, innovate, and lead.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button onClick={onLoginClick} className="group flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25">
                      <span>Members login</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setCurrentPage('events')}
                      className="flex items-center justify-center space-x-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 px-8 py-4 rounded-full font-semibold transition-all backdrop-blur-sm"
                    >
                      <span>View Events</span>
                    </button>
                  </div>
                </div>

                <div className={`md:w-1/2 mt-16 md:mt-0 relative transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                   {/* 3D Mascot Floating - Updated URL */}
                   <div className="absolute -top-16 -right-6 w-48 h-48 z-20 animate-float pointer-events-none md:pointer-events-auto">
                     <img src={MASCOT_URL} alt="3D Owl Mascot" className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
                   </div>

                  <div className="relative glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Growth Velocity</h3>
                        <p className="text-xs text-slate-400">Monthly active members</p>
                      </div>
                      <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> +12.5%
                      </div>
                    </div>
                    <div className="h-64 w-full min-h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                            <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                            <Tooltip 
                              cursor={{fill: '#334155', opacity: 0.2}}
                              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                              itemStyle={{ color: '#818cf8' }}
                            />
                            <Bar 
                              dataKey="members" 
                              fill="url(#colorGradient)" 
                              radius={[6, 6, 0, 0]} 
                              animationDuration={2000}
                            />
                            <defs>
                              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                              </linearGradient>
                            </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-slate-500 cursor-pointer" onClick={() => setCurrentPage('about')}>
                <ChevronDown className="w-6 h-6" />
              </div>
            </section>
            
            {/* CTA Section with Mascot */}
            <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800">
              <div className="max-w-4xl mx-auto px-4 text-center relative">
                 <div className="absolute -top-24 left-10 w-32 h-32 animate-float hidden md:block" style={{animationDelay: '1s'}}>
                    <img src={MASCOT_URL} alt="Mascot" className="w-full h-full object-contain opacity-80" />
                 </div>
                 <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to shape the future?</h2>
                 <p className="text-slate-400 mb-8 max-w-2xl mx-auto">Join a community of innovators, thinkers, and builders. Your data science journey starts here.</p>
                 <a 
                   href="https://chat.whatsapp.com/I8x1vrpqdnHFfym2ilUMg0"
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-block bg-white text-slate-950 hover:bg-indigo-50 px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-xl shadow-white/10"
                 >
                   Apply for Membership
                 </a>
              </div>
            </section>
          </>
        )}

        {/* === ABOUT PAGE === */}
        {currentPage === 'about' && (
          <div className="animate-fade-in-up">
            {/* About Hero */}
            <section className="bg-slate-900 pt-20 pb-16 border-b border-slate-800">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">St. Joseph's College of Engineering</h2>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Department of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI & Data Science</span></h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  A vibrant, inclusive community empowering students to learn, innovate, and lead in the fields of AI, Machine Learning, and Data Science.
                </p>
              </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-colors">
                  <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    To democratize data science education and create opportunities for students to engage with cutting-edge technologies while building practical skills for their careers.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-colors">
                  <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6">
                    <Lightbulb className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    To be the premier platform for data science learning and innovation, fostering the next generation of data scientists and AI experts.
                  </p>
                </div>
              </div>
            </section>

            {/* What You'll Learn */}
            <section className="py-16 bg-slate-900 border-y border-slate-800">
              <div className="max-w-7xl mx-auto px-4">
                <h3 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
                  <Code className="text-indigo-500"/> What You'll Learn
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    'Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 
                    'Data Visualization', 'Statistical Analysis', 'Deep Learning', 
                    'NLP', 'Computer Vision', 'Generative AI', 'Big Data'
                  ].map((skill, i) => (
                    <span key={i} className="px-6 py-3 bg-slate-800 rounded-full text-slate-300 border border-slate-700 hover:border-indigo-500 hover:text-white hover:bg-slate-800/80 transition-all cursor-default text-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === MEMBERS PAGE === */}
        {currentPage === 'members' && (
          <div className="animate-fade-in-up">
            <section className="py-12 bg-slate-900 border-b border-slate-800">
              <div className="max-w-4xl mx-auto px-4 text-center">
                 <h2 className="text-4xl font-bold mb-4">Meet Our People</h2>
                 <p className="text-slate-400">The brilliant minds and mentors driving innovation at Data Analytics Club.</p>
              </div>
            </section>

            <section className="py-12 max-w-7xl mx-auto px-4">
              
              {/* Mentors Section */}
              <div className="mb-16">
                 <div className="flex items-center gap-3 mb-8 pl-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                      <Briefcase className="w-6 h-6 text-indigo-400"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Mentors & Advisors</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {MOCK_MENTORS.map((mentor) => renderMemberCard(mentor, true))}
                 </div>
              </div>

              {/* Separator */}
              <div className="border-t border-slate-800 mb-16"></div>

              {/* Students Section */}
              <div>
                <div className="flex items-center gap-3 mb-8 pl-2">
                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                      <Users className="w-6 h-6 text-cyan-400"/>
                    </div>
                    <h3 className="text-2xl font-bold text-white">Student Core Team</h3>
                 </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {MOCK_TEAM.map((member) => renderMemberCard(member))}
                </div>
              </div>

            </section>

            {/* Member Detail Modal */}
            {selectedMember && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="flex flex-col md:flex-row">
                     <div className="md:w-2/5 h-64 md:h-auto relative">
                       <img 
                          src={selectedMember.imageUrl} 
                          alt={selectedMember.name} 
                          onError={handleImageError}
                          className="w-full h-full object-cover" 
                        />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden"></div>
                     </div>
                     <div className="md:w-3/5 p-8 flex flex-col justify-center">
                        <div className="mb-6">
                           <h2 className="text-3xl font-bold text-white mb-1">{selectedMember.name}</h2>
                           <p className="text-indigo-400 text-lg font-bold">{selectedMember.role}</p>
                           <p className="text-slate-500 text-sm flex items-center gap-2 mt-2">
                             <GraduationCap className="w-4 h-4"/> {selectedMember.year}
                           </p>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">About</h4>
                          <p className="text-slate-400 leading-relaxed text-sm">{selectedMember.bio}</p>
                        </div>

                        <div>
                           <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Skills & Expertise</h4>
                           <div className="flex flex-wrap gap-2">
                             {selectedMember.skills.map((skill, i) => (
                               <span key={i} className="px-3 py-1 bg-slate-800 rounded-md text-xs text-indigo-300 border border-slate-700">
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
        )}

        {/* === EVENTS PAGE === */}
        {currentPage === 'events' && (
          <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in-up">
            
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Event Calendar</h2>
              <p className="text-slate-400">Join us for workshops, hackathons, and speaker sessions.</p>
            </div>

            {/* Upcoming Events */}
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-500/20 rounded-lg"><Calendar className="w-6 h-6 text-indigo-400"/></div>
                <h3 className="text-2xl font-bold">Upcoming Events</h3>
              </div>
              
              {upcomingEvents.length > 0 ? (
                <div className="grid lg:grid-cols-2 gap-8">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex flex-col md:flex-row bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1">
                      <div className="md:w-2/5 h-48 md:h-auto relative">
                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded text-xs font-bold border border-white/10">
                          {event.date}
                        </div>
                      </div>
                      <div className="md:w-3/5 p-6 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{event.title}</h4>
                          <p className="text-sm text-slate-400 mb-4 line-clamp-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {event.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 6:00 PM</span>
                          </div>
                        </div>
                        <button onClick={onLoginClick} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
                  <p className="text-slate-500">No upcoming events scheduled. Check back soon!</p>
                </div>
              )}
            </section>

            {/* Past Events */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-700/30 rounded-lg"><CheckCircle className="w-6 h-6 text-slate-400"/></div>
                <h3 className="text-2xl font-bold text-slate-300">Previous Events</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {pastEvents.map(event => (
                  <div key={event.id} className="bg-slate-900/50 rounded-xl overflow-hidden border border-slate-800 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="h-40 relative grayscale hover:grayscale-0 transition-all duration-500">
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40"></div>
                      <div className="absolute bottom-3 left-3 text-white font-bold drop-shadow-md">{event.date}</div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-slate-200 mb-2 truncate">{event.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{event.description}</p>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
                         <span className="text-xs text-green-500 font-medium">Concluded</span>
                         <button onClick={() => setCurrentPage('photos')} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                           See Photos <ArrowRight className="w-3 h-3" />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* === REPORTS PAGE === */}
        {currentPage === 'reports' && (
          <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in-up">
            <div className="text-center mb-12">
               <h2 className="text-4xl font-bold mb-4">Event Reports</h2>
               <p className="text-slate-400">Download and view details of our past activities.</p>
            </div>

            {/* --- Downloadable Reports Grid --- */}
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8 pl-2">
                 <div className="p-2 bg-indigo-500/20 rounded-lg">
                   <FileText className="w-6 h-6 text-indigo-400"/>
                 </div>
                 <h3 className="text-2xl font-bold text-white">Monthly & Event Reports</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 {reports.length > 0 ? reports.map(report => (
                    <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all group flex flex-col">
                       <div className="h-40 relative overflow-hidden bg-slate-800">
                          <img src={report.thumbnailUrl} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <ExternalLink className="w-8 h-8 text-white drop-shadow-lg" />
                          </div>
                       </div>
                       <div className="p-5 flex-1 flex flex-col">
                          <h4 className="font-bold text-white mb-2 line-clamp-2">{report.title}</h4>
                          <p className="text-xs text-slate-400 mb-3 line-clamp-2 flex-1">{report.description}</p>
                          <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-800">
                             <span className="text-xs text-slate-500">{report.date}</span>
                             <button className="text-xs flex items-center gap-1 bg-slate-800 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md transition-colors">
                               <Download className="w-3 h-3" /> Download
                             </button>
                          </div>
                       </div>
                    </div>
                 )) : (
                   <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                     No public reports uploaded yet.
                   </div>
                 )}
              </div>
            </section>
          </div>
        )}

        {/* === PHOTOS PAGE === */}
        {currentPage === 'photos' && (
          <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in-up">
            <div className="text-center mb-12">
               <h2 className="text-4xl font-bold mb-4">Event Gallery</h2>
               <p className="text-slate-400">Capturing moments from our journey.</p>
            </div>
            
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {photos.map(photo => (
                <div key={photo.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden">
                   <img src={photo.url} alt={photo.caption} className="w-full h-auto transform group-hover:scale-110 transition-transform duration-700" />
                   
                   {/* Hover Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                          {events.find(e => e.id === photo.eventId)?.title || 'Event'}
                        </span>
                        <p className="text-white font-medium">{photo.caption}</p>
                      </div>
                   </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
               <p className="text-slate-500 mb-4">Have photos from a recent event?</p>
               <button onClick={onLoginClick} className="inline-flex items-center gap-2 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white px-6 py-2 rounded-full transition-colors text-sm">
                 <Camera className="w-4 h-4" /> Member Login to Upload
               </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
          <div className="mb-4 md:mb-0 flex items-center gap-3">
             <img src={LOGO_URL} alt="DAC Logo" className="h-8 w-8 object-contain" />
             <span className="text-xl font-bold text-white">Data Analytics Club</span>
          </div>
          <div className="flex space-x-6 text-sm text-slate-400">
             <button onClick={() => setCurrentPage('about')} className="hover:text-indigo-400">About</button>
             <button onClick={() => setCurrentPage('members')} className="hover:text-indigo-400">Members</button>
             <button onClick={() => setCurrentPage('events')} className="hover:text-indigo-400">Events</button>
             <button onClick={() => setCurrentPage('reports')} className="hover:text-indigo-400">Reports</button>
             <button onClick={() => setCurrentPage('photos')} className="hover:text-indigo-400">Gallery</button>
          </div>
          <div className="text-sm text-slate-500 text-center md:text-right mt-4 md:mt-0">
            <p>&copy; 2025 Data Analytics Club.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
