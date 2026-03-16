import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    ArrowLeft,
    Car,
    DollarSign,
    MapPin,
    Clock,
    Plus,
    Trash2,
    Save,
    Loader2,
    Check,
    ChevronRight,
    Settings,
    Zap,
    RefreshCw,
} from "lucide-react";
import { vehicleAPI, pricingAPI, getImageUrl } from "../../Utils/api";

// Tab Button Component
const TabButton = ({ active, icon: Icon, label, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
    >
        <Icon size={18} />
        <span className="hidden sm:inline">{label}</span>
    </button>
);

// Vehicle List Item
const VehicleListItem = ({ vehicle, isSelected, onClick, hasPricing }) => {
    const imageUrl = getImageUrl(vehicle.image?.url);

    return (
        <motion.button
            whileHover={{ x: 4 }}
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${isSelected
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white hover:bg-gray-50 border border-gray-100"
                }`}
        >
            <div className={`w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isSelected ? "bg-blue-500" : "bg-gray-100"
                }`}>
                {imageUrl ? (
                    <img src={imageUrl} alt={vehicle.categoryName} className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car size={20} className={isSelected ? "text-blue-200" : "text-gray-300"} />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate capitalize ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {vehicle.categoryName}
                </p>
                <p className={`text-xs ${isSelected ? "text-blue-200" : "text-gray-500"}`}>
                    {vehicle.vehicleType}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {hasPricing && (
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-green-300" : "bg-green-500"}`} />
                )}
                <ChevronRight size={16} className={isSelected ? "text-blue-200" : "text-gray-400"} />
            </div>
        </motion.button>
    );
};

