import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../Components/home/HeroSection';

// Lazy load below-the-fold components to reduce Total Blocking Time
const ServicesSection = lazy(() => import('../Components/home/ServicesSection'));
const FleetSection = lazy(() => import('../Components/home/FleetSection'));
const WhySetsUsApart = lazy(() => import('../Components/home/WhySetsUsApart'));
const TestimonialsSection = lazy(() => import('../Components/home/TestimonialsSection'));
const FAQSection = lazy(() => import('../Components/home/FAQSection'));
const BlogSection = lazy(() => import('../Components/home/BlogSection'));
const QuoteSuccessModal = lazy(() => import('../Components/booking/QuoteSuccessModal'));

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



function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const showSuccess = searchParams.get('quoteSuccess') === 'true';

    const stats = [
        { number: '10+', label: 'Years of Excellence' },
        { number: '5000+', label: 'Journeys Completed' },
        { number: '50+', label: 'Premium Vehicles' },
        { number: '24/7', label: 'Available' },
    ];

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

                {/* Stats Bar */}
                <section className="max-w-7xl mx-auto px-4 md:px-8 mb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl p-8 md:p-10"
                        style={{
                            background: '',
                            border: '',
                        }}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: 'var(--color-primary)' }}>
                                        {stat.number}
                                    </p>
                                    <p className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                <Suspense fallback={<div className="min-h-[1000px] bg-transparent"></div>}>
                    <FleetSection />
                    <ServicesSection />
                    <WhySetsUsApart />
                    <TestimonialsSection />
                    <BlogSection />
                    <FAQSection />
                </Suspense>
            </main>

            <Suspense fallback={null}>
                <QuoteSuccessModal isOpen={showSuccess} onClose={closeSuccessModal} />
            </Suspense>
        </>
    );
}

export default Home;
