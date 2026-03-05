/**
 * ============================================================
 * JK Executive — Analytics Tracking Service
 * ============================================================
 * Singleton wrapper for Google Tag Manager + Meta Pixel.
 * Loads scripts dynamically — only in production to keep dev clean.
 *
 * Usage:
 *   import Analytics from './analytics';
 *   Analytics.track(Analytics.EVENTS.BUTTON_CLICK_BOOKING, { button_name: 'hero_get_quote' });
 * ============================================================
 */

class AnalyticsWrapper {
    static instance = null;

    // ── Event Registry ─────────────────────────────────────────
    EVENTS = {
        // Customer journey
        BUTTON_CLICK_BOOKING: "button_click_booking",   // Any CTA → /booking
        CALL_BUTTON_CLICK: "call_button_click",       // Any tel: link / call button
        INITIATE_CHECKOUT: "initiate_checkout",       // "Proceed to Payment" on summary
        PURCHASE: "purchase",               // Successful Stripe payment
        PAYMENT_FAILURE: "payment_failure",        // Stripe error / page abandon

        // General
        PAGE_VIEW: "page_view",
        FORM_SUBMIT: "form_submit",
    };

    // ── Internal state ─────────────────────────────────────────
    #isInitialized = false;
    #scriptsLoaded = false;
    #gtmId = null;
    #pixelId = null;

    defaultParams = {
        app_version: "1.0.0",
        platform: "web",
    };

    // ── Singleton guard ────────────────────────────────────────
    constructor() {
        if (AnalyticsWrapper.instance) {
            throw new Error("Use Analytics (default export) — do NOT call new AnalyticsWrapper()");
        }
    }

    static getInstance() {
        if (!AnalyticsWrapper.instance) {
            AnalyticsWrapper.instance = new AnalyticsWrapper();
        }
        return AnalyticsWrapper.instance;
    }

    // ── Environment check ──────────────────────────────────────
    /**
     * Returns true when running on a real/production host.
     * Tracking is intentionally skipped on localhost / 127.0.0.1
     */
    isProduction() {
        const hostname = window.location.hostname;
        return (
            hostname !== "localhost" &&
            hostname !== "127.0.0.1"
        );
    }

    // ── Script loading ─────────────────────────────────────────
    /**
     * Dynamically injects GTM into <head> / <body>.
     * Safe to call multiple times — only loads once.
     */
    loadTrackingScripts() {
        if (!this.isProduction()) {
            console.log("[Analytics] Skipped — running on dev/localhost");
            return Promise.resolve();
        }

        if (this.#scriptsLoaded) return Promise.resolve();

        return new Promise((resolve) => {
            // ── GTM <script> ──
            const gtmScript = document.createElement("script");
            gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${import.meta.env.VITE_GTM_ID || "GTM-K6TCGLZS"}');
      `;
            document.head.appendChild(gtmScript);

            // ── GTM <noscript> fallback ──
            const gtmNoscript = document.createElement("noscript");
            gtmNoscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${import.meta.env.VITE_GTM_ID || "GTM-K6TCGLZS"}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
            if (document.body.firstChild) {
                document.body.insertBefore(gtmNoscript, document.body.firstChild);
            } else {
                document.body.appendChild(gtmNoscript);
            }

            // ── Meta Pixel <script> ──
            const pixelId = import.meta.env.VITE_PIXEL_ID || "4021930454788333";
            const pixelScript = document.createElement("script");
            pixelScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      `;
            document.head.appendChild(pixelScript);

            // ── Meta Pixel <noscript> fallback ──
            const pixelNoscript = document.createElement("noscript");
            pixelNoscript.innerHTML = `<img height="1" width="1" style="display:none"
        src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>`;
            document.body.appendChild(pixelNoscript);

            this.#scriptsLoaded = true;

            // Give scripts a moment to bootstrap
            setTimeout(resolve, 150);
        });
    }

    // ── Safe wrapper around window.gtag ───────────────────────
    #safeGtag(...args) {
        if (typeof window.gtag === "function") {
            window.gtag(...args);
        } else if (window.dataLayer) {
            window.dataLayer.push(arguments);
        } else {
            console.warn("[Analytics] gtag not available:", ...args);
        }
    }

