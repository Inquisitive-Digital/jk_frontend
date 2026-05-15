import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function NotFound() {
    // Staggered animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } 
        }
    };

    return (
        <>
            <Helmet>
                <title>404 - Destination Unknown | JK Executive Chauffeurs</title>
                <meta name="description" content="The page you are looking for cannot be found." />
            </Helmet>
            <main 
                className="relative flex flex-col items-center justify-center px-6 py-24 md:py-32 lg:py-40 overflow-hidden" 
                style={{ 
                    backgroundColor: 'var(--color-dark)',
                    minHeight: '80vh'
                }}
            >
                {/* Subtle Background Glows */}
                <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full pointer-events-none blur-[100px] md:blur-[150px] opacity-10"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                ></div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 text-center w-full max-w-4xl mx-auto flex flex-col items-center"
                >
                    {/* The 404 Numbers */}
                    <motion.div variants={itemVariants} className="relative mb-6 md:mb-10 inline-block select-none">
                        <h1 
                            className="font-bold tracking-tighter" 
                            style={{ 
                                fontSize: 'clamp(6rem, 25vw, 15rem)',
                                lineHeight: 0.85,
                                color: 'transparent',
                                WebkitTextStroke: '2px var(--color-primary)',
                                opacity: 0.8,
                                backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, transparent 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                            }}
                        >
                            404
                        </h1>
                        <div 
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-1" 
                            style={{ 
                                backgroundColor: 'var(--color-primary)', 
                                filter: 'blur(15px)',
                                opacity: 0.3
                            }}
                        ></div>
                    </motion.div>
                    
                    {/* Text Content */}
                    <motion.div variants={itemVariants} className="mb-8 md:mb-12 flex flex-col items-center">
                        <div className="h-[2px] w-12 mb-6 md:mb-8" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4 tracking-wide">
                            Destination <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Unknown</span>
                        </h2>
                        <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed px-4">
                            It appears the route you are looking for is not on our itinerary. Let us guide you back to your premium journey.
                        </p>
                    </motion.div>
                    
                    {/* Action Buttons */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4">
                        <Link 
                            to="/"
                            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 rounded-md text-xs sm:text-sm uppercase tracking-widest font-medium transition-all duration-500 overflow-hidden relative"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: '#000',
                            }}
                        >
                            <span className="relative z-10 flex items-center gap-2 group-hover:text-black transition-colors duration-500">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                Return Home
                            </span>
                            <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                        </Link>
                        
                        <Link 
                            to="/booking"
                            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 sm:px-10 py-4 rounded-md text-xs sm:text-sm uppercase tracking-widest font-medium transition-all duration-500"
                            style={{
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#fff',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
                                e.currentTarget.style.color = 'var(--color-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#fff';
                            }}
                        >
                            <span>Book a Vehicle</span>
                            <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </Link>
                    </motion.div>
                </motion.div>
            </main>
        </>
    );
}

export default NotFound;
