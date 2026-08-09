import React from "react";

import IconCircle from "./IconCircle";

type InsightMetricCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  children?: React.ReactNode;
  tone?: "default" | "red" | "green" | "purple";
};

export default function InsightMetricCard({
  icon,
  title,
  value,
  description,
  children,
  tone = "default",
}: InsightMetricCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <IconCircle tone={tone}>
          {icon}
        </IconCircle>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#565e74]">
            {title}
          </p>

          <h3 className="mt-1 text-2xl font-bold leading-none text-black">
            {value}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-[13px] leading-6 text-[#565e74]">
        {description}
      </p>

      {/* Divider */}
      {children && (
        <>
          <div className="my-5 h-px bg-[#e5eeff]" />

          <div className="flex-1">
            {children}
          </div>
        </>
      )}
    </div>
  );
}