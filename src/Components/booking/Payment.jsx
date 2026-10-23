import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Calendar,
  Clock,
  Car,
  Shield,
  Lock,
  TestTube2,
  Mail,
  Phone,
  Users,
} from "lucide-react";
import { paymentAPI } from "../../Utils/api";

// Test mode origins — must match server configuration
const TEST_MODE_ORIGINS = [
  "http://localhost",
  "http://127.0.0.1",
  "https://localhost",
  "https://127.0.0.1",
  "http://localhost:5000",
  "https://jk-frontend-nine.vercel.app",
  "https://jk-backend-aj.vercel.app",
];

const isTestModeOrigin = () => {
  const origin = window.location.origin;
  return TEST_MODE_ORIGINS.some((o) => origin.startsWith(o));
};

const getStripePublicKey = () => {
  const isTestMode = isTestModeOrigin();
  return isTestMode
    ? import.meta.env.VITE_STRIPE_PUBLIC_TEST_KEY
    : import.meta.env.VITE_STRIPE_PUBLIC_LIVE_KEY;
};

const stripePromise = loadStripe(getStripePublicKey());

// ─── Currency Options (Base: GBP) ────────────────────────────────────────────
const CURRENCY_OPTIONS = [
  { code: "gbp", label: "GBP", name: "British Pound", flag: "🇬🇧" },
  { code: "usd", label: "USD", name: "US Dollar",     flag: "🇺🇸" },
  { code: "eur", label: "EUR", name: "Euro",           flag: "🇪🇺" },
  { code: "aed", label: "AED", name: "UAE Dirham",    flag: "🇦🇪" },
];

// ─── CurrencySelector ────────────────────────────────────────────────────────
const CurrencySelector = ({ selected, onChange, disabled, quotes = {} }) => (
  <div className="mb-6">
    <p
      className="text-sm font-semibold mb-3 uppercase tracking-wide"
      style={{ color: "rgba(255,255,255,0.55)" }}
    >
      Pay in
    </p>
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {CURRENCY_OPTIONS.map((opt) => {
        const isSelected = selected === opt.code;
        const quote = quotes[opt.code];
        return (
          <button
            key={opt.code}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(opt.code)}
            aria-pressed={isSelected}
            aria-label={`Pay in ${opt.name}`}
            className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isSelected
                ? "rgba(215,183,94,0.12)"
                : "rgba(255,255,255,0.04)",
              borderColor: isSelected ? "#d7b75e" : "rgba(255,255,255,0.1)",
              boxShadow: isSelected
                ? "0 0 0 1px rgba(215,183,94,0.25)"
                : "none",
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            <span className="text-xl" role="img" aria-label={opt.name}>
              {opt.flag}
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: isSelected ? "#d7b75e" : "#fff" }}
            >
              {opt.label}
            </span>
            {quote ? (
              <span
                className="text-xs font-semibold"
                style={{
                  color: isSelected ? "#d7b75e" : "rgba(255,255,255,0.75)",
                }}
              >
                {quote.approx || quote.formatted}
              </span>
            ) : (
              <span
                className="text-xs text-center leading-tight"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {opt.name}
              </span>
            )}
          </button>
        );
      })}
    </div>

    {selected !== "gbp" && (
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 flex items-start gap-2 p-3 rounded-xl text-sm"
        style={{
          backgroundColor: "rgba(215,183,94,0.07)",
          border: "1px solid rgba(215,183,94,0.2)",
        }}
      >
        <Shield
          size={15}
          className="mt-0.5 shrink-0"
          style={{ color: "#d7b75e" }}
        />
        <p style={{ color: "rgba(255,255,255,0.7)" }}>
          Charged directly in{" "}
          <strong style={{ color: "#d7b75e" }}>{selected.toUpperCase()}</strong>
          . No foreign currency conversion fees from your bank.
        </p>
      </motion.div>
    )}
  </div>
);

// ─── Test Mode Banner ────────────────────────────────────────────────────────
const TestModeBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-4 rounded-xl mb-6"
    style={{
      backgroundColor: "rgba(245,158,11,0.1)",
      border: "1px solid rgba(245,158,11,0.25)",
    }}
  >
    <div
      className="p-2 rounded-full"
      style={{ backgroundColor: "rgba(245,158,11,0.15)" }}
    >
      <TestTube2 size={20} style={{ color: "#f59e0b" }} />
    </div>
    <div>
      <p className="font-semibold text-sm" style={{ color: "#f59e0b" }}>
        TEST MODE
      </p>
      <p className="text-sm" style={{ color: "rgba(245,158,11,0.8)" }}>
        This is a test payment. Your card will <strong>NOT</strong> be charged.
      </p>
    </div>
  </motion.div>
);

