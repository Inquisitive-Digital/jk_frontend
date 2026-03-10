import axios from "axios";
import { toast } from "react-toastify";

const Environment = {
    LOCAL_URL: "http://localhost:5000",
    STAGING_URL: "https://jk-frontend-nine.vercel.app",
    PRODUCTION_URL: "https://lavender-salmon-796541.hostingersite.com",
};

const hostname = window.location.hostname;

export let BASE_URL = Environment.LOCAL_URL;

if (hostname.includes("vercel.app")) {
    BASE_URL = Environment.STAGING_URL;
} else if (
    hostname.includes("hostingersite.com") ||
    hostname === "jkexecutivechauffeurs.com" ||
    hostname === "www.jkexecutivechauffeurs.com"
) {
    BASE_URL = Environment.PRODUCTION_URL;
}

export const BASE_URL_IMAGE = BASE_URL; 

export function getImageUrl(path, fallback = "") {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;

    // Ensure no double-slash between base and path
    const base = BASE_URL.replace(/\/$/, "");
    const rel = path.startsWith("/") ? path : `/${path}`;
    return `${base}${rel}`;
}

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Automatically attach admin JWT token to every request if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Show a toast notification when the server returns 429 Too Many Requests
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 429) {
            toast.error(
                "Too many requests! You've hit the rate limit. Please wait 15 minutes before trying again.",
                {
                    toastId: "rate-limit-error", // prevent duplicate toasts
                    autoClose: 5000,
                    position: "top-center",
                }
            );
        }
        return Promise.reject(error);
    }
);



