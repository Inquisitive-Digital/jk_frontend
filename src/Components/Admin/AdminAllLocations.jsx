import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    ArrowLeft,
    MapPin,
    Search,
    Plus,
    Edit3,
    Trash2,
    Loader2,
    AlertTriangle,
    X,
    RefreshCw,
    Plane,
    Building,
    Trophy,
    Flag,
    CircleDot,
    DollarSign,
    Hexagon,
} from "lucide-react";
import { locationAPI } from "../../Utils/api";

// Location Type Icons
const LOCATION_TYPE_ICONS = {
    airport: Plane,
    stadium: Trophy,
    circuit: Flag,
    venue: Building,
    other: CircleDot,
};

// Location Type Badge
const LocationTypeBadge = ({ type }) => {
    const colors = {
        airport: "bg-blue-100 text-blue-700",
        stadium: "bg-purple-100 text-purple-700",
        circuit: "bg-orange-100 text-orange-700",
        venue: "bg-green-100 text-green-700",
        other: "bg-gray-100 text-gray-700",
    };
    const Icon = LOCATION_TYPE_ICONS[type] || CircleDot;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colors[type] || colors.other}`}>
            <Icon size={12} />
            {type?.charAt(0).toUpperCase() + type?.slice(1)}
        </span>
    );
};

// Delete Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, locationName, isDeleting }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={28} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Location?</h3>
                    <p className="text-gray-500 text-sm mb-5">
                        Delete <span className="font-semibold text-gray-700">{locationName}</span>?
                        <br />
                        <span className="text-red-500 text-xs">This will also delete all associated pricing!</span>
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            Delete
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Location Card
const LocationCard = ({ location, onEdit, onDelete, onSetPricing, onSetZone }) => {
    const Icon = LOCATION_TYPE_ICONS[location.locationType] || CircleDot;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${location.isActive ? "bg-blue-100" : "bg-gray-100"
                        }`}>
                        <Icon size={24} className={location.isActive ? "text-blue-600" : "text-gray-400"} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{location.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{location.address}</p>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <LocationTypeBadge type={location.locationType} />
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${location.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                        {location.isActive ? "Active" : "Inactive"}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Zone</p>
                        <p className="font-medium text-gray-900 truncate">{location.zone || "N/A"}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Radius</p>
                        <p className="font-medium text-gray-900">{location.radiusKm || 5} km</p>
                    </div>
                </div>

                {location.iataCode && (
                    <div className="text-xs text-gray-500">
                        IATA: <span className="font-semibold text-gray-700">{location.iataCode}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex border-t border-gray-100">
                <button
                    onClick={() => onSetPricing(location)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-green-600 hover:bg-green-50 transition-colors text-sm font-medium"
                >
                    <DollarSign size={16} />
                    <span className="hidden sm:inline">Pricing</span>
                </button>
                <div className="w-px bg-gray-100" />
                <button
                    onClick={() => onSetZone(location)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-amber-600 hover:bg-amber-50 transition-colors text-sm font-medium"
                >
                    <Hexagon size={16} />
                    <span className="hidden sm:inline">Zone</span>
                </button>
                <div className="w-px bg-gray-100" />
                <button
                    onClick={() => onEdit(location)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                    <Edit3 size={16} />
                    <span className="hidden sm:inline">Edit</span>
                </button>
                <div className="w-px bg-gray-100" />
                <button
                    onClick={() => onDelete(location)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </div>
        </motion.div>
    );
};

// Main Component
function AdminAllLocations() {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, location: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch locations
    const fetchLocations = async () => {
        setIsLoading(true);
        try {
            const response = await locationAPI.getAll();
            if (response.success) {
                setLocations(response.data);
                setFilteredLocations(response.data);
            }
        } catch (err) {
            console.error("Error fetching locations:", err);
            toast.error("Failed to load locations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    // Filter locations
    useEffect(() => {
        let result = [...locations];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (l) =>
                    l.name?.toLowerCase().includes(query) ||
                    l.address?.toLowerCase().includes(query) ||
                    l.iataCode?.toLowerCase().includes(query)
            );
        }

        if (typeFilter !== "all") {
            result = result.filter((l) => l.locationType === typeFilter);
        }

        setFilteredLocations(result);
    }, [locations, searchQuery, typeFilter]);

    // Handle delete
    const handleDelete = async () => {
        if (!deleteModal.location) return;

        setIsDeleting(true);
        try {
            await locationAPI.delete(deleteModal.location._id);
            toast.success("Location deleted successfully");
            setLocations((prev) => prev.filter((l) => l._id !== deleteModal.location._id));
            setDeleteModal({ isOpen: false, location: null });
        } catch (err) {
            console.error("Error deleting:", err);
            toast.error(err.response?.data?.message || "Failed to delete location");
        } finally {
            setIsDeleting(false);
        }
    };

    // Stats
    const stats = {
        total: locations.length,
        airports: locations.filter((l) => l.locationType === "airport").length,
        other: locations.filter((l) => l.locationType !== "airport").length,
        active: locations.filter((l) => l.isActive).length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-center" autoClose={2000} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/admin-dashboard")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">All Locations</h1>
                                <p className="text-gray-500 text-xs md:text-sm hidden sm:block">
                                    Manage airports, stadiums, and special locations
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/admin/add-location")}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Location</span>
                        </button>
                    </div>

                    {/* Stats & Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                        {/* Stats */}
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap">
                                Total: {stats.total}
                            </span>
                            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1">
                                <Plane size={14} /> {stats.airports}
                            </span>
                            <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium whitespace-nowrap">
                                Active: {stats.active}
                            </span>
                        </div>

                        {/* Search + Filter */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="airport">Airports</option>
                                <option value="stadium">Stadiums</option>
                                <option value="circuit">Circuits</option>
                                <option value="venue">Venues</option>
                                <option value="other">Other</option>
                            </select>
                            <button
                                onClick={fetchLocations}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 size={40} className="text-blue-500 animate-spin mb-3" />
                        <p className="text-gray-500">Loading locations...</p>
                    </div>
                ) : filteredLocations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {filteredLocations.map((location) => (
                                <LocationCard
                                    key={location._id}
                                    location={location}
                                    onEdit={(l) => navigate(`/admin/edit-location/${l._id}`)}
                                    onDelete={(l) => setDeleteModal({ isOpen: true, location: l })}
                                    onSetPricing={(l) => navigate(`/admin/location-pricing/${l._id}`)}
                                    onSetZone={(l) => navigate(`/admin/location-zone/${l._id}`)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin size={28} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Locations Found</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {searchQuery || typeFilter !== "all"
                                ? "Try adjusting your search or filter"
                                : "Add your first location to get started"}
                        </p>
                        <button
                            onClick={() => navigate("/admin/add-location")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
                        >
                            <Plus size={16} />
                            Add Location
                        </button>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                <DeleteModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, location: null })}
                    onConfirm={handleDelete}
                    locationName={deleteModal.location?.name || ""}
                    isDeleting={isDeleting}
                />
            </AnimatePresence>
        </div>
    );
}

export default AdminAllLocations;
