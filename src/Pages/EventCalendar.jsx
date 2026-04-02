import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// April 2026 events with blog slugs for linking
const april2026Events = [
    { name: "Easter Weekend", date: "3rd - 6th April 2026", slug: "easter-weekend-chauffeur-service-2026" },
    { name: "Grand National", date: "11th April 2026", slug: "grand-national-chauffeur-service-2026" },
    { name: "National Wedding Show London", date: "11th - 12th April 2026", slug: "national-wedding-show-chauffeur-service-2026" },
    { name: "Vaisakhi Festival London", date: "14th April 2026", slug: "vaisakhi-festival-chauffeur-service-2026" },
    { name: "St George's Day", date: "23rd April 2026", slug: "st-georges-day-chauffeur-service-2026" },
    { name: "London Marathon", date: "26th April 2026", slug: "london-marathon-chauffeur-service-2026" },
];

// Complete event data from January to December 2026
const eventsData = [
    {
        month: 'January',
        events: [
            { name: "London's New Year's Day Parade", date: "1st January 2026" },
            { name: "Hyde Park Winter Wonderland", date: "5th January 2026" },
            { name: "London Short Film Festival", date: "17th - 26th January 2025" },
            { name: "Canary Wharf Winter Lights", date: "20th - 31st January 2026" },
            { name: "The Masters Snooker", date: "11th - 18th January 2026" },
            { name: "Hogwarts in the Snow", date: "19th January 2026" },
            { name: "Burns Night Celebrations", date: "25th January 2026" },
        ],
    },
    {
        month: 'February',
        events: [
            { name: "Kew Gardens Orchid Festival", date: "1st - 28th February 2026" },
            { name: "England vs Wales Six Nations Rugby, Aviva Stadium", date: "7th February 2026" },
            { name: "Valentine's Day Events", date: "14th February 2026" },
            { name: "Premier League Football Matches", date: "14th - 15th February 2026" },
            { name: "Lunar New Year", date: "17th February 2026" },
            { name: "London Fashion Week February", date: "19th - 23rd February 2026" },
            { name: "England vs Ireland Six Nations Rugby, Twickenham Stadium", date: "21st February 2026" },
            { name: "FA Cup Matches", date: "22nd - 23rd February 2026" },
        ],
    },
    {
        month: 'March',
        events: [
            { name: "Ireland vs England Six Nations Rugby, Aviva Stadium", date: "1st March 2025" },
            { name: "England vs Italy Six Nations Rugby, Twickenham Stadium", date: "9th March 2025" },
            { name: "Cheltenham Festival", date: "10th - 13th March 2026" },
            { name: "Wales vs England Six Nations Rugby, Principality Stadium", date: "15th March 2025" },
        ],
    },
    {
        month: 'April',
        events: april2026Events,
    },
    {
        month: 'May',
        events: [
            { name: "FA Cup Final - Women's", date: "May 5 (Tue) • Wembley Stadium" },
            { name: "FA Cup Final - Men's", date: "May 9 (Sat) • Wembley Stadium" },
            { name: "Hackney Half Marathon", date: "May TBC • East London" },
            { name: "RHS Chelsea Flower Show", date: "May 19–23 • Royal Hospital Chelsea" },
            { name: "Chelsea in Bloom", date: "May 18–24 • Chelsea & Belgravia" },
        ],
    },
    {
        month: 'June',
        events: [
            { name: "Trooping the Colour", date: "Jun 13 (Sat) • Horse Guards Parade" },
            { name: "Royal Academy Summer Exhibition", date: "Jun 16–Aug 23 • Burlington House" },
            { name: "Taste of London", date: "Jun TBC • Regent's Park" },
            { name: "London Pride", date: "Jun TBC • Oxford Street to Whitehall" },
            { name: "ICC Women's T20 World Cup", date: "Jun 24–Jul 2 • Lord's & Kia Oval" },
            { name: "Wimbledon Championships", date: "Jun 29–Jul 12 • All England Club" },
        ],
    },
    {
        month: 'July',
        events: [
            { name: "F1 British Grand Prix", date: "Jul 3–5 • Silverstone" },
            { name: "Buckingham Palace Summer Opening", date: "Jul 4–Sep 27 • Westminster" },
            { name: "The Hundred Cricket", date: "Jul 9–Aug 16 • Lord's & Kia Oval" },
            { name: "West End Live", date: "Jul TBC • Trafalgar Square" },
            { name: "BBC Proms (Opening Weeks)", date: "Jul 21–Aug 16 • Royal Albert Hall" },
            { name: "London Summer School Holidays", date: "Jul 23–Sep 1 • London-wide" },
        ],
    },
    {
        month: 'August',
        events: [
            { name: "Greenwich + Docklands Festival", date: "Aug TBC • Southeast London" },
            { name: "Commonwealth Games (London events)", date: "Aug TBC • London-wide" },
            { name: "ABB FIA Formula E", date: "Aug 15–16 • ExCeL London" },
            { name: "The Hundred Cricket (Continued)", date: "Until Aug 16 • Lord's & Kia Oval" },
            { name: "BBC Proms (Continued)", date: "Until Aug 16 • Royal Albert Hall" },
            { name: "Notting Hill Carnival", date: "Aug 29–31 • W11" },
        ],
    },
    {
        month: 'September',
        events: [
            { name: "Totally Thames Festival", date: "Sep 1–30 • Thames Riverside" },
            { name: "Buckingham Palace Summer Opening", date: "Until Sep 27 • Westminster" },
            { name: "London Summer School Holidays", date: "Until Sep 1 • London-wide" },
            { name: "London Fashion Week Spring", date: "Sep TBC • Central London" },
        ],
    },
    {
        month: 'October',
        events: [
            { name: "Frieze London Art Fair", date: "Oct TBC • Regent's Park" },
            { name: "London Film Festival", date: "Oct TBC • Southbank" },
            { name: "Royal Opera House Season Opening", date: "Oct TBC • Covent Garden" },
            { name: "Halloween at London Zoo", date: "Oct 25–31 • Camden" },
        ],
    },
    {
        month: 'November',
        events: [
            { name: "Bonfire Night", date: "Nov 5 • London-wide" },
            { name: "Remembrance Sunday", date: "Nov 8 • Whitehall" },
            { name: "Christmas Lights Switch-On", date: "Nov TBC • Oxford Street" },
            { name: "Lord Mayor's Show", date: "Nov TBC • City of London" },
        ],
    },
    {
        month: 'December',
        events: [
            { name: "Hyde Park Winter Wonderland", date: "Dec 1–31 • Hyde Park" },
            { name: "Christmas at Kew Gardens", date: "Dec TBC • Kew" },
            { name: "New Year's Eve Fireworks", date: "Dec 31 • Thames Riverside" },
            { name: "Carol Concerts at Royal Albert Hall", date: "Dec TBC • Kensington" },
        ],
    },
];

