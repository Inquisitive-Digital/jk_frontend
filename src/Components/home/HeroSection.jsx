import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import bgVideo from '../../assets/bgVideo.mp4';
import Analytics from '../../Utils/analytics';

// Rotating text options
const ROTATING_TEXTS = [
    'Airport Transfer',
    'Business Travel',
    'Wedding Services',
    'Event Services',
];

function HeroSection() {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    // Rotate text every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={bgVideo} type="video/mp4" />
                </video>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />
                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Content - aligned with header (max-w-7xl px-4 md:px-8) */}
            <div className="relative z-10 text-left max-w-7xl mx-auto px-4 md:px-8 pt-24 w-full">
                {/* Small Tagline - positioned left above Chauffeur */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-2"
                    style={{ color: 'var(--color-primary)' }}
                >
                    Distinguished Business & Private Travel
                </motion.p>

                {/* Main Heading with Rotating Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                        {/* Chauffeur for - positioned left */}
                        <span className="block mb-1">Chauffeur for</span>
                        {/* Rotating Text - indented to the right */}
                        <span className="block pl-8 md:pl-16 lg:pl-24">
                            <span className="relative inline-block h-[1.2em] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={currentTextIndex}
                                        initial={{ y: '100%', opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: '-100%', opacity: 0 }}
                                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                                        className="block font-semibold"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        {ROTATING_TEXTS[currentTextIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </span>
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-base md:text-lg text-white/80 max-w-xl mb-10 leading-relaxed"
                >
                    Experience unrivalled reliability and multi-award-winning service.
                    Your personal chauffeur, available 24/7 across London and beyond.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-start gap-4"
                >
                    <Link
                        to="/booking"
                        onClick={() => Analytics.trackBookingClick('hero_get_quote')}
                        className="group flex items-center gap-2 px-8 py-4 text-black font-bold uppercase tracking-wider rounded transition-all duration-300"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            boxShadow: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(var(--color-primary-rgb), 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Get a Quote
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button
                        onClick={() => {
                            Analytics.trackCallClick('hero_speak_to_us');
                            window.open('tel:+442012345678', '_self');
                        }}
                        className="px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-medium uppercase tracking-wider rounded transition-all duration-300 hover:bg-white/5"
                    >
                        Speak to Us
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection;
