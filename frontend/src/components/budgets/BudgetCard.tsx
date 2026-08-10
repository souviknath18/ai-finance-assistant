import React from "react";

type BudgetCardProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  progress: number;
  badge?: string;
  warning?: string;
  tone?: "default" | "red";
  className?: string;
};

export default function BudgetCard({
  icon,
  title,
  subtitle,
  amount,
  progress,
  badge,
  warning,
  tone = "default",
  className = "",
}: BudgetCardProps) {
  const isRed = tone === "red";

  // Prevent the progress bar from overflowing the card.
  // The percentage text can still show values above 100%.
  const safeProgress = Math.min(
    Math.max(progress, 0),
    100
  );

  return (
    <div
      className={`
        flex flex-col
        rounded-3xl
        border
        bg-white
        p-5
        shadow-[0_4px_16px_rgba(15,23,42,0.04)]
        transition-[border-color,box-shadow]
        duration-200
        ${
          isRed
            ? "border-red-100 hover:border-red-200 hover:shadow-[0_6px_20px_rgba(239,68,68,0.06)]"
            : "border-[#e6edf9] hover:border-[#dbe5f5] hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)]"
        }
        ${className}
      `}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        {/* Icon */}
        <div
          className={`
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-2xl border
            ${
              isRed
                ? "border-red-100 bg-red-50 text-red-600"
                : "border-[#e6edf9] bg-[#f8faff] text-black"
            }
          `}
        >
          {icon}
        </div>

        {/* Status Badge */}
        {badge && (
          <span
            className={`
              inline-flex items-center gap-1.5
              rounded-full border
              px-2.5 py-1
              text-[9px] font-bold
              uppercase tracking-wide
              ${
                isRed
                  ? "border-red-100 bg-red-50 text-red-600"
                  : "border-emerald-100 bg-emerald-50 text-emerald-700"
              }
            `}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isRed
                  ? "bg-red-500"
                  : "bg-emerald-500"
              }`}
            />

            {badge}
          </span>
        )}
      </div>

      {/* Category */}
      <div>
        <h3 className="text-[15px] font-bold tracking-tight text-black">
          {title}
        </h3>

        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
          {subtitle}
        </p>
      </div>

      {/* Budget Usage */}
      <div className="mt-auto pt-5">
        <div className="mb-2.5 flex items-end justify-between gap-3">
          <p
            className={`text-[14px] font-bold ${
              isRed
                ? "text-red-600"
                : "text-black"
            }`}
          >
            {amount}
          </p>

          <span
            className={`shrink-0 text-[10px] font-bold ${
              isRed
                ? "text-red-600"
                : "text-[#565e74]"
            }`}
          >
            {Math.round(progress)}% used
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#edf2fb]">
          <div
            className={`h-full rounded-full transition-[width] duration-500 ${
              isRed
                ? "bg-red-600"
                : "bg-emerald-600"
            }`}
            style={{
              width: `${safeProgress}%`,
            }}
          />
        </div>

        {/* Warning */}
        {warning && (
          <div className="mt-3 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2">
            <p className="text-[11px] font-semibold leading-5 text-red-600">
              {warning}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}