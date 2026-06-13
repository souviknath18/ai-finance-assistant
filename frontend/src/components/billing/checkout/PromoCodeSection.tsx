"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

export default function PromoCodeSection() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[12px] font-bold text-emerald-700 hover:underline"
      >
        <Tag size={14} />
        Have a promo code?
      </button>

      {open && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Enter code"
            className="flex-1 rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3.5 py-2.5 text-[13px] outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />

          <button
            type="button"
            className="rounded-xl border border-[#c6c6cd] px-4 text-[12px] font-bold text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}