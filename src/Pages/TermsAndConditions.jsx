import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FileText, ArrowLeft, Scale, Shield, Clock, CreditCard, AlertTriangle, Car } from 'lucide-react';

const sections = [
    {
        id: 'general',
        icon: Scale,
        title: '1. General',
        content: [
            'JK Executive Travel Ltd Trading as JK Executive Chauffeurs, we are Registered in England with Registration #10696876 and VAT Registration #280189982.',
            'JK Executive reserves the right to change T&Cs at any time for quality testing and development. Information is subject to change and will be displayed on the JK Executive\'s home page to notify users within 14 days of the new Terms & Conditions in place. Continued use of our website by the user agrees to comply with and be bound by the terms and conditions unless objectified. Further usage of JK Executive services is solely accepted by the user.',
            'Please note that loud music inside any of our vehicles is not permitted. This is for your safety and to avoid any distraction for the chauffeur driving you.',
            'Alcohol consumption is not allowed in our vehicles. Prior permission is required for alcohol in the car. The Customer is liable to pay for any damages caused as a result of any spilling on the seats or other vehicle surfaces.',
            'Under no circumstances are any drugs permitted. Our Chauffeur has the right to remove any passenger under the influence of drugs. Additionally, there will be no refunds, and the customer will bear all responsibility for the full trip.',
            'All of our chauffeur services are pre-booked, which means that the vehicle may have another job waiting after the existing trip. If more time is required for hourly bookings, it is at the chauffeur\'s discretion. Additional hours should be scheduled in advance to prevent any inconvenience.',
        ],
    },
    {
        id: 'contract',
        icon: FileText,
        title: '2. Contract of Service and Changes to Offers',
        content: [
            'All conditions of the contract apply to arranged services provided by JK Executive.',
        ],
        subsections: [
            {
                id: '2.1',
                title: '2.1 Additional Fees',
                text: 'Subsequent to the booking and start of the service, additional fees may occur, such as extra hours, additional stops, extra miles, waiting time, car parking, and address changes according to the latest price structure.',
            },
            {
                id: '2.2',
                title: '2.2 Hourly Bookings',
                text: 'All hourly bookings must end in the same city as the start of the service. Should it end in a different city, an additional charge may apply.',
            },
            {
                id: '2.3',
                title: '2.3 Vehicle Selection',
                text: 'Users can choose between our different types of class vehicles such as Executive Car, People Carrier, and Luxury Class. Users can choose vehicles from our Vehicles page on the JK Executive homepage. Images shown on our Vehicle page are in place to demonstrate the class of vehicles we provide. Given the opportunity, the user may choose to upgrade to a higher-class vehicle. Upon the availability of vehicles, the Class upgrade is free, but payment for the different categories will be charged accordingly. You can call JK Executive anytime to discuss the concerned matter.',
            },
            {
                id: '2.4',
                title: '2.4 Booking Times',
                text: 'For all vehicle bookings, we would require a minimum of 4 hours notice period.',
            },
            {
                id: '2.5',
                title: '2.5 Booking Areas',
                list: [
                    'For booking in London — booking must be at least 4-hours notice period.',
                    'For bookings outside London but within the UK — it must be at least 6-hours notice period.',
                    'For booking worldwide — booking must be at least 48 hours notice period.',
                ],
            },
            {
                id: '2.6',
                title: '2.6 Children',
                text: 'When booking for children, child seats must be requested in the comments section, including the age of the children and the type of seat needed.',
            },
            {
                id: '2.7',
                title: '2.7 Conveyance of Animals',
                text: 'If the Customer wants to bring animals on board, they must take prior permission before booking to make sure with the JK Executive and partners if they are willing to accept such a case. Guide dogs will not be refused. JK Executive\'s chauffeurs have the right to refuse to take animals (with the exception of guide dogs) that were not agreed upon.',
            },
            {
                id: '2.8',
                title: '2.8 Passengers and Luggage',
                text: 'The luggage capacity is shown on all of our Vehicle illustrations, as well as the seating capacity. While making a booking on the JK Executive website, any extra luggage will be charged additionally subject to the availability of the space. JK Executive has the right to refuse any luggage which was not agreed upon or may not fit in the vehicle boot or safety conditions are compromised. In the same way, the seating capacity of the vehicle is also shown; any passenger not agreed upon during the booking may be refused if space becomes minimal and safety conditions are compromised.',
            },
            {
                id: '2.9',
                title: '2.9 Delays',
                text: 'In extreme weather conditions and certain unavoidable situations, traffic delays that the chauffeur has no control over, or any such situation where the delay is inevitable, JK Executive Chauffeurs bears no responsibility. In the event of an unexpected traffic delay, road blockage, GPS navigation error, or such incidents that might cause financial loss like missing important meetings, hotel bookings, missing a flight, or connecting flights for the customer; JK Executive does not have control over these factors so we do not take any responsibility or pay compensation.',
            },
        ],
    },
    {
        id: 'penalties',
        icon: AlertTriangle,
        title: '3. Penalties Caused Due to Customers',
        content: [
            'Any penalties like parking tickets as a result of customers\' fault or not taking prior approval will be charged to customers like building management special parking etc.',
        ],
        subsections: [
            {
                id: '3.1',
                title: '3.1 Third Party Website Bookings',
                text: 'JK Executive does not take responsibility for third-party ground transportation service provider websites. We only entertain direct bookings from JK Executive website.',
            },
            {
                id: '3.2',
                title: '3.2 Change of Vehicle',
                text: 'If Vehicle is not available due to sudden mechanical failure or other reasons, we will send another substitute vehicle of a similar class of vehicle.',
            },
        ],
    },
    {
        id: 'noshow',
        icon: Clock,
        title: '4. Passenger No-Show Policy',
        content: [
            '"No show" means a cancellation of the Customer\'s service for the booked periods when the Customer does not show up at the pickup location. This rule may be ignored if a later pickup time is agreed upon by the Customer and notified to JK Executive.',
        ],
        subsections: [
            {
                id: '4.waiting',
                title: 'Waiting Times',
                list: [
                    'For airport pickups — 90 minutes',
                    'For non-airport pickups — 30 minutes',
                ],
                text: 'The chauffeur will be released with a full charge of the booking cost if the passenger is a no-show.',
            },
            {
                id: '4.transfer',
                title: '(a) Transfer Services',
                text: 'A No Show is only considered if the Customer is not present without cancellation 30 minutes past booked pickup time at the pickup location. No shows such as this will mean a full charge of the Customer\'s booked service must be paid for. Airport and train station pickups are considered no shows when the Customer has not cancelled 60 minutes prior to the pickup time.',
            },
            {
                id: '4.hourly',
                title: '(b) Hourly Services',
                text: 'A no-show is considered if the Customer does not show up at all during the booked hours at the agreed pickup time and location. The service for the booking must be paid in full. The Chauffeur will wait 1 hour irrespective of the number of hours booked and then leave, considering it a no-show.',
            },
            {
                id: '4.2',
                title: '4.2 Cancellations',
                text: 'If JK Executive feels that a booking cannot be made, which can include a sudden emergency for the driver, unavailability of the vehicle, or extreme weather conditions, bookings may be cancelled along with a full refund. Executive Car, People Carrier (MPV), and First Class should be cancelled 24 hours prior to the pickup time (not charged) — after 24 hours prior to the booking, 100% charged. Cancellations can be made via phone, email, or using the JK Executive website.',
            },
            {
                id: '4.3',
                title: '4.3 Changes to Booking',
                text: 'Changes can be made during a ride for a change of destination. This will be sent over for review, and JK Executive will charge the extra miles accordingly.',
            },
            {
                id: '4.4',
                title: '4.4 Behaviour in the Vehicle',
                list: [
                    'Doors must remain closed while the vehicle is moving.',
                    'Users must not throw objects from the vehicle.',
                    'Users must not stick body parts out of the vehicle.',
                    'Users must not shout from the vehicle.',
                    'Users must not smoke within the vehicle.',
                    'If the distance or number of hours is less than originally booked, once the passenger is on board and directs this change, the price remains unaffected.',
                    'Any physical or verbal abuse, threat, sexual and other harassment by or towards JK Executive staff will not be tolerated, and severe action will be taken.',
                    'Any passenger who is thought to be under the influence of alcohol or drugs and whose behavior poses a threat may be refused travel.',
                ],
            },
            {
                id: '4.5',
                title: '4.5 Lost Property',
                text: 'Any items lost within the vehicles will be returned to the Lost and Found department, which can be retrieved by either calling your driver or the office number. The cost incurred to deliver the items will be paid by the Customer. No responsibility for any loss or damage to any luggage or property carried in or on the car unless the loss or damage is a result of negligence by JK Executive Chauffeur.',
            },
            {
                id: '4.6',
                title: '4.6 Complaints',
                text: 'In the event of a complaint about the company\'s services, the hirer should endeavor to seek a solution at the time by seeking assistance from the driver or from the company. Complaints should be submitted in writing within 12 days of the termination date of the hire. The Company will acknowledge all complaints within 12 days and will normally reply fully within 28 days.',
            },
        ],
    },
    {
        id: 'payments',
        icon: CreditCard,
        title: '5. Payments and Premiums',
        subsections: [
            {
                id: '5.a',
                title: '(a) Waiting Times for Transfer Services',
                text: 'The first 60 minutes of waiting time is free for airports after the agreed pick-up time, and for non-airport pickup, customers receive 15 minutes of waiting time for free. Any extra waiting time after this free period will be charged at a flat rate, calculated by the hourly booking price of the area and vehicle category rate (including VAT).',
            },
            {
                id: '5.b',
                title: '(b) Additional Distance for Hourly Booking',
                text: 'JK Executive and partners have a fixed Miles-per-hour rate, and any extra miles outside of the hourly rate will be added as extras and calculated by the hourly booking price of the area and vehicle category rate (including VAT).',
            },
            {
                id: '5.c',
                title: '(c) Terms of Payment',
                text: 'The Customer can pay using all major credit cards. Payment will be taken instantly as the booking is complete and any extras added along the user\'s journey will be debited 24-48 hours after the trip is over.',
            },
            {
                id: '5.d',
                title: '(d) Invoices',
                text: 'Invoices are sent to the user as soon as their journey is finished (only if no extras are added), including a review form. Journeys with extras will have invoices sent within 24-48 hours after journey completion.',
            },
            {
                id: '5.e',
                title: '(e) Payments by Credit Card',
                text: 'Charges incurred due to different currencies or different local accounts are carried by the User. Customers are liable to show credit cards with ID if JK Executive suspects anything suspicious.',
            },
            {
                id: '5.f',
                title: '(f) Extra Charges',
                list: [
                    'Airport pick-up: 60 minutes free waiting time',
                    'Non-airport pick-up: 15 minutes free waiting time',
                    'Any route deviation or stop in between is chargeable',
                    'Hourly booking extensions must be arranged in advance and are subject to driver availability',
                    'Any extra charge will be charged as per the original booking details',
                ],
            },
        ],
    },
    {
        id: 'damages',
        icon: Car,
        title: '6. Damages to Cars by Customers',
        content: [
            'In the event that the interior or exterior of the vehicle is soiled or damaged by the customer, a valeting or repair charge will apply to the credit or debit card provided at the time of booking. Refusing to pay for the damage caused, legal action will be taken.',
        ],
    },
];

