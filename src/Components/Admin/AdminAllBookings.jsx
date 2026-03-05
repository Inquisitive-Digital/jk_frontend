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
    Eye,
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
    DollarSign,
} from "lucide-react";
import { bookingAPI } from "../../Utils/api";
import CustomDropdown from "./CustomDropdown";

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
            {status}
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

// Booking Card Component
const BookingCard = ({ booking, onEdit, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Calendar size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">
                                {booking.bookingNumber || "N/A"}
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
                        <div className="w-0.5 h-8 bg-gray-200"></div>
                        <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow"></div>
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
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">
                                Dropoff
                            </p>
                            <p className="text-sm font-medium text-gray-800 line-clamp-1">
                                {booking.dropoff?.address || "Same as pickup (Hourly)"}
                            </p>
                        </div>
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
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <PoundSterling size={16} className="text-blue-500 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="font-bold text-blue-600 text-sm">
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                        <Eye size={16} />
                        View Details
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

// Edit Booking Modal
const EditBookingModal = ({ booking, isOpen, onClose, onSave }) => {
    const [status, setStatus] = useState(booking?.status || "pending");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (booking) {
            setStatus(booking.status);
        }
    }, [booking]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await onSave(booking._id, { status });
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
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Booking Details</h2>
                                <p className="text-blue-100 text-sm">
                                    {booking.bookingNumber}
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
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                        {/* Booking Status Info */}
                        <div className="bg-green-50 rounded-2xl p-4 mb-6 border border-green-200 flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <Calendar size={18} className="text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-green-800">Confirmed Booking</p>
                                <p className="text-sm text-green-600">This booking has been confirmed and is ready for service.</p>
                            </div>
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
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase">Dropoff</p>
                                        <p className="text-sm font-medium text-gray-800">
                                            {booking.dropoff?.address || "N/A"}
                                        </p>
                                    </div>
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
                                            {booking.passengerDetails?.numberOfPassengers || 1} passengers
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Briefcase size={16} className="text-gray-400" />
                                        <span className="text-sm text-gray-800">
                                            {booking.passengerDetails?.numberOfSuitcases || 0} suitcases
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

                            <div className="bg-blue-50 rounded-2xl p-5">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <CreditCard size={18} className="text-blue-500" />
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
                                    <div className="flex justify-between pt-2 border-t border-blue-200">
                                        <span className="font-bold text-gray-900">Total</span>
                                        <span className="font-bold text-blue-600 text-lg">
                                            £{booking.pricing?.totalPrice?.toFixed(2) || "0.00"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm text-gray-600">Payment Status</span>
                                        <StatusBadge status={booking.paymentStatus} type="payment" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Flight Details & Special Instructions */}
                        {(booking.isAirportPickup || booking.specialInstructions) && (
                            <div className="grid md:grid-cols-2 gap-6">
                                {booking.isAirportPickup && booking.flightDetails && (
                                    <div className="bg-indigo-50 rounded-2xl p-5">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <Plane size={18} className="text-indigo-500" />
                                            Flight Details
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="text-gray-500">Flight:</span>{" "}
                                                <span className="font-medium">
                                                    {booking.flightDetails.flightNumber}
                                                </span>
                                            </p>
                                            {booking.flightDetails.nameBoard && (
                                                <p className="text-sm">
                                                    <span className="text-gray-500">Name Board:</span>{" "}
                                                    <span className="font-medium">
                                                        {booking.flightDetails.nameBoard}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {booking.specialInstructions && (
                                    <div className="bg-amber-50 rounded-2xl p-5">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <FileText size={18} className="text-amber-500" />
                                            Special Instructions
                                        </h4>
                                        <p className="text-sm text-gray-700">
                                            {booking.specialInstructions}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-xl transition-colors"
                        >
                            Close
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
                            Delete Booking?
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Are you sure you want to delete booking{" "}
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
                pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
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
                        ? "bg-blue-600 text-white"
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
function AdminAllBookings() {
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

    // Filters
    const [filters, setFilters] = useState({
        status: "",
        paymentStatus: "",
        serviceType: "",
    });

    // Modals
    const [editModal, setEditModal] = useState({ isOpen: false, booking: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, booking: null });

    // Fetch bookings
    const fetchBookings = async (page = 1) => {
        setIsLoading(true);
        try {
            const params = {
                page,
                limit: pagination.limit,
                ...(filters.status && { status: filters.status }),
                ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
                ...(filters.serviceType && { serviceType: filters.serviceType }),
            };

            const response = await bookingAPI.getAllBookings(params);

            if (response.success) {
                setBookings(response.data);
                setPagination(response.pagination);
                setStats(response.stats);
            }
        } catch (err) {
            console.error("Error fetching bookings:", err);
            setError("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings(1);
    }, [filters]);

    const handlePageChange = (page) => {
        fetchBookings(page);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleUpdateStatus = async (id, data) => {
        try {
            await bookingAPI.updateBookingStatus(id, data);
            fetchBookings(pagination.page);
        } catch (error) {
            console.error("Error updating status:", error);
            throw error;
        }
    };

    const handleDelete = async (id) => {
        try {
            await bookingAPI.deleteBooking(id);
            fetchBookings(pagination.page);
        } catch (error) {
            console.error("Error deleting booking:", error);
            throw error;
        }
    };

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
                                <h1 className="text-2xl font-bold text-gray-900">
                                    All Bookings
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    View all confirmed and completed bookings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    {stats && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {[
                                { label: "Total", value: stats.total, color: "bg-gray-100" },
                                { label: "Pending", value: stats.pending, color: "bg-yellow-100 text-yellow-700" },
                                { label: "Confirmed", value: stats.confirmed, color: "bg-blue-100 text-blue-700" },
                                { label: "Completed", value: stats.completed, color: "bg-green-100 text-green-700" },
                                { label: "Cancelled", value: stats.cancelled, color: "bg-red-100 text-red-700" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`px-4 py-2 rounded-xl ${stat.color} flex items-center gap-2 whitespace-nowrap`}
                                >
                                    <span className="text-sm font-medium">{stat.label}:</span>
                                    <span className="font-bold">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Filter size={18} className="text-gray-500" />
                        <h3 className="font-semibold text-gray-800">Filters</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <CustomDropdown
                                label="Booking Status"
                                icon={Calendar}
                                value={filters.status}
                                onChange={(value) => handleFilterChange("status", value)}
                                placeholder="All Statuses"
                                options={[
                                    { value: "", label: "All Statuses" },
                                    { value: "pending", label: "Pending" },
                                    { value: "confirmed", label: "Confirmed" },
                                    { value: "in-progress", label: "In Progress" },
                                    { value: "completed", label: "Completed" },
                                    { value: "cancelled", label: "Cancelled" },
                                ]}
                            />
                        </div>
                        <div>
                            <CustomDropdown
                                label="Payment Status"
                                icon={DollarSign}
                                value={filters.paymentStatus}
                                onChange={(value) => handleFilterChange("paymentStatus", value)}
                                placeholder="All Payment"
                                options={[
                                    { value: "", label: "All Payment" },
                                    { value: "pending", label: "Pending" },
                                    { value: "paid", label: "Paid" },
                                    { value: "refunded", label: "Refunded" },
                                    { value: "failed", label: "Failed" },
                                ]}
                            />
                        </div>
                        <div>
                            <CustomDropdown
                                label="Booking Type"
                                icon={Car}
                                value={filters.serviceType}
                                onChange={(value) => handleFilterChange("serviceType", value)}
                                placeholder="All Types"
                                options={[
                                    { value: "", label: "All Types" },
                                    { value: "oneway", label: "One Way (P2P)" },
                                    { value: "hourly", label: "Hourly" },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
                        <p className="text-gray-500">Loading bookings...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center mb-6">
                        <AlertTriangle size={40} className="text-red-400 mx-auto mb-3" />
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => fetchBookings(1)}
                            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Bookings Grid */}
                {!isLoading && !error && (
                    <>
                        {bookings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {bookings.map((booking) => (
                                    <BookingCard
                                        key={booking._id}
                                        booking={booking}
                                        onEdit={(b) => setEditModal({ isOpen: true, booking: b })}
                                        onDelete={(b) => setDeleteModal({ isOpen: true, booking: b })}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                                <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    No bookings found
                                </h3>
                                <p className="text-gray-500">
                                    Try adjusting your filters or check back later.
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
            <EditBookingModal
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
        </div>
    );
}

export default AdminAllBookings;
