import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { serviceAPI } from '../Utils/api';

const PER_PAGE = 9;

function Services() {
    const observerRef = useRef(null);
    const [animatedCards, setAnimatedCards] = useState(new Set());

    // Infinite query — fetch page by page
    const {
        data,
        isLoading,
        isError,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['services-infinite'],
        queryFn: ({ pageParam = 1 }) => serviceAPI.getAllServices(pageParam, PER_PAGE),
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage.pagination || {};
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });

    // Flatten all pages
    const allServices = data?.pages?.flatMap((p) => p.services) || [];

    // Intersection Observer for infinite scroll
    const lastCardRef = useCallback(
        (node) => {
            if (isFetchingNextPage) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasNextPage) {
                        fetchNextPage();
                    }
                },
                { threshold: 0.1 }
            );

            if (node) observerRef.current.observe(node);
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage]
    );

    // Scroll animation observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('data-service-id');
                        if (id) {
                            setAnimatedCards((prev) => new Set([...prev, id]));
                        }
                    }
                });
            },
            { threshold: 0.15 }
        );

        const cards = document.querySelectorAll('[data-service-id]');
        cards.forEach((card) => observer.observe(card));
        return () => observer.disconnect();
    }, [allServices.length]);

    return (
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
                        What We Offer
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-light text-white"
                    >
                        Our <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Services</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/60 mt-4 max-w-2xl mx-auto text-lg"
                    >
                        Tailor-made luxury chauffeur solutions designed for every occasion
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

            {/* Services Grid */}
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
                        <p className="text-white/60 text-lg">Failed to load services.</p>
                        <p className="text-white/40 text-sm mt-2">{error?.message}</p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !isError && allServices.length === 0 && (
                    <div className="text-center py-32">
                        <p className="text-white/60 text-lg">No services available at the moment.</p>
                    </div>
                )}

                {/* Cards Grid */}
                {!isLoading && allServices.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {allServices.map((service, index) => {
                                const isLast = index === allServices.length - 1;
                                const isVisible = animatedCards.has(service._id);

                                return (
                                    <div
                                        key={service._id}
                                        ref={isLast ? lastCardRef : undefined}
                                        data-service-id={service._id}
                                        style={{
                                            opacity: isVisible ? 1 : 0,
                                            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                                            transition: `opacity 0.5s ease ${(index % PER_PAGE) * 0.05}s, transform 0.5s ease ${(index % PER_PAGE) * 0.05}s`,
                                        }}
                                    >
                                        <Link to={`/services/${service.slug}`} className="block h-full">
                                            <div className="group cursor-pointer h-full flex flex-col transition-transform duration-500 hover:-translate-y-2">
                                                {/* Image - fixed aspect ratio */}
                                                <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={service.image?.url}
                                                        alt={service.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        loading="lazy"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                                                </div>

                                                {/* Content - flex-grow to fill remaining space */}
                                                <div
                                                    className="p-5 rounded-b-xl flex flex-col flex-grow"
                                                    style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                                >
                                                    <p
                                                        className="text-xs font-semibold uppercase tracking-[0.15em] mb-1"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        {service.category || service.subtitle}
                                                    </p>
                                                    <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors mb-2 line-clamp-2">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-white/50 text-sm leading-relaxed line-clamp-3 flex-grow">
                                                        {service.description}
                                                    </p>

                                                    {/* View Service — always at bottom */}
                                                    <div className="inline-flex items-center gap-2 text-sm font-medium pt-4 mt-auto group/link">
                                                        <span
                                                            className="group-hover/link:underline transition-all"
                                                            style={{ color: 'var(--color-primary)' }}
                                                        >
                                                            VIEW SERVICE
                                                        </span>
                                                        <ArrowRight
                                                            className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                                                            style={{ color: 'var(--color-primary)' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Loading more spinner */}
                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
                                <span className="ml-3 text-white/50 text-sm">Loading more services...</span>
                            </div>
                        )}

                        {/* End of list */}
                        {!hasNextPage && allServices.length > PER_PAGE && (
                            <p className="text-center text-white/30 text-sm mt-10">
                                You've seen all {allServices.length} services
                            </p>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}

export default Services;
