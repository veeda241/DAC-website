import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CheckCircle, Camera, ArrowRight, X } from 'lucide-react';
import { ClubEvent, Photo, PageView } from '../../types';

interface EventsProps {
    events: ClubEvent[];
    photos: Photo[];
    onLoginClick: () => void;
    setCurrentPage: (page: PageView) => void;
    setLightboxPhoto: (photo: Photo | null) => void;
}

const Events: React.FC<EventsProps> = ({ events, photos, onLoginClick, setCurrentPage, setLightboxPhoto }) => {
    const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(null);

    const currentDate = new Date().toISOString().split('T')[0];
    const upcomingEvents = events.filter(e => e.date >= currentDate).sort((a, b) => a.date.localeCompare(b.date));
    const pastEvents = events.filter(e => e.date < currentDate).sort((a, b) => b.date.localeCompare(a.date));

    const getEventPhotos = (eventId: string) => photos.filter(p => p.eventId === eventId);

    return (
        <div className="max-w-7xl mx-auto px-4 pt-40 pb-12 animate-fade-in-up">

            <div className="text-center mb-20 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-[80px]"></div>
                <h2 className="text-5xl font-extrabold text-white mb-6 relative">Event Calendar</h2>
                <p className="text-xl text-slate-400 relative">Join us for workshops, hackathons, and speaker sessions.</p>
            </div>

            {/* Upcoming Events */}
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-10 w-2 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
                    <h3 className="text-3xl font-bold text-white">Upcoming Events</h3>
                </div>

                {upcomingEvents.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                        {upcomingEvents.map(event => (
                            <div key={event.id} className="flex flex-col md:flex-row bg-[#0F0F11] rounded-[2rem] overflow-hidden border border-white/5 hover:border-cyan-500/30 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] group">
                                <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] to-transparent opacity-60 md:opacity-0 md:bg-gradient-to-r"></div>
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold border border-white/10 text-cyan-400 shadow-lg">
                                        {event.date}
                                    </div>
                                </div>
                                <div className="md:w-3/5 p-8 flex flex-col justify-between relative z-10">
                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                                        <p className="text-slate-400 mb-6 line-clamp-2 leading-relaxed">{event.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8">
                                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-cyan-500" /> {event.location}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> 6:00 PM</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => event.registrationLink ? window.open(event.registrationLink, '_blank') : onLoginClick()}
                                        className="w-full bg-white/5 hover:bg-cyan-600 hover:text-white border border-white/10 text-cyan-400 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        Register Now {event.registrationLink && <ArrowRight className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-16 text-center bg-[#0F0F11] rounded-[2rem] border border-dashed border-white/10">
                        <Calendar className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No upcoming events scheduled. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* Past Events */}
            <section>
                <div className="flex items-center gap-4 mb-10">
                    <div className="h-10 w-2 bg-gradient-to-b from-slate-600 to-slate-800 rounded-full"></div>
                    <h3 className="text-3xl font-bold text-slate-200">Previous Events</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {pastEvents.map(event => (
                        <div
                            key={event.id}
                            className="group bg-[#0F0F11] rounded-[2rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all cursor-pointer hover:-translate-y-2 hover:shadow-2xl"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="h-56 relative overflow-hidden">
                                <div className="absolute inset-0 bg-slate-900/20 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />

                                {getEventPhotos(event.id).length > 0 && (
                                    <div className="absolute top-4 right-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 border border-white/10">
                                        <Camera className="w-3 h-3 text-cyan-400" /> {getEventPhotos(event.id).length}
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0F0F11] to-transparent z-20">
                                    <div className="inline-block px-3 py-1 rounded-lg bg-cyan-950/50 border border-cyan-900/30 text-cyan-400 text-xs font-bold mb-2">
                                        {event.date}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 pt-2">
                                <h4 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">{event.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{event.description}</p>
                                <div className="flex items-center justify-between text-xs font-medium pt-4 border-t border-white/5">
                                    <span className="text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>
                                    <span className="text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">Details <ArrowRight className="w-3 h-3" /></span>
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
                            className="bg-[#0F0F11] border border-white/10 rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-2xl relative my-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-md rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-30"
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
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-black/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 mb-3">
                                        <CheckCircle className="w-3 h-3" /> Concluded
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">{selectedEvent.title}</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-10">
                                {/* Meta Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-white/5">
                                    {[
                                        { icon: Calendar, label: 'Date', val: selectedEvent.date, color: 'text-cyan-400' },
                                        { icon: Clock, label: 'Time', val: '6:00 PM', color: 'text-blue-400' },
                                        { icon: MapPin, label: 'Location', val: selectedEvent.location, color: 'text-purple-400' },
                                        { icon: Camera, label: 'Photos', val: `${getEventPhotos(selectedEvent.id).length} Shots`, color: 'text-pink-400' }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                            <item.icon className={`w-5 h-5 ${item.color} mb-2`} />
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{item.label}</p>
                                            <p className="text-sm font-semibold text-slate-200 truncate">{item.val}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Description */}
                                <div className="mb-10">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-cyan-500 pl-3">About Event</h3>
                                    <p className="text-slate-400 leading-relaxed text-base">{selectedEvent.description}</p>
                                </div>

                                {/* Event Photos */}
                                {getEventPhotos(selectedEvent.id).length > 0 ? (
                                    <div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 border-l-2 border-pink-500 pl-3 flex items-center justify-between">
                                            Event Gallery
                                            <span className="text-[10px] bg-pink-500/10 text-pink-400 px-2 py-1 rounded-full border border-pink-500/20">
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
                                                    <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
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

                                <div className="mt-10 pt-6 border-t border-white/5 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setSelectedEvent(null);
                                            setCurrentPage('photos');
                                        }}
                                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-cyan-50 transition-colors"
                                    >
                                        View Full Gallery <ArrowRight className="w-4 h-4" />
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
