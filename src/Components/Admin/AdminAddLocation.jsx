import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../Context/GoogleMapsContext";
import AdminZoneMap from "./AdminZoneMap";
import {
    ArrowLeft,
    MapPin,
    Save,
    Loader2,
    Plane,
    Building,
    Trophy,
    Flag,
    CircleDot,
    Navigation,
    CircleOff,
    Search,
    CheckCircle,
} from "lucide-react";
import { locationAPI } from "../../Utils/api";

// Libraries are managed globally via GoogleMapsProvider in App.jsx

// CSS for Google Maps Autocomplete styling
const googleMapsStyles = `
  .pac-container {
    border-radius: 12px;
    margin-top: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    border: 1px solid #e5e7eb;
    font-family: inherit;
    z-index: 9999 !important;
    overflow: hidden;
  }
  .pac-item {
    padding: 14px 16px;
    font-size: 14px;
    cursor: pointer;
    border-top: 1px solid #f3f4f6;
    line-height: 1.5;
    transition: background-color 0.15s ease;
  }
  .pac-item:first-child {
    border-top: none;
  }
  .pac-item:hover {
    background-color: #f0f9ff;
  }
  .pac-item-query {
    font-size: 14px;
    color: #111827;
    font-weight: 600;
  }
  .pac-icon {
    margin-top: 4px;
  }
  .pac-matched {
    font-weight: 700;
    color: #2563eb;
  }
`;

// Location Types
const LOCATION_TYPES = [
    { value: "airport", label: "Airport", icon: Plane },
    { value: "stadium", label: "Stadium", icon: Trophy },
    { value: "circuit", label: "Circuit", icon: Flag },
    { value: "venue", label: "Venue", icon: Building },
    { value: "other", label: "Other", icon: CircleDot },
];

// Form Section
const FormSection = ({ title, icon: Icon, children, color = "blue" }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className={`p-2 bg-${color}-100 rounded-lg`}>
                <Icon size={18} className={`text-${color}-600`} />
            </div>
            {title}
        </h3>
        {children}
    </div>
);

// Input Field
const InputField = ({ label, name, type = "text", value, onChange, required, placeholder, min, max, disabled }) => (
    <div>
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
            disabled={disabled}
            className={`w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm ${disabled ? "bg-gray-50 text-gray-500" : ""}`}
        />
    </div>
);