// Distance Tier Row Component
const DistanceTierRow = ({ tier, index, onChange, onRemove, isFirst }) => (
    <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl"
    >
        <div className="flex-1 grid grid-cols-4 gap-2">
            <div>
                <label className="text-xs text-gray-500 mb-1 block">From (mi)</label>
                <input
                    type="number"
                    value={tier.fromDistance}
                    onChange={(e) => onChange(index, "fromDistance", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">To (mi)</label>
                <input
                    type="number"
                    value={tier.toDistance}
                    onChange={(e) => onChange(index, "toDistance", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Price (£)</label>
                <input
                    type="number"
                    step="0.01"
                    value={tier.price}
                    onChange={(e) => onChange(index, "price", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={0}
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <select
                    value={tier.type}
                    onChange={(e) => onChange(index, "type", e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="fixed">{isFirst ? "Min Charge" : "Fixed"}</option>
                    <option value="per_mile">Per Mile</option>
                </select>
            </div>
        </div>
        {!isFirst && (
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
                <Trash2 size={18} />
            </button>
        )}
    </motion.div>
);

// Shimmer Loader Component
const ShimmerField = () => (
    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-200 animate-pulse" />
);

const ShimmerLoader = () => (
    <div className="space-y-5">
        {/* Shimmer Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5">
            <div className="flex items-center gap-4">
                <div className="w-16 h-14 bg-white/20 rounded-xl animate-pulse" />
                <div className="flex-1 space-y-2">
                    <div className="h-6 bg-white/30 rounded-lg w-3/4 animate-pulse" />
                    <div className="h-4 bg-white/20 rounded-lg w-1/2 animate-pulse" />
                </div>
            </div>
        </div>

        {/* Shimmer Distance Tiers */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-gray-200 rounded-lg w-40 animate-pulse" />
                <div className="h-8 bg-gray-200 rounded-lg w-24 animate-pulse" />
            </div>
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1 grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((j) => (
                                <ShimmerField key={j} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Shimmer Additional Charges */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded-lg w-48 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i}>
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
                        <ShimmerField />
                    </div>
                ))}
            </div>
        </div>

        {/* Shimmer Display Options */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded-lg w-40 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>

        {/* Shimmer Save Button */}
        <div className="h-14 bg-gray-200 rounded-xl animate-pulse" />
    </div>
);

// Main Component
function AdminPricing() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [activeTab, setActiveTab] = useState("p2p"); // p2p or hourly
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingPricing, setIsFetchingPricing] = useState(false);
    const [existingPricing, setExistingPricing] = useState({ p2p: null, hourly: null });

    // P2P Form State
    const [p2pForm, setP2pForm] = useState({
        coverageZone: "Entire UK Cover",
        distanceTiers: [
            { fromDistance: 0, toDistance: 10, price: 50, type: "fixed" },
            { fromDistance: 11, toDistance: 20, price: 3, type: "per_mile" },
            { fromDistance: 21, toDistance: 30, price: 2.5, type: "per_mile" },
        ],
        afterDistanceThreshold: 30,
        afterDistancePricePerMile: 2,
        extras: {
            extraStopPrice: 10,
            childSeatPrice: 0,
            congestionCharge: 0,
            parkingIncluded: false,
        },
        displayVATInclusive: true,
        displayParkingInclusive: false,
        priceRoundOff: false,
        status: "active",
    });

    // Hourly Form State
    const [hourlyForm, setHourlyForm] = useState({
        coverageZone: "Entire UK Cover",
        hourlyRate: 45,
        minimumHours: 4,
        additionalHourCharge: 45,
        milesIncluded: 40,
        excessMileageCharge: 2,
        extras: {
            extraStopPrice: 10,
            childSeatPrice: 0,
            congestionCharge: 0,
            parkingIncluded: false,
        },
        displayVATInclusive: true,
        displayParkingInclusive: false,
        priceRoundOff: false,
        status: "active",
    });

    // Fetch vehicles
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await vehicleAPI.getAllVehicles();
                if (response.success) {
                    setVehicles(response.data);
                    if (response.data.length > 0) {
                        setSelectedVehicle(response.data[0]);
                    }
                }
            } catch (err) {
                console.error("Error fetching vehicles:", err);
                toast.error("Failed to load vehicles");
            } finally {
                setIsLoading(false);
            }
        };
        fetchVehicles();
    }, []);

    // Default form values (for reset)
    const defaultP2PForm = {
        coverageZone: "Entire UK Cover",
        distanceTiers: [
            { fromDistance: 0, toDistance: 10, price: 50, type: "fixed" },
            { fromDistance: 11, toDistance: 20, price: 3, type: "per_mile" },
            { fromDistance: 21, toDistance: 30, price: 2.5, type: "per_mile" },
        ],
        afterDistanceThreshold: 30,
        afterDistancePricePerMile: 2,
        extras: {
            extraStopPrice: 10,
            childSeatPrice: 0,
            congestionCharge: 0,
            parkingIncluded: false,
        },
        displayVATInclusive: true,
        displayParkingInclusive: false,
        priceRoundOff: false,
        status: "active",
    };

    const defaultHourlyForm = {
        coverageZone: "Entire UK Cover",
        hourlyRate: 45,
        minimumHours: 4,
        additionalHourCharge: 45,
        milesIncluded: 40,
        excessMileageCharge: 2,
        extras: {
            extraStopPrice: 10,
            childSeatPrice: 0,
            congestionCharge: 0,
            parkingIncluded: false,
        },
        displayVATInclusive: true,
        displayParkingInclusive: false,
        priceRoundOff: false,
        status: "active",
    };

    // Fetch pricing when vehicle changes
    useEffect(() => {
        const fetchPricing = async () => {
            if (!selectedVehicle) return;

            // Set loading state for shimmer
            setIsFetchingPricing(true);

            // Reset forms to defaults immediately to prevent flicker of old data
            setP2pForm(defaultP2PForm);
            setHourlyForm(defaultHourlyForm);

            try {
                const response = await pricingAPI.getVehiclePricing(selectedVehicle._id);
                if (response.success) {
                    setExistingPricing({
                        p2p: response.data.p2p,
                        hourly: response.data.hourly,
                    });

                    // Pre-fill P2P form if exists
                    if (response.data.p2p) {
                        const p2p = response.data.p2p;
                        setP2pForm({
                            coverageZone: p2p.coverageZone || "Entire UK Cover",
                            distanceTiers: p2p.pointToPoint?.distanceTiers || defaultP2PForm.distanceTiers,
                            afterDistanceThreshold: p2p.pointToPoint?.afterDistanceThreshold || 30,
                            afterDistancePricePerMile: p2p.pointToPoint?.afterDistancePricePerMile || 2,
                            extras: p2p.extras || defaultP2PForm.extras,
                            displayVATInclusive: p2p.displayVATInclusive ?? true,
                            displayParkingInclusive: p2p.displayParkingInclusive ?? false,
                            priceRoundOff: p2p.priceRoundOff ?? false,
                            status: p2p.status || "active",
                        });
                    }

                    // Pre-fill Hourly form if exists
                    if (response.data.hourly) {
                        const hourly = response.data.hourly;
                        setHourlyForm({
                            coverageZone: hourly.coverageZone || "Entire UK Cover",
                            hourlyRate: hourly.hourly?.hourlyRate || 45,
                            minimumHours: hourly.hourly?.minimumHours || 4,
                            additionalHourCharge: hourly.hourly?.additionalHourCharge || 45,
                            milesIncluded: hourly.hourly?.milesIncluded || 40,
                            excessMileageCharge: hourly.hourly?.excessMileageCharge || 2,
                            extras: hourly.extras || defaultHourlyForm.extras,
                            displayVATInclusive: hourly.displayVATInclusive ?? true,
                            displayParkingInclusive: hourly.displayParkingInclusive ?? false,
                            priceRoundOff: hourly.priceRoundOff ?? false,
                            status: hourly.status || "active",
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching pricing:", err);
            } finally {
                setIsFetchingPricing(false);
            }
        };
        fetchPricing();
    }, [selectedVehicle]);

    // Handle distance tier changes
    const handleTierChange = (index, field, value) => {
        setP2pForm((prev) => ({
            ...prev,
            distanceTiers: prev.distanceTiers.map((tier, i) =>
                i === index ? { ...tier, [field]: value } : tier
            ),
        }));
    };

    // Add new tier
    const addTier = () => {
        const lastTier = p2pForm.distanceTiers[p2pForm.distanceTiers.length - 1];
        setP2pForm((prev) => ({
            ...prev,
            distanceTiers: [
                ...prev.distanceTiers,
                {
                    fromDistance: lastTier.toDistance + 1,
                    toDistance: lastTier.toDistance + 10,
                    price: 2,
                    type: "per_mile",
                },
            ],
        }));
    };

    // Remove tier
    const removeTier = (index) => {
        setP2pForm((prev) => ({
            ...prev,
            distanceTiers: prev.distanceTiers.filter((_, i) => i !== index),
        }));
    };

    // Save P2P Pricing
    const saveP2PPricing = async () => {
        if (!selectedVehicle) return;

        setIsSaving(true);
        try {
            const response = await pricingAPI.setP2PPricing(selectedVehicle._id, p2pForm);
            if (response.success) {
                toast.success("P2P Pricing saved successfully! ✅");
                setExistingPricing((prev) => ({ ...prev, p2p: response.data }));
            }
        } catch (err) {
            console.error("Error saving P2P pricing:", err);
            toast.error(err.response?.data?.message || "Failed to save pricing");
        } finally {
            setIsSaving(false);
        }
    };

    // Save Hourly Pricing
    const saveHourlyPricing = async () => {
        if (!selectedVehicle) return;

        setIsSaving(true);
        try {
            const response = await pricingAPI.setHourlyPricing(selectedVehicle._id, hourlyForm);
            if (response.success) {
                toast.success("Hourly Pricing saved successfully! ✅");
                setExistingPricing((prev) => ({ ...prev, hourly: response.data }));
            }
        } catch (err) {
            console.error("Error saving hourly pricing:", err);
            toast.error(err.response?.data?.message || "Failed to save pricing");
        } finally {
            setIsSaving(false);
        }
    };

    // Check if vehicle has pricing set
    const vehicleHasPricing = (vehicleId) => {
        return existingPricing.p2p?.vehicle === vehicleId || existingPricing.hourly?.vehicle === vehicleId;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-gray-500">Loading vehicles...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-center" autoClose={2000} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/admin-dashboard")}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={22} />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                    Vehicle Pricing
                                </h1>
                                <p className="text-gray-500 text-xs md:text-sm hidden sm:block">
                                    Set P2P and Hourly pricing for each vehicle
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2">
                            <TabButton
                                active={activeTab === "p2p"}
                                icon={MapPin}
                                label="P2P Pricing"
                                onClick={() => setActiveTab("p2p")}
                            />
                            <TabButton
                                active={activeTab === "hourly"}
                                icon={Clock}
                                label="Hourly Pricing"
                                onClick={() => setActiveTab("hourly")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Left: Vehicle List */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Car size={18} className="text-blue-600" />
                                Select Vehicle
                            </h3>
                            <div 
                                className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1"
                                onWheel={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                {vehicles.map((vehicle) => (
                                    <VehicleListItem
                                        key={vehicle._id}
                                        vehicle={vehicle}
                                        isSelected={selectedVehicle?._id === vehicle._id}
                                        onClick={() => setSelectedVehicle(vehicle)}
                                        hasPricing={vehicleHasPricing(vehicle._id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing Form */}
                    <div className="flex-1 min-w-0">
                        {selectedVehicle ? (
                            <>
                                {isFetchingPricing ? (
                                    <ShimmerLoader />
                                ) : (
                                    <motion.div
                                        key={`${selectedVehicle._id}-${activeTab}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-5"
                                    >
                                {/* Selected Vehicle Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-14 bg-white/20 rounded-xl overflow-hidden">
                                            {selectedVehicle.image?.url ? (
                                                <img
                                                    src={getImageUrl(selectedVehicle.image.url)}
                                                    alt={selectedVehicle.categoryName}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Car size={24} className="text-white/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold capitalize">{selectedVehicle.categoryName}</h2>
                                            <p className="text-blue-200 text-sm">
                                                {activeTab === "p2p" ? "Point-to-Point Pricing" : "Hourly Pricing"}
                                                {existingPricing[activeTab] && (
                                                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full text-green-200 text-xs">
                                                        <Check size={12} /> Configured
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* P2P Pricing Form */}
                                {activeTab === "p2p" && (
                                    <div className="space-y-5">
                                        {/* Distance Tiers */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                                    <Zap size={18} className="text-amber-500" />
                                                    Distance Tiers
                                                </h3>
                                                <button
                                                    onClick={addTier}
                                                    className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700"
                                                >
                                                    <Plus size={16} />
                                                    Add Tier
                                                </button>
                                            </div>
                                            <AnimatePresence>
                                                <div className="space-y-3">
                                                    {p2pForm.distanceTiers.map((tier, index) => (
                                                        <DistanceTierRow
                                                            key={index}
                                                            tier={tier}
                                                            index={index}
                                                            onChange={handleTierChange}
                                                            onRemove={removeTier}
                                                            isFirst={index === 0}
                                                        />
                                                    ))}
                                                </div>
                                            </AnimatePresence>

                                            {/* After Distance */}
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                                <p className="text-sm text-gray-600 mb-3">After Distance Rate</p>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">After (miles)</label>
                                                        <input
                                                            type="number"
                                                            value={p2pForm.afterDistanceThreshold}
                                                            onChange={(e) => setP2pForm((prev) => ({ ...prev, afterDistanceThreshold: parseInt(e.target.value) || 0 }))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">£ Per Mile</label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={p2pForm.afterDistancePricePerMile}
                                                            onChange={(e) => setP2pForm((prev) => ({ ...prev, afterDistancePricePerMile: parseFloat(e.target.value) || 0 }))}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Charges */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                                <DollarSign size={18} className="text-green-500" />
                                                Additional Charges
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Extra Stop (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={p2pForm.extras.extraStopPrice}
                                                        onChange={(e) => setP2pForm((prev) => ({
                                                            ...prev,
                                                            extras: { ...prev.extras, extraStopPrice: parseFloat(e.target.value) || 0 }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Child Seat (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={p2pForm.extras.childSeatPrice}
                                                        onChange={(e) => setP2pForm((prev) => ({
                                                            ...prev,
                                                            extras: { ...prev.extras, childSeatPrice: parseFloat(e.target.value) || 0 }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Congestion (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={p2pForm.extras.congestionCharge}
                                                        onChange={(e) => setP2pForm((prev) => ({
                                                            ...prev,
                                                            extras: { ...prev.extras, congestionCharge: parseFloat(e.target.value) || 0 }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Display Options */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                                <Settings size={18} className="text-purple-500" />
                                                Display Options
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={p2pForm.displayVATInclusive}
                                                        onChange={(e) => setP2pForm((prev) => ({ ...prev, displayVATInclusive: e.target.checked }))}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Display VAT Inclusive</span>
                                                </label>
                                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={p2pForm.displayParkingInclusive}
                                                        onChange={(e) => setP2pForm((prev) => ({ ...prev, displayParkingInclusive: e.target.checked }))}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Display Parking Inclusive</span>
                                                </label>
                                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={p2pForm.priceRoundOff}
                                                        onChange={(e) => setP2pForm((prev) => ({ ...prev, priceRoundOff: e.target.checked }))}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Round Off Price</span>
                                                </label>
                                                <div className="p-3 bg-gray-50 rounded-xl">
                                                    <label className="text-xs text-gray-500 mb-1 block">Status</label>
                                                    <select
                                                        value={p2pForm.status}
                                                        onChange={(e) => setP2pForm((prev) => ({ ...prev, status: e.target.value }))}
                                                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Save Button */}
                                        <button
                                            onClick={saveP2PPricing}
                                            disabled={isSaving}
                                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <Save size={20} />
                                            )}
                                            Save P2P Pricing
                                        </button>
                                    </div>
                                )}

                                {/* Hourly Pricing Form */}
                                {activeTab === "hourly" && (
                                    <div className="space-y-5">
                                        {/* Hourly Rates */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                                <Clock size={18} className="text-blue-500" />
                                                Hourly Rates
                                            </h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Hourly Rate (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={hourlyForm.hourlyRate}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, hourlyRate: parseFloat(e.target.value) || 0 }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Min Hours</label>
                                                    <input
                                                        type="number"
                                                        value={hourlyForm.minimumHours}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, minimumHours: parseInt(e.target.value) || 1 }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                        min={1}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Additional Hour (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={hourlyForm.additionalHourCharge}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, additionalHourCharge: parseFloat(e.target.value) || 0 }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Status</label>
                                                    <select
                                                        value={hourlyForm.status}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, status: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    >
                                                        <option value="active">Active</option>
                                                        <option value="inactive">Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mileage */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                                <MapPin size={18} className="text-green-500" />
                                                Mileage Settings
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Miles Included</label>
                                                    <input
                                                        type="number"
                                                        value={hourlyForm.milesIncluded}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, milesIncluded: parseInt(e.target.value) || 0 }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Excess £/Mile</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={hourlyForm.excessMileageCharge}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, excessMileageCharge: parseFloat(e.target.value) || 0 }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Charges */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                                <DollarSign size={18} className="text-amber-500" />
                                                Additional Charges
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Extra Stop (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={hourlyForm.extras.extraStopPrice}
                                                        onChange={(e) => setHourlyForm((prev) => ({
                                                            ...prev,
                                                            extras: { ...prev.extras, extraStopPrice: parseFloat(e.target.value) || 0 }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Child Seat (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={hourlyForm.extras.childSeatPrice}
                                                        onChange={(e) => setHourlyForm((prev) => ({
                                                            ...prev,
                                                            extras: { ...prev.extras, childSeatPrice: parseFloat(e.target.value) || 0 }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Congestion (£)</label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        value={hourlyForm.extras.congestionCharge}
                                                        onChange={(e) => setHourlyForm((prev) => ({
                                                            ...prev,
                                                            extras: { ...prev.extras, congestionCharge: parseFloat(e.target.value) || 0 }
                                                        }))}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Display Options */}
                                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                                <Settings size={18} className="text-purple-500" />
                                                Display Options
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={hourlyForm.displayVATInclusive}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, displayVATInclusive: e.target.checked }))}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">VAT Inclusive</span>
                                                </label>
                                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={hourlyForm.displayParkingInclusive}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, displayParkingInclusive: e.target.checked }))}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Parking Inclusive</span>
                                                </label>
                                                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={hourlyForm.priceRoundOff}
                                                        onChange={(e) => setHourlyForm((prev) => ({ ...prev, priceRoundOff: e.target.checked }))}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm text-gray-700">Round Off Price</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Save Button */}
                                        <button
                                            onClick={saveHourlyPricing}
                                            disabled={isSaving}
                                            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <Save size={20} />
                                            )}
                                            Save Hourly Pricing
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                                <Car size={48} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Select a vehicle to configure pricing</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPricing;
