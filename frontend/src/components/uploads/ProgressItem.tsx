"use client";

import { useEffect, useMemo, useState } from "react";

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
  const backendProgress = useMemo(() => {
    const value = Number(width.replace("%", ""));
    return Number.isFinite(value) ? value : 5;
  }, [width]);

  const [visualProgress, setVisualProgress] = useState(
    Math.max(backendProgress, 5)
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVisualProgress((prev) => {
        if (completing) {
          return Math.min(prev + 12, 100);
        }

        const realTarget = Math.max(backendProgress, 5);
        const softTarget = Math.min(Math.max(realTarget + 18, prev + 1), 94);

        if (prev < realTarget) {
          return Math.min(prev + 6, realTarget);
        }

        return Math.min(prev + 0.8, softTarget);
      });
    }, 180);

    return () => window.clearInterval(interval);
  }, [backendProgress, completing]);

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all duration-300 ${
        analyzing || completing
          ? "border-emerald-100 bg-emerald-50"
          : "border-[#c6c6cd] bg-[#f8f9ff]"
      }`}
    >
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="shrink-0 text-[#565e74]">{icon}</span>
          <span className="truncate text-[13px] font-semibold text-black">
            {title}
          </span>
        </div>

        <span
          className={`shrink-0 text-[11px] font-bold ${
            analyzing || completing ? "text-emerald-700" : "text-black"
          }`}
        >
          {(analyzing || completing) && (
            <span className="mr-2 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-700" />
          )}
          {completing ? "Completing..." : progress}
        </span>
      </div>

      <div className="relative h-1.5 overflow-hidden rounded-full bg-[#dce9ff]">
        <div
          className={`relative h-full rounded-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${visualProgress}%` }}
        >
          <div className="absolute inset-0 animate-[progressShimmer_1.1s_linear_infinite] bg-gradient-to-r from-transparent via-white/45 to-transparent" />
        </div>
      </div>
    </div>
  );
}