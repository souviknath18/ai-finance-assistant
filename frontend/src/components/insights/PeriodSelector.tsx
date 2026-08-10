"use client";

import { Calendar } from "lucide-react";
import DateRangeFilter from "../ui/DateRangeFilter";

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
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Main row */}
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Calendar size={18} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              Analysis Period
            </h3>

            <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
              Choose which transactions Aura should analyze.
            </p>
          </div>
        </div>

        {/* Period buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {PERIOD_OPTIONS.map((option) => {
            const active =
              value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  onChange(option.value)
                }
                className={`h-9 rounded-xl border px-4 text-[11px] font-bold transition-[background-color,border-color,color,box-shadow] duration-200 ${
                  active
                    ? "border-black bg-black text-white shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
                    : "border-[#e6edf9] bg-white text-[#565e74] hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom date range */}
      {value === "custom" &&
  onCustomDateChange && (
    <div className="border-t border-[#edf2fb] bg-[#fbfcff] p-5">
      {/* Heading */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Custom Date Range
        </p>

        <p className="mt-1 text-[11px] text-[#565e74]">
          Select the start and end date for Aura&apos;s analysis.
        </p>
      </div>

      {/* Compact date inputs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-[260px]">
          <DateRangeFilter
            label="Start Date"
            name="startDate"
            value={startDate ?? ""}
            onChangeAction={(name, dateValue) => {
              if (name !== "startDate") {
                return;
              }

              onCustomDateChange(
                dateValue,
                endDate ?? ""
              );
            }}
          />
        </div>

        <div className="w-full sm:w-[260px]">
          <DateRangeFilter
            label="End Date"
            name="endDate"
            value={endDate ?? ""}
            onChangeAction={(name, dateValue) => {
              if (name !== "endDate") {
                return;
              }

              onCustomDateChange(
                startDate ?? "",
                dateValue
              );
            }}
          />
        </div>
      </div>

      {/* Invalid range */}
      {startDate &&
        endDate &&
        new Date(`${endDate}T00:00:00`) <
          new Date(`${startDate}T00:00:00`) && (
          <div className="mt-4 w-fit rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5">
            <p className="text-[11px] font-medium text-red-700">
              End date cannot be earlier than start date.
            </p>
          </div>
        )}

      {/* Selected range */}
      {startDate &&
        endDate &&
        new Date(`${endDate}T00:00:00`) >=
          new Date(`${startDate}T00:00:00`) && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

            <p className="text-[11px] font-medium text-emerald-700">
              Aura will analyze transactions from{" "}
              <span className="font-bold">
                {formatDate(startDate)}
              </span>{" "}
              to{" "}
              <span className="font-bold">
                {formatDate(endDate)}
              </span>
              .
            </p>
          </div>
        )}
    </div>
  )}
    </div>
  );
}

function formatDate(
  value: string
) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(date.getTime())
  ) {
    return value;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}