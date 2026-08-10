import React from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldAlert,
} from "lucide-react";

import { InsightSeverity } from "@/types/insights";

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
    <div
      className={`
        flex
        h-full
        flex-1
        flex-col
        rounded-3xl
        border
        ${styles.border}
        border-l-4
        ${styles.accent}
        bg-white
        p-5
        shadow-[0_6px_24px_rgba(15,23,42,0.06)]
        transition-[border-color,box-shadow]
        duration-200
        hover:shadow-[0_8px_26px_rgba(15,23,42,0.08)]
      `}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          className={`
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            ${styles.icon}
          `}
        >
          {icon ?? getSeverityIcon(severity)}
        </div>

        <span
          className={`
            shrink-0
            rounded-full
            border
            px-2.5
            py-1
            text-[9px]
            font-bold
            uppercase
            tracking-[0.12em]
            ${styles.tag}
          `}
        >
          {tag ?? getSeverityLabel(severity)}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-[13px] font-bold leading-5 text-black">
          {title}
        </h3>

        <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
          {description}
        </p>
      </div>
    </div>
  );
}

function getSeverityStyles(
  severity: InsightSeverity
) {
  if (severity === "critical") {
    return {
      border: "border-red-100",
      accent: "border-l-red-600",
      icon:
        "border-red-100 bg-red-50 text-red-700",
      tag:
        "border-red-100 bg-red-50 text-red-700",
    };
  }

  if (severity === "warning") {
    return {
      border: "border-amber-100",
      accent: "border-l-amber-500",
      icon:
        "border-amber-100 bg-amber-50 text-amber-700",
      tag:
        "border-amber-100 bg-amber-50 text-amber-700",
    };
  }

  if (severity === "positive") {
    return {
      border: "border-emerald-100",
      accent: "border-l-emerald-600",
      icon:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
      tag:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
    };
  }

  return {
    border: "border-[#e6edf9]",
    accent: "border-l-emerald-500",
    icon:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    tag:
      "border-[#e8eefb] bg-[#fbfcff] text-[#565e74]",
  };
}

function getSeverityIcon(
  severity: InsightSeverity
) {
  if (severity === "critical") {
    return <ShieldAlert size={17} />;
  }

  if (severity === "warning") {
    return <AlertTriangle size={17} />;
  }

  if (severity === "positive") {
    return <CheckCircle2 size={17} />;
  }

  return <Info size={17} />;
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