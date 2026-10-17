import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../Components/home/HeroSection';
import AboutSection from '../Components/home/AboutSection';
import ServicesSection from '../Components/home/ServicesSection';
import AirportsSection from '../Components/home/AirportsSection';
import FleetSection from '../Components/home/FleetSection';
import WhySetsUsApart from '../Components/home/WhySetsUsApart';
import TestimonialsSection from '../Components/home/TestimonialsSection';
import FAQSection from '../Components/home/FAQSection';
import BlogSection from '../Components/home/BlogSection';
import QuoteSuccessModal from '../Components/booking/QuoteSuccessModal';
import JsonLd from '../seo/JsonLd';
import { organizationSchema, faqSchema, webSiteSchema } from '../seo/schema';
import { homeFaqs } from '../data/homeFaqs';

function Home() {
    const [searchParams, setSearchParams] = useSearchParams();
    const showSuccess = searchParams.get('quoteSuccess') === 'true';

    const closeSuccessModal = () => {
        searchParams.delete('quoteSuccess');
        setSearchParams(searchParams);
    };

    return (
        <>
            <JsonLd data={[webSiteSchema(), organizationSchema(), faqSchema(homeFaqs)]} />
            <Helmet>
                <title>Executive Chauffeur Service London – Book 24/7 Today</title>
                <meta name="title" content="Executive Chauffeur Service London – Book 24/7 Today" />
                <meta property="og:title" content="Executive Chauffeur Service London – Book 24/7 Today" />
                <meta name="twitter:title" content="Executive Chauffeur Service London – Book 24/7 Today" />
                <meta name="description" content="Premium executive car hire & chauffeur service in London. Professional chauffeurs, luxury fleet, on-time airport transfers & corporate travel. Book now." />
            </Helmet>
            <main style={{ backgroundColor: 'var(--color-dark)' }}>
                <HeroSection />
                <AboutSection />

                <FleetSection />
                <ServicesSection />
                <AirportsSection />
                <WhySetsUsApart />
                <TestimonialsSection />
                <BlogSection />
                <FAQSection faqs={homeFaqs} />
            </main>

            <QuoteSuccessModal isOpen={showSuccess} onClose={closeSuccessModal} />
        </>
    );
}

export default Home;
