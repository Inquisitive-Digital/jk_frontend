import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  icon: Icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Find selected option
  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Calculate dropdown position to prevent screen overflow
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If not enough space below and more space above, open upward
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setDropdownPosition("top");
      } else {
        setDropdownPosition("bottom");
      }
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className=" text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 flex items-center gap-2">
          {Icon && <Icon size={14} className="text-gray-500" />}
          {label}
        </label>
      )}

      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 border bg-white  rounded-xl transition-all duration-200 outline-none focus:outline-none ${isOpen
            ? "border-gray-200 shadow-lg shadow-amber-100 ring-4 ring-amber-50"
            : "border-gray-200 hover:border-gray-300 shadow-sm"
          }`}
      >
        <span
          className={`text-sm font-medium ${selectedOption ? "text-gray-900" : "text-gray-400"
            }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown
            size={20}
            className={isOpen ? "text-amber-500" : "text-gray-400"}
          />
        </motion.div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: dropdownPosition === "bottom" ? -10 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: dropdownPosition === "bottom" ? -10 : 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 right-0 z-50 bg-white  border-amber-500 rounded-xl shadow-2xl overflow-hidden ${dropdownPosition === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
              }`}
            style={{ maxHeight: "280px" }}
          >
            <div className="overflow-y-auto max-h-70 py-2">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] duration-150 ${isSelected
                        ? "bg-amber-50 text-amber-700 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <span className="text-sm">{option.label}</span>
                    {isSelected && (
                      <Check size={18} className="text-amber-600" strokeWidth={3} />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomDropdown;
