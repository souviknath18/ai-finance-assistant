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
    <div className="h-full rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.08)]">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          {icon}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565e74]">
          {title}
        </p>
      </div>

      {/* Primary value */}
      <p className="text-xl font-bold tracking-tight text-black">
        {primaryValue}
      </p>

      {/* Description */}
      <p className="mt-2 text-[13px] leading-6 text-[#565e74]">
        {description}
      </p>

      {/* Supporting information */}
      <div className="mt-4 border-t border-[#edf2fb] pt-3">
        <p className="text-[11px] font-semibold leading-5 text-[#7c839b]">
          {supportingText}
        </p>
      </div>
    </div>
  );
}