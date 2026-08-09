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
  const styles = getSeverityStyles(
    severity
  );

  return (
    <div
      className={`flex flex-1 flex-col rounded-2xl border ${styles.border} border-l-4 ${styles.accent} bg-white p-5 shadow-sm`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon ??
            getSeverityIcon(
              severity
            )}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${styles.tag}`}
        >
          {tag ??
            getSeverityLabel(
              severity
            )}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-[13px] font-bold leading-5 text-black">
          {title}
        </h3>

        <p className="mt-1.5 text-[13px] leading-5 text-[#565e74]">
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
      accent: "border-l-red-700",
      icon: "bg-red-50 text-red-700",
      tag: "bg-red-50 text-red-700",
    };
  }

  if (severity === "warning") {
    return {
      border: "border-amber-100",
      accent: "border-l-amber-500",
      icon: "bg-amber-50 text-amber-700",
      tag: "bg-amber-50 text-amber-700",
    };
  }

  if (severity === "positive") {
    return {
      border: "border-emerald-100",
      accent: "border-l-emerald-700",
      icon: "bg-emerald-50 text-emerald-700",
      tag: "bg-emerald-50 text-emerald-700",
    };
  }

  return {
    border: "border-[#e5eeff]",
    accent: "border-l-[#9fb7d7]",
    icon: "bg-[#eff4ff] text-[#565e74]",
    tag: "bg-[#eff4ff] text-[#565e74]",
  };
}


function getSeverityIcon(
  severity: InsightSeverity
) {
  if (severity === "critical") {
    return (
      <ShieldAlert size={18} />
    );
  }

  if (severity === "warning") {
    return (
      <AlertTriangle size={18} />
    );
  }

  if (severity === "positive") {
    return (
      <CheckCircle2 size={18} />
    );
  }

  return <Info size={18} />;
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