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

export default function ReportGenerator() {
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
    <section className="relative z-10 mb-8 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl">
      <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
        <div>
          <h2 className="text-2xl font-bold text-black">
            Generate AI Intelligence Report
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#565e74]">
            Select your focus period to generate a deep-dive analysis of your
            wealth.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[220px_220px_auto] lg:items-end">
          <div className="space-y-2">
            <label className="ml-1 block text-sm text-[#565e74]">
              Interval
            </label>

            <CustomSelect
              name="interval"
              value={form.interval}
              options={intervalOptions}
              onChangeAction={handleSelectChange}
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 block text-sm text-[#565e74]">
              Date Range
            </label>

            <div className="flex h-[50px] items-center gap-2 rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-4 text-sm text-[#0b1c30]">
              <CalendarDays size={17} className="text-[#565e74]" />
              Oct 2023 - Dec 2023
            </div>
          </div>

          <button className="flex h-[50px] items-center justify-center gap-2 rounded-xl bg-black px-6 text-sm font-bold text-white transition hover:opacity-90">
            <Rocket size={17} />
            Generate Report
          </button>
        </div>
      </div>
    </section>
  );
}