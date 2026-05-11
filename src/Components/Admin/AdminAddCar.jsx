import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    ArrowLeft,
    Car,
    Users,
    Briefcase,
    Upload,
    X,
    Loader2,
    Plus,
    Trash2,
    Settings,
    AlertTriangle,
    Eye,
    Clock,
    Tag,
    Star,
} from "lucide-react";
import { vehicleAPI } from "../../Utils/api";

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

// Default company features
const DEFAULT_FEATURES = [
    "First class chauffeur",
    "Free 60 mins airport waiting",
    "Free 15 mins waiting for other journeys",
    "Includes meet & greet",
    "Free cancellation within 24 hours",
];

// Section Component
const FormSection = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 ${className}`}>
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
                <Icon size={18} className="text-blue-600" />
            </div>
            {title}
        </h3>
        {children}
    </div>
);

// Input Field Component
const InputField = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    placeholder = "",
    min,
    max,
    className = "",
}) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
            min={min}
            max={max}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
        />
    </div>
);

// Toggle Switch Component
const ToggleSwitch = ({ label, name, checked, onChange, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{label}</p>
            {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
        </div>
        <button
            type="button"
            onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
            className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-gray-200"
                }`}
        >
            <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-6" : ""
                    }`}
            />
        </button>
    </div>
);

function AdminAddCar() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Form state with all schema fields
    const [formData, setFormData] = useState({
        categoryName: "",
        categoryDetails: "",
        vehicleType: "Sedan",
        numberOfPassengers: 4,
        numberOfBigLuggage: 2,
        numberOfSmallLuggage: 2,
        listPriority: 0,
        vatExempt: false,
        dontCalculateVatForCashJobs: false,
        displayVehicles: true,
        displayPrice: true,
        enableGetAQuote: false,
        minimumNoticePeriod: 120,
        displayWarningIfBookingWithinNoticePeriod: false,
        warningMessage: "Please note: This booking is within the minimum notice period. We will process it as a special case.",
        preventBookingWithinNoticePeriod: false,
        companyFeatures: [...DEFAULT_FEATURES],
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle number input changes
    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select an image file");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Handle feature add
    const handleAddFeature = () => {
        setFormData((prev) => ({
            ...prev,
            companyFeatures: [...prev.companyFeatures, ""],
        }));
    };

    // Handle feature change
    const handleFeatureChange = (index, value) => {
        setFormData((prev) => ({
            ...prev,
            companyFeatures: prev.companyFeatures.map((f, i) => (i === index ? value : f)),
        }));
    };

    // Handle feature remove
    const handleRemoveFeature = (index) => {
        setFormData((prev) => ({
            ...prev,
            companyFeatures: prev.companyFeatures.filter((_, i) => i !== index),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error("Please upload a vehicle image");
            return;
        }

        if (!formData.categoryName.trim()) {
            toast.error("Please enter a category name");
            return;
        }

        setIsSubmitting(true);

        try {
            // Build FormData
            const submitData = new FormData();
            submitData.append("image", imageFile);
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
            submitData.append("enableGetAQuote", formData.enableGetAQuote);
            submitData.append("minimumNoticePeriod", formData.minimumNoticePeriod);
            submitData.append("displayWarningIfBookingWithinNoticePeriod", formData.displayWarningIfBookingWithinNoticePeriod);
            submitData.append("warningMessage", formData.warningMessage);
            submitData.append("preventBookingWithinNoticePeriod", formData.preventBookingWithinNoticePeriod);
            submitData.append("companyFeatures", JSON.stringify(formData.companyFeatures.filter((f) => f.trim())));

            const response = await vehicleAPI.createVehicle(submitData);

            if (response.success) {
                toast.success("Vehicle added successfully! 🚗", {
                    position: "top-center",
                    autoClose: 2000,
                });
                // Navigate to all cars after delay
                setTimeout(() => {
                    navigate("/admin/vehicles");
                }, 2000);
            }
        } catch (error) {
            console.error("Error creating vehicle:", error);
            const errorMessage =
                error.response?.data?.message || "Failed to add vehicle. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/admin/vehicles")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Add New Vehicle</h1>
                            <p className="text-gray-500 text-xs md:text-sm hidden sm:block">
                                Fill in the details to add a new vehicle to your fleet
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-6 space-y-5">
                {/* Basic Info Section */}
                <FormSection title="Basic Information" icon={Car}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                            label="Category Name"
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Mercedes S-Class"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Vehicle Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                            >
                                {VEHICLE_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category Details <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="categoryDetails"
                            value={formData.categoryDetails}
                            onChange={handleChange}
                            required
                            placeholder="Brief description of the vehicle..."
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                        />
                    </div>
                </FormSection>

                {/* Image Upload Section */}
                <FormSection title="Vehicle Image" icon={Upload}>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        {/* Image Preview */}
                        <div className="w-full md:w-48 h-36 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200">
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-4">
                                    <Car size={32} className="text-gray-300 mx-auto mb-2" />
                                    <p className="text-xs text-gray-400">No image selected</p>
                                </div>
                            )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1">
                            <label className="cursor-pointer">
                                <div className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200 hover:bg-blue-100 transition-colors text-center text-sm font-medium">
                                    <Upload size={18} className="inline-block mr-2" />
                                    {imagePreview ? "Change Image" : "Upload Image"}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                                PNG, JPG or WEBP. Max 5MB recommended.
                            </p>
                        </div>
                    </div>
                </FormSection>

                {/* Capacity Section */}
                <FormSection title="Capacity & Luggage" icon={Users}>
                    <div className="grid grid-cols-3 gap-4">
                        <InputField
                            label="Passengers"
                            name="numberOfPassengers"
                            type="number"
                            value={formData.numberOfPassengers}
                            onChange={handleNumberChange}
                            required
                            min={1}
                            max={50}
                        />
                        <InputField
                            label="Big Luggage"
                            name="numberOfBigLuggage"
                            type="number"
                            value={formData.numberOfBigLuggage}
                            onChange={handleNumberChange}
                            required
                            min={0}
                            max={20}
                        />
                        <InputField
                            label="Small Luggage"
                            name="numberOfSmallLuggage"
                            type="number"
                            value={formData.numberOfSmallLuggage}
                            onChange={handleNumberChange}
                            required
                            min={0}
                            max={20}
                        />
                    </div>
                </FormSection>

                {/* Display Settings Section */}
                <FormSection title="Display Settings" icon={Eye}>
                    <ToggleSwitch
                        label="Display Vehicle"
                        name="displayVehicles"
                        checked={formData.displayVehicles}
                        onChange={handleChange}
                        description="Show this vehicle to customers during booking"
                    />
                    <ToggleSwitch
                        label="Display Price"
                        name="displayPrice"
                        checked={formData.displayPrice}
                        onChange={handleChange}
                        description="Show price to customers"
                    />
                    <ToggleSwitch
                        label="Enable Get a Quote"
                        name="enableGetAQuote"
                        checked={formData.enableGetAQuote}
                        onChange={handleChange}
                        description="Show 'Get a Quote' button instead of price"
                    />
                    <div className="pt-3">
                        <InputField
                            label="List Priority (Lower = Higher Priority)"
                            name="listPriority"
                            type="number"
                            value={formData.listPriority}
                            onChange={handleNumberChange}
                            min={0}
                            placeholder="0"
                        />
                    </div>
                </FormSection>

                {/* Notice Period Section */}
                <FormSection title="Booking Notice Period" icon={Clock}>
                    <InputField
                        label="Minimum Notice Period (minutes)"
                        name="minimumNoticePeriod"
                        type="number"
                        value={formData.minimumNoticePeriod}
                        onChange={handleNumberChange}
                        min={0}
                        placeholder="120"
                        className="mb-4"
                    />
                    <ToggleSwitch
                        label="Show Warning Within Notice Period"
                        name="displayWarningIfBookingWithinNoticePeriod"
                        checked={formData.displayWarningIfBookingWithinNoticePeriod}
                        onChange={handleChange}
                    />
                    <ToggleSwitch
                        label="Prevent Booking Within Notice Period"
                        name="preventBookingWithinNoticePeriod"
                        checked={formData.preventBookingWithinNoticePeriod}
                        onChange={handleChange}
                    />
                    {formData.displayWarningIfBookingWithinNoticePeriod && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Warning Message
                            </label>
                            <textarea
                                name="warningMessage"
                                value={formData.warningMessage}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                            />
                        </div>
                    )}
                </FormSection>

                {/* VAT Settings Section */}
                <FormSection title="VAT Settings" icon={Settings}>
                    <ToggleSwitch
                        label="VAT Exempt"
                        name="vatExempt"
                        checked={formData.vatExempt}
                        onChange={handleChange}
                        description="This vehicle is exempt from VAT"
                    />
                    <ToggleSwitch
                        label="Don't Calculate VAT for Cash Jobs"
                        name="dontCalculateVatForCashJobs"
                        checked={formData.dontCalculateVatForCashJobs}
                        onChange={handleChange}
                    />
                </FormSection>

                {/* Company Features Section */}
                <FormSection title="Company Features" icon={Star}>
                    <p className="text-sm text-gray-500 mb-3">
                        Features shown to customers for this vehicle
                    </p>
                    <div className="space-y-2">
                        {formData.companyFeatures.map((feature, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                                    placeholder="Enter feature..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddFeature}
                        className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                        <Plus size={18} />
                        Add Feature
                    </button>
                </FormSection>

                {/* Submit Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky bottom-4 z-10"
                >
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Adding Vehicle...
                            </>
                        ) : (
                            <>
                                <Car size={20} />
                                Add Vehicle
                            </>
                        )}
                    </button>
                </motion.div>
            </form>
        </div>
    );
}

export default AdminAddCar;
