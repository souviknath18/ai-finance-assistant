"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

type TableSelectProps = {
  value: string;
  options: Option[];
  onChangeAction: (value: string) => void;
  openDirection?: "down" | "up";
};

export default function TableSelect({
  value,
  options,
  onChangeAction,
  openDirection = "down",
}: TableSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`relative w-[170px] ${open ? "z-[9999]" : "z-10"}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-[#c6c6cd] bg-[#f8f9ff] px-3 text-left text-xs font-semibold text-[#0b1c30] outline-none transition hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      >
        <span className="truncate">
          {selectedOption?.label || "Select Category"}
        </span>

        <ChevronDown
          size={15}
          className={`ml-2 shrink-0 text-[#565e74] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 z-[10000] max-h-52 w-full overflow-y-auto rounded-xl border border-[#d3e4fe] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.14)] custom-select-scrollbar ${
            openDirection === "up"
              ? "bottom-full mb-1"
              : "top-full mt-1"
          }`}
        >
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChangeAction(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition ${
                  selected
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "text-[#45464d] hover:bg-[#eff4ff] hover:text-black"
                }`}
              >
                <span className="truncate">{option.label}</span>
                {selected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}