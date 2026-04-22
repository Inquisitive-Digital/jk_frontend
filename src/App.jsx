import React, { useEffect, useRef, Suspense, lazy } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Analytics from "./Utils/analytics";
import Lenis from "lenis";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { BookingProvider } from "./Context/BookingContext";
import Layout from "./Layout/Layout";
import SkeletonLoader from "./Components/SkeletonLoader";

// Global Lenis instance (accessible to ScrollToTop and ScrollToTopButton)
let lenisInstance = null;

// Export getter for other components
export const getLenisInstance = () => lenisInstance;

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use Lenis scrollTo for instant, conflict-free scroll
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    } else {
      // Fallback if Lenis not ready
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

// Fire page_view analytics event on every route change
function PageViewTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    Analytics.trackPageView(pathname);
  }, [pathname]);
  return null;
}

// Component to handle Tawk.to integration with route awareness
function TawkIntegration() {
  const location = useLocation();

  // Load the Tawk script once on mount (only if not on a hidden route initially)
  useEffect(() => {
    const propertyId = import.meta.env.VITE_TAWK_PROPERTY_ID;
    const widgetId = import.meta.env.VITE_TAWK_WIDGET_ID;

    if (!propertyId || !widgetId) return;

    // Inject the script only once
    if (!document.querySelector(`script[src*="tawk.to"]`)) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    }
  }, []); // run once on mount

  // Show / hide the widget based on the current route
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/login-admin');
    const isBookingRoute = location.pathname === '/booking';
    const shouldHide = isAdminRoute || isBookingRoute;

    const applyVisibility = () => {
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        if (shouldHide) {
          window.Tawk_API.hideWidget();
        } else {
          window.Tawk_API.showWidget();
        }
      }
    };

    // Tawk_API may not be ready yet — use onLoad callback if needed
    if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
      applyVisibility();
    } else {
      // Queue the call for when Tawk finishes loading
      window.Tawk_API = window.Tawk_API || {};
      const existingOnLoad = window.Tawk_API.onLoad;
      window.Tawk_API.onLoad = function () {
        if (existingOnLoad) existingOnLoad();
        applyVisibility();
      };
    }
  }, [location.pathname]);

  return null;
}

// Component to add canonical URL on every page
function CanonicalUpdater() {
  const location = useLocation();
  const baseUrl = 'https://www.jkexecutivechauffeurs.com';

  return (
    <Helmet>
      <link rel="canonical" href={`${baseUrl}${location.pathname}`} />
    </Helmet>
  );
}

// ==================== CODE SPLITTING - LAZY LOADED COMPONENTS ====================

