import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { calendarEventAPI } from '../Utils/api';

// Hardcoded fallback data (used if API fails or DB is empty)
const FALLBACK_DATA = [
    { month:'January', events:[
        { name:"London's New Year's Day Parade", date:"1st January 2026" },
        { name:"Hyde Park Winter Wonderland", date:"5th January 2026" },
        { name:"London Short Film Festival", date:"17th - 26th January 2025" },
        { name:"Canary Wharf Winter Lights", date:"20th - 31st January 2026" },
        { name:"The Masters Snooker", date:"11th - 18th January 2026" },
        { name:"Hogwarts in the Snow", date:"19th January 2026" },
        { name:"Burns Night Celebrations", date:"25th January 2026" },
    ]},
    { month:'February', events:[
        { name:"Kew Gardens Orchid Festival", date:"1st - 28th February 2026" },
        { name:"England vs Wales Six Nations Rugby", date:"7th February 2026" },
        { name:"Valentine's Day Events", date:"14th February 2026" },
        { name:"Lunar New Year", date:"17th February 2026" },
        { name:"London Fashion Week February", date:"19th - 23rd February 2026" },
    ]},
    { month:'March', events:[
        { name:"Cheltenham Festival", date:"10th - 13th March 2026" },
    ]},
    { month:'April', events:[
        { name:"Easter Weekend", date:"3rd - 6th April 2026", blogSlug:"easter-weekend-chauffeur-service-2026" },
        { name:"Grand National", date:"11th April 2026", blogSlug:"grand-national-chauffeur-service-2026" },
        { name:"National Wedding Show London", date:"11th - 12th April 2026", blogSlug:"national-wedding-show-chauffeur-service-2026" },
        { name:"Vaisakhi Festival London", date:"14th April 2026", blogSlug:"vaisakhi-festival-chauffeur-service-2026" },
        { name:"St George's Day", date:"23rd April 2026", blogSlug:"st-georges-day-chauffeur-service-2026" },
        { name:"London Marathon", date:"26th April 2026", blogSlug:"london-marathon-chauffeur-service-2026" },
    ]},
    { month:'May', events:[
        { name:"Badminton Horse Trials", date:"6th – 10th May 2026" },
        { name:"Royal Windsor Horse Show", date:"14th – 17th May 2026" },
        { name:"FA Cup Final", date:"16th May 2026 • Wembley Stadium" },
        { name:"RHS Chelsea Flower Show", date:"19th – 23rd May 2026" },
        { name:"UEFA Champions League Final", date:"30th May 2026" },
    ]},
    { month:'June', events:[
        { name:"Trooping the Colour", date:"Jun 13 (Sat) • Horse Guards Parade" },
        { name:"Royal Academy Summer Exhibition", date:"Jun 16–Aug 23 • Burlington House" },
        { name:"London Pride", date:"Jun TBC • Oxford Street to Whitehall" },
        { name:"Wimbledon Championships", date:"Jun 29–Jul 12 • All England Club" },
    ]},
    { month:'July', events:[
        { name:"F1 British Grand Prix", date:"Jul 3–5 • Silverstone" },
        { name:"Buckingham Palace Summer Opening", date:"Jul 4–Sep 27 • Westminster" },
        { name:"BBC Proms (Opening Weeks)", date:"Jul 21–Aug 16 • Royal Albert Hall" },
    ]},
    { month:'August', events:[
        { name:"ABB FIA Formula E", date:"Aug 15–16 • ExCeL London" },
        { name:"Notting Hill Carnival", date:"Aug 29–31 • W11" },
    ]},
    { month:'September', events:[
        { name:"Totally Thames Festival", date:"Sep 1–30 • Thames Riverside" },
        { name:"London Fashion Week Spring", date:"Sep TBC • Central London" },
    ]},
    { month:'October', events:[
        { name:"Frieze London Art Fair", date:"Oct TBC • Regent's Park" },
        { name:"London Film Festival", date:"Oct TBC • Southbank" },
        { name:"Halloween at London Zoo", date:"Oct 25–31 • Camden" },
    ]},
    { month:'November', events:[
        { name:"Bonfire Night", date:"Nov 5 • London-wide" },
        { name:"Remembrance Sunday", date:"Nov 8 • Whitehall" },
        { name:"Christmas Lights Switch-On", date:"Nov TBC • Oxford Street" },
    ]},
    { month:'December', events:[
        { name:"Hyde Park Winter Wonderland", date:"Dec 1–31 • Hyde Park" },
        { name:"Christmas at Kew Gardens", date:"Dec TBC • Kew" },
        { name:"New Year's Eve Fireworks", date:"Dec 31 • Thames Riverside" },
    ]},
];

