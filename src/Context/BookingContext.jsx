import React, { createContext, useContext, useState, useCallback } from "react";

const BookingContext = createContext(null);

// Compute default pickup time: GMT now + 30 min, rounded UP to next 30-min slot
const getDefaultPickupTime = () => {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const ukH = parseInt(parts.find((p) => p.type === "hour").value, 10);
  const ukM = parseInt(parts.find((p) => p.type === "minute").value, 10);

  const totalMinutes = ukH * 60 + ukM + 30;
  const roundedMinutes = Math.ceil(totalMinutes / 30) * 30;
  const hour24 = Math.floor(roundedMinutes / 60) % 24;
  const min = roundedMinutes % 60;

  const hour12 = (hour24 % 12 || 12).toString().padStart(2, "0");
  const minStr = min.toString().padStart(2, "0");
  const ampm = hour24 >= 12 ? "PM" : "AM";

  return `${hour12}:${minStr} ${ampm}`;
};

const defaultBookingData = {
  pickup: null,
  dropoff: null,
  pickupDate: new Date(),
  pickupTime: getDefaultPickupTime(),
  serviceType: "oneway",
  hours: 2,
  selectedVehicle: null,
  journeyInfo: null,
  passengerDetails: null,
  flightDetails: null,
  specialInstructions: "",
  savedBookingId: null,
  originalEmail: null,
};

export function BookingProvider({ children }) {
  const [bookingData, setBookingData] = useState(defaultBookingData);
  const [isFromHero, setIsFromHero] = useState(false);

  const updateBooking = useCallback((field, value) => {
    setBookingData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingData(defaultBookingData);
    setIsFromHero(false);
  }, []);

  const markAsFromHero = useCallback(() => {
    setIsFromHero(true);
  }, []);

  const hasValidLocations = useCallback(() => {
    return !!(bookingData.pickup && (bookingData.serviceType === "hourly" || bookingData.dropoff));
  }, [bookingData.pickup, bookingData.dropoff, bookingData.serviceType]);

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBooking,
        resetBooking,
        isFromHero,
        markAsFromHero,
        hasValidLocations,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
