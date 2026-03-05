import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Analytics from '../../Utils/analytics';

// Testimonials data
const TESTIMONIALS = [
    {
        id: 1,
        name: 'James Richardson',
        role: 'Business Executive',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        text: 'Exceptional service from start to finish. The chauffeur was punctual, professional, and the vehicle was immaculate. Highly recommend for business travel.',
    },
    {
        id: 2,
        name: 'Sarah Mitchell',
        role: 'Wedding Client',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        text: 'Made our wedding day absolutely perfect. The Mercedes was stunning and our chauffeur went above and beyond. Thank you JK Executive!',
    },
    {
        id: 3,
        name: 'Michael Chen',
        role: 'Corporate Client',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        text: 'We use JK Executive for all our corporate transfers. Reliable, professional and always on time. Our clients are always impressed.',
    },
    {
        id: 4,
        name: 'Emma Thompson',
        role: 'Airport Transfer',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        text: 'The meet and greet service was fantastic. After a long flight, it was wonderful to be greeted and driven home in comfort.',
    },
    {
        id: 5,
        name: 'David Williams',
        role: 'Regular Client',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        rating: 5,
        text: 'Been using JK Executive for over a year now. Consistently excellent service. Would not trust anyone else for my travel needs.',
    },
];

// Single testimonial card component
const TestimonialCard = ({ testimonial }) => (
    <div
        className="h-[280px] p-6 rounded-2xl flex flex-col transition-all duration-300 hover:bg-white/[0.08]"
        style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
    >
        {/* Stars */}
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className="w-4 h-4"
                    fill={i < testimonial.rating ? 'var(--color-primary)' : 'transparent'}
                    style={{
                        color: i < testimonial.rating ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)'
                    }}
                />
            ))}
        </div>

        {/* Testimonial Text */}
        <p className="text-white/80 text-sm leading-relaxed flex-grow line-clamp-4">
            "{testimonial.text}"
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div>
                <h4 className="text-white font-semibold text-sm">
                    {testimonial.name}
                </h4>
                <p
                    className="text-xs"
                    style={{ color: 'var(--color-primary)' }}
                >
                    {testimonial.role}
                </p>
            </div>
        </div>
    </div>
);

function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);

    // Auto-play functionality
    useEffect(() => {
        if (!isPaused) {
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
            }, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPaused]);

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    // Get visible testimonials for desktop (show 3 at a time)
    const getVisibleTestimonials = () => {
        const visible = [];
        for (let i = 0; i < 3; i++) {
            const index = (currentIndex + i) % TESTIMONIALS.length;
            visible.push({ ...TESTIMONIALS[index], displayIndex: i });
        }
        return visible;
    };

    return (
        <section
            className="py-12 md:py-16"
            style={{ backgroundColor: 'var(--color-dark)' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Client Reviews
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
                        >
                            WHAT OUR CLIENTS{' '}
                            <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                                SAY
                            </span>
                        </motion.h2>
                    </div>

                    {/* Navigation Arrows - Desktop Only */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={goToPrev}
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                            style={{
                                borderColor: 'var(--color-primary)',
                                color: 'var(--color-primary)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                            style={{
                                borderColor: 'var(--color-primary)',
                                color: 'var(--color-primary)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary-rgb), 0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Desktop Testimonials - 3 cards grid */}
                <div className="hidden md:block relative overflow-hidden">
                    <div className="grid grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {getVisibleTestimonials().map((testimonial) => (
                                <motion.div
                                    key={`${testimonial.id}-${currentIndex}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.5 }}
                                    className="h-full"
                                >
                                    <TestimonialCard testimonial={testimonial} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Testimonials - Single card with animation */}
                <div className="md:hidden relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.4 }}
                        >
                            <TestimonialCard testimonial={TESTIMONIALS[currentIndex]} />
                        </motion.div>
                    </AnimatePresence>

                    {/* Mobile Navigation */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={goToPrev}
                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                            style={{
                                borderColor: 'var(--color-primary)',
                                color: 'var(--color-primary)',
                            }}
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                            style={{
                                borderColor: 'var(--color-primary)',
                                color: 'var(--color-primary)',
                            }}
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center mt-10"
                >
                    <a
                        href="/booking"
                        onClick={() => Analytics.trackBookingClick('testimonials_book_now')}
                        className="inline-flex items-center gap-2 px-8 py-3 text-black font-semibold text-sm uppercase tracking-wider rounded-lg transition-all duration-300 hover:shadow-lg"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                        }}
                    >
                        Book Luxury Chauffeur Now
                    </a>
                </motion.div>
            </div>
            <div className="hidden md:flex justify-center mt-10">
                <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
        </section>
    );
}

export default TestimonialsSection;