function EventCalendar() {
    const [eventsData, setEventsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const res = await calendarEventAPI.getAll({ year: 2026 });
                const grouped = res.calendarData || [];
                // If DB has data, use it; otherwise fall back to hardcoded
                setEventsData(grouped.length > 0 ? grouped : FALLBACK_DATA);
            } catch {
                setEventsData(FALLBACK_DATA);
            } finally {
                setIsLoading(false);
            }
        };
        loadEvents();
    }, []);

    const containerVars = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.06, delayChildren: 0.2 } },
    };
    const cardVars = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
    };
    const itemVars = {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    };

    return (
        <main className="min-h-screen bg-[var(--color-dark)] font-sans">
            {/* Page Header */}
            <section className="pt-36 md:pt-44 pb-12 md:pb-16 px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto text-center"
                >
                    <h1 className="text-amber-500 text-2xl md:text-3xl font-bold tracking-[0.3em] uppercase mb-3">
                        Executive Calendar 2026
                    </h1>
                    <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto" />
                    <p className="text-zinc-400 text-sm mt-4 font-light tracking-wide">
                        January — December • Complete year of curated events
                    </p>
                </motion.div>
            </section>

            {isLoading ? (
                <div className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-[#121212]/90 rounded-[1.5rem] p-5 border border-white/5 animate-pulse">
                            <div className="h-5 w-24 bg-zinc-800 rounded mx-auto mb-4" />
                            {Array.from({ length: 3 }).map((_, j) => (
                                <div key={j} className="h-3 w-full bg-zinc-800/60 rounded mb-2" />
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={containerVars}
                    initial="initial"
                    animate="animate"
                    className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 pb-16 md:pb-24"
                >
                    {eventsData.map((monthData, index) => (
                        <motion.div key={index} variants={cardVars}>
                            <EventCard monthData={monthData} itemVars={itemVars} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </main>
    );
}

function EventCard({ monthData, itemVars }) {
    return (
        <div className="relative group">
            {/* Gradient Border */}
            <div className="absolute inset-0 p-[1px] rounded-[1.5rem] bg-gradient-to-b from-amber-500/30 via-amber-500/10 to-transparent pointer-events-none" />

            {/* Glass Card */}
            <div className="relative bg-[#121212]/90 backdrop-blur-xl rounded-[1.5rem] p-4 md:p-5 border border-white/5 overflow-hidden">
                {/* Month Header */}
                <header className="text-center mb-4 pb-3 border-b border-white/5">
                    <h2 className="text-amber-500 text-base md:text-lg font-bold tracking-[0.25em] uppercase">
                        {monthData.month}
                    </h2>
                    <p className="text-white text-[10px] md:text-xs mt-1 font-light">
                        {monthData.events.length} Events
                    </p>
                </header>

                {/* Event List */}
                <div className="space-y-2.5">
                    {monthData.events.map((event, eventIndex) => {
                        // Support both DB events (blogSlug) and fallback data (blogSlug)
                        const slug = event.blogSlug || (event.linkedBlog?.slug);
                        const EventContent = (
                            <div className="text-center">
                                <h3 className={`text-[11px] md:text-xs font-medium leading-snug ${slug ? 'text-amber-400 hover:text-amber-300' : 'text-zinc-100'}`}>
                                    {event.name}
                                </h3>
                                <p className="text-amber-500/70 text-[9px] md:text-[10px] mt-0.5 font-light tracking-wide">
                                    {event.date}
                                </p>
                            </div>
                        );

                        return (
                            <motion.div key={eventIndex} variants={itemVars} className={slug ? 'cursor-pointer' : ''}>
                                {slug ? (
                                    <Link to={`/blog/${slug}`}>{EventContent}</Link>
                                ) : EventContent}

                                {/* Divider */}
                                {eventIndex !== monthData.events.length - 1 && (
                                    <div className="flex items-center justify-center mt-2">
                                        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                                        <div className="mx-1.5 w-1 h-1 rounded-full border border-amber-500/30 rotate-45 flex-shrink-0" />
                                        <div className="h-[0.5px] w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Glossy Overlay */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-[1.5rem]" />
                </div>
            </div>
        </div>
    );
}

export default EventCalendar;