// ─── Payment Form (inside Elements) ─────────────────────────────────────────
const PaymentForm = ({ onSuccess, onError, amount, symbol }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/booking/success",
        },
        redirect: "if_required",
      });

      if (error) {
        setErrorMessage(error.message);
        onError(error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
      onError(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement options={{ layout: "tabs" }} />

      {errorMessage && (
        <div
          className="flex items-center gap-2 p-3 rounded-xl text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#ef4444",
          }}
        >
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-dark)",
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock size={20} />
            Pay {symbol}&nbsp;{Number(amount).toFixed(2)} Securely
          </>
        )}
      </button>

      <div
        className="flex items-center justify-center gap-2 text-sm"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        <Shield size={16} />
        <span>Secured by Stripe. Your payment info is encrypted.</span>
      </div>
    </form>
  );
};

// ─── Success Modal ────────────────────────────────────────────────────────────
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
        style={{
          backgroundColor: "#1a1a1a",
          border: "1px solid rgba(215,183,94,0.2)",
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), #c9a84c)",
            boxShadow: "0 8px 30px rgba(215,183,94,0.3)",
          }}
        >
          <CheckCircle size={50} style={{ color: "var(--color-dark)" }} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-3"
        >
          Booking Confirmed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg mb-2"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          Your payment was successful.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          A confirmation email with your booking details will be sent shortly. Thank you for choosing us!
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            backgroundColor: "var(--color-primary)",
            color: "var(--color-dark)",
            boxShadow: "0 4px 14px rgba(215,183,94,0.3)",
          }}
        >
          Done
        </motion.button>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm mt-4"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Have a safe journey!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// ─── Stripe appearance ────────────────────────────────────────────────────────
const appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#d7b75e",
    colorBackground: "#1a1a1a",
    colorText: "#ffffff",
    colorDanger: "#ef4444",
    fontFamily: "Inter, system-ui, sans-serif",
    spacingUnit: "4px",
    borderRadius: "12px",
    colorTextSecondary: "rgba(255,255,255,0.6)",
    colorTextPlaceholder: "rgba(255,255,255,0.3)",
  },
  rules: {
    ".Input": {
      backgroundColor: "rgba(255,255,255,0.05)",
      borderColor: "rgba(255,255,255,0.1)",
      color: "#ffffff",
    },
    ".Input:focus": {
      borderColor: "#d7b75e",
      boxShadow: "0 0 0 2px rgba(215,183,94,0.2)",
    },
    ".Tab": {
      backgroundColor: "rgba(255,255,255,0.04)",
      borderColor: "rgba(255,255,255,0.1)",
      color: "rgba(255,255,255,0.6)",
    },
    ".Tab--selected": {
      backgroundColor: "rgba(215,183,94,0.1)",
      borderColor: "#d7b75e",
      color: "#d7b75e",
    },
    ".Label": { color: "rgba(255,255,255,0.7)" },
  },
};

// helper: format date display
const formatDate = (d) => {
  if (!d) return "—";
  try {
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d.trim())) {
      const [y, m, day] = d.trim().split("-").map(Number);
      return new Date(Date.UTC(y, m - 1, day, 12)).toLocaleDateString("en-GB", {
        timeZone: "UTC", weekday: "short", day: "numeric", month: "short", year: "numeric",
      });
    }
    const dt = new Date(d);
    return isNaN(dt.getTime())
      ? String(d)
      : dt.toLocaleDateString("en-GB", {
          weekday: "short", day: "numeric", month: "short", year: "numeric",
        });
  } catch {
    return String(d);
  }
};

// ─── Main Payment Step ───────────────────────────────────────────────────────
/**
 * Props:
 *  data                 – bookingData from context
 *  clientSecret         – Stripe client secret for the current PaymentIntent
 *  onBack               – callback to go back to step 3
 *  onPaymentSuccess     – callback after Stripe confirms payment
 *  onPaymentFailure     – callback to log/track failures
 *  onComplete           – callback after success modal is closed
 *  isLoadingIntent      – true while a new PaymentIntent is being created
 *  isTestMode           – override test-mode flag from backend
 *  presentmentCurrency  – currently selected currency code (e.g. "gbp")
 *  paymentCurrencyInfo  – { currency, amount, symbol } from latest PI response
 *  onCurrencyChange     – async (newCurrencyCode) => void — triggers PI recreation
 */
