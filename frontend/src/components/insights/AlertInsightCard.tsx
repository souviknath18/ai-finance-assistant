import React from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from "lucide-react";

import type {
  InsightSeverity,
} from "@/types/insights";

type AlertInsightCardProps = {
  icon?: React.ReactNode;
  tag?: string;
  title: string;
  description: string;
  severity: InsightSeverity;
};

export default function AlertInsightCard({
  icon,
  tag,
  title,
  description,
  severity,
}: AlertInsightCardProps) {
  const styles = getSeverityStyles(severity);

  return (
    <section
      className={`flex h-full flex-1 flex-col rounded-3xl border ${styles.border} bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] transition-[border-color,box-shadow] duration-200 hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)]`}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
        >
          {icon ?? getSeverityIcon(severity)}
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] ${styles.tag}`}
        >
          {tag ?? getSeverityLabel(severity)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <h3 className="text-[13px] font-bold leading-5 text-black">
          {title}
        </h3>

        <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
          {description}
        </p>
      </div>

      {/* Status accent */}
      <div
        className={`mt-4 h-1 w-10 rounded-full ${styles.accent}`}
      />
    </section>
  );
}

function getSeverityStyles(
  severity: InsightSeverity
) {
  if (severity === "critical") {
    return {
      border:
        "border-red-100",
      icon:
        "border-red-100 bg-red-50 text-red-600",
      tag:
        "border-red-100 bg-red-50 text-red-600",
      accent:
        "bg-red-500",
    };
  }

  if (severity === "warning") {
    return {
      border:
        "border-amber-100",
      icon:
        "border-amber-100 bg-amber-50 text-amber-700",
      tag:
        "border-amber-100 bg-amber-50 text-amber-700",
      accent:
        "bg-amber-500",
    };
  }

  if (severity === "positive") {
    return {
      border:
        "border-emerald-100",
      icon:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
      tag:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
      accent:
        "bg-emerald-500",
    };
  }

  return {
    border:
      "border-[#e6edf9]",
    icon:
      "border-[#e6edf9] bg-[#f8faff] text-[#565e74]",
    tag:
      "border-[#e6edf9] bg-[#fbfcff] text-[#565e74]",
    accent:
      "bg-emerald-400",
  };
}

function getSeverityIcon(
  severity: InsightSeverity
) {
  if (severity === "critical") {
    return (
      <ShieldAlert size={15} />
    );
  }

  if (severity === "warning") {
    return (
      <AlertTriangle size={15} />
    );
  }

  if (severity === "positive") {
    return (
      <CheckCircle2 size={15} />
    );
  }

  return (
    <Info size={15} />
  );
}

function getSeverityLabel(
  severity: InsightSeverity
) {
  if (severity === "critical") {
    return "Critical";
  }

  if (severity === "warning") {
    return "Important";
  }

  if (severity === "positive") {
    return "Positive";
  }

  return "Insight";
}