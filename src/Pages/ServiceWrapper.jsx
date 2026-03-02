import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { serviceAPI } from '../Utils/api';

function ServiceWrapper() {
    const { slug } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['service', slug],
        queryFn: () => serviceAPI.getServiceBySlug(slug),
        enabled: !!slug,
    });

    const service = data?.service;

    // Loading State
    if (isLoading) {
        return (
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
                <div className="flex items-center justify-center pt-44 pb-20">
                    <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </main>
        );
    }

    // Error / Not Found State
    if (isError || !service) {
        return (
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
                <div className="flex flex-col items-center justify-center pt-44 pb-20 px-4">
                    <h2 className="text-2xl font-semibold text-white mb-4">Service Not Found</h2>
                    <p className="text-white/50 mb-8">The service you're looking for doesn't exist or has been removed.</p>
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Services
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
            {/* Hero Image Section */}
            <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
                <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2 }}
                    src={service.image?.url}
                    alt={service.title}
                    className="w-full h-full object-cover"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a]/60 to-transparent" />

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-32 md:top-36 left-4 md:left-8"
                >
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.15)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(215,183,94,0.2)';
                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                        }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Services
                    </Link>
                </motion.div>

                {/* Title Overlay on Image */}
                <div className="absolute bottom-8 md:bottom-12 left-0 right-0 px-4 md:px-8">
                    <div className="max-w-7xl mx-auto  xl:px-5">

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white  xl:ml-2"
                        >
                            {service.title}
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="grid lg:grid-cols-3 gap-10 md:gap-16">
                    {/* Main Content — 2/3 */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Short Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h2
                                className="text-xl md:text-2xl font-semibold mb-4"
                                style={{ color: 'var(--color-primary)' }}
                            >
                                About This Service
                            </h2>
                            <p className="text-white/70 text-base md:text-lg leading-relaxed">
                                {service.description}
                            </p>
                        </motion.div>

                        {/* Long Description */}
                        {service.longDescription && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="space-y-4"
                            >
                                <div
                                    className="w-full h-px"
                                    style={{ background: 'linear-gradient(90deg, var(--color-primary), transparent)' }}
                                />
                                <div className="text-white/60 text-base leading-relaxed whitespace-pre-line">
                                    {service.longDescription}
                                </div>
                            </motion.div>
                        )}

                        {/* Features List */}
                        {service.features && service.features.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <h3
                                    className="text-lg font-semibold mb-5"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    Key Features
                                </h3>
                                <div className="grid sm:grid-cols-2 gap-3">
                                    {service.features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + i * 0.05 }}
                                            className="flex items-start gap-3 p-3 rounded-lg"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                                style={{ backgroundColor: 'rgba(215,183,94,0.15)' }}
                                            >
                                                <Check className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
                                            </div>
                                            <span className="text-white/70 text-sm">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar — 1/3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-1"
                    >
                        <div
                            className="sticky top-32 rounded-2xl p-6 md:p-8 space-y-6"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        >
                            <h3 className="text-lg font-semibold text-white">
                                Ready to Experience?
                            </h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Book our {service.title} and enjoy world-class chauffeur service tailored to your needs.
                            </p>

                            {/* Decorative line */}
                            <div
                                className="w-12 h-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            />

                            {/* Book Now CTA */}
                            <Link
                                to="/booking"
                                className="block w-full text-center px-6 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-dark)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(215,183,94,0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                Book Now
                            </Link>

                            {/* Contact info */}
                            <div className="text-center">
                                <p className="text-white/40 text-xs mb-1">Or call us directly</p>
                                <a
                                    href="tel:+442012345678"
                                    className="text-sm font-medium transition-colors"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    +44 (0)20 1234 5678
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom CTA Section */}
            <div
                className="py-16 md:py-20"
                style={{
                    background: 'linear-gradient(180deg, var(--color-dark) 0%, rgba(215,183,94,0.05) 50%, var(--color-dark) 100%)',
                }}
            >
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-light text-white mb-4"
                    >
                        Explore More <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Services</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/50 mb-8"
                    >
                        Discover our full range of luxury chauffeur services
                    </motion.p>
                    <Link
                        to="/services"
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 border"
                        style={{
                            borderColor: 'var(--color-primary)',
                            color: 'var(--color-primary)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                            e.currentTarget.style.color = 'var(--color-dark)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                    >
                        View All Services
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default ServiceWrapper;
