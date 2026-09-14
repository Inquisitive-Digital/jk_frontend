import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Users, Briefcase, CheckCircle2, ChevronLeft, ChevronRight,
    Loader2, Shield, Star, ArrowRight, Check, Zap, Wifi
} from 'lucide-react';
import { fleetAPI, getImageUrl } from '../Utils/api';
import Analytics from '../Utils/analytics';
import InlineFAQSection from '../Components/home/InlineFAQSection';

const BASE_URL = 'https://jkexecutivechauffeurs.com';

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

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Our Fleet', item: `${BASE_URL}/fleet` },
            { '@type': 'ListItem', position: 3, name: fleet.title, item: `${BASE_URL}/fleet/${fleet.slug}` },
        ],
    };

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>
            <Helmet>
                <title>{fleet.seoTitle || fleet.title}</title>
                <meta name="description" content={fleet.seoDescription || fleet.description} />
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
                {fleet.faqs && fleet.faqs.length > 0 && (
                    <script type="application/ld+json">
                        {JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'FAQPage',
                            mainEntity: fleet.faqs.map((f) => ({
                                '@type': 'Question',
                                name: f.question,
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: f.answer,
                                },
                            })),
                        })}
                    </script>
                )}
            </Helmet>
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
                                {fleet.title}  Chauffeur London
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
                                        src={getImageUrl(allImages[activeImage]?.url, 'https://placehold.co/800x500?text=Vehicle')}
                                        alt={fleet.title}
                                        className="w-full h-full object-cover"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/800x500?text=Vehicle';
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
                                                src={getImageUrl(img?.url)}
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
                            {/* Horizontal Vehicle Capacity */}
                            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 py-2 border-b border-white/5 mb-4">
                                <div className="flex items-center gap-2 text-white/80">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium">{fleet.passengers || '4'} Passengers</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/80">
                                    <Briefcase className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium">{fleet.luggage || '2'} Suitcases</span>
                                </div>
                                {fleet.features && fleet.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-white/80">
                                        <Zap className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Static Highlights & Pricing Section (Native Dark Mode) */}
                            (
                            <div className="rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 mb-6 mt-4 border border-white/5" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                {/* Left: Highlights */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-6">Service Highlights</h3>
                                    <ul className="space-y-4">
                                        {[
                                            "First class chauffeur",
                                            "Free 60 mins airport parking",
                                            "Free 60 mins waiting time for airport pickups, 15 mins for all others",
                                            "Includes meet & greet",
                                            "Free cancellation"
                                        ].map((text, i) => (
                                            <li key={i} className="flex items-start gap-4">
                                                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10">
                                                    <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                                                </div>
                                                <span className="text-white/80 text-sm md:text-base leading-relaxed">{text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Right: Pricing Box */}
                                <div className="w-full md:w-[380px] bg-[#141414] rounded-xl p-7 border border-white/10 flex flex-col relative overflow-hidden">
                                    {/* Optional decorative glow */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-5 blur-[50px] rounded-full"></div>

                                    <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                        Pricing Options
                                    </h3>

                                    {fleet.pricingOptions && fleet.pricingOptions.length > 0 ? (
                                        <>
                                            <div className="space-y-4 flex-1 relative z-10">
                                                {fleet.pricingOptions.map((opt, i) => (
                                                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                                        <span className="text-white/60 text-sm">{opt.label}</span>
                                                        <span className="text-white font-bold text-base">{opt.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-white/40 text-xs italic mt-5 mb-5 relative z-10">Prices subject to VAT</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-4 flex-1 relative z-10">
                                                {[
                                                    { label: 'Hourly rate (minimum 3 hours)', price: '£75' },
                                                    { label: 'Day rate (8 hours)', price: '£600' },
                                                    { label: 'Heathrow to Central London', price: '£180' }
                                                ].map((opt, i) => (
                                                    <div key={i} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                                        <span className="text-white/60 text-sm">{opt.label}</span>
                                                        <span className="text-white font-bold text-base">{opt.price}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-white/40 text-xs italic mt-5 mb-5 relative z-10">Prices subject to VAT</p>
                                        </>
                                    )}

                                    <button
                                        onClick={() => {
                                            Analytics.trackBookingClick('fleet_detail_book_now', { vehicle_name: fleet.title });
                                            navigate('/booking');
                                        }}
                                        className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 relative z-10 hover:opacity-90"
                                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                                    >
                                        GET A PRICE &amp; BOOK
                                    </button>
                                </div>
                            </div>
                            )

                            {/* Short Description */}
                            <div
                                className="p-6 rounded-xl"
                                style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                            >
                                <p className="text-white/70 text-base leading-relaxed">
                                    {fleet.description}
                                </p>
                            </div>

                            {/* Long Description & Structured Sections */}
                            {(fleet.sections && fleet.sections.length > 0) ? (
                                <div className="space-y-8">
                                    {fleet.sections.map((section, index) => (
                                        <div key={index} className="fleet-section">
                                            {/* Section Heading (H2) */}
                                            {section.heading && (
                                                <h2
                                                    className="text-xl md:text-2xl font-semibold mb-4"
                                                    style={{ color: 'var(--color-primary)' }}
                                                >
                                                    {section.heading}
                                                </h2>
                                            )}

                                            {/* Legacy flat subheading */}
                                            {section.subheading && (
                                                <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">
                                                    {section.subheading}
                                                </h3>
                                            )}

                                            {/* Legacy flat text */}
                                            {section.text && (
                                                <div
                                                    className="fleet-section-text text-sm md:text-base leading-relaxed mb-4"
                                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: section.text.includes('<')
                                                            ? section.text
                                                            : section.text.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('')
                                                    }}
                                                />
                                            )}

                                            {/* Legacy flat list items */}
                                            {section.listItems && section.listItems.length > 0 && (
                                                <ul
                                                    className="ml-5 mb-5 space-y-2"
                                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                >
                                                    {section.listItems.map((item, i) => (
                                                        <li
                                                            key={i}
                                                            className="list-disc text-sm md:text-base leading-relaxed"
                                                            dangerouslySetInnerHTML={{ __html: item }}
                                                        />
                                                    ))}
                                                </ul>
                                            )}

                                            {/* Subsections — H3 blocks with text + bullets */}
                                            {section.subsections && section.subsections.length > 0 && (
                                                <div className="space-y-6 mt-4">
                                                    {section.subsections.map((sub, subIdx) => (
                                                        <div key={subIdx} className="subsection-block">
                                                            {sub.subheading && (
                                                                <h3 className="text-lg md:text-xl font-semibold mb-2 text-white">
                                                                    {sub.subheading}
                                                                </h3>
                                                            )}
                                                            {sub.text && (
                                                                <div
                                                                    className="fleet-section-text text-sm md:text-base leading-relaxed mb-3"
                                                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: sub.text.includes('<')
                                                                            ? sub.text
                                                                            : sub.text.split('\n').filter(l => l.trim()).map(l => `<p>${l}</p>`).join('')
                                                                    }}
                                                                />
                                                            )}
                                                            {sub.listItems && sub.listItems.length > 0 && (
                                                                <ul
                                                                    className="ml-5 mb-3 space-y-2"
                                                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                                                >
                                                                    {sub.listItems.map((item, i) => (
                                                                        <li
                                                                            key={i}
                                                                            className="list-disc text-sm md:text-base leading-relaxed"
                                                                            dangerouslySetInnerHTML={{ __html: item }}
                                                                        />
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Section Inline Image */}
                                            {section.image?.url && (
                                                <img
                                                    src={getImageUrl(section.image.url)}
                                                    alt={section.image.alt || section.heading || 'Fleet image'}
                                                    className="w-full rounded-xl my-6"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                fleet.longDescription && (
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
                                )
                            )}

                            {/* Inline styles for any <a> tags inside text fields */}
                            <style>{`
                                .fleet-section-text {
                                    word-break: break-word;
                                    overflow-wrap: break-word;
                                    max-width: 100%;
                                }
                                .fleet-section-text * {
                                    max-width: 100% !important;
                                    box-sizing: border-box !important;
                                }
                                .fleet-section-text a {
                                    color: var(--color-primary);
                                    text-decoration: underline;
                                    text-underline-offset: 2px;
                                    transition: opacity 0.2s;
                                }
                                .fleet-section-text a:hover {
                                    opacity: 0.8;
                                }
                                .fleet-section-text b, .fleet-section-text strong {
                                    color: white;
                                    font-weight: 600;
                                }
                            `}</style>



                        </motion.div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="space-y-6">
                        {/* Need a Chauffeur Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="rounded-xl p-8 sticky top-28 border border-white/5"
                            style={{ backgroundColor: '#1a1a1a' }}
                        >
                            <h3 className="text-xl font-bold text-white mb-4">
                                Need a Chauffeur?
                            </h3>
                            <p className="text-white/70 text-sm leading-relaxed mb-6">
                                Book our luxury chauffeur service for your next journey. Professional drivers, premium vehicles, impeccable service.
                            </p>

                            <div className="w-12 h-[2px] mb-6" style={{ backgroundColor: 'var(--color-primary)' }}></div>

                            <button
                                onClick={() => {
                                    Analytics.trackBookingClick('fleet_detail_book_now', { vehicle_name: fleet.title });
                                    navigate('/booking');
                                }}
                                className="w-full py-3.5 rounded-lg text-sm font-bold tracking-wider transition-all duration-300 mb-8 uppercase hover:opacity-90 shadow-[0_0_15px_rgba(215,183,94,0.15)]"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                            >
                                BOOK NOW
                            </button>

                            <div className="space-y-4">
                                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                                <Link to="/fleet" className="block text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors">
                                    <span style={{ color: 'var(--color-primary)' }}>→</span> Our Fleet
                                </Link>
                                <Link to="/services" className="block text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors">
                                    <span style={{ color: 'var(--color-primary)' }}>→</span> Airport Transfers
                                </Link>
                                <Link to="/services" className="block text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors">
                                    <span style={{ color: 'var(--color-primary)' }}>→</span> Event Chauffeur
                                </Link>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                <p className="text-white/40 text-xs mb-2">Or call us directly</p>
                                <a href="tel:+442034759906" className="text-lg font-bold transition-opacity hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                                    +44 203 475 9906
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Per-Fleet FAQ Section — only shown when FAQs exist */}
            {fleet.faqs && fleet.faqs.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 md:px-8 pb-10">
                    <InlineFAQSection faqs={fleet.faqs} />
                </div>
            )}
        </main>
    );
}

export default FleetDetail;
