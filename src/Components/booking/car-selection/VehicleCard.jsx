import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Briefcase, ChevronDown, ChevronUp, Check } from "lucide-react";

const VehicleCard = ({ vehicle, isSelected, onSelect, isDisabled }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const pricing = vehicle.pricing;

  React.useEffect(() => {
    setShowBreakdown(isSelected);
  }, [isSelected]);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageUrl = vehicle.image?.url
    ? `${API_BASE}/${vehicle.image.url.replace(/\\/g, "/")}`
    : "/placeholder-car.png";

  return (
    <motion.div
      layout
      onClick={() => !isDisabled && onSelect(vehicle)}
      className={`relative mb-3 w-full transition-all duration-300 overflow-hidden border ${isDisabled ? "opacity-30 grayscale pointer-events-none" : "cursor-pointer"
        }`}
      style={{
        backgroundColor: "#111",
        borderRadius: "12px",
        borderColor: isSelected ? 'var(--color-primary)' : "#222",
        boxShadow: isSelected ? "0 10px 30px -10px rgba(215, 183, 94, 0.2)" : "none",
      }}
    >
      {/* MAIN CONTENT ROW */}
      <div className="flex items-center gap-3 p-3 md:p-4">

        {/* Compact Image */}
        <div className="w-20 h-12 md:w-32 md:h-20 shrink-0 flex items-center justify-center bg-[#161616] rounded-lg p-1">
          <img src={imageUrl} alt={vehicle.categoryName} className="w-full h-full object-contain" />
        </div>

        {/* Info & Specs */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm md:text-lg font-semibold text-white leading-tight">
            {vehicle.categoryName}
          </h3>
          {/* Inline Specs for compactness */}
          <div className="flex items-center gap-3 mt-1 opacity-60">
            <div className="flex items-center gap-1">
              <Users size={12} style={{ color: 'var(--color-primary)' }} />
              <span className="text-[10px] text-white font-medium">{vehicle.numberOfPassengers}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase size={12} style={{ color: 'var(--color-primary)' }} />
              <span className="text-[10px] text-white font-medium">{vehicle.numberOfBigLuggage}</span>
            </div>
          </div>
        </div>

        {/* Price Section - Always on right */}
        <div className="text-right shrink-0">
          <p className="text-[8px] text-white uppercase tracking-wider font-medium">Total</p>
          <div className="text-lg md:text-xl font-bold leading-none" style={{ color: 'var(--color-primary)' }}>
            £{pricing?.totalPrice?.toFixed(2)}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isSelected) onSelect(vehicle);
            setShowBreakdown(!showBreakdown);
          }}
          className="p-2 rounded-full border cursor-pointer border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)] group transition-colors"
        >
          <motion.div animate={{ rotate: showBreakdown ? 180 : 0 }}>
            <ChevronDown
              size={16}
              className="text-[var(--color-primary)] group-hover:text-black transition-colors"
            />
          </motion.div>
        </button>
      </div>

      {/* COMPACT EXPANDABLE SECTION */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="bg-[#0a0a0a] border-t border-[#222] overflow-hidden"
          >
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ultra-compact price breakdown */}
              <div className="space-y-1 text-[12px] font-mono border-r border-[#222] pr-4">
                <div className="flex justify-between text-white">
                  <span>BASE FARE</span>
                  <span>£{(pricing?.totalPrice * 0.8).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>TAX</span>
                  <span>£{(pricing?.totalPrice * 0.2).toFixed(2)}</span>
                </div>
              </div>

              {/* Tiny Chips for Features */}
              <div className="flex flex-wrap gap-1.5">
                {vehicle.companyFeatures?.slice(0, 3).map((feat, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded uppercase font-bold border" style={{ backgroundColor: 'rgba(215,183,94,0.1)', color: 'var(--color-primary)', borderColor: 'rgba(215,183,94,0.2)' }}>
                    {feat}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VehicleCard;
