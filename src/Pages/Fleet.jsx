import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Loader2, Users, Briefcase } from 'lucide-react';
import { fleetAPI, getImageUrl } from '../Utils/api';

const BASE_URL = 'https://jkexecutivechauffeurs.com';

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Our Fleet', item: `${BASE_URL}/fleet` },
    ],
};

const DESKTOP_PER_PAGE = 9;
const MOBILE_INITIAL = 5;
const MOBILE_LOAD_MORE = 5;

function Fleet() {
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileVisibleCount, setMobileVisibleCount] = useState(MOBILE_INITIAL);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['fleet-all'],
        queryFn: () => fleetAPI.getAll(1, 100),
    });

    const allFleet = data?.fleet || [];

    // Desktop pagination
    const totalPages = Math.ceil(allFleet.length / DESKTOP_PER_PAGE);
    const desktopFleet = allFleet.slice(
        (currentPage - 1) * DESKTOP_PER_PAGE,
        currentPage * DESKTOP_PER_PAGE
    );

    // Mobile view more
    const mobileFleet = allFleet.slice(0, mobileVisibleCount);
    const hasMoreMobile = mobileVisibleCount < allFleet.length;

    useEffect(() => {
        setMobileVisibleCount(MOBILE_INITIAL);
    }, []);

    const displayedFleet = isMobile ? mobileFleet : desktopFleet;

    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else if (currentPage <= 3) {
            pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
        return pages;
    };

    const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'JK Executive Chauffeurs — Our Fleet',
        itemListElement: allFleet.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            url: `${BASE_URL}/fleet/${item.slug}`,
            image: getImageUrl(item.heroImage?.url),
        })),
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
                {allFleet.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify(itemListSchema)}
                    </script>
                )}
                <title>Luxury Chauffeur Fleet in London – Explore Premium Vehicles | JK Executive</title>
                <meta name="description" content="Browse our premium chauffeur fleet in London — Mercedes S/E/V Class, Rolls Royce, Range Rover & EV options. Find your perfect vehicle today." />
            </Helmet>
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
            {/* Hero Banner */}
            <div
                className="relative pt-36 pb-16 md:pt-44 md:pb-20"
                style={{
                    background: 'linear-gradient(180deg, rgba(26,26,26,0.9) 0%, var(--color-dark) 100%)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-sm font-medium tracking-[0.25em] uppercase mb-4"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Premium Collection
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-light text-white"
                    >
                        Our <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Fleet</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/60 mt-4 max-w-2xl mx-auto text-lg"
                    >
                        Discover our handpicked selection of luxury vehicles for every occasion
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-8 mx-auto w-24 h-0.5"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                </div>
            </div>

            {/* Fleet Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--color-primary)' }} />
                    </div>
                )}

                {/* Error */}
                {isError && (
                    <div className="text-center py-32">
                        <p className="text-white/60 text-lg">Failed to load fleet.</p>
                        <p className="text-white/40 text-sm mt-2">{error?.message}</p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !isError && allFleet.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-white/60 text-lg">No vehicles available at the moment.</p>
                    </div>
                )}

                {/* Cards Grid */}
                {!isLoading && displayedFleet.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {displayedFleet.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                >
                                    <Link to={`/fleet/${item.slug}`} className="block h-full">
                                        <div className="group cursor-pointer h-full transition-transform duration-500 hover:-translate-y-2">
                                            {/* Image */}
                                            <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden">
                                                <img
                                                    src={getImageUrl(item.heroImage?.url, 'https://via.placeholder.com/600x400?text=Vehicle')}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/600x400?text=Vehicle';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />

                                                {/* Price Badge */}
                                                {item.basePrice && (
                                                    <div
                                                        className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                                                        style={{
                                                            backgroundColor: 'var(--color-primary)',
                                                            color: 'var(--color-dark)',
                                                        }}
                                                    >
                                                        From £{Math.round(item.basePrice)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div
                                                className="p-5 rounded-b-xl space-y-3"
                                                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                            >
                                                {item.subtitle && (
                                                    <p
                                                        className="text-xs font-semibold uppercase tracking-[0.15em]"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                                <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                                                    {item.description}
                                                </p>

                                                {/* Specs row */}
                                                <div className="flex items-center gap-4 pt-1">
                                                    {item.passengers > 0 && (
                                                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                                                            <Users className="w-3.5 h-3.5" />
                                                            <span>{item.passengers} passengers</span>
                                                        </div>
                                                    )}
                                                    {item.luggage > 0 && (
                                                        <div className="flex items-center gap-1.5 text-white/40 text-xs">
                                                            <Briefcase className="w-3.5 h-3.5" />
                                                            <span>{item.luggage} luggage</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* View Details */}
                                                <div className="inline-flex items-center gap-2 text-sm font-medium pt-2 group/link">
                                                    <span
                                                        className="group-hover/link:underline transition-all"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        VIEW DETAILS
                                                    </span>
                                                    <ArrowRight
                                                        className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Mobile: View More */}
                        {isMobile && hasMoreMobile && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center mt-10"
                            >
                                <button
                                    onClick={() => setMobileVisibleCount((prev) => prev + MOBILE_LOAD_MORE)}
                                    className="px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 border"
                                    style={{
                                        borderColor: 'var(--color-primary)',
                                        color: 'var(--color-primary)',
                                        backgroundColor: 'transparent',
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
                                    View More Vehicles
                                </button>
                            </motion.div>
                        )}

                        {isMobile && (
                            <p className="text-center text-white/30 text-sm mt-4">
                                Showing {Math.min(mobileVisibleCount, allFleet.length)} of {allFleet.length} vehicles
                            </p>
                        )}

                        {/* Desktop: Pagination */}
                        {!isMobile && totalPages > 1 && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center justify-center gap-2 mt-14"
                                >
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                                        style={{
                                            borderColor: currentPage > 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                            color: currentPage > 1 ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                            cursor: currentPage > 1 ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    {getPageNumbers().map((page, i) =>
                                        page === '...' ? (
                                            <span key={`dots-${i}`} className="px-2 text-white/30">...</span>
                                        ) : (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className="w-10 h-10 rounded-full text-sm font-medium transition-all duration-300"
                                                style={{
                                                    backgroundColor: currentPage === page ? 'var(--color-primary)' : 'transparent',
                                                    color: currentPage === page ? 'var(--color-dark)' : 'rgba(255,255,255,0.6)',
                                                    border: currentPage === page ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                }}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300"
                                        style={{
                                            borderColor: currentPage < totalPages ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                            color: currentPage < totalPages ? 'var(--color-primary)' : 'rgba(255,255,255,0.2)',
                                            cursor: currentPage < totalPages ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </motion.div>

                                <p className="text-center text-white/30 text-sm mt-4">
                                    Page {currentPage} of {totalPages} ({allFleet.length} vehicles)
                                </p>
                            </>
                        )}
                    </>
                )}
            </div>
            </main>
        </>
    );
}

export default Fleet;
