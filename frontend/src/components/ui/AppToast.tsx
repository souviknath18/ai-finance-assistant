"use client";

import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

type AppToastProps = {
  show: boolean;
  type?: "success" | "error" | "info";
  title: string;
  message?: string;
  onCloseAction: () => void;
};

const toastStyles = {
  success: {
    icon: CheckCircle2,
    background: "bg-emerald-50",
    border: "border-emerald-200",
    iconContainer:
      "border-emerald-200 bg-white text-emerald-700",
  },

  error: {
    icon: AlertCircle,
    background: "bg-red-50",
    border: "border-red-200",
    iconContainer:
      "border-red-200 bg-white text-red-600",
  },

  info: {
    icon: Info,
    background: "bg-[#eff4ff]",
    border: "border-[#d3e4fe]",
    iconContainer:
      "border-[#d3e4fe] bg-white text-[#565e74]",
  },
};

export default function AppToast({
  show,
  type = "success",
  title,
  message,
  onCloseAction,
}: AppToastProps) {
  if (!show) {
    return null;
  }

  const current =
    toastStyles[type];

  const Icon = current.icon;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] w-[calc(100%-2rem)] max-w-[380px] sm:right-5 sm:top-5">
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-auto rounded-2xl border ${current.border} ${current.background} p-4 shadow-[0_12px_35px_rgba(15,23,42,0.12)]`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${current.iconContainer}`}
          >
            <Icon size={16} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[12px] font-bold leading-5 text-black">
              {title}
            </p>

            {message && (
              <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
                {message}
              </p>
            )}
          </div>

          {/* Close */}
          <button
            type="button"
            aria-label="Close notification"
            onClick={onCloseAction}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#565e74] transition hover:bg-white/70 hover:text-black"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}