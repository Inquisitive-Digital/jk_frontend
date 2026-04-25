import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Hexagon, Circle, RotateCcw } from "lucide-react";

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

    // ── Eagerly initialise state from initialZone prop so data is available
    //    on the very first render — no useEffect timing gap.
    const [drawMode, setDrawMode] = useState(null);
    const [polygonPoints, setPolygonPoints] = useState(() => {
        if (initialZone?.type === "polygon" && initialZone.coordinates?.length > 0) {
            return initialZone.coordinates;
        }
        return [];
    });
    const [circleData, setCircleData] = useState(() => {
        if (initialZone?.type === "circle" && initialZone.center) {
            return { center: initialZone.center, radius: initialZone.radius || 5000 };
        }
        return null;
    });
    const [isDrawing, setIsDrawing] = useState(false);
    // true once the GoogleMap instance fires onLoad — used to re-trigger
    // drawing effects that previously ran while mapRef.current was still null.
    const [mapReady, setMapReady] = useState(false);

    // Imperative dot overlays drawn while placing points — stored so we can
    // clean them up when drawing ends. These have clickable:false so they
    // NEVER intercept map click events → unlimited points work.
    const dotOverlaysRef = useRef([]);

    // Live "preview" polygon shown while drawing (clickable:false, not editable)
    // so user sees the shape forming without blocking further clicks.
    const previewPolygonRef = useRef(null);

    // Track whether we've auto-fitted map bounds for the initial zone (once only)
    const hasFitBoundsRef = useRef(false);

    const mapCenter = center?.lat ? center : DEFAULT_CENTER;

    // ── Load initial zone data ──────────────────────────────────────────────────
    useEffect(() => {
        if (!initialZone) return;
        if (initialZone.type === "polygon" && initialZone.coordinates?.length > 0) {
            setPolygonPoints(initialZone.coordinates);
            setDrawMode(null);
            setIsDrawing(false);
        } else if (initialZone.type === "circle" && initialZone.center) {
            setCircleData({ center: initialZone.center, radius: initialZone.radius || 5000 });
            setDrawMode(null);
            setIsDrawing(false);
        }
    }, [initialZone]);

    // ── Clean up all map overlays ───────────────────────────────────────────────
    const clearDotOverlays = useCallback(() => {
        dotOverlaysRef.current.forEach((d) => d.setMap(null));
        dotOverlaysRef.current = [];
    }, []);

    const clearPreviewPolygon = useCallback(() => {
        if (previewPolygonRef.current) {
            previewPolygonRef.current.setMap(null);
            previewPolygonRef.current = null;
        }
    }, []);

    const clearShapes = useCallback(() => {
        if (polygonRef.current) {
            polygonRef.current.setMap(null);
            polygonRef.current = null;
        }
        if (circleRef.current) {
            circleRef.current.setMap(null);
            circleRef.current = null;
        }
        clearDotOverlays();
        clearPreviewPolygon();
        listenersRef.current.forEach((l) =>
            window.google?.maps?.event?.removeListener(l)
        );
        listenersRef.current = [];
    }, [clearDotOverlays, clearPreviewPolygon]);

    // ── Live preview polygon while actively drawing (clickable:false) ──────────
    // Drawn imperatively so clickable:false is guaranteed. Redrawn after every
    // new point. Does NOT block further map clicks.
    useEffect(() => {
        if (!mapRef.current || !window.google || !isDrawing || polygonPoints.length < 2) {
            clearPreviewPolygon();
            return;
        }

        // Remove old preview and create an updated one
        clearPreviewPolygon();
        previewPolygonRef.current = new window.google.maps.Polygon({
            paths: polygonPoints,
            strokeColor: "#f59e0b",
            strokeWeight: 2,
            strokeDashArray: [4, 4],
            fillColor: "#f59e0b",
            fillOpacity: 0.15,
            clickable: false,   // KEY: never intercepts map clicks
            editable: false,
            zIndex: 1,
            map: mapRef.current,
        });

        return () => clearPreviewPolygon();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapReady, isDrawing, JSON.stringify(polygonPoints)]);

    // ── Draw FINISHED polygon (only when NOT in drawing mode) ──────────────────
    useEffect(() => {
        // Only render the polygon overlay once drawing is finished
        if (!mapRef.current || !window.google || polygonPoints.length < 3 || isDrawing) {
            // Clean up any stale polygon when we re-enter drawing mode
            if (isDrawing && polygonRef.current) {
                polygonRef.current.setMap(null);
                polygonRef.current = null;
            }
            return;
        }

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

        // Notify parent with the finalised coordinates
        onZoneChange?.({ type: "polygon", coordinates: polygonPoints });

        return () => clearShapes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapReady, isDrawing, JSON.stringify(polygonPoints)]);

    // ── Auto-fit map bounds to show the loaded zone (once on initial load) ───────
    useEffect(() => {
        if (!mapRef.current || !window.google || hasFitBoundsRef.current) return;

        // Fit bounds to polygon
        if (polygonPoints.length >= 3 && !isDrawing) {
            const bounds = new window.google.maps.LatLngBounds();
            polygonPoints.forEach((p) => bounds.extend(p));
            mapRef.current.fitBounds(bounds, 50); // 50px padding
            hasFitBoundsRef.current = true;
        }
        // Fit bounds to circle
        else if (circleData && !isDrawing) {
            const bounds = new window.google.maps.LatLngBounds();
            // Approximate bounding box from center + radius
            const latDelta = circleData.radius / 111320; // ~metres per degree lat
            const lngDelta = circleData.radius / (111320 * Math.cos((circleData.center.lat * Math.PI) / 180));
            bounds.extend({ lat: circleData.center.lat + latDelta, lng: circleData.center.lng + lngDelta });
            bounds.extend({ lat: circleData.center.lat - latDelta, lng: circleData.center.lng - lngDelta });
            mapRef.current.fitBounds(bounds, 50);
            hasFitBoundsRef.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapReady, polygonPoints, circleData, isDrawing]);

    // ── Draw circle ─────────────────────────────────────────────────────────────
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapReady, circleData ? `${circleData.center.lat},${circleData.center.lng},${circleData.radius}` : null]);

    // ── Map click: add polygon points (unlimited) ───────────────────────────────
    const handleMapClick = useCallback(
        (e) => {
            if (drawMode !== "polygon" || !isDrawing) return;
            const point = { lat: e.latLng.lat(), lng: e.latLng.lng() };

            // Draw a non-clickable dot overlay for this point so the user can
            // see where they clicked — but it won't block future clicks.
            if (mapRef.current && window.google) {
                const dot = new window.google.maps.Circle({
                    center: point,
                    radius: 40,            // metres — visible dot
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                    fillColor: "#f59e0b",
                    fillOpacity: 1,
                    clickable: false,      // KEY: never intercepts map clicks
                    zIndex: 10,
                    map: mapRef.current,
                });
                dotOverlaysRef.current.push(dot);
            }

            setPolygonPoints((prev) => {
                const newPoints = [...prev, point];
                // Notify parent as soon as we have a valid polygon (3+ points)
                // so that saving mid-draw still captures the zone data.
                if (newPoints.length >= 3) {
                    onZoneChange?.({ type: "polygon", coordinates: newPoints });
                }
                return newPoints;
            });
        },
        [drawMode, isDrawing, onZoneChange]
    );

    // ── Controls ────────────────────────────────────────────────────────────────
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
        const c = center?.lat ? center : mapCenter;
        setCircleData({ center: c, radius: 5000 });
    };

    const resetAll = () => {
        clearShapes();
        clearDotOverlays();
        setPolygonPoints([]);
        setCircleData(null);
        setDrawMode(null);
        setIsDrawing(false);
        onZoneChange?.(null);
    };

    // Finish drawing — clears dots/preview, renders the editable polygon
    const finishPolygon = () => {
        clearDotOverlays();
        clearPreviewPolygon();
        setIsDrawing(false);
        setDrawMode(null);
    };

    const hasShape = polygonPoints.length >= 3 || circleData;

    return (
        <div className="space-y-3">
            {/* Drawing Controls */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={startPolygonDraw}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        drawMode === "polygon" && isDrawing
                            ? "bg-amber-100 text-amber-700 ring-2 ring-amber-300"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Hexagon size={16} /> Draw Polygon
                </button>

                <button
                    type="button"
                    onClick={startCircleDraw}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        drawMode === "circle"
                            ? "bg-blue-100 text-blue-700 ring-2 ring-blue-300"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    <Circle size={16} /> Draw Circle
                </button>

                {hasShape && !isDrawing && (
                    <button
                        type="button"
                        onClick={resetAll}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
                    >
                        <RotateCcw size={14} /> Reset Shape
                    </button>
                )}

                {/* Finish button — available any time during drawing (min 3 points) */}
                {isDrawing && drawMode === "polygon" && polygonPoints.length >= 3 && (
                    <button
                        type="button"
                        onClick={finishPolygon}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200"
                    >
                        ✓ Finish Polygon
                    </button>
                )}

                {/* Reset while drawing */}
                {isDrawing && (
                    <button
                        type="button"
                        onClick={resetAll}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100"
                    >
                        <RotateCcw size={14} /> Cancel
                    </button>
                )}
            </div>

            {/* Status Badge */}
            {(isDrawing || hasShape) && (
                <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        isDrawing
                            ? "bg-amber-100 text-amber-700 animate-pulse"
                            : polygonPoints.length >= 3
                            ? "bg-amber-100 text-amber-700"
                            : circleData
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                    }`}
                >
                    {isDrawing
                        ? `Click on map to add points — ${polygonPoints.length} placed so far (min 3, then Finish)`
                        : polygonPoints.length >= 3
                        ? `Polygon ready · ${polygonPoints.length} points`
                        : circleData
                        ? `Circle · ${Math.round(circleData.radius)}m radius`
                        : ""}
                </div>
            )}

            {/* Map */}
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={12}
                onClick={handleMapClick}
                onLoad={(map) => {
                    mapRef.current = map;
                    setMapReady(true); // triggers all drawing effects to re-run
                }}
                options={{
                    styles: MAP_STYLES,
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    // Prevent default click behaviour interfering while drawing
                    clickableIcons: !isDrawing,
                }}
            >
                {/* Location centre pin — always visible, one marker is fine */}
                {center?.lat && <Marker position={center} />}

                {/* NOTE: polygon-point dots are drawn imperatively in handleMapClick
                    with clickable:false — NOT as <Marker> components — so they
                    never block map click events. */}
            </GoogleMap>

            {/* Coordinates summary */}
            {polygonPoints.length >= 3 && !isDrawing && (
                <div className="bg-gray-50 rounded-lg p-3 max-h-24 overflow-y-auto">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                        Polygon Coordinates ({polygonPoints.length} points):
                    </p>
                    <p className="text-xs text-gray-600 font-mono break-all">
                        {polygonPoints
                            .map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`)
                            .join(" → ")}
                    </p>
                </div>
            )}

            {circleData && (
                <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Circle Zone:</p>
                    <p className="text-xs text-gray-600 font-mono">
                        Center: {circleData.center.lat.toFixed(5)},{" "}
                        {circleData.center.lng.toFixed(5)} | Radius:{" "}
                        {Math.round(circleData.radius)}m (
                        {(circleData.radius / 1000).toFixed(1)}km)
                    </p>
                </div>
            )}
        </div>
    );
}

export default AdminZoneMap;
