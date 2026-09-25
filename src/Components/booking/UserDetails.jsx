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
  Minus,
  Plus,
} from "lucide-react";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import StepNavBar from "./StepNavBar";
import PhoneField, { COUNTRIES, DEFAULT_COUNTRY, validatePhone } from "./PhoneField";

/* validateUkPhone removed — replaced by libphonenumber-js validatePhone from PhoneField */

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
const SelectField = ({ label, icon: Icon, required, options, error, ...props }) => (
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
          borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)',
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
    {error && <p className="text-sm text-red-400">{error}</p>}
  </div>
);

/* PhoneInput removed — replaced by <PhoneField> from PhoneField.jsx */

// Counter Field Component (for passengers, luggage, children)
const CounterField = ({ label, icon: Icon, required, value, onChange, min = 0, max = 10, error }) => {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="space-y-2">
      {/* Label Section */}
      <label className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {Icon && <Icon size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />}
        {label}
        {required && <span style={{ color: 'var(--color-primary)' }}>*</span>}
      </label>

      {/* Control Section */}
      <div
        className="flex items-center justify-between px-2 py-2 border rounded-xl"
        style={{
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.1)',
        }}
      >
        {/* Minus Button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-2 rounded-lg transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Minus size={20} style={{ color: '#fff' }} />
        </button>

        {/* Display Value */}
        <span className="text-lg font-semibold text-white">
          {value}
        </span>

        {/* Plus Button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-2 rounded-lg transition-colors hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={20} style={{ color: '#fff' }} />
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

// Stable module-level helper — converts a saved dial string like "+44" back to a country object.
// Defined outside the component so it never causes stale-closure warnings in the useEffect dep array.
const resolveCountry = (savedCode) => {
  if (!savedCode) return DEFAULT_COUNTRY;
  if (typeof savedCode === "object" && savedCode?.isoUpper) return savedCode;
  const dialDigits = String(savedCode).replace("+", "");
  return COUNTRIES.find((c) => c.dial === dialDigits) || DEFAULT_COUNTRY;
};

// Main UserDetails Component
const UserDetails = forwardRef(function UserDetails({ data, updateData, onNext, onBack, isLoading = false }, ref) {

  const [formData, setFormData] = useState({
    firstName: data?.passengerDetails?.firstName || "",
    lastName: data?.passengerDetails?.lastName || "",
    email: data?.passengerDetails?.email || "",
    countryObj: resolveCountry(data?.passengerDetails?.countryCode),
    phone: data?.passengerDetails?.phone || "",
    numberOfPassengers: data?.passengerDetails?.numberOfPassengers || 1,
    numberOfSuitcases: data?.passengerDetails?.numberOfSuitcases || 0,
    numberOfChildren: data?.passengerDetails?.numberOfChildren || 0,
    isBookingForSomeoneElse: data?.passengerDetails?.isBookingForSomeoneElse || false,
    guestFirstName: data?.passengerDetails?.guestFirstName || "",
    guestLastName: data?.passengerDetails?.guestLastName || "",
    guestCountryObj: resolveCountry(data?.passengerDetails?.guestCountryCode),
    guestPhone: data?.passengerDetails?.guestPhone || "",
    guestEmail: data?.passengerDetails?.guestEmail || "",
    isAirportPickup: data?.flightDetails?.isAirportPickup || false,
    flightNumber: data?.flightDetails?.flightNumber || "",
    nameBoard: data?.flightDetails?.nameBoard || "",
    additionalRequirements: data?.specialInstructions || "",
  });

  const [errors, setErrors] = useState({});

  // Sync formData with data when navigating back
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: data?.passengerDetails?.firstName || prev.firstName,
      lastName: data?.passengerDetails?.lastName || prev.lastName,
      email: data?.passengerDetails?.email || prev.email,
      countryObj: resolveCountry(data?.passengerDetails?.countryCode) || prev.countryObj,
      phone: data?.passengerDetails?.phone || prev.phone,
      numberOfPassengers: data?.passengerDetails?.numberOfPassengers || prev.numberOfPassengers,
      numberOfSuitcases: data?.passengerDetails?.numberOfSuitcases || prev.numberOfSuitcases,
      isBookingForSomeoneElse: data?.passengerDetails?.isBookingForSomeoneElse || prev.isBookingForSomeoneElse,
      guestFirstName: data?.passengerDetails?.guestFirstName || prev.guestFirstName,
      guestLastName: data?.passengerDetails?.guestLastName || prev.guestLastName,
      guestCountryObj: resolveCountry(data?.passengerDetails?.guestCountryCode) || prev.guestCountryObj,
      guestPhone: data?.passengerDetails?.guestPhone || prev.guestPhone,
      guestEmail: data?.passengerDetails?.guestEmail || prev.guestEmail,
      isAirportPickup: data?.flightDetails?.isAirportPickup || prev.isAirportPickup,
      flightNumber: data?.flightDetails?.flightNumber || prev.flightNumber,
      nameBoard: data?.flightDetails?.nameBoard || prev.nameBoard,
      additionalRequirements: data?.specialInstructions ?? prev.additionalRequirements,
    }));
  }, [data]);

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

    // Phone number validation via libphonenumber-js
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone, formData.countryObj?.isoUpper || "GB")) {
      newErrors.phone = "Please enter a valid phone number for the selected country";
    }

    // Validate passengers and suitcases against selected vehicle capacity
    const selectedVehicle = data?.selectedVehicle;
    if (selectedVehicle) {
      const maxPassengers = selectedVehicle.numberOfPassengers || 0;
      const maxLuggage = selectedVehicle.numberOfBigLuggage || 0;

      if (formData.numberOfPassengers > maxPassengers) {
        newErrors.numberOfPassengers = `Maximum ${maxPassengers} ${maxPassengers === 1 ? 'passenger' : 'passengers'} allowed for this vehicle`;
      }

      if (formData.numberOfSuitcases > maxLuggage) {
        newErrors.numberOfSuitcases = `Maximum ${maxLuggage} ${maxLuggage === 1 ? 'suitcase' : 'suitcases'} allowed for this vehicle`;
      }
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

      if (formData.guestPhone.trim()) {
        if (!validatePhone(formData.guestPhone, formData.guestCountryObj?.isoUpper || "GB")) {
          newErrors.guestPhone = "Please enter a valid phone number for the selected country";
        }
      }
    }

    if (formData.isAirportPickup) {
      if (!formData.flightNumber.trim()) newErrors.flightNumber = "Flight number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    const newErrors = {};

    const namePattern = /^[A-Za-z\s\-']+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!namePattern.test(formData.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters";
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!namePattern.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate phone via libphonenumber-js
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone, formData.countryObj?.isoUpper || "GB")) {
      newErrors.phone = "Please enter a valid phone number for the selected country";
    }

    // Validate passengers and suitcases against selected vehicle capacity
    const selectedVehicle = data?.selectedVehicle;
    if (selectedVehicle) {
      const maxPassengers = selectedVehicle.numberOfPassengers || 0;
      const maxLuggage = selectedVehicle.numberOfBigLuggage || 0;

      if (formData.numberOfPassengers > maxPassengers) {
        newErrors.numberOfPassengers = `Maximum ${maxPassengers} ${maxPassengers === 1 ? 'passenger' : 'passengers'} allowed for this vehicle`;
      }

      if (formData.numberOfSuitcases > maxLuggage) {
        newErrors.numberOfSuitcases = `Maximum ${maxLuggage} ${maxLuggage === 1 ? 'suitcase' : 'suitcases'} allowed for this vehicle`;
      }
    }

    // Validate guest details if booking for someone else
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

      if (formData.guestPhone.trim()) {
        if (!validatePhone(formData.guestPhone, formData.guestCountryObj?.isoUpper || "GB")) {
          newErrors.guestPhone = "Please enter a valid phone number for the selected country";
        }
      }
    }

    // Validate flight details if airport pickup
    if (formData.isAirportPickup) {
      if (!formData.flightNumber.trim()) newErrors.flightNumber = "Flight number is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      console.log("Validation failed. Errors:", newErrors);
      
      setTimeout(() => {
        const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    console.log("Validation passed. Submitting...");

    const passengerDetailsData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      countryCode: `+${formData.countryObj?.dial || "44"}`,
      phone: formData.phone,
      numberOfPassengers: formData.numberOfPassengers,
      numberOfSuitcases: formData.numberOfSuitcases,
      numberOfChildren: formData.numberOfChildren,
      isBookingForSomeoneElse: formData.isBookingForSomeoneElse,
      guestFirstName: formData.guestFirstName,
      guestLastName: formData.guestLastName,
      guestCountryCode: `+${formData.guestCountryObj?.dial || "44"}`,
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

  // Expose handleSubmit to parent via ref (used by desktop StickyBookingSummary)
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
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
              <div data-field="firstName">
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
              </div>
              <div data-field="lastName">
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
            </div>

            <div data-field="phone">
              <PhoneField
                country={formData.countryObj}
                onCountryChange={(c) => updateField("countryObj", c)}
                value={formData.phone}
                onChange={(phone) => updateField("phone", phone)}
                label="Contact Number"
                required
                error={errors.phone}
              />
            </div>

            <div data-field="email">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <CounterField
                label="Number of Passengers"
                icon={Users}
                required
                value={formData.numberOfPassengers}
                onChange={(value) => updateField("numberOfPassengers", value)}
                min={1}
                max={data?.selectedVehicle?.numberOfPassengers || 10}
                error={errors.numberOfPassengers}
              />
              <CounterField
                label="Number of Children"
                icon={Users}
                value={formData.numberOfChildren}
                onChange={(value) => updateField("numberOfChildren", value)}
                min={0}
                max={4}
                error={errors.numberOfChildren}
              />
              <CounterField
                label="Number of Suitcases"
                icon={Briefcase}
                required
                value={formData.numberOfSuitcases}
                onChange={(value) => updateField("numberOfSuitcases", value)}
                min={0}
                max={data?.selectedVehicle?.numberOfBigLuggage || 10}
                error={errors.numberOfSuitcases}
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

                    <PhoneField
                      country={formData.guestCountryObj}
                      onCountryChange={(c) => updateField("guestCountryObj", c)}
                      value={formData.guestPhone}
                      onChange={(phone) => updateField("guestPhone", phone)}
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

        {/* Action Buttons - Mobile Only */}
        <div className="lg:hidden">
          <StepNavBar
            onBack={onBack}
            onContinue={handleSubmit}
            backLabel="BACK"
            continueLabel="PROCEED TO PAYMENT"
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
});

export default UserDetails;