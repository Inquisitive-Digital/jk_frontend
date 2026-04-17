import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    ArrowLeft, Shield, Eye, Cookie, FileText,
    UserCheck, Bell, Lock, Baby, Globe
} from 'lucide-react';

const sections = [
    {
        id: 'general',
        icon: Shield,
        title: 'General',
        paragraphs: [
            'At JK Executive, accessible from https://www.jkexecutivechauffeurs.com/, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by JK Executive and how we use it.',
            'If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.',
            'This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in JK Executive. This policy is not applicable to any information collected offline or via channels other than this website.',
        ],
    },
    {
        id: 'consent',
        icon: UserCheck,
        title: 'Consent',
        paragraphs: [
            'By using our website, you hereby consent to our Privacy Policy and agree to its terms.',
        ],
    },
    {
        id: 'information',
        icon: Eye,
        title: 'Information We Collect',
        paragraphs: [
            'The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.',
            'If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.',
            'When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.',
        ],
    },
    {
        id: 'usage',
        icon: FileText,
        title: 'How We Use Your Information',
        paragraphs: [
            'We use the information we collect in various ways, including:',
        ],
        list: [
            'Transaction Data includes details about payments and other details of our Services you have purchased from us.',
            'Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.',
            'Provide, operate and maintain our website.',
            'Improve, personalize, and expand our website.',
            'Understand and analyze how you use our website.',
            'Develop new products, services, features, and functionality.',
            'Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.',
            'Find and prevent fraud.',
        ],
    },
    {
        id: 'logfiles',
        icon: Lock,
        title: 'Log Files',
        paragraphs: [
            'JK Executive follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and are a part of hosting services\' analytics.',
            'The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users\' movement on the website, and gathering demographic information.',
        ],
    },
    {
        id: 'cookies',
        icon: Cookie,
        title: 'Cookies and Web Beacons',
        paragraphs: [
            'Like any other website, JK Executive uses \'cookies\'. These cookies are used to store information including visitors\' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users\' experience by customizing our web page content based on visitor\'s browser type and/or other information.',
        ],
    },
    {
        id: 'advertising',
        icon: Globe,
        title: 'Advertising Partners Privacy Policies',
        paragraphs: [
            'You may consult this list to find the Privacy Policy for each of the advertising partners of JK Executive.',
            'Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on JK Executive, which are sent directly to users\' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.',
            'Note that JK Executive has no access to or control over these cookies that are used by third-party advertisers.',
        ],
    },
    {
        id: 'ccpa',
        icon: Bell,
        title: 'CCPA Privacy Rights',
        paragraphs: [
            'Under the CCPA, among other rights, consumers have the right to:',
        ],
        list: [
            'Request that a business that collects a consumer\'s personal data disclose the categories and specific pieces of personal data that a business has collected about consumers.',
            'Request that a business deletes any personal data about the consumer that a business has collected.',
            'Request that a business that sells a consumer\'s personal data, not sell the consumer\'s personal data.',
        ],
        afterList: 'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.',
    },
    {
        id: 'gdpr-rights',
        icon: Shield,
        title: 'GDPR Data Protection Rights',
        paragraphs: [
            'We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:',
        ],
        rights: [
            { name: 'The right to access', desc: 'You have the right to request copies of your personal data. We may charge you a small fee for this service.' },
            { name: 'The right to rectification', desc: 'You have the right to request that we correct any information you believe is inaccurate. You also have the right to request that we complete the information you believe is incomplete.' },
            { name: 'The right to erasure', desc: 'You have the right to request that we erase your personal data, under certain conditions.' },
            { name: 'The right to restrict processing', desc: 'You have the right to request that we restrict the processing of your personal data, under certain conditions.' },
            { name: 'The right to object to processing', desc: 'You have the right to object to our processing of your personal data, under certain conditions.' },
            { name: 'The right to data portability', desc: 'You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.' },
        ],
        afterList: 'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.',
    },
    {
        id: 'children',
        icon: Baby,
        title: 'Children\'s Information',
        paragraphs: [
            'Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.',
            'JK Executive does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.',
        ],
    },
];

function PrivacyPolicy() {
    return (
        <main style={{ backgroundColor: '#0e0e10', minHeight: '100vh' }}>
            <Helmet>
                <title>Privacy Policy JK Executive Chauffeurs Data Safety</title>
                <meta name="description" content="Read the Privacy Policy of JK Executive Chauffeurs. Understand how we handle your personal data, cookies, and your rights under GDPR and CCPA." />
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
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Privacy Policy</h1>
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

                        {section.list && (
                            <ul className="space-y-2 mt-3 mb-3">
                                {section.list.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/50">
                                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }} />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {section.rights && (
                            <div className="space-y-3 mt-3 mb-3">
                                {section.rights.map((right, i) => (
                                    <div key={i} className="pl-4" style={{ borderLeft: '2px solid rgba(215,183,94,0.15)' }}>
                                        <p className="text-sm text-white/70 font-medium">{right.name}</p>
                                        <p className="text-sm text-white/45 mt-0.5">{right.desc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {section.afterList && (
                            <p className="text-sm text-white/55 leading-relaxed mt-3">{section.afterList}</p>
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
                    <Link to="/gdpr-policy" className="text-sm transition-colors hover:opacity-80" style={{ color: 'var(--color-primary)' }}>
                        GDPR Data Protection Policy →
                    </Link>
                </div>
            </section>
        </main>
    );
}

export default PrivacyPolicy;
