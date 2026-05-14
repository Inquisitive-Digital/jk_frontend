import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  ArrowRight,
  Loader2,
  Car,
  CheckCircle2,
} from "lucide-react";
import { contactAPI } from "../../Utils/api";
import { toast } from "react-toastify";

/* ── Country codes ── */
const COUNTRY_CODES = [
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+1",  country: "US", flag: "🇺🇸" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+31", country: "NL", flag: "🇳🇱" },
  { code: "+353",country: "IE", flag: "🇮🇪" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+971",country: "AE", flag: "🇦🇪" },
  { code: "+966",country: "SA", flag: "🇸🇦" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
];

/* ── Small country-code dropdown ── */
function CountryDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-3.5 border border-r-0 rounded-l-xl transition-colors min-w-[88px] cursor-pointer"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
      >
        <span className="text-base">{selected.flag}</span>
        <span className="text-sm font-medium">{selected.code}</span>
        <ChevronDown size={12} className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "rgba(255,255,255,0.4)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-full left-0 mt-1 z-50 w-44 max-h-56 overflow-y-auto rounded-xl shadow-2xl"
            style={{ backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {COUNTRY_CODES.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => { onChange(c.code); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors cursor-pointer"
                  style={{
                    backgroundColor: c.code === value ? "rgba(215,183,94,0.1)" : "transparent",
                    color: c.code === value ? "var(--color-primary)" : "rgba(255,255,255,0.75)",
                  }}
                >
                  <span>{c.flag}</span>
                  <span className="font-medium">{c.code}</span>
                  <span className="ml-auto text-xs opacity-50">{c.country}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function GetAQuoteForm({ vehicle, bookingData }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+44",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Reset form when vehicle changes
  useEffect(() => {
    setSubmitted(false);
    setForm({ firstName: "", lastName: "", email: "", countryCode: "+44", phone: "", message: "" });
    setErrors({});
  }, [vehicle?._id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim())  errs.lastName  = "Required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.phone.trim()) errs.phone = "Required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    try {
      await contactAPI.submitCarQuote({
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: `${form.countryCode}${form.phone}`,
        message: form.message,
        carName: vehicle?.categoryName || "Vehicle",
        bookingData: {
          pickup: bookingData.pickup,
          dropoff: bookingData.dropoff,
          pickupDate: bookingData.pickupDate,
          pickupTime: bookingData.pickupTime,
          serviceType: bookingData.serviceType,
          hours: bookingData.hours,
        }
      });
      
      setSubmitted(true);
      toast.success("Quote request sent! We'll be in touch shortly.");
      
      // Navigate to home after a brief delay so they see the success state
      setTimeout(() => {
        navigate("/?quoteSuccess=true");
      }, 1500);
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error("Failed to send quote. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Card shell (matches StickyBookingSummary card style) ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      {/* ── Header ── */}
      <div
        className="p-5"
        style={{
          background: "linear-gradient(180deg, rgba(215,183,94,0.15) 0%, rgba(215,183,94,0.05) 60%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(215,183,94,0.12)", border: "1px solid rgba(215,183,94,0.25)" }}
          >
            <Car size={18} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-semibold" style={{ color: "var(--color-primary)" }}>
              Get a Quote
            </p>
            <p className="text-sm font-bold text-white truncate max-w-[180px]">
              {vehicle?.categoryName || "Selected Vehicle"}
            </p>
          </div>
        </div>

        {/* Gold divider */}
        <div
          className="mt-4 h-px rounded-full"
          style={{ background: "linear-gradient(to right, var(--color-primary), transparent)" }}
        />
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        {submitted ? (
          /* Success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-6 gap-3"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(215,183,94,0.12)", border: "1px solid rgba(215,183,94,0.3)" }}
            >
              <CheckCircle2 size={28} style={{ color: "var(--color-primary)" }} />
            </div>
            <p className="text-base font-bold text-white">Quote Request Sent!</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
              Our team will contact you with a personalised quote for your{" "}
              <span style={{ color: "var(--color-primary)" }}>{vehicle?.categoryName}</span>.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <User size={12} className="mt-px shrink-0" /> First Name <span style={{ color: "var(--color-primary)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="First"
                  className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all placeholder:opacity-30 placeholder:text-white"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: errors.firstName ? "#ef4444" : "rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
                {errors.firstName && <p className="text-[10px] text-red-400">{errors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Last Name <span style={{ color: "var(--color-primary)" }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Last"
                  className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all placeholder:opacity-30 placeholder:text-white"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: errors.lastName ? "#ef4444" : "rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
                {errors.lastName && <p className="text-[10px] text-red-400">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                <Mail size={12} className="mt-px shrink-0" /> Email <span style={{ color: "var(--color-primary)" }}>*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none transition-all placeholder:opacity-30 placeholder:text-white"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderColor: errors.email ? "#ef4444" : "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
              {errors.email && <p className="text-[10px] text-red-400">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                <Phone size={12} className="mt-px shrink-0" /> Phone <span style={{ color: "var(--color-primary)" }}>*</span>
              </label>
              <div className="flex">
                <CountryDropdown value={form.countryCode} onChange={(v) => setForm((f) => ({ ...f, countryCode: v }))} />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                  placeholder="Phone number"
                  className="flex-1 px-3 py-2.5 text-sm border rounded-r-xl outline-none transition-all placeholder:opacity-30 placeholder:text-white"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderColor: errors.phone ? "#ef4444" : "rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-400">{errors.phone}</p>}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex gap-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                <MessageSquare size={12} className="mt-px shrink-0" /> Additional Requirements
              </label>
              <textarea
                rows={3}
                value={form.message}
                onChange={set("message")}
                placeholder="Journey details, dates, number of passengers..."
                className="w-full px-3 py-2.5 text-sm border rounded-xl outline-none resize-none transition-all placeholder:opacity-30 placeholder:text-white"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  borderColor: "rgba(255,255,255,0.1)",
                  color: "#fff",
                }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: submitting ? "rgba(215,183,94,0.4)" : "var(--color-primary)",
                color: "var(--color-dark)",
                boxShadow: submitting ? "none" : "0 6px 20px rgba(215,183,94,0.28)",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? (
                <><Loader2 size={16} className="animate-spin" /> Sending...</>
              ) : (
                <><ArrowRight size={16} /> SUBMIT QUOTE REQUEST</>
              )}
            </button>

            <p className="text-center text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              We will get back to you with a personalised quote
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
}
