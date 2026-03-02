import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  Users,
  Briefcase,
} from "lucide-react";
import { fleetAPI } from "../../Utils/api";

function FleetSection() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch all fleet entries from the fleet collection
  const { data: fleetResponse, isLoading } = useQuery({
    queryKey: ["home-fleet"],
    queryFn: () => fleetAPI.getAll(1, 20),
    staleTime: 10 * 60 * 1000,
  });

  const fleetItems = fleetResponse?.fleet || [];

  // Check scroll position
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", checkScroll);
      return () => scrollEl.removeEventListener("scroll", checkScroll);
    }
  }, [fleetItems.length]);

  // Scroll by cards
  const scroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth =
        scrollRef.current.querySelector(".fleet-card")?.offsetWidth || 400;
      const gap = 24;
      const scrollAmount = (cardWidth + gap) * 1;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      className="py-8 md:py-10"
      style={{ backgroundColor: "var(--color-dark)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-sm font-medium tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              Premium Fleet
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-2xl md:text-3xl lg:text-4xl font-light text-white"
            >
              OUR{" "}
              <span
                className="font-semibold"
                style={{ color: "var(--color-primary)" }}
              >
                FLEET
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/60 mt-3 max-w-xl"
            >
              Luxury vehicles for every occasion
            </motion.p>
          </div>

          {/* Navigation Arrows - Desktop Only */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
              style={{
                borderColor: canScrollLeft
                  ? "var(--color-primary)"
                  : "rgba(255,255,255,0.1)",
                color: canScrollLeft
                  ? "var(--color-primary)"
                  : "rgba(255,255,255,0.3)",
                cursor: canScrollLeft ? "pointer" : "not-allowed",
                backgroundColor: "transparent",
              }}
              aria-label="Previous vehicles"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300"
              style={{
                borderColor: canScrollRight
                  ? "var(--color-primary)"
                  : "rgba(255,255,255,0.1)",
                color: canScrollRight
                  ? "var(--color-primary)"
                  : "rgba(255,255,255,0.3)",
                cursor: canScrollRight ? "pointer" : "not-allowed",
                backgroundColor: "transparent",
              }}
              aria-label="Next vehicles"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "var(--color-primary)" }}
            />
            <span className="ml-3 text-white/60">Loading fleet...</span>
          </div>
        )}

        {/* Fleet Carousel */}
        {!isLoading && fleetItems.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {fleetItems.map((vehicle, index) => {
              const imageUrl = vehicle.heroImage?.url || "";

              return (
                <motion.div
                  key={vehicle._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="fleet-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(33.333%-16px)] snap-center"
                >
                  <Link to={`/fleet/${vehicle.slug}`} className="block h-full">
                    <div className="group cursor-pointer h-full flex flex-col transition-transform duration-500 hover:-translate-y-2">
                      {/* Card Container */}
                      <div
                        className="relative rounded-2xl overflow-hidden h-full flex flex-col"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.05)",
                        }}
                      >
                        {/* Image Container */}
                        <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0">
                          <img
                            src={imageUrl}
                            alt={vehicle.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/400x250?text=Vehicle";
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                        </div>

                        {/* Content - Bottom section */}
                        <div className="p-4 space-y-2 flex flex-col flex-grow">
                          {/* Subtitle */}
                          <p
                            className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {vehicle.subtitle || "Luxury Vehicle"}
                          </p>

                          {/* Vehicle Name */}
                          <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                            {vehicle.title}
                          </h3>

                          {/* Capacity badges */}
                          <div className="flex items-center gap-4 text-white/50 text-sm">
                            {vehicle.passengers > 0 && (
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
                                <span>{vehicle.passengers}</span>
                              </div>
                            )}
                            {vehicle.luggage > 0 && (
                              <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
                                <span>{vehicle.luggage}</span>
                              </div>
                            )}
                          </div>

                          {/* View / Book Link */}
                          <div className="flex items-center justify-between pt-2 mt-auto">
                            <div className="inline-flex items-center gap-2 text-sm font-medium group/link">
                              <span
                                className="group-hover/link:underline transition-all"
                                style={{ color: "var(--color-primary)" }}
                              >
                                VIEW DETAILS
                              </span>
                              <ArrowRight
                                className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                                style={{ color: "var(--color-primary)" }}
                              />
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate("/booking");
                              }}
                              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300"
                              style={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-dark)",
                              }}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && fleetItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50">
              No vehicles available at the moment.
            </p>
          </div>
        )}

        {/* Mobile Navigation */}
        {!isLoading && fleetItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-between mt-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex md:hidden items-center gap-2">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                  style={{
                    borderColor: canScrollLeft
                      ? "var(--color-primary)"
                      : "rgba(255,255,255,0.2)",
                    color: canScrollLeft
                      ? "var(--color-primary)"
                      : "rgba(255,255,255,0.3)",
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                  style={{
                    borderColor: canScrollRight
                      ? "var(--color-primary)"
                      : "rgba(255,255,255,0.2)",
                    color: canScrollRight
                      ? "var(--color-primary)"
                      : "rgba(255,255,255,0.3)",
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

export default FleetSection;
