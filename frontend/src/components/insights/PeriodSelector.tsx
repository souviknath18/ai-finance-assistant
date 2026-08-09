"use client";

import { Calendar } from "lucide-react";

export type InsightPeriod =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "this_year"
  | "custom";

type PeriodSelectorProps = {
  value: InsightPeriod;

  onChange: (
    period: InsightPeriod
  ) => void;

  startDate?: string;

  endDate?: string;

  onCustomDateChange?: (
    startDate: string,
    endDate: string
  ) => void;
};

const PERIOD_OPTIONS: {
  value: InsightPeriod;
  label: string;
}[] = [
  {
    value: "this_month",
    label: "This Month",
  },
  {
    value: "last_month",
    label: "Last Month",
  },
  {
    value: "last_3_months",
    label: "Last 3 Months",
  },
  {
    value: "this_year",
    label: "This Year",
  },
  {
    value: "custom",
    label: "Custom",
  },
];

export default function PeriodSelector({
  value,
  onChange,
  startDate,
  endDate,
  onCustomDateChange,
}: PeriodSelectorProps) {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eff4ff]">
            <Calendar
              size={18}
              className="text-black"
            />
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565e74]">
              Analysis Period
            </p>

            <p className="mt-1 text-[13px] text-[#565e74]">
              Choose which transactions Aura should
              analyze.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap items-center gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(option.value)
              }
              className={`rounded-xl border px-4 py-2 text-[12px] font-bold transition ${
                value === option.value
                  ? "border-black bg-black text-white"
                  : "border-[#e5eeff] bg-white text-black hover:bg-[#eff4ff]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {value === "custom" &&
        onCustomDateChange && (
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  onCustomDateChange(
                    e.target.value,
                    endDate || ""
                  )
                }
                className="w-full rounded-xl border border-[#e5eeff] bg-white px-4 py-2.5 text-[13px] shadow-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  onCustomDateChange(
                    startDate || "",
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-[#e5eeff] bg-white px-4 py-2.5 text-[13px] shadow-sm outline-none transition focus:border-black"
              />
            </div>
          </div>
        )}
    </div>
  );
}