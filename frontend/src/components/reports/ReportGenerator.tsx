"use client";

import { useState } from "react";
import { CalendarDays, Rocket } from "lucide-react";

import CustomSelect from "@/components/ui/CustomSelect";

const intervalOptions = [
  { label: "Monthly Report", value: "monthly" },
  { label: "Quarterly Report", value: "quarterly" },
  { label: "Annual Audit", value: "annual" },
  { label: "Custom Range", value: "custom" },
];

type ReportGeneratorProps = {
  loading?: boolean;
  onGenerateAction: (interval: string) => void;
};

export default function ReportGenerator({
  loading = false,
  onGenerateAction,
}: ReportGeneratorProps) {
  const [form, setForm] = useState({
    interval: "monthly",
  });

  const handleSelectChange = (name: string, value: string) => {
    setForm({
      ...form,
      [name]: value,
    });
  };

  return (
    <section className="relative z-10 mb-6 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-lg font-bold text-black">
            Generate AI Intelligence Report
          </h2>

          <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
            Select your focus period to generate a deep-dive analysis of your
            wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[200px_200px_auto] lg:items-end">
          <div className="space-y-1.5">
            <label className="ml-1 block text-[13px] text-[#565e74]">
              Interval
            </label>

            <CustomSelect
              name="interval"
              value={form.interval}
              options={intervalOptions}
              onChangeAction={handleSelectChange}
            />
          </div>

          <div className="space-y-1.5">
            <label className="ml-1 block text-[13px] text-[#565e74]">
              Date Range
            </label>

            <div className="flex h-11 items-center gap-2 rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 text-[13px] text-[#0b1c30]">
              <CalendarDays size={16} className="text-[#565e74]" />
              Current Month
            </div>
          </div>

          <button
            onClick={() => onGenerateAction(form.interval)}
            disabled={loading}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[13px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Rocket size={15} />
            {loading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>
    </section>
  );
}