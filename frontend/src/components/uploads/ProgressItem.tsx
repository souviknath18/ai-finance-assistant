"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type ProgressItemProps = {
  icon: React.ReactNode;
  title: string;
  progress: string;
  width: string;
  color: string;
  analyzing?: boolean;
  completing?: boolean;
};

export default function ProgressItem({
  icon,
  title,
  progress,
  width,
  color,
  analyzing = false,
  completing = false,
}: ProgressItemProps) {
  const backendProgress =
    useMemo(() => {
      const value = Number(
        width.replace("%", "")
      );

      return Number.isFinite(
        value
      )
        ? value
        : 5;
    }, [width]);

  const [
    visualProgress,
    setVisualProgress,
  ] = useState(
    Math.max(
      backendProgress,
      5
    )
  );

  useEffect(() => {
    setVisualProgress((prev) =>
      Math.max(
        prev,
        backendProgress,
        5
      )
    );
  }, [backendProgress]);

  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setVisualProgress(
            (prev) => {
              if (completing) {
                return Math.min(
                  prev + 12,
                  100
                );
              }

              const realTarget =
                Math.max(
                  backendProgress,
                  5
                );

              const softTarget =
                Math.min(
                  Math.max(
                    realTarget +
                      18,
                    prev + 1
                  ),
                  94
                );

              if (
                prev <
                realTarget
              ) {
                return Math.min(
                  prev + 6,
                  realTarget
                );
              }

              return Math.min(
                prev + 0.8,
                softTarget
              );
            }
          );
        },
        180
      );

    return () =>
      window.clearInterval(
        interval
      );
  }, [
    backendProgress,
    completing,
  ]);

  const active =
    analyzing ||
    completing;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        active
          ? "border-emerald-100 bg-emerald-50/50"
          : "border-[#edf2fb] bg-[#fbfcff]"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
              active
                ? "border-emerald-100 bg-white text-emerald-700"
                : "border-[#e6edf9] bg-white text-[#565e74]"
            }`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <p
              title={title}
              className="truncate text-[12px] font-bold text-black"
            >
              {title}
            </p>

            <p className="mt-1 text-[10px] leading-4 text-[#76777d]">
              {completing
                ? "Finalizing extracted results"
                : analyzing
                ? "Aura is analyzing this document"
                : "Waiting to begin processing"}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold ${
            active
              ? "border-emerald-200 bg-white text-emerald-700"
              : "border-[#dce9ff] bg-white text-[#565e74]"
          }`}
        >
          {active && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600" />
          )}

          {completing
            ? "Completing..."
            : progress}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
        <div
          className={`relative h-full rounded-full ${color} transition-[width] duration-300 ease-out`}
          style={{
            width: `${Math.min(
              Math.max(
                visualProgress,
                0
              ),
              100
            )}%`,
          }}
        >
          {active && (
            <div className="absolute inset-0 animate-[progressShimmer_1.1s_linear_infinite] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}