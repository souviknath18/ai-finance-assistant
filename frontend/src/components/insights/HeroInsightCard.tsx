"use client";

import Link from "next/link";

import {
  Bot,
  Sparkles,
  Star,
} from "lucide-react";

import type {
  ExecutiveSummary,
} from "@/types/insights";

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
    <section className="relative overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)] md:col-span-8">
      {/* Header */}
      <div className="relative z-10 flex flex-col gap-3 border-b border-[#edf2fb] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Star size={17} />
          </div>

          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-black">
              AI Executive Summary
            </h3>

            <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
              Personalized financial analysis from Aura.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SourceBadge source={summary.source} />

          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2.5 py-1 text-[9px] font-bold text-[#565e74]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {confidencePercent}% confidence
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1">
          <Sparkles
            size={11}
            className="text-emerald-700"
          />

          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700">
            Aura Analysis
          </span>
        </div>

        <h2 className="mt-4 max-w-3xl text-[20px] font-bold leading-[1.35] tracking-tight text-black sm:text-[22px]">
          {summary.headline}
        </h2>

        <p className="mt-2.5 max-w-3xl text-[12px] leading-5 text-[#565e74]">
          {summary.description}
        </p>

        {summary.recommendation && (
          <div className="mt-5 max-w-3xl rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
                <Sparkles size={14} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                  Aura Recommendation
                </p>

                <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
                  {summary.recommendation}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5">
          <Link
            href="/chat"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[11px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)]"
          >
            <Bot size={14} />
            Ask Aura About This
          </Link>

          <a
            href="#recent-observations"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e6edf9] bg-white px-4 text-[11px] font-bold text-black transition-[background-color,border-color,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700"
          >
            View Details
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-col gap-2 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[9px] font-medium text-[#7c839b]">
          Generated from your verified financial activity
        </p>

        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

          <span className="text-[9px] font-bold text-emerald-700">
            Aura Intelligence Active
          </span>
        </div>
      </div>
    </section>
  );
}

function SourceBadge({
  source,
}: {
  source: ExecutiveSummary["source"];
}) {
  if (source === "ai") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
        <Sparkles size={10} />
        AI Generated
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2.5 py-1 text-[9px] font-bold text-[#565e74]">
      Rule Based
    </span>
  );
}