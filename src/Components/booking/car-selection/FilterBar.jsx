import React from "react";
import { motion } from "framer-motion";
import { Filter, Users, Briefcase, ChevronDown } from "lucide-react";

const FilterBar = ({
  passengerFilter,
  setPassengerFilter,
  luggageFilter,
  setLuggageFilter,
  passengerOptions,
  luggageOptions,
  availableCount,
  totalCount,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 md:p-5 mb-8"
      style={{
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">

        {/* SECTION: Title & Counter Badge */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(215, 183, 94, 0.1)",
              border: "1px solid rgba(215, 183, 94, 0.2)",
            }}
          >
            <Filter size={18} style={{ color: "var(--color-primary)" }} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em]">
              Vehicle Filters
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/40">
                {availableCount} <span className="lowercase">of</span> {totalCount} Available
              </p>
            </div>
          </div>
        </div>

        {/* SECTION: Controls (Side by Side) */}
        <div className="flex items-end gap-3 w-full lg:w-auto">

          {/* Passenger Input Group */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 ml-1">
              Max Passengers
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white" style={{ color: "var(--color-primary)" }}>
                <Users size={14} />
              </div>
              <select
                value={passengerFilter}
                onChange={(e) => setPassengerFilter(Number(e.target.value))}
                className="w-full appearance-none rounded-lg pl-10 pr-10 py-3 text-sm font-medium cursor-pointer outline-none transition-all"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                }}
              >
                {passengerOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#121212]">
                    {opt} {opt === 1 ? "Person" : "People"}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"
              />
            </div>
          </div>

          {/* Luggage Input Group */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 ml-1">
              Min Luggage
            </label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors group-focus-within:text-white" style={{ color: "var(--color-primary)" }}>
                <Briefcase size={14} />
              </div>
              <select
                value={luggageFilter}
                onChange={(e) => setLuggageFilter(Number(e.target.value))}
                className="w-full appearance-none rounded-lg pl-10 pr-10 py-3 text-sm font-medium cursor-pointer outline-none transition-all"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "#fff",
                }}
              >
                {luggageOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#121212]">
                    {opt} {opt === 1 ? "Bag" : "Bags"}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"
              />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
