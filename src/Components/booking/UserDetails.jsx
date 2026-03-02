import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  User,
  Mail,
  Phone,
  Users,
  Briefcase,
  Plane,
  UserPlus,
  MessageSquare,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import StepNavBar from "./StepNavBar";

// Country codes data with flags
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
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+82", country: "KR", flag: "🇰🇷" },
  { code: "+65", country: "SG", flag: "🇸🇬" },
  { code: "+92", country: "PK", flag: "🇵🇰" },
  { code: "+880", country: "BD", flag: "🇧🇩" },
  { code: "+27", country: "ZA", flag: "🇿🇦" },
  { code: "+234", country: "NG", flag: "🇳🇬" },
];

// Country Code Dropdown Component
const CountryCodeDropdown = ({ value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCountry = countryCodes.find((c) => c.code === value) || countryCodes[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-3.5 border border-r-0 rounded-l-xl transition-colors min-w-[90px]"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderColor: 'rgba(255,255,255,0.1)',
          color: '#fff',
        }}
      >
        <span className="text-xl">{selectedCountry.flag}</span>
        <span className="text-sm font-medium">{selectedCountry.code}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} style={{ color: 'rgba(255,255,255,0.4)' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 mt-1 rounded-xl shadow-xl z-50 w-48 max-h-60 overflow-y-auto"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {countryCodes.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onChange(country.code);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 transition-colors"
                style={{
                  backgroundColor: value === country.code ? 'rgba(215,183,94,0.1)' : 'transparent',
                  color: value === country.code ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                }}
                onMouseEnter={(e) => { if (value !== country.code) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { if (value !== country.code) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span className="text-xl">{country.flag}</span>
                <span className="font-medium">{country.code}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>({country.country})</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, label, icon: Icon }) => (
  <label className="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-colors group"
    style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
  >
    <div className="flex items-center gap-3">
      {Icon && <Icon size={20} style={{ color: checked ? 'var(--color-primary)' : 'rgba(255,255,255,0.4)' }} className="transition-colors" />}
      <span className="font-medium text-white">{label}</span>
    </div>
    <div
      className="relative w-12 h-6 rounded-full transition-colors duration-300"
      style={{ backgroundColor: checked ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)' }}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        className="absolute top-1 w-4 h-4 rounded-full shadow-md"
        style={{ backgroundColor: checked ? 'var(--color-dark)' : 'rgba(255,255,255,0.6)' }}
        animate={{ left: checked ? "28px" : "4px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </div>
  </label>
);

// Input Field Component with optional filtering
const InputField = ({
  label,
  icon: Icon,
  required,
  error,
  className = "",
  filterType,
  onChange,
  ...props
}) => {
  const handleChange = (e) => {
    let value = e.target.value;

    if (filterType === 'name') {
      value = value.replace(/[^A-Za-z\s\-']/g, '');
    } else if (filterType === 'phone') {
      value = value.replace(/\D/g, '');
    }

    const syntheticEvent = { ...e, target: { ...e.target, value } };
    onChange?.(syntheticEvent);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {Icon && <Icon size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />}
        {label}
        {required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
      </label>
      <input
        {...props}
        onChange={handleChange}
        className="w-full px-4 py-3.5 border rounded-xl outline-none transition-all duration-200 placeholder:opacity-30 placeholder:text-white"
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)',
          color: '#fff',
        }}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

// Select Field Component
const SelectField = ({ label, icon: Icon, required, options, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
      {Icon && <Icon size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />}
      {label}
      {required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
    </label>
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 py-3.5 border rounded-xl outline-none appearance-none transition-all duration-200"
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.1)',
          color: '#fff',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.4)' }} />
    </div>
  </div>
);

// Phone Input Component
const PhoneInput = ({ countryCode, onCountryCodeChange, phone, onPhoneChange, label, required, error }) => {
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const digitsOnly = value.replace(/\D/g, '');
    onPhoneChange(digitsOnly);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
        <Phone size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />
        {label}
        {required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
      </label>
      <div className="flex">
        <CountryCodeDropdown value={countryCode} onChange={onCountryCodeChange} />
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
          inputMode="numeric"
          pattern="[0-9]*"
          className="flex-1 px-4 py-3.5 border rounded-r-xl outline-none transition-all duration-200 placeholder:opacity-30 placeholder:text-white"
          style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)',
            color: '#fff',
          }}
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

// Main UserDetails Component
function UserDetails({ data, updateData, onNext, onBack, isLoading = false }) {
  const [formData, setFormData] = useState({
    firstName: data?.passengerDetails?.firstName || "",
    lastName: data?.passengerDetails?.lastName || "",
    email: data?.passengerDetails?.email || "",
    countryCode: data?.passengerDetails?.countryCode || "+44",
    phone: data?.passengerDetails?.phone || "",
    numberOfPassengers: data?.passengerDetails?.numberOfPassengers || 1,
    numberOfSuitcases: data?.passengerDetails?.numberOfSuitcases || 0,
    isBookingForSomeoneElse: data?.passengerDetails?.isBookingForSomeoneElse || false,
    guestFirstName: data?.passengerDetails?.guestFirstName || "",
    guestLastName: data?.passengerDetails?.guestLastName || "",
    guestCountryCode: data?.passengerDetails?.guestCountryCode || "+44",
    guestPhone: data?.passengerDetails?.guestPhone || "",
    guestEmail: data?.passengerDetails?.guestEmail || "",
    isAirportPickup: data?.flightDetails?.isAirportPickup || false,
    flightNumber: data?.flightDetails?.flightNumber || "",
    nameBoard: data?.flightDetails?.nameBoard || "",
    additionalRequirements: data?.specialInstructions || "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const namePattern = /^[A-Za-z\s\-']+$/;
    const phonePattern = /^\d+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!namePattern.test(formData.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!namePattern.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phonePattern.test(formData.phone.trim())) {
      newErrors.phone = "Phone number can only contain digits";
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = "Phone number is too short";
    }

    if (formData.isBookingForSomeoneElse) {
      if (!formData.guestFirstName.trim()) {
        newErrors.guestFirstName = "Passenger's first name is required";
      } else if (!namePattern.test(formData.guestFirstName.trim())) {
        newErrors.guestFirstName = "First name can only contain letters";
      }

      if (!formData.guestLastName.trim()) {
        newErrors.guestLastName = "Passenger's last name is required";
      } else if (!namePattern.test(formData.guestLastName.trim())) {
        newErrors.guestLastName = "Last name can only contain letters";
      }

      if (!formData.guestEmail.trim()) {
        newErrors.guestEmail = "Passenger's email is required";
      } else if (!emailPattern.test(formData.guestEmail)) {
        newErrors.guestEmail = "Please enter a valid email address";
      }

      if (formData.guestPhone.trim() && !phonePattern.test(formData.guestPhone.trim())) {
        newErrors.guestPhone = "Phone number can only contain digits";
      }
    }

    if (formData.isAirportPickup) {
      if (!formData.flightNumber.trim()) newErrors.flightNumber = "Flight number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const passengerDetailsData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      countryCode: formData.countryCode,
      phone: formData.phone,
      numberOfPassengers: formData.numberOfPassengers,
      numberOfSuitcases: formData.numberOfSuitcases,
      isBookingForSomeoneElse: formData.isBookingForSomeoneElse,
      guestFirstName: formData.guestFirstName,
      guestLastName: formData.guestLastName,
      guestCountryCode: formData.guestCountryCode,
      guestPhone: formData.guestPhone,
      guestEmail: formData.guestEmail,
    };

    const flightDetailsData = {
      isAirportPickup: formData.isAirportPickup,
      flightNumber: formData.flightNumber,
      nameBoard: formData.nameBoard,
    };

    const specialInstructionsData = formData.additionalRequirements;

    updateData("passengerDetails", passengerDetailsData);
    updateData("flightDetails", flightDetailsData);
    updateData("specialInstructions", specialInstructionsData);

    onNext({
      passengerDetails: passengerDetailsData,
      flightDetails: flightDetailsData,
      specialInstructions: specialInstructionsData,
    });
  };

  const passengerOptions = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} ${i === 0 ? "Passenger" : "Passengers"}`,
  }));

  const suitcaseOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: `${i} ${i === 1 ? "Suitcase" : "Suitcases"}`,
  }));

  return (
    <div className="py-2">
      <div className="w-full">
        {/* Header - compact, no icon */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-xl font-bold text-white">Your Details</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Please provide your contact information</p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl shadow-xl p-5 md:p-6 space-y-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Personal Information Section */}
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}>
                <User size={15} style={{ color: 'var(--color-primary)' }} />
              </div>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputField
                label="First Name"
                icon={User}
                required
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                error={errors.firstName}
                filterType="name"
              />
              <InputField
                label="Last Name"
                icon={User}
                required
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                error={errors.lastName}
                filterType="name"
              />
            </div>

            <PhoneInput
              countryCode={formData.countryCode}
              onCountryCodeChange={(code) => updateField("countryCode", code)}
              phone={formData.phone}
              onPhoneChange={(phone) => updateField("phone", phone)}
              label="Contact Number"
              required
              error={errors.phone}
            />

            <InputField
              label="Email Address"
              icon={Mail}
              required
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              error={errors.email}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SelectField
                label="Number of Passengers"
                icon={Users}
                required
                value={formData.numberOfPassengers}
                onChange={(e) => updateField("numberOfPassengers", parseInt(e.target.value))}
                options={passengerOptions}
              />
              <SelectField
                label="Number of Suitcases"
                icon={Briefcase}
                required
                value={formData.numberOfSuitcases}
                onChange={(e) => updateField("numberOfSuitcases", parseInt(e.target.value))}
                options={suitcaseOptions}
              />
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />

          {/* Toggle: Booking for someone else + its expansion */}
          <div className="space-y-2">
            <ToggleSwitch
              checked={formData.isBookingForSomeoneElse}
              onChange={(checked) => updateField("isBookingForSomeoneElse", checked)}
              label="Booking for someone else?"
              icon={UserPlus}
            />

            <AnimatePresence>
              {formData.isBookingForSomeoneElse && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'rgba(215,183,94,0.05)', border: '1px solid rgba(215,183,94,0.15)' }}>
                    <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                      <UserPlus size={16} style={{ color: 'var(--color-primary)' }} />
                      Passenger Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label="Passenger's First Name"
                        required
                        placeholder="Enter first name"
                        value={formData.guestFirstName}
                        onChange={(e) => updateField("guestFirstName", e.target.value)}
                        error={errors.guestFirstName}
                        filterType="name"
                      />
                      <InputField
                        label="Passenger's Last Name"
                        required
                        placeholder="Enter last name"
                        value={formData.guestLastName}
                        onChange={(e) => updateField("guestLastName", e.target.value)}
                        error={errors.guestLastName}
                        filterType="name"
                      />
                    </div>

                    <PhoneInput
                      countryCode={formData.guestCountryCode}
                      onCountryCodeChange={(code) => updateField("guestCountryCode", code)}
                      phone={formData.guestPhone}
                      onPhoneChange={(phone) => updateField("guestPhone", phone)}
                      label="Passenger's Contact Number"
                      error={errors.guestPhone}
                    />

                    <InputField
                      label="Passenger's Email"
                      icon={Mail}
                      required
                      type="email"
                      placeholder="Enter passenger's email"
                      value={formData.guestEmail}
                      onChange={(e) => updateField("guestEmail", e.target.value)}
                      error={errors.guestEmail}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Toggle: Airport Pickup + its expansion */}
          <div className="space-y-2">
            <ToggleSwitch
              checked={formData.isAirportPickup}
              onChange={(checked) => updateField("isAirportPickup", checked)}
              label="Airport Pickup?"
              icon={Plane}
            />

            <AnimatePresence>
              {formData.isAirportPickup && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: 'rgba(215,183,94,0.05)', border: '1px solid rgba(215,183,94,0.15)' }}>
                    <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                      <Plane size={16} style={{ color: 'var(--color-primary)' }} />
                      Flight Details
                    </h3>

                    <InputField
                      label="Flight Number"
                      icon={Plane}
                      required
                      placeholder="e.g., BA1234"
                      value={formData.flightNumber}
                      onChange={(e) => updateField("flightNumber", e.target.value.toUpperCase())}
                      error={errors.flightNumber}
                    />

                    <InputField
                      label="Name Board"
                      placeholder="Name to display on board"
                      value={formData.nameBoard}
                      onChange={(e) => updateField("nameBoard", e.target.value)}
                    />

                    <p className="text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: 'rgba(215,183,94,0.08)', color: 'var(--color-primary)' }}>
                      💡 Don't worry! Even if your flight is delayed, we'll monitor your flight and arrive on time, every time.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Additional Requirements */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <MessageSquare size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
              Additional Requirements
            </label>
            <textarea
              placeholder="Enter any special requirements or notes..."
              rows={2}
              value={formData.additionalRequirements}
              onChange={(e) => updateField("additionalRequirements", e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl outline-none resize-none transition-all duration-200 placeholder:opacity-30 placeholder:text-white text-sm"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <StepNavBar
          onBack={onBack}
          onContinue={handleSubmit}
          backLabel="BACK"
          continueLabel="PROCEED"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default UserDetails;