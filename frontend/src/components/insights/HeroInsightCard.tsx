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
      Math.max(
        summary.confidence || 0,
        0
      ),
      1
    ) * 100
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#e5eeff] bg-white p-6 shadow-sm md:col-span-8 md:p-7">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -right-6 -top-8 text-[#eff4ff]">
        <Sparkles
          size={130}
          strokeWidth={1}
        />
      </div>

      <div className="pointer-events-none absolute bottom-5 right-6 text-[#dce9ff]">
        <Sparkles
          size={70}
          strokeWidth={1.2}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Star size={15} />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">
              AI Executive Summary
            </span>
          </div>

          <div className="flex items-center gap-2">
            <SourceBadge
              source={summary.source}
            />

            <span className="rounded-full border border-[#e5eeff] bg-[#f8faff] px-2.5 py-1 text-[10px] font-bold text-[#565e74]">
              {confidencePercent}% confidence
            </span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="max-w-2xl text-[22px] font-bold leading-[1.35] tracking-tight text-black md:text-2xl">
          {summary.headline}
        </h2>

        {/* Description */}
        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-[#565e74]">
          {summary.description}
        </p>

        {/* Recommendation */}
        {summary.recommendation && (
          <div className="mt-5 max-w-2xl rounded-xl border border-[#e5eeff] bg-[#f8faff] p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#dce9ff] text-black">
                <Sparkles size={14} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#565e74]">
                  Aura Recommendation
                </p>

                <p className="mt-1.5 text-[13px] font-semibold leading-5 text-black">
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
            className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90"
          >
            <Bot size={15} />

            Ask Aura About This
          </a>

          <a
            href="#recent-observations"
            className="rounded-xl border border-[#e5eeff] bg-white px-5 py-2.5 text-[13px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff]"
          >
            View Details
          </a>
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
      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
        AI Generated
      </span>
    );
  }

  return (
    <span className="rounded-full border border-[#e5eeff] bg-[#f8faff] px-2.5 py-1 text-[10px] font-bold text-[#565e74]">
      Rule Based
    </span>
  );
}