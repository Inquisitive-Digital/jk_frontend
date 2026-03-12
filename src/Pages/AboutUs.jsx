import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Shield, Users, Car, Award, Star, Clock,
    MapPin, CheckCircle, ArrowRight, Heart,
    Target, Gauge, Crown
} from 'lucide-react';
import Analytics from '../Utils/analytics';
import { fleetAPI, getImageUrl } from '../Utils/api';

function AboutUs() {
    const [fleetVehicles, setFleetVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fleetAPI.getAll(1, 3);
                setFleetVehicles(response.fleet || []);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, []);
    const values = [
        {
            icon: Crown,
            title: 'Excellence',
            description: 'Every journey reflects our commitment to the highest standards of luxury and professionalism.',
        },
        {
            icon: Shield,
            title: 'Safety First',
            description: 'Our chauffeurs are fully vetted, DBS checked, and trained to the highest safety standards.',
        },
        {
            icon: Clock,
            title: 'Punctuality',
            description: 'We respect your time. Flight tracking, route planning, and early arrivals are standard.',
        },
        {
            icon: Heart,
            title: 'Client Care',
            description: 'Your comfort and satisfaction drive everything we do. We treat every client like our only client.',
        },
        {
            icon: Target,
            title: 'Reliability',
            description: 'Rain or shine, day or night. We show up on time, every time. That\'s non-negotiable.',
        },
        {
            icon: Gauge,
            title: 'Discretion',
            description: 'Privacy is paramount. Our chauffeurs know when to talk and when silence is golden.',
        },
    ];

    const stats = [
        { number: '10+', label: 'Years of Excellence' },
        { number: '5000+', label: 'Journeys Completed' },
        { number: '50+', label: 'Premium Vehicles' },
        { number: '24/7', label: 'Available' },
    ];

    const whyChooseUs = [
        'Professional, uniformed chauffeurs',
        'Premium Mercedes-Benz and Range Rover fleet',
        'Real-time flight tracking for airport transfers',
        'Fixed pricing with no hidden surcharges',
        'Fully licensed, insured, and DBS checked',
        'Corporate accounts and monthly billing',
        'Event and wedding specialist services',
        'Nationwide and intercity coverage',
    ];

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>

            {/* Hero Section */}
            <section className="relative overflow-hidden" style={{ paddingTop: '140px', paddingBottom: '80px' }}>
                {/* Background Glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(215,183,94,0.06) 0%, transparent 70%)' }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <span
                            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                            style={{
                                backgroundColor: 'rgba(215,183,94,0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(215,183,94,0.2)',
                            }}
                        >
                            About Us
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            London's Premier{' '}
                            <span style={{ color: 'var(--color-primary)' }}>Executive</span>{' '}
                            Chauffeur Service
                        </h1>
                        <p className="text-white/50 text-base md:text-lg leading-relaxed">
                            <Link to="/" style={{ color: '#C5A54D', textDecoration: 'none' }}>JK Executive Chauffeurs</Link> provides first-class chauffeur services across London and the United Kingdom.
                            With over a decade of experience, we deliver luxury, safety, and punctuality for every journey — from
                            airport transfers and corporate travel to weddings and special events.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl p-8 md:p-10"
                    style={{
                        background: 'linear-gradient(135deg, rgba(215,183,94,0.08) 0%, rgba(215,183,94,0.02) 100%)',
                        border: '1px solid rgba(215,183,94,0.15)',
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

            {/* Our Story */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{
                                backgroundColor: 'rgba(215,183,94,0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(215,183,94,0.2)',
                            }}
                        >
                            Our Story
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                            Built on Trust,{' '}
                            <span style={{ color: 'var(--color-primary)' }}>Driven</span> by Perfection
                        </h2>
                        <div className="space-y-4 text-white/60 text-base leading-relaxed">
                            <p>
                                <Link to="/" style={{ color: '#C5A54D', textDecoration: 'none' }}>JK Executive Chauffeurs</Link> was founded with a simple vision: to redefine luxury ground transportation
                                in London. What started as a small operation with a single Mercedes has grown into one of London's
                                most trusted executive chauffeur services.
                            </p>
                            <p>
                                We understand that for our clients — whether they are CEOs, celebrities, diplomats, or families —
                                the journey is just as important as the destination. Every detail matters, from the temperature of
                                the cabin to the timing of the pickup.
                            </p>
                            <p>
                                Our fleet includes the finest vehicles from Mercedes-Benz, Range Rover, and Rolls Royce. Every car
                                is maintained to showroom standards. Every chauffeur is trained to deliver an experience, not just
                                a ride.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            {loading ? (
                                <div className="w-full h-[300px] bg-white/5 animate-pulse flex items-center justify-center">
                                    <p className="text-white/40 text-sm">Loading fleet...</p>
                                </div>
                            ) : fleetVehicles.length > 0 ? (
                                <img
                                    src={getImageUrl(fleetVehicles[0]?.image?.url || fleetVehicles[0]?.heroImage?.url)}
                                    alt={fleetVehicles[0]?.title || 'JK Executive Chauffeurs luxury fleet'}
                                    className="w-full h-auto object-cover"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/800x600?text=JK+Executive+Fleet";
                                    }}
                                />
                            ) : (
                                <img
                                    src="https://via.placeholder.com/800x600?text=JK+Executive+Fleet"
                                    alt="JK Executive Chauffeurs luxury fleet"
                                    className="w-full h-auto object-cover"
                                />
                            )}
                        </div>
                        {/* Decorative border */}
                        <div
                            className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl -z-10"
                            style={{ border: '1px solid rgba(215,183,94,0.2)' }}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Our Values */}
            <section
                className="py-16 md:py-24"
                style={{
                    background: 'linear-gradient(180deg, var(--color-dark) 0%, rgba(215,183,94,0.03) 50%, var(--color-dark) 100%)',
                }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{
                                backgroundColor: 'rgba(215,183,94,0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(215,183,94,0.2)',
                            }}
                        >
                            Our Values
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">
                            What <span style={{ color: 'var(--color-primary)' }}>Drives</span> Us
                        </h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className="rounded-xl p-6 transition-all duration-300 group"
                                style={{
                                    backgroundColor: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(215,183,94,0.25)';
                                    e.currentTarget.style.backgroundColor = 'rgba(215,183,94,0.04)';
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                                    style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}
                                >
                                    <value.icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                </div>
                                <h3 className="text-white font-semibold text-base mb-2">{value.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                            style={{
                                backgroundColor: 'rgba(215,183,94,0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(215,183,94,0.2)',
                            }}
                        >
                            Why Choose Us
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                            The <span style={{ color: 'var(--color-primary)' }}>JK Executive</span> Difference
                        </h2>

                        <div className="grid sm:grid-cols-2 gap-3">
                            {whyChooseUs.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -15 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                                    <span className="text-white/60 text-sm">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div
                            className="rounded-2xl p-8 md:p-10 text-center"
                            style={{
                                background: 'linear-gradient(135deg, rgba(215,183,94,0.08) 0%, rgba(215,183,94,0.02) 100%)',
                                border: '1px solid rgba(215,183,94,0.15)',
                            }}
                        >
                            <Award className="w-12 h-12 mx-auto mb-6" style={{ color: 'var(--color-primary)' }} />
                            <h3 className="text-xl font-semibold text-white mb-3">
                                Trusted by London's Elite
                            </h3>
                            <p className="text-white/50 text-sm leading-relaxed mb-6">
                                From FTSE 100 executives to international diplomats, our clients trust us
                                because we deliver flawless service, every single time.
                            </p>

                            {/* Star Rating */}
                            <div className="flex items-center justify-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" style={{ color: 'var(--color-primary)' }} />
                                ))}
                            </div>
                            <p className="text-white/40 text-xs">5.0 Average Rating</p>

                            <div
                                className="w-full h-px my-6"
                                style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
                            />

                            <Link
                                to="/booking"
                                onClick={() => Analytics.trackBookingClick('about_why_choose_us_book')}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300"
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-dark)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 25px rgba(215,183,94,0.4)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Book Your Chauffeur
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section
                className="py-16 md:py-20"
                style={{
                    background: 'linear-gradient(180deg, var(--color-dark) 0%, rgba(215,183,94,0.04) 50%, var(--color-dark) 100%)',
                }}
            >
                <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl md:text-3xl font-light text-white mb-4"
                    >
                        Ready to Experience the{' '}
                        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>Difference</span>?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-white/50 mb-8"
                    >
                        Contact us today and let us handle the journey while you focus on what matters.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            to="/contact"
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
                            Contact Us
                        </Link>
                        <Link
                            to="/booking"
                            onClick={() => Analytics.trackBookingClick('about_bottom_cta_book_now')}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300"
                            style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-dark)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow = '0 4px 25px rgba(215,183,94,0.4)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Book Now
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}

export default AboutUs;
