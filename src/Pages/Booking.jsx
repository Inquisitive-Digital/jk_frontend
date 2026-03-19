import React, { useState, useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useBooking } from "../Context/BookingContext";
import Locations from "../Components/booking/Locations";
import CarsSelection from "../Components/booking/CarsSelection";
import UserDetails from "../Components/booking/UserDetails";
import Payment from "../Components/booking/Payment";
import StickyBookingSummary from "../Components/booking/StickyBookingSummary";
import { paymentAPI, bookingAPI } from "../Utils/api";
import Analytics from "../Utils/analytics";

const LIBRARIES = ["places"];

// Compute default pickup time: GMT now + 30 min, rounded UP to next 30-min slot
// Returns a 12-hour formatted string like "02:00 PM"
const getDefaultPickupTime = () => {
  const now = new Date();
  // Use Intl.DateTimeFormat to get reliable UK/GMT time parts
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const ukH = parseInt(parts.find((p) => p.type === "hour").value, 10);
  const ukM = parseInt(parts.find((p) => p.type === "minute").value, 10);

  // Add 30 min, round UP to next 30-min boundary
  const totalMinutes = ukH * 60 + ukM + 30;
  const roundedMinutes = Math.ceil(totalMinutes / 30) * 30;
  const hour24 = Math.floor(roundedMinutes / 60) % 24;
  const min = roundedMinutes % 60;

  // Convert to 12-hour format
  const hour12 = (hour24 % 12 || 12).toString().padStart(2, "0");
  const minStr = min.toString().padStart(2, "0");
  const ampm = hour24 >= 12 ? "PM" : "AM";

  return `${hour12}:${minStr} ${ampm}`;
};

// Step configurations - 4 steps including payment
const STEPS = [
  { id: 1, label: "Locations", description: "Where would you like to go?" },
  { id: 2, label: "Cars", description: "Choose your vehicle" },
  { id: 3, label: "Details", description: "Tell us about yourself" },
  { id: 4, label: "Payment", description: "Complete your booking" },
];

