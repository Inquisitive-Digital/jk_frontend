import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';
import HeroSection from '../Components/home/HeroSection';
import ServicesSection from '../Components/home/ServicesSection';
import FleetSection from '../Components/home/FleetSection';
import WhySetsUsApart from '../Components/home/WhySetsUsApart';
import TestimonialsSection from '../Components/home/TestimonialsSection';
import FAQSection from '../Components/home/FAQSection';
import BlogSection from '../Components/home/BlogSection';

const BASE_URL = 'https://jkexecutivechauffeurs.com';

const orgSchema = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': `${BASE_URL}/#organization`,
            name: 'JK Executive Chauffeurs',
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            telephone: '+442034759906',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Middlesex',
                addressRegion: 'London',
                addressCountry: 'GB',
            },
            sameAs: [
                'https://www.instagram.com/jkexecutivechauffeurs',
                'https://www.facebook.com/jkexecutivechauffeurs',
            ],
        },
        {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: 'JK Executive Chauffeurs',
            publisher: {
                '@id': `${BASE_URL}/#organization`,
            },
        },
        {
            '@type': 'LocalBusiness',
            '@id': `${BASE_URL}/#localbusiness`,
            name: 'JK Executive Chauffeurs',
            description:
                'London\'s premier executive chauffeur service offering airport transfers, corporate travel, weddings, and events across the UK.',
            url: BASE_URL,
            telephone: '+442034759906',
            priceRange: '££',
            image: `${BASE_URL}/logo.png`,
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Middlesex',
                addressRegion: 'London',
                addressCountry: 'GB',
            },
            geo: {
                '@type': 'GeoCoordinates',
                latitude: 51.4700,
                longitude: -0.4543,
            },
            openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                    'Monday', 'Tuesday', 'Wednesday', 'Thursday',
                    'Friday', 'Saturday', 'Sunday',
                ],
                opens: '00:00',
                closes: '23:59',
            },
            areaServed: {
                '@type': 'Place',
                name: 'London, United Kingdom',
            },
        },
    ],
};

function QuoteSuccessModal({ isOpen, onClose }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#141414] shadow-2xl"
                    >
                        {/* Decorative Gold Header */}
                        <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#D7B75E] to-transparent opacity-50" />
                        
                        <button 
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8 text-center">
                            <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-[#D7B75E]/10 border border-[#D7B75E]/30 flex items-center justify-center shadow-[0_0_40px_rgba(215,183,94,0.15)]">
                                <CheckCircle2 size={40} className="text-[#D7B75E]" />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Quote Sent Successfully!</h3>
                            <p className="text-white/60 text-sm leading-relaxed mb-8">
                                Your request has been received. Our team is now reviewing your requirements and will get back to you with a personalised quote shortly.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-xl bg-[#D7B75E] text-[#141414] font-bold text-sm tracking-widest uppercase hover:bg-[#c9a84c] transition-all shadow-[0_10px_30px_rgba(215,183,94,0.3)]"
                            >
                                Continue Browsing
                            </button>
                        </div>
                        
                        <div className="p-4 bg-white/5 border-t border-white/5">
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium text-center">JK Executive Chauffeurs • Premium Service</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const showSuccess = searchParams.get('quoteSuccess') === 'true';

    const closeSuccessModal = () => {
        searchParams.delete('quoteSuccess');
        setSearchParams(searchParams);
    };

    return (
        <>
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>

                <title>Chauffeur Service in London – Luxury Private Hire | JK Executive</title>
                <meta name="description" content="Book a luxury chauffeur service in London. Professional drivers, premium fleet & 24/7 availability. Airport transfers, corporate & wedding. Call now." />
            </Helmet>
            <main style={{ backgroundColor: 'var(--color-dark)' }}>
                <HeroSection />
                <ServicesSection />
                <WhySetsUsApart />
                <TestimonialsSection />
                <FleetSection />
                <BlogSection />
                <FAQSection />
            </main>

            <QuoteSuccessModal isOpen={showSuccess} onClose={closeSuccessModal} />
        </>
    );
}

export default Home;
