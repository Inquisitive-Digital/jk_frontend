import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Loader2, Calendar, User, ArrowRight } from 'lucide-react';
import { blogAPI, getImageUrl } from '../Utils/api';
import BlogCardSkeleton from '../Components/extras/BlogCardSkeleton';

const BASE_URL = 'https://jkexecutivechauffeurs.com';

const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
    ],
};

const ITEMS_PER_PAGE = 12;

function Blog() {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['blogs'],
        queryFn: ({ pageParam = 1 }) => blogAPI.getAll(pageParam, ITEMS_PER_PAGE),
        getNextPageParam: (lastPage) => {
            if (lastPage.currentPage < lastPage.totalPages) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
    });

    // Flatten all pages into a single blogs array
    const blogs = data?.pages?.flatMap((page) => page.blogs) || [];

    // Sentinel ref for IntersectionObserver
    const sentinelRef = useRef(null);

    const handleObserver = useCallback(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(handleObserver, {
            rootMargin: '200px',
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [handleObserver]);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const blogFeedSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'JK Executive Chauffeurs Blog',
        description:
            'Stay updated with the latest from JK Executive Chauffeurs — events, tips, and luxury travel insights.',
        url: `${BASE_URL}/blog`,
        publisher: {
            '@type': 'Organization',
            name: 'JK Executive Chauffeurs',
            url: BASE_URL,
        },
        blogPost: blogs.map((blog) => ({
            '@type': 'BlogPosting',
            headline: blog.title,
            image: getImageUrl(blog.heroImage?.url || blog.heroImageUrl),
            datePublished: blog.publishDate || blog.createdAt,
            dateModified: blog.updatedAt || blog.createdAt,
            author: {
                '@type': 'Person',
                name: blog.author || 'JK Executive Chauffeurs',
            },
            description: blog.excerpt || '',
            url: `${BASE_URL}/blog/${blog.slug}`,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `${BASE_URL}/blog/${blog.slug}`,
            },
        })),
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
                {blogs.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify(blogFeedSchema)}
                    </script>
                )}
                <title>Chauffeur Service Blog | JK Executive Chauffeurs</title>
                <meta name="description" content="Expert tips, travel guides & news from JK Executive Chauffeurs. Luxury travel in London made easy. Explore our latest chauffeur service articles." />
            </Helmet>
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section className="pt-36 md:pt-44 pb-12 md:pb-16 px-4 md:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs md:text-sm font-semibold uppercase tracking-[0.25em] mb-4"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        Our Blog
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5"
                    >
                        Latest News & Insights
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/50 max-w-2xl mx-auto text-base md:text-lg"
                    >
                        Stay updated with the latest from JK Executive Chauffeurs — events, tips, and luxury travel insights.
                    </motion.p>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="w-24 h-0.5 mx-auto mt-8"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    />
                </div>
            </section>

            {/* Blog Cards Grid */}
            <section className="pb-16 md:pb-24 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Initial Loading State */}
                    {isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                                <BlogCardSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {/* Error State */}
                    {isError && (
                        <div className="text-center py-20">
                            <p className="text-white/50 text-lg">Unable to load blog posts. Please try again later.</p>
                        </div>
                    )}

                    {/* Blog Grid */}
                    {!isLoading && blogs.length > 0 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {blogs.map((blog, index) => (
                                    <motion.div
                                        key={blog._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-50px' }}
                                        transition={{ duration: 0.5, delay: (index % ITEMS_PER_PAGE) * 0.05 }}
                                    >
                                        <Link to={`/blog/${blog.slug}`} className="block h-full group">
                                            <div
                                                className="h-full rounded-2xl overflow-hidden transition-all duration-500 flex flex-col"
                                                style={{
                                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.06)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.border = '1px solid rgba(215,183,94,0.3)';
                                                    e.currentTarget.style.transform = 'translateY(-6px)';
                                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'none';
                                                }}
                                            >
                                                {/* Image */}
                                                <div className="relative aspect-[16/10] overflow-hidden">
                                                    {getImageUrl(blog.heroImage?.url || blog.heroImageUrl) ? (
                                                        <img
                                                            src={getImageUrl(blog.heroImage?.url || blog.heroImageUrl)}
                                                            alt={blog.heroImage?.alt || blog.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full flex items-center justify-center"
                                                            style={{ background: 'linear-gradient(135deg, rgba(40,40,40,1), rgba(60,50,30,1))' }}
                                                        >
                                                            <span className="text-white/20 text-5xl font-bold">JK</span>
                                                        </div>
                                                    )}


                                                </div>

                                                {/* Content */}
                                                <div className="p-5 md:p-6 flex-1 flex flex-col">
                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 mb-3 text-xs text-white/40">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(blog.publishDate || blog.createdAt)}
                                                        </span>
                                                        {blog.author && (
                                                            <span className="flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                {blog.author}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                                        {blog.title}
                                                    </h3>

                                                    {/* Excerpt */}
                                                    {blog.excerpt && (
                                                        <p className="text-white/50 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                                                            {blog.excerpt}
                                                        </p>
                                                    )}

                                                    {/* Read More */}
                                                    <div
                                                        className="flex items-center gap-2 text-sm font-medium mt-auto transition-all duration-300 group-hover:gap-3"
                                                        style={{ color: 'var(--color-primary)' }}
                                                    >
                                                        Read More
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Infinite Scroll Sentinel + Loading Indicator */}
                            <div className="py-12">
                                {/* Sentinel is hidden but triggers loading */}
                                <div ref={sentinelRef} className="h-px w-full" />

                                {isFetchingNextPage && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
                                        <BlogCardSkeleton />
                                        <BlogCardSkeleton />
                                        <BlogCardSkeleton />
                                    </div>
                                )}
                                {!hasNextPage && blogs.length > ITEMS_PER_PAGE && (
                                    <p className="text-center text-white/30 text-sm pt-8">You've reached the end — all blogs loaded.</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Empty State */}
                    {!isLoading && !isError && blogs.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-white/50 text-lg">No blog posts available yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </section>
            </main>
        </>
    );
}

export default Blog;
