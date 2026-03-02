import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Car,
  Filter,
  Loader2,
  Star,
  Clock,
  MapPin,
} from "lucide-react";
import { useMemo, useState } from "react";
import { vehicleAPI } from "../../Utils/api";
import FilterBar from "./car-selection/FilterBar";
import VehicleCard from "./car-selection/VehicleCard";
import StepNavBar from "./StepNavBar";


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function CarsSelection({ data, updateData, onNext, onBack }) {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [passengerFilter, setPassengerFilter] = useState(1);
  const [luggageFilter, setLuggageFilter] = useState(1);

  // Prepare search data for API
  const searchData = useMemo(() => {
    const dropoffAddress = data.serviceType === "hourly" ? data.pickup : data.dropoff;
    return {
      pickupAddress: data.pickup || "",
      dropoffAddress: dropoffAddress || "",
      pickupDate:
        data.pickupDate instanceof Date
          ? data.pickupDate.toISOString().split("T")[0]
          : "",
      pickupTime: data.pickupTime || "12:00",
      bookingType: data.serviceType === "hourly" ? "hourly" : "p2p",
      hours: data.serviceType === "hourly" ? data.hours || 2 : undefined,
    };
  }, [data]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["vehicles", searchData],
    queryFn: () => vehicleAPI.searchVehiclesWithFare(searchData),
    enabled:
      data.serviceType === "hourly"
        ? !!data.pickup
        : !!(data.pickup && data.dropoff),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const vehicles = response?.data || [];
  const journeyInfo = response?.journey || {};

  const filteredVehicles = useMemo(
    () =>
      vehicles.map((v) => ({
        ...v,
        isDisabled:
          v.numberOfPassengers < passengerFilter ||
          v.numberOfBigLuggage < luggageFilter,
      })),
    [vehicles, passengerFilter, luggageFilter]
  );

  const sortedVehicles = useMemo(
    () =>
      [...filteredVehicles].sort((a, b) =>
        a.isDisabled === b.isDisabled ? 0 : a.isDisabled ? 1 : -1
      ),
    [filteredVehicles]
  );

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    updateData("selectedVehicle", vehicle);
  };

  const handleContinue = () => {
    if (selectedVehicle) {
      updateData("journeyInfo", journeyInfo);
      onNext();
    }
  };

  const maxPassengers = Math.max(...vehicles.map((v) => v.numberOfPassengers), 1);
  const maxLuggage = Math.max(...vehicles.map((v) => v.numberOfBigLuggage), 1);
  const passengerOptions = Array.from({ length: maxPassengers }, (_, i) => i + 1);
  const luggageOptions = Array.from({ length: maxLuggage }, (_, i) => i + 1);

  const isHourly = data.serviceType === "hourly";
  const availableCount = sortedVehicles.filter((v) => !v.isDisabled).length;

  /* ────── LOADING STATE ────── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(215,183,94,0.2) 0%, rgba(215,183,94,0.05) 100%)",
            }}
          >
            <Loader2 size={32} style={{ color: "var(--color-primary)" }} />
          </motion.div>
          <p className="text-lg font-semibold text-white mb-2">Finding your perfect ride</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Searching for the best vehicles...
          </p>
        </motion.div>
      </div>
    );
  }

  /* ────── ERROR STATE ────── */
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-10 text-center max-w-md mx-auto mt-20"
        style={{
          backgroundColor: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
        >
          <AlertCircle size={32} style={{ color: "#ef4444" }} />
        </div>
        <h3 className="text-xl font-bold mb-2 text-red-400">Something went wrong</h3>
        <p className="text-red-300 text-sm mb-6">
          {error?.message || "Failed to load vehicles. Please try again."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  /* ────── MAIN LAYOUT ────── */
  return (
    <div className="max-w-7xl mx-auto">
      {/* Journey Info Banner */}
      {/* <JourneyInfoBanner data={data} journeyInfo={journeyInfo} isHourly={isHourly} /> */}

      {/* Filter Bar */}
      {/* <FilterBar
        passengerFilter={passengerFilter}
        setPassengerFilter={setPassengerFilter}
        luggageFilter={luggageFilter}
        setLuggageFilter={setLuggageFilter}
        passengerOptions={passengerOptions}
        luggageOptions={luggageOptions}
        availableCount={availableCount}
        totalCount={vehicles.length}
      /> */}

      {/* Section Heading */}
      <div className="mb-6">
        <h2
          className="text-xl md:text-2xl font-bold mb-2 text-white"
        >
          Select Your Vehicle
        </h2>
        <p
          className="text-xs md:text-sm"
          style={{
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.5px",
          }}
        >
          Choose from our premium fleet for your journey
        </p>
      </div>

      {/* Vehicle Cards Grid */}
      {sortedVehicles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 rounded-2xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Car size={48} className="mx-auto mb-4" style={{ color: "rgba(255,255,255,0.2)" }} />
          <h3 className="text-lg font-semibold text-white mb-2">No vehicles available</h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Try adjusting your filters or search criteria
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4 mb-6">
          <AnimatePresence mode="popLayout">
            {sortedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                isSelected={selectedVehicle?._id === vehicle._id}
                onSelect={handleSelectVehicle}
                isDisabled={vehicle.isDisabled}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Bottom Navigation */}
      <StepNavBar
        onBack={onBack}
        onContinue={handleContinue}
        backLabel="BACK"
        continueLabel="CONTINUE TO BOOKING"
        disabled={!selectedVehicle}
      />
    </div>
  );
}

export default CarsSelection;