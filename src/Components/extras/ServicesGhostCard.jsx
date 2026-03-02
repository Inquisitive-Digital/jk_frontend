import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function ServicesGhostCard({ delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="service-card flex-shrink-0 w-[55%] sm:w-[35%] lg:w-[calc(33.333%-16px)] snap-center"
        >
            <Link to="/services" className="block h-full">
                <motion.div
                    className="h-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed min-h-[280px] px-0 text-center"
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    style={{
                        borderColor: 'rgba(255,255,255,0.12)',
                        backgroundColor: 'rgba(255,255,255,0.02)',
                    }}
                    variants={{
                        rest: {
                            borderColor: 'rgba(255,255,255,0.12)',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                        },
                        hover: {

                        },
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    {/* Icon circle */}
                    <motion.div
                        className="w-14 h-14 rounded-full border-2 flex items-center justify-center mb-4"
                        variants={{
                            rest: {
                                borderColor: 'rgba(201,168,76,0.4)',
                                backgroundColor: 'transparent',

                            },
                            hover: {
                                borderColor: 'var(--color-primary)',
                                backgroundColor: 'var(--color-primary)',

                            },
                        }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                        <motion.span
                            variants={{
                                rest: { color: 'var(--color-primary)', x: 0 },
                                hover: { color: '#000000' },
                            }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                            <ArrowRight className="w-6 h-6" />
                        </motion.span>
                    </motion.div>

                    <motion.span
                        className="text-lg font-semibold text-white block mb-1"
                        variants={{
                            rest: { color: '#ffffff' },
                            hover: { color: 'rgba(255,255,255,0.9)' },
                        }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                        View All Services
                    </motion.span>
                    <span className="text-sm text-white/40 block">
                        See everything we offer
                    </span>
                </motion.div>
            </Link>
        </motion.div>
    );
}

export default ServicesGhostCard;
