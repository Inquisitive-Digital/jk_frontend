import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Phone, Mail, MapPin, Clock, Send, ArrowRight,
    Car, Award, Star, CheckCircle, AlertCircle
} from 'lucide-react';
import { contactAPI } from '../Utils/api';

// ─── Validators ────────────────────────────────────────────────────────────────
const nameRegex = /^[A-Za-z\s'-]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\s()./-]{6,20}$/;

const validate = (fields) => {
    const errors = {};
    if (!fields.name.trim()) {
        errors.name = 'Full name is required.';
    } else if (!nameRegex.test(fields.name.trim())) {
        errors.name = 'Name can only contain letters, spaces, hyphens, or apostrophes.';
    }

    if (!fields.email.trim()) {
        errors.email = 'Email is required.';
    } else if (!emailRegex.test(fields.email.trim())) {
        errors.email = 'Please enter a valid email address.';
    }

    if (!fields.phone.trim()) {
        errors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(fields.phone.trim())) {
        errors.phone = 'Phone must contain only digits, spaces, +, (, ), . or -.';
    }

    if (!fields.subject) {
        errors.subject = 'Please select a subject.';
    }

    if (!fields.message.trim()) {
        errors.message = 'Message is required.';
    } else if (fields.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters.';
    }

    return errors;
};

// ─── Field styles ────────────────────────────────────────────────────────────
const inputBase = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
};
const inputError = {
    backgroundColor: 'rgba(239,68,68,0.05)',
    border: '1px solid rgba(239,68,68,0.4)',
};

function ErrorMsg({ msg }) {
    if (!msg) return null;
    return (
        <p className="flex items-center gap-1 mt-1.5 text-xs" style={{ color: '#f87171' }}>
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            {msg}
        </p>
    );
}