function Booking() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const location = useLocation();
  const { bookingData, updateBooking, resetBooking, isFromHero, hasValidLocations } = useBooking();
  
  // Use context data as source of truth, initialize from context
  const [currentStep, setCurrentStep] = useState(() => {
    // If coming from hero with valid locations, start at step 2
    if (location.state?.startStep === 2 && hasValidLocations()) {
      return 2;
    }
    return 1;
  });
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  const goToStep = (step) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildBookingPayload = (formData = null) => {
    const isHourly = bookingData.serviceType === "hourly";

    const passengerDetails = formData?.passengerDetails || bookingData.passengerDetails;
    const flightDetails = formData?.flightDetails || bookingData.flightDetails;
    const specialInstructions = formData?.specialInstructions ?? bookingData.specialInstructions;

    return {
      pickup: {
        address: bookingData.pickup,
      },
      dropoff: {
        address: isHourly ? bookingData.pickup : bookingData.dropoff,
      },
      pickupDate: bookingData.pickupDate,
      pickupTime: bookingData.pickupTime,
      serviceType: bookingData.serviceType,
      journeyInfo: {
        ...bookingData.journeyInfo,
        hours: isHourly ? (bookingData.hours || 2) : undefined,
      },
      vehicleId: bookingData.selectedVehicle?._id,
      vehicleDetails: {
        categoryName: bookingData.selectedVehicle?.categoryName,
        categoryDetails: bookingData.selectedVehicle?.categoryDetails,
        numberOfPassengers: bookingData.selectedVehicle?.numberOfPassengers,
        numberOfBigLuggage: bookingData.selectedVehicle?.numberOfBigLuggage,
      },
      pricing: bookingData.selectedVehicle?.pricing,
      passengerDetails: passengerDetails,
      isBookingForSomeoneElse: passengerDetails?.isBookingForSomeoneElse || false,
      guestDetails: passengerDetails?.isBookingForSomeoneElse
        ? {
          firstName: passengerDetails?.guestFirstName,
          lastName: passengerDetails?.guestLastName,
          email: passengerDetails?.guestEmail,
          countryCode: passengerDetails?.guestCountryCode,
          phone: passengerDetails?.guestPhone,
        }
        : null,
      isAirportPickup: flightDetails?.isAirportPickup || false,
      flightDetails: flightDetails?.isAirportPickup
        ? {
          flightNumber: flightDetails?.flightNumber,
          nameBoard: flightDetails?.nameBoard,
        }
        : null,
      specialInstructions: specialInstructions,
    };
  };

  // Handle UserDetails form submission - CREATE LEAD + CREATE PAYMENT INTENT + GO TO PAYMENT
  const handleUserDetailsSubmit = async (formData = null) => {
    const existingBookingId = bookingData.savedBookingId;
    const currentPassengerDetails = formData?.passengerDetails || bookingData.passengerDetails;

    // If booking already exists (re-submit from edit)
    if (existingBookingId) {
      const currentEmail = currentPassengerDetails?.email;
      const originalEmail = bookingData.originalEmail;

      // Update booking if email changed
      if (currentEmail !== originalEmail) {
        setIsLoadingPayment(true);
        try {
          await bookingAPI.updateBookingDetails(existingBookingId, {
            ...buildBookingPayload(formData),
            originalEmail: originalEmail,
          });
          updateBooking("originalEmail", currentEmail);
          console.log("Booking updated with new email:", currentEmail);
        } catch (error) {
          console.error("Error updating booking:", error);
        } finally {
          setIsLoadingPayment(false);
        }
      }

      // Create payment intent and go to payment
      await createPaymentIntentAndProceed();
      return;
    }

    // NEW LEAD - Create booking + Create payment intent + Go to payment
    setIsLoadingPayment(true);
    try {
      // Step 1: Create booking
      const bookingPayload = {
        ...buildBookingPayload(formData),
        paymentStatus: "pending",
        status: "pending",
      };

      console.log("Creating booking with payload:", bookingPayload);
      const bookingResponse = await bookingAPI.createBooking(bookingPayload);

      if (!bookingResponse.success) {
        throw new Error("Failed to save booking");
      }

      const savedBookingId = bookingResponse.data._id;
      const originalEmail = currentPassengerDetails?.email;

      updateBooking("savedBookingId", savedBookingId);
      updateBooking("originalEmail", originalEmail);

      console.log("Lead saved with ID:", savedBookingId);

      // Step 2: Create payment intent and proceed
      await createPaymentIntentAndProceed(savedBookingId);
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Helper function to create payment intent and navigate to payment step
  const createPaymentIntentAndProceed = async (bookingId = null) => {
    const totalAmount = bookingData.selectedVehicle?.pricing?.totalPrice;
    const savedBookingId = bookingId || bookingData.savedBookingId;

    if (!totalAmount) {
      alert("Invalid booking amount");
      return;
    }

    if (!savedBookingId) {
      alert("Booking not found. Please try again.");
      return;
    }

    try {
      const response = await paymentAPI.createPaymentIntent({
        amount: totalAmount,
        currency: "gbp",
        bookingData: bookingData,
        bookingId: savedBookingId,
      });

      if (response.success) {
        setClientSecret(response.clientSecret);
        setIsTestMode(response.isTestMode || false);
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    // 🔥 TRACK: Purchase — Stripe confirmed payment succeeded
    Analytics.trackPurchase(paymentIntent, bookingData);

    try {
      const bookingId = bookingData.savedBookingId;

      if (bookingId) {
        await bookingAPI.updateBookingStatus(bookingId, {
          paymentStatus: "paid",
          paymentIntentId: paymentIntent.id,
        });
        console.log("Booking confirmed! Confirmation emails sent.");
      } else {
        console.error("No booking ID found to update");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-dark)' }}>
        <div className="relative">
          <div className="w-16 h-16 border-4 rounded-full animate-pulse" style={{ borderColor: 'rgba(215,183,94,0.2)' }}></div>
          <div className="absolute inset-0 w-16 h-16 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: 'var(--color-primary)', borderTopColor: 'transparent' }}></div>
        </div>
        <p className="mt-6 font-medium tracking-widest uppercase text-sm" style={{ color: 'var(--color-primary)' }}>
          Loading Booking Engine...
        </p>
      </div>
    );
  }

  const currentStepConfig = STEPS.find((s) => s.id === currentStep);

  const stickyVehicle = bookingData.selectedVehicle
    ? {
      name: bookingData.selectedVehicle.categoryName,
      price: bookingData.selectedVehicle.pricing?.totalPrice,
      class: bookingData.selectedVehicle.categoryDetails,
      pax: bookingData.selectedVehicle.numberOfPassengers,
      luggage: bookingData.selectedVehicle.numberOfBigLuggage,
    }
    : null;

  const stickyPassengerName = [
    bookingData.passengerDetails?.firstName,
    bookingData.passengerDetails?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen font-sans pb-20 lg:pb-0" style={{ backgroundColor: 'var(--color-dark)', color: '#fff' }}>

      {/* --- STEPS INDICATOR --- */}
      <div className="pt-32 md:pt-36 pb-6" style={{ backgroundColor: 'var(--color-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center space-x-1 lg:space-x-4 text-sm justify-center">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div
                    className="w-8 lg:w-16 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      background: currentStep >= step.id
                        ? 'linear-gradient(to right, var(--color-primary), var(--color-primary))'
                        : 'rgba(255,255,255,0.15)'
                    }}
                  ></div>
                )}
                <div
                  className={`flex items-center gap-1 lg:gap-2 transition-all duration-300 ${currentStep >= step.id ? "font-semibold" : ""}`}
                  style={{ color: currentStep >= step.id ? '#fff' : 'rgba(255,255,255,0.35)' }}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full text-sm font-bold border-2 transition-all duration-300"
                    style={
                      currentStep > step.id
                        ? {
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-dark)',
                          borderColor: 'var(--color-primary)',
                          boxShadow: '0 4px 14px rgba(215,183,94,0.3)'
                        }
                        : currentStep === step.id
                          ? {
                            backgroundColor: 'rgba(215,183,94,0.15)',
                            color: 'var(--color-primary)',
                            borderColor: 'var(--color-primary)',
                            boxShadow: '0 4px 14px rgba(215,183,94,0.2)'
                          }
                          : {
                            backgroundColor: 'transparent',
                            borderColor: 'rgba(255,255,255,0.15)',
                            color: 'rgba(255,255,255,0.35)'
                          }
                    }
                  >
                    {currentStep > step.id ? "✓" : step.id}
                  </span>
                  <span className="hidden lg:inline uppercase text-xs tracking-wide">
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* --- TWO-COLUMN LAYOUT --- */}
      <div className="max-w-7xl mx-auto mt-0 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">

          {/* LEFT: Main content */}
          <div className={`w-full min-w-0 ${currentStep === 4 || currentStep === 1 ? "" : "lg:w-[60%]"} ${currentStep === 2 || currentStep === 3 ? "lg:pb-0 pb-24" : ""}`}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Locations
                    data={bookingData}
                    updateData={updateBooking}
                    onNext={() => goToStep(2)}
                  />
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CarsSelection
                    data={bookingData}
                    updateData={updateBooking}
                    onNext={() => goToStep(3)}
                    onBack={() => goToStep(1)}
                  />
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserDetails
                    data={bookingData}
                    updateData={updateBooking}
                    onNext={handleUserDetailsSubmit}
                    onBack={() => goToStep(2)}
                    isLoading={isLoadingPayment}
                  />
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Payment
                    data={bookingData}
                    clientSecret={clientSecret}
                    onBack={() => goToStep(3)}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentFailure={(reason, extra) =>
                      Analytics.trackPaymentFailure(reason, {
                        amount: bookingData.selectedVehicle?.pricing?.totalPrice,
                        vehicle: bookingData.selectedVehicle?.categoryName,
                        ...extra,
                      })
                    }
                    onComplete={() => {
                      resetBooking();
                      setClientSecret(null);
                      setCurrentStep(1);
                    }}
                    isLoadingIntent={isLoadingPayment}
                    isTestMode={isTestMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Sticky summary — hidden on Step 1 and payment step */}
          {currentStep !== 1 && currentStep !== 4 && (
            <div className="hidden lg:block lg:w-[40%]">
              <div className="sticky top-32">
                <StickyBookingSummary
                  from={bookingData.pickup}
                  to={bookingData.dropoff}
                  date={bookingData.pickupDate}
                  time={bookingData.pickupTime}
                  vehicle={stickyVehicle}
                  passengerName={stickyPassengerName || null}
                  extras={[]}
                  currentStep={currentStep}
                  onGoBack={() => goToStep(currentStep - 1)}
                  onContinue={() => goToStep(currentStep + 1)}
                  continueLabel={currentStep === 3 ? "PROCEED TO PAYMENT" : "CONTINUE"}
                  distance={bookingData.journeyInfo?.distanceMiles ? `${bookingData.journeyInfo.distanceMiles.toFixed(1)} mi` : null}
                  hours={bookingData.hours}
                  serviceType={bookingData.serviceType}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Booking;
