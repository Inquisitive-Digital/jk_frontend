import { motion } from "framer-motion";
import {
    ArrowLeft,
    CreditCard,
    MapPin,
    Calendar,
    Clock,
    Car,
    User,
    Phone,
    Mail,
    Plane,
    Users,
    Briefcase,
    MessageSquare,
    Check,
    Edit3,
    Loader2,
} from "lucide-react";

// Info Row Component
const InfoRow = ({ icon: Icon, label, value, highlight = false }) => (
    <div className="flex items-center gap-2 py-1.5">
        <div className="p-1.5 rounded-md" style={{ backgroundColor: highlight ? 'rgba(215,183,94,0.1)' : 'rgba(255,255,255,0.06)' }}>
            <Icon size={14} style={{ color: highlight ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)' }} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
            <p className="font-medium text-white text-sm break-words">{value || "—"}</p>
        </div>
    </div>
);

// Section Card Component
const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl p-4 ${className}`}
        style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
        <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="p-1.5 rounded-md" style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}>
                <Icon size={15} style={{ color: 'var(--color-primary)' }} />
            </div>
            {title}
        </h3>
        {children}
    </motion.div>
);

function BookingSummary({ data, onEdit, onProceed, isLoading = false }) {
    const {
        pickup,
        dropoff,
        pickupDate,
        pickupTime,
        serviceType,
        hours,
        selectedVehicle,
        journeyInfo,
        passengerDetails,
        flightDetails,
        specialInstructions
    } = data;

    const isHourly = serviceType === "hourly";

    const pricing = selectedVehicle?.pricing;
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    // Vehicle image URL
    const vehicleImageUrl = selectedVehicle?.image?.url
        ? `${API_BASE}/${selectedVehicle.image.url.replace(/\\/g, "/")}`
        : "/placeholder-car.png";

    return (
        <div className="py-2 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header - compact, no icon */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4"
                >
                    <h1 className="text-xl font-bold text-white">Review Your Booking</h1>
                    <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Please confirm your details before proceeding to payment</p>
                </motion.div>

                {/* Summary Cards */}
                <div className="space-y-3">
                    {/* Journey Details */}
                    <SectionCard title="Journey Details" icon={MapPin}>
                        <div className="space-y-3">
                            {/* Route Visual */}
                            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(215,183,94,0.05)', border: '1px solid rgba(215,183,94,0.1)' }}>
                                <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                                    {!isHourly && (
                                        <>
                                            <div className="w-0.5 h-8" style={{ background: 'linear-gradient(to bottom, var(--color-primary), rgba(255,255,255,0.3))' }} />
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                                        </>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--color-primary)' }}>Pickup</p>
                                        <p className="font-medium text-white text-sm">{pickup || "—"}</p>
                                    </div>
                                    {!isHourly && dropoff && (
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Dropoff</p>
                                            <p className="font-medium text-white text-sm">{dropoff}</p>
                                        </div>
                                    )}
                                    {isHourly && (
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>Duration</p>
                                            <p className="font-medium text-sm" style={{ color: 'var(--color-primary)' }}>{hours || journeyInfo?.hours || 2} Hours Booking</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Date/Time/Distance or Hours */}
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                                    <Calendar size={14} className="mx-auto mb-0.5" style={{ color: 'var(--color-primary)' }} />
                                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Date</p>
                                    <p className="font-semibold text-white text-xs">{formatDate(pickupDate)}</p>
                                </div>
                                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                                    <Clock size={14} className="mx-auto mb-0.5" style={{ color: 'var(--color-primary)' }} />
                                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Time</p>
                                    <p className="font-semibold text-white text-xs">{pickupTime || "—"}</p>
                                </div>
                                <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                                    {isHourly ? (
                                        <>
                                            <Clock size={14} className="mx-auto mb-0.5" style={{ color: 'var(--color-primary)' }} />
                                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Hours</p>
                                            <p className="font-semibold text-xs" style={{ color: 'var(--color-primary)' }}>
                                                {hours || journeyInfo?.hours || 2}h
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <MapPin size={14} className="mx-auto mb-0.5" style={{ color: 'var(--color-primary)' }} />
                                            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Distance</p>
                                            <p className="font-semibold text-white text-xs">
                                                {journeyInfo?.distanceMiles?.toFixed(1) || "—"} mi
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Vehicle */}
                    <SectionCard title="Selected Vehicle" icon={Car}>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-16 rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                                <img
                                    src={vehicleImageUrl}
                                    alt={selectedVehicle?.categoryName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/100x60?text=Car";
                                    }}
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{selectedVehicle?.categoryName || "—"}</h4>
                                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{selectedVehicle?.categoryDetails}</p>
                                <div className="flex items-center gap-3 mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    <span className="flex items-center gap-1">
                                        <Users size={14} style={{ color: 'var(--color-primary)' }} /> {selectedVehicle?.numberOfPassengers}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Briefcase size={14} style={{ color: 'var(--color-primary)' }} /> {selectedVehicle?.numberOfBigLuggage}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </SectionCard>

                    {/* Passenger Details */}
                    <SectionCard title="Passenger Details" icon={User}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <InfoRow
                                icon={User}
                                label="Name"
                                value={`${passengerDetails?.firstName || ""} ${passengerDetails?.lastName || ""}`}
                            />
                            <InfoRow
                                icon={Phone}
                                label="Phone"
                                value={`${passengerDetails?.countryCode || ""} ${passengerDetails?.phone || ""}`}
                            />
                            <InfoRow icon={Mail} label="Email" value={passengerDetails?.email} />
                            <InfoRow
                                icon={Users}
                                label="Passengers & Luggage"
                                value={`${passengerDetails?.numberOfPassengers || 1} passengers, ${passengerDetails?.numberOfSuitcases || 0} suitcases`}
                            />
                        </div>

                        {/* Guest Details */}
                        {passengerDetails?.isBookingForSomeoneElse && (
                            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-primary)' }}>Booking for Someone Else</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <InfoRow
                                        icon={User}
                                        label="Passenger Name"
                                        value={`${passengerDetails?.guestFirstName || ""} ${passengerDetails?.guestLastName || ""}`}
                                        highlight
                                    />
                                    <InfoRow
                                        icon={Phone}
                                        label="Passenger Phone"
                                        value={`${passengerDetails?.guestCountryCode || ""} ${passengerDetails?.guestPhone || ""}`}
                                        highlight
                                    />
                                    <InfoRow icon={Mail} label="Passenger Email" value={passengerDetails?.guestEmail} highlight />
                                </div>
                            </div>
                        )}
                    </SectionCard>

                    {/* Flight Details (if airport pickup) */}
                    {flightDetails?.isAirportPickup && (
                        <SectionCard title="Flight Details" icon={Plane}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <InfoRow icon={Plane} label="Flight Number" value={flightDetails?.flightNumber} highlight />
                                <InfoRow
                                    icon={User}
                                    label="Name Board"
                                    value={flightDetails?.nameBoard || "—"}
                                />
                            </div>
                            <p className="text-xs px-3 py-1.5 rounded-lg mt-2" style={{ backgroundColor: 'rgba(215,183,94,0.08)', color: 'var(--color-primary)' }}>
                                ✈️ We'll track your flight and adjust pickup time if needed
                            </p>
                        </SectionCard>
                    )}

                    {/* Special Instructions */}
                    {specialInstructions && (
                        <SectionCard title="Additional Requirements" icon={MessageSquare}>
                            <p className="p-3 rounded-xl text-white" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>{specialInstructions}</p>
                        </SectionCard>
                    )}

                    {/* Price Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl p-4 text-white shadow-xl"
                        style={{ background: 'linear-gradient(135deg, rgba(215,183,94,0.15), rgba(215,183,94,0.05))', border: '1px solid rgba(215,183,94,0.25)' }}
                    >
                        <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                            <CreditCard size={16} style={{ color: 'var(--color-primary)' }} />
                            Price Summary
                        </h3>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                <span>Base Fare</span>
                                <span className="text-white font-medium">£{pricing?.basePrice?.toFixed(2) || "0.00"}</span>
                            </div>
                            {pricing?.airportCharges > 0 && (
                                <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    <span>Airport Charges</span>
                                    <span className="text-white font-medium">£{pricing?.airportCharges?.toFixed(2)}</span>
                                </div>
                            )}
                            {pricing?.congestionCharge > 0 && (
                                <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    <span>Congestion Charge</span>
                                    <span className="text-white font-medium">£{pricing?.congestionCharge?.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                <span>VAT ({pricing?.vatRate || 20}%)</span>
                                <span className="text-white font-medium">£{pricing?.tax?.toFixed(2) || "0.00"}</span>
                            </div>
                            <div className="my-2" style={{ borderTop: '1px solid rgba(215,183,94,0.2)' }} />
                            <div className="flex justify-between items-center">
                                <span className="text-base font-bold">Total</span>
                                <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>£{pricing?.totalPrice?.toFixed(2) || "0.00"}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-4 mt-5"
                >
                    <button
                        onClick={onEdit}
                        className="flex-1 flex items-center cursor-pointer justify-center gap-2 py-3.5 px-6 border rounded-xl font-semibold transition-all duration-200 text-sm"
                        style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>

                    <button
                        onClick={onProceed}
                        disabled={isLoading}
                        className={`flex-1 flex ${!isLoading?"cursor-pointer":""}  items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowe`}
                        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CreditCard size={18} />
                                Proceed to Payment
                            </>
                        )}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

export default BookingSummary;
