"use client";

import {
  AlertTriangle,
  ArrowLeft,
  LoaderCircle,
  RotateCcw,
} from "lucide-react";

type ErrorScreenProps = {
  title?: string;
  message: string;
  retryText?: string;
  backText?: string;
  isRetrying?: boolean;
  onRetryAction?: () => void;
  onBackAction?: () => void;
};

export default function ErrorScreen({
  title = "Something went wrong",
  message,
  retryText = "Try Again",
  backText = "Back",
  isRetrying = false,
  onRetryAction,
  onBackAction,
}: ErrorScreenProps) {
  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center overflow-hidden px-6 py-6">
      <div className="flex max-w-lg flex-col items-center text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle
            size={32}
            strokeWidth={2.2}
            className="text-red-500"
          />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
          Request Failed
        </p>

        <h1 className="mt-2 text-[26px] font-bold tracking-tight text-[#0b1c30]">
          {title}
        </h1>

        <p className="mt-3 max-w-md text-[14px] leading-6 text-[#667085]">
          {message}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {onRetryAction && (
            <button
              type="button"
              onClick={onRetryAction}
              disabled={isRetrying}
              aria-busy={isRetrying}
              className="inline-flex min-w-[165px] items-center justify-center gap-2 rounded-xl bg-[#0b1c30] px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#16314f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRetrying ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  Reloading...
                </>
              ) : (
                <>
                  <RotateCcw size={15} />
                  {retryText}
                </>
              )}
            </button>
          )}

          {onBackAction && (
            <button
              type="button"
              onClick={onBackAction}
              disabled={isRetrying}
              className="inline-flex items-center gap-2 rounded-xl border border-[#d9e2f1] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#4f5b70] transition-all duration-200 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ArrowLeft size={15} />
              {backText}
            </button>
          )}
        </div>

        <p className="mt-6 text-[12px] text-[#98a2b3]">
          Please try again. If the issue persists, it may be a temporary server
          problem.
        </p>
      </div>
    </section>
  );
}