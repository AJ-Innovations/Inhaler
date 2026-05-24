import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft } from "lucide-react";
import React from "react";
import type { CountryData } from "../hooks/useOnboardingFlow";

export function CountryStep({
  detectedCountryName,
  selectedCountry,
  setSelectedCountry,
  countries,
  searchQuery,
  setSearchQuery,
  isDropdownOpen,
  setIsDropdownOpen,
  isLoadingCountries,
  selectedCountryData,
  onNext,
  onBack,
}: {
  detectedCountryName: string;
  selectedCountry: string;
  setSelectedCountry: (id: string) => void;
  countries: CountryData[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  isLoadingCountries: boolean;
  selectedCountryData: CountryData;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      key="q_country"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="mx-auto flex w-full max-w-[480px] flex-col justify-center space-y-8 text-center"
    >
      <div className="space-y-2">
        <span className="text-[9px] font-black tracking-[0.3em] text-white/50 uppercase">
          Step 4 of 4
        </span>
        <h2 className="text-3xl leading-tight font-light tracking-tight text-white">
          Where are you breathing from?
        </h2>
        <p className="px-4 text-sm font-light text-gray-300">
          We've detected your country as{" "}
          <span className="font-semibold text-emerald-400">
            {detectedCountryName}
          </span>
          . Confirm or select your country below to personalize your pricing and
          routines.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[320px] space-y-4">
        {/* Custom Searchable Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-md flex h-14 w-full cursor-pointer items-center justify-between rounded-full border border-white/10 bg-white/5 px-6 font-light text-white backdrop-blur-md transition-all hover:bg-white/10"
          >
            <div className="flex items-center truncate">
              {selectedCountryData ? (
                <span className="flex items-center gap-3 truncate">
                  <img
                    src={selectedCountryData.flag}
                    alt={selectedCountryData.name}
                    className="h-5 w-7 shrink-0 rounded-[2px] border border-white/10 object-cover shadow-sm"
                  />
                  <span className="truncate">{selectedCountryData.name}</span>
                </span>
              ) : (
                <span className="text-white/40">Select Country</span>
              )}
            </div>
            <ChevronLeft
              size={16}
              className={`text-white/60 transition-transform duration-300 ${
                isDropdownOpen ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-[62px] right-0 left-0 z-50 overflow-hidden rounded-[24px] border border-white/5 bg-white/5 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="relative mb-2 flex items-center">
                <input
                  type="text"
                  placeholder="Search country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-md h-10 w-full rounded-full border border-white/10 bg-white/5 px-4 pr-10 font-light text-white placeholder:text-white/30 focus:border-white/20 focus:bg-white/10 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-[12px] tracking-wider text-white/40 uppercase hover:text-white"
                  >
                    clear
                  </button>
                )}
              </div>

              <div className="scrollbar-hide max-h-48 space-y-1 overflow-y-auto pr-1">
                {isLoadingCountries ? (
                  <div className="py-4 text-center text-xs text-white/40">
                    Loading countries...
                  </div>
                ) : countries.filter((c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
                  ).length === 0 ? (
                  <div className="py-4 text-center text-sm text-white/40">
                    No countries found
                  </div>
                ) : (
                  countries
                    .filter((c) =>
                      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c.code);
                          setSearchQuery("");
                          setIsDropdownOpen(false);
                        }}
                        className={`text-md flex w-full items-center gap-3 rounded-full px-4 py-2 text-left transition-all ${
                          selectedCountry === c.code
                            ? "bg-white/15 font-medium text-white"
                            : "text-white/80 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <img
                          src={c.flag}
                          alt={c.name}
                          className="h-4 w-7 shrink-0 rounded-[2px] border border-white/10 object-cover shadow-sm"
                        />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))
                )}
              </div>
            </div>
          )}
        </div>

        {!isDropdownOpen ? (
          <button
            onClick={() => {
              import("@libs/secureStorage").then(({ SecureStorage }) => {
                SecureStorage.setItem("spirox_user_country", selectedCountry);
              });
              onNext();
            }}
            className="relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-white text-[10px] font-black tracking-[0.2em] text-black uppercase shadow-[0_20px_40px_rgba(255,255,255,0.06)] transition-all hover:scale-105 active:scale-95"
          >
            Confirm & Start Calibration
            <ArrowRight size={16} strokeWidth={3} />
          </button>
        ) : (
          <div className="h-14" />
        )}
      </div>

      <button
        onClick={onBack}
        className="mx-auto inline-flex items-center gap-2 text-xs text-gray-500 transition-colors hover:text-white"
      >
        <ChevronLeft size={16} /> Back
      </button>
    </motion.div>
  );
}
