"use client";

import { useState } from "react";
import {
  Rocket,
  Sparkles,
} from "lucide-react";

import CustomSelect from "@/components/ui/CustomSelect";
import DateRangeFilter from "@/components/ui/DateRangeFilter";

const intervalOptions = [
  {
    label: "Monthly Report",
    value: "monthly",
  },
  {
    label: "Quarterly Report",
    value: "quarterly",
  },
  {
    label: "Annual Audit",
    value: "annual",
  },
  {
    label: "Custom Range",
    value: "custom",
  },
];

type ReportGeneratorProps = {
  loading?: boolean;

  onGenerateAction: (
    interval: string,
    startDate?: string,
    endDate?: string
  ) => void;
};

export default function ReportGenerator({
  loading = false,
  onGenerateAction,
}: ReportGeneratorProps) {
  const [form, setForm] = useState({
    interval: "monthly",
    startDate: "",
    endDate: "",
  });

  const handleSelectChange = (
    name: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,

      ...(name === "interval" &&
      value !== "custom"
        ? {
            startDate: "",
            endDate: "",
          }
        : {}),
    }));
  };

  const handleDateChange = (
    name: "startDate" | "endDate",
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const customRangeSelected =
    form.interval === "custom";

  const customRangeValid =
    !customRangeSelected ||
    Boolean(
      form.startDate &&
        form.endDate &&
        form.startDate <= form.endDate
    );

  const handleGenerate = () => {
    if (
      customRangeSelected &&
      !customRangeValid
    ) {
      return;
    }

    onGenerateAction(
      form.interval,
      customRangeSelected
        ? form.startDate
        : undefined,
      customRangeSelected
        ? form.endDate
        : undefined
    );
  };

  return (
    <section className="mb-6 overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Main */}
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Left */}
        <div className="flex min-w-0 items-start gap-3 lg:max-w-md">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Sparkles size={17} />
          </div>

          <div className="min-w-0">
            <h2 className="text-[16px] font-bold text-black">
              Generate AI Intelligence Report
            </h2>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Select a reporting period and Aura will prepare a detailed
              financial analysis.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full lg:w-auto">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[210px_auto] sm:items-end">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
                Interval
              </label>

              <CustomSelect
                name="interval"
                value={form.interval}
                options={intervalOptions}
                onChangeAction={
                  handleSelectChange
                }
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={
                loading ||
                !customRangeValid
              }
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Rocket size={15} />

              {loading
                ? "Generating..."
                : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Date Range */}
      {customRangeSelected && (
        <div className="border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-5 sm:px-6">
          <div className="mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              Custom Date Range
            </p>

            <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
              Choose the transaction period Aura should include in this
              report.
            </p>
          </div>

          <div className="grid max-w-[560px] grid-cols-1 gap-4 sm:grid-cols-2">
            <DateRangeFilter
              label="Start Date"
              name="startDate"
              value={
                form.startDate
              }
              onChangeAction={
                handleDateChange
              }
            />

            <DateRangeFilter
              label="End Date"
              name="endDate"
              value={
                form.endDate
              }
              onChangeAction={
                handleDateChange
              }
            />
          </div>

          {form.startDate &&
            form.endDate && (
              <>
                {form.startDate <=
                form.endDate ? (
                  <div className="mt-4 flex w-fit items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                    <p className="text-[11px] font-medium text-emerald-700">
                      Aura will analyze{" "}
                      <span className="font-bold">
                        {formatDate(
                          form.startDate
                        )}
                      </span>{" "}
                      to{" "}
                      <span className="font-bold">
                        {formatDate(
                          form.endDate
                        )}
                      </span>
                      .
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-[11px] font-semibold text-red-600">
                    End date must be after the start date.
                  </p>
                )}
              </>
            )}
        </div>
      )}
    </section>
  );
}

function formatDate(
  value: string
) {
  const date = new Date(
    `${value}T00:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
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