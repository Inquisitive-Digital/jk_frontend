import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    Car,
    Users,
    Briefcase,
    Search,
    ArrowLeft,
    Loader2,
    AlertTriangle,
    Eye,
    EyeOff,
    Trash2,
    Edit3,
    X,
    Check,
    Plus,
    RefreshCw,
    Upload,
    Save,
    Star,
} from "lucide-react";
import { vehicleAPI, getImageUrl } from "../../Utils/api";

// Vehicle Types from schema
const VEHICLE_TYPES = [
    "Sedan",
    "SUV",
    "Luxury",
    "Van",
    "Business",
    "First Class",
    "Executive",
];

// Status Badge
const StatusBadge = ({ isActive }) => (
    <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${isActive
            ? "bg-green-100 text-green-700 border border-green-200"
            : "bg-gray-100 text-gray-500 border border-gray-200"
            }`}
    >
        {isActive ? "Active" : "Inactive"}
    </span>
);

// Vehicle Card Component - With Edit button
const VehicleCard = ({ vehicle, onEdit, onToggleStatus, onDelete }) => {
    const imageUrl = getImageUrl(vehicle.image?.url);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
        >
            {/* Image + Quick Info */}
            <div className="flex p-3 gap-3">
                <div className="w-24 h-20 md:w-28 md:h-24 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-lg overflow-hidden">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={vehicle.categoryName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/120x80?text=Car";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Car size={32} className="text-gray-300" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-sm md:text-base truncate capitalize">
                            {vehicle.categoryName}
                        </h3>
                        <StatusBadge isActive={vehicle.isActive} />
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                        {vehicle.categoryDetails || "No description"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                            <Users size={14} className="text-blue-500" />
                            {vehicle.numberOfPassengers}
                        </span>
                        <span className="flex items-center gap-1">
                            <Briefcase size={14} className="text-amber-500" />
                            {vehicle.numberOfBigLuggage || 0}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-500 capitalize">
                            {vehicle.vehicleType || "standard"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions Row - With Edit */}
            <div className="flex border-t border-gray-100">
                <button
                    onClick={() => onEdit(vehicle)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                >
                    <Edit3 size={16} />
                    <span className="hidden sm:inline">Edit</span>
                </button>
                <div className="w-px bg-gray-100" />
                <button
                    onClick={() => onToggleStatus(vehicle)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-colors text-sm font-medium ${vehicle.isActive
                        ? "text-amber-600 hover:bg-amber-50"
                        : "text-green-600 hover:bg-green-50"
                        }`}
                >
                    {vehicle.isActive ? (
                        <>
                            <EyeOff size={16} />
                            <span className="hidden sm:inline">Hide</span>
                        </>
                    ) : (
                        <>
                            <Eye size={16} />
                            <span className="hidden sm:inline">Show</span>
                        </>
                    )}
                </button>
                <div className="w-px bg-gray-100" />
                <button
                    onClick={() => onDelete(vehicle)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
                >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </div>
        </motion.div>
    );
};

