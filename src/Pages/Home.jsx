import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '../Components/home/HeroSection';
import AboutSection from '../Components/home/AboutSection';
import ServicesSection from '../Components/home/ServicesSection';
import FleetSection from '../Components/home/FleetSection';
import WhySetsUsApart from '../Components/home/WhySetsUsApart';
import TestimonialsSection from '../Components/home/TestimonialsSection';
import FAQSection from '../Components/home/FAQSection';
import BlogSection from '../Components/home/BlogSection';
import QuoteSuccessModal from '../Components/booking/QuoteSuccessModal';

const BASE_URL = 'https://jkexecutivechauffeurs.com';

const taxiServiceSchema = {
    '@context': 'https://schema.org',
    '@type': ['TaxiService', 'LocalBusiness'],
    name: 'JK Executive Chauffeurs',
    description: 'Premium executive chauffeur service in London. Airport transfers, corporate travel, wedding cars & events. Mercedes S-Class, V-Class, Rolls-Royce fleet. Available 24/7.',
    url: 'https://www.jkexecutivechauffeurs.com',
    logo: 'https://www.jkexecutivechauffeurs.com/assets/JkLogo-DofcZZYI.png',
    image: 'https://www.jkexecutivechauffeurs.com/assets/heroImage-B2GGPHyc.png',
    telephone: '+442034759906',
    email: 'info@jkexecutivechauffeurs.com',
    vatID: '280189982',
    legalName: 'JK Executive Chauffeurs Ltd',
    identifier: [
        { '@type': 'PropertyValue', name: 'Companies House Registration', value: '10696876' },
        { '@type': 'PropertyValue', name: 'TfL Private Hire Operator Licence', value: '[ 010468 ]' },
    ],
    address: {
        '@type': 'PostalAddress',
        streetAddress: '1 Furzeground Way, Stockley Park',
        addressLocality: 'Uxbridge',
        addressRegion: 'Middlesex',
        postalCode: 'UB11 1BD',
        addressCountry: 'GB',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.5074,
        longitude: -0.4593,
    },
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
    },
    areaServed: [
        { '@type': 'City', name: 'London' },
        { '@type': 'Airport', name: 'Heathrow Airport', iataCode: 'LHR' },
        { '@type': 'Airport', name: 'Gatwick Airport', iataCode: 'LGW' },
        { '@type': 'Airport', name: 'Stansted Airport', iataCode: 'STN' },
        { '@type': 'Airport', name: 'London City Airport', iataCode: 'LCY' },
        { '@type': 'Airport', name: 'Luton Airport', iataCode: 'LTN' },
    ],
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Executive Chauffeur Services',
        itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airport Transfer Service' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Corporate Chauffeur Service' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Wedding Chauffeur Service' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Hourly As-Directed Chauffeur' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private Aviation Chauffeur' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Intercity Chauffeur Service' } },
        ],
    },
    paymentAccepted: 'Cash, Credit Card, Debit Card, PayPal, RuPay',
    currenciesAccepted: 'GBP',
    numberOfEmployees: { '@type': 'QuantitativeValue', value: 120 },
    sameAs: [
        'https://www.facebook.com/profile.php?id=61581449520001',
        'https://www.instagram.com/jkexecutivechauffeurs?igsh=NnFwN3B0d2Q0NHZk',
        'https://www.linkedin.com/company/jk-executive-chauffeurs',
        'https://share.google/09Kot2PXaujfkjnBQ',
    ],
};

const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JK Executive Chauffeurs',
    url: 'https://www.jkexecutivechauffeurs.com',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.jkexecutivechauffeurs.com/?s={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
};

