import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Plane,
    Clock,
    ShieldCheck,
    CalendarCheck
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { serviceAPI, getImageUrl } from '../../Utils/api';

// Known IATA mappings for popular UK airports
const AIRPORT_IATA_MAP = {
    'heathrow': 'LHR',
    'gatwick': 'LGW',
    'stansted': 'STN',
    'luton': 'LTN',
    'city': 'LCY',
    'biggin hill': 'BQH',
    'southend': 'SEN',
    'manchester': 'MAN',
    'birmingham': 'BHX',
    'edinburgh': 'EDI',
    'glasgow': 'GLA',
    'aviation': 'FBO',
    'private': 'VIP'
};

const getIataBadge = (title = '') => {
    const lower = title.toLowerCase();
    for (const [key, code] of Object.entries(AIRPORT_IATA_MAP)) {
        if (lower.includes(key)) return code;
    }
    return 'AIRPORT';
};

// Dedicated Airport Card Skeleton Loader
function AirportCardSkeleton() {
    return (
        <div className="airport-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)]">
            <div
                className="h-full flex flex-col rounded-xl overflow-hidden border"
                style={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderColor: 'rgba(255,255,255,0.06)',
                }}
            >
                {/* Image Skeleton */}
                <div className="relative aspect-[16/10] overflow-hidden bg-white/5 skeleton-shimmer">
                    <div className="absolute top-3 left-3 w-16 h-6 rounded-md bg-white/10" />
                    <div className="absolute top-3 right-3 w-28 h-6 rounded-md bg-white/10" />
                </div>

                {/* Content Skeleton */}
                <div className="p-5 flex flex-col flex-grow gap-3">
                    <div className="h-3 w-24 rounded-full bg-white/10 skeleton-shimmer" />
                    <div className="h-5 w-4/5 rounded-md bg-white/10 skeleton-shimmer" />
                    <div className="space-y-1.5 my-1">
                        <div className="h-3.5 w-full rounded-md bg-white/10 skeleton-shimmer" />
                        <div className="h-3.5 w-5/6 rounded-md bg-white/10 skeleton-shimmer" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-3 pb-3 border-t border-white/5 my-1">
                        <div className="h-4 w-24 rounded bg-white/10 skeleton-shimmer" />
                        <div className="h-4 w-20 rounded bg-white/10 skeleton-shimmer" />
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-auto">
                        <div className="h-4 w-24 rounded bg-white/10 skeleton-shimmer" />
                        <div className="h-6 w-14 rounded bg-white/10 skeleton-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AirportsSection() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Reuse shared 'home-services' query cache — no extra network request
    const { data: servicesData, isLoading } = useQuery({
        queryKey: ['home-services'],
        queryFn: () => serviceAPI.getAllServices(1, 100),
        staleTime: 10 * 60 * 1000,
    });

    // Filter airport-related services
    const airportServices = useMemo(() => {
        const allServices = servicesData?.services || [];
        return allServices.filter((service) => {
            const category = (service.category || '').toLowerCase();
            const title = (service.title || '').toLowerCase();
            return (
                category.includes('airport') ||
                title.includes('airport') ||
                title.includes('aviation')
            );
        });
    }, [servicesData]);

    // Check scroll position (identical to ServicesSection)
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            scrollEl.addEventListener('scroll', checkScroll);
            return () => scrollEl.removeEventListener('scroll', checkScroll);
        }
    }, [airportServices.length]);

    // Scroll by cards (identical to ServicesSection)
    const scroll = (direction) => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.querySelector('.airport-card')?.offsetWidth || 400;
            const gap = 24;
            const scrollAmount = (cardWidth + gap) * 2;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-dark)' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-sm font-medium tracking-[0.2em] uppercase mb-3 flex items-center gap-2"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            <Plane className="w-4 h-4" /> Airport Chauffeur Transfers
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
                        >
                            AIRPORTS <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>WE COVER</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 mt-3 max-w-xl"
                        >
                            Seamless, punctual transfers to and from all major UK airports — live flight tracking included
                        </motion.p>
                    </div>

                    {/* Navigation Arrows - Desktop Only */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                            style={{
                                borderColor: canScrollLeft ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                color: canScrollLeft ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                                backgroundColor: 'transparent'
                            }}
                            aria-label="Previous airports"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                            style={{
                                borderColor: canScrollRight ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                color: canScrollRight ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                cursor: canScrollRight ? 'pointer' : 'not-allowed',
                                backgroundColor: 'transparent'
                            }}
                            aria-label="Next airports"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Skeleton Loading State */}
                {isLoading && (
                    <div className="flex gap-6 overflow-x-hidden pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {[0, 1, 2].map((i) => (
                            <AirportCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Airport Services Carousel */}
                {!isLoading && airportServices.length > 0 && (
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-proximity pb-4 -mx-4 px-4 md:mx-0 md:px-0"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {airportServices.map((service, index) => {
                            const iataBadge = getIataBadge(service.title);
                            return (
                                <motion.div
                                    key={service._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="airport-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)] snap-center"
                                >
                                    <Link to={`/services/${service.slug}`} className="block h-full">
                                        <div className="group cursor-pointer h-full flex flex-col transition-transform duration-500 hover:-translate-y-2 rounded-xl overflow-hidden border"
                                            style={{
                                                backgroundColor: 'rgba(255,255,255,0.04)',
                                                borderColor: 'rgba(255,255,255,0.08)',
                                            }}
                                        >
                                            {/* Image Container */}
                                            <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0 bg-neutral-900">
                                                <img
                                                    src={getImageUrl(service.image?.url)}
                                                    alt={service.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                                                {/* IATA Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span
                                                        className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wider uppercase backdrop-blur-md border flex items-center gap-1"
                                                        style={{
                                                            backgroundColor: 'rgba(15,15,15,0.75)',
                                                            borderColor: 'var(--color-primary)',
                                                            color: 'var(--color-primary)',
                                                        }}
                                                    >
                                                        <Plane className="w-3 h-3" />
                                                        {iataBadge}
                                                    </span>
                                                </div>

                                                {/* Free Waiting Pill */}
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-medium text-white/90 backdrop-blur-md bg-black/60 border border-white/10 flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-amber-400" /> 60m Free Waiting
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div
                                                className="p-4 rounded-b-xl flex flex-col flex-grow"
                                                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p
                                                        className="text-xs font-medium uppercase tracking-wider"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        Airport Transfer
                                                    </p>
                                                    <span className="text-white/30 text-xs">•</span>
                                                    <span className="text-xs text-white/50">24/7</span>
                                                </div>
                                                <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors mb-2 line-clamp-1">
                                                    {service.title}
                                                </h3>
                                                <p className="text-white/60 text-sm leading-relaxed line-clamp-2 flex-grow">
                                                    {service.description}
                                                </p>

                                                {/* Feature Icons */}
                                                <div className="grid grid-cols-2 gap-2 pt-3 pb-3 border-t border-white/10 mt-3 text-xs text-white/70">
                                                    <div className="flex items-center gap-1.5">
                                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                                        <span className="truncate">Flight Monitoring</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <CalendarCheck className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                                                        <span className="truncate">Meet &amp; Greet</span>
                                                    </div>
                                                </div>

                                                {/* Learn More Link */}
                                                <div className="inline-flex items-center gap-2 text-sm font-medium pt-2 mt-auto group/link">
                                                    <span
                                                        className="group-hover/link:underline transition-all"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        VIEW SERVICE
                                                    </span>
                                                    <ArrowRight
                                                        className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        {/* Ghost / All UK Airports Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: airportServices.length * 0.1 }}
                            className="airport-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)] snap-center"
                        >
                            <div
                                className="h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center min-h-[380px]"
                                style={{
                                    borderColor: 'rgba(255,255,255,0.15)',
                                    backgroundColor: 'rgba(255,255,255,0.02)',
                                }}
                            >
                                <div
                                    className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-4 transition-transform hover:scale-110"
                                    style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                                >
                                    <Plane className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                                    All UK Airports &amp; FBOs
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                                    Need a transfer to Farnborough, RAF Northolt, TAG, or any regional UK airfield? We cover all airports 24/7.
                                </p>
                                <Link
                                    to="/booking"
                                    className="px-6 py-2.5 rounded font-semibold text-xs uppercase tracking-wider text-black transition-all duration-300 hover:brightness-110 flex items-center gap-2 shadow-lg"
                                    style={{ backgroundColor: 'var(--color-primary)' }}
                                >
                                    <span>Instant Airport Quote</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx="true">{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Bottom Border */}
            <div className="hidden md:flex justify-center mt-8">
                <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
        </section>
    );
}

export default AirportsSection;
