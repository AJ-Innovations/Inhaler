import React from "react";
import { Calendar } from "lucide-react";

export function JournalHeader() {
  return (
    <div className="mb-2 flex w-full items-start justify-between px-1">
      <div className="space-y-1">
        <h1 className="text-3xl font-light tracking-tight text-white/90">
          Journal
        </h1>
        <p className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">
          Progress Analytics
        </p>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white">
        <Calendar size={20} />
      </div>
    </div>
  );
}
