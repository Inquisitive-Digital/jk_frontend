import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Users, Briefcase, CheckCircle2, ChevronLeft, ChevronRight,
    Loader2, Shield, Star, ArrowRight,
} from 'lucide-react';
import { fleetAPI } from '../Utils/api';
import Analytics from '../Utils/analytics';

function FleetDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [activeImage, setActiveImage] = useState(0);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['fleet-detail', slug],
        queryFn: () => fleetAPI.getBySlug(slug),
        enabled: !!slug,
    });

    const fleet = data?.fleet;
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const getImageSrc = (imgObj) => {
        if (!imgObj?.url) return 'https://via.placeholder.com/800x500?text=Vehicle';
        if (imgObj.url.startsWith('http')) return imgObj.url;
        return `${API_BASE}${imgObj.url}`;
    };

    // Build gallery from hero + gallery images
    const allImages = fleet
        ? [fleet.heroImage, ...(fleet.gallery || [])].filter((img) => img?.url)
        : [];

    const handlePrevImage = () => {
        setActiveImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setActiveImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    };

    if (isLoading) {
        return (
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
                <div className="flex items-center justify-center pt-48">
                    <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                </div>
            </main>
        );
    }

    if (isError || !fleet) {
        return (
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
                <div className="flex flex-col items-center justify-center pt-48 gap-4">
                    <p className="text-white/60 text-lg">Vehicle not found.</p>
                    <Link
                        to="/fleet"
                        className="inline-flex items-center gap-2 text-sm font-medium"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Fleet
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <div
                className="relative pt-32 pb-8 md:pt-40 md:pb-12"
                style={{
                    background: 'linear-gradient(180deg, rgba(26,26,26,0.95) 0%, var(--color-dark) 100%)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Link
                            to="/fleet"
                            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors hover:opacity-80"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Fleet
                        </Link>
                    </motion.div>

                    {/* Title Area */}
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                        <div>
                            {fleet.subtitle && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    {fleet.subtitle}
                                </motion.p>
                            )}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-3xl md:text-4xl lg:text-5xl font-light text-white"
                            >
                                {fleet.title}
                            </motion.h1>
                        </div>

                        {/* Price Badge */}
                        {fleet.basePrice && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex flex-col items-end"
                            >
                                <span className="text-white/40 text-xs uppercase tracking-wider">Starting from</span>
                                <span
                                    className="text-3xl md:text-4xl font-bold"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    £{Math.round(fleet.basePrice)}
                                </span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

                    {/* Left Column: Image Gallery + Description */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Main Image */}
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeImage}
                                        src={getImageSrc(allImages[activeImage])}
                                        alt={fleet.title}
                                        className="w-full h-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x500?text=Vehicle';
                                        }}
                                    />
                                </AnimatePresence>

                                {/* Navigation arrows */}
                                {allImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={handlePrevImage}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={handleNextImage}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>

                                        {/* Image counter */}
                                        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs">
                                            {activeImage + 1} / {allImages.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                    {allImages.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200"
                                            style={{
                                                border: activeImage === i
                                                    ? '2px solid var(--color-primary)'
                                                    : '2px solid transparent',
                                                opacity: activeImage === i ? 1 : 0.5,
                                            }}
                                        >
                                            <img
                                                src={getImageSrc(img)}
                                                alt={`${fleet.title} - ${i + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Short Description */}
                            <div
                                className="p-6 rounded-xl"
                                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                            >
                                <p className="text-white/70 text-base leading-relaxed">
                                    {fleet.description}
                                </p>
                            </div>

                            {/* Long Description */}
                            {fleet.longDescription && (
                                <div className="space-y-4">
                                    <h2
                                        className="text-xl md:text-2xl font-semibold text-white"
                                    >
                                        About This Vehicle
                                    </h2>
                                    {fleet.longDescription.split('\n').filter(Boolean).map((para, i) => (
                                        <p key={i} className="text-white/60 text-sm leading-relaxed">
                                            {para}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {/* Specifications */}
                            {fleet.specifications && fleet.specifications.length > 0 && (
                                <div className="space-y-4">
                                    <h2 className="text-xl md:text-2xl font-semibold text-white">
                                        Vehicle Specifications
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {fleet.specifications.map((spec, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="flex items-start gap-3 p-3 rounded-lg"
                                                style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                                            >
                                                <CheckCircle2
                                                    className="w-4 h-4 flex-shrink-0 mt-0.5"
                                                    style={{ color: 'var(--color-primary)' }}
                                                />
                                                <span className="text-white/70 text-sm">{spec}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Info Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="rounded-xl p-6 space-y-5 sticky top-28"
                            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                        >
                            {/* Capacity */}
                            <div className="space-y-3">
                                <h3
                                    className="text-sm font-semibold uppercase tracking-wider"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    Vehicle Capacity
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div
                                        className="flex flex-col items-center py-4 rounded-lg"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                                    >
                                        <Users className="w-5 h-5 mb-2" style={{ color: 'var(--color-primary)' }} />
                                        <span className="text-white text-xl font-bold">{fleet.passengers || '—'}</span>
                                        <span className="text-white/40 text-xs mt-1">Passengers</span>
                                    </div>
                                    <div
                                        className="flex flex-col items-center py-4 rounded-lg"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                                    >
                                        <Briefcase className="w-5 h-5 mb-2" style={{ color: 'var(--color-primary)' }} />
                                        <span className="text-white text-xl font-bold">{fleet.luggage || '—'}</span>
                                        <span className="text-white/40 text-xs mt-1">Luggage</span>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                            {/* Features */}
                            {fleet.features && fleet.features.length > 0 && (
                                <div className="space-y-3">
                                    <h3
                                        className="text-sm font-semibold uppercase tracking-wider"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        Included Features
                                    </h3>
                                    <div className="space-y-2">
                                        {fleet.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <Shield className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                                                <span className="text-white/60 text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

                            {/* Price */}
                            {fleet.basePrice && (
                                <div className="text-center py-2">
                                    <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">
                                        Starting from
                                    </span>
                                    <span
                                        className="text-3xl font-bold"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        £{Math.round(fleet.basePrice)}
                                    </span>
                                </div>
                            )}

                            {/* Book Now CTA */}
                            <button
                                onClick={() => {
                                    Analytics.trackBookingClick('fleet_detail_book_now', { vehicle_name: fleet.title });
                                    navigate('/booking');
                                }}
                                className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-dark)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(215,183,94,0.3)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Book Now
                            </button>

                            {/* Browse Fleet Link */}
                            <div className="text-center">
                                <Link
                                    to="/fleet"
                                    className="inline-flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    <ArrowLeft className="w-3 h-3" />
                                    Browse All Vehicles
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default FleetDetail;