function TermsAndConditions() {
    return (
        <main style={{ backgroundColor: '#0e0e10', minHeight: '100vh' }}>
            <Helmet>
                <title>Terms and Conditions JK Executive Chauffeurs Legal</title>
                <meta name="description" content="Read the Terms and Conditions of JK Executive Chauffeurs. Understand our booking policies, cancellations, payments, and passenger conduct rules." />
            </Helmet>
            {/* Hero */}
            <section className="relative overflow-hidden" style={{ paddingTop: '140px', paddingBottom: '50px' }}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(215,183,94,0.05) 0%, transparent 70%)' }} />
                </div>
                <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <Link to="/" className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'var(--color-primary)', opacity: 0.7 }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Terms & Conditions</h1>
                    </motion.div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="max-w-4xl mx-auto px-4 md:px-8 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-xl p-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Table of Contents</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                        {sections.map((s) => (
                            <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors py-1">
                                <s.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                                {s.title}
                            </a>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* Sections */}
            <section className="max-w-4xl mx-auto px-4 md:px-8 pb-20 space-y-10">
                {sections.map((section, sIdx) => (
                    <motion.div
                        key={section.id}
                        id={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ delay: 0.05 }}
                        className="rounded-xl p-6 md:p-8"
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}>
                                <section.icon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <h2 className="text-lg md:text-xl font-semibold text-white">{section.title}</h2>
                        </div>

                        {section.content && section.content.map((para, i) => (
                            <p key={i} className="text-sm text-white/55 leading-relaxed mb-3">{para}</p>
                        ))}

                        {section.subsections && section.subsections.map((sub, subIdx) => (
                            <div key={sub.id} className="mt-5 ml-0 md:ml-2 pl-4" style={{ borderLeft: '2px solid rgba(215,183,94,0.15)' }}>
                                <h3 className="text-sm font-semibold text-white/80 mb-2">{sub.title}</h3>
                                {sub.text && <p className="text-sm text-white/50 leading-relaxed mb-2">{sub.text}</p>}
                                {sub.list && (
                                    <ul className="space-y-1.5 mt-2">
                                        {sub.list.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                                                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </motion.div>
                ))}
            </section>

            {/* Bottom Nav */}
            <section className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link to="/privacy-policy" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                        Privacy Policy →
                    </Link>
                    <Link to="/gdpr-policy" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                        GDPR Data Protection Policy →
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default TermsAndConditions;