function Payment({
  data,
  clientSecret,
  onBack,
  onPaymentSuccess,
  onPaymentFailure,
  onComplete,
  isLoadingIntent,
  isTestMode,
  presentmentCurrency = "gbp",
  paymentCurrencyInfo,
  onCurrencyChange,
}) {
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [quotes, setQuotes] = useState({});
  const paymentCompletedRef = useRef(false);

  const showTestModeBanner = isTestMode ?? isTestModeOrigin();

  // Fetch live quotes for the currency selector badges
  const pricing          = data.selectedVehicle?.pricing;
  const numberOfChildren = data.passengerDetails?.numberOfChildren || 0;
  const childSeatPrice   = pricing?.additionalCharges?.childSeatPrice || 0;
  const childSeatCharge  = numberOfChildren * childSeatPrice;
  const gbpTotal         = (pricing?.totalPrice || 0) + childSeatCharge;

  useEffect(() => {
    if (gbpTotal <= 0) return;
    paymentAPI
      .getCurrencyQuotes(gbpTotal)
      .then((res) => res?.success && res?.quotes && setQuotes(res.quotes))
      .catch((err) => console.warn("Failed to fetch currency quotes:", err));
  }, [gbpTotal]);

  // Page-abandon tracking
  useEffect(() => {
    if (!clientSecret) return;
    const handleAbandon = () => {
      if (!paymentCompletedRef.current) {
        onPaymentFailure?.("payment_page_abandoned", { reason: "user_closed_or_hid_page" });
      }
    };
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") handleAbandon();
    };
    window.addEventListener("beforeunload", handleAbandon);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("beforeunload", handleAbandon);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [clientSecret, onPaymentFailure]);

  const handleSuccess = (paymentIntent) => {
    paymentCompletedRef.current = true;
    setPaymentStatus("success");
    onPaymentSuccess(paymentIntent);
    setShowSuccessModal(true);
  };

  const handleError = (error) => {
    console.error("Payment error:", error);
    setPaymentStatus("error");
    onPaymentFailure?.(error?.message || "stripe_error", {
      stripe_error_code: error?.code,
      stripe_error_type: error?.type,
    });
  };

  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency === presentmentCurrency) return;
    onCurrencyChange?.(newCurrency);
  };

  // Active display values
  const activeCurrency =
    paymentCurrencyInfo?.currency || presentmentCurrency || "gbp";
  const activeAmount =
    paymentCurrencyInfo?.currency === activeCurrency && paymentCurrencyInfo?.amount != null
      ? paymentCurrencyInfo.amount
      : activeCurrency === "gbp"
      ? gbpTotal
      : quotes[activeCurrency]?.amount || gbpTotal;
  const activeSymbol =
    paymentCurrencyInfo?.symbol ||
    (activeCurrency === "gbp"
      ? "£"
      : activeCurrency === "usd"
      ? "$"
      : activeCurrency === "eur"
      ? "€"
      : "AED");

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onComplete?.();
        }}
      />

      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8">

            {/* ── LEFT: Order Summary ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div
                className="rounded-xl shadow-xl p-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Car size={24} style={{ color: "var(--color-primary)" }} />
                  Order Summary
                </h2>

                {/* Pickup / Dropoff */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "rgba(215,183,94,0.1)" }}
                    >
                      <MapPin size={16} style={{ color: "var(--color-primary)" }} />
                    </div>
                    <div>
                      <p className="text-xs uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Pickup
                      </p>
                      <p className="font-medium text-white text-sm">{data.pickup || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    >
                      <MapPin size={16} style={{ color: "rgba(255,255,255,0.5)" }} />
                    </div>
                    <div>
                      <p className="text-xs uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                        Dropoff
                      </p>
                      <p className="font-medium text-white text-sm">{data.dropoff || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Passenger Details */}
                <div
                  className="space-y-3 mb-6 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <h3 className="text-sm font-semibold text-white uppercase mb-3">
                    Passenger Details
                  </h3>
                  {[
                    { icon: <Mail size={16} style={{ color: "var(--color-primary)" }} />, label: "Email", value: data.passengerDetails?.email },
                    {
                      icon: <Phone size={16} style={{ color: "var(--color-primary)" }} />,
                      label: "Phone",
                      value:
                        data.passengerDetails?.countryCode && data.passengerDetails?.phone
                          ? `${data.passengerDetails.countryCode} ${data.passengerDetails.phone}`
                          : null,
                    },
                    {
                      icon: <Users size={16} style={{ color: "var(--color-primary)" }} />,
                      label: "Passengers",
                      value: `${data.passengerDetails?.numberOfPassengers || 1} passengers, ${data.passengerDetails?.numberOfChildren || 0} children, ${data.passengerDetails?.numberOfSuitcases || 0} suitcases`,
                    },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                      >
                        {icon}
                      </div>
                      <div>
                        <p className="text-xs uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {label}
                        </p>
                        <p className="font-medium text-white text-sm">{value || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Date / Time */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div
                    className="p-3 rounded-xl text-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
                    <Calendar size={16} className="mx-auto mb-1" style={{ color: "var(--color-primary)" }} />
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Date</p>
                    <p className="font-semibold text-white text-sm">{formatDate(data.pickupDate)}</p>
                  </div>
                  <div
                    className="p-3 rounded-xl text-center"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
                    <Clock size={16} className="mx-auto mb-1" style={{ color: "var(--color-primary)" }} />
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Time</p>
                    <p className="font-semibold text-white text-sm">{data.pickupTime || "—"}</p>
                  </div>
                </div>

                {/* Vehicle */}
                <div
                  className="flex items-center gap-4 p-4 rounded-xl mb-6"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <Car size={24} style={{ color: "var(--color-primary)" }} />
                  <div>
                    <p className="font-bold text-white">{data.selectedVehicle?.categoryName}</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {data.selectedVehicle?.categoryDetails}
                    </p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div
                  className="pt-4 space-y-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span>Base Fare</span>
                    <span className="text-white">£{pricing?.basePrice?.toFixed(2) || "0.00"}</span>
                  </div>
                  {pricing?.airportCharges > 0 && (
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <span>Airport Charges</span>
                      <span className="text-white">£{pricing.airportCharges.toFixed(2)}</span>
                    </div>
                  )}
                  {pricing?.congestionCharge > 0 && (
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <span>Congestion Charge</span>
                      <span className="text-white">£{pricing.congestionCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {childSeatCharge > 0 && (
                    <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.6)" }}>
                      <span>Child Seats ({numberOfChildren} × £{childSeatPrice})</span>
                      <span className="text-white">£{childSeatCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span>VAT ({pricing?.vatRate || 20}%)</span>
                    <span className="text-white">£{pricing?.tax?.toFixed(2) || "0.00"}</span>
                  </div>

                  <div className="my-2" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

                  {/* Total — shows in active currency */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-white">Total</span>
                      {activeCurrency !== "gbp" && (
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          Converted from £{gbpTotal.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {activeSymbol}&nbsp;{Number(activeAmount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Details */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 font-medium transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
              >
                <ArrowLeft size={20} />
                Edit Details
              </button>
            </motion.div>

            {/* ── RIGHT: Stripe Payment Panel ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="rounded-xl shadow-xl p-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {showTestModeBanner && <TestModeBanner />}

                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Lock size={24} style={{ color: "var(--color-primary)" }} />
                  Secure Payment
                </h2>
                <p className="mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Enter your card details to complete the booking
                </p>

                {/* Currency selector */}
                <CurrencySelector
                  selected={activeCurrency}
                  onChange={handleCurrencyChange}
                  disabled={isLoadingIntent}
                  quotes={quotes}
                />

                {isLoadingIntent ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2
                      size={40}
                      className="animate-spin mb-4"
                      style={{ color: "var(--color-primary)" }}
                    />
                    <p style={{ color: "rgba(255,255,255,0.5)" }}>
                      {activeCurrency !== "gbp"
                        ? `Switching to ${activeCurrency.toUpperCase()}...`
                        : "Initializing secure payment..."}
                    </p>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance }}
                  >
                    <PaymentForm
                      onSuccess={handleSuccess}
                      onError={handleError}
                      amount={activeAmount}
                      symbol={activeSymbol}
                    />
                  </Elements>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-16"
                    style={{ color: "#ef4444" }}
                  >
                    <AlertCircle size={40} className="mb-4" />
                    <p>Failed to initialize payment. Please go back and try again.</p>
                  </div>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Payment;
