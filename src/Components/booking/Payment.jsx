import { useState, useEffect, useMemo } from "react";
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
  CreditCard,
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
} from "lucide-react";


// Test mode origins - must match server configuration
const TEST_MODE_ORIGINS = [
  "http://localhost",
  "http://127.0.0.1",
  "https://localhost",
  "https://127.0.0.1",
  "http://localhost:5000",
  "https://jk-frontend-nine.vercel.app",
  "https://jk-backend-aj.vercel.app"
];

// Check if current origin should use test mode
const isTestModeOrigin = () => {
  const origin = window.location.origin;
  return TEST_MODE_ORIGINS.some(testOrigin =>
    origin.startsWith(testOrigin)
  );
};

// Get the appropriate Stripe public key based on environment
const getStripePublicKey = () => {
  const isTestMode = isTestModeOrigin();
  return isTestMode
    ? import.meta.env.VITE_STRIPE_PUBLIC_TEST_KEY
    : import.meta.env.VITE_STRIPE_PUBLIC_LIVE_KEY;
};

// Initialize Stripe with the appropriate key
const stripePromise = loadStripe(getStripePublicKey());

// Test Mode Banner Component
const TestModeBanner = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-4 rounded-xl mb-6"
    style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}
  >
    <div className="p-2 rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
      <TestTube2 size={20} style={{ color: '#f59e0b' }} />
    </div>
    <div>
      <p className="font-semibold text-sm" style={{ color: '#f59e0b' }}>TEST MODE</p>
      <p className="text-sm" style={{ color: 'rgba(245,158,11,0.8)' }}>
        This is a test payment. Your card will <strong>NOT</strong> be charged.
      </p>
    </div>
  </motion.div>
);

// Payment Form Component (inside Elements provider)
const PaymentForm = ({ onSuccess, onError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

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
      <PaymentElement
        options={{
          layout: "tabs",
        }}
      />

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
          <AlertCircle size={18} />
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl
          font-semibold shadow-lg transition-all duration-200  disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)' }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock size={20} />
            Pay £{amount?.toFixed(2)} Securely
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <Shield size={16} />
        <span>Secured by Stripe. Your payment info is encrypted.</span>
      </div>
    </form>
  );
};

// Success Modal Component
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
        style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(215,183,94,0.2)' }}
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--color-primary), #c9a84c)', boxShadow: '0 8px 30px rgba(215,183,94,0.3)' }}
        >
          <CheckCircle size={50} style={{ color: 'var(--color-dark)' }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-3"
        >
          🎉 Booking Confirmed!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg mb-2"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          Your payment was successful.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          A confirmation email with your booking details will be sent to you shortly. Thank you for choosing us!
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onClose}
          className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200
                        shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-dark)', boxShadow: '0 4px 14px rgba(215,183,94,0.3)' }}
        >
          Done
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm mt-4"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          ✈️ Have a safe journey!
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

// Main Payment Step Component
function Payment({ data, clientSecret, onBack, onPaymentSuccess, onComplete, isLoadingIntent, isTestMode }) {
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const showTestModeBanner = isTestMode ?? isTestModeOrigin();

  const handleSuccess = (paymentIntent) => {
    setPaymentStatus("success");
    onPaymentSuccess(paymentIntent);
    setShowSuccessModal(true);
  };

  const handleError = (error) => {
    console.error("Payment error:", error);
    setPaymentStatus("error");
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    if (onComplete) {
      onComplete();
    }
  };

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
      '.Input': {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.1)',
        color: '#ffffff',
      },
      '.Input:focus': {
        borderColor: '#d7b75e',
        boxShadow: '0 0 0 2px rgba(215,183,94,0.2)',
      },
      '.Tab': {
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.6)',
      },
      '.Tab--selected': {
        backgroundColor: 'rgba(215,183,94,0.1)',
        borderColor: '#d7b75e',
        color: '#d7b75e',
      },
      '.Label': {
        color: 'rgba(255,255,255,0.7)',
      },
    },
  };

  const pricing = data.selectedVehicle?.pricing;
  const totalAmount = pricing?.totalPrice || 0;

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Success Modal */}
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />

      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-xl shadow-xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <CreditCard size={24} style={{ color: 'var(--color-primary)' }} />
                  Order Summary
                </h2>

                {/* Journey Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(215,183,94,0.1)' }}>
                      <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <p className="text-xs uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Pickup</p>
                      <p className="font-medium text-white text-sm">{data.pickup || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
                      <MapPin size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    </div>
                    <div>
                      <p className="text-xs uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>Dropoff</p>
                      <p className="font-medium text-white text-sm">{data.dropoff || "—"}</p>
                    </div>
                  </div>
                </div>

                {/* Date/Time & Vehicle */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    <Calendar size={16} className="mx-auto mb-1" style={{ color: 'var(--color-primary)' }} />
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Date</p>
                    <p className="font-semibold text-white text-sm">{formatDate(data.pickupDate)}</p>
                  </div>
                  <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                    <Clock size={16} className="mx-auto mb-1" style={{ color: 'var(--color-primary)' }} />
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Time</p>
                    <p className="font-semibold text-white text-sm">{data.pickupTime || "—"}</p>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-4 p-4 rounded-xl mb-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <Car size={24} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <p className="font-bold text-white">{data.selectedVehicle?.categoryName}</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{data.selectedVehicle?.categoryDetails}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <span>Base Fare</span>
                    <span className="text-white">£{pricing?.basePrice?.toFixed(2) || "0.00"}</span>
                  </div>
                  {pricing?.airportCharges > 0 && (
                    <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <span>Airport Charges</span>
                      <span className="text-white">£{pricing?.airportCharges?.toFixed(2)}</span>
                    </div>
                  )}
                  {pricing?.congestionCharge > 0 && (
                    <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <span>Congestion Charge</span>
                      <span className="text-white">£{pricing?.congestionCharge?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    <span>VAT ({pricing?.vatRate || 20}%)</span>
                    <span className="text-white">£{pricing?.tax?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="my-2" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }} />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total</span>
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>£{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Back Button */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 font-medium transition-colors"
                style={{ color: 'rgba(255,255,255,0.6)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                <ArrowLeft size={20} />
                Back to Summary
              </button>
            </motion.div>

            {/* Right: Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="rounded-xl shadow-xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Test Mode Banner - Only show when in test mode */}
                {showTestModeBanner && <TestModeBanner />}

                <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  <Lock size={24} style={{ color: 'var(--color-primary)' }} />
                  Secure Payment
                </h2>
                <p className="mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Enter your card details to complete the booking</p>

                {isLoadingIntent ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 size={40} className="animate-spin mb-4" style={{ color: 'var(--color-primary)' }} />
                    <p style={{ color: 'rgba(255,255,255,0.5)' }}>Initializing secure payment...</p>
                  </div>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance,
                    }}
                  >
                    <PaymentForm
                      onSuccess={handleSuccess}
                      onError={handleError}
                      amount={totalAmount}
                    />
                  </Elements>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16" style={{ color: '#ef4444' }}>
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