import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    ArrowLeft,
    Car,
    MapPin,
    DollarSign,
    Plus,
    Trash2,
    Save,
    Loader2,
    Check,
    ChevronRight,
    Zap,
    Settings,
    Plane,
    Clock,
} from "lucide-react";
import { vehicleAPI, locationAPI, locationPricingAPI, getImageUrl } from "../../Utils/api";

// Shimmer Field Component
const ShimmerField = () => (
    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-200 animate-pulse" />
);

// Shimmer Loader Component
const ShimmerLoader = () => (
    <div className="space-y-5">
        {/* Shimmer Header Card */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5">
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

// Vehicle List Item
const VehicleListItem = ({ vehicle, isSelected, onClick, hasPricing }) => {
    const imageUrl = getImageUrl(vehicle.image?.url);

    return (
        <motion.button
            whileHover={{ x: 4 }}
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${isSelected
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white hover:bg-gray-50 border border-gray-100"
                }`}
        >
            <div className={`w-12 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isSelected ? "bg-green-500" : "bg-gray-100"
                }`}>
                {imageUrl ? (
                    <img src={imageUrl} alt={vehicle.categoryName} className="w-full h-full object-contain" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Car size={20} className={isSelected ? "text-green-200" : "text-gray-300"} />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate capitalize ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {vehicle.categoryName}
                </p>
                <p className={`text-xs ${isSelected ? "text-green-200" : "text-gray-500"}`}>
                    {vehicle.vehicleType}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {hasPricing && (
                    <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-green-500"}`} />
                )}
                <ChevronRight size={16} className={isSelected ? "text-green-200" : "text-gray-400"} />
            </div>
        </motion.button>
    );
};