const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
        {
            '@type': 'Question',
            name: 'What is an Executive Car Hire in London?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Executive car hire in London provides a premium, chauffeur-driven alternative to standard taxis and private hire cars. It is designed for business travel, airport transfers, corporate meetings, events and clients who value comfort, punctuality and professional service.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the best chauffeur company in London?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The best chauffeur company in London should offer experienced professional chauffeurs, a premium vehicle fleet, reliable bookings, excellent customer service and a strong understanding of London\'s roads and travel requirements. JK Executive Chauffeurs provides luxury chauffeur services for corporate, airport and private travel.',
            },
        },
        {
            '@type': 'Question',
            name: 'What does an Executive Chauffeur Service in London include?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'An executive chauffeur service in London typically includes a professional chauffeur, luxury vehicle, pre-arranged collection, door-to-door travel and a comfortable, discreet journey. Depending on the booking, services can also include airport meet and greet, flight monitoring and corporate travel support.',
            },
        },
        {
            '@type': 'Question',
            name: 'Why choose an Executive Car Service in London instead of a taxi?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'An executive car service in London offers a more personalised and premium travel experience than a standard taxi. You can pre-book your journey, select an executive vehicle and travel with a professional chauffeur who focuses on punctuality, comfort and discretion.',
            },
        },
        {
            '@type': 'Question',
            name: 'What is the difference between a chauffeur and a taxi driver?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'A chauffeur generally provides a more personalised and professional private transport experience, with journeys booked in advance and a greater focus on service, comfort and discretion. A taxi driver primarily provides point-to-point transport, often through street hailing, taxi ranks or taxi-booking services.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I hire a driver for a day in London?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes, you can hire a professional chauffeur for a full day in London. This can be useful for business meetings, multiple appointments, sightseeing, shopping trips, events or when you need flexible transportation throughout the day.',
            },
        },
        {
            '@type': 'Question',
            name: 'How much does executive car hire in London cost?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'The cost of executive car hire in London depends on factors such as the vehicle selected, journey distance, duration, collection location, waiting time and type of service. For an accurate price, it is best to provide your journey details when requesting a quotation.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I book an executive chauffeur service in London for business meetings?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. An executive chauffeur service is ideal for business meetings, conferences, corporate events and multiple appointments across London. A pre-booked chauffeur allows you to travel comfortably while keeping your journey organised around your schedule.',
            },
        },
        {
            '@type': 'Question',
            name: 'What cars are available with an executive car service in London?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Executive car services can offer a range of premium vehicles, from luxury saloons and executive cars to larger vehicles for families and groups. JK Executive Chauffeurs offers a premium fleet suitable for airport transfers, corporate travel, events and private journeys.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I book an executive car hire from London airports?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Executive car hire can be arranged for airport pick-ups and drop-offs across London\'s major airports, including Heathrow, Gatwick, Stansted, Luton and London City Airport. Airport chauffeur services can provide pre-arranged collection and a comfortable transfer to your destination.',
            },
        },
        {
            '@type': 'Question',
            name: 'Is an executive chauffeur service in London available for airport transfers?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. An executive chauffeur service in London can be booked for airport transfers, whether you are travelling to or from an airport. This is particularly useful for business travellers and passengers who want a reliable, comfortable alternative to standard airport transport.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I book an executive car service in London for special occasions?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. An executive car service can be booked for weddings, celebrations, private events, corporate functions and other special occasions. You can choose a suitable luxury vehicle based on your requirements and number of passengers.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I hire a chauffeur for sightseeing around London?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. You can hire a chauffeur for private sightseeing around London, allowing you to visit multiple attractions without relying on taxis or public transport between stops. A chauffeur-driven service can provide a comfortable and convenient way to explore the city.',
            },
        },
        {
            '@type': 'Question',
            name: 'Can I hire a chauffeur for several hours instead of a single journey?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Chauffeur services can be arranged for several hours or for a full day, depending on your requirements. This option is useful when you have multiple appointments, meetings, shopping trips, events or destinations to visit.',
            },
        },
        {
            '@type': 'Question',
            name: 'How do I book an executive chauffeur service in London?',
            acceptedAnswer: {
                '@type': 'Answer',
                text: 'You can book an executive chauffeur service by providing your collection point, destination, date, time, passenger requirements and any additional travel details. The chauffeur company can then confirm availability and provide a quotation for your journey.',
            },
        },
    ],
};



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
                    {JSON.stringify(taxiServiceSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(webSiteSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(faqPageSchema)}
                </script>

                <title>Executive Car Hire London | Chauffeur Service & Airport Transfers</title>
                <meta name="description" content="Premium executive car hire & chauffeur service in London. Professional chauffeurs, luxury fleet, on-time airport transfers & corporate travel. Book now." />
            </Helmet>
            <main style={{ backgroundColor: 'var(--color-dark)' }}>
                <HeroSection />
                <AboutSection />

                <FleetSection />
                <ServicesSection />
                <WhySetsUsApart />
                <TestimonialsSection />
                <BlogSection />
                <FAQSection />
            </main>

            <QuoteSuccessModal isOpen={showSuccess} onClose={closeSuccessModal} />
        </>
    );
}

export default Home;