    // ── Safe wrapper around window.fbq (Meta Pixel) ──────────
    #safeFbq(type, eventName, payload = {}) {
        if (typeof window.fbq === "function") {
            window.fbq(type, eventName, payload);
        }
    }

    // ── Initialize ─────────────────────────────────────────────
    /**
     * Call once in App.jsx useEffect.
     * Safely skips if already initialized or not in production.
     */
    async initialize(gtmId) {
        if (this.#isInitialized) return;

        await this.loadTrackingScripts();

        this.#gtmId = gtmId || import.meta.env.VITE_GTM_ID || "GTM-K6TCGLZS";
        this.#pixelId = import.meta.env.VITE_PIXEL_ID || "4021930454788333";
        this.#isInitialized = true;

        // Init Meta Pixel + fire PageView
        if (this.isProduction()) {
            this.#safeFbq("init", this.#pixelId);
            this.#safeFbq("track", "PageView");
        }

        console.log(`[Analytics] Initialized → GTM(${this.#gtmId}) | Pixel(${this.#pixelId})`);
    }

    // ── Main track() method ────────────────────────────────────
    /**
     * Fire a tracking event.
     * @param {string} eventName  — Must be one of Analytics.EVENTS
     * @param {object} data       — Extra payload merged with defaultParams
     */
    track(eventName, data = {}) {
        // Validate event name
        const allowed = Object.values(this.EVENTS);
        if (!allowed.includes(eventName)) {
            console.error(
                `[Analytics] Unknown event "${eventName}". Allowed:`, allowed
            );
            return;
        }

        // Build payload
        const payload = {
            ...this.defaultParams,
            page_path: window.location.pathname,
            ...data,
        };

        // Purchase normalization
        if (eventName === this.EVENTS.PURCHASE) {
            if (payload.amount && !payload.value) payload.value = payload.amount;
            if (!payload.currency) payload.currency = "GBP";
            if (payload.vehicle && !payload.content_name) payload.content_name = payload.vehicle;
        }

        // Initiate Checkout normalization
        if (eventName === this.EVENTS.INITIATE_CHECKOUT) {
            if (payload.amount && !payload.value) payload.value = payload.amount;
            if (!payload.currency) payload.currency = "GBP";
        }

        // Send to dataLayer (GTM picks it up)
        if (window.dataLayer) {
            window.dataLayer.push({ event: eventName, ...payload });
        }

        // Also fire via gtag if available
        this.#safeGtag("event", eventName, payload);

        // ── Meta Pixel event mapping ──────────────────────────
        if (this.isProduction()) {
            const fbqPayload = {};
            if (payload.value) fbqPayload.value = payload.value;
            if (payload.currency) fbqPayload.currency = payload.currency;
            if (payload.vehicle) fbqPayload.content_name = payload.vehicle;

            switch (eventName) {
                case this.EVENTS.PURCHASE:
                    // Standard Pixel Purchase event
                    this.#safeFbq("track", "Purchase", fbqPayload);
                    break;
                case this.EVENTS.INITIATE_CHECKOUT:
                    // Standard Pixel InitiateCheckout event
                    this.#safeFbq("track", "InitiateCheckout", fbqPayload);
                    break;
                case this.EVENTS.BUTTON_CLICK_BOOKING:
                    // Standard Pixel Lead — someone showed interest in booking
                    this.#safeFbq("track", "Lead", { content_name: payload.button_name });
                    break;
                case this.EVENTS.CALL_BUTTON_CLICK:
                    // Custom Pixel event for call clicks
                    this.#safeFbq("trackCustom", "CallClick", { call_source: payload.call_source });
                    break;
                case this.EVENTS.PAYMENT_FAILURE:
                    // Custom Pixel event for payment failures
                    this.#safeFbq("trackCustom", "PaymentFailure", { reason: payload.error_description });
                    break;
                default:
                    break;
            }
        }

        // Always log in dev for easy debugging
        if (!this.isProduction()) {
            console.log(`[Analytics] ${eventName}`, payload);
        }
    }

    // ────────────────────────────────────────────────────────────
    // Convenience shortcut methods
    // ────────────────────────────────────────────────────────────

    trackBookingClick(buttonName, extra = {}) {
        this.track(this.EVENTS.BUTTON_CLICK_BOOKING, {
            button_name: buttonName,
            ...extra,
        });
    }

    trackCallClick(source, extra = {}) {
        this.track(this.EVENTS.CALL_BUTTON_CLICK, {
            call_source: source,
            ...extra,
        });
    }

    trackInitiateCheckout(bookingData = {}) {
        this.track(this.EVENTS.INITIATE_CHECKOUT, {
            amount: bookingData.selectedVehicle?.pricing?.totalPrice,
            currency: "GBP",
            vehicle: bookingData.selectedVehicle?.categoryName,
            service_type: bookingData.serviceType,
            pickup: bookingData.pickup,
            dropoff: bookingData.dropoff,
            pickup_date: bookingData.pickupDate,
        });
    }

    trackPurchase(paymentIntent, bookingData = {}) {
        this.track(this.EVENTS.PURCHASE, {
            transaction_id: paymentIntent?.id,
            amount: bookingData.selectedVehicle?.pricing?.totalPrice,
            currency: "GBP",
            vehicle: bookingData.selectedVehicle?.categoryName,
            service_type: bookingData.serviceType,
            payment_method: "stripe",
        });
    }

    trackPaymentFailure(reason, extra = {}) {
        this.track(this.EVENTS.PAYMENT_FAILURE, {
            error_description: reason,
            currency: "GBP",
            ...extra,
        });
    }
}

// Export the singleton
const Analytics = AnalyticsWrapper.getInstance();
export default Analytics;