// Public Pages
const Home = lazy(() => import("./Pages/Home"));
const Booking = lazy(() => import("./Pages/Booking"));
const Services = lazy(() => import("./Pages/Services"));
const ServiceWrapper = lazy(() => import("./Pages/ServiceWrapper"));
const Fleet = lazy(() => import("./Pages/Fleet"));
const FleetDetail = lazy(() => import("./Pages/FleetDetail"));
const EventWrapper = lazy(() => import("./Pages/EventWrapper"));
const Blog = lazy(() => import("./Pages/Blog"));
const BlogWrapper = lazy(() => import("./Pages/BlogWrapper"));
const AboutUs = lazy(() => import("./Pages/AboutUs"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const TermsAndConditions = lazy(() => import("./Pages/TermsAndConditions"));
const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy"));
const GDPRPolicy = lazy(() => import("./Pages/GDPRPolicy"));
const EventCalendar = lazy(() => import("./Pages/EventCalendar"));

// Admin Pages
const AdminLogin = lazy(() => import("./Components/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./Components/Admin/AdminDashboard"));
const AdminAllBookings = lazy(() => import("./Components/Admin/AdminAllBookings"));
const AdminAllLeads = lazy(() => import("./Components/Admin/AdminAllLeads"));
const AdminAllCars = lazy(() => import("./Components/Admin/AdminAllCars"));
const AdminAddCar = lazy(() => import("./Components/Admin/AdminAddCar"));
const AdminPricing = lazy(() => import("./Components/Admin/AdminPricing"));
const AdminAllPricing = lazy(() => import("./Components/Admin/AdminAllPricing"));
const AdminAllLocations = lazy(() => import("./Components/Admin/AdminAllLocations"));
const AdminAddLocation = lazy(() => import("./Components/Admin/AdminAddLocation"));
const AdminLocationPricing = lazy(() => import("./Components/Admin/AdminLocationPricing"));
const AdminLocationZoneSetup = lazy(() => import("./Components/Admin/AdminLocationZoneSetup"));

function App() {
  useEffect(() => {
    // Initialize Analytics — loads GTM + Meta Pixel scripts (production only)
    Analytics.initialize();

    // CRITICAL: Disable browser scroll restoration to prevent scroll position being saved on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis();
    lenisInstance = lenis; // Store globally for ScrollToTop access

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <BookingProvider>
          <ScrollToTop />
          <PageViewTracker />
          <TawkIntegration />
          <CanonicalUpdater />
          <Suspense fallback={<SkeletonLoader />}>
            <Routes>
              {/* Public Routes with Layout */}
              <Route path="/" element={<Layout isHeroPage={true}><Home /></Layout>} />
              <Route path="/booking" element={<Layout isHeroPage={false} showContactForm={false} showWhatsApp={false} showScrollToTop={false}><Booking /></Layout>} />
              <Route path="/services" element={<Layout isHeroPage={false}><Services /></Layout>} />
              <Route path="/services/:slug" element={<Layout isHeroPage={false}><ServiceWrapper /></Layout>} />
              <Route path="/fleet" element={<Layout isHeroPage={false}><Fleet /></Layout>} />
              <Route path="/fleet/:slug" element={<Layout isHeroPage={false}><FleetDetail /></Layout>} />
              <Route path="/events/event-calendar" element={<Layout isHeroPage={false}><EventCalendar /></Layout>} />
              <Route path="/events/:slug" element={<Layout isHeroPage={false}><EventWrapper /></Layout>} />
              <Route path="/blog" element={<Layout isHeroPage={false}><Blog /></Layout>} />
              <Route path="/blog/:slug" element={<Layout isHeroPage={false}><BlogWrapper /></Layout>} />
              <Route path="/about" element={<Layout isHeroPage={false}><AboutUs /></Layout>} />
              <Route path="/contact" element={<Layout isHeroPage={false} showContactForm={false}><ContactUs /></Layout>} />
              <Route path="/terms-and-conditions" element={<Layout isHeroPage={false}><TermsAndConditions /></Layout>} />
              <Route path="/privacy-policy" element={<Layout isHeroPage={false}><PrivacyPolicy /></Layout>} />
              <Route path="/gdpr-policy" element={<Layout isHeroPage={false}><GDPRPolicy /></Layout>} />
              <Route path="/event-calender2" element={<Layout isHeroPage={false}><EventCalendar /></Layout>} />

              {/* Admin Routes (no layout wrapper) */}
              <Route path="/login-admin" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/leads" element={<AdminAllLeads />} />
              <Route path="/admin/bookings" element={<AdminAllBookings />} />
              <Route path="/admin/vehicles" element={<AdminAllCars />} />
              <Route path="/admin/add-car" element={<AdminAddCar />} />
              <Route path="/admin/pricing" element={<AdminPricing />} />
              <Route path="/admin/all-pricing" element={<AdminAllPricing />} />

              {/* Location Routes */}
              <Route path="/admin/locations" element={<AdminAllLocations />} />
              <Route path="/admin/add-location" element={<AdminAddLocation />} />
              <Route path="/admin/edit-location/:id" element={<AdminAddLocation />} />
              <Route path="/admin/location-pricing/:locationId" element={<AdminLocationPricing />} />
              <Route path="/admin/location-zone/:id" element={<AdminLocationZoneSetup />} />


              {/* Catch undefined routes and fallback to home */}
              <Route path="*" element={<Layout isHeroPage={false}><Home /></Layout>} />

            </Routes>
          </Suspense>
        </BookingProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
