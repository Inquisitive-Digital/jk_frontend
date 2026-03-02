import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { blogAPI } from '../Utils/api';

function BlogWrapper() {
    const { slug } = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['blog', slug],
        queryFn: () => blogAPI.getBySlug(slug),
        enabled: !!slug,
    });

    // First, get the total count of blogs with a minimal request
    const { data: countData } = useQuery({
        queryKey: ['blogsCount'],
        queryFn: () => blogAPI.getAll(1, 1), // Fetch just 1 blog to get total count
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    const totalBlogs = countData?.totalBlogs || countData?.total || 1000; // Fallback to 1000 if structure is different

    // Fetch all blogs dynamically based on total count (with caching to prevent multiple fetches)
    const { data: allBlogsData } = useQuery({
        queryKey: ['allBlogs', totalBlogs],
        queryFn: () => blogAPI.getAll(1, totalBlogs), // Fetch all blogs dynamically
        enabled: !!totalBlogs, // Only run when we know the total count
        staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
        refetchOnMount: false, // Don't refetch on component mount if data exists
    });

    const blog = data?.blog;
    const allBlogs = allBlogsData?.blogs || [];
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const getImageSrc = (imgObj) => {
        if (!imgObj?.url) return null;
        if (imgObj.url.startsWith('http')) return imgObj.url;
        return `${API_BASE}${imgObj.url}`;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Determine prev/next blogs
    const currentIndex = allBlogs.findIndex(b => b.slug === slug);
    const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null;
    const nextBlog = currentIndex >= 0 && currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null;


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

    // Error / Not Found
    if (isError || !blog) {
        return (
            <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
                <div className="flex flex-col items-center justify-center pt-44 pb-20 px-4">
                    <h2 className="text-2xl font-semibold text-white mb-4">Blog Post Not Found</h2>
                    <p className="text-white/50 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
            </main>
        );
    }

    const heroSrc = blog.heroImageUrl?.startsWith('http')
        ? blog.heroImageUrl
        : getImageSrc(blog.heroImage);

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }} >
            {/* Hero Image */}
            <div className="relative h-[45vh] md:h-[55vh] overflow-hidden ">
                {heroSrc ? (
                    <motion.img
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.2 }}
                        src={heroSrc}
                        alt={blog.heroImage?.alt || blog.heroImageAlt || blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{ background: 'linear-gradient(135deg, rgba(26,26,26,1) 0%, rgba(50,40,20,1) 100%)' }}
                    />
                )}



                {/* Title & Meta on Image */}
                <div className="absolute bottom-8 md:bottom-12 left-0 right-0 px-4 md:px-8 xl:px-10 xl:mx-10 2xl:mx-20 2xl:px-20">
                    <div className="max-w-7xl mx-auto">
                        {/* {blog.category && (
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="inline-block px-3 py-1 rounded-full text-xs font-base uppercase tracking-wider mb-4"
                                style={{
                                    backgroundColor: 'rgba(215,183,94,0.2)',
                                    color: 'var(--color-primary)',
                                    border: '1px solid rgba(215,183,94,0.3)',
                                }}
                            >
                                {blog.category}
                            </motion.span>
                        )} */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 "
                        >
                            {blog.title}
                        </motion.h1>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex items-center gap-4 text-sm text-white/50"
                        >
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {formatDate(blog.publishDate || blog.createdAt)}
                            </span>
                            {blog.author && (
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {blog.author}
                                </span>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Blog Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
                <div className="grid lg:grid-cols-3 gap-10 md:gap-16">
                    {/* Main Content — 2/3 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2"
                    >
                        {/* Introduction Text */}
                        {blog.intro && (
                            <p
                                className="text-base md:text-lg leading-relaxed mb-8"
                                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                dangerouslySetInnerHTML={{ __html: blog.intro }}
                            />
                        )}

                        {/* Structured Sections */}
                        {blog.sections && blog.sections.map((section, index) => (
                            <div key={index} className="mb-8">
                                {/* Section Heading (H2) */}
                                {section.heading && (
                                    <h2
                                        className="text-xl md:text-2xl font-semibold mb-3"
                                        style={{ color: 'var(--color-primary)' }}
                                    >
                                        {section.heading}
                                    </h2>
                                )}

                                {/* Section Subheading (H3) */}
                                {section.subheading && (
                                    <h3
                                        className="text-lg md:text-xl font-semibold mb-2 text-white"
                                    >
                                        {section.subheading}
                                    </h3>
                                )}

                                {/* Section Text (paragraphs) — supports <a> tags for internal linking */}
                                {section.text && (
                                    <div
                                        className="blog-section-text text-base leading-relaxed mb-4"
                                        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        dangerouslySetInnerHTML={{ __html: section.text }}
                                    />
                                )}

                                {/* Section List Items (bullet points) */}
                                {section.listItems && section.listItems.length > 0 && (
                                    <ul
                                        className="ml-5 mb-4 space-y-2"
                                        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    >
                                        {section.listItems.map((item, i) => (
                                            <li
                                                key={i}
                                                className="list-disc text-base leading-relaxed"
                                                dangerouslySetInnerHTML={{ __html: item }}
                                            />
                                        ))}
                                    </ul>
                                )}

                                {/* Section Inline Image */}
                                {section.image?.url && (
                                    <img
                                        src={section.image.url.startsWith('http') ? section.image.url : `${API_BASE}${section.image.url}`}
                                        alt={section.image.alt || section.heading || 'Blog image'}
                                        className="w-full rounded-xl my-4"
                                    />
                                )}
                            </div>
                        ))}

                        {/* Inline styles for any <a> tags inside text fields */}
                        <style>{`
                            .blog-section-text a {
                                color: var(--color-primary);
                                text-decoration: underline;
                                text-underline-offset: 2px;
                                transition: opacity 0.2s;
                            }
                            .blog-section-text a:hover {
                                opacity: 0.8;
                            }
                            .blog-section-text b, .blog-section-text strong {
                                color: white;
                                font-weight: 600;
                            }
                        `}</style>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-10 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 rounded-full text-xs"
                                            style={{
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                color: 'rgba(255,255,255,0.5)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                            }}
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>

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
                                Need a Chauffeur?
                            </h3>
                            <p className="text-white/50 text-sm leading-relaxed">
                                Book our luxury chauffeur service for your next journey. Professional drivers, premium vehicles, impeccable service.
                            </p>

                            <div
                                className="w-12 h-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-primary)' }}
                            />

                            <Link
                                to="/booking"
                                className="block w-full text-center px-6 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-dark)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(215,183,94,0.4)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Book Now
                            </Link>

                            <div
                                className="w-full h-px"
                                style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                            />

                            <div>
                                <h4 className="text-sm font-medium text-white mb-3">Quick Links</h4>
                                <div className="space-y-2">
                                    {[
                                        { label: 'Our Fleet', href: '/fleet' },
                                        { label: 'Airport Transfers', href: '/services/airport-chauffeur-service' },
                                        { label: 'Event Chauffeur', href: '/events/event-chauffeur-service' },
                                    ].map((link) => (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            className="block text-sm transition-colors duration-200"
                                            style={{ color: 'var(--color-primary)' }}
                                        >
                                            → {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-white/40 text-xs mb-1">Or call us directly</p>
                                <a
                                    href="tel:+442034759906"
                                    className="text-sm font-medium transition-colors"
                                    style={{ color: 'var(--color-primary)' }}
                                >
                                    +44 203 475 9906
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Prev/Next Blog Navigation */}
            {(prevBlog || nextBlog) && (
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
                    <div
                        className="rounded-2xl p-6 md:p-8  "
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.03) ',
                            border: '1px solid rgba(255,255,255,0.06)',
                        }}
                    >
                        <div className={`flex flex-col md:flex-row gap-6 ${prevBlog && nextBlog ? 'justify-between' : 'justify-center '}`}>
                            {/* Previous Blog */}
                            {prevBlog && (
                                <Link
                                    to={`/blog/${prevBlog.slug}`}
                                    className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${prevBlog && nextBlog ? 'md:w-[48%]' : 'md:w-content'
                                        }`}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(215,183,94,0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(215,183,94,0.2)';
                                        e.currentTarget.style.transform = 'translateX(-4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
                                        style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}
                                    >
                                        <ChevronLeft className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Previous</p>
                                        <h4 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                            {prevBlog.title}
                                        </h4>
                                    </div>
                                </Link>
                            )}

                            {/* Next Blog */}
                            {nextBlog && (
                                <Link
                                    to={`/blog/${nextBlog.slug}`}
                                    className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${prevBlog && nextBlog ? 'md:w-[48%]' : 'md:w-auto'
                                        }`}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(215,183,94,0.05)';
                                        e.currentTarget.style.borderColor = 'rgba(215,183,94,0.2)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    <div className="flex-1 min-w-0 text-right">
                                        <p className="text-xs text-white/40 mb-1 uppercase tracking-wider">Next</p>
                                        <h4 className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
                                            {nextBlog.title}
                                        </h4>
                                    </div>
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300"
                                        style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}
                                    >
                                        <ChevronRight className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom CTA */}
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
                        Read More <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Articles</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/50 mb-8"
                    >
                        Explore more insights from JK Executive Chauffeurs
                    </motion.p>
                    <Link
                        to="/blog"
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
                        View All Posts
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default BlogWrapper;
