import React from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Users,
  Briefcase,
  Info,
  Route,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

function StickyBookingSummary({
  from,
  to,
  date,
  time,
  vehicle,
  passengerName,
  extras,
  currentStep,
  onGoBack,
  onContinue,
  distance,
  hours,
  serviceType = "oneway",
  disabled = false,
  isLoading = false,
  hideBack = false,
  hideContinue = false,
  continueLabel = "CONTINUE",
}) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isHourly = serviceType === "hourly";
  const isPtp = serviceType === "ptp";

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{
        backgroundColor: "#141414",
        border: "1px solid rgba(255, 255, 255, 0.05)"
      }}
    >
      {/* Header - Timeline Route Path */}
      <div
        className="p-5"
        style={{
          background: `linear-gradient(180deg, rgba(215, 183, 94, 0.15) 0%, rgba(215, 183, 94, 0.05) 60%, transparent 100%)`,
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex gap-4">
          {/* Timeline Track */}
          <div className="relative flex flex-col items-center w-3 shrink-0 pt-1">
            {/* Top Dot - Active */}
            <div 
              className="w-3 h-3 rounded-full z-10 shadow-lg" 
              style={{ 
                backgroundColor: 'var(--color-primary)', 
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 0 12px rgba(215, 183, 94, 0.5)'
              }} 
            />
            
            {/* Connecting Line */}
            <div 
              className="absolute top-3.5 bottom-3 w-[2px] rounded-full" 
              style={{ 
                background: `linear-gradient(to bottom, var(--color-primary) 0%, rgba(215, 183, 94, 0.4) 50%, rgba(255,255,255,0.08) 100%)` 
              }} 
            />
            
            {/* Bottom Dot - Inactive */}
            <div 
              className="mt-auto w-3 h-3 rounded-full z-10" 
              style={{ 
                backgroundColor: '#1a1a1a', 
                border: '2px solid rgba(255,255,255,0.12)' 
              }} 
            />
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-5 flex-1 min-w-0">
            {/* Pick-up */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-1.5 h-1.5 rounded-full" 
                  style={{ backgroundColor: 'var(--color-primary)' }} 
                />
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-semibold">Pick-up</span>
              </div>
              <p className="text-sm text-white/95 font-medium leading-snug break-words">
                {from || <span className="text-white/30">Not specified</span>}
              </p>
            </div>
            
            {/* Drop-off - Only show for non-hourly bookings */}
            {!isHourly && (
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-1.5 h-1.5 rounded-full bg-white/20" 
                  />
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/35 font-semibold">Drop-off</span>
                </div>
                <p className="text-sm text-white/95 font-medium leading-snug break-words">
                  {to || <span className="text-white/30">Not specified</span>}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 space-y-6">

        {/* DateTime Group - 3 Column Layout */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40">
              <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
              <span className="text-[10px] uppercase tracking-wider">Date</span>
            </div>
            <p className="text-sm text-white font-medium pl-5">{formatDate(date) || "—"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40">
              <Clock size={14} style={{ color: 'var(--color-primary)' }} />
              <span className="text-[10px] uppercase tracking-wider">Time</span>
            </div>
            <p className="text-sm text-white font-medium pl-5">{time || "—"}</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-white/40">
              <Route size={14} style={{ color: 'var(--color-primary)' }} />
              <span className="text-[10px] uppercase tracking-wider">
                {isHourly ? "Duration" : "Distance"}
              </span>
            </div>
            <p className="text-sm text-white font-medium pl-5">
              {isHourly ? (hours ? `${hours}h` : "—") : (distance || "—")}
            </p>
          </div>
        </div>

        {/* Vehicle Selection */}
        <div className="bg-white/3 rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Car size={16} style={{ color: 'var(--color-primary)' }} />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide">Vehicle Details</span>
            </div>
            {vehicle?.class && (
              <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-white/60 uppercase">{vehicle.class}</span>
            )}
          </div>
          <p className="text-sm text-white font-medium mb-2">{vehicle?.name || "No vehicle selected"}</p>

          <div className="flex gap-5">
            <div className="flex items-center gap-2 text-white/60">
              <Users size={18} strokeWidth={2} />
              <span className="text-sm font-medium">{vehicle?.pax || 0} Pax</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Briefcase size={18} strokeWidth={2} />
              <span className="text-sm font-medium">{vehicle?.luggage || 0} Bags</span>
            </div>
          </div>
        </div>

        {/* Passenger & Extras */}
        {(passengerName || (extras && extras.length > 0)) && (
          <div className="space-y-4 pt-2">
            {passengerName && (
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-white/40 mb-1">Lead Passenger</span>
                <p className="text-sm text-white/90">{passengerName}</p>
              </div>
            )}

            {extras && extras.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {extras.map((extra, i) => (
                  <span key={i} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded text-white/70">
                    {extra}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pricing Section */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-white/30">Total Estimate</span>
              <div className="flex items-center gap-1 text-[10px] text-green-500/80">
                <Info size={10} />
                <span>All-inclusive price</span>
              </div>
            </div>
            <div className="text-right">

              <span
                className="text-3xl font-bold tracking-tighter"
                style={{
                  color: 'var(--color-primary)',
                  fontVariantNumeric: 'tabular-nums',
                  textShadow: '0 0 20px rgba(215, 183, 94, 0.3)',
                }}
              >
                £{vehicle?.price ? vehicle.price.toFixed(2) : "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation - StepNavBar Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-stretch gap-3 pt-6 sticky bottom-0 pb-6 z-10 w-full px-0"
          style={{
            background: "transparent",
          }}
        >
          {/* Back Button */}
          {!hideBack && currentStep >= 2 && onGoBack && (
            <button
              onClick={onGoBack}
              type="button"
              className="flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shrink-0 whitespace-nowrap"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.7)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.11)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              <ArrowLeft size={15} />
              <span>BACK</span>
            </button>
          )}

          {/* Continue Button */}
          {!hideContinue && onContinue && (
            <button
              onClick={onContinue}
              type="button"
              disabled={disabled || isLoading}
              className="flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300"
              style={
                disabled || isLoading
                  ? {
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.3)",
                      cursor: disabled ? "not-allowed" : "default",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
                  : {
                      backgroundColor: "var(--color-primary)",
                      color: "var(--color-dark)",
                      boxShadow: "0 8px 24px rgba(215,183,94,0.28)",
                      cursor: "pointer",
                    }
              }
              onMouseEnter={(e) => {
                if (!disabled && !isLoading) {
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(215,183,94,0.4)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && !isLoading) {
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(215,183,94,0.28)";
                  e.currentTarget.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin shrink-0" />
                  <span className="truncate">Please wait...</span>
                </>
              ) : (
                <>
                  <span className="truncate">{continueLabel}</span>
                  <ArrowRight size={15} className="shrink-0" />
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default StickyBookingSummary;
