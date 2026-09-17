import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  getExampleNumber,
} from "libphonenumber-js";
import examples from "libphonenumber-js/examples.mobile.json";

/* ── Helpers ── */
export const isoToFlag = (iso) =>
  iso
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(c.charCodeAt(0) + 127397));

const regionNames =
  typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

export const getCountryName = (iso) => {
  try {
    return regionNames?.of(iso) || iso;
  } catch {
    return iso;
  }
};

export const getPlaceholder = (isoUpper) => {
  try {
    const ex = getExampleNumber(isoUpper, examples);
    if (ex) return ex.formatNational().replace(/\d/g, "X");
  } catch {}
  return "XXXXXXXXXX";
};

export const getMaxLen = (isoUpper) => {
  try {
    const ex = getExampleNumber(isoUpper, examples);
    if (ex) return ex.nationalNumber.length + 2;
  } catch {}
  return 15;
};

export const validatePhone = (nationalNumber, isoUpper) => {
  if (!nationalNumber) return false;
  try {
    return isValidPhoneNumber(nationalNumber, isoUpper);
  } catch {
    return false;
  }
};

export const PRIORITY_ISOS = ["GB", "IN", "US", "CA", "AU", "AE", "SA", "PK"];

export const buildCountries = () => {
  const all = getCountries().map((iso) => ({
    iso: iso.toLowerCase(),
    isoUpper: iso,
    flag: isoToFlag(iso),
    name: getCountryName(iso),
    dial: getCountryCallingCode(iso),
  }));

  const priority = PRIORITY_ISOS.map((iso) =>
    all.find((c) => c.isoUpper === iso),
  ).filter(Boolean);

  const rest = all
    .filter((c) => !PRIORITY_ISOS.includes(c.isoUpper))
    .sort((a, b) => a.name.localeCompare(b.name));

  return [...priority, ...rest];
};

export const COUNTRIES = buildCountries();
export const DEFAULT_COUNTRY = COUNTRIES[0]; // GB

/**
 * PhoneField – dark-theme variant matching JK booking form.
 * Props: value, onChange, country, onCountryChange, error, label, required
 */
const PhoneField = ({ value, onChange, country, onCountryChange, error, label, required }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapRef = useRef(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const filtered = useMemo(
    () =>
      COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search.replace("+", "")) ||
          c.isoUpper.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  const handleCountrySelect = (c) => {
    onCountryChange(c);
    setOpen(false);
    setSearch("");
    onChange("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleNumberInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, getMaxLen(country?.isoUpper || "GB"));
    onChange(raw);
  };

  const placeholder = getPlaceholder(country?.isoUpper || "GB");

  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .99h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91A16 16 0 0015.1 17.9l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
          </svg>
          {label}
          {required && <span style={{ color: "var(--color-primary)" }}>*</span>}
        </label>
      )}

      <div ref={wrapRef} className="relative w-full">
        <div
          className="flex items-center rounded-xl transition-all"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: error ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1.5 px-3 py-3.5 bg-transparent border-none cursor-pointer shrink-0 rounded-l-xl transition-colors"
            style={{ minWidth: "90px" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span className="text-lg leading-none">{country?.flag}</span>
            <span className="text-sm font-bold" style={{ color: "#fff" }}>+{country?.dial}</span>
            <svg
              style={{ width: "10px", height: "10px", color: "rgba(255,255,255,0.4)", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
              viewBox="0 0 10 10" fill="none"
            >
              <path d="M1 3l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div style={{ width: "1px", height: "24px", backgroundColor: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            placeholder={placeholder}
            className="flex-1 px-3.5 py-3.5 bg-transparent border-none outline-none placeholder:opacity-30 placeholder:text-white"
            style={{ color: "#fff", fontSize: "14px" }}
            value={value}
            onChange={handleNumberInput}
            required={required}
          />
        </div>

        {open && (
          <div
            className="absolute left-0 z-50 overflow-hidden rounded-2xl shadow-2xl"
            style={{ top: "calc(100% + 6px)", width: "100%", minWidth: "280px", backgroundColor: "#1a1a1a", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <div className="p-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full bg-transparent border-none outline-none text-xs"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")} className="bg-transparent border-none cursor-pointer text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="py-1 overflow-y-auto" style={{ maxHeight: "224px", overscrollBehavior: "contain" }} onWheel={(e) => e.stopPropagation()}>
              {filtered.length === 0 ? (
                <div className="p-3 text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>No country found</div>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => handleCountrySelect(c)}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 cursor-pointer text-xs border-none transition-colors"
                    style={{
                      backgroundColor: country?.iso === c.iso ? "rgba(215,183,94,0.1)" : "transparent",
                      color: country?.iso === c.iso ? "var(--color-primary)" : "rgba(255,255,255,0.75)",
                      fontWeight: country?.iso === c.iso ? "600" : "400",
                    }}
                    onMouseEnter={(e) => { if (country?.iso !== c.iso) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={(e) => { if (country?.iso !== c.iso) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <span style={{ fontSize: "16px" }}>{c.flag}</span>
                    <span className="flex-1 truncate text-left">{c.name}</span>
                    <span style={{ fontWeight: "700", color: "rgba(255,255,255,0.45)", flexShrink: 0 }}>+{c.dial}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
};

export default PhoneField;
