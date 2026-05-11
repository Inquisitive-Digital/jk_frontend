/**
 * GoogleMapsContext
 *
 * Loads the Google Maps JavaScript API exactly ONCE for the entire app.
 * Using `useJsApiLoader` in multiple components (even with identical options)
 * can cause the "Loader must not be called again with different options" crash
 * when they drift across page navigations.
 *
 * Solution: call `useJsApiLoader` here — once — with the SUPERSET of all
 * libraries needed anywhere in the app, then expose `isLoaded` via context.
 *
 * All consumers import `useGoogleMaps()` instead of calling `useJsApiLoader`.
 */

import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// Superset of every library used anywhere in the app:
//   "places"  → Booking, HeroSection, AdminAddLocation, AdminLocationZoneSetup, CreateLeadModal
//   "drawing" → AdminLocationZoneSetup (AdminZoneMap uses DrawingManager)
const GOOGLE_MAPS_LIBRARIES = ["places", "drawing"];

const GoogleMapsContext = createContext({ isLoaded: false });

export function GoogleMapsProvider({ children }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES,
        language: "en",
        region: "GB",
    });

    return (
        <GoogleMapsContext.Provider value={{ isLoaded }}>
            {children}
        </GoogleMapsContext.Provider>
    );
}

/** Drop-in replacement for `useJsApiLoader` across all components. */
export function useGoogleMaps() {
    return useContext(GoogleMapsContext);
}
