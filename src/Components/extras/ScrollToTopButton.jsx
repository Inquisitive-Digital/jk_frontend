import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { getLenisInstance } from '../../App';
import { useLocation } from 'react-router-dom';

function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(false);
    const location = useLocation();

    // Hide WhatsApp on these pages, so ScrollToTop should move to left-6
    const pagesWithoutWhatsApp = ['/booking'];
    const isOnWhatsAppPage = !pagesWithoutWhatsApp.includes(location.pathname);

    const handleScroll = useCallback(() => {
        setVisible(window.scrollY > 400);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const scrollToTop = () => {
        const lenis = getLenisInstance();
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.2 });
        }
        // Also call native scroll as backup
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const defaultColor = '#D7B75E'; // Gold/yellow theme color
    const hoverColor = '#F0D07A'; // Lighter gold on hover
    const defaultBg = 'rgba(215, 183, 94, 0.15)';
    const hoverBg = 'rgba(215, 183, 94, 0.25)';

    // Position: left-20 (right of WhatsApp with gap) or left-6 (when no WhatsApp)
    const positionClass = isOnWhatsAppPage ? 'left-20' : 'left-6';

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    id="scroll-to-top-btn"
                    onClick={scrollToTop}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`fixed bottom-6 ${positionClass} z-[9999] w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 cursor-pointer`}
                    style={{
                        backgroundColor: hovered ? hoverBg : defaultBg,
                        color: hovered ? hoverColor : defaultColor,
                        border: `1px solid ${hovered ? hoverColor + '40' : defaultColor + '40'}`,
                        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                        boxShadow: hovered ? `0 6px 20px ${hoverColor}25` : `0 4px 15px ${defaultColor}20`,
                        backdropFilter: 'blur(8px)',
                    }}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    aria-label="Scroll to top"
                    title="Back to top"
                >
                    <ArrowUp size={20} strokeWidth={2.5} />
                    {/* Tooltip */}
                    <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap pointer-events-none transition-all duration-200"
                        style={{
                            backgroundColor: hovered ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.85)',
                            color: hovered ? hoverColor : defaultColor,
                            opacity: hovered ? 1 : 0,
                            transform: hovered ? 'translateY(0)' : 'translateY(-4px)',
                            border: hovered ? `1px solid ${hoverColor}30` : `1px solid ${defaultColor}30`,
                        }}
                    >
                        Top
                    </div>
                </motion.button>
            )}
        </AnimatePresence>
    );
}

export default ScrollToTopButton;
