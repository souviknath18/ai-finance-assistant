"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  name: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  onChangeAction: (name: string, value: string) => void;
};

export default function CustomSelect({
  name,
  value,
  options,
  placeholder = "Select",
  onChangeAction,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <div className="relative z-[100]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-[50px] w-full items-center justify-between rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-4 text-left text-sm text-[#0b1c30] outline-none transition hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      >
        <span>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`text-[#565e74] transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[9999] mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-[#d3e4fe] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.14)] custom-select-scrollbar">
          {options.map((option) => {
            const selected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChangeAction(name, option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${
                  selected
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "text-[#45464d] hover:bg-[#eff4ff] hover:text-black"
                }`}
              >
                <span>{option.label}</span>

                {selected && <Check size={16} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}