function EventCalendar() {
    const containerVars = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 0.6, staggerChildren: 0.06, delayChildren: 0.2 },
        },
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

            {/* 
                Dynamic Grid Logic:
                - Responsive grid with equal-width columns
                - Cards size according to their content (no fixed height)
            */}
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
        </main>
    );
}

function EventCard({ monthData, itemVars }) {
    const isApril = monthData.month === 'April';

    return (
        <div className="relative group">
            {/* Gradient Border Container */}
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

                {/* Event List - Show all events */}
                <div className="space-y-2.5">
                    {monthData.events.map((event, eventIndex) => {
                        const EventContent = (
                            <div className="text-center">
                                <h3 className={`text-[11px] md:text-xs font-medium leading-snug ${isApril ? 'text-amber-400 hover:text-amber-300' : 'text-zinc-100'}`}>
                                    {event.name}
                                </h3>
                                <p className="text-amber-500/70 text-[9px] md:text-[10px] mt-0.5 font-light tracking-wide">
                                    {event.date}
                                </p>
                            </div>
                        );

                        return (
                            <motion.div
                                key={eventIndex}
                                variants={itemVars}
                                className={isApril ? 'cursor-pointer' : ''}
                            >
                                {isApril && event.slug ? (
                                    <Link to={`/blog/${event.slug}`}>
                                        {EventContent}
                                    </Link>
                                ) : (
                                    EventContent
                                )}

                                {/* Divider (Except last item) */}
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

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-[1.5rem]" />
                </div>
            </div>
        </div>
    );
}

export default EventCalendar;
