import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../Components/home/HeroSection';
import ServicesSection from '../Components/home/ServicesSection';
import FleetSection from '../Components/home/FleetSection';
import WhySetsUsApart from '../Components/home/WhySetsUsApart';
import TestimonialsSection from '../Components/home/TestimonialsSection';
import FAQSection from '../Components/home/FAQSection';

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
                <FAQSection />
            </main>
        </>
    );
}

export default Home;
