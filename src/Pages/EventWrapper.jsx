import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2, ArrowRight } from 'lucide-react';
import { eventAPI } from '../Utils/api';

function EventWrapper() {
    const { slug } = useParams();
    const [allEvents, setAllEvents] = useState([]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['event', slug],
        queryFn: () => eventAPI.getBySlug(slug),
        enabled: !!slug,
    });

    // Fetch all events for the "Sports Collection" page
    const isSportsCollection = slug === 'chauffeur-service-for-sports-event';
    useEffect(() => {
        if (isSportsCollection) {
            eventAPI.getAll().then(res => {
                setAllEvents(res.events || []);
            });
        }
    }, [isSportsCollection]);

    const event = data?.event;
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const getImageSrc = (imgObj) => {
        if (!imgObj?.url) return null;
        if (imgObj.url.startsWith('http')) return imgObj.url;
        return `${API_BASE}${imgObj.url}`;
    };

    // Filter sports events for the collection
    const sportsEvents = allEvents.filter(e =>
        e.slug !== 'chauffeur-service-for-sports-event' && // Exclude self
        e.slug !== 'event-calendar' &&
        e.slug !== 'event-chauffeur-service-in-london' &&
        (e.title.toLowerCase().includes('wimbledon') ||
            e.title.toLowerCase().includes('ascot') ||
            e.title.toLowerCase().includes('silverstone') ||
            e.title.toLowerCase().includes('farnborough') ||
            e.title.toLowerCase().includes('o2') ||
            e.title.toLowerCase().includes('excel') ||
            e.title.toLowerCase().includes('twickenham') ||
            e.title.toLowerCase().includes('cheltenham') ||
            e.title.toLowerCase().includes('goodwood') ||
            e.title.toLowerCase().includes('stadium') ||
            e.title.toLowerCase().includes('racecourse'))
    );

    // Loading State
    if (isLoading) {
        return (
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
                <div className="flex items-center justify-center pt-44 pb-20">
                    <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </main>
        );
    }

    // Error / Not Found State
    if (isError || !event) {
        return (
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
                <div className="flex flex-col items-center justify-center pt-44 pb-20 px-4">
                    <h2 className="text-2xl font-semibold text-white mb-4">Event Not Found</h2>
                    <p className="text-white/50 mb-8">The event you're looking for doesn't exist or has been removed.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }

    const heroSrc = getImageSrc(event.heroImage);

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }} >
            {/* Hero Image Section */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                {heroSrc ? (
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2 }}
                        src={heroSrc}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{
                            background: 'linear-gradient(135deg, rgba(26,26,26,1) 0%, rgba(50,40,20,1) 100%)',
                        }}
                    />
                )}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/60 to-transparent" />

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-32 md:top-36 left-4 md:left-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(215,183,94,0.2)';
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Link>
                </motion.div>

                {/* Title Overlay on Image */}
                <div className="absolute bottom-8 md:bottom-12 left-0 right-0 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto">
                        {event.subtitle && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] mb-3"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                {event.subtitle}
                            </motion.p>
                        )}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white relative z-10"
                        >
                            {event.title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* SPECIAL SPORTS COLLECTION VIEW */}
            {isSportsCollection && (
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                    <div className="mb-12 text-center">
                        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
                            Sports Event Chauffeur Services
                        </h2>
                        <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sportsEvents.map((sportEvent, idx) => (
                            <motion.div
                                key={sportEvent._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group rounded-xl overflow-hidden flex flex-col h-full"
                                style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                            >
                                {/* Card Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={getImageSrc(sportEvent.heroImage) || 'https://via.placeholder.com/800x600?text=Event'}
                                        alt={sportEvent.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>

                                {/* Card Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[var(--color-primary)] transition-colors">
                                        {sportEvent.title}
                                    </h3>

                                    {/* Features (limit to 3) */}
                                    <div className="space-y-2 mb-6 flex-grow">
                                        {(sportEvent.features || []).slice(0, 3).map((feat, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                                                <span className="text-white/60 text-sm">{feat}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link
                                        to={`/events/${sportEvent.slug}`}
                                        className="w-full py-3 rounded-lg font-semibold text-sm text-center transition-all duration-300 flex items-center justify-center gap-2"
                                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                                    >
                                        Book Now <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* STANDARD EVENT CONTENT (Filtered out if Sports Collection to avoid duplication, or kept below?) 
                The user wants "Categorized". So the sports page should MAINLY be the grid. 
                But it might also have intro text. Let's keep the content section but maybe simplify it if it's the collection page.
                Actually, let's keep it below the grid or above. Above is better for intro.
            */}

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="grid lg:grid-cols-3 gap-10 md:gap-16">
                    {/* Main Content — 2/3 */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Short Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            {!isSportsCollection && (
                                <h2
                                    className="text-xl md:text-2xl font-semibold mb-4"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    About This Event Service
                                </h2>
                            )}
                            {/* Render HTML content safely */}
                            <div
                                className="text-white/70 text-base md:text-lg leading-relaxed event-content"
                                dangerouslySetInnerHTML={{ __html: event.description }}
                            />
                        </motion.div>

                        {/* Long Description (HTML) */}
                        {event.longDescription && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                <div
                                    className="w-full h-px"
                                    style={{ background: 'linear-gradient(90deg, var(--color-primary), transparent)' }}
                                />
                                <div
                                    className="text-white/60 text-base leading-relaxed event-content"
                                    dangerouslySetInnerHTML={{ __html: event.longDescription }}
                                />
                            </motion.div>
                        )}

                        {/* Features List (Hide on sports collection as it's redundant or generic) */}
                        {!isSportsCollection && event.features && event.features.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <h3
                                    className="text-lg font-semibold mb-5"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    What's Included
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {event.features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-lg"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                                style={{ backgroundColor: 'rgba(215,183,94,0.15)' }}
                                            >
                                                <Check className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                                            </div>
                                            <span className="text-white/70 text-sm">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar — 1/3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div
                            className="sticky top-32 rounded-2xl p-6 md:p-8 space-y-6"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <h3 className="text-lg font-semibold text-white">
                                Book Your Event Chauffeur
                            </h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Let us handle the transport for your next event. Professional chauffeurs, luxury vehicles, and impeccable service.
                            </p>

                            {/* Decorative line */}
                            <div
                                className="w-12 h-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            />

                            {/* Book Now CTA */}
                            <Link
                                to="/booking"
                                className="block w-full text-center px-6 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-dark)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(215,183,94,0.4)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Book Now
                            </Link>

                            {/* Contact info */}
                            <div className="text-center">
                                <p className="text-white/40 text-xs mb-1">Or call us directly</p>
                                <a
                                    href="tel:+442012345678"
                                    className="text-sm font-medium transition-colors"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    +44 (0)20 1234 5678
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom CTA Section */}
            <div
                className="py-16 md:py-20"
                style={{
                    background: 'linear-gradient(180deg, var(--color-dark) 0%, rgba(215,183,94,0.05) 50%, var(--color-dark) 100%)',
                }}
            >
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-light text-white mb-4"
                    >
                        Explore Our <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Fleet</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/50 mb-8"
                    >
                        Choose from our luxury vehicles for your event
                    </motion.p>
                    <Link
                        to="/fleet"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 border"
                        style={{
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            e.currentTarget.style.color = 'var(--color-dark)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                    >
                        View Our Fleet
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default EventWrapper;
