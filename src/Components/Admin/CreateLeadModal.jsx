import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import {
    X, MapPin, Calendar, Clock, User, Mail, Phone, Users,
    Briefcase, Car, FileText, Loader2, ChevronRight, ChevronDown,
    ChevronLeft, Check, Timer
} from "lucide-react";
import { bookingAPI, vehicleAPI } from "../../Utils/api";

// ── Must be a STATIC constant outside component → prevents LoadScript reload warning
const GOOGLE_LIBRARIES = ["places"];

// ── Country codes ──────────────────────────────────────────────────────────────
const countryCodes = [
    { code: "+44", country: "UK", flag: "🇬🇧" },
    { code: "+1", country: "US", flag: "🇺🇸" },
    { code: "+91", country: "IN", flag: "🇮🇳" },
    { code: "+33", country: "FR", flag: "🇫🇷" },
    { code: "+49", country: "DE", flag: "🇩🇪" },
    { code: "+39", country: "IT", flag: "🇮🇹" },
    { code: "+34", country: "ES", flag: "🇪🇸" },
    { code: "+31", country: "NL", flag: "🇳🇱" },
    { code: "+353", country: "IE", flag: "🇮🇪" },
    { code: "+61", country: "AU", flag: "🇦🇺" },
    { code: "+971", country: "AE", flag: "🇦🇪" },
    { code: "+966", country: "SA", flag: "🇸🇦" },
];

const SERVICE_TYPES = [
    { value: "oneway", label: "One Way" },
    { value: "roundtrip", label: "Round Trip" },
    { value: "hourly", label: "Hourly" },
];

// ── Google Places autocomplete — WHITE theme to match the admin modal ──────────
// .pac-container is appended to document.body so it needs overriding via CSS injection
const pacStyles = `
  .pac-container {
    border-radius: 10px !important;
    margin-top: 4px !important;
    box-shadow: 0 8px 30px -4px rgba(0,0,0,0.12) !important;
    border: 1px solid #e5e7eb !important;
    background-color: #fff !important;
    z-index: 999999 !important;
    font-family: inherit !important;
  }
  .pac-item {
    padding: 9px 14px !important;
    color: #374151 !important;
    border-top: 1px solid #f3f4f6 !important;
    background-color: #fff !important;
    cursor: pointer !important;
    font-size: 13px !important;
  }
  .pac-item:hover,
  .pac-item-selected,
  .pac-item-selected:hover {
    background-color: #eff6ff !important;
    color: #1e40af !important;
  }
  .pac-item-query { color: #111827 !important; font-weight: 600; }
  .pac-matched { color: #2563eb !important; font-weight: 700; }
  .pac-icon { filter: none !important; opacity: 0.45; }
`;

// ── UK time helper ─────────────────────────────────────────────────────────────
const getUKHourMinute = () => {
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).formatToParts(new Date());
    return {
        h: parseInt(parts.find((p) => p.type === "hour").value, 10),
        m: parseInt(parts.find((p) => p.type === "minute").value, 10),
    };
};

// Default time = UK now + 30 min, rounded UP to the next 30-min slot, 12-hr format
const computeDefaultTime = (val) => {
    if (val) {
        const [time, period] = val.split(" ");
        const [h, m] = time.split(":");
        return { hours: h, minutes: m, ampm: period };
    }
    const { h, m } = getUKHourMinute();
    const totalMins = h * 60 + m + 30;
    const roundedMins = Math.ceil(totalMins / 30) * 30;
    const hour24 = Math.floor(roundedMins / 60) % 24;
    const min = roundedMins % 60;
    return {
        hours: (hour24 % 12 || 12).toString().padStart(2, "0"),
        minutes: min.toString().padStart(2, "0"),
        ampm: hour24 >= 12 ? "PM" : "AM",
    };
};

const getTodayDate = () => new Date();

const formatDateDisplay = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};
const formatTimeDisplay = (t) => t || "Select time";

