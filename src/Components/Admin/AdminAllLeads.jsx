import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Car,
    MapPin,
    Clock,
    User,
    Phone,
    Mail,
    Filter,
    ChevronLeft,
    ChevronRight,
    Edit3,
    Trash2,
    X,
    Check,
    AlertTriangle,
    Loader2,
    ArrowLeft,
    Plane,
    CreditCard,
    FileText,
    Users,
    Briefcase,
    PoundSterling,
    Target,
    DollarSign,
    Plus,
} from "lucide-react";
import { bookingAPI } from "../../Utils/api";
import CustomDropdown from "./CustomDropdown";
import CreateLeadModal from "./CreateLeadModal";

// Status Badge Component
const StatusBadge = ({ status, type = "booking" }) => {
    const getStatusStyles = () => {
        if (type === "payment") {
            switch (status) {
                case "paid":
                    return "bg-green-100 text-green-700 border-green-200";
                case "pending":
                    return "bg-yellow-100 text-yellow-700 border-yellow-200";
                case "refunded":
                    return "bg-purple-100 text-purple-700 border-purple-200";
                case "failed":
                    return "bg-red-100 text-red-700 border-red-200";
                default:
                    return "bg-gray-100 text-gray-700 border-gray-200";
            }
        }
        // Booking status
        switch (status) {
            case "confirmed":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "cancelled":
                return "bg-red-100 text-red-700 border-red-200";
            case "in-progress":
                return "bg-indigo-100 text-indigo-700 border-indigo-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusStyles()}`}
        >
            {type === "payment" && status === "pending" ? "Unpaid" : status}
        </span>
    );
};

// Service Type Badge
const ServiceTypeBadge = ({ type }) => {
    const isHourly = type === "hourly";
    return (
        <span
            className={`px-2 py-1 rounded-lg text-xs font-medium ${isHourly
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
                }`}
        >
            {isHourly ? "⏱ Hourly" : "📍 P2P"}
        </span>
    );
};

// Lead Card Component
const LeadCard = ({ booking, onEdit, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const getPaymentBadgeColor = () => {
        switch (booking.paymentStatus) {
            case "paid":
                return "bg-green-500";
            case "pending":
                return "bg-yellow-500";
            case "failed":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative"
        >
            {/* Payment Status Ribbon */}
            <div
                className={`absolute top-4 right-4 w-3 h-3 rounded-full ${getPaymentBadgeColor()} animate-pulse`}
                title={`Payment: ${booking.paymentStatus}`}
            />

            {/* Header */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 border-b border-amber-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                            <Target size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">
                                {booking.bookingNumber || "LEAD"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {formatDate(booking.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ServiceTypeBadge type={booking.serviceType} />
                        <StatusBadge status={booking.status} />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Journey Info */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow"></div>
                        {booking.serviceType !== "hourly" && (
                            <>
                                <div className="w-0.5 h-8 bg-gray-200"></div>
                                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow"></div>
                            </>
                        )}
                    </div>
                    <div className="flex-1 space-y-3">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                Pickup
                            </p>
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                {booking.pickup?.address || "N/A"}
                            </p>
                        </div>
                        {booking.serviceType === "hourly" ? (
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">
                                    Duration
                                </p>
                                <p className="text-sm font-medium text-purple-600">
                                    {booking.journeyInfo?.hours || 2} Hours Booking
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wide">
                                    Dropoff
                                </p>
                                <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                    {booking.dropoff?.address || "N/A"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Clock size={16} className="text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold text-gray-800 text-sm">
                            {booking.pickupTime || "N/A"}
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <Calendar size={16} className="text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold text-gray-800 text-sm">
                            {booking.pickupDate
                                ? new Date(booking.pickupDate).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                })
                                : "N/A"}
                        </p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                        <PoundSterling size={16} className="text-amber-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-amber-600 text-sm">
                            £{booking.pricing?.totalPrice?.toFixed(2) || "0.00"}
                        </p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                        <User size={18} className="text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                            {booking.passengerDetails?.firstName}{" "}
                            {booking.passengerDetails?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {booking.passengerDetails?.email}
                        </p>
                    </div>
                    <StatusBadge status={booking.paymentStatus} type="payment" />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(booking)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
                    >
                        <Edit3 size={16} />
                        Manage Lead
                    </button>
                    <button
                        onClick={() => onDelete(booking)}
                        className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// Edit Lead Modal - Changed to allow status change
const EditLeadModal = ({ booking, isOpen, onClose, onSave }) => {
    const [status, setStatus] = useState(booking?.status || "pending");
    const [paymentStatus, setPaymentStatus] = useState(booking?.paymentStatus || "pending");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (booking) {
            setStatus(booking.status);
            setPaymentStatus(booking.paymentStatus);
        }
    }, [booking]);

    const handleStatusChange = (s) => {
        setStatus(s);
        // When confirming booking, automatically mark as paid
        if (s === "confirmed") {
            setPaymentStatus("paid");
        } else {
            setPaymentStatus(booking?.paymentStatus || "pending");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updateData = { status };
            // If confirming, also update payment status to paid
            if (status === "confirmed") {
                updateData.paymentStatus = "paid";
            }
            await onSave(booking._id, updateData);
            onClose();
        } catch (error) {
            console.error("Error saving:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !booking) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Lead Details</h2>
                                <p className="text-amber-100 text-sm">
                                    {booking.bookingNumber} • Payment:{" "}
                                    <span className="font-semibold capitalize">
                                        {booking.paymentStatus === "pending"
                                            ? "Unpaid"
                                            : booking.paymentStatus}
                                    </span>
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 overflow-y-auto flex-1">
                        {/* Status Change Section */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 mb-6 border border-amber-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <AlertTriangle size={18} className="text-amber-500" />
                                Update Booking Status
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                When you confirm a booking, it will move to the "All Bookings"
                                page.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {["pending", "confirmed", "cancelled"].map((s) => {
                                    const isActive = status === s;
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusChange(s)}
                                            className={`relative overflow-hidden px-4 py-3.5 rounded-2xl text-sm font-bold capitalize transition-all duration-300 border-2 flex flex-col items-center gap-1
                                                ${isActive
                                                    ? s === "confirmed" ? "bg-green-600 border-green-600 text-white shadow-lg shadow-green-200"
                                                        : s === "cancelled" ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-200"
                                                            : "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200"
                                                    : "bg-white border-amber-100 text-gray-500 hover:border-amber-300 hover:bg-amber-50/50"
                                                }`}
                                        >
                                            {/* Visual indicator for active state */}

                                            {s}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Auto-paid indicator */}
                            {status === "confirmed" && (
                                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                                    <CreditCard size={16} className="text-green-600" />
                                    <span className="text-sm font-semibold text-green-700">
                                        Payment will be automatically marked as <span className="uppercase">Paid</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Journey Details */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-blue-500" />
                                    Journey Details
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Pickup</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {booking.pickup?.address || "N/A"}
                                        </p>
                                    </div>
                                    {booking.serviceType === "hourly" ? (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Duration</p>
                                            <p className="text-sm font-medium text-purple-600">
                                                {booking.journeyInfo?.hours || 2} Hours Booking
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Dropoff</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {booking.dropoff?.address || "N/A"}
                                            </p>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Date</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {formatDate(booking.pickupDate)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Time</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {booking.pickupTime}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ServiceTypeBadge type={booking.serviceType} />
                                        {booking.journeyInfo?.hours && (
                                            <span className="text-sm text-gray-600">
                                                ({booking.journeyInfo.hours} hours)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Customer Details */}
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <User size={18} className="text-green-500" />
                                    Customer Details
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.passengerDetails?.firstName}{" "}
                                            {booking.passengerDetails?.lastName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.passengerDetails?.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.passengerDetails?.countryCode}{" "}
                                            {booking.passengerDetails?.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.passengerDetails?.numberOfPassengers || 1}{" "}
                                            passengers
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle & Pricing */}
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-50 rounded-2xl p-5">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Car size={18} className="text-purple-500" />
                                    Vehicle Details
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Vehicle</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {booking.vehicleDetails?.categoryName || "N/A"}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {booking.vehicleDetails?.categoryDetails}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-5">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard size={18} className="text-amber-500" />
                                    Payment Details
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Base Price</span>
                                        <span className="font-medium">
                                            £{booking.pricing?.basePrice?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tax (VAT)</span>
                                        <span className="font-medium">
                                            £{booking.pricing?.tax?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-amber-200">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-amber-600 text-lg">
                                            £{booking.pricing?.totalPrice?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm text-gray-600">
                                            Payment Status
                                        </span>
                                        <StatusBadge status={paymentStatus} type="payment" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest Details (Booking for Someone Else) */}
                        {booking.isBookingForSomeoneElse && booking.guestDetails && (
                            <div className="bg-purple-50 rounded-2xl p-5 mb-6 border border-purple-200">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users size={18} className="text-purple-500" />
                                    Booking for Someone Else
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3">
                                        <User size={16} className="text-purple-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.guestDetails.firstName} {booking.guestDetails.lastName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone size={16} className="text-purple-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.guestDetails.countryCode} {booking.guestDetails.phone}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-purple-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.guestDetails.email}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Flight Details */}
                        {booking.isAirportPickup && booking.flightDetails && (
                            <div className="bg-indigo-50 rounded-2xl p-5 mb-6 border border-indigo-200">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Plane size={18} className="text-indigo-500" />
                                    Flight Details
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Flight Number</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {booking.flightDetails.flightNumber}
                                        </p>
                                    </div>
                                    {booking.flightDetails.nameBoard && (
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase">Name Board</p>
                                            <p className="text-sm font-medium text-gray-800">
                                                {booking.flightDetails.nameBoard}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-indigo-600 bg-indigo-100 px-3 py-2 rounded-lg mt-3">
                                    ✈️ Airport pickup - Flight will be tracked
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-6 py-3 font-medium rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors ${status === "confirmed"
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-amber-500 text-white hover:bg-amber-600"
                                }`}
                        >
                            {isSaving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Check size={18} />
                            )}
                            {status === "confirmed" ? "Confirm Booking" : "Save Changes"}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ booking, isOpen, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm(booking._id);
            onClose();
        } catch (error) {
            console.error("Error deleting:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !booking) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Delete Lead?
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete lead{" "}
                            <span className="font-semibold text-gray-700">
                                {booking.bookingNumber}
                            </span>
                            ? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isDeleting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Trash2 size={18} />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, "...", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(
                    1,
                    "...",
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={20} />
            </button>

            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                    disabled={page === "..."}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === currentPage
                        ? "bg-amber-500 text-white"
                        : page === "..."
                            ? "cursor-default"
                            : "border border-gray-200 hover:bg-gray-100"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

// Main Component
function AdminAllLeads() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    });
    const [stats, setStats] = useState(null);

    // Filters - For leads, we show pending and cancelled status only
    const [filters, setFilters] = useState({
        paymentStatus: "",
    });

    // Modals
    const [editModal, setEditModal] = useState({ isOpen: false, booking: null });
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        booking: null,
    });
    const [createLeadModal, setCreateLeadModal] = useState(false);

    // Fetch leads (bookings that are NOT confirmed)
    const fetchLeads = async (page = 1) => {
        setIsLoading(true);
        try {
            const params = {
                page,
                limit: pagination.limit,
                // Leads = NOT confirmed (pending or cancelled)
                ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
            };

            const response = await bookingAPI.getAllBookings(params);

            if (response.success) {
                // Filter out confirmed bookings - they go to All Bookings page
                const leads = response.data.filter(
                    (b) => b.status !== "confirmed" && b.status !== "completed"
                );
                setBookings(leads);
                setPagination(response.pagination);
                setStats(response.stats);
            }
        } catch (err) {
            console.error("Error fetching leads:", err);
            setError("Failed to load leads");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads(1);
    }, [filters]);

    const handlePageChange = (page) => {
        fetchLeads(page);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleUpdateStatus = async (id, data) => {
        try {
            await bookingAPI.updateBookingStatus(id, data);
            fetchLeads(pagination.page);
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    };

    const handleDelete = async (id) => {
        try {
            await bookingAPI.deleteBooking(id);
            fetchLeads(pagination.page);
        } catch (error) {
            console.error("Error deleting lead:", error);
            throw error;
        }
    };

    // Count leads by payment status
    const paidLeads = bookings.filter((b) => b.paymentStatus === "paid").length;
    const unpaidLeads = bookings.filter(
        (b) => b.paymentStatus === "pending"
    ).length;
    const failedLeads = bookings.filter(
        (b) => b.paymentStatus === "failed"
    ).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-5 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/admin-dashboard")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
                                <p className="text-gray-500 text-sm">
                                    Manage booking requests and convert them to confirmed bookings
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setCreateLeadModal(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30"
                        >
                            <Plus size={20} />
                            Create Lead
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        <div className="px-4 py-2 rounded-xl bg-gray-100 flex items-center gap-2 whitespace-nowrap">
                            <span className="text-sm font-medium">Total Leads:</span>
                            <span className="font-bold">{bookings.length}</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-green-100 text-green-700 flex items-center gap-2 whitespace-nowrap">
                            <span className="text-sm font-medium">Paid:</span>
                            <span className="font-bold">{paidLeads}</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 flex items-center gap-2 whitespace-nowrap">
                            <span className="text-sm font-medium">Unpaid:</span>
                            <span className="font-bold">{unpaidLeads}</span>
                        </div>
                        <div className="px-4 py-2 rounded-xl bg-red-100 text-red-700 flex items-center gap-2 whitespace-nowrap">
                            <span className="text-sm font-medium">Failed:</span>
                            <span className="font-bold">{failedLeads}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={18} className="text-gray-500" />
                        <h3 className="font-semibold text-gray-800">Filter Leads</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <CustomDropdown
                                label="Payment Status"
                                icon={DollarSign}
                                value={filters.paymentStatus}
                                onChange={(value) => handleFilterChange("paymentStatus", value)}
                                placeholder="All Payment Status"
                                options={[
                                    { value: "", label: "All Payment Status" },
                                    { value: "pending", label: "Unpaid" },
                                    { value: "paid", label: "Paid" },
                                    { value: "failed", label: "Failed" },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="text-amber-500 animate-spin mb-4" />
                        <p className="text-gray-500">Loading leads...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
                        <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => fetchLeads(1)}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Leads Grid */}
                {!isLoading && !error && (
                    <>
                        {bookings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {bookings.map((booking) => (
                                    <LeadCard
                                        key={booking._id}
                                        booking={booking}
                                        onEdit={(b) => setEditModal({ isOpen: true, booking: b })}
                                        onDelete={(b) =>
                                            setDeleteModal({ isOpen: true, booking: b })
                                        }
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                <Target size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    No leads found
                                </h3>
                                <p className="text-gray-500">
                                    New booking requests will appear here.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="py-6">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.pages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <EditLeadModal
                booking={editModal.booking}
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, booking: null })}
                onSave={handleUpdateStatus}
            />
            <DeleteConfirmModal
                booking={deleteModal.booking}
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, booking: null })}
                onConfirm={handleDelete}
            />
            <CreateLeadModal
                isOpen={createLeadModal}
                onClose={() => setCreateLeadModal(false)}
                onCreate={() => fetchLeads(pagination.page)}
            />
        </div>
    );
}

export default AdminAllLeads;
