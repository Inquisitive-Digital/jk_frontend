import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { contactAPI } from "../Utils/api";

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", enquiry: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");

  // Auto-reset to initial state after 4 seconds on success
  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      setSubmitted(false);
      setApiError("");
    }, 4000);
    return () => clearTimeout(timer);
  }, [submitted]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.enquiry.trim()) newErrors.enquiry = "Enquiry cannot be empty.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Show success instantly — fire email in background
    const payload = { ...formData };
    setSubmitted(true);
    setFormData({ name: "", email: "", enquiry: "" });
    setErrors({});
    contactAPI.submitBulkQuote(payload).catch((err) => {
      console.error("Bulk quote email failed:", err?.response?.data?.message || err.message);
    });
  };

  return (
    <section
      className="px-4 py-16"
      style={{ backgroundColor: 'var(--color-dark)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Corporate <span style={{ color: 'var(--color-primary)' }}>&</span> Bulk Bookings
            </h2>
            <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
              Planning a Corporate or Bulk Booking? Let's Make It Seamless for You.
            </p>
          </div>

          {/* Form Container */}
          <div
            className="rounded-2xl p-6 md:p-10"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
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
                  <svg
                    className="w-10 h-10"
                    style={{ color: 'var(--color-primary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Quote Request Sent!</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Thank you for reaching out. Our team will review your bulk booking requirements and get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* API-level error */}
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                  >
                    {apiError}
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-300 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: errors.name ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-300 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: errors.email ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                      onBlur={(e) => e.target.style.borderColor = errors.email ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                    Enquiry *
                  </label>
                  <textarea
                    name="enquiry"
                    value={formData.enquiry}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your requirements..."
                    className={`w-full px-4 py-3 rounded-lg text-sm text-white placeholder-white/30 outline-none transition-all duration-300 resize-none ${errors.enquiry ? 'ring-2 ring-red-500' : ''}`}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      border: errors.enquiry ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={(e) => e.target.style.borderColor = errors.enquiry ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}
                  />
                  {errors.enquiry && <p className="text-red-500 text-xs mt-1">{errors.enquiry}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-300 w-full"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-dark)',
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.boxShadow = '0 4px 25px rgba(215,183,94,0.4)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Get a Custom Quote
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 12h14m-7-7l7 7-7 7"
                        />
                      </motion.svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
