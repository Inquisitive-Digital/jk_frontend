import React, { useState, useEffect, useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import {
  MapPin,
  Flag,
  Calendar,
  Clock,
  ChevronDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Timer,
  Phone
} from "lucide-react";

// --- ENHANCED CSS FOR AUTOCOMPLETE & SCROLLBARS ---
const customStyles = `
  .pac-container {
    border-radius: 8px;
    margin-top: 4px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(215, 183, 94, 0.2);
    background-color: #121212 !important;
    z-index: 9999 !important;
  }
  .pac-item {
    padding: 10px 14px;
    color: #ccc !important;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    background-color: #121212 !important;
    cursor: pointer;
  }
  .pac-item:hover,
  .pac-item-selected,
  .pac-item-selected:hover {
    background-color: #1e1e1e !important;
    color: #fff !important;
  }
  .pac-item-selected .pac-item-query {
    color: var(--color-primary) !important;
  }
  .pac-item-query { color: #fff !important; }
  .pac-matched { color: var(--color-primary) !important; }
  
  /* Custom Scrollbar Styles for Pickers */
  .picker-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .picker-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }
  .picker-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(215, 183, 94, 0.5);
    border-radius: 3px;
  }
  .picker-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(215, 183, 94, 0.8);
  }
  .picker-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(215, 183, 94, 0.5) rgba(255, 255, 255, 0.05);
  }
`;

// --- HELPER: CLICK OUTSIDE HOOK ---
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

// --- CUSTOM TIME PICKER COMPONENT ---
const CustomTimePicker = ({ value, onChange, onClose }) => {
  const wrapperRef = useRef(null);
  const hoursScrollRef = useRef(null);
  const minutesScrollRef = useRef(null);
  useClickOutside(wrapperRef, onClose);

  const [hours, setHours] = useState("12");
  const [minutes, setMinutes] = useState("00");
  const [ampm, setAmpm] = useState("PM");

  useEffect(() => {
    if (value) {
      const [time, period] = value.split(" ");
      const [h, m] = time.split(":");
      setHours(h);
      setMinutes(m);
      setAmpm(period);
    }
  }, [value]);

  // Scroll selected item into view when value changes
  useEffect(() => {
    if (hoursScrollRef.current) {
      const selectedEl = hoursScrollRef.current.querySelector(`[data-hour="${hours}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
    if (minutesScrollRef.current) {
      const selectedEl = minutesScrollRef.current.querySelector(`[data-minute="${minutes}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [hours, minutes]);

  const handleConfirm = () => {
    onChange(`${hours}:${minutes} ${ampm}`);
    onClose();
  };

  const handleWheel = (e) => {
    e.stopPropagation(); // Prevent background from scrolling
  };

  const hoursArr = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutesArr = [
    "00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55",
  ];

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[calc(100vw-2rem)] shadow-2xl rounded-xl z-50 p-5"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 transform rotate-45" style={{ backgroundColor: '#1a1a1a', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

      <div className="flex justify-between text-center mb-4 font-semibold text-sm tracking-wide uppercase" style={{ color: 'var(--color-primary)' }}>
        <span className="w-1/3">Hour</span>
        <span className="w-1/3">Min</span>
        <span className="w-1/3">Session</span>
      </div>

      <div className="flex justify-between h-40 relative py-2 overflow-hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        {/* Hours */}
        <div 
          ref={hoursScrollRef}
          className="w-1/3 overflow-y-auto scrollbar-hide text-center snap-y snap-mandatory scroll-smooth"
          onWheel={handleWheel}
        >
          {hoursArr.map((h) => (
            <div
              key={h}
              data-hour={h}
              onClick={() => setHours(h)}
              className={`py-3 cursor-pointer transition-colors snap-center ${hours === h
                ? "font-bold text-2xl"
                : "text-lg"
                }`}
              style={{ color: hours === h ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)' }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Minutes */}
        <div 
          ref={minutesScrollRef}
          className="w-1/3 overflow-y-auto scrollbar-hide text-center snap-y snap-mandatory scroll-smooth" 
          style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}
          onWheel={handleWheel}
        >
          {minutesArr.map((m) => (
            <div
              key={m}
              data-minute={m}
              onClick={() => setMinutes(m)}
              className={`py-3 cursor-pointer transition-colors snap-center ${minutes === m
                ? "font-bold text-2xl"
                : "text-lg"
                }`}
              style={{ color: minutes === m ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)' }}
            >
              {m}
            </div>
          ))}
        </div>

        {/* AM/PM */}
        <div className="w-1/3 flex flex-col justify-center items-center gap-3">
          {["AM", "PM"].map((p) => (
            <button
              key={p}
              onClick={() => setAmpm(p)}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={
                ampm === p
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }
                  : { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="w-full mt-5 font-bold py-3 rounded-lg shadow-md transition-transform active:scale-95"
        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
      >
        Set Pickup Time
      </button>
    </div>
  );
};

// --- CUSTOM DATE PICKER COMPONENT ---
const CustomDatePicker = ({ value, onChange, onClose }) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, onClose);

  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => {
    if (year === today.getFullYear() && month === today.getMonth()) return;
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day) => {
    const selectedDate = new Date(year, month, day);
    if (selectedDate < today) return;
    onChange(selectedDate);
    onClose();
  };

  const isToday = (day) => {
    return (
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!value) return false;
    return (
      day === value.getDate() &&
      month === value.getMonth() &&
      year === value.getFullYear()
    );
  };

  const isPast = (day) => {
    const target = new Date(year, month, day);
    return target < today;
  };

  const isPrevDisabled =
    year === today.getFullYear() && month === today.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 max-w-[calc(100vw-2rem)] shadow-2xl rounded-xl z-50 p-5"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 transform rotate-45" style={{ backgroundColor: '#1a1a1a', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <span className="font-bold text-xl text-white">
          {monthNames[month]} {year}
        </span>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            disabled={isPrevDisabled}
            className={`p-2 rounded-full transition-colors ${isPrevDisabled
              ? "cursor-not-allowed"
              : "hover:bg-white/10"
              }`}
            style={{ color: isPrevDisabled ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>
        <div>Su</div>
        <div>Mo</div>
        <div>Tu</div>
        <div>We</div>
        <div>Th</div>
        <div>Fr</div>
        <div>Sa</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center text-sm gap-y-2 gap-x-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isPast(day);
          const selected = isSelected(day);
          const todayItem = isToday(day);

          return (
            <div
              key={day}
              onClick={() => !disabled && handleDayClick(day)}
              className="h-10 w-10 flex items-center justify-center rounded-full transition-all duration-200"
              style={
                selected
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', fontWeight: 'bold', cursor: 'pointer' }
                  : !selected && todayItem
                    ? { border: '1px solid var(--color-primary)', color: 'var(--color-primary)', fontWeight: 'bold', cursor: 'pointer' }
                    : disabled
                      ? { color: 'rgba(255,255,255,0.15)', cursor: 'default' }
                      : { color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }
              }
              onMouseEnter={(e) => {
                if (!disabled && !selected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={(e) => {
                if (!disabled && !selected) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- CUSTOM DURATION PICKER COMPONENT ---
const CustomDurationPicker = ({ value, onChange, onClose }) => {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, onClose);

  const hoursOptions = Array.from({ length: 23 }, (_, i) => i + 2);

  return (
    <div
      ref={wrapperRef}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 max-w-[calc(100vw-2rem)] shadow-2xl rounded-xl z-50 p-4 max-h-80 overflow-hidden"
      style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 transform rotate-45" style={{ backgroundColor: '#1a1a1a', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

      <h4 className="font-semibold mb-3 text-center" style={{ color: 'var(--color-primary)' }}>Select Duration</h4>

      <div className="overflow-y-auto max-h-52 scrollbar-hide">
        {hoursOptions.map((hour) => (
          <div
            key={hour}
            onClick={() => {
              onChange(hour);
              onClose();
            }}
            className="py-3 px-4 cursor-pointer transition-all rounded-lg mb-1 text-center"
            style={
              value === hour
                ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', fontWeight: 'bold' }
                : { color: 'rgba(255,255,255,0.7)' }
            }
            onMouseEnter={(e) => {
              if (value !== hour) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              if (value !== hour) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            {hour} hours
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
function Locations({ data, updateData, onNext }) {
  const [serviceType, setServiceType] = useState(data.serviceType || "oneway");
  const [activePicker, setActivePicker] = useState(null); // 'date', 'time', 'duration' or null
  const [errors, setErrors] = useState({});

  const pickupAutocompleteRef = useRef(null);
  const dropoffAutocompleteRef = useRef(null);
  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);

  // Handle pickup place selection
  const handlePickupPlaceChanged = () => {
    if (pickupAutocompleteRef.current) {
      const place = pickupAutocompleteRef.current.getPlace();

      let fullAddress = "";

      if (place?.name && place?.formatted_address) {
        if (place.formatted_address.includes(place.name)) {
          fullAddress = place.formatted_address;
        } else {
          fullAddress = `${place.name}, ${place.formatted_address}`;
        }
      } else if (place?.formatted_address) {
        fullAddress = place.formatted_address;
      } else if (place?.name) {
        fullAddress = place.name;
      }

      if (fullAddress) {
        updateData("pickup", fullAddress);
        setErrors((prev) => ({ ...prev, pickup: null }));
        if (pickupInputRef.current) {
          pickupInputRef.current.value = fullAddress;
        }
      }
    }
  };

  // Handle dropoff place selection
  const handleDropoffPlaceChanged = () => {
    if (dropoffAutocompleteRef.current) {
      const place = dropoffAutocompleteRef.current.getPlace();

      let fullAddress = "";

      if (place?.name && place?.formatted_address) {
        if (place.formatted_address.includes(place.name)) {
          fullAddress = place.formatted_address;
        } else {
          fullAddress = `${place.name}, ${place.formatted_address}`;
        }
      } else if (place?.formatted_address) {
        fullAddress = place.formatted_address;
      } else if (place?.name) {
        fullAddress = place.name;
      }

      if (fullAddress) {
        updateData("dropoff", fullAddress);
        setErrors((prev) => ({ ...prev, dropoff: null }));
        if (dropoffInputRef.current) {
          dropoffInputRef.current.value = fullAddress;
        }
      }
    }
  };

  const handleServiceTypeChange = (type) => {
    setServiceType(type);
    updateData("serviceType", type);
    if (type === "hourly") {
      updateData("dropoff", "");
      if (dropoffInputRef.current) dropoffInputRef.current.value = "";
      if (!data.hours) updateData("hours", 2);
    }
  };

  const validateAndProceed = () => {
    const newErrors = {};
    if (!data.pickup?.trim()) newErrors.pickup = "Required";
    if (serviceType === "oneway" && !data.dropoff?.trim()) newErrors.dropoff = "Required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) onNext();
  };

  return (
    <div className="max-w-3xl mx-auto font-sans text-slate-200">
      <style>{customStyles}</style>

      <div className="relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent opacity-50" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border-b border-white/5 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-lg shadow-inner border border-[var(--color-primary)]/20">
              🇬🇧
            </span>
            <h2 className="text-lg font-bold tracking-widest uppercase text-white">
              Reservation <span className="text-[var(--color-primary)]">Details</span>
            </h2>
          </div>

          {/* Service Toggle */}
          <div className="flex justify-center sm:justify-end p-1 bg-white/5 rounded-lg border border-white/10 w-full sm:w-auto">
            {["oneway", "hourly"].map((t) => (
              <button
                key={t}
                onClick={() => handleServiceTypeChange(t)}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-1.5 rounded text-xs font-bold uppercase transition-all duration-300 ${serviceType === t
                  ? "bg-[var(--color-primary)] text-black shadow-lg"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                {t === "oneway" ? "Point to Point" : "Hourly"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Main Input Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Pickup */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-primary)] ml-1">Pickup Location</label>
              <div className="relative group">
                <Autocomplete
                  onLoad={(a) => (pickupAutocompleteRef.current = a)}
                  onPlaceChanged={handlePickupPlaceChanged}
                  options={{
                    componentRestrictions: { country: "gb" },
                    types: ["geocode", "establishment"],
                  }}
                >
                  <input
                    ref={pickupInputRef}
                    placeholder="Airport, Hotel, or Address..."
                    className={`w-full bg-white/5 border ${errors.pickup ? 'border-red-500' : 'border-white/10'} hover:border-[var(--color-primary)]/50 focus:border-[var(--color-primary)] rounded-lg py-3 pl-10 pr-4 outline-none transition-all text-sm text-white placeholder-slate-500`}
                  />
                </Autocomplete>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/60 group-focus-within:text-[var(--color-primary)]" size={16} />
              </div>
              {errors.pickup && (
                <p className="text-xs text-red-400 ml-1">{errors.pickup}</p>
              )}
            </div>

            {/* Dropoff or Duration */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-primary)] ml-1">
                {serviceType === "oneway" ? "Destination" : "Duration"}
              </label>
              {serviceType === "oneway" ? (
                <div className="relative group">
                  <Autocomplete
                    onLoad={(a) => (dropoffAutocompleteRef.current = a)}
                    onPlaceChanged={handleDropoffPlaceChanged}
                    options={{
                      componentRestrictions: { country: "gb" },
                      types: ["geocode", "establishment"],
                    }}
                  >
                    <input
                      ref={dropoffInputRef}
                      placeholder="Enter drop-off point..."
                      className={`w-full bg-white/5 border ${errors.dropoff ? 'border-red-500' : 'border-white/10'} hover:border-[var(--color-primary)]/50 focus:border-[var(--color-primary)] rounded-lg py-3 pl-10 pr-4 outline-none transition-all text-sm text-white placeholder-slate-500`}
                    />
                  </Autocomplete>
                  <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/60 group-focus-within:text-[var(--color-primary)]" size={16} />
                </div>
              ) : (
                <div
                  onClick={() => setActivePicker(activePicker === 'duration' ? null : 'duration')}
                  className="flex items-center justify-between w-full bg-white/5 border border-white/10 hover:border-[var(--color-primary)]/50 rounded-lg py-3 px-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Timer size={16} className="text-[var(--color-primary)]" />
                    <span className="text-sm text-white">{data.hours || 2} Hours</span>
                  </div>
                  <ChevronDown size={14} className="opacity-40 text-white" />
                </div>
              )}
              {serviceType === "hourly" && activePicker === 'duration' && (
                <CustomDurationPicker
                  value={data.hours || 2}
                  onChange={(h) => updateData("hours", h)}
                  onClose={() => setActivePicker(null)}
                />
              )}
              {errors.dropoff && serviceType === "oneway" && (
                <p className="text-xs text-red-400 ml-1">{errors.dropoff}</p>
              )}
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-primary)] ml-1">Date</label>
              <div className="relative">
                <div
                  onClick={() => setActivePicker(activePicker === 'date' ? null : 'date')}
                  className="flex items-center justify-between bg-white/5 border border-white/10 hover:border-[var(--color-primary)]/50 rounded-lg py-3 px-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Calendar size={14} className="text-[var(--color-primary)] shrink-0" />
                    <span className="text-xs truncate text-white">
                      {data.pickupDate?.toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }) || "Select Date"}
                    </span>
                  </div>
                  <ChevronDown size={12} className="opacity-40 text-white" />
                </div>
                {activePicker === 'date' && (
                  <CustomDatePicker
                    value={data.pickupDate}
                    onChange={(d) => updateData("pickupDate", d)}
                    onClose={() => setActivePicker(null)}
                  />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-primary)] ml-1">Time</label>
              <div className="relative">
                <div
                  onClick={() => setActivePicker(activePicker === 'time' ? null : 'time')}
                  className="flex items-center justify-between bg-white/5 border border-white/10 hover:border-[var(--color-primary)]/50 rounded-lg py-3 px-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[var(--color-primary)]" />
                    <span className="text-xs text-white">{data.pickupTime}</span>
                  </div>
                  <ChevronDown size={12} className="opacity-40 text-white" />
                </div>
                {activePicker === 'time' && (
                  <CustomTimePicker
                    value={data.pickupTime}
                    onChange={(t) => updateData("pickupTime", t)}
                    onClose={() => setActivePicker(null)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* CTA Button — full width below date & time on all screen sizes */}
          <div className="pt-1">
            <button
              onClick={validateAndProceed}
              className="w-full font-medium  cursor-pointer py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
            >
              GET MY PRICES <ArrowRight size={18} />
            </button>
          </div>

          {/* Footer Assistance */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/5 text-[11px] text-slate-500 uppercase tracking-tighter">
            <span>{serviceType === "hourly" ? "Chauffeur at disposal" : "15 Mins free waiting"}</span>
            <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold mt-2 sm:mt-0">
              <Phone size={12} /> +44 (0) 203 475 9906
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Locations;
