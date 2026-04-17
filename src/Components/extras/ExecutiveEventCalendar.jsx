import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Star, Zap } from 'lucide-react';

// Sample executive events data
const executiveEvents = [
    {
        id: 1,
        month: 'January',
        events: [
            {
                title: 'Royal Ascot Preview',
                date: '15',
                day: 'Mon',
                time: '10:00 AM',
                location: 'Ascot, Berkshire',
                status: 'available',
                featured: true,
            },
            {
                title: 'London Fashion Week',
                date: '22',
                day: 'Mon',
                time: '2:00 PM',
                location: 'Central London',
                status: 'available',
                featured: false,
            },
        ],
    },
    {
        id: 2,
        month: 'February',
        events: [
            {
                title: 'Cheltenham Festival',
                date: '12',
                day: 'Tue',
                time: '9:00 AM',
                location: 'Cheltenham, Gloucestershire',
                status: 'limited',
                featured: true,
            },
            {
                title: 'BAFTA Awards Ceremony',
                date: '18',
                day: 'Mon',
                time: '5:00 PM',
                location: 'Royal Festival Hall',
                status: 'available',
                featured: false,
            },
        ],
    },
    {
        id: 3,
        month: 'March',
        events: [
            {
                title: 'Wimbledon Preparations',
                date: '05',
                day: 'Wed',
                time: '11:00 AM',
                location: 'All England Club',
                status: 'available',
                featured: true,
            },
            {
                title: 'Geneva Motor Show',
                date: '20',
                day: 'Wed',
                time: '8:00 AM',
                location: 'Geneva, Switzerland',
                status: 'available',
                featured: false,
            },
        ],
    },
    {
        id: 4,
        month: 'April',
        events: [
            {
                title: 'Grand Prix Monaco',
                date: '08',
                day: 'Sun',
                time: '7:00 AM',
                location: 'Monte Carlo, Monaco',
                status: 'limited',
                featured: true,
            },
            {
                title: 'Chelsea Flower Show',
                date: '23',
                day: 'Tue',
                time: '10:00 AM',
                location: 'Royal Hospital Chelsea',
                status: 'available',
                featured: false,
            },
        ],
    },
];

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const glowVariants = {
    idle: { opacity: 0.3, scale: 1 },
    hover: { opacity: 0.6, scale: 1.05, transition: { duration: 0.3 } },
};

