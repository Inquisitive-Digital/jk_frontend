class AnalyticsWrapper {
  static instance = null;

  // ── Allowed Events — central registry (acts like enum) ──────
  ALLOWED_EVENTS = {
    BOOK_NOW_BUTTON_CLICK: "Book_now_button_click",
    LOGIN_BUTTON_CLICK: "Login_button_click",
    CALL_BUTTON_CLICK: "Call_button_click",
    GET_PRICE_BUTTON_CLICK: "Get_price_button_click",
    INQUIRY_GENERATED: "Inquiry_generated",
    PURCHASE: "purchase",
    PAYMENT_FAILURE: "Payment_failure",
    PAGE_VIEW: "page_view",
  };

  defaultParams = {
    app_version: "1.0.0",
    platform: "web",
    user_agent: navigator.userAgent,
  };

  isInitialized = false;
  scriptsLoaded = false;
  gtmId = null;
  pixelId = null;

  // ── Singleton guard ──────────────────────────────────────────
  constructor() {
    if (AnalyticsWrapper.instance) {
      throw new Error(
        "Use Analytics (default export) — do NOT call new AnalyticsWrapper()",
      );
    }
  }

  static getInstance() {
    if (!AnalyticsWrapper.instance) {
      AnalyticsWrapper.instance = new AnalyticsWrapper();
    }
    return AnalyticsWrapper.instance;
  }

  // ── Environment check
  isProduction() {
    const hostname = window.location.hostname;
    return hostname !== "localhost" && hostname !== "127.0.0.1";
  }

  // ── Dynamically inject tracking scripts (production only) ────
  loadTrackingScripts() {
    if (!this.isProduction()) {
      console.log("[Analytics] Skipped — not in production");
      return Promise.resolve();
    }

    if (this.scriptsLoaded) return Promise.resolve();

    return new Promise((resolve) => {
      const gtmIdVal = "GTM-WMZR9JNW";
      const pixelIdVal = import.meta.env.VITE_PIXEL_ID || "4021930454788333";

      // ── Google Tag Manager <script> ──────────────────────────
      const gtmScript = document.createElement("script");
      gtmScript.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmIdVal}');
      `;
      document.head.appendChild(gtmScript);

      // ── GTM <noscript> fallback ──────────────────────────────
      const gtmNoscript = document.createElement("noscript");
      gtmNoscript.innerHTML = `
        <iframe src="https://www.googletagmanager.com/ns.html?id=${gtmIdVal}"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
      `;
      if (document.body.firstChild) {
        document.body.insertBefore(gtmNoscript, document.body.firstChild);
      } else {
        document.body.appendChild(gtmNoscript);
      }

      // ── Meta Pixel <script> ──────────────────────────────────
      const pixelScript = document.createElement("script");
      pixelScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelIdVal}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(pixelScript);

      // ── Meta Pixel <noscript> fallback ──────────────────────
      const pixelNoscript = document.createElement("noscript");
      pixelNoscript.innerHTML = `
        <img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=${pixelIdVal}&ev=PageView&noscript=1"/>
      `;
      document.body.appendChild(pixelNoscript);

      this.scriptsLoaded = true;

      // Give scripts a moment to bootstrap before resolving
      setTimeout(resolve, 150);
    });
  }

  safeTrack(trackerName, ...args) {
    if (typeof window[trackerName] === "function") {
      window[trackerName](...args);
    } else if (trackerName === "gtag" && window.dataLayer) {
      window.dataLayer.push({ event: args[1], ...args[2] });
    }
  }

  async initialize() {
    if (this.isInitialized) {
      console.warn("[Analytics] Already initialized.");
      return;
    }

    await this.loadTrackingScripts();

    this.gtmId = import.meta.env.VITE_GTM_ID || "GTM-WMZR9JNW";
    this.pixelId = import.meta.env.VITE_PIXEL_ID || "4021930454788333";
    this.isInitialized = true;

    console.log(
      `[Analytics] Initialized → GTM(${this.gtmId}) | Pixel(${this.pixelId})`,
    );
  }

  track(eventName, data = {}) {
    if (!this.isInitialized) {
      console.warn("[Analytics] Not initialized. Event skipped:", eventName);
      return;
    }

    // Validate against whitelist
    const allowedEventValues = Object.values(this.ALLOWED_EVENTS);
    if (!allowedEventValues.includes(eventName)) {
      console.error(
        `[Analytics] Invalid event "${eventName}". Allowed: ${allowedEventValues.join(", ")}`,
      );
      return;
    }

    // Build full payload
    const payload = {
      ...this.defaultParams,
      page_path: window.location.pathname,
      ...data,
    };

    // Purchase field normalization
    if (eventName === this.ALLOWED_EVENTS.PURCHASE) {
      if (payload.amount && !payload.value) payload.value = payload.amount;
      if (!payload.currency) payload.currency = "GBP";
      if (payload.vehicle && !payload.content_name)
        payload.content_name = payload.vehicle;
      if (payload.orderId && !payload.transaction_id)
        payload.transaction_id = payload.orderId;
    }

    // Inquiry normalization
    if (eventName === this.ALLOWED_EVENTS.INQUIRY_GENERATED) {
      if (payload.amount && !payload.value) payload.value = payload.amount;
      if (!payload.currency) payload.currency = "GBP";
    }

    // Push to GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({ event: eventName, ...payload });
    }

    // Also fire via gtag if available
    this.safeTrack("gtag", "event", eventName, payload);

    // Meta Pixel event mapping (production only)
    if (this.isProduction()) {
      switch (eventName) {
        case this.ALLOWED_EVENTS.PURCHASE:
          this.safeTrack("fbq", "track", "Purchase", {
            value: payload.value,
            currency: payload.currency || "GBP",
            content_name: payload.content_name || payload.vehicle,
          });
          break;

        case this.ALLOWED_EVENTS.INQUIRY_GENERATED:
          this.safeTrack("fbq", "track", "Lead", {
            value: payload.amount,
            currency: "GBP",
          });
          break;

        case this.ALLOWED_EVENTS.BOOK_NOW_BUTTON_CLICK:
          this.safeTrack("fbq", "track", "BookNowClick", {
            content_name: payload.button_name || "book_now",
          });
          break;

        case this.ALLOWED_EVENTS.GET_PRICE_BUTTON_CLICK:
          this.safeTrack("fbq", "track", "GetPriceClick", {
            source: payload.source,
          });
          break;

        case this.ALLOWED_EVENTS.CALL_BUTTON_CLICK:
          this.safeTrack("fbq", "track", "CallClick", {
            call_source: payload.call_source,
          });
          break;

        case this.ALLOWED_EVENTS.LOGIN_BUTTON_CLICK:
          this.safeTrack("fbq", "track", "LoginClick", {});
          break;

        case this.ALLOWED_EVENTS.PAYMENT_FAILURE:
          this.safeTrack("fbq", "track", "PaymentFailure", {
            reason: payload.error_description,
          });
          break;

        default:
          break;
      }
    }

    // Always log in dev for debugging
    if (!this.isProduction()) {
      console.log(`[Analytics] Event fired: ${eventName}`, payload);
    }
  }

  /** Book Now / Get a Quote button clicked anywhere on the site */
  trackBookingClick(buttonName, extra = {}) {
    this.track(this.ALLOWED_EVENTS.BOOK_NOW_BUTTON_CLICK, {
      button_name: buttonName,
      ...extra,
    });
  }

  /** Call / Speak to Us button clicked */
  trackCallClick(source, extra = {}) {
    this.track(this.ALLOWED_EVENTS.CALL_BUTTON_CLICK, {
      call_source: source,
      ...extra,
    });
  }

  /** Login button clicked */
  trackLoginClick(extra = {}) {
    this.track(this.ALLOWED_EVENTS.LOGIN_BUTTON_CLICK, extra);
  }

  trackGetPrice(extra = {}) {
    this.track(this.ALLOWED_EVENTS.GET_PRICE_BUTTON_CLICK, {
      source: "booking_step",
      ...extra,
    });
  }

  trackInquiryGenerated(bookingData = {}) {
    this.track(this.ALLOWED_EVENTS.INQUIRY_GENERATED, {
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
    this.track(this.ALLOWED_EVENTS.PURCHASE, {
      transaction_id: paymentIntent?.id,
      amount: bookingData.selectedVehicle?.pricing?.totalPrice,
      value: bookingData.selectedVehicle?.pricing?.totalPrice,
      currency: "GBP",
      vehicle: bookingData.selectedVehicle?.categoryName,
      content_name: bookingData.selectedVehicle?.categoryName,
      service_type: bookingData.serviceType,
      payment_method: "stripe",
    });
  }

  /**
   * Payment failed, cancelled, or user abandoned the payment step
   * @param {string} reason - e.g. "card_declined", "payment_page_abandoned"
   * @param {object} extra  - stripe error code, amount, vehicle, etc.
   */
  trackPaymentFailure(reason, extra = {}) {
    this.track(this.ALLOWED_EVENTS.PAYMENT_FAILURE, {
      error_description: reason,
      currency: "GBP",
      ...extra,
    });
  }

  /** Track a page view — called on every route change */
  trackPageView(path, extra = {}) {
    this.track(this.ALLOWED_EVENTS.PAGE_VIEW, {
      page_path: path || window.location.pathname,
      page_title: document.title,
      page_location: window.location.href,
      ...extra,
    });
  }
}

// Export the singleton
const Analytics = AnalyticsWrapper.getInstance();
export default Analytics;
