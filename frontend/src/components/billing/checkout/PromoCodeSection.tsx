"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

export default function PromoCodeSection() {
  const [open, setOpen] =
    useState(false);

  return (
    <div className="border-t border-[#edf2fb] pt-4">
      <button
        type="button"
        onClick={() =>
          setOpen(
            (previous) => !previous
          )
        }
        className="flex items-center gap-2 text-[11px] font-bold text-emerald-700 transition hover:opacity-70"
      >
        <Tag size={14} />
        Have a promo code?
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Enter code"
            className="h-10 flex-1 rounded-xl border border-[#dfe9fb] bg-[#f8f9ff] px-3.5 text-[12px] text-black outline-none transition placeholder:text-[#8a92a5] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="button"
            className="h-10 rounded-xl border border-[#dfe9fb] bg-white px-4 text-[11px] font-bold text-black transition hover:bg-[#eff4ff]"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}