import React from "react";

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
  const styles = getToneStyles(tone);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
              {title}
            </p>

            <h3
              className={`mt-2 text-[22px] font-bold leading-none tracking-tight ${styles.value}`}
            >
              {value}
            </h3>
          </div>

          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${styles.icon}`}
          >
            {icon}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12px] leading-5 text-[#565e74]">
          {description}
        </p>

        {children && (
          <>
            <div className="my-4 h-px bg-[#edf2fb]" />

            <div className="flex flex-1 flex-col">
              {children}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function getToneStyles(
  tone: InsightMetricCardProps["tone"]
) {
  switch (tone) {
    case "green":
      return {
        icon:
          "border-emerald-100 bg-emerald-50 text-emerald-700",
        value: "text-emerald-700",
      };

    case "red":
      return {
        icon:
          "border-red-100 bg-red-50 text-red-600",
        value: "text-red-700",
      };

    case "purple":
      return {
        icon:
          "border-indigo-100 bg-indigo-50 text-indigo-700",
        value: "text-indigo-700",
      };

    default:
      return {
        icon:
          "border-[#e6edf9] bg-[#f8faff] text-[#565e74]",
        value: "text-black",
      };
  }
}