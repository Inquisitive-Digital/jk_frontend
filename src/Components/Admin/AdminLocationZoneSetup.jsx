import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../Context/GoogleMapsContext";
import { ArrowLeft, MapPin, Save, Loader2, Plane, Building, Trophy, Flag, CircleDot, Plus, Trash2, Car, DollarSign, Settings, Zap, Check, ChevronRight } from "lucide-react";
import { locationAPI, locationPricingAPI, vehicleAPI, getImageUrl } from "../../Utils/api";
import AdminZoneMap from "./AdminZoneMap";

// Libraries are managed globally via GoogleMapsProvider in App.jsx
const LOCATION_TYPES = [
    { value: "airport", label: "Airport", icon: Plane },
    { value: "stadium", label: "Stadium", icon: Trophy },
    { value: "circuit", label: "Circuit", icon: Flag },
    { value: "venue", label: "Venue", icon: Building },
    { value: "other", label: "Other", icon: CircleDot },
];

const DEFAULT_PRICING = {
    distanceTiers: [
        { fromDistance: 0, toDistance: 18, price: 109.5, type: "fixed" },
        { fromDistance: 19, toDistance: 40, price: 2.5, type: "per_mile" },
    ],
    afterDistanceThreshold: 50,
    afterDistancePricePerMile: 2.5,
    extras: { extraStopPrice: 15, childSeatPrice: 0, congestionCharge: 0, airportPickupCharge: 0, airportDropoffCharge: 0 },
    displayParkingInclusive: true,
    displayVATInclusive: true,
    priceRoundOff: false,
    status: "active",
};

