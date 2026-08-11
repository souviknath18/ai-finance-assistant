import React from "react";

type DomainSummaryCardProps = {
  icon: React.ReactNode;
  title: string;
  primaryValue: string;
  description: string;
  supportingText: string;
};

export default function DomainSummaryCard({
  icon,
  title,
  primaryValue,
  description,
  supportingText,
}: DomainSummaryCardProps) {
  return (
    <section className="h-full rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Financial Domain
          </p>

          <h3 className="mt-1 text-[14px] font-bold tracking-tight text-black">
            {title}
          </h3>
        </div>
      </div>

      {/* Primary value */}
      <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] px-4 py-3.5">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
          Current Status
        </p>

        <p className="mt-1.5 text-[20px] font-bold tracking-tight text-black">
          {primaryValue}
        </p>
      </div>

      {/* Description */}
      <p className="mt-4 text-[12px] leading-5 text-[#565e74]">
        {description}
      </p>

      {/* Supporting info */}
      <div className="mt-4 border-t border-[#edf2fb] pt-3">
        <p className="text-[10px] font-semibold leading-5 text-[#7c839b]">
          {supportingText}
        </p>
      </div>
    </section>
  );
}