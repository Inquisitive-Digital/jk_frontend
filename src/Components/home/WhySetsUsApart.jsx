import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Award, Crown, Armchair, CheckCircle, ChevronDown } from 'lucide-react';
import Analytics from '../../Utils/analytics';

// Key differentiators data
const DIFFERENTIATORS = [
    {
        id: 1,
        icon: CheckCircle,
        title: 'Reliable',
        description: 'Punctuality is our promise. We ensure on-time arrivals for every journey, giving you the confidence to plan without worry.',
    },
    {
        id: 2,
        icon: Shield,
        title: 'Trustworthy',
        description: 'Built on years of exceptional service and thousands of satisfied clients. Your journey is in experienced, professional hands.',
    },
    {
        id: 3,
        icon: Crown,
        title: 'Premium',
        description: 'An exceptional fleet of luxury vehicles paired with professionally trained chauffeurs delivering first-class service.',
    },
    {
        id: 4,
        icon: Armchair,
        title: 'Comfort',
        description: 'Spacious interiors, climate control, and complimentary amenities ensure a relaxing experience from door to door.',
    },
    {
        id: 5,
        icon: Award,
        title: 'Safe',
        description: 'Your safety is paramount. Fully vetted drivers, maintained vehicles, and comprehensive insurance for complete peace of mind.',
    },
];

// Card component
const DifferentiatorCard = ({ item, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative"
    >
        <div
            className="h-full p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.08]"
            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
            <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:scale-110"
                style={{ backgroundColor: 'rgba(var(--color-primary-rgb), 0.15)' }}
            >
                <item.icon
                    className="w-7 h-7 transition-colors duration-300"
                    style={{ color: 'var(--color-primary)' }}
                />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                {item.title}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
                {item.description}
            </p>
            <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ backgroundColor: 'var(--color-primary)' }}
            />
        </div>
    </motion.div>
);

function WhySetsUsApart() {
    const [showAll, setShowAll] = useState(false);

    // On mobile, show first 3 by default, on desktop show all
    const visibleItems = showAll ? DIFFERENTIATORS : DIFFERENTIATORS.slice(0, 3);
    const hiddenItems = DIFFERENTIATORS.slice(3);

    return (
        <section className="py-8 md:py-10" style={{ backgroundColor: 'var(--color-dark)' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header - Left aligned */}
                <div className="mb-10">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Why Choose Us
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
                    >
                        WHAT SETS US{' '}
                        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                            APART
                        </span>
                    </motion.h2>
                </div>

                {/* Desktop Grid - Always show all 5 */}
                <div className="hidden md:grid grid-cols-5 gap-8">
                    {DIFFERENTIATORS.map((item, index) => (
                        <DifferentiatorCard key={item.id} item={item} index={index} />
                    ))}
                </div>

                {/* Mobile Grid - Show 3, with See More option */}
                <div className="md:hidden">
                    <div className="grid grid-cols-1 gap-6">
                        {visibleItems.map((item, index) => (
                            <DifferentiatorCard key={item.id} item={item} index={index} />
                        ))}
                    </div>

                    {/* See More Button - Only on mobile when not expanded */}
                    {!showAll && hiddenItems.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex justify-center mt-6"
                        >
                            <button
                                onClick={() => setShowAll(true)}
                                className="flex flex-col items-center gap-1 text-white/60 hover:text-white transition-colors"
                            >
                                <span className="text-sm font-medium">See More</span>
                                <ChevronDown className="w-5 h-5 animate-bounce" style={{ color: 'var(--color-primary)' }} />
                            </button>
                        </motion.div>
                    )}

                    {/* Hidden items with animation */}
                    <AnimatePresence>
                        {showAll && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.4 }}
                                className="grid grid-cols-1 gap-6 mt-6"
                            >
                                {hiddenItems.map((item, index) => (
                                    <DifferentiatorCard key={item.id} item={item} index={index + 3} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-12"
                >
                    {/* <p className="text-white/50 text-sm mb-4">
                        Experience the JK Executive difference today
                    </p> */}
                    <a
                        href="/booking"
                        onClick={() => Analytics.trackBookingClick('why_us_book_journey')}
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
                        Book Your Journey
                    </a>
                </motion.div>

                {/* Bottom Border - gradient fade (Desktop only, brighter in center) */}
                <div className="hidden md:flex justify-center mt-10">
                    <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                </div>
            </div>
        </section>
    );
}

export default WhySetsUsApart;