function ExecutiveEventCalendar() {
    const [hoveredEvent, setHoveredEvent] = useState(null);

    const getStatusColor = (status) => {
        if (status === 'limited') return '#F59E0B';
        return '#22C55E';
    };

    const getStatusText = (status) => {
        if (status === 'limited') return 'Limited Availability';
        return 'Chauffeur Available';
    };

    return (
        <section className="relative py-20 md:py-32 overflow-hidden">
            {/* Background with subtle texture */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundColor: '#0F0F0F',
                    backgroundImage: `
                        radial-gradient(circle at 50% 0%, rgba(215, 183, 94, 0.08) 0%, transparent 50%),
                        radial-gradient(circle at 100% 50%, rgba(215, 183, 94, 0.05) 0%, transparent 40%)
                    `,
                }}
            />

            {/* Subtle grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                        style={{
                            backgroundColor: 'rgba(215, 183, 94, 0.1)',
                            border: '1px solid rgba(215, 183, 94, 0.2)',
                        }}
                    >
                        <Star className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <span
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Exclusive Access
                        </span>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Executive <span className="text-gradient">Timeline</span>
                    </h2>

                    <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        Curated events for the discerning clientele. Premium chauffeur services
                        for life's most prestigious moments.
                    </p>
                </motion.div>

                {/* Bento Grid Calendar */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
                >
                    {executiveEvents.map((monthData, monthIndex) => (
                        <LuxuryMonthCard
                            key={monthData.id}
                            monthData={monthData}
                            monthIndex={monthIndex}
                            hoveredEvent={hoveredEvent}
                            setHoveredEvent={setHoveredEvent}
                            getStatusColor={getStatusColor}
                            getStatusText={getStatusText}
                        />
                    ))}
                </motion.div>

                {/* View All CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center mt-16 md:mt-20"
                >
                    <button
                        className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300"
                        style={{
                            backgroundColor: 'rgba(215, 183, 94, 0.1)',
                            color: 'var(--color-primary)',
                            border: '1px solid rgba(215, 183, 94, 0.3)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            e.currentTarget.style.color = 'var(--color-dark)';
                            e.currentTarget.style.boxShadow = '0 0 40px rgba(215, 183, 94, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(215, 183, 94, 0.1)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        View Complete Calendar
                        <ChevronRight
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

function LuxuryMonthCard({
    monthData,
    monthIndex,
    hoveredEvent,
    setHoveredEvent,
    getStatusColor,
    getStatusText,
}) {
    return (
        <motion.div
            variants={itemVariants}
            className="relative group"
        >
            {/* Liquid Gold Border Gradient */}
            <div
                className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(215, 183, 94, 0.3) 0%, rgba(215, 183, 94, 0.05) 50%, transparent 100%)',
                }}
            >
                {/* Animated glow on hover */}
                <motion.div
                    variants={glowVariants}
                    initial="idle"
                    animate="idle"
                    whileHover="hover"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                        background: 'radial-gradient(circle at 50% 0%, rgba(215, 183, 94, 0.15) 0%, transparent 70%)',
                    }}
                />
            </div>

            {/* Card Content */}
            <div
                className="relative h-full rounded-2xl p-6 transition-all duration-500"
                style={{
                    backgroundColor: 'rgba(26, 26, 26, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
                onMouseEnter={() => setHoveredEvent(monthData.month)}
                onMouseLeave={() => setHoveredEvent(null)}
            >
                {/* Month Header */}
                <div className="mb-6 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                        <h3
                            className="text-amber-500 font-bold text-sm tracking-widest uppercase"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            {monthData.month}
                        </h3>
                    </div>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    {monthData.events.map((event, eventIndex) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: eventIndex * 0.1 }}
                            className={`relative p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                                hoveredEvent === monthData.month &&
                                hoveredEvent === monthData.month
                                    ? 'bg-white/5'
                                    : ''
                            }`}
                            style={{
                                backgroundColor: event.featured
                                    ? 'rgba(215, 183, 94, 0.08)'
                                    : 'rgba(255, 255, 255, 0.02)',
                                border: event.featured
                                    ? '1px solid rgba(215, 183, 94, 0.15)'
                                    : '1px solid rgba(255, 255, 255, 0.05)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = event.featured
                                    ? 'rgba(215, 183, 94, 0.12)'
                                    : 'rgba(255, 255, 255, 0.06)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                if (event.featured) {
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(215, 183, 94, 0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = event.featured
                                    ? 'rgba(215, 183, 94, 0.08)'
                                    : 'rgba(255, 255, 255, 0.02)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Featured Badge */}
                            {event.featured && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: 'var(--color-primary)',
                                            boxShadow: '0 0 20px rgba(215, 183, 94, 0.5)',
                                        }}
                                    >
                                        <Zap className="w-3 h-3" style={{ color: '#0F0F0F' }} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Date Badge */}
                            <div className="flex items-start gap-3 mb-3">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                                    style={{
                                        backgroundColor: 'rgba(215, 183, 94, 0.1)',
                                        border: '1px solid rgba(215, 183, 94, 0.2)',
                                    }}
                                >
                                    <span
                                        className="text-lg font-bold leading-none"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        {event.date}
                                    </span>
                                    <span className="text-[10px] text-white/50 uppercase leading-none mt-1">
                                        {event.day}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white font-semibold text-sm mb-1 truncate">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-1 text-white/40 text-xs">
                                        <Clock className="w-3 h-3" />
                                        <span>{event.time}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location & Status */}
                            <div className="flex items-center justify-between">
                                <p className="text-white/50 text-xs truncate flex-1">{event.location}</p>

                                {/* Real-time Status Indicator */}
                                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: getStatusColor(event.status),
                                            boxShadow: `0 0 12px ${getStatusColor(event.status)}`,
                                        }}
                                    />
                                    <span className="text-[10px] text-white/40 uppercase tracking-wide">
                                        {getStatusText(event.status)}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default ExecutiveEventCalendar;
