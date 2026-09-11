import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGoogleMaps } from '../../Context/GoogleMapsContext';
// import heroImage from '../../assets/heroImage.png';
// Import WebP version after you convert it (heroImage.webp)
import heroImageWebp from '../../assets/heroImage.webp';
import Analytics from '../../Utils/analytics';
import { useBooking } from '../../Context/BookingContext';
import Locations from '../booking/Locations';
import BookingFormSkeleton from '../booking/BookingFormSkeleton';

// Libraries are managed globally via GoogleMapsProvider in App.jsx

// Rotating text options
const ROTATING_TEXTS = [
    'Airport Transfer',
    'Business Travel',
    'Wedding Services',
    'Event Services',
];

function HeroSection() {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const navigate = useNavigate();
    const { bookingData, updateBooking, markAsFromHero } = useBooking();

    const { isLoaded } = useGoogleMaps();

    // Rotate text every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % ROTATING_TEXTS.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // Handle navigation to booking page with pre-filled data
    const handleHeroSubmit = () => {
        markAsFromHero();
        navigate('/booking', { state: { startStep: 2 } });
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-x-hidden">
            {/* Image Background */}
            <div className="absolute inset-0 z-0">
                <picture>
                    {/* WebP format loading */}
                    <source srcSet={heroImageWebp} type="image/webp" />
                    <img
                        src={heroImageWebp}
                        alt="Luxury Chauffeur Service Hero Background"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                        loading="eager"
                        decoding="async"
                    />
                </picture>
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60" />
                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Content - aligned with header (max-w-7xl px-4 md:px-8) */}
            <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-32 md:pt-24 w-full">
                {/* Two-column layout: Left content + Right booking form */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* LEFT: Hero Content */}
                    <div className="text-left">
                        {/* Small Tagline - positioned left above Chauffeur */}
                        <motion.p
                            className="font-medium tracking-[0.2em] uppercase text-xs md:text-sm mb-2"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Distinguished Business & Private Travel
                        </motion.p>

                        {/* Main Heading with Rotating Text */}
                        <motion.div
                            className="mb-8"
                        >
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-tight">
                                <span className="block mb-1 font-semi-bold">Executive Car Hire &amp;</span>
                                <span
                                    className="block pl-2 sm:pl-4 md:pl-8 font-semibold whitespace-nowrap"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    Chauffeur Service London
                                </span>
                            </h1>
                        </motion.div>

                        {/* Subheading */}
                        <motion.div
                            className="max-w-xl mb-4"
                        >
                            <p className="text-sm md:text-base text-white mb-1 leading-snug">
                                Executive Travel for Airports, Corporate Meetings &amp; Special Events
                            </p>
                            <p className="text-sm md:text-base text-white/75 leading-relaxed">
                                Experience unrivalled reliability and multi-award-winning service with your personal chauffeur, available 24/7 across London and beyond.
                            </p>
                        </motion.div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row items-start gap-4"
                        >
                            <Link
                                to="/booking"
                                onClick={() => Analytics.trackBookingClick('hero_get_a_quote')}
                                className="hidden sm:flex group items-center gap-2 px-8 py-4 text-black font-bold uppercase tracking-wider rounded transition-all duration-300"
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
                                    window.open('tel:+442034759906', '_self');
                                }}
                                className="px-8 py-4 border-2 border-white/30 hover:border-white/60 text-white font-medium uppercase tracking-wider rounded transition-all duration-300 hover:bg-white/5"
                            >
                                Speak to Us
                            </button>
                        </motion.div>

                        {/* TfL Licence */}
                        <motion.div
                            className="mt-8 flex items-center gap-3 text-white/70 text-xs md:text-sm font-medium tracking-wider uppercase"
                        >
                            <span className="w-8 h-[2px] bg-[var(--color-primary)]"></span>
                            TfL Licence No — <span className="text-white">010468</span>
                        </motion.div>

                        {/* Google Reviews Badge */}
                        <motion.a
                            href="https://www.google.com/maps/search/?api=1&query=JK+Executive+Chauffeurs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2.5 cursor-pointer transition-all duration-300"
                            onClick={() => Analytics.trackEvent('google_reviews_badge_click', { location: 'hero' })}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.4)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                        >
                            {/* Google "G" icon */}
                            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            {/* Rating */}
                            <div className="flex flex-col leading-tight">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white font-bold text-sm">4.9</span>
                                    <div className="flex items-center gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="#F4B400">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-white/60 text-xs">45 Google reviews</span>
                            </div>
                        </motion.a>
                    </div>

                    {/* RIGHT: Booking Form - Desktop only */}
                    <div className="hidden lg:block relative z-[50]">
                        {isLoaded ? (
                            <Locations
                                data={bookingData}
                                updateData={updateBooking}
                                onNext={handleHeroSubmit}
                                isOnHome={true}
                            />
                        ) : (
                            <BookingFormSkeleton isOnHome={true} />
                        )}
                    </div>
                </div>

                {/* Mobile Booking Form - shown under content */}
                <div className="lg:hidden mt-8 pb-8 relative z-[50]">
                    {isLoaded ? (
                        <Locations
                            data={bookingData}
                            updateData={updateBooking}
                            onNext={handleHeroSubmit}
                            isOnHome={true}
                        />
                    ) : (
                        <BookingFormSkeleton isOnHome={true} />
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
