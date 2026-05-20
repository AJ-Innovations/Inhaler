/**
 * Regional pricing tier data for the subscription paywall.
 * Extracted from SubscriptionView.tsx for modularity.
 */

export interface PricingTier {
  symbol: string;
  proMonthly: string;
  proYearly: string;
  proStrikethrough: string | null;
  premiumMonthly: string;
  premiumYearly: string;
  premiumStrikethrough: string | null;
  periodMonthly: string;
  periodYearly: string;
}

export const pricingTiers: Record<string, PricingTier> = {
  US: {
    symbol: "$",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.99",
    premiumYearly: "49.99",
    premiumStrikethrough: "60",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  GB: {
    symbol: "£",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.49",
    premiumYearly: "44.99",
    premiumStrikethrough: "54",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  EU: {
    symbol: "€",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.99",
    premiumYearly: "49.99",
    premiumStrikethrough: "60",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  IN: {
    symbol: "₹",
    proMonthly: "29",
    proYearly: "249",
    proStrikethrough: "348",
    premiumMonthly: "99",
    premiumYearly: "899",
    premiumStrikethrough: "1188",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  CA: {
    symbol: "C$",
    proMonthly: "1.49",
    proYearly: "14.99",
    proStrikethrough: "18",
    premiumMonthly: "6.99",
    premiumYearly: "69.99",
    premiumStrikethrough: "84",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  AU: {
    symbol: "A$",
    proMonthly: "1.49",
    proYearly: "14.99",
    proStrikethrough: "18",
    premiumMonthly: "7.49",
    premiumYearly: "74.99",
    premiumStrikethrough: "90",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  JP: {
    symbol: "¥",
    proMonthly: "150",
    proYearly: "1,500",
    proStrikethrough: "1,800",
    premiumMonthly: "700",
    premiumYearly: "7,000",
    premiumStrikethrough: "8,400",
    periodMonthly: "/ 月",
    periodYearly: "/ 年",
  },
  KR: {
    symbol: "₩",
    proMonthly: "990",
    proYearly: "9,900",
    proStrikethrough: "11,880",
    premiumMonthly: "4,900",
    premiumYearly: "49,000",
    premiumStrikethrough: "58,800",
    periodMonthly: "/ 월",
    periodYearly: "/ 년",
  },
  AE: {
    symbol: "AED ",
    proMonthly: "2.99",
    proYearly: "29.99",
    proStrikethrough: "36",
    premiumMonthly: "14.99",
    premiumYearly: "149.99",
    premiumStrikethrough: "180",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  SA: {
    symbol: "SR ",
    proMonthly: "2.99",
    proYearly: "29.99",
    proStrikethrough: "36",
    premiumMonthly: "12.99",
    premiumYearly: "129.99",
    premiumStrikethrough: "156",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
  BR: {
    symbol: "R$ ",
    proMonthly: "2.99",
    proYearly: "29.99",
    proStrikethrough: "36",
    premiumMonthly: "14.99",
    premiumYearly: "149.99",
    premiumStrikethrough: "180",
    periodMonthly: "/ mês",
    periodYearly: "/ ano",
  },
  TR: {
    symbol: "₺",
    proMonthly: "9.99",
    proYearly: "99.99",
    proStrikethrough: "120",
    premiumMonthly: "49.99",
    premiumYearly: "499.99",
    premiumStrikethrough: "600",
    periodMonthly: "/ ay",
    periodYearly: "/ yıl",
  },
  ID: {
    symbol: "Rp ",
    proMonthly: "5.000",
    proYearly: "49.000",
    proStrikethrough: "60.000",
    premiumMonthly: "24.000",
    premiumYearly: "240.000",
    premiumStrikethrough: "288.000",
    periodMonthly: "/ bulan",
    periodYearly: "/ tahun",
  },
  VN: {
    symbol: "₫",
    proMonthly: "9,000",
    proYearly: "90,000",
    proStrikethrough: "108,000",
    premiumMonthly: "49,000",
    premiumYearly: "490,000",
    premiumStrikethrough: "588,000",
    periodMonthly: "/ tháng",
    periodYearly: "/ năm",
  },
  DEFAULT: {
    symbol: "$",
    proMonthly: "0.99",
    proYearly: "9.99",
    proStrikethrough: "12",
    premiumMonthly: "4.99",
    premiumYearly: "49.99",
    premiumStrikethrough: "60",
    periodMonthly: "/ month",
    periodYearly: "/ year",
  },
};

/** Euro-zone country codes that map to the EU pricing tier. */
export const EURO_ZONE_COUNTRIES = [
  "DE",
  "FR",
  "IT",
  "ES",
  "NL",
  "BE",
  "AT",
  "IE",
  "FI",
  "PT",
  "GR",
  "EE",
  "LV",
  "LT",
  "SK",
  "SI",
  "CY",
  "MT",
  "HR",
];

/** Resolve a country code to the correct pricing tier. */
export function resolvePricingTier(countryCode: string): PricingTier {
  const cc = countryCode.toUpperCase();
  if (pricingTiers[cc]) return pricingTiers[cc];
  if (EURO_ZONE_COUNTRIES.includes(cc)) return pricingTiers.EU;
  return pricingTiers.DEFAULT;
}
