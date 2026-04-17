import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { blogAPI, getImageUrl } from '../../Utils/api';
import ServiceCardSkeleton from '../extras/ServiceCardSkeleton';

function BlogSection() {
    const scrollRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Fetch first 3 blogs
    const { data: blogResponse, isLoading } = useQuery({
        queryKey: ['home-blogs'],
        queryFn: () => blogAPI.getAll(1, 3),
        staleTime: 10 * 60 * 1000,
    });

    const blogs = blogResponse?.blogs || [];

    // Check scroll position for mobile/carousel
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            scrollEl.addEventListener('scroll', checkScroll);
            return () => scrollEl.removeEventListener('scroll', checkScroll);
        }
    }, [blogs.length]);

    // Scroll by cards
    const scroll = (direction) => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.querySelector('.blog-card')?.offsetWidth || 400;
            const gap = 24;
            const scrollAmount = (cardWidth + gap);
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <section className="py-12 md:py-16" style={{ backgroundColor: 'var(--color-dark)' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            Insights & News
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
                        >
                            LATEST <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>UPDATES</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-white/60 mt-3 max-w-xl"
                        >
                            Stay updated with our latest travels and luxury chauffeur insights
                        </motion.p>
                    </div>

                    {/* Navigation Arrows - Desktop Only (if more than 3) */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/blog"
                            className="flex items-center gap-2 text-sm font-medium mr-4 hover:underline transition-all"
                            style={{ color: 'var(--color-primary)' }}
                        >
                            VIEW ALL <ArrowRight className="w-4 h-4" />
                        </Link>
                        {blogs.length > 3 && (
                            <>
                                <button
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                                    style={{
                                        borderColor: canScrollLeft ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                        color: canScrollLeft ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                        cursor: canScrollLeft ? 'pointer' : 'not-allowed',
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
                                    style={{
                                        borderColor: canScrollRight ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                                        color: canScrollRight ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)',
                                        cursor: canScrollRight ? 'pointer' : 'not-allowed',
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex gap-6 overflow-x-hidden pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                        {[0, 1, 2].map((i) => (
                            <ServiceCardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Blogs Grid/Carousel */}
                {!isLoading && blogs.length > 0 && (
                    <div
                        ref={scrollRef}
                        className="flex gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide snap-x snap-proximity pb-4 -mx-4 px-4 md:mx-0 md:px-0"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                        }}
                    >
                        {blogs.map((blog, index) => (
                            <motion.div
                                key={blog._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="blog-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)] snap-center"
                            >
                                <Link to={`/blog/${blog.slug}`} className="block h-full">
                                    <div className="group cursor-pointer h-full flex flex-col transition-transform duration-500 hover:-translate-y-2">
                                        {/* Image Container */}
                                        <div className="relative aspect-[16/10] rounded-t-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={getImageUrl(blog.heroImage?.url || blog.heroImageUrl)}
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/600x400?text=JK+Executive+Blog';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                                        </div>

                                        {/* Content */}
                                        <div
                                            className="p-5 rounded-b-xl flex flex-col flex-grow"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        >
                                            <div className="flex items-center gap-2 mb-3 text-white/40 text-[11px] uppercase tracking-wider font-medium">
                                                <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                                                <span>{formatDate(blog.publishDate || blog.createdAt)}</span>
                                            </div>

                                            <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors mb-3 line-clamp-2">
                                                {blog.title}
                                            </h3>

                                            <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                                {blog.excerpt || blog.intro}
                                            </p>

                                            {/* Read More Link */}
                                            <div className="inline-flex items-center gap-2 text-xs font-semibold pt-4 mt-auto border-t border-white/5 group/link">
                                                <span
                                                    className="uppercase tracking-widest"
                                                    style={{ color: 'var(--color-primary)' }}
                                                >
                                                    READ ARTICLE
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
                )}

                {/* View All button for mobile */}
                <div className="flex md:hidden justify-center mt-6">
                    <Link
                        to="/blog"
                        className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border border-white/10 hover:bg-white/5"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        VIEW ALL BLOGS
                    </Link>
                </div>
            </div>

            {/* Custom CSS for hiding scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            {/* Bottom Border */}
            <div className="hidden md:flex justify-center mt-8">
                <div className="w-[80%] h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
        </section>
    );
}

export default BlogSection;