// Distance Tier Row
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    min={0}
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">To (mi)</label>
                <input
                    type="number"
                    value={tier.toDistance}
                    onChange={(e) => onChange(index, "toDistance", parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    min={0}
                />
            </div>
            <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <select
                    value={tier.type}
                    onChange={(e) => onChange(index, "type", e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm"
                >
                    <option value="fixed">{isFirst ? "Min" : "Fixed"}</option>
                    <option value="per_mile">Per Mi</option>
                </select>
            </div>
        </div>
        {!isFirst && (
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
                <Trash2 size={18} />
            </button>
        )}
    </motion.div>
);

// Main Component
function AdminLocationPricing() {
    const navigate = useNavigate();
    const { locationId } = useParams();

    const [location, setLocation] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [existingPricingIds, setExistingPricingIds] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isFetchingPricing, setIsFetchingPricing] = useState(false);
    const [activeTab, setActiveTab] = useState("p2p");

    const defaultP2PForm = {
        distanceTiers: [
            { fromDistance: 0, toDistance: 18, price: 109.5, type: "fixed" },
            { fromDistance: 19, toDistance: 40, price: 2.5, type: "per_mile" },
            { fromDistance: 41, toDistance: 50, price: 2.5, type: "per_mile" },
        ],
        afterDistanceThreshold: 50,
        afterDistancePricePerMile: 2.5,
        extras: { extraStopPrice: 15, childSeatPrice: 0, congestionCharge: 0, airportPickupCharge: 0, airportDropoffCharge: 0 },
        displayParkingInclusive: true,
        displayVATInclusive: true,
        priceRoundOff: false,
        status: "active",
    };

    const defaultHourlyForm = {
        hourlyRate: 45,
        minimumHours: 3,
        additionalHourCharge: 45,
        milesIncluded: 40,
        excessMileageCharge: 2,
        extras: { extraStopPrice: 10, childSeatPrice: 0, congestionCharge: 0 },
        displayVATInclusive: true,
        displayParkingInclusive: false,
        priceRoundOff: false,
        status: "active",
        isActive: false,
    };

    // P2P Form State
    const [pricingForm, setPricingForm] = useState(defaultP2PForm);

    // Hourly Form State
    const [hourlyForm, setHourlyForm] = useState(defaultHourlyForm);

    // Fetch location and vehicles
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locRes, vehRes] = await Promise.all([
                    locationAPI.getById(locationId),
                    vehicleAPI.getAllVehicles(),
                ]);

                if (locRes.success) setLocation(locRes.data);
                if (vehRes.success) {
                    setVehicles(vehRes.data);
                    if (vehRes.data.length > 0) setSelectedVehicle(vehRes.data[0]);
                }

                // Fetch all pricing for this location
                const pricingRes = await locationPricingAPI.getByLocation(locationId);
                if (pricingRes.success && pricingRes.data) {
                    const pricingMap = {};
                    pricingRes.data.forEach((p) => {
                        pricingMap[p.vehicle?._id || p.vehicle] = p._id;
                    });
                    setExistingPricingIds(pricingMap);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [locationId]);

    // Fetch pricing when vehicle changes
    useEffect(() => {
        const fetchVehiclePricing = async () => {
            if (!selectedVehicle || !locationId) return;
            setIsFetchingPricing(true);
            try {
                const pricingRes = await locationPricingAPI.getByLocation(locationId);
                if (pricingRes.success && pricingRes.data) {
                    const vehiclePricing = pricingRes.data.find(
                        (p) => (p.vehicle?._id || p.vehicle) === selectedVehicle._id
                    );
                    if (vehiclePricing) {
                        // Restore P2P form
                        setPricingForm({
                            distanceTiers: vehiclePricing.distanceTiers || defaultP2PForm.distanceTiers,
                            afterDistanceThreshold: vehiclePricing.afterDistanceThreshold || 50,
                            afterDistancePricePerMile: vehiclePricing.afterDistancePricePerMile || 2.5,
                            extras: vehiclePricing.extras || defaultP2PForm.extras,
                            displayParkingInclusive: vehiclePricing.displayParkingInclusive ?? true,
                            displayVATInclusive: vehiclePricing.displayVATInclusive ?? true,
                            priceRoundOff: vehiclePricing.priceRoundOff ?? false,
                            status: vehiclePricing.status || "active",
                        });
                        // Restore hourly form if configured
                        if (vehiclePricing.hourly && vehiclePricing.hourly.isActive) {
                            setHourlyForm({
                                hourlyRate: vehiclePricing.hourly.hourlyRate || 45,
                                minimumHours: vehiclePricing.hourly.minimumHours || 3,
                                additionalHourCharge: vehiclePricing.hourly.additionalHourCharge || 45,
                                milesIncluded: vehiclePricing.hourly.milesIncluded || 40,
                                excessMileageCharge: vehiclePricing.hourly.excessMileageCharge || 2,
                                extras: vehiclePricing.extras || defaultHourlyForm.extras,
                                displayVATInclusive: vehiclePricing.displayVATInclusive ?? true,
                                displayParkingInclusive: vehiclePricing.displayParkingInclusive ?? false,
                                priceRoundOff: vehiclePricing.priceRoundOff ?? false,
                                status: vehiclePricing.status || "active",
                                isActive: true,
                            });
                        } else {
                            setHourlyForm(defaultHourlyForm);
                        }
                        setExistingPricingIds((prev) => ({
                            ...prev,
                            [selectedVehicle._id]: vehiclePricing._id,
                        }));
                    } else {
                        setPricingForm(defaultP2PForm);
                        setHourlyForm(defaultHourlyForm);
                    }
                }
            } catch (err) {
                console.error("Error fetching vehicle pricing:", err);
            } finally {
                setIsFetchingPricing(false);
            }
        };
        fetchVehiclePricing();
    }, [selectedVehicle, locationId]);

    // Handle tier change
    const handleTierChange = (index, field, value) => {
        setPricingForm((prev) => ({
            ...prev,
            distanceTiers: prev.distanceTiers.map((tier, i) =>
                i === index ? { ...tier, [field]: value } : tier
            ),
        }));
    };

    // Add tier
    const addTier = () => {
        const lastTier = pricingForm.distanceTiers[pricingForm.distanceTiers.length - 1];
        setPricingForm((prev) => ({
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
        setPricingForm((prev) => ({
            ...prev,
            distanceTiers: prev.distanceTiers.filter((_, i) => i !== index),
        }));
    };

    // Save P2P Pricing
    const savePricing = async () => {
        if (!selectedVehicle || !locationId) return;
        setIsSaving(true);
        try {
            const existingId = existingPricingIds[selectedVehicle._id];
            const data = { airport: locationId, vehicle: selectedVehicle._id, ...pricingForm };
            let response;
            if (existingId) {
                response = await locationPricingAPI.update(existingId, data);
            } else {
                response = await locationPricingAPI.create(data);
            }
            if (response.success) {
                toast.success(`P2P pricing saved for ${selectedVehicle.categoryName}! ✅`);
                setExistingPricingIds((prev) => ({ ...prev, [selectedVehicle._id]: response.data._id }));
            }
        } catch (err) {
            console.error("Error saving pricing:", err);
            toast.error(err.response?.data?.message || "Failed to save pricing");
        } finally {
            setIsSaving(false);
        }
    };

    // Save Hourly Pricing (patches the hourly sub-doc on the same AirportPricing record)
    const saveHourlyPricing = async () => {
        if (!selectedVehicle || !locationId) return;
        setIsSaving(true);
        try {
            const existingId = existingPricingIds[selectedVehicle._id];
            const hourlyPayload = {
                hourly: {
                    hourlyRate: hourlyForm.hourlyRate,
                    minimumHours: hourlyForm.minimumHours,
                    additionalHourCharge: hourlyForm.additionalHourCharge,
                    milesIncluded: hourlyForm.milesIncluded,
                    excessMileageCharge: hourlyForm.excessMileageCharge,
                    isActive: true,
                },
            };
            let response;
            if (existingId) {
                // Patch the existing record with hourly data
                response = await locationPricingAPI.update(existingId, hourlyPayload);
            } else {
                // No P2P record yet — create one with defaults + hourly
                response = await locationPricingAPI.create({
                    airport: locationId,
                    vehicle: selectedVehicle._id,
                    ...defaultP2PForm,
                    ...hourlyPayload,
                });
            }
            if (response.success) {
                toast.success(`Hourly pricing saved for ${selectedVehicle.categoryName}! ✅`);
                setExistingPricingIds((prev) => ({ ...prev, [selectedVehicle._id]: response.data._id }));
                setHourlyForm((prev) => ({ ...prev, isActive: true }));
            }
        } catch (err) {
            console.error("Error saving hourly pricing:", err);
            toast.error(err.response?.data?.message || "Failed to save hourly pricing");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
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
                            onClick={() => navigate("/admin/locations")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Plane size={20} className="text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                    Location Pricing
                                </h1>
                                <p className="text-gray-500 text-xs md:text-sm flex items-center gap-1">
                                    <MapPin size={12} />
                                    {location?.name || "Loading..."}
                                </p>
                            </div>
                        </div>
                        </div>
                        {/* Pricing Type Tabs */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab("p2p")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                    activeTab === "p2p"
                                        ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <MapPin size={16} />
                                <span className="hidden sm:inline">P2P</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("hourly")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                    activeTab === "hourly"
                                        ? "bg-green-600 text-white shadow-lg shadow-green-500/25"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                <Clock size={16} />
                                <span className="hidden sm:inline">Hourly</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Vehicle List */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Car size={18} className="text-green-600" />
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
                                        hasPricing={Boolean(existingPricingIds[vehicle._id])}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Pricing Form */}
                    <div className="flex-1">
                        {selectedVehicle ? (
                            <>
                                {isFetchingPricing ? (
                                    <ShimmerLoader />
                                ) : (
                                    <motion.div
                                        key={selectedVehicle._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-5"
                                    >
                                {/* Vehicle Header */}
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
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
                                            <p className="text-green-200 text-sm">
                                                {location?.name} — {activeTab === "p2p" ? "P2P Pricing" : "Hourly Pricing"}
                                                {existingPricingIds[selectedVehicle._id] && (
                                                    <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                                        <Check size={12} /> Configured
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ── P2P Pricing Form ── */}
                                {activeTab === "p2p" && (
                                <>
                                {/* Distance Tiers */}
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Zap size={18} className="text-amber-500" />
                                            Distance Tiers
                                        </h3>
                                        <button
                                            onClick={addTier}
                                            className="flex items-center gap-1 text-green-600 text-sm font-medium hover:text-green-700"
                                        >
                                            <Plus size={16} />
                                            Add Tier
                                        </button>
                                    </div>
                                    <AnimatePresence>
                                        <div className="space-y-3">
                                            {pricingForm.distanceTiers.map((tier, index) => (
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
                                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">After (miles)</label>
                                            <input
                                                type="number"
                                                value={pricingForm.afterDistanceThreshold}
                                                onChange={(e) => setPricingForm((prev) => ({ ...prev, afterDistanceThreshold: parseInt(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">£ Per Mile</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={pricingForm.afterDistancePricePerMile}
                                                onChange={(e) => setPricingForm((prev) => ({ ...prev, afterDistancePricePerMile: parseFloat(e.target.value) || 0 }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Charges */}
                                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <DollarSign size={18} className="text-green-500" />
                                        Additional Charges
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Extra Stop (£)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={pricingForm.extras.extraStopPrice}
                                                onChange={(e) => setPricingForm((prev) => ({
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
                                                value={pricingForm.extras.childSeatPrice}
                                                onChange={(e) => setPricingForm((prev) => ({
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
                                                value={pricingForm.extras.congestionCharge}
                                                onChange={(e) => setPricingForm((prev) => ({
                                                    ...prev,
                                                    extras: { ...prev.extras, congestionCharge: parseFloat(e.target.value) || 0 }
                                                }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Airport Pickup (£)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={pricingForm.extras.airportPickupCharge}
                                                onChange={(e) => setPricingForm((prev) => ({
                                                    ...prev,
                                                    extras: { ...prev.extras, airportPickupCharge: parseFloat(e.target.value) || 0 }
                                                }))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 mb-1 block">Airport Dropoff (£)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={pricingForm.extras.airportDropoffCharge}
                                                onChange={(e) => setPricingForm((prev) => ({
                                                    ...prev,
                                                    extras: { ...prev.extras, airportDropoffCharge: parseFloat(e.target.value) || 0 }
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
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={pricingForm.displayVATInclusive}
                                                onChange={(e) => setPricingForm((prev) => ({ ...prev, displayVATInclusive: e.target.checked }))}
                                                className="w-4 h-4 text-green-600 rounded"
                                            />
                                            <span className="text-sm text-gray-700">VAT Inc.</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={pricingForm.displayParkingInclusive}
                                                onChange={(e) => setPricingForm((prev) => ({ ...prev, displayParkingInclusive: e.target.checked }))}
                                                className="w-4 h-4 text-green-600 rounded"
                                            />
                                            <span className="text-sm text-gray-700">Parking Inc.</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={pricingForm.priceRoundOff}
                                                onChange={(e) => setPricingForm((prev) => ({ ...prev, priceRoundOff: e.target.checked }))}
                                                className="w-4 h-4 text-green-600 rounded"
                                            />
                                            <span className="text-sm text-gray-700">Round Off</span>
                                        </label>
                                        <div className="p-3 bg-gray-50 rounded-xl">
                                            <select
                                                value={pricingForm.status}
                                                onChange={(e) => setPricingForm((prev) => ({ ...prev, status: e.target.value }))}
                                                className="w-full px-2 py-1 border border-gray-200 rounded-lg text-sm"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Save P2P Button */}
                                <button
                                    onClick={savePricing}
                                    disabled={isSaving}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    Save P2P Pricing for {selectedVehicle.categoryName}
                                </button>
                                </>
                                )} {/* end activeTab === p2p */}

                                {/* ── Hourly Pricing Form ── */}
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
                                                <input type="number" step="0.01" value={hourlyForm.hourlyRate}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, hourlyRate: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Min Hours</label>
                                                <input type="number" value={hourlyForm.minimumHours} min={1}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, minimumHours: parseInt(e.target.value) || 1 }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Additional Hour (£)</label>
                                                <input type="number" step="0.01" value={hourlyForm.additionalHourCharge}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, additionalHourCharge: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Status</label>
                                                <select value={hourlyForm.status}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, status: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mileage Settings */}
                                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                            <MapPin size={18} className="text-green-500" />
                                            Mileage Settings
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Miles Included</label>
                                                <input type="number" value={hourlyForm.milesIncluded}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, milesIncluded: parseInt(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Excess £/Mile</label>
                                                <input type="number" step="0.01" value={hourlyForm.excessMileageCharge}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, excessMileageCharge: parseFloat(e.target.value) || 0 }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
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
                                                <input type="number" step="0.01" value={hourlyForm.extras.extraStopPrice}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, extras: { ...p.extras, extraStopPrice: parseFloat(e.target.value) || 0 } }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Child Seat (£)</label>
                                                <input type="number" step="0.01" value={hourlyForm.extras.childSeatPrice}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, extras: { ...p.extras, childSeatPrice: parseFloat(e.target.value) || 0 } }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Congestion (£)</label>
                                                <input type="number" step="0.01" value={hourlyForm.extras.congestionCharge}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, extras: { ...p.extras, congestionCharge: parseFloat(e.target.value) || 0 } }))}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
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
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                                                <input type="checkbox" checked={hourlyForm.displayVATInclusive}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, displayVATInclusive: e.target.checked }))}
                                                    className="w-4 h-4 text-green-600 rounded" />
                                                <span className="text-sm text-gray-700">VAT Inclusive</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                                                <input type="checkbox" checked={hourlyForm.displayParkingInclusive}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, displayParkingInclusive: e.target.checked }))}
                                                    className="w-4 h-4 text-green-600 rounded" />
                                                <span className="text-sm text-gray-700">Parking Inclusive</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                                                <input type="checkbox" checked={hourlyForm.priceRoundOff}
                                                    onChange={(e) => setHourlyForm((p) => ({ ...p, priceRoundOff: e.target.checked }))}
                                                    className="w-4 h-4 text-green-600 rounded" />
                                                <span className="text-sm text-gray-700">Round Off Price</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Save Hourly Button */}
                                    <button
                                        onClick={saveHourlyPricing}
                                        disabled={isSaving}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                        Save Hourly Pricing for {selectedVehicle.categoryName}
                                    </button>
                                </div>
                                )} {/* end activeTab === hourly */}
                            </motion.div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
                                <Car size={48} className="text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Select a vehicle to set pricing</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLocationPricing;
