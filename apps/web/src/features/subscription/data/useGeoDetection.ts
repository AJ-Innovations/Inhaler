"use client";

import React, { useState } from "react";

import { PricingTier, pricingTiers, resolvePricingTier } from "./pricingTiers";

/**
 * Geo-detection hook for subscription pricing.
 * Tries ipapi.co first, then freeipapi.com as fallback, then localStorage cache.
 * Extracted from SubscriptionView.tsx for separation of concerns.
 */
export function useGeoDetection() {
  const [activeTier, setActiveTier] = useState<PricingTier>(
    pricingTiers.DEFAULT,
  );
  const [detectedCountry, setDetectedCountry] = useState<string>("US");

  const applyCountry = (country: string) => {
    const cc = country.toUpperCase();
    setDetectedCountry(cc);
    setActiveTier(resolvePricingTier(cc));
  };

  React.useEffect(() => {
    let active = true;
    async function fetchGeo() {
      // 0. Try localStorage first
      if (typeof window !== "undefined") {
        const savedCountry = localStorage.getItem("spirox_user_country");
        if (savedCountry) {
          applyCountry(savedCountry);
          return;
        }
      }

      // 1. Try ipapi.co (Primary HTTPS)
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          if (active && data.country_code) {
            applyCountry(data.country_code);
            return;
          }
        }
      } catch (e) {
        console.warn("Primary Geo-IP (ipapi.co) failed, trying backup...", e);
      }

      // 2. Try freeipapi.com (Highly reliable CORS-friendly Backup)
      try {
        const res = await fetch("https://freeipapi.com/api/json");
        if (res.ok) {
          const data = await res.json();
          if (active && data.countryCode) {
            applyCountry(data.countryCode);
            return;
          }
        }
      } catch {
        console.warn("Backup Geo-IP (freeipapi.com) failed, using default US.");
      }
    }
    fetchGeo();
    return () => {
      active = false;
    };
  }, []);

  return { activeTier, detectedCountry, applyCountry };
}