// ── Click-outside hook ─────────────────────────────────────────────────────────
function useClickOutside(ref, handler) {
    useEffect(() => {
        const listener = (e) => {
            if (!ref.current || ref.current.contains(e.target)) return;
            handler(e);
        };
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [ref, handler]);
}

// ── Helper: compute fixed position for a picker panel ─────────────────────────
// Reads the trigger button's bounding rect so the panel is placed with position:fixed,
// escaping any overflow:hidden ancestor (the modal's scrollable form container).
const getPickerStyle = (btnRef, width) => {
    if (!btnRef?.current) return { position: "absolute", top: "100%", left: 0, marginTop: 6, width };
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openAbove = spaceBelow < 320 && spaceAbove > spaceBelow;
    
    // Horizontal boundary check - prevent cutoff on right side
    const spaceRight = window.innerWidth - rect.right;
    const actualWidth = Math.min(width, window.innerWidth - 32); // Max width with padding
    let leftPos = rect.left;
    
    // If not enough space on right, shift left to fit within viewport
    if (spaceRight < actualWidth) {
        leftPos = Math.max(16, rect.right - actualWidth); // 16px from left edge min
    }
    
    return {
        position: "fixed",
        left: leftPos,
        width: actualWidth,
        ...(openAbove
            ? { bottom: window.innerHeight - rect.top + 6 }
            : { top: rect.bottom + 6 }),
    };
};

// ── ADMIN TIME PICKER (light theme) ───────────────────────────────────────────
const AdminTimePicker = ({ value, onChange, onClose, selectedDate, btnRef }) => {
    const wrapperRef = useRef(null);
    const hoursScrollRef = useRef(null);
    const minutesScrollRef = useRef(null);
    useClickOutside(wrapperRef, onClose);

    const def = computeDefaultTime(value);
    const [hours, setHours] = useState(def.hours);
    const [minutes, setMinutes] = useState(def.minutes);
    const [ampm, setAmpm] = useState(def.ampm);
    const [isTimeValid, setIsTimeValid] = useState(true);

    useEffect(() => {
        const d = computeDefaultTime(value);
        setHours(d.hours); setMinutes(d.minutes); setAmpm(d.ampm);
    }, [value]);

    useEffect(() => {
        if (hoursScrollRef.current) {
            const el = hoursScrollRef.current.querySelector(`[data-hour="${hours}"]`);
            if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        if (minutesScrollRef.current) {
            const el = minutesScrollRef.current.querySelector(`[data-minute="${minutes}"]`);
            if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
        }
    }, [hours, minutes]);

    const isTimeInPast = (h, m, ap) => {
        const checkDate = selectedDate || new Date();
        const { h: ukH, m: ukM } = getUKHourMinute();
        const isToday = checkDate.toDateString() === new Date().toDateString();
        if (!isToday) return false;
        let hour24 = parseInt(h);
        if (ap === "PM" && hour24 !== 12) hour24 += 12;
        if (ap === "AM" && hour24 === 12) hour24 = 0;
        const totalMins = ukH * 60 + ukM + 30;
        const roundedMins = Math.ceil(totalMins / 30) * 30;
        const minH24 = Math.floor(roundedMins / 60) % 24;
        const minMin = roundedMins % 60;
        return hour24 < minH24 || (hour24 === minH24 && parseInt(m) < minMin);
    };

    useEffect(() => { setIsTimeValid(!isTimeInPast(hours, minutes, ampm)); }, [hours, minutes, ampm, selectedDate]);

    const handleConfirm = () => { if (!isTimeValid) return; onChange(`${hours}:${minutes} ${ampm}`); onClose(); };

    const hoursArr = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
    const minutesArr = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

    return (
        <div ref={wrapperRef}
            className="z-[999999] bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
            style={getPickerStyle(btnRef, 280)}>
            {/* Column headers */}
            <div className="flex justify-between text-center mb-3 text-[10px] font-bold tracking-widest uppercase text-gray-400">
                <span className="w-1/3">Hour</span>
                <span className="w-1/3">Min</span>
                <span className="w-1/3">AM/PM</span>
            </div>

            <div className="flex h-36" style={{ borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6" }}>
                {/* Hours scroll */}
                <div ref={hoursScrollRef}
                    className="w-1/3 overflow-y-auto text-center snap-y snap-mandatory scroll-smooth"
                    style={{ scrollbarWidth: "none" }}
                    onWheel={(e) => e.stopPropagation()}>
                    {hoursArr.map((h) => {
                        const isPast = isTimeInPast(h, minutes, ampm);
                        const isSel = hours === h;
                        return (
                            <div key={h} data-hour={h}
                                onClick={() => !isPast && setHours(h)}
                                className={`py-2.5 snap-center text-center transition-colors
                                    ${isSel ? "font-bold text-xl" : "text-base"}
                                    ${isPast ? "opacity-25 cursor-not-allowed" : "cursor-pointer"}`}
                                style={{ color: isSel ? "#2563eb" : isPast ? "#d1d5db" : "#374151" }}>
                                {h}
                            </div>
                        );
                    })}
                </div>

                {/* Minutes scroll */}
                <div ref={minutesScrollRef}
                    className="w-1/3 overflow-y-auto text-center snap-y snap-mandatory scroll-smooth"
                    style={{ borderLeft: "1px solid #f3f4f6", borderRight: "1px solid #f3f4f6", scrollbarWidth: "none" }}
                    onWheel={(e) => e.stopPropagation()}>
                    {minutesArr.map((m) => {
                        const isPast = isTimeInPast(hours, m, ampm);
                        const isSel = minutes === m;
                        return (
                            <div key={m} data-minute={m}
                                onClick={() => !isPast && setMinutes(m)}
                                className={`py-2.5 snap-center text-center transition-colors
                                    ${isSel ? "font-bold text-xl" : "text-base"}
                                    ${isPast ? "opacity-25 cursor-not-allowed" : "cursor-pointer"}`}
                                style={{ color: isSel ? "#2563eb" : isPast ? "#d1d5db" : "#374151" }}>
                                {m}
                            </div>
                        );
                    })}
                </div>

                {/* AM/PM */}
                <div className="w-1/3 flex flex-col justify-center items-center gap-2">
                    {["AM", "PM"].map((p) => (
                        <button key={p} type="button" onClick={() => setAmpm(p)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
                            style={ampm === p
                                ? { backgroundColor: "#2563eb", color: "#fff", borderColor: "#2563eb" }
                                : { backgroundColor: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {!isTimeValid && (
                <p className="text-xs text-red-500 text-center mt-2">Cannot select a time in the past</p>
            )}

            <button type="button" onClick={handleConfirm} disabled={!isTimeValid}
                className={`w-full mt-3 font-bold py-2.5 rounded-lg text-sm transition-all
                    ${isTimeValid ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                Set Pickup Time
            </button>
        </div>
    );
};

// ── ADMIN DATE PICKER (light theme) ───────────────────────────────────────────
const AdminDatePicker = ({ value, onChange, onClose, btnRef }) => {
    const wrapperRef = useRef(null);
    useClickOutside(wrapperRef, onClose);

    const [current, setCurrent] = useState(new Date(value || new Date()));
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const isPrevDisabled = year === today.getFullYear() && month === today.getMonth();

    const prevMonth = () => { if (!isPrevDisabled) setCurrent(new Date(year, month - 1, 1)); };
    const nextMonth = () => setCurrent(new Date(year, month + 1, 1));
    const handleDayClick = (day) => {
        const sel = new Date(year, month, day);
        if (sel < today) return;
        onChange(sel);
        onClose();
    };

    const isToday = (d) => d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
    const isSelected = (d) => value && d === value.getDate() && month === value.getMonth() && year === value.getFullYear();
    const isPast = (d) => new Date(year, month, d) < today;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div ref={wrapperRef}
            className="z-[999999] bg-white rounded-xl shadow-2xl border border-gray-200 p-4"
            style={getPickerStyle(btnRef, 292)}>
            {/* Month header */}
            <div className="mb-3 flex justify-between items-center">
                <span className="font-bold text-base text-gray-800">{monthNames[month]} {year}</span>
                <div className="flex gap-1">
                    <button type="button" onClick={prevMonth} disabled={isPrevDisabled}
                        className={`p-1.5 rounded-full transition-colors ${isPrevDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-100"}`}>
                        <ChevronLeft size={17} className="text-gray-500" />
                    </button>
                    <button type="button" onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronRight size={17} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold mb-2 uppercase tracking-wide text-blue-500">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <div key={d}>{d}</div>)}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const disabled = isPast(day);
                    const selected = isSelected(day);
                    const todayDay = isToday(day);
                    return (
                        <div key={day}
                            onClick={() => !disabled && handleDayClick(day)}
                            className="h-9 w-9 mx-auto flex items-center justify-center rounded-full transition-all duration-150"
                            style={
                                selected ? { backgroundColor: "#2563eb", color: "#fff", fontWeight: "bold", cursor: "pointer" }
                                    : todayDay ? { border: "2px solid #2563eb", color: "#2563eb", fontWeight: "bold", cursor: "pointer" }
                                        : disabled ? { color: "#d1d5db", cursor: "default" }
                                            : { color: "#374151", cursor: "pointer" }
                            }
                            onMouseEnter={(e) => { if (!disabled && !selected) e.currentTarget.style.backgroundColor = "#eff6ff"; }}
                            onMouseLeave={(e) => { if (!disabled && !selected) e.currentTarget.style.backgroundColor = "transparent"; }}>
                            {day}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── ADMIN DURATION PICKER (light theme) ───────────────────────────────────────
const AdminDurationPicker = ({ value, onChange, onClose, btnRef }) => {
    const wrapperRef = useRef(null);
    useClickOutside(wrapperRef, onClose);
    const hoursOptions = Array.from({ length: 23 }, (_, i) => i + 2);

    return (
        <div ref={wrapperRef}
            className="z-[999999] bg-white rounded-xl shadow-2xl border border-gray-200 p-3"
            style={{ ...getPickerStyle(btnRef, 196), maxHeight: 240, overflowY: "auto" }}>
            <h4 className="font-bold mb-2 text-center text-[10px] tracking-widest uppercase text-gray-400">
                Duration
            </h4>
            <div style={{ scrollbarWidth: "thin" }}>
                {hoursOptions.map((h) => (
                    <div key={h}
                        onClick={() => { onChange(h); onClose(); }}
                        className="py-2 px-3 cursor-pointer rounded-lg mb-0.5 text-center text-sm transition-all"
                        style={value === h
                            ? { backgroundColor: "#eff6ff", color: "#2563eb", fontWeight: "700" }
                            : { color: "#374151" }}
                        onMouseEnter={(e) => { if (value !== h) e.currentTarget.style.backgroundColor = "#f9fafb"; }}
                        onMouseLeave={(e) => { if (value !== h) e.currentTarget.style.backgroundColor = "transparent"; }}>
                        {h} hours
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── MODAL DROPDOWN (light, for white admin modal) ─────────────────────────────
const ModalDropdown = ({ value, onChange, options, placeholder = "Select…", error, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);
    const selectedOption = options.find((o) => o.value === value);

    useClickOutside(dropdownRef, () => setIsOpen(false));

    // Close on scroll so the panel doesn't float away from its trigger
    useEffect(() => {
        if (!isOpen) return;
        const close = () => setIsOpen(false);
        window.addEventListener("scroll", close, true);
        return () => window.removeEventListener("scroll", close, true);
    }, [isOpen]);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button
                ref={buttonRef}
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white text-sm transition-all outline-none
                    ${disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : error ? "border-red-400" : isOpen ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}
            >
                <span className={selectedOption ? "text-gray-900 font-medium" : "text-gray-400"}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={15} className={isOpen ? "text-blue-500" : "text-gray-400"} />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.15 }}
                        // Use fixed positioning via getPickerStyle so overflow:hidden / overflow-y-auto
                        // on the modal form doesn't clip the dropdown panel
                        style={{
                            ...getPickerStyle(buttonRef, buttonRef.current?.offsetWidth),
                            zIndex: 999999,
                            maxHeight: 220,
                            overflowY: "auto",
                        }}
                        className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {options.map((opt) => {
                            const isSel = opt.value === value;
                            return (
                                <button
                                    key={opt.value || `opt-${opt.label}`}
                                    type="button"
                                    onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm transition-colors
                                        ${isSel ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                                >
                                    <span>{opt.label}</span>
                                    {isSel && <Check size={15} className="text-blue-600" strokeWidth={3} />}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── COMPACT SUB-COMPONENTS ────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, colorClass }) => (
    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2 mb-3">
        <Icon size={14} className={colorClass} />
        {title}
    </h3>
);

const CompactInput = ({ label, icon: Icon, error, className = "", ...props }) => (
    <div className={`flex flex-col gap-1 ${className}`}>
        <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1">
            {Icon && <Icon size={12} />} {label} {props.required && <span className="text-red-400">*</span>}
        </label>
        <input
            {...props}
            className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all bg-white
                ${error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"}`}
        />
        {error && <span className="text-[10px] text-red-500 mt-0.5 ml-1">{error}</span>}
    </div>
);

const CountryCodeSelect = ({ value, onChange }) => (
    <div className="relative">
        <select value={value} onChange={onChange}
            className="px-2 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 outline-none focus:border-blue-500 appearance-none cursor-pointer pr-6"
            style={{ minWidth: 68 }}>
            {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
        </select>
        <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const CreateLeadModal = ({ isOpen, onClose, onCreate }) => {
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingVehicles, setIsLoadingVehicles] = useState(false);
    const [activePicker, setActivePicker] = useState(null); // 'date' | 'time' | 'duration' | null
    const [prevLocations, setPrevLocations] = useState({ pickup: "", dropoff: "", serviceType: "oneway" });

    // Google Maps
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_LIBRARIES,
    });

    const pickupAutocompleteRef = useRef(null);
    const dropoffAutocompleteRef = useRef(null);
    const pickupInputRef = useRef(null);
    const dropoffInputRef = useRef(null);

    // Refs for each picker trigger button (used to position panels via fixed placement)
    const dateBtnRef = useRef(null);
    const timeBtnRef = useRef(null);
    const durationBtnRef = useRef(null);

    const defaultTime = computeDefaultTime(null);
    const defaultTimeStr = `${defaultTime.hours}:${defaultTime.minutes} ${defaultTime.ampm}`;

    const [formData, setFormData] = useState({
        pickupAddress: "",
        dropoffAddress: "",
        pickupDate: getTodayDate(),
        pickupTime: defaultTimeStr,
        serviceType: "oneway",
        hours: 2,
        vehicleId: "",
        pricing: { basePrice: 0, airportCharges: 0, congestionCharge: 0, vatRate: 20, tax: 0, totalPrice: 0 },
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+44",
        phone: "",
        numberOfPassengers: 1,
        numberOfSuitcases: 0,
        specialInstructions: "",
        status: "pending",
        paymentStatus: "pending",
        skipEmails: false,
    });

    const [errors, setErrors] = useState({});

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                pickupAddress: "",
                dropoffAddress: "",
                pickupDate: getTodayDate(),
                pickupTime: defaultTimeStr,
                serviceType: "oneway",
                hours: 2,
                vehicleId: "",
                pricing: { basePrice: 0, airportCharges: 0, congestionCharge: 0, vatRate: 20, tax: 0, totalPrice: 0 },
                firstName: "",
                lastName: "",
                email: "",
                countryCode: "+44",
                phone: "",
                numberOfPassengers: 1,
                numberOfSuitcases: 0,
                specialInstructions: "",
                status: "pending",
                paymentStatus: "pending",
                skipEmails: false,
            });
            setSelectedVehicle(null);
            setErrors({});
            setPrevLocations({ pickup: "", dropoff: "", serviceType: "oneway" });
        }
    }, [isOpen, defaultTimeStr]);

    // Load vehicles whenever modal opens - using searchVehiclesWithFare for dynamic pricing
    useEffect(() => {
        if (!isOpen) return;
        
        const loadVehicles = async () => {
            // Check if we have valid locations to search
            const canSearch = formData.serviceType === "hourly" 
                ? !!formData.pickupAddress 
                : !!(formData.pickupAddress && formData.dropoffAddress);
            
            if (!canSearch) {
                // No locations yet, just load all vehicles without pricing
                try {
                    setIsLoadingVehicles(true);
                    const res = await vehicleAPI.getAllVehicles();
                    if (res.success) setVehicles(res.data || []);
                } catch (err) {
                    console.error("Error loading vehicles:", err);
                } finally {
                    setIsLoadingVehicles(false);
                }
                return;
            }

            // Have locations - search with fare calculation
            try {
                setIsLoadingVehicles(true);
                const searchData = {
                    pickupAddress: formData.pickupAddress,
                    dropoffAddress: formData.serviceType === "hourly" ? formData.pickupAddress : formData.dropoffAddress,
                    pickupDate: formData.pickupDate instanceof Date ? formData.pickupDate.toISOString().split("T")[0] : "",
                    pickupTime: formData.pickupTime || "12:00",
                    bookingType: formData.serviceType === "hourly" ? "hourly" : "p2p",
                    hours: formData.serviceType === "hourly" ? formData.hours || 2 : undefined,
                };
                
                const res = await vehicleAPI.searchVehiclesWithFare(searchData);
                if (res.success) {
                    setVehicles(res.data || []);
                }
            } catch (err) {
                console.error("Error searching vehicles:", err);
                // Fallback to getAllVehicles
                const res = await vehicleAPI.getAllVehicles();
                if (res.success) setVehicles(res.data || []);
            } finally {
                setIsLoadingVehicles(false);
            }
        };

        loadVehicles();
    }, [isOpen]);

    // Track location changes and refetch vehicles with new pricing
    useEffect(() => {
        const currentLocations = {
            pickup: formData.pickupAddress,
            dropoff: formData.dropoffAddress,
            serviceType: formData.serviceType,
        };

        const hasLocations = formData.serviceType === "hourly"
            ? !!formData.pickupAddress
            : !!(formData.pickupAddress && formData.dropoffAddress);

        // If locations changed and we have valid addresses, refetch vehicles
        if (
            hasLocations &&
            (currentLocations.pickup !== prevLocations.pickup ||
                currentLocations.dropoff !== prevLocations.dropoff ||
                currentLocations.serviceType !== prevLocations.serviceType)
        ) {
            // Clear selected vehicle when locations change
            if (selectedVehicle) {
                setSelectedVehicle(null);
                setFormData((prev) => ({ ...prev, vehicleId: "" }));
            }

            const loadVehiclesWithPricing = async () => {
                try {
                    setIsLoadingVehicles(true);
                    const searchData = {
                        pickupAddress: formData.pickupAddress,
                        dropoffAddress: formData.serviceType === "hourly" ? formData.pickupAddress : formData.dropoffAddress,
                        pickupDate: formData.pickupDate instanceof Date ? formData.pickupDate.toISOString().split("T")[0] : "",
                        pickupTime: formData.pickupTime || "12:00",
                        bookingType: formData.serviceType === "hourly" ? "hourly" : "p2p",
                        hours: formData.serviceType === "hourly" ? formData.hours || 2 : undefined,
                    };

                    const res = await vehicleAPI.searchVehiclesWithFare(searchData);
                    if (res.success) {
                        setVehicles(res.data || []);
                    }
                } catch (err) {
                    console.error("Error recalculating fares:", err);
                } finally {
                    setIsLoadingVehicles(false);
                }
            };

            loadVehiclesWithPricing();
            setPrevLocations(currentLocations);
        }
    }, [formData.pickupAddress, formData.dropoffAddress, formData.serviceType]);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleVehicleChange = (vehicleId) => {
        const vehicle = vehicles.find((v) => v._id === vehicleId);
        setSelectedVehicle(vehicle || null);
        setFormData((prev) => ({
            ...prev,
            vehicleId,
            pricing: vehicle ? {
                basePrice: vehicle.pricing?.basePrice || 0,
                airportCharges: 0,
                congestionCharge: 0,
                vatRate: 20,
                tax: vehicle.pricing?.basePrice ? vehicle.pricing.basePrice * 0.2 : 0,
                totalPrice: vehicle.pricing?.totalPrice || 0,
            } : prev.pricing,
        }));
        if (errors.vehicleId) setErrors((prev) => ({ ...prev, vehicleId: null }));
    };

    // Autocomplete handlers — instance stored in ref by onLoad; onPlaceChanged calls getPlace()
    const handlePickupPlaceChanged = () => {
        if (!pickupAutocompleteRef.current) return;
        try {
            const place = pickupAutocompleteRef.current.getPlace();
            if (!place) return;
            let addr = "";
            if (place?.name && place?.formatted_address) {
                addr = place.formatted_address.includes(place.name)
                    ? place.formatted_address
                    : `${place.name}, ${place.formatted_address}`;
            } else {
                addr = place?.formatted_address || place?.name || "";
            }
            if (addr) {
                updateField("pickupAddress", addr);
                if (pickupInputRef.current) pickupInputRef.current.value = addr;
            }
        } catch (e) { console.error(e); }
    };

    const handleDropoffPlaceChanged = () => {
        if (!dropoffAutocompleteRef.current) return;
        try {
            const place = dropoffAutocompleteRef.current.getPlace();
            if (!place) return;
            let addr = "";
            if (place?.name && place?.formatted_address) {
                addr = place.formatted_address.includes(place.name)
                    ? place.formatted_address
                    : `${place.name}, ${place.formatted_address}`;
            } else {
                addr = place?.formatted_address || place?.name || "";
            }
            if (addr) {
                updateField("dropoffAddress", addr);
                if (dropoffInputRef.current) dropoffInputRef.current.value = addr;
            }
        } catch (e) { console.error(e); }
    };

    const isPickupTimeInPast = () => {
        if (!formData.pickupTime || !formData.pickupDate) return false;
        const { h: ukH, m: ukM } = getUKHourMinute();
        const isToday = formData.pickupDate.toDateString() === new Date().toDateString();
        if (!isToday) return false;
        const [time, period] = formData.pickupTime.split(" ");
        const [h, m] = time.split(":");
        let hour24 = parseInt(h);
        if (period === "PM" && hour24 !== 12) hour24 += 12;
        if (period === "AM" && hour24 === 12) hour24 = 0;
        const totalMins = ukH * 60 + ukM + 30;
        const roundedMins = Math.ceil(totalMins / 30) * 30;
        const minH24 = Math.floor(roundedMins / 60) % 24;
        const minMin = roundedMins % 60;
        return hour24 < minH24 || (hour24 === minH24 && parseInt(m) < minMin);
    };

    const validateForm = () => {
        const e = {};
        if (!formData.pickupAddress.trim()) e.pickupAddress = "Pickup address is required";
        if (!formData.dropoffAddress.trim() && formData.serviceType !== "hourly")
            e.dropoffAddress = "Dropoff address is required";
        if (!formData.pickupDate) e.pickupDate = "Pickup date is required";
        if (!formData.pickupTime) e.pickupTime = "Pickup time is required";
        else if (isPickupTimeInPast()) e.pickupTime = "Cannot select a time in the past";
        if (!formData.vehicleId) e.vehicleId = "Vehicle selection is required";
        if (!formData.firstName.trim()) e.firstName = "First name is required";
        if (!formData.lastName.trim()) e.lastName = "Last name is required";
        if (!formData.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email";
        if (!formData.phone.trim()) e.phone = "Phone number is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) { toast.error("Please fill all required fields correctly"); return; }

        setIsLoading(true);
        try {
            const pickupDateStr = formData.pickupDate instanceof Date
                ? formData.pickupDate.toISOString().split("T")[0]
                : formData.pickupDate;

            const payload = {
                pickup: { address: formData.pickupAddress },
                dropoff: { address: formData.serviceType === "hourly" ? formData.pickupAddress : formData.dropoffAddress },
                pickupDate: pickupDateStr,
                pickupTime: formData.pickupTime,
                serviceType: formData.serviceType,
                journeyInfo: { hours: formData.serviceType === "hourly" ? formData.hours : undefined },
                vehicleId: formData.vehicleId,
                vehicleDetails: selectedVehicle ? {
                    categoryName: selectedVehicle.categoryName,
                    categoryDetails: selectedVehicle.categoryDetails,
                    numberOfPassengers: selectedVehicle.numberOfPassengers,
                    numberOfBigLuggage: selectedVehicle.numberOfBigLuggage,
                } : {},
                pricing: selectedVehicle?.pricing || formData.pricing,
                passengerDetails: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    countryCode: formData.countryCode,
                    phone: formData.phone,
                    numberOfPassengers: formData.numberOfPassengers,
                    numberOfSuitcases: formData.numberOfSuitcases,
                },
                isBookingForSomeoneElse: false,
                guestDetails: null,
                isAirportPickup: false,
                flightDetails: { isAirportPickup: false },
                specialInstructions: formData.specialInstructions,
                status: formData.status,
                paymentStatus: formData.paymentStatus,
            };

            const res = await bookingAPI.createBooking(payload);
            if (res.success) {
                toast.success(`Lead created! Ref: ${res.data.bookingNumber || res.data._id}`);
                onCreate();
                onClose();
            } else {
                toast.error(res.message || "Failed to create lead");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || err.response?.data?.error || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const vehicleOptions = vehicles.map((v) => ({
        value: v._id,
        label: `${v.categoryName} — £${v.pricing?.totalPrice || 0}`,
    }));

    return (
        <AnimatePresence>
            {/* White-themed pac-container injection — must be here so it activates with modal */}
            <style>{pacStyles}</style>

            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[99998] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col border border-gray-100"
                    style={{ overflow: "hidden" }}>

                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">New Booking Lead</h2>
                            <p className="text-[12px] text-gray-500">Quickly create a manual reservation</p>
                        </div>
                        <button type="button" onClick={onClose}
                            className="p-2 hover:bg-white hover:shadow-sm rounded-full transition-all border border-transparent hover:border-gray-200">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Form — overflow-y-auto is on this element, NOT the pickers */}
                    <form id="create-lead-form"
                        className="flex-1 overflow-y-auto p-6 grid grid-cols-12 gap-6 bg-white"
                        onSubmit={handleSubmit}>

                        {/* ── LEFT: Journey & Vehicle ── */}
                        <div className="col-span-12 lg:col-span-7 space-y-6">
                            <section>
                                <SectionHeader icon={MapPin} title="Journey Details" colorClass="text-blue-500" />
                                <div className="grid grid-cols-2 gap-3">

                                    {/* Pickup address */}
                                    <div className="col-span-2">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1 mb-1">
                                            <MapPin size={12} /> Pickup Address <span className="text-red-400">*</span>
                                        </label>
                                        {isLoaded ? (
                                            <Autocomplete
                                                onLoad={(ac) => { pickupAutocompleteRef.current = ac; }}
                                                onPlaceChanged={handlePickupPlaceChanged}
                                                options={{ fields: ["formatted_address", "geometry", "name"], strictBounds: false }}>
                                                <input ref={pickupInputRef} type="text"
                                                    placeholder="Street, City, Postcode"
                                                    defaultValue={formData.pickupAddress}
                                                    onChange={(e) => updateField("pickupAddress", e.target.value)}
                                                    className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all bg-white
                                                        ${errors.pickupAddress ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"}`} />
                                            </Autocomplete>
                                        ) : (
                                            <input type="text" disabled placeholder="Loading Maps…"
                                                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-400" />
                                        )}
                                        {errors.pickupAddress && <span className="text-[10px] text-red-500 ml-1">{errors.pickupAddress}</span>}
                                    </div>

                                    {/* Dropoff address */}
                                    {formData.serviceType !== "hourly" && (
                                        <div className="col-span-2">
                                            <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1 mb-1">
                                                <MapPin size={12} /> Dropoff Address <span className="text-red-400">*</span>
                                            </label>
                                            {isLoaded ? (
                                                <Autocomplete
                                                    onLoad={(ac) => { dropoffAutocompleteRef.current = ac; }}
                                                    onPlaceChanged={handleDropoffPlaceChanged}
                                                    options={{ fields: ["formatted_address", "geometry", "name"], strictBounds: false }}>
                                                    <input ref={dropoffInputRef} type="text"
                                                        placeholder="Destination"
                                                        defaultValue={formData.dropoffAddress}
                                                        onChange={(e) => updateField("dropoffAddress", e.target.value)}
                                                        className={`w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all bg-white
                                                            ${errors.dropoffAddress ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100"}`} />
                                                </Autocomplete>
                                            ) : (
                                                <input type="text" disabled placeholder="Loading Maps…"
                                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-100 text-gray-400" />
                                            )}
                                            {errors.dropoffAddress && <span className="text-[10px] text-red-500 ml-1">{errors.dropoffAddress}</span>}
                                        </div>
                                    )}

                                    {/* Date picker */}
                                    <div className="col-span-1 flex flex-col gap-1">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1">
                                            <Calendar size={12} /> Date <span className="text-red-400">*</span>
                                        </label>
                                        <button ref={dateBtnRef} type="button"
                                            onClick={() => setActivePicker(activePicker === "date" ? null : "date")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white outline-none transition-all
                                                ${errors.pickupDate ? "border-red-400" : activePicker === "date" ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}>
                                            <span className={formData.pickupDate ? "text-gray-800" : "text-gray-400"}>
                                                {formData.pickupDate ? formatDateDisplay(formData.pickupDate) : "Select date"}
                                            </span>
                                            <Calendar size={14} className="text-gray-400" />
                                        </button>
                                        {errors.pickupDate && <span className="text-[10px] text-red-500 ml-1">{errors.pickupDate}</span>}
                                        {activePicker === "date" && (
                                            <AdminDatePicker
                                                btnRef={dateBtnRef}
                                                value={formData.pickupDate}
                                                onChange={(d) => { updateField("pickupDate", d); setActivePicker(null); }}
                                                onClose={() => setActivePicker(null)}
                                            />
                                        )}
                                    </div>

                                    {/* Time picker */}
                                    <div className="col-span-1 flex flex-col gap-1">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1">
                                            <Clock size={12} /> Time <span className="text-red-400">*</span>
                                        </label>
                                        <button ref={timeBtnRef} type="button"
                                            onClick={() => setActivePicker(activePicker === "time" ? null : "time")}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white outline-none transition-all
                                                ${errors.pickupTime ? "border-red-400" : activePicker === "time" ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}>
                                            <span className={formData.pickupTime ? "text-gray-800" : "text-gray-400"}>
                                                {formatTimeDisplay(formData.pickupTime)}
                                            </span>
                                            <Clock size={14} className="text-gray-400" />
                                        </button>
                                        {errors.pickupTime && <span className="text-[10px] text-red-500 ml-1">{errors.pickupTime}</span>}
                                        {activePicker === "time" && (
                                            <AdminTimePicker
                                                btnRef={timeBtnRef}
                                                value={formData.pickupTime}
                                                selectedDate={formData.pickupDate}
                                                onChange={(t) => { updateField("pickupTime", t); setActivePicker(null); }}
                                                onClose={() => setActivePicker(null)}
                                            />
                                        )}
                                    </div>

                                    {/* Duration (hourly only) */}
                                    {formData.serviceType === "hourly" && (
                                        <div className="col-span-1 flex flex-col gap-1">
                                            <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1">
                                                <Timer size={12} /> Duration <span className="text-red-400">*</span>
                                            </label>
                                            <button ref={durationBtnRef} type="button"
                                                onClick={() => setActivePicker(activePicker === "duration" ? null : "duration")}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-lg bg-white outline-none transition-all
                                                    ${activePicker === "duration" ? "border-blue-500 ring-1 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}>
                                                <span className="text-gray-800">{formData.hours} hours</span>
                                                <ChevronDown size={14} className="text-gray-400" />
                                            </button>
                                            {activePicker === "duration" && (
                                                <AdminDurationPicker
                                                    btnRef={durationBtnRef}
                                                    value={formData.hours}
                                                    onChange={(h) => { updateField("hours", h); setActivePicker(null); }}
                                                    onClose={() => setActivePicker(null)}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Service Type */}
                                    <div className="col-span-1 flex flex-col gap-1">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1">
                                            <Car size={12} /> Service Type
                                        </label>
                                        <ModalDropdown
                                            value={formData.serviceType}
                                            onChange={(val) => {
                                                updateField("serviceType", val);
                                                if (val === "hourly") updateField("dropoffAddress", "");
                                            }}
                                            options={SERVICE_TYPES}
                                            placeholder="Select service…"
                                        />
                                    </div>

                                    {/* Vehicle */}
                                    <div className="col-span-1 flex flex-col gap-1 relative">
                                        <label className="text-[11px] font-semibold text-gray-500 ml-1 flex items-center gap-1">
                                            <Car size={12} /> Vehicle <span className="text-red-400">*</span>
                                        </label>
                                        {/* Loading Overlay */}
                                        {isLoadingVehicles && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-lg backdrop-blur-sm">
                                                <div className="flex items-center gap-2">
                                                    <Loader2 size={16} className="animate-spin text-blue-600" />
                                                    <span className="text-xs font-semibold text-gray-600">Calculating fares...</span>
                                                </div>
                                            </div>
                                        )}
                                        <ModalDropdown
                                            value={formData.vehicleId}
                                            onChange={handleVehicleChange}
                                            options={vehicleOptions}
                                            placeholder={vehicles.length === 0 ? (isLoadingVehicles ? "Loading vehicles..." : "Enter locations to see prices") : "Select a vehicle…"}
                                            error={errors.vehicleId}
                                            disabled={isLoadingVehicles}
                                        />
                                        {errors.vehicleId && <span className="text-[10px] text-red-500 ml-1">{errors.vehicleId}</span>}
                                    </div>
                                </div>
                            </section>

                            {/* Selected Vehicle Card */}
                            {selectedVehicle && (
                                <section>
                                    <SectionHeader icon={Car} title="Selected Vehicle" colorClass="text-indigo-500" />
                                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                        <img src={selectedVehicle.image?.url} className="w-16 h-10 object-contain mix-blend-multiply" alt="car" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-blue-900">{selectedVehicle.categoryName}</p>
                                            <p className="text-[11px] text-blue-700">{selectedVehicle.numberOfPassengers} Pax • {selectedVehicle.numberOfBigLuggage} Bags</p>
                                        </div>
                                        <p className="text-lg font-black text-blue-600">£{selectedVehicle.pricing?.totalPrice}</p>
                                    </motion.div>
                                </section>
                            )}
                        </div>

                        {/* ── RIGHT: Passenger Info ── */}
                        <div className="col-span-12 lg:col-span-5 space-y-6 border-l border-gray-100 pl-0 lg:pl-6">
                            <section>
                                <SectionHeader icon={User} title="Passenger Information" colorClass="text-green-500" />
                                <div className="grid grid-cols-2 gap-3">
                                    <CompactInput label="First Name" icon={User} value={formData.firstName}
                                        onChange={(e) => updateField("firstName", e.target.value)} error={errors.firstName} required />
                                    <CompactInput label="Last Name" icon={User} value={formData.lastName}
                                        onChange={(e) => updateField("lastName", e.target.value)} error={errors.lastName} required />
                                    <CompactInput label="Email" icon={Mail} className="col-span-2" type="email"
                                        value={formData.email} onChange={(e) => updateField("email", e.target.value)} error={errors.email} required />
                                    <div className="col-span-2 flex gap-2 items-end">
                                        <CountryCodeSelect value={formData.countryCode} onChange={(e) => updateField("countryCode", e.target.value)} />
                                        <CompactInput label="Phone" icon={Phone} className="flex-1" value={formData.phone}
                                            onChange={(e) => updateField("phone", e.target.value)} error={errors.phone} required />
                                    </div>
                                    <CompactInput label="Passengers" icon={Users} type="number" min="1" max="8"
                                        value={formData.numberOfPassengers}
                                        onChange={(e) => updateField("numberOfPassengers", parseInt(e.target.value) || 1)} />
                                    <CompactInput label="Suitcases" icon={Briefcase} type="number" min="0" max="20"
                                        value={formData.numberOfSuitcases}
                                        onChange={(e) => updateField("numberOfSuitcases", parseInt(e.target.value) || 0)} />
                                </div>
                            </section>

                            <section>
                                <CompactInput label="Special Instructions" icon={FileText}
                                    placeholder="Notes for the driver…"
                                    value={formData.specialInstructions}
                                    onChange={(e) => updateField("specialInstructions", e.target.value)} />
                            </section>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-gray-500">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="accent-gray-600"
                                        checked={formData.skipEmails}
                                        onChange={(e) => updateField("skipEmails", e.target.checked)} />
                                    Skip Email Notifications
                                </label>
                                <div className="flex items-center gap-2">
                                    <select value={formData.status} onChange={(e) => updateField("status", e.target.value)}
                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-blue-500">
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <select value={formData.paymentStatus} onChange={(e) => updateField("paymentStatus", e.target.value)}
                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none focus:border-blue-500">
                                        <option value="pending">Unpaid</option>
                                        <option value="paid">Paid</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 flex-shrink-0">
                                <button type="button" onClick={onClose}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors whitespace-nowrap">
                                    Cancel
                                </button>
                                <button type="submit" form="create-lead-form" disabled={isLoading}
                                    className="px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg shadow-lg hover:bg-black transition-all flex items-center gap-2 disabled:opacity-50 whitespace-nowrap">
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : "Create Lead"}
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CreateLeadModal;
