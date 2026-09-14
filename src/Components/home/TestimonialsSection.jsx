import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Analytics from '../../Utils/analytics';

// Testimonials data — Real Google Reviews (fetched Sep 2026, Place ID: ChIJrQeu8XNydkgRZ_viBgGRIn0)
const TESTIMONIALS = [
    {
        id: 1,
        name: 'Jason Kite',
        role: 'Airport Transfer · Heathrow',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocJoU9OkOZvDgKjWYGzl6P5FVeZhZyXdOVLqy5837n7KY86uwg=s128-c0x00000000-cc-rp-mo-ba4',
        rating: 5,
        text: 'Tremendous communication from the moment I started the booking. Very helpful, polite and quick to respond. Our driver, Abdul, was very friendly and the car, S560, in great condition. We were met at Heathrow after flying from US and taken to the east coast where we arrived refreshed. Highly recommend and will certainly use again.',
        source: 'Google',
        date: '3 months ago',
    },
    {
        id: 2,
        name: 'ikranesha15',
        role: 'Business Travel Client',
        image: 'https://lh3.googleusercontent.com/a/ACg8ocJge3EigAIo7YlRubECHN70J47TZEedchVvs4btRkd2CyEw-A=s128-c0x00000000-cc-rp-mo-ba3',
        rating: 5,
        text: 'I was on a business trip in China and I was easily able to book a chauffeur for children the same day. I was provided with the chauffeur details and they had an enhanced DBS. My kids also enjoyed the experience and I will definitely recommend and use in future.',
        source: 'Google',
        date: '2 months ago',
    },
    {
        id: 3,
        name: 'Ashley Matlock',
        role: 'Family & Airport Client',
        image: 'https://lh3.googleusercontent.com/a-/ALV-UjU4vvu7XJIi6uatR_C4qeO02j2UgGpEfhcOWBkMFkIxxP-s0sI=s128-c0x00000000-cc-rp-mo',
        rating: 5,
        text: 'Baerru was absolutely fabulous to have as our driver for the last few days in London. My grandmother and I were traveling with my 6 month old son. He was so accommodating, flexible with what we wanted to do each day. I highly recommend him and look forward to using him in the future when we visit London again.',
        source: 'Google',
        date: '10 months ago',
    },
    {
        id: 4,
        name: 'Silvia Oliveras',
        role: 'Airport Transfer Client',
        image: 'https://lh3.googleusercontent.com/a-/ALV-UjUqay6QhLB0SjIRQ-72L2AIdQRe6S4kGVrBXBIbryrWXkPQHZKK=s128-c0x00000000-cc-rp-mo-ba4',
        rating: 5,
        text: 'Everything went well and the level of service met our needs and high expectations. The car was the expected model, very clean. The driver was very polite, wearing a suit and did all the hard work both ends. After a couple of bad experiences, we were very happy and relieved to have hired JK Executive Chauffeurs. Would definitely recommend and will use them again.',
        source: 'Google',
        date: '2 years ago',
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
                onError={(e) => {
                    // Hide broken image and show initials fallback
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling;
                    if (fallback) fallback.style.display = 'flex';
                }}
            />
            {/* Initials fallback — hidden by default, shown if image fails */}
            <div
                className="w-12 h-12 rounded-full items-center justify-center flex-shrink-0 text-sm font-bold text-black"
                style={{ display: 'none', backgroundColor: 'var(--color-primary)' }}
                aria-hidden="true"
            >
                {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
            </div>
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

                    {/* Google Reviews Badge */}
                    <motion.a
                        href="https://www.google.com/maps/search/?api=1&query=JK+Executive+Chauffeurs"
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-all duration-300"
                        style={{
                            borderColor: 'rgba(212,175,55,0.25)',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.08)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.25)'; }}
                    >
                        {/* Google "G" Logo */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>

                        <div className="flex flex-col leading-tight">
                            {/* Stars row */}
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold text-white">4.9</span>
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < 5 ? '#D4AF37' : 'none'} xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            {/* Review count */}
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>45 Google reviews</span>
                        </div>
                    </motion.a>

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
