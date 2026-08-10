"use client";

import {
  Bot,
  Sparkles,
  Star,
} from "lucide-react";

import { ExecutiveSummary } from "@/types/insights";

type HeroInsightCardProps = {
  summary: ExecutiveSummary;
};

export default function HeroInsightCard({
  summary,
}: HeroInsightCardProps) {
  const confidencePercent = Math.round(
    Math.min(
      Math.max(summary.confidence || 0, 0),
      1
    ) * 100
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:col-span-8">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -bottom-5 -right-3 text-emerald-50">
        <Sparkles
          size={120}
          strokeWidth={1}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4 border-b border-[#edf2fb] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Star size={17} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              AI Executive Summary
            </h3>

            <p className="text-[12px] text-[#565e74]">
              Personalized financial analysis from Aura
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge
            source={summary.source}
          />

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8eefb] bg-[#fbfcff] px-3 py-1 text-[10px] font-bold text-[#565e74]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

            {confidencePercent}% confidence
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 p-5 sm:p-6">
        {/* AI label */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
          <Sparkles
            size={12}
            className="text-emerald-700"
          />

          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
            Aura Analysis
          </span>
        </div>

        {/* Headline */}
        <h2 className="max-w-3xl text-[21px] font-bold leading-[1.4] tracking-tight text-black sm:text-[23px]">
          {summary.headline}
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-3xl text-[13px] leading-6 text-[#565e74]">
          {summary.description}
        </p>

        {/* Recommendation */}
        {summary.recommendation && (
          <div className="mt-6 max-w-3xl overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 via-[#fbfffd] to-white">
            <div className="flex items-start gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                <Sparkles size={15} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  Aura Recommendation
                </p>

                <p className="mt-1.5 text-[13px] font-medium leading-6 text-[#374151]">
                  {summary.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="/chat"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)]"
          >
            <Bot
              size={15}
              className="shrink-0"
            />

            Ask Aura About This
          </a>

          <a
            href="#recent-observations"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-5 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
          >
            View Details
          </a>
        </div>
      </div>

      {/* Bottom status strip */}
      <div className="relative z-10 flex flex-col gap-2 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] font-medium text-[#7c839b]">
          Generated from your verified financial activity
        </p>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className="text-[10px] font-bold text-emerald-700">
            Aura Intelligence Active
          </span>
        </div>
      </div>
    </div>
  );
}

function SourceBadge({
  source,
}: {
  source: ExecutiveSummary["source"];
}) {
  if (source === "ai") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
        <Sparkles size={10} />

        AI Generated
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8eefb] bg-[#fbfcff] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#565e74]">
      Rule Based
    </span>
  );
}