// ─── Component ───────────────────────────────────────────────────────────────
function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [apiError, setApiError] = useState('');

    // Auto-reset to form after 4 seconds on success
    useEffect(() => {
        if (!submitted) return;
        const timer = setTimeout(() => {
            setSubmitted(false);
            setApiError('');
        }, 4000);
        return () => clearTimeout(timer);
    }, [submitted]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Phone: only allow digit-compatible characters as user types
        if (name === 'phone') {
            if (value !== '' && !/^[0-9+\s()./-]*$/.test(value)) return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear field error on change
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setApiError('');

        const fieldErrors = validate(formData);
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        // Show success instantly — fire email in background
        const payload = { ...formData };
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setErrors({});
        contactAPI.submitInquiry(payload).catch((err) => {
            console.error('Contact inquiry email failed:', err?.response?.data?.message || err.message);
        });
    };

    const contactInfo = [
        {
            icon: Phone,
            label: 'Phone',
            value: '+44 203 475 9906',
            href: 'tel:+442034759906',
        },
        {
            icon: Mail,
            label: 'Email Address',
            value: 'info@jkexecutivechauffeurs.com',
            href: 'mailto:info@jkexecutivechauffeurs.com',
        },
        {
            icon: MapPin,
            label: 'Regd Address',
            value: '1.01, 6-9 The Square, Stockley Park Uxbridge, England, UB11 1FW',
            href: 'https://maps.google.com/?q=Stockley+Park+Uxbridge+UB11+1FW',
        },
        {
            icon: Clock,
            label: 'Working Hours',
            value: 'MON-SUN: 24/7 Open',
            href: null,
        },
    ];

    // ── Shared input/select focus styles ─────────────────────────────────────
    const onFocus = (e) => (e.target.style.borderColor = 'var(--color-primary)');
    const onBlur = (e) => {
        const hasError = errors[e.target.name];
        e.target.style.borderColor = hasError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)';
    };

    return (
        <main style={{ backgroundColor: 'var(--color-dark)', minHeight: '100vh' }}>

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ paddingTop: '140px', paddingBottom: '60px' }}>
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(215,183,94,0.06) 0%, transparent 70%)' }}
                    />
                    <div
                        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl"
                        style={{ background: 'radial-gradient(circle, rgba(215,183,94,0.04) 0%, transparent 70%)' }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <span
                            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
                            style={{
                                backgroundColor: 'rgba(215,183,94,0.1)',
                                color: 'var(--color-primary)',
                                border: '1px solid rgba(215,183,94,0.2)',
                            }}
                        >
                            Get In Touch
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                            Contact <span style={{ color: 'var(--color-primary)' }}>Us</span>
                        </h1>
                        <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
                            Ready to experience London's finest chauffeur service? Get in touch with our team and we'll take care of everything.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Contact Info Cards + Form ──────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <div className="grid lg:grid-cols-5 gap-10 md:gap-14">

                    {/* Left — Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="lg:col-span-2 space-y-5"
                    >
                        {contactInfo.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                            >
                                {item.href ? (
                                    <a
                                        href={item.href}
                                        target={item.href.startsWith('http') ? '_blank' : undefined}
                                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="block group"
                                    >
                                        <div
                                            className="flex items-start gap-4 p-5 rounded-xl transition-all duration-300"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(215,183,94,0.3)';
                                                e.currentTarget.style.backgroundColor = 'rgba(215,183,94,0.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                            }}
                                        >
                                            <div className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}>
                                                <item.icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>{item.label}</p>
                                                <p className="text-white text-sm font-medium leading-relaxed">{item.value}</p>
                                            </div>
                                        </div>
                                    </a>
                                ) : (
                                    <div
                                        className="flex items-start gap-4 p-5 rounded-xl"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                                    >
                                        <div className="flex-shrink-0 w-11 h-11 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}>
                                            <item.icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-primary)' }}>{item.label}</p>
                                            <p className="text-white text-sm font-medium leading-relaxed">{item.value}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {/* CTA */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="pt-4">
                            <Link
                                to="/booking"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 w-full justify-center"
                                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 25px rgba(215,183,94,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                Book Now <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Right — Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="lg:col-span-3"
                    >
                        <div
                            className="rounded-2xl p-6 md:p-10"
                            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">Send Us a Message</h2>
                            <p className="text-white/40 text-sm mb-8">
                                Fill in the form below and our team will get back to you shortly. All fields are required.
                            </p>

                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-12 text-center"
                                >
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                                        style={{ backgroundColor: 'rgba(215,183,94,0.1)', border: '2px solid rgba(215,183,94,0.3)' }}
                                    >
                                        <CheckCircle className="w-10 h-10" style={{ color: 'var(--color-primary)' }} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                                    <p className="text-white/50 text-sm max-w-xs">
                                        Thank you for reaching out. We've received your inquiry and will get back to you within 24 hours.
                                    </p>
                                    <p className="mt-3 text-white/30 text-xs">This form will reset automatically in a few seconds.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                                    {/* Row 1 — Name + Email */}
                                    <div className="grid md:grid-cols-2 gap-5">

                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                                                Full Name <span style={{ color: 'var(--color-primary)' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                                placeholder="Your full name"
                                                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-300"
                                                style={errors.name ? inputError : inputBase}
                                            />
                                            <ErrorMsg msg={errors.name} />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                                                Email <span style={{ color: 'var(--color-primary)' }}>*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                                placeholder="your@email.com"
                                                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-300"
                                                style={errors.email ? inputError : inputBase}
                                            />
                                            <ErrorMsg msg={errors.email} />
                                        </div>
                                    </div>

                                    {/* Row 2 — Phone + Subject */}
                                    <div className="grid md:grid-cols-2 gap-5">

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                                                Phone <span style={{ color: 'var(--color-primary)' }}>*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                                inputMode="tel"
                                                placeholder="+44 XXX XXX XXXX"
                                                className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-300"
                                                style={errors.phone ? inputError : inputBase}
                                            />
                                            <ErrorMsg msg={errors.phone} />
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                                                Subject <span style={{ color: 'var(--color-primary)' }}>*</span>
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                onFocus={onFocus}
                                                onBlur={onBlur}
                                                className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none transition-all duration-300 appearance-none"
                                                style={errors.subject ? inputError : inputBase}
                                            >
                                                <option value="" style={{ backgroundColor: '#1a1a1a' }}>Select a subject</option>
                                                <option value="booking" style={{ backgroundColor: '#1a1a1a' }}>Booking Enquiry</option>
                                                <option value="corporate" style={{ backgroundColor: '#1a1a1a' }}>Corporate Service</option>
                                                <option value="airport" style={{ backgroundColor: '#1a1a1a' }}>Airport Transfer</option>
                                                <option value="wedding" style={{ backgroundColor: '#1a1a1a' }}>Wedding Service</option>
                                                <option value="quote" style={{ backgroundColor: '#1a1a1a' }}>Get a Quote</option>
                                                <option value="other" style={{ backgroundColor: '#1a1a1a' }}>Other</option>
                                            </select>
                                            <ErrorMsg msg={errors.subject} />
                                        </div>
                                    </div>

                                    {/* Row 3 — Message */}
                                    <div>
                                        <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                                            Message <span style={{ color: 'var(--color-primary)' }}>*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            onFocus={onFocus}
                                            onBlur={onBlur}
                                            rows={5}
                                            placeholder="Tell us about your requirements..."
                                            className="w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-300 resize-none"
                                            style={errors.message ? inputError : inputBase}
                                        />
                                        <ErrorMsg msg={errors.message} />
                                    </div>

                                    {/* API-level error */}
                                    {apiError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                                            style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                                        >
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            {apiError}
                                        </motion.div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300"
                                        style={{
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'var(--color-dark)',
                                            opacity: isSubmitting ? 0.7 : 1,
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSubmitting) {
                                                e.currentTarget.style.boxShadow = '0 4px 25px rgba(215,183,94,0.4)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Google Map ─────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.5!2d-0.4946!3d51.5117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sStockley+Park+Uxbridge+UB11+1FW!5e0!3m2!1sen!2suk!4v1700000000000"
                        width="100%"
                        height="350"
                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)' }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="JK Executive Chauffeurs Location"
                    />
                </motion.div>
            </section>

            {/* ── Stats ──────────────────────────────────────────────────── */}
            <section
                className="py-16 md:py-20"
                style={{ background: 'linear-gradient(180deg, var(--color-dark) 0%, rgba(215,183,94,0.04) 50%, var(--color-dark) 100%)' }}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: '10+', label: 'Years Experience', icon: Award },
                            { number: '24/7', label: 'Available', icon: Clock },
                            { number: '50+', label: 'Premium Vehicles', icon: Car },
                            { number: '5000+', label: 'Happy Clients', icon: Star },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <stat.icon className="w-6 h-6 mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                                <p className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</p>
                                <p className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ContactUs;
