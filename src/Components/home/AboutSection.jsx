import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Analytics from '../../Utils/analytics';
import { fleetAPI, getImageUrl } from '../../Utils/api';

function AboutSection() {
    const { data: fleetResponse, isLoading } = useQuery({
        queryKey: ["home-fleet"],
        queryFn: () => fleetAPI.getAll(1, 20),
        staleTime: 10 * 60 * 1000,
    });

    const fleetVehicles = fleetResponse?.fleet || [];

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        }
    };

    const pillarsVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.1, duration: 0.5, ease: 'easeOut' }
        })
    };

    const handleCTAClick = () => {
        Analytics.trackBookingClick('about_section_discover_services');
    };

    // Trust strip data in the 2x2 grid
    const trustData = [
        { title: '10+', desc: 'Years of Excellence' },
        { title: '5000+', desc: 'Journeys Completed' },
        { title: '50+', desc: 'Premium Vehicles' },
        { title: '24 / 7', desc: 'Available' }
    ];

    return (
        <section 
            className="relative overflow-hidden py-8 md:py-10" 
            style={{ backgroundColor: 'var(--color-dark)' }}
            id="about"
        >
            {/* subtle diagonal gold stripe background effect */}
            <div className="absolute top-[-200px] right-[-300px] w-[700px] h-[900px] bg-gradient-to-br from-transparent from-40% to-[rgba(201,168,76,0.04)] rotate-[15deg] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-white/80">
                
                {/* Section Header - Left aligned to match other homepage sections */}
                <div className="mb-10">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
                        style={{ color: 'var(--color-primary)' }}
                    >
                        About JK Executive Chauffeurs
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-light text-white uppercase"
                    >
                        LONDON'S PREMIER{' '}
                        <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                            CHAUFFEUR
                        </span>{' '}
                        SERVICE, REDEFINED
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    
                    {/* LEFT: IMAGE BLOCK */}
                    <motion.div 
                        className="relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0"
                        variants={fadeUpVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        {/* offset decorative border */}
                        <div className="absolute top-[20px] left-[-20px] right-[20px] bottom-[-20px] border border-[rgba(201,168,76,0.15)] z-0 hidden sm:block"></div>

                        <div className="relative w-full bg-[#2E2E2E] overflow-hidden z-10 group rounded-xl">
                            {isLoading ? (
                                <div className="w-full h-[300px] bg-white/5 animate-pulse flex items-center justify-center">
                                    <p className="text-white/40 text-sm">Loading vehicle...</p>
                                </div>
                            ) : fleetVehicles.length > 0 ? (
                                <img
                                    src={getImageUrl(fleetVehicles[0]?.image?.url || fleetVehicles[0]?.heroImage?.url)}
                                    alt={fleetVehicles[0]?.title || 'JK Executive Chauffeurs luxury fleet'}
                                    className="w-full h-auto object-cover grayscale-[0.2] brightness-[0.85] transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                                    onError={(e) => {
                                        e.target.src = "https://placehold.co/800x600?text=JK+Executive+Fleet";
                                    }}
                                />
                            ) : (
                                <img
                                    src="https://placehold.co/800x600?text=JK+Executive+Fleet"
                                    alt="JK Executive Chauffeurs luxury fleet"
                                    className="w-full h-auto object-cover grayscale-[0.2] brightness-[0.85] transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]"
                                />
                            )}
                            {/* gold border accent */}
                            <div className="absolute inset-0 border border-[rgba(201,168,76,0.25)] pointer-events-none rounded-xl"></div>
                        </div>
                        
                        <div className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 z-20 bg-[#C9A84C] text-[#0A0A0A] w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] rounded-full flex flex-col items-center justify-center text-center p-2.5 shadow-lg">
                            <span className="text-[2rem] sm:text-[2.4rem] font-semibold leading-none">
                                10<span className="text-[1.2rem] sm:text-[1.4rem]">+</span>
                            </span>
                            <span className="text-[0.45rem] sm:text-[0.55rem] font-semibold tracking-[0.12em] uppercase mt-1 leading-[1.4]">
                                Years of Excellence
                            </span>
                        </div>
                    </motion.div>

                    {/* RIGHT: CONTENT */}
                    <div className="relative mt-8 lg:mt-0">
                        <motion.p 
                            className="text-[0.95rem] font-light leading-[1.9] text-white/80 mb-5"
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                        >
                            At JK Executive Chauffeurs, we believe that the journey is as important as the destination. Since our founding, we have set the standard for professional chauffeured travel across London and beyond.
                        </motion.p>

                        <motion.p 
                            className="text-[0.85rem] font-light leading-[1.95] text-white/60 mb-10"
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-100px' }}
                        >
                            Every transfer we undertake is a commitment to punctuality, discretion, and impeccable service. Our meticulously maintained fleet of luxury vehicles, paired with highly trained and experienced chauffeurs, ensures that every client — whether a business executive, VIP guest, or discerning traveller — arrives in absolute comfort and style.
                            <br/><br/>
                            From corporate travel and airport transfers to special occasions and private tours, JK Executive Chauffeurs delivers a seamless, door-to-door experience tailored to your exact requirements.
                        </motion.p>

                        {/* Trust Strip Data in 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-12 sm:gap-y-10 mb-14 mt-6">
                            {trustData.map((item, index) => (
                                <motion.div 
                                    className="border-l-[1.5px] border-[#C9A84C]/50 pl-4 sm:pl-6" 
                                    key={index}
                                    variants={pillarsVariants}
                                    custom={index}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-50px' }}
                                >
                                    <div className="text-[1.8rem] sm:text-[2.2rem] font-medium text-[#C9A84C] leading-none mb-2">{item.title}</div>
                                    <div className="text-[0.65rem] sm:text-[0.7rem] font-semibold tracking-[0.15em] uppercase text-white/60">{item.desc}</div>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            variants={fadeUpVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                        >
                            <Link 
                                to="/services" 
                                className="group inline-flex items-center gap-4 no-underline text-[#C9A84C] text-[0.7rem] font-semibold tracking-[0.2em] uppercase border-b border-[rgba(201,168,76,0.3)] pb-1.5 transition-all duration-300 hover:gap-6 hover:border-[#C9A84C] w-fit"
                                onClick={handleCTAClick}
                            >
                                Discover Our Services
                                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default AboutSection;
