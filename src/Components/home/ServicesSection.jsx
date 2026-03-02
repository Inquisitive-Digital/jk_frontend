import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { serviceAPI } from '../../Utils/api';
import ServiceCardSkeleton from '../extras/ServiceCardSkeleton';
import ServicesGhostCard from '../extras/ServicesGhostCard';

function ServicesSection() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Fetch real services from the DB
    const { data, isLoading } = useQuery({
        queryKey: ['home-services'],
        queryFn: () => serviceAPI.getAllServices(1, 5),
        staleTime: 10 * 60 * 1000,
    });

    const services = data?.services || [];

    // Check scroll position
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
    }, [services.length]);

    // Scroll by cards
    const scroll = (direction) => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.querySelector('.service-card')?.offsetWidth || 400;
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
                            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            What We Offer
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
                        >
                            OUR <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>SERVICES</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 mt-3 max-w-xl"
                        >
                            Tailor made travel solutions just for you
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
                            aria-label="Previous services"
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
                            aria-label="Next services"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Skeleton Loading State - 3 Cards */}
                {isLoading && (
                    <div className="flex gap-6 overflow-x-hidden pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {[0, 1, 2].map((i) => (
                            <ServiceCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Services Carousel */}
                {!isLoading && services.length > 0 && (
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {services.map((service, index) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="service-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)] snap-center"
                            >
                                <Link to={`/services/${service.slug}`} className="block h-full">
                                    <div className="group cursor-pointer h-full flex flex-col transition-transform duration-500 hover:-translate-y-2">
                                        {/* Image Container */}
                                        <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={service.image?.url}
                                                alt={service.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                                        </div>

                                        {/* Content */}
                                        <div
                                            className="p-4 rounded-b-xl flex flex-col flex-grow"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        >
                                            <p
                                                className="text-xs font-medium uppercase tracking-wider mb-1"
                                                style={{ color: 'var(--color-primary)' }}
                                            >
                                                {service.category || service.subtitle}
                                            </p>
                                            <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors mb-2 line-clamp-1">
                                                {service.title}
                                            </h3>
                                            <p className="text-white/60 text-sm leading-relaxed line-clamp-2 flex-grow">
                                                {service.description}
                                            </p>

                                            {/* Learn More Link */}
                                            <div className="inline-flex items-center gap-2 text-sm font-medium pt-3 mt-auto group/link">
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
                        ))}
                        <ServicesGhostCard delay={services.length * 0.1} />
                    </div>
                )}

                {/* Mobile Scroll Indicator */}

            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
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

export default ServicesSection;
