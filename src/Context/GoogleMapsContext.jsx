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
 *
 * PERFORMANCE: Maps JS is deferred until after the window load event to prevent
 * 332 KiB of Maps scripts from blocking LCP/FCP on the homepage and other pages.
 */

import { createContext, useContext, useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// Superset of every library used anywhere in the app:
//   "places"  → Booking, HeroSection, AdminAddLocation, AdminLocationZoneSetup, CreateLeadModal
//   "drawing" → AdminLocationZoneSetup (AdminZoneMap uses DrawingManager)
const GOOGLE_MAPS_LIBRARIES = ["places", "drawing"];

const GoogleMapsContext = createContext({ isLoaded: false });

// Inner component that actually calls useJsApiLoader — only mounted after page load
function MapsLoader({ children }) {
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

export function GoogleMapsProvider({ children }) {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Defer Maps JS until after the page has fully loaded + 1s buffer.
        // This prevents 332 KiB of Maps scripts from blocking LCP/FCP.
        let timer;
        const startTimer = () => {
            timer = setTimeout(() => setShouldLoad(true), 1000);
        };

        if (document.readyState === "complete") {
            // Already loaded (e.g. hot reload)
            startTimer();
        } else {
            window.addEventListener("load", startTimer, { once: true });
        }

        return () => {
            clearTimeout(timer);
            window.removeEventListener("load", startTimer);
        };
    }, []);

    if (!shouldLoad) {
        // Before Maps loads: isLoaded=false so components render their fallback state
        return (
            <GoogleMapsContext.Provider value={{ isLoaded: false }}>
                {children}
            </GoogleMapsContext.Provider>
        );
    }

    return <MapsLoader>{children}</MapsLoader>;
}

/** Drop-in replacement for `useJsApiLoader` across all components. */
export function useGoogleMaps() {
    return useContext(GoogleMapsContext);
}