// Vehicle APIs
export const vehicleAPI = {
    // Search vehicles with fare calculation
    searchVehiclesWithFare: async (data) => {
        const response = await api.post("/api/vehicles/search", data);
        return response.data;
    },

    // Get single vehicle
    getVehicle: async (id) => {
        const response = await api.get(`/api/vehicles/${id}`);
        return response.data;
    },

    // Create vehicle (admin)
    createVehicle: async (formData) => {
        const response = await api.post("/api/vehicles", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    // Get all vehicles (admin)
    getAllVehicles: async (params = {}) => {
        const response = await api.get("/api/vehicles", { params });
        return response.data;
    },

    // Update vehicle (admin)
    updateVehicle: async (id, data) => {
        const response = await api.put(`/api/vehicles/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    // Delete vehicle (admin)
    deleteVehicle: async (id) => {
        const response = await api.delete(`/api/vehicles/${id}`);
        return response.data;
    },

    // Toggle vehicle status (admin)
    toggleVehicleStatus: async (id) => {
        const response = await api.patch(`/api/vehicles/${id}/toggle-status`);
        return response.data;
    },
};

// Pricing APIs
export const pricingAPI = {
    // Get all pricing configurations
    getAllPricing: async (params = {}) => {
        const response = await api.get("/api/pricing", { params });
        return response.data;
    },

    // Get pricing for a specific vehicle
    getVehiclePricing: async (vehicleId) => {
        const response = await api.get(`/api/pricing/vehicle/${vehicleId}`);
        return response.data;
    },

    // Set P2P pricing for a vehicle
    setP2PPricing: async (vehicleId, data) => {
        const response = await api.put(`/api/pricing/vehicle/${vehicleId}/p2p`, data);
        return response.data;
    },

    // Set Hourly pricing for a vehicle
    setHourlyPricing: async (vehicleId, data) => {
        const response = await api.put(`/api/pricing/vehicle/${vehicleId}/hourly`, data);
        return response.data;
    },

    // Delete pricing configuration
    deletePricing: async (id) => {
        const response = await api.delete(`/api/pricing/${id}`);
        return response.data;
    },
};

// Location (Airport) APIs
export const locationAPI = {
    // Get all locations
    getAll: async (params = {}) => {
        const response = await api.get("/api/airports", { params });
        return response.data;
    },

    // Get single location
    getById: async (id) => {
        const response = await api.get(`/api/airports/${id}`);
        return response.data;
    },

    // Create location
    create: async (data) => {
        const response = await api.post("/api/airports", data);
        return response.data;
    },

    // Update location
    update: async (id, data) => {
        const response = await api.put(`/api/airports/${id}`, data);
        return response.data;
    },

    // Delete location
    delete: async (id) => {
        const response = await api.delete(`/api/airports/${id}`);
        return response.data;
    },

    // Search locations
    search: async (query) => {
        const response = await api.get("/api/airports/search", { params: { q: query } });
        return response.data;
    },
};

// Location/Airport Pricing APIs
export const locationPricingAPI = {
    // Get all location pricing
    getAll: async (params = {}) => {
        const response = await api.get("/api/airport-pricing", { params });
        return response.data;
    },

    // Get pricing for a specific location
    getByLocation: async (airportId) => {
        const response = await api.get(`/api/airport-pricing/airport/${airportId}`);
        return response.data;
    },

    // Get pricing for a specific vehicle
    getByVehicle: async (vehicleId) => {
        const response = await api.get(`/api/airport-pricing/vehicle/${vehicleId}`);
        return response.data;
    },

    // Create or update location pricing
    create: async (data) => {
        const response = await api.post("/api/airport-pricing", data);
        return response.data;
    },

    // Update location pricing
    update: async (id, data) => {
        const response = await api.put(`/api/airport-pricing/${id}`, data);
        return response.data;
    },

    // Delete location pricing
    delete: async (id) => {
        const response = await api.delete(`/api/airport-pricing/${id}`);
        return response.data;
    },
};

// Payment APIs
export const paymentAPI = {
    // Create payment intent
    createPaymentIntent: async (data) => {
        // Automatically include origin for test/live mode detection
        const response = await api.post("/api/payments/create-intent", {
            ...data,
            origin: window.location.origin,
        });
        return response.data;
    },

    // Get payment status  
    getPaymentStatus: async (paymentIntentId) => {
        const response = await api.get(`/api/payments/status/${paymentIntentId}`);
        return response.data;
    },
};

// Booking APIs (called after payment is complete)
export const bookingAPI = {
    // Create booking 
    createBooking: async (data) => {
        const response = await api.post("/api/bookings", data);
        return response.data;
    },

    // Get booking by ID
    getBooking: async (id) => {
        const response = await api.get(`/api/bookings/${id}`);
        return response.data;
    },

    // Update booking status
    updateBookingStatus: async (id, data) => {
        const response = await api.patch(`/api/bookings/${id}/status`, data);
        return response.data;
    },

    // Update booking details (when user edits from summary)
    updateBookingDetails: async (id, data) => {
        const response = await api.put(`/api/bookings/${id}/details`, data);
        return response.data;
    },

    // Get all bookings (admin)
    getAllBookings: async (params = {}) => {
        const response = await api.get("/api/bookings", { params });
        return response.data;
    },

    // Delete booking (admin)
    deleteBooking: async (id) => {
        const response = await api.delete(`/api/bookings/${id}`);
        return response.data;
    },
};

// Admin APIs
export const adminAPI = {
    // Admin login
    login: async (email, password) => {
        const response = await api.post("/api/admin/login", { email, password });
        return response.data;
    },

    // Verify admin token
    verify: async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await api.get("/api/admin/verify", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Get dashboard stats
    getStats: async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await api.get("/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Logout (clear token from localStorage)
    logout: () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
    },
};


// Service APIs
export const serviceAPI = {
    // Get all services (paginated)
    getAllServices: async (page = 1, limit = 10) => {
        const response = await api.get("/api/services", { params: { page, limit } });
        return response.data;
    },

    // Get single service by slug
    getServiceBySlug: async (slug) => {
        const response = await api.get(`/api/services/${slug}`);
        return response.data;
    },

    // Get nav menu structure (services grouped by category + airports)
    getNavMenu: async () => {
        const response = await api.get("/api/services/nav-menu");
        return response.data;
    },
};


export const fleetAPI = {
    // Get all fleet entries (paginated)
    getAll: async (page = 1, limit = 9) => {
        const response = await api.get("/api/fleet", { params: { page, limit } });
        return response.data;
    },

    // Get fleet entry by slug
    getBySlug: async (slug) => {
        const response = await api.get(`/api/fleet/${slug}`);
        return response.data;
    },
};

// Event APIs
export const eventAPI = {
    // Get events for navigation dropdown (showInNav: true)
    getNavEvents: async () => {
        const response = await api.get("/api/events/nav");
        return response.data;
    },

    // Get all events
    getAll: async () => {
        const response = await api.get("/api/events", { params: { limit: 100 } });
        return response.data;
    },

    // Get event by slug
    getBySlug: async (slug) => {
        const response = await api.get(`/api/events/${slug}`);
        return response.data;
    },
};

// Blog APIs
export const blogAPI = {
    // Get all blogs (paginated)
    getAll: async (page = 1, limit = 9) => {
        const response = await api.get("/api/blogs", { params: { page, limit } });
        return response.data;
    },

    // Get blog by slug (full body with HTML)
    getBySlug: async (slug) => {
        const response = await api.get(`/api/blogs/${slug}`);
        return response.data;
    },
};

// Contact / Inquiry API
export const contactAPI = {
    // Submit contact form inquiry — sends email to admin
    submitInquiry: async (data) => {
        const response = await api.post("/api/contact", data);
        return response.data;
    },

    // Submit bulk / corporate quote request — sends email to admin
    submitBulkQuote: async (data) => {
        const response = await api.post("/api/contact/quote", data);
        return response.data;
    },
};

// FAQ APIs
export const faqAPI = {
    // Get all active FAQs
    getFAQs: async () => {
        const response = await api.get("/api/faqs");
        return response.data;
    },
};

export default api;
