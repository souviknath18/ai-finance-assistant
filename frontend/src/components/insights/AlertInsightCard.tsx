import React from "react";

type AlertInsightCardProps = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  description: string;
  tone: "red" | "green";
};

export default function AlertInsightCard({
  icon,
  tag,
  title,
  description,
  tone,
}: AlertInsightCardProps) {
  const styles =
    tone === "red"
      ? {
          border: "border-red-100",
          accent: "border-l-red-600",
          icon: "bg-red-50 text-red-700",
          tag: "text-red-700",
        }
      : {
          border: "border-emerald-100",
          accent: "border-l-emerald-700",
          icon: "bg-emerald-50 text-emerald-700",
          tag: "text-emerald-700",
        };

  return (
    <div
      className={`flex flex-1 flex-col rounded-2xl border ${styles.border} border-l-4 ${styles.accent} bg-white p-5 shadow-sm`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
        >
          {icon}
        </div>

        <span
          className={`rounded-full bg-[#f8faff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${styles.tag}`}
        >
          {tag}
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