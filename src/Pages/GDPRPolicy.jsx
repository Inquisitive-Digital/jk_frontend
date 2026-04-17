import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    ArrowLeft, ShieldCheck, Database, Users, FileCheck,
    Lock, Briefcase, Clock, Mail
} from 'lucide-react';


const sections = [
    {
        id: 'overview',
        icon: ShieldCheck,
        title: 'Overview',
        paragraphs: [
            'JK Executive Chauffeur has a responsibility to protect the privacy of passengers. We use the information that we collect lawfully (As per the Data Protection Act 1998). We gather information to provide better service. We do not use personal information for marketing purposes unless you have given us your consent.',
            'You have the full right to request a copy of all the information that we hold about you. We would like to make sure to keep your personal information up to date. You may ask us to correct or remove information if you think is inaccurate. If you don\'t like to receive such information you may opt-out at any time and have a right to stop us from contacting you for marketing purposes.',
            'We collect information like personal details of the passenger like name, address, mobile number, and email address. We never ask for any sensitive information without your consent.',
            'Data protection is the process of safeguarding important information from corruption, compromise, or loss. Also, about taking care of our drivers and clients and ensuring that we are respecting their privacy.',
        ],
    },
    {
        id: 'principles',
        icon: FileCheck,
        title: 'Data Protection Principles',
        paragraphs: [
            'Data protection compliance is based largely on a set of principles. The six GDPR principles say that:',
        ],
        numberedList: [
            'Whatever you do with people\'s information has to be fair and legal. This includes making sure that they know what you are doing with the information about them.',
            'When you obtain information, you must be clear about why you are obtaining it, and must then use it only for the original purposes.',
            'You must hold the right information for your purpose: it must be adequate, relevant, and limited to what is necessary.',
            'Your information must be accurate and where necessary up to date.',
            'You must not hold information longer than necessary.',
            'You must have appropriate security to prevent your information from being lost, damaged, or getting into the wrong hands.',
        ],
    },
    {
        id: 'marketing',
        icon: Mail,
        title: 'Marketing',
        paragraphs: [
            'We would like to convey the information about our service. If you don\'t like to receive such information you may opt-out at any time and have a right to stop us from contacting you for marketing purposes.',
        ],
    },
    {
        id: 'collection',
        icon: Database,
        title: 'How Do We Collect and Use Your Information?',
        paragraphs: [
            'Depending upon the nature of our business, we may collect different information, and these differences are defined below.',
        ],
        subsections: [
            {
                title: 'Customers',
                text: 'We collect and use your information when you provide it to us mainly to provide access to our services and products. It helps us to improve our offerings to you and for certain other purposes. We collect personal data when you complete the form for us via our website www.jkexecutivechauffeurs.com or by phone, and email.',
            },
            {
                title: 'Employees and Drivers',
                text: 'We collect information relevant to our legal obligations as an employer or as a driver. This information may include your name, telephone number, and email address, in addition, to address, bank account details, licensing information, and details relating to criminal convictions and other information which is required as part of our screening and vetting processes.',
            },
        ],
    },
    {
        id: 'why',
        icon: Briefcase,
        title: 'Why We Need Your Details',
        paragraphs: [
            'We need your details to make sure we are able to fully assist you with any inquiries or requested services. We do not collect any personal information from you if not required or necessary for the service.',
        ],
    },
    {
        id: 'whatwedo',
        icon: Lock,
        title: 'What We Do With Your Details',
        paragraphs: [
            'The personal data we collect from you is only processed in the UK and EU areas. Third parties will have access to your personal data only when they are under contract and following the signature of a non-disclosure agreement. These third parties include:',
        ],
        list: [
            'Customers, Employees, Drivers, and Suppliers',
            'Your data will be disclosed to the drivers in order to complete your requested service',
            'Transport for London (upon receipt of a proper and justified request)',
            'Police and other regulatory authorities (upon receipt of a proper and justified request)',
        ],
    },
    {
        id: 'retention',
        icon: Clock,
        title: 'How Long Your Data Will Be Stored',
        paragraphs: [
            'Service user personal data will be retained for no more than 12 months following each use of our service unless you exercise your rights.',
            'Your details are collected when you visit our app, website and the resources that you access, as well as the details of transactions you perform through our website while bookings.',
            'As per Transport for London Authority, we are obliged to retain journey records for a period of 12 months as a condition of our contract. Similarly, we are required to keep any complaint from the customer, lost property logs, and account query records for the same period of time.',
            'Employee data, driver data, and financial data will be retained for 12 months from the end of their contract with JK Executive Chauffeur.',
        ],
    },
    {
        id: 'rights',
        icon: Users,
        title: 'Your Rights',
        paragraphs: [
            'Under the GDPR, you have the following rights regarding your personal data:',
        ],
        rights: [
            { name: 'Right to Access', desc: 'Request copies of your personal data held by us.' },
            { name: 'Right to Rectification', desc: 'Request correction of any inaccurate or incomplete information.' },
            { name: 'Right to Erasure', desc: 'Request deletion of your personal data under certain conditions.' },
            { name: 'Right to Restrict Processing', desc: 'Request that we limit how we use your data.' },
            { name: 'Right to Object', desc: 'Object to our processing of your personal data.' },
            { name: 'Right to Data Portability', desc: 'Request transfer of your data to another organization.' },
            { name: 'Right to Opt-Out', desc: 'Stop us from contacting you for marketing purposes at any time.' },
        ],
    },
];

function GDPRPolicy() {
    return (
        <main style={{ backgroundColor: '#0e0e10', minHeight: '100vh' }}>
            <Helmet>
                <title>GDPR Policy JK Executive Chauffeurs Data Protection</title>
                <meta name="description" content="Read the GDPR Data Protection Policy for JK Executive Chauffeurs. Learn how we collect, use, and protect your personal data in compliance with UK law." />
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
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">GDPR Data Protection Policy</h1>
                    </motion.div>
                </div>
            </section>

            {/* Table of Contents */}
            <section className="max-w-4xl mx-auto px-4 md:px-8 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="rounded-xl p-6"
                    style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-4">Sections</h3>
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
            <section className="max-w-4xl mx-auto px-4 md:px-8 pb-20 space-y-8">
                {sections.map((section) => (
                    <motion.div
                        key={section.id}
                        id={section.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        className="rounded-xl p-6 md:p-8"
                        style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}>
                                <section.icon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                            </div>
                            <h2 className="text-lg md:text-xl font-semibold text-white">{section.title}</h2>
                        </div>

                        {section.paragraphs.map((p, i) => (
                            <p key={i} className="text-sm text-white/55 leading-relaxed mb-3">{p}</p>
                        ))}

                        {/* Numbered list (for principles) */}
                        {section.numberedList && (
                            <div className="space-y-3 mt-3">
                                {section.numberedList.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5"
                                            style={{ backgroundColor: 'rgba(215,183,94,0.1)', color: 'var(--color-primary)' }}>
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-white/50 leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Bullet list */}
                        {section.list && (
                            <ul className="space-y-2 mt-3">
                                {section.list.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Subsections */}
                        {section.subsections && section.subsections.map((sub, i) => (
                            <div key={i} className="mt-5 pl-4" style={{ borderLeft: '2px solid rgba(215,183,94,0.15)' }}>
                                <h3 className="text-sm font-semibold text-white/80 mb-2">{sub.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed">{sub.text}</p>
                            </div>
                        ))}

                        {/* Rights cards */}
                        {section.rights && (
                            <div className="grid sm:grid-cols-2 gap-3 mt-4">
                                {section.rights.map((right, i) => (
                                    <div key={i} className="rounded-lg p-4" style={{ backgroundColor: 'rgba(215,183,94,0.04)', border: '1px solid rgba(215,183,94,0.1)' }}>
                                        <p className="text-sm text-white/80 font-medium mb-1">{right.name}</p>
                                        <p className="text-xs text-white/45 leading-relaxed">{right.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </section>

            {/* Bottom Nav */}
            <section className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <Link to="/terms-and-conditions" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                        ← Terms & Conditions
                    </Link>
                    <Link to="/privacy-policy" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                        ← Privacy Policy
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default GDPRPolicy;
