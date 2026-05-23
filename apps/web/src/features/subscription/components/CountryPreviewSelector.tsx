import React from "react";

interface CountryPreviewSelectorProps {
  detectedCountry: string;
  applyCountry: (country: string) => void;
}

export function CountryPreviewSelector({
  detectedCountry,
  applyCountry,
}: CountryPreviewSelectorProps) {
  return (
    <div className="relative z-[20] flex shrink-0 flex-col items-center justify-center gap-1 pb-6 opacity-80 transition-opacity hover:opacity-100">
      <div className="flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 backdrop-blur-md">
        <span className="text-[9px] font-bold tracking-widest text-white/50 uppercase">
          Country Preview:
        </span>
        <select
          value={detectedCountry}
          onChange={(e) => {
            applyCountry(e.target.value);
          }}
          className="cursor-pointer border-none bg-transparent text-[9px] font-black tracking-wider text-white uppercase outline-none focus:ring-0"
          style={{ colorScheme: "dark" }}
        >
          <option value="US" className="bg-neutral-900 text-white">
            United States ($)
          </option>
          <option value="IN" className="bg-neutral-900 text-white">
            India (₹)
          </option>
          <option value="GB" className="bg-neutral-900 text-white">
            United Kingdom (£)
          </option>
          <option value="EU" className="bg-neutral-900 text-white">
            Eurozone (€)
          </option>
          <option value="CA" className="bg-neutral-900 text-white">
            Canada (C$)
          </option>
          <option value="AU" className="bg-neutral-900 text-white">
            Australia (A$)
          </option>
          <option value="JP" className="bg-neutral-900 text-white">
            Japan (¥)
          </option>
          <option value="KR" className="bg-neutral-900 text-white">
            South Korea (₩)
          </option>
          <option value="AE" className="bg-neutral-900 text-white">
            UAE (AED)
          </option>
          <option value="SA" className="bg-neutral-900 text-white">
            Saudi Arabia (SR)
          </option>
          <option value="BR" className="bg-neutral-900 text-white">
            Brazil (R$)
          </option>
          <option value="TR" className="bg-neutral-900 text-white">
            Turkey (₺)
          </option>
          <option value="ID" className="bg-neutral-900 text-white">
            Indonesia (Rp)
          </option>
          <option value="VN" className="bg-neutral-900 text-white">
            Vietnam (₫)
          </option>
        </select>
      </div>
    </div>
  );
}
