import React from 'react';
import HeroSection from '../Components/home/HeroSection';
import ServicesSection from '../Components/home/ServicesSection';
import FleetSection from '../Components/home/FleetSection';
import WhySetsUsApart from '../Components/home/WhySetsUsApart';
import TestimonialsSection from '../Components/home/TestimonialsSection';
import FAQSection from '../Components/home/FAQSection';

function Home() {
    return (
        <main style={{ backgroundColor: 'var(--color-dark)' }}>
            <HeroSection />
            <ServicesSection />
            <WhySetsUsApart />
            <TestimonialsSection />
            <FleetSection />
            <FAQSection />
        </main>
    );
}

export default Home;
