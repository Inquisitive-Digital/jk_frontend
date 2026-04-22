import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Hexagon, Circle, RotateCcw, MapPin } from "lucide-react";

const MAP_STYLES = [
    { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9e7f5" }] },
];

const containerStyle = { width: "100%", height: "450px", borderRadius: "12px" };
const DEFAULT_CENTER = { lat: 53.4808, lng: -2.2426 }; // Manchester

function AdminZoneMap({ center, onZoneChange, initialZone }) {
    const mapRef = useRef(null);
    const polygonRef = useRef(null);
    const circleRef = useRef(null);
    const listenersRef = useRef([]);

    const [drawMode, setDrawMode] = useState(null); // 'polygon' | 'circle' | null
    const [polygonPoints, setPolygonPoints] = useState([]);
    const [circleData, setCircleData] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const mapCenter = center?.lat ? center : DEFAULT_CENTER;

    // Load initial zone data
    useEffect(() => {
        if (!initialZone) return;
        if (initialZone.type === "polygon" && initialZone.coordinates?.length > 0) {
            setPolygonPoints(initialZone.coordinates);
            setDrawMode(null);
        } else if (initialZone.type === "circle" && initialZone.center) {
            setCircleData({ center: initialZone.center, radius: initialZone.radius || 5000 });
            setDrawMode(null);
        }
    }, [initialZone]);

    // Clean up shapes
    const clearShapes = useCallback(() => {
        if (polygonRef.current) { polygonRef.current.setMap(null); polygonRef.current = null; }
        if (circleRef.current) { circleRef.current.setMap(null); circleRef.current = null; }
        listenersRef.current.forEach(l => window.google?.maps?.event?.removeListener(l));
        listenersRef.current = [];
    }, []);

    // Draw polygon on map
    useEffect(() => {
        if (!mapRef.current || !window.google || polygonPoints.length < 3) return;
        clearShapes();

        const poly = new window.google.maps.Polygon({
            paths: polygonPoints,
            strokeColor: "#f59e0b",
            strokeWeight: 2,
            fillColor: "#f59e0b",
            fillOpacity: 0.2,
            editable: true,
            draggable: false,
        });
        poly.setMap(mapRef.current);
        polygonRef.current = poly;

        const updatePath = () => {
            const path = poly.getPath();
            const coords = [];
            for (let i = 0; i < path.getLength(); i++) {
                coords.push({ lat: path.getAt(i).lat(), lng: path.getAt(i).lng() });
            }
            setPolygonPoints(coords);
            onZoneChange?.({ type: "polygon", coordinates: coords });
        };

        const l1 = window.google.maps.event.addListener(poly.getPath(), "set_at", updatePath);
        const l2 = window.google.maps.event.addListener(poly.getPath(), "insert_at", updatePath);
        listenersRef.current = [l1, l2];

        onZoneChange?.({ type: "polygon", coordinates: polygonPoints });
        return () => clearShapes();
    }, [polygonPoints.length >= 3 ? JSON.stringify(polygonPoints) : null]);

    // Draw circle on map
    useEffect(() => {
        if (!mapRef.current || !window.google || !circleData) return;
        clearShapes();

        const circ = new window.google.maps.Circle({
            center: circleData.center,
            radius: circleData.radius,
            strokeColor: "#3b82f6",
            strokeWeight: 2,
            fillColor: "#3b82f6",
            fillOpacity: 0.15,
            editable: true,
            draggable: true,
            map: mapRef.current,
        });
        circleRef.current = circ;

        const updateCircle = () => {
            const c = circ.getCenter();
            const r = circ.getRadius();
            const newData = { center: { lat: c.lat(), lng: c.lng() }, radius: r };
            setCircleData(newData);
            onZoneChange?.({ type: "circle", center: newData.center, radius: r });
        };

        const l1 = window.google.maps.event.addListener(circ, "radius_changed", updateCircle);
        const l2 = window.google.maps.event.addListener(circ, "center_changed", updateCircle);
        listenersRef.current = [l1, l2];

        onZoneChange?.({ type: "circle", center: circleData.center, radius: circleData.radius });
        return () => clearShapes();
    }, [circleData ? `${circleData.center.lat},${circleData.center.lng},${circleData.radius}` : null]);

    // Handle map clicks for polygon drawing
    const handleMapClick = useCallback((e) => {
        if (drawMode !== "polygon" || !isDrawing) return;
        const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        setPolygonPoints(prev => [...prev, point]);
    }, [drawMode, isDrawing]);

    const startPolygonDraw = () => {
        clearShapes();
        setPolygonPoints([]);
        setCircleData(null);
        setDrawMode("polygon");
        setIsDrawing(true);
    };

    const startCircleDraw = () => {
        clearShapes();
        setPolygonPoints([]);
        setCircleData(null);
        setDrawMode("circle");
        setIsDrawing(false);
        // Place circle at map center
        const c = center?.lat ? center : mapCenter;
        setCircleData({ center: c, radius: 5000 });
    };

    const resetAll = () => {
        clearShapes();
        setPolygonPoints([]);
        setCircleData(null);
        setDrawMode(null);
        setIsDrawing(false);
        onZoneChange?.(null);
    };

    const finishPolygon = () => {
        setIsDrawing(false);
        setDrawMode(null);
    };

    const hasShape = polygonPoints.length >= 3 || circleData;

    return (
        <div className="space-y-3">
            {/* Drawing Controls */}
            <div className="flex items-center gap-2 flex-wrap">
                <button type="button" onClick={startPolygonDraw}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${drawMode === "polygon" ? "bg-amber-100 text-amber-700 ring-2 ring-amber-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    <Hexagon size={16} /> Draw Polygon
                </button>
                <button type="button" onClick={startCircleDraw}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${drawMode === "circle" ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                    <Circle size={16} /> Draw Circle
                </button>
                {hasShape && (
                    <button type="button" onClick={resetAll}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100">
                        <RotateCcw size={14} /> Reset Shape
                    </button>
                )}
                {isDrawing && drawMode === "polygon" && polygonPoints.length >= 3 && (
                    <button type="button" onClick={finishPolygon}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200">
                        ✓ Finish Polygon
                    </button>
                )}
            </div>

            {/* Status Badge */}
            {(isDrawing || hasShape) && (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${isDrawing ? "bg-amber-100 text-amber-700 animate-pulse" : polygonPoints.length >= 3 ? "bg-amber-100 text-amber-700" : circleData ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                    {isDrawing ? `Click on map to add points (${polygonPoints.length} placed)` :
                     polygonPoints.length >= 3 ? `Polygon: ${polygonPoints.length} points` :
                     circleData ? `Circle: ${Math.round(circleData.radius)}m radius` : ""}
                </div>
            )}

            {/* Map */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                onClick={handleMapClick}
                onLoad={map => { mapRef.current = map; }}
                options={{ styles: MAP_STYLES, disableDefaultUI: false, zoomControl: true, mapTypeControl: false, streetViewControl: false, fullscreenControl: true }}
            >
                {center?.lat && <Marker position={center} />}
                {/* Polygon preview dots while drawing */}
                {isDrawing && polygonPoints.map((p, i) => (
                    <Marker key={i} position={p} icon={{
                        path: window.google?.maps?.SymbolPath?.CIRCLE,
                        scale: 6, fillColor: "#f59e0b", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2,
                    }} />
                ))}
            </GoogleMap>

            {/* Coordinates Display */}
            {polygonPoints.length >= 3 && (
                <div className="bg-gray-50 rounded-lg p-3 max-h-24 overflow-y-auto">
                    <p className="text-xs text-gray-500 font-medium mb-1">Polygon Coordinates:</p>
                    <p className="text-xs text-gray-600 font-mono break-all">
                        {polygonPoints.map((p, i) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join(" → ")}
                    </p>
                </div>
            )}
            {circleData && (
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Circle Zone:</p>
                    <p className="text-xs text-gray-600 font-mono">
                        Center: {circleData.center.lat.toFixed(5)}, {circleData.center.lng.toFixed(5)} | Radius: {Math.round(circleData.radius)}m ({(circleData.radius / 1000).toFixed(1)}km)
                    </p>
                </div>
            )}
        </div>
    );
}

export default AdminZoneMap;