// Main Component
function AdminAddLocation() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    // Google Maps API — loaded globally via GoogleMapsProvider in App.jsx
    const { isLoaded } = useGoogleMaps();

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditMode);
    const [locationSelected, setLocationSelected] = useState(false);

    // Autocomplete refs
    const autocompleteRef = useRef(null);
    const inputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        placeId: "",
        iataCode: "",
        icaoCode: "",
        coordinates: { lat: "", lng: "" },
        zone: "Entire UK Cover",
        locationType: "airport",
        radiusKm: 5,
        isActive: true,
    });

    // Zone shape drawn on the map (polygon or circle)
    const [zoneShape, setZoneShape] = useState(null);
    // Loaded from server — stable key so map doesn't remount while drawing
    const [initialZone, setInitialZone] = useState(null);

    // Inject Google Maps CSS
    useEffect(() => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = googleMapsStyles;
        document.head.appendChild(styleTag);
        return () => {
            document.head.removeChild(styleTag);
        };
    }, []);

    // Fetch location if edit mode
    useEffect(() => {
        if (isEditMode) {
            const fetchLocation = async () => {
                try {
                    const response = await locationAPI.getById(id);
                    if (response.success) {
                        const loc = response.data;
                        setFormData({
                            name: loc.name || "",
                            address: loc.address || "",
                            placeId: loc.placeId || "",
                            iataCode: loc.iataCode || "",
                            icaoCode: loc.icaoCode || "",
                            coordinates: loc.coordinates || { lat: "", lng: "" },
                            zone: loc.zone || "Entire UK Cover",
                            locationType: loc.locationType || "airport",
                            radiusKm: loc.radiusKm || 5,
                            isActive: loc.isActive !== false,
                        });
                        if (loc.zoneShape) {
                            setZoneShape(loc.zoneShape);
                            setInitialZone(loc.zoneShape); // stable key — only set once from server
                        }
                        setLocationSelected(true);
                    }
                } catch (err) {
                    console.error("Error fetching location:", err);
                    toast.error("Failed to load location");
                } finally {
                    setIsFetching(false);
                }
            };
            fetchLocation();
        }
    }, [id, isEditMode]);

    // Handle Google Places autocomplete selection
    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();

            if (place && place.geometry) {
                // Build full address
                let locationName = "";
                let fullAddress = "";

                if (place.name && place.formatted_address) {
                    if (place.formatted_address.includes(place.name)) {
                        fullAddress = place.formatted_address;
                        locationName = place.name;
                    } else {
                        fullAddress = `${place.name}, ${place.formatted_address}`;
                        locationName = place.name;
                    }
                } else if (place.formatted_address) {
                    fullAddress = place.formatted_address;
                    locationName = place.formatted_address.split(",")[0];
                } else if (place.name) {
                    fullAddress = place.name;
                    locationName = place.name;
                }

                // Extract coordinates
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();

                // Try to detect airport codes from name
                let iataCode = "";
                const iataMatch = place.name?.match(/\(([A-Z]{3})\)/);
                if (iataMatch) {
                    iataCode = iataMatch[1];
                }

                // Detect location type
                let locationType = "other";
                const types = place.types || [];
                if (types.includes("airport") || place.name?.toLowerCase().includes("airport")) {
                    locationType = "airport";
                } else if (place.name?.toLowerCase().includes("stadium") || types.includes("stadium")) {
                    locationType = "stadium";
                } else if (place.name?.toLowerCase().includes("circuit") || place.name?.toLowerCase().includes("race")) {
                    locationType = "circuit";
                } else if (types.includes("point_of_interest") || types.includes("establishment")) {
                    locationType = "venue";
                }

                // Update form
                setFormData((prev) => ({
                    ...prev,
                    name: locationName,
                    address: fullAddress,
                    placeId: place.place_id || "",
                    iataCode: iataCode || prev.iataCode,
                    coordinates: { lat, lng },
                    locationType,
                }));

                setLocationSelected(true);
                toast.success("📍 Location selected! Details auto-filled.");
            }
        }
    };

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "lat" || name === "lng") {
            setFormData((prev) => ({
                ...prev,
                coordinates: { ...prev.coordinates, [name]: parseFloat(value) || "" },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.address.trim()) {
            toast.error("Name and address are required");
            return;
        }

        // Sync circle radius → radiusKm so Haversine detection on backend works
        let radiusKm = formData.radiusKm;
        if (zoneShape?.type === "circle" && zoneShape.radius) {
            radiusKm = parseFloat((zoneShape.radius / 1000).toFixed(2));
        }

        setIsLoading(true);
        try {
            const payload = { ...formData, radiusKm, zoneShape };
            let response;
            if (isEditMode) {
                response = await locationAPI.update(id, payload);
            } else {
                response = await locationAPI.create(payload);
            }

            if (response.success) {
                toast.success(isEditMode ? "Location updated! ✅" : "Location added! ✅", {
                    autoClose: 1500,
                });
                setTimeout(() => navigate("/admin/locations"), 1500);
            }
        } catch (err) {
            console.error("Error saving location:", err);
            toast.error(err.response?.data?.message || "Failed to save location");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
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
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/admin/locations")}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                {isEditMode ? "Edit Location" : "Add New Location"}
                            </h1>
                            <p className="text-gray-500 text-xs md:text-sm hidden sm:block">
                                {isEditMode ? "Update location details" : "Search and add airport, stadium, or special location"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-6 space-y-5">
                {/* Google Places Search */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 text-white mb-3">
                        <Search size={20} />
                        <h3 className="font-semibold">Search Location</h3>
                    </div>
                    <p className="text-blue-100 text-sm mb-4">
                        Start typing to search for airports, stadiums, or any location. All details will auto-fill.
                    </p>

                    {isLoaded ? (
                        <div className="relative">
                            <Autocomplete
                                onLoad={(autocomplete) => {
                                    autocompleteRef.current = autocomplete;
                                }}
                                onPlaceChanged={handlePlaceChanged}
                                options={{
                                    componentRestrictions: { country: "gb" }, // UK only
                                    types: ["establishment", "geocode"],
                                }}
                            >
                                <div className="relative">
                                    <MapPin
                                        size={20}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                                    />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search for airport, stadium, venue..."
                                        defaultValue={formData.address}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault(); // Prevent form submission
                                            }
                                        }}
                                        className="w-full pl-12 pr-12 py-4 bg-white border-0 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-700 placeholder-gray-400 font-medium text-base shadow-lg"
                                    />
                                    {locationSelected && (
                                        <CheckCircle
                                            size={22}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
                                        />
                                    )}
                                </div>
                            </Autocomplete>
                        </div>
                    ) : (
                        <div className="bg-white/20 rounded-xl p-4 flex items-center justify-center">
                            <Loader2 size={24} className="text-white animate-spin" />
                            <span className="text-white ml-2">Loading Google Maps...</span>
                        </div>
                    )}
                </div>

                {/* Location Details - Show after selection or in edit mode */}
                {(locationSelected || isEditMode) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-5"
                    >
                        {/* Selected Location Info */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-green-800">{formData.name}</h4>
                                    <p className="text-green-600 text-sm truncate">{formData.address}</p>
                                    {formData.coordinates.lat && (
                                        <p className="text-green-500 text-xs mt-1">
                                            📍 {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Location Type */}
                        <FormSection title="Location Type" icon={Building}>
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {LOCATION_TYPES.map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, locationType: value }))}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.locationType === value
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            }`}
                                    >
                                        <Icon size={24} />
                                        <span className="text-xs font-medium">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </FormSection>

                        {/* Airport Codes (if airport type) */}
                        {formData.locationType === "airport" && (
                            <FormSection title="Airport Codes" icon={Plane}>
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="IATA Code"
                                        name="iataCode"
                                        value={formData.iataCode}
                                        onChange={handleChange}
                                        placeholder="e.g., LHR"
                                    />
                                    <InputField
                                        label="ICAO Code"
                                        name="icaoCode"
                                        value={formData.icaoCode}
                                        onChange={handleChange}
                                        placeholder="e.g., EGLL"
                                    />
                                </div>
                            </FormSection>
                        )}

                        {/* Draw Coverage Zone */}
                        <FormSection title="Draw Coverage Zone" icon={Navigation}>
                            <div className="space-y-3">
                                <p className="text-sm text-gray-500">
                                    Draw a polygon or circle on the map to define the coverage area.
                                    Bookings with a pickup inside this zone will use this location's special pricing.
                                </p>
                                {isLoaded ? (
                                    <AdminZoneMap
                                        key={initialZone ? JSON.stringify(initialZone).slice(0, 40) : "empty"}
                                        center={
                                            formData.coordinates?.lat
                                                ? formData.coordinates
                                                : null
                                        }
                                        onZoneChange={(shape) => {
                                            setZoneShape(shape);
                                            if (shape?.type === "circle" && shape.radius) {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    radiusKm: Math.max(1, Math.round(shape.radius / 1000)),
                                                }));
                                            }
                                        }}
                                        initialZone={initialZone}
                                    />
                                ) : (
                                    <div className="h-48 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Loader2 size={28} className="text-gray-400 animate-spin" />
                                    </div>
                                )}

                                {/* Fallback radius slider — shown when no zone is drawn */}
                                {!zoneShape && (
                                    <div className="pt-3 border-t border-gray-100">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fallback Radius:{" "}
                                            <span className="text-blue-600 font-bold">{formData.radiusKm} km</span>
                                        </label>
                                        <input
                                            type="range"
                                            min={1}
                                            max={50}
                                            value={formData.radiusKm}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, radiusKm: parseInt(e.target.value) }))
                                            }
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>1 km</span>
                                            <span>25 km</span>
                                            <span>50 km</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Used only if no zone shape is drawn above.
                                        </p>
                                    </div>
                                )}

                                {zoneShape && (
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                                        <CircleDot size={18} className="text-green-600 flex-shrink-0" />
                                        <p className="text-sm text-green-700 font-medium">
                                            {zoneShape.type === "circle"
                                                ? `Circle zone: ${Math.round(zoneShape.radius)}m radius`
                                                : `Polygon zone: ${zoneShape.coordinates?.length || 0} points`}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        {/* Zone & Status */}
                        <FormSection title="Settings" icon={CircleOff}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Zone</label>
                                    <select
                                        name="zone"
                                        value={formData.zone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="Entire UK Cover">Entire UK Cover</option>
                                        <option value="London Zone">London Zone</option>
                                        <option value="Scotland Zone">Scotland Zone</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer w-full">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">Active</p>
                                            <p className="text-xs text-gray-500">Enable this location</p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </FormSection>

                        {/* Submit Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sticky bottom-4 z-10"
                        >
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        {isEditMode ? "Updating..." : "Adding..."}
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        {isEditMode ? "Update Location" : "Add Location"}
                                    </>
                                )}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </form>
        </div>
    );
}

export default AdminAddLocation;
