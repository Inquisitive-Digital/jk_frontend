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

import { createContext, useContext, useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useLocation } from "react-router-dom";

const GOOGLE_MAPS_LIBRARIES = ["places", "drawing"];

const GoogleMapsContext = createContext({ isLoaded: false });

export function GoogleMapsProvider({ children }) {
    const location = useLocation();
    const isPriorityRoute = location.pathname === '/booking' || location.pathname.startsWith('/admin') || location.pathname.startsWith('/login-admin');

    const [shouldLoad, setShouldLoad] = useState(isPriorityRoute);
    const [isMapsLoaded, setIsMapsLoaded] = useState(false);

    useEffect(() => {
        if (shouldLoad) return;
        
        const handleInteraction = () => setShouldLoad(true);
        
        window.addEventListener('mousemove', handleInteraction, { once: true });
        window.addEventListener('scroll', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
        
        const timeout = setTimeout(() => {
            setShouldLoad(true);
        }, 3000);
        
        return () => {
            window.removeEventListener('mousemove', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
            clearTimeout(timeout);
        };
    }, [shouldLoad]);

    return (
        <GoogleMapsContext.Provider value={{ isLoaded: isMapsLoaded }}>
            {shouldLoad && <MapsScriptLoader onLoad={() => setIsMapsLoaded(true)} />}
            {children}
        </GoogleMapsContext.Provider>
    );
}

function MapsScriptLoader({ onLoad }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES,
        language: "en",
        region: "GB",
    });

    useEffect(() => {
        if (isLoaded) onLoad();
    }, [isLoaded, onLoad]);

    return null;
}

export function useGoogleMaps() {
    return useContext(GoogleMapsContext);
}