function AdminLocationZoneSetup() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const autocompleteRef = useRef(null);

    const { isLoaded } = useGoogleMaps();

    const [isFetching, setIsFetching] = useState(isEdit);
    const [isSaving, setIsSaving] = useState(false);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [existingPricingIds, setExistingPricingIds] = useState({});
    const [pricingForm, setPricingForm] = useState(DEFAULT_PRICING);
    const [zone, setZone] = useState(null);          // updated while drawing
    const [initialZone, setInitialZone] = useState(null); // loaded from server (stable key)
    const [locationSelected, setLocationSelected] = useState(false);

    const [formData, setFormData] = useState({
        name: "", address: "", placeId: "", iataCode: "", icaoCode: "",
        coordinates: { lat: "", lng: "" }, zone: "Entire UK Cover",
        locationType: "airport", radiusKm: 5, isActive: true,
    });

    // Load vehicles
    useEffect(() => {
        vehicleAPI.getAllVehicles().then(res => {
            if (res.success) {
                setVehicles(res.data);
                if (res.data.length > 0) setSelectedVehicle(res.data[0]);
            }
        });
    }, []);

    // Load existing location
    useEffect(() => {
        if (!isEdit) return;
        const load = async () => {
            try {
                const [locRes, pricingRes] = await Promise.all([
                    locationAPI.getById(id),
                    locationPricingAPI.getByLocation(id),
                ]);
                if (locRes.success) {
                    const l = locRes.data;
                    setFormData({ name: l.name||"", address: l.address||"", placeId: l.placeId||"", iataCode: l.iataCode||"", icaoCode: l.icaoCode||"", coordinates: l.coordinates||{lat:"",lng:""}, zone: l.zone||"Entire UK Cover", locationType: l.locationType||"airport", radiusKm: l.radiusKm||5, isActive: l.isActive!==false });
                    if (l.zoneShape) {
                        setZone(l.zoneShape);
                        setInitialZone(l.zoneShape); // stable key — only set once from server
                    }
                    setLocationSelected(true);
                }
                if (pricingRes.success && pricingRes.data) {
                    const map = {};
                    pricingRes.data.forEach(p => { map[p.vehicle?._id||p.vehicle] = p._id; });
                    setExistingPricingIds(map);
                }
            } catch { toast.error("Failed to load location"); }
            finally { setIsFetching(false); }
        };
        load();
    }, [id]);

    // Load vehicle pricing when selected vehicle changes
    useEffect(() => {
        if (!selectedVehicle || !id) return;
        locationPricingAPI.getByLocation(id).then(res => {
            if (res.success && res.data) {
                const vp = res.data.find(p => (p.vehicle?._id||p.vehicle) === selectedVehicle._id);
                setPricingForm(vp ? { distanceTiers: vp.distanceTiers||DEFAULT_PRICING.distanceTiers, afterDistanceThreshold: vp.afterDistanceThreshold||50, afterDistancePricePerMile: vp.afterDistancePricePerMile||2.5, extras: vp.extras||DEFAULT_PRICING.extras, displayParkingInclusive: vp.displayParkingInclusive??true, displayVATInclusive: vp.displayVATInclusive??true, priceRoundOff: vp.priceRoundOff??false, status: vp.status||"active" } : { ...DEFAULT_PRICING });
            }
        }).catch(() => {});
    }, [selectedVehicle, id]);

    const handlePlaceChanged = () => {
        if (!autocompleteRef.current) return;
        const place = autocompleteRef.current.getPlace();
        if (!place?.geometry) return;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const name = place.name || place.formatted_address?.split(",")[0] || "";
        const address = place.formatted_address || name;
        let locationType = "other";
        const types = place.types || [];
        if (types.includes("airport") || name.toLowerCase().includes("airport")) locationType = "airport";
        else if (name.toLowerCase().includes("stadium")) locationType = "stadium";
        else if (name.toLowerCase().includes("circuit")) locationType = "circuit";
        else if (types.includes("point_of_interest")) locationType = "venue";
        const iataMatch = name.match(/\(([A-Z]{3})\)/);
        setFormData(p => ({ ...p, name, address, placeId: place.place_id||"", coordinates: { lat, lng }, locationType, iataCode: iataMatch?.[1] || p.iataCode }));
        setLocationSelected(true);
        toast.success("📍 Location selected!");
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    };

    const addTier = () => {
        const last = pricingForm.distanceTiers.at(-1);
        setPricingForm(p => ({ ...p, distanceTiers: [...p.distanceTiers, { fromDistance: last.toDistance+1, toDistance: last.toDistance+10, price: 2, type: "per_mile" }] }));
    };

    const removeTier = i => setPricingForm(p => ({ ...p, distanceTiers: p.distanceTiers.filter((_, idx) => idx !== i) }));

    const updateTier = (i, field, val) => setPricingForm(p => ({ ...p, distanceTiers: p.distanceTiers.map((t, idx) => idx === i ? { ...t, [field]: val } : t) }));

    const handleSave = async () => {
        if (!formData.name.trim()) { toast.error("Location name required"); return; }
        setIsSaving(true);
        try {
            // Sync circle zone radius → radiusKm for backend Haversine detection
            let radiusKm = formData.radiusKm;
            if (zone?.type === "circle" && zone.radius) {
                radiusKm = parseFloat((zone.radius / 1000).toFixed(2));
            }

            const locationData = { ...formData, radiusKm, zoneShape: zone };
            let locId = id;
            if (isEdit) {
                await locationAPI.update(id, locationData);
            } else {
                const res = await locationAPI.create(locationData);
                if (res.success) locId = res.data._id;
            }
            // Save pricing for selected vehicle
            if (selectedVehicle && locId) {
                const pData = { airport: locId, vehicle: selectedVehicle._id, ...pricingForm };
                const existId = existingPricingIds[selectedVehicle._id];
                const pRes = existId ? await locationPricingAPI.update(existId, pData) : await locationPricingAPI.create(pData);
                if (pRes.success) setExistingPricingIds(p => ({ ...p, [selectedVehicle._id]: pRes.data._id }));
            }
            toast.success(isEdit ? "Location updated! ✅" : "Location created! ✅");
            setTimeout(() => navigate("/admin/locations"), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Save failed");
        } finally { setIsSaving(false); }
    };

    if (isFetching) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 size={40} className="text-blue-500 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-center" autoClose={2000} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <button onClick={() => navigate("/admin/locations")} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Location Zone" : "Add Location Zone"}</h1>
                        <p className="text-gray-500 text-xs hidden sm:block">Define geographic pricing zone with polygon or circle drawing</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

                {/* Search */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 shadow-lg">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><MapPin size={18} /> Search Location</h3>
                    {isLoaded ? (
                        <Autocomplete onLoad={a => autocompleteRef.current = a} onPlaceChanged={handlePlaceChanged} options={{ componentRestrictions: { country: "gb" }, types: ["establishment", "geocode"] }}>
                            <input type="text" placeholder="Search airport, stadium, venue..." defaultValue={formData.address}
                                className="w-full px-4 py-3 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                                onKeyDown={e => e.key === "Enter" && e.preventDefault()} />
                        </Autocomplete>
                    ) : (
                        <div className="bg-white/20 rounded-xl p-4 flex items-center gap-2"><Loader2 size={20} className="text-white animate-spin" /><span className="text-white">Loading Maps...</span></div>
                    )}
                    {locationSelected && (
                        <div className="mt-3 bg-white/20 rounded-lg px-3 py-2 text-white text-sm flex items-center gap-2">
                            <Check size={16} /> <span className="font-medium">{formData.name}</span> — {formData.address}
                        </div>
                    )}
                </div>

                {/* Location Type */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building size={18} className="text-blue-500" /> Location Type</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {LOCATION_TYPES.map(({ value, label, icon: Icon }) => (
                            <button key={value} type="button" onClick={() => setFormData(p => ({ ...p, locationType: value }))}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.locationType === value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:border-gray-300 text-gray-600"}`}>
                                <Icon size={22} /><span className="text-xs font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                    {formData.locationType === "airport" && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div><label className="text-xs text-gray-500 mb-1 block">IATA Code</label><input name="iataCode" value={formData.iataCode} onChange={handleChange} placeholder="e.g. LHR" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                            <div><label className="text-xs text-gray-500 mb-1 block">ICAO Code</label><input name="icaoCode" value={formData.icaoCode} onChange={handleChange} placeholder="e.g. EGLL" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                        </div>
                    )}
                </div>

                {/* Map Zone Drawing */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={18} className="text-amber-500" /> Draw Coverage Zone</h3>
                    {isLoaded ? (
                        <AdminZoneMap
                            key={initialZone ? JSON.stringify(initialZone).slice(0, 40) : "empty"}
                            center={formData.coordinates?.lat ? formData.coordinates : null}
                            onZoneChange={setZone}
                            initialZone={initialZone}
                        />
                    ) : (
                        <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center"><Loader2 size={30} className="text-gray-400 animate-spin" /></div>
                    )}
                </div>

                {/* Settings */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Settings size={18} className="text-purple-500" /> Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Zone</label>
                            <select name="zone" value={formData.zone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                                <option>Entire UK Cover</option><option>London Zone</option><option>Scotland Zone</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Radius: {formData.radiusKm} km</label>
                            <input type="range" min={1} max={50} value={formData.radiusKm} onChange={e => setFormData(p => ({ ...p, radiusKm: parseInt(e.target.value) }))} className="w-full accent-blue-600" />
                        </div>
                        <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-blue-600 rounded" />
                            <span className="text-sm font-medium text-gray-800">Active</span>
                        </label>
                    </div>
                </div>

                {/* Per-Vehicle Pricing */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Car size={18} className="text-green-600" /> Per-Vehicle Pricing</h3>
                    </div>
                    <div className="flex flex-col lg:flex-row">
                        {/* Vehicle List */}
                        <div className="lg:w-56 border-b lg:border-b-0 lg:border-r border-gray-100 p-3 space-y-1.5">
                            {vehicles.map(v => {
                                const img = getImageUrl(v.image?.url);
                                const sel = selectedVehicle?._id === v._id;
                                return (
                                    <button key={v._id} onClick={() => setSelectedVehicle(v)}
                                        className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-left transition-all ${sel ? "bg-green-600 text-white" : "hover:bg-gray-50 border border-gray-100"}`}>
                                        <div className={`w-10 h-8 rounded overflow-hidden flex-shrink-0 ${sel ? "bg-green-500" : "bg-gray-100"}`}>
                                            {img ? <img src={img} alt={v.categoryName} className="w-full h-full object-contain" /> : <Car size={16} className={sel?"text-green-200":"text-gray-300"} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold truncate capitalize ${sel?"text-white":"text-gray-900"}`}>{v.categoryName}</p>
                                            {existingPricingIds[v._id] && <span className={`text-xs ${sel?"text-green-200":"text-green-500"}`}>● Configured</span>}
                                        </div>
                                        <ChevronRight size={14} className={sel?"text-green-200":"text-gray-400"} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Pricing Form */}
                        <div className="flex-1 p-5 space-y-5">
                            {selectedVehicle ? (
                                <motion.div key={selectedVehicle._id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-gray-900 capitalize">{selectedVehicle.categoryName}</h4>
                                        {existingPricingIds[selectedVehicle._id] && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Check size={10} /> Saved</span>}
                                    </div>

                                    {/* Distance Tiers */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-sm font-medium text-gray-700 flex items-center gap-1"><Zap size={14} className="text-amber-500" /> Distance Tiers</p>
                                            <button onClick={addTier} className="text-xs text-green-600 font-medium flex items-center gap-1 hover:text-green-700"><Plus size={14} /> Add Tier</button>
                                        </div>
                                        <div className="space-y-2">
                                            {pricingForm.distanceTiers.map((tier, i) => (
                                                <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
                                                    <div className="flex-1 grid grid-cols-4 gap-2">
                                                        <div><label className="text-xs text-gray-400 block mb-0.5">From (mi)</label><input type="number" value={tier.fromDistance} onChange={e => updateTier(i, "fromDistance", parseInt(e.target.value)||0)} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" /></div>
                                                        <div><label className="text-xs text-gray-400 block mb-0.5">To (mi)</label><input type="number" value={tier.toDistance} onChange={e => updateTier(i, "toDistance", parseInt(e.target.value)||0)} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" /></div>
                                                        <div><label className="text-xs text-gray-400 block mb-0.5">Price (£)</label><input type="number" step="0.01" value={tier.price} onChange={e => updateTier(i, "price", parseFloat(e.target.value)||0)} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm" /></div>
                                                        <div><label className="text-xs text-gray-400 block mb-0.5">Type</label>
                                                            <select value={tier.type} onChange={e => updateTier(i, "type", e.target.value)} className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm">
                                                                <option value="fixed">{i===0?"Min":"Fixed"}</option>
                                                                <option value="per_mile">Per Mi</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {i > 0 && <button onClick={() => removeTier(i)} className="p-1.5 text-red-400 hover:bg-red-50 rounded"><Trash2 size={15} /></button>}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                                            <div><label className="text-xs text-gray-400 block mb-0.5">After (miles)</label><input type="number" value={pricingForm.afterDistanceThreshold} onChange={e => setPricingForm(p => ({ ...p, afterDistanceThreshold: parseInt(e.target.value)||0 }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                                            <div><label className="text-xs text-gray-400 block mb-0.5">£ Per Mile</label><input type="number" step="0.01" value={pricingForm.afterDistancePricePerMile} onChange={e => setPricingForm(p => ({ ...p, afterDistancePricePerMile: parseFloat(e.target.value)||0 }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                                        </div>
                                    </div>

                                    {/* Additional Charges */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-3"><DollarSign size={14} className="text-green-500" /> Additional Charges</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {[["extraStopPrice","Extra Stop (£)"],["childSeatPrice","Child Seat (£)"],["congestionCharge","Congestion (£)"],["airportPickupCharge","Airport Pickup (£)"],["airportDropoffCharge","Airport Dropoff (£)"]].map(([field, label]) => (
                                                <div key={field}><label className="text-xs text-gray-400 block mb-0.5">{label}</label>
                                                    <input type="number" step="0.01" value={pricingForm.extras[field]} onChange={e => setPricingForm(p => ({ ...p, extras: { ...p.extras, [field]: parseFloat(e.target.value)||0 } }))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" /></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Display Options */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-3">Display Options</p>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            {[["displayVATInclusive","VAT Inc."],["displayParkingInclusive","Parking Inc."],["priceRoundOff","Round Off"]].map(([field, label]) => (
                                                <label key={field} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg cursor-pointer">
                                                    <input type="checkbox" checked={pricingForm[field]} onChange={e => setPricingForm(p => ({ ...p, [field]: e.target.checked }))} className="w-4 h-4 text-green-600 rounded" />
                                                    <span className="text-xs text-gray-700">{label}</span>
                                                </label>
                                            ))}
                                            <div className="p-2.5 bg-gray-50 rounded-lg">
                                                <select value={pricingForm.status} onChange={e => setPricingForm(p => ({ ...p, status: e.target.value }))} className="w-full px-2 py-1 border border-gray-200 rounded text-xs">
                                                    <option value="active">Active</option><option value="inactive">Inactive</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="flex items-center justify-center h-40 text-gray-400"><Car size={32} className="mb-2" /></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button onClick={handleSave} disabled={isSaving}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                    {isSaving ? "Saving..." : isEdit ? "Update Location" : "Create Location"}
                </button>
            </div>
        </div>
    );
}

export default AdminLocationZoneSetup;
