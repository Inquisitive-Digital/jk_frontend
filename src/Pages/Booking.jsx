import React, { useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";
import Locations from "../Components/booking/Locations";
import CarsSelection from "../Components/booking/CarsSelection";
import UserDetails from "../Components/booking/UserDetails";
import BookingSummary from "../Components/booking/BookingSummary";
import Payment from "../Components/booking/Payment";
import StickyBookingSummary from "../Components/booking/StickyBookingSummary";
import { paymentAPI, bookingAPI } from "../Utils/api";

const LIBRARIES = ["places"];

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

  const [currentStep, setCurrentStep] = useState(1);
  const [showSummary, setShowSummary] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickup: null,
    dropoff: null,
    pickupDate: new Date(),
    pickupTime: "12:00 PM",
    serviceType: "oneway",
    hours: 2, // Default hours for hourly bookings
    selectedVehicle: null,
    journeyInfo: null,
    passengerDetails: null,
    flightDetails: null,
    specialInstructions: "",
    savedBookingId: null, // Track saved booking ID
    originalEmail: null, // Track original email for change detection
  });

  const updateBooking = (field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step) => {
    setShowSummary(false);
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build booking payload (shared between create and update)
  // Accepts optional formData to use instead of bookingData state (for avoiding race conditions)
  const buildBookingPayload = (formData = null) => {
    const isHourly = bookingData.serviceType === "hourly";

    // Use formData if provided, otherwise fall back to state
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

  // Handle UserDetails form submission - CREATE LEAD and show summary
  // formData is passed directly from UserDetails to avoid race condition with state updates
  const handleUserDetailsSubmit = async (formData = null) => {
    const existingBookingId = bookingData.savedBookingId;

    // Get the current email from formData or fall back to state
    const currentPassengerDetails = formData?.passengerDetails || bookingData.passengerDetails;

    // If booking already exists, this is a re-submit from edit
    // Just go to summary without creating a new booking
    if (existingBookingId) {
      // Check if email changed and update if needed
      const currentEmail = currentPassengerDetails?.email;
      const originalEmail = bookingData.originalEmail;

      if (currentEmail !== originalEmail) {
        // Email changed - update booking and send welcome email to new address
        setIsLoadingLead(true);
        try {
          await bookingAPI.updateBookingDetails(existingBookingId, {
            ...buildBookingPayload(formData),
            originalEmail: originalEmail, // Send original email for comparison
          });
          // Update original email to current
          updateBooking("originalEmail", currentEmail);
          console.log("Booking updated with new email, welcome email sent to:", currentEmail);
        } catch (error) {
          console.error("Error updating booking:", error);
        } finally {
          setIsLoadingLead(false);
        }
      }

      setShowSummary(true);
      return;
    }

    // NEW LEAD - Create booking in database
    setIsLoadingLead(true);
    try {
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

      // Store booking ID and original email for later
      const savedBookingId = bookingResponse.data._id;
      const originalEmail = currentPassengerDetails?.email;

      updateBooking("savedBookingId", savedBookingId);
      updateBooking("originalEmail", originalEmail);

      console.log("Lead saved with ID:", savedBookingId);
      console.log("Welcome emails sent to user and admin notification sent!");

      setShowSummary(true);
    } catch (error) {
      console.error("Error creating lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoadingLead(false);
    }
  };

  // Handle edit from summary - go back to step 3
  const handleEditFromSummary = () => {
    setShowSummary(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle proceed to payment - CREATE PAYMENT INTENT (booking already exists)
  const handleProceedToPayment = async () => {
    const totalAmount = bookingData.selectedVehicle?.pricing?.totalPrice;
    const savedBookingId = bookingData.savedBookingId;

    if (!totalAmount) {
      alert("Invalid booking amount");
      return;
    }

    if (!savedBookingId) {
      alert("Booking not found. Please try again.");
      return;
    }

    setIsLoadingPayment(true);

    try {
      // Create payment intent (booking already saved in handleUserDetailsSubmit)
      const response = await paymentAPI.createPaymentIntent({
        amount: totalAmount,
        currency: "gbp",
        bookingData: bookingData,
        bookingId: savedBookingId,
      });

      if (response.success) {
        setClientSecret(response.clientSecret);
        setIsTestMode(response.isTestMode || false);
        setShowSummary(false);
        setCurrentStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Failed to initialize payment. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  // Handle payment success - UPDATE existing booking (triggers confirmation emails)
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const bookingId = bookingData.savedBookingId;

      if (bookingId) {
        // Update the existing booking with paid status
        // This triggers confirmation emails on the backend
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

  // Loading state
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
  const displayStep = showSummary ? 3 : currentStep;

  // Build vehicle prop for StickyBookingSummary
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
    <div className="min-h-screen font-sans pb-20" style={{ backgroundColor: 'var(--color-dark)', color: '#fff' }}>

      {/* --- STEPS INDICATOR --- */}
      <div className="pt-32 md:pt-36 pb-6" style={{ backgroundColor: 'var(--color-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Stepper — always centered */}
          <div className="flex items-center space-x-1 lg:space-x-4 text-sm justify-center">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.id}>
                {index > 0 && (
                  <div
                    className="w-8 lg:w-16 h-0.5 rounded-full transition-all duration-500"
                    style={{
                      background: displayStep >= step.id
                        ? 'linear-gradient(to right, var(--color-primary), var(--color-primary))'
                        : 'rgba(255,255,255,0.15)'
                    }}
                  ></div>
                )}
                <div
                  className={`flex items-center gap-1 lg:gap-2 transition-all duration-300 ${displayStep >= step.id ? "font-semibold" : ""}`}
                  style={{ color: displayStep >= step.id ? '#fff' : 'rgba(255,255,255,0.35)' }}
                >
                  <span
                    className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full text-sm font-bold border-2 transition-all duration-300"
                    style={
                      displayStep > step.id
                        ? {
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-dark)',
                          borderColor: 'var(--color-primary)',
                          boxShadow: '0 4px 14px rgba(215,183,94,0.3)'
                        }
                        : displayStep === step.id
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
                    {displayStep > step.id ? "✓" : step.id}
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

      {/* --- TWO-COLUMN LAYOUT (desktop) / SINGLE-COLUMN (mobile) --- */}
      <div className="max-w-7xl mx-auto mt-0 px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">

          {/* LEFT: Main content — full width on mobile, 60% on desktop (full width on Step 1, review, and payment) */}
          <div className={`w-full min-w-0 ${showSummary || currentStep === 4 || currentStep === 1 ? "" : "lg:w-[60%]"
            }`}>
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

              {currentStep === 3 && !showSummary && (
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
                    isLoading={isLoadingLead}
                  />
                </motion.div>
              )}

              {currentStep === 3 && showSummary && (
                <motion.div
                  key="step-3-summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookingSummary
                    data={bookingData}
                    onEdit={handleEditFromSummary}
                    onProceed={handleProceedToPayment}
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
                    onBack={() => {
                      setShowSummary(true);
                      setCurrentStep(3);
                    }}
                    onPaymentSuccess={handlePaymentSuccess}
                    onComplete={() => {
                      setBookingData({
                        pickup: null,
                        dropoff: null,
                        pickupDate: new Date(),
                        pickupTime: "12:00 PM",
                        serviceType: "oneway",
                        hours: 2,
                        selectedVehicle: null,
                        journeyInfo: null,
                        passengerDetails: null,
                        flightDetails: null,
                        specialInstructions: "",
                        savedBookingId: null,
                        originalEmail: null,
                      });
                      setClientSecret(null);
                      setShowSummary(false);
                      setCurrentStep(1);
                    }}
                    isLoadingIntent={isLoadingPayment}
                    isTestMode={isTestMode}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT: Sticky summary — hidden on mobile/tablet, Step 1, review step, and payment step */}
          {!showSummary && currentStep !== 1 && currentStep !== 4 && (
            <div className="hidden lg:block lg:w-[40%]">
              <div className="sticky top-32">
                <StickyBookingSummary
                  from={bookingData.pickup}
                  to={bookingData.serviceType === "hourly" ? bookingData.pickup : bookingData.dropoff}
                  date={bookingData.pickupDate}
                  time={bookingData.pickupTime}
                  vehicle={stickyVehicle}
                  passengerName={stickyPassengerName || null}
                  extras={[]}
                  currentStep={currentStep}
                  onGoBack={() => goToStep(currentStep - 1)}
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