// Edit Vehicle Modal - Full editing capability
const EditVehicleModal = ({ vehicle, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [newImageFile, setNewImageFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    useEffect(() => {
        if (vehicle) {
            setFormData({
                categoryName: vehicle.categoryName || "",
                categoryDetails: vehicle.categoryDetails || "",
                vehicleType: vehicle.vehicleType || "Sedan",
                numberOfPassengers: vehicle.numberOfPassengers || 4,
                numberOfBigLuggage: vehicle.numberOfBigLuggage || 2,
                numberOfSmallLuggage: vehicle.numberOfSmallLuggage || 2,
                listPriority: vehicle.listPriority || 0,
                vatExempt: vehicle.vatExempt || false,
                dontCalculateVatForCashJobs: vehicle.dontCalculateVatForCashJobs || false,
                displayVehicles: vehicle.displayVehicles !== false,
                displayPrice: vehicle.displayPrice !== false,
                minimumNoticePeriod: vehicle.minimumNoticePeriod || 120,
                displayWarningIfBookingWithinNoticePeriod: vehicle.displayWarningIfBookingWithinNoticePeriod || false,
                warningMessage: vehicle.warningMessage || "",
                preventBookingWithinNoticePeriod: vehicle.preventBookingWithinNoticePeriod || false,
                companyFeatures: vehicle.companyFeatures || [],
            });
            setImagePreview(getImageUrl(vehicle.image?.url));
            setNewImageFile(null);
        }
    }, [vehicle]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            setNewImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFeatureChange = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            companyFeatures: prev.companyFeatures.map((f, i) => (i === index ? value : f)),
        }));
    };

    const handleAddFeature = () => {
        setFormData((prev) => ({
            ...prev,
            companyFeatures: [...prev.companyFeatures, ""],
        }));
    };

    const handleRemoveFeature = (index) => {
        setFormData((prev) => ({
            ...prev,
            companyFeatures: prev.companyFeatures.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        if (!formData.categoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        setIsSaving(true);
        try {
            const submitData = new FormData();
            if (newImageFile) {
                submitData.append("image", newImageFile);
            }
            submitData.append("categoryName", formData.categoryName);
            submitData.append("categoryDetails", formData.categoryDetails);
            submitData.append("vehicleType", formData.vehicleType);
            submitData.append("numberOfPassengers", formData.numberOfPassengers);
            submitData.append("numberOfBigLuggage", formData.numberOfBigLuggage);
            submitData.append("numberOfSmallLuggage", formData.numberOfSmallLuggage);
            submitData.append("listPriority", formData.listPriority);
            submitData.append("vatExempt", formData.vatExempt);
            submitData.append("dontCalculateVatForCashJobs", formData.dontCalculateVatForCashJobs);
            submitData.append("displayVehicles", formData.displayVehicles);
            submitData.append("displayPrice", formData.displayPrice);
            submitData.append("minimumNoticePeriod", formData.minimumNoticePeriod);
            submitData.append("displayWarningIfBookingWithinNoticePeriod", formData.displayWarningIfBookingWithinNoticePeriod);
            submitData.append("warningMessage", formData.warningMessage);
            submitData.append("preventBookingWithinNoticePeriod", formData.preventBookingWithinNoticePeriod);
            submitData.append("companyFeatures", JSON.stringify(formData.companyFeatures.filter((f) => f.trim())));

            await onSave(vehicle._id, submitData);
            toast.success("Vehicle updated successfully! 🚗");
            onClose();
        } catch (error) {
            console.error("Error updating vehicle:", error);
            const errorMessage = error.response?.data?.message || "Failed to update vehicle";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen || !vehicle) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">Edit Vehicle</h2>
                                <p className="text-blue-100 text-sm capitalize">{vehicle.categoryName}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 overflow-y-auto max-h-[calc(90vh-160px)] space-y-5">
                        {/* Image Section */}
                        <div className="flex gap-4 items-start">
                            <div className="w-32 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Car size={32} className="text-gray-300" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="cursor-pointer">
                                    <div className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors text-center text-sm font-medium">
                                        <Upload size={16} className="inline-block mr-2" />
                                        Change Image
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                                <p className="text-xs text-gray-500 mt-2">PNG, JPG or WEBP</p>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={formData.categoryName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                >
                                    {VEHICLE_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="categoryDetails"
                                value={formData.categoryDetails}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                            />
                        </div>

                        {/* Capacity */}
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Passengers</label>
                                <input
                                    type="number"
                                    name="numberOfPassengers"
                                    value={formData.numberOfPassengers}
                                    onChange={handleNumberChange}
                                    min={1}
                                    max={50}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Big Luggage</label>
                                <input
                                    type="number"
                                    name="numberOfBigLuggage"
                                    value={formData.numberOfBigLuggage}
                                    onChange={handleNumberChange}
                                    min={0}
                                    max={20}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Small Luggage</label>
                                <input
                                    type="number"
                                    name="numberOfSmallLuggage"
                                    value={formData.numberOfSmallLuggage}
                                    onChange={handleNumberChange}
                                    min={0}
                                    max={20}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Display Settings</h4>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="displayVehicles"
                                        checked={formData.displayVehicles}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Display to customers</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="displayPrice"
                                        checked={formData.displayPrice}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Display price</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="vatExempt"
                                        checked={formData.vatExempt}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">VAT Exempt</span>
                                </label>
                            </div>
                            <div className="mt-3">
                                <label className="block text-xs font-medium text-gray-600 mb-1">List Priority (Lower = Higher)</label>
                                <input
                                    type="number"
                                    name="listPriority"
                                    value={formData.listPriority}
                                    onChange={handleNumberChange}
                                    min={0}
                                    className="w-24 px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                            <div className="flex items-center gap-2 mb-3">
                                <Star size={16} className="text-green-600" />
                                <h4 className="text-sm font-semibold text-gray-800">Company Features</h4>
                            </div>
                            <div className="space-y-2">
                                {formData.companyFeatures?.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            placeholder="Feature..."
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFeature(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="mt-2 flex items-center gap-1 text-green-600 text-sm font-medium hover:text-green-700"
                            >
                                <Plus size={16} />
                                Add Feature
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ vehicle, isOpen, onClose, onConfirm }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm(vehicle._id);
            onClose();
        } catch (error) {
            console.error("Error deleting:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isOpen || !vehicle) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <AlertTriangle size={28} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Vehicle?</h3>
                        <p className="text-gray-500 text-sm mb-5">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-gray-700 capitalize">
                                {vehicle.categoryName}
                            </span>
                            ? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isDeleting}
                                className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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

// Main Component
function AdminAllCars() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Modals
    const [editModal, setEditModal] = useState({ isOpen: false, vehicle: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, vehicle: null });

    // Fetch vehicles
    const fetchVehicles = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await vehicleAPI.getAllVehicles();
            if (response.success) {
                setVehicles(response.data);
                setFilteredVehicles(response.data);
            }
        } catch (err) {
            console.error("Error fetching vehicles:", err);
            setError("Failed to load vehicles");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    // Filter vehicles
    useEffect(() => {
        let result = [...vehicles];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (v) =>
                    v.categoryName.toLowerCase().includes(query) ||
                    v.categoryDetails?.toLowerCase().includes(query) ||
                    v.vehicleType?.toLowerCase().includes(query)
            );
        }

        if (statusFilter === "active") {
            result = result.filter((v) => v.isActive);
        } else if (statusFilter === "inactive") {
            result = result.filter((v) => !v.isActive);
        }

        setFilteredVehicles(result);
    }, [vehicles, searchQuery, statusFilter]);

    // Toggle vehicle status
    const handleToggleStatus = async (vehicle) => {
        try {
            await vehicleAPI.toggleVehicleStatus(vehicle._id);
            setVehicles((prev) =>
                prev.map((v) =>
                    v._id === vehicle._id ? { ...v, isActive: !v.isActive } : v
                )
            );
            toast.success(vehicle.isActive ? "Vehicle hidden" : "Vehicle visible");
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Failed to update vehicle status");
        }
    };

    // Update vehicle
    const handleUpdateVehicle = async (id, formData) => {
        await vehicleAPI.updateVehicle(id, formData);
        fetchVehicles(); // Refresh list
    };

    // Delete vehicle
    const handleDelete = async (id) => {
        try {
            await vehicleAPI.deleteVehicle(id);
            setVehicles((prev) => prev.filter((v) => v._id !== id));
            toast.success("Vehicle deleted");
        } catch (error) {
            console.error("Error deleting vehicle:", error);
            toast.error("Failed to delete vehicle");
            throw error;
        }
    };

    // Stats
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.isActive).length;
    const inactiveVehicles = vehicles.filter((v) => !v.isActive).length;

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-center" autoClose={2000} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/admin-dashboard")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">All Cars</h1>
                                <p className="text-gray-500 text-xs md:text-sm hidden sm:block">
                                    Manage your vehicle fleet
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/admin/add-car")}
                            className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Add Car</span>
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                        <div className="px-3 py-1.5 rounded-lg bg-gray-100 flex items-center gap-2 whitespace-nowrap text-sm">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-bold">{totalVehicles}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 flex items-center gap-2 whitespace-nowrap text-sm">
                            <span>Active:</span>
                            <span className="font-bold">{activeVehicles}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-600 flex items-center gap-2 whitespace-nowrap text-sm">
                            <span>Inactive:</span>
                            <span className="font-bold">{inactiveVehicles}</span>
                        </div>
                        <button
                            onClick={fetchVehicles}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 flex items-center gap-1 whitespace-nowrap text-sm hover:bg-blue-100 transition-colors"
                        >
                            <RefreshCw size={14} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            {["all", "active", "inactive"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${statusFilter === status
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Loader2 size={40} className="text-blue-500 animate-spin mb-3" />
                        <p className="text-gray-500 text-sm">Loading vehicles...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-4">
                        <AlertTriangle size={36} className="text-red-400 mx-auto mb-2" />
                        <p className="text-red-600 text-sm">{error}</p>
                        <button
                            onClick={fetchVehicles}
                            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Vehicles Grid */}
                {!isLoading && !error && (
                    <>
                        {filteredVehicles.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredVehicles.map((vehicle) => (
                                    <VehicleCard
                                        key={vehicle._id}
                                        vehicle={vehicle}
                                        onEdit={(v) => setEditModal({ isOpen: true, vehicle: v })}
                                        onToggleStatus={handleToggleStatus}
                                        onDelete={(v) => setDeleteModal({ isOpen: true, vehicle: v })}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-10 text-center border border-gray-100">
                                <Car size={40} className="text-gray-300 mx-auto mb-3" />
                                <h3 className="text-base font-semibold text-gray-700 mb-1">
                                    No vehicles found
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    {searchQuery || statusFilter !== "all"
                                        ? "Try adjusting your filters"
                                        : "Add your first vehicle to get started"}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modals */}
            <EditVehicleModal
                vehicle={editModal.vehicle}
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, vehicle: null })}
                onSave={handleUpdateVehicle}
            />
            <DeleteConfirmModal
                vehicle={deleteModal.vehicle}
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, vehicle: null })}
                onConfirm={handleDelete}
            />
        </div>
    );
}

export default AdminAllCars;
