import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, Camera, ArrowRight, X, FileText } from 'lucide-react';
import { ClubEvent, Photo, PageView } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import {
    compareEventDates,
    formatEventDate,
    isEventPast,
    isEventUpcoming,
} from '../../utils/eventDates';

interface EventsProps {
    events: ClubEvent[];
    photos: Photo[];
    onLoginClick: () => void;
    onRegisterClick: () => void;
    setCurrentPage: (page: PageView) => void;
    setLightboxPhoto: (photo: Photo | null) => void;
}

const Events: React.FC<EventsProps> = ({ events, photos, onLoginClick, onRegisterClick, setCurrentPage, setLightboxPhoto }) => {
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);
    const { isDark } = useTheme();

    const upcomingEvents = events
        .filter(e => isEventUpcoming(e.date, e.endDate))
        .sort((a, b) => compareEventDates(a.date, b.date));
    const pastEvents = events
        .filter(e => isEventPast(e.date, e.endDate))
        .sort((a, b) => compareEventDates(b.date, a.date));

    const getEventPhotos = (eventId: string) => photos.filter(p => p.eventId === eventId);

    return (
        <div className="max-w-7xl mx-auto px-4 pt-40 pb-12 animate-fade-in-up">

            <div className="text-center mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-[80px]"></div>
                <h2 className={`text-5xl font-extrabold mb-6 relative ${isDark ? 'text-white' : 'text-slate-900'}`}>Event Calendar</h2>
                <p className={`text-xl relative ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Join us for workshops, hackathons, and speaker sessions.</p>
            </div>

            {/* Upcoming Events */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-10 w-2 bg-gradient-to-b from-purple-600 to-purple-800 rounded-full"></div>
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Upcoming Events</h3>
                </div>

                {upcomingEvents.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {upcomingEvents.map(event => (
                            <div
                                key={event.id}
                                className={`flex flex-col md:flex-row rounded-[2rem] overflow-hidden border transition-all hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] group cursor-pointer ${isDark ? 'bg-[#0F0F11] border-white/5 hover:border-purple-500/30' : 'bg-white border-black/10 hover:border-purple-500/40 shadow-lg'}`}
                                onClick={() => setSelectedEvent(event)}
                            >
                                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className={`absolute inset-0 to-transparent opacity-60 md:opacity-0 bg-gradient-to-t md:bg-gradient-to-r ${isDark ? 'from-[#0F0F11]' : 'from-white'}`}></div>
                                    <div className={`absolute top-4 left-4 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border text-purple-500 shadow-lg ${isDark ? 'bg-black/50 border-white/10' : 'bg-white/80 border-purple-500/20'}`}>
                                        {formatEventDate(event.date)}
                                    </div>
                                </div>
                                <div className="md:w-3/5 p-8 flex flex-col justify-between relative z-10">
                                    <div>
                                        <h4 className={`text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.title}</h4>
                                        <p className={`mb-6 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{event.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-purple-500" /> {event.location}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-500" /> {event.time || 'Time TBA'}</span>
                                        </div>
                                    </div>
                                    {event.registrationLink && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(event.registrationLink, '_blank');
                                            }}
                                            className={`w-full hover:bg-purple-600 hover:text-white hover:border-purple-600 border py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${isDark ? 'bg-white/5 border-white/10 text-purple-500' : 'bg-purple-50 border-purple-200 text-purple-600'}`}
                                        >
                                            Register Now <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`p-16 text-center rounded-[2rem] border border-dashed ${isDark ? 'bg-[#0F0F11] border-white/10' : 'bg-slate-50 border-black/10'}`}>
                        <Calendar className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-700' : 'text-slate-400'}`} />
                        <p className={`text-lg ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>No upcoming events scheduled. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* Past Events */}
            <section>
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-10 w-2 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full"></div>
                    <h3 className={`text-3xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Previous Events</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {pastEvents.map(event => (
                        <div
                            key={event.id}
                            className={`group rounded-[2rem] overflow-hidden border transition-all cursor-pointer hover:-translate-y-2 hover:shadow-2xl ${isDark ? 'bg-[#0F0F11] border-white/5 hover:border-white/20' : 'bg-white border-black/10 hover:border-black/20 shadow-lg'}`}
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="h-56 relative overflow-hidden">
                                <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />

                                {getEventPhotos(event.id).length > 0 && (
                                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                                        <Camera className="w-3 h-3 text-purple-500" /> {getEventPhotos(event.id).length}
                                    </div>
                                )}

                                <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t to-transparent z-20 ${isDark ? 'from-[#0F0F11]' : 'from-white'}`}>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-xs border ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                                        {formatEventDate(event.date)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 pt-2">
                                <h4 className={`text-lg font-bold mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{event.title}</h4>
                                <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>{event.description}</p>
                                <div className="flex items-center justify-between text-xs font-medium pt-4 border-t border-white/5">
                                    <div className="flex gap-3">
                                        <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>
                                        {event.reportUrl && (
                                            <span
                                                className="text-purple-500 flex items-center gap-1 hover:text-purple-400 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(event.reportUrl, '_blank');
                                                }}
                                            >
                                                <FileText className="w-3 h-3" /> Report
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-purple-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Details <ArrowRight className="w-3 h-3" /></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl overflow-y-auto"
                    onClick={() => setSelectedEvent(null)}
                >
                    <div className="min-h-full flex items-center justify-center p-4 py-12">
                        <div
                            className={`border rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl relative my-auto ${isDark ? 'bg-[#0F0F11] border-white/10' : 'bg-white border-black/10'}`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className={`absolute top-6 right-6 p-3 backdrop-blur-md rounded-full transition-colors z-30 ${isDark ? 'bg-black/50 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-black/5'}`}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Hero Image */}
                            <div className="h-64 relative">
                                <img
                                    src={selectedEvent.imageUrl}
                                    alt={selectedEvent.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t via-black/50 to-transparent ${isDark ? 'from-[#0F0F11]' : 'from-white'}`}></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    {isEventPast(selectedEvent.date, selectedEvent.endDate) ? (
                                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 mb-3">
                                            <CheckCircle className="w-3 h-3" /> Concluded
                                        </span>
                                    ) : (
                                        <span className={`inline-flex items-center gap-1.5 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full border mb-3 ${isDark ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-purple-100 text-purple-600 border-purple-200'}`}>
                                            <Calendar className="w-3 h-3" /> Upcoming
                                        </span>
                                    )}
                                    <h2 className={`text-3xl md:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedEvent.title}</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-10">
                                {/* Meta Grid */}
                                <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                                    {[
                                        { icon: Calendar, label: 'Date', val: formatEventDate(selectedEvent.date), color: 'text-purple-500' },
                                        { icon: Clock, label: 'Time', val: selectedEvent.time || 'Time TBA', color: 'text-slate-500' },
                                        { icon: MapPin, label: 'Location', val: selectedEvent.location, color: 'text-purple-500' },
                                        { icon: Camera, label: 'Photos', val: `${getEventPhotos(selectedEvent.id).length} Shots`, color: 'text-slate-500' }
                                    ].map((item, i) => (
                                        <div key={i} className={`rounded-2xl p-4 border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5'}`}>
                                            <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{item.label}</p>
                                            <p className={`text-sm font-semibold truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Description */}
                                <div className="mb-10">
                                    <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-purple-500 pl-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>About Event</h3>
                                    <p className={`leading-relaxed text-base ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{selectedEvent.description}</p>
                                </div>

                                {/* Event Photos */}
                                {getEventPhotos(selectedEvent.id).length > 0 ? (
                                    <div>
                                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-6 border-l-2 border-slate-500 pl-3 flex items-center justify-between ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            Event Gallery
                                            <span className={`text-[10px] px-2 py-1 rounded-full border ${isDark ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                                {getEventPhotos(selectedEvent.id).length} moments captured
                                            </span>
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {getEventPhotos(selectedEvent.id).map(photo => (
                                                <div
                                                    key={photo.id}
                                                    className="relative group rounded-2xl overflow-hidden aspect-square cursor-pointer border border-white/5 hover:border-pink-500/50 transition-all"
                                                    onClick={() => setLightboxPhoto(photo)}
                                                >
                                                    <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.caption}
                                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                        <p className="text-slate-500">No photos available yet.</p>
                                    </div>
                                )}
                                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-end gap-3">
                                    {selectedEvent.reportUrl && (
                                        <button
                                            onClick={() => {
                                                window.open(selectedEvent.reportUrl, '_blank');
                                            }}
                                            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            View Report <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    {/* Show Register button if link exists, regardless of date (or you can keep date check) */}
                                    {selectedEvent.registrationLink && isEventUpcoming(selectedEvent.date, selectedEvent.endDate) && (
                                        <button
                                            onClick={() => {
                                                window.open(selectedEvent.registrationLink, '_blank');
                                            }}
                                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-slate-600 hover:from-purple-500 hover:to-slate-500 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-purple-500/20"
                                        >
                                            Register Now <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setSelectedEvent(null);
                                            setCurrentPage('photos');
                                        }}
                                        className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-purple-50 transition-colors"
                                    >
                                        View Full Gallery <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;
