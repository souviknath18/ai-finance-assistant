"use client";

import {
  AlertTriangle,
  ArrowRight,
  Brain,
  Cloud,
  CreditCard,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

type InsightConfidence = "high" | "medium" | "low";

type AIInsight = {
  id: string;
  title: string;
  description: string;
  confidence: number;
  confidenceLevel: InsightConfidence;
  type: "subscription" | "cloud" | "food" | "spending";
};

type AIPulseCardProps = {
  insights?: AIInsight[];
  generatedLabel?: string;
  onReviewInsightsAction?: () => void;
};

const defaultInsights: AIInsight[] = [
  {
    id: "netflix-price-increase",
    title: "Subscription increase",
    description: "Netflix increased from $14 to $16 this month.",
    confidence: 96,
    confidenceLevel: "high",
    type: "subscription",
  },
  {
    id: "aws-spending-increase",
    title: "Cloud spending",
    description: "AWS spending is 18% above your monthly average.",
    confidence: 89,
    confidenceLevel: "high",
    type: "cloud",
  },
  {
    id: "food-spending-increase",
    title: "Dining activity",
    description: "Food delivery spending is 27% higher than usual.",
    confidence: 78,
    confidenceLevel: "medium",
    type: "food",
  },
];

export default function AIPulseCard({
  insights = defaultInsights,
  generatedLabel = "Updated today",
  onReviewInsightsAction,
}: AIPulseCardProps) {
  const safeInsights = insights.slice(0, 3);

  const averageConfidence =
    safeInsights.length > 0
      ? Math.round(
          safeInsights.reduce(
            (total, insight) => total + insight.confidence,
            0
          ) / safeInsights.length
        )
      : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#dfe9fb] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100/70 blur-3xl" />

      <div className="relative p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Brain size={18} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight text-black sm:text-[17px]">
                  Aura Insights
                </h3>

                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-ai-active-glow rounded-full bg-emerald-500" />
                  AI Active
                </span>
              </div>

              <p className="mt-1 text-[11px] font-medium text-[#7c839b]">
                {generatedLabel}
              </p>
            </div>
          </div>

          <Sparkles
            size={20}
            className="shrink-0 text-emerald-300"
          />
        </div>

        {/* SUMMARY */}
        <div className="mt-5 rounded-xl border border-[#e5eeff] bg-[#f8faff] p-4">
          <p className="text-[13px] leading-5 text-[#565e74]">
            Aura analyzed your recent activity and found{" "}
            <span className="font-bold text-black">
              {safeInsights.length} important{" "}
              {safeInsights.length === 1 ? "insight" : "insights"}
            </span>{" "}
            worth reviewing.
          </p>
        </div>

        {/* INSIGHTS */}
        <div className="mt-4 space-y-3">
          {safeInsights.length > 0 ? (
            safeInsights.map((insight) => (
              <InsightItem key={insight.id} insight={insight} />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-[#dbe5f5] bg-[#fbfcff] px-4 py-6 text-center">
              <Brain
                size={22}
                className="mx-auto text-[#9aa5ba]"
              />

              <p className="mt-2 text-[13px] font-bold text-black">
                No new insights yet
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#7c839b]">
                Aura will surface useful patterns as more transactions are
                analyzed.
              </p>
            </div>
          )}
        </div>

        {/* CONFIDENCE */}
        {safeInsights.length > 0 && (
          <div className="mt-5 rounded-xl border border-[#e5eeff] bg-white p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
                  Overall AI confidence
                </p>

                <p className="mt-1 text-[15px] font-bold text-black">
                  {averageConfidence}%
                </p>
              </div>

              <div className="min-w-[110px] flex-1">
                <div className="h-2 overflow-hidden rounded-full bg-[#edf2fb]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        Math.max(averageConfidence, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-1.5 text-right text-[9px] font-semibold text-[#7c839b]">
                  Based on detected patterns
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-[#e5eeff] bg-[#fbfcff] p-4 sm:px-6">
        <button
          type="button"
          onClick={onReviewInsightsAction}
          disabled={safeInsights.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[12px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review all insights
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function InsightItem({ insight }: { insight: AIInsight }) {
  const config = getInsightConfig(insight.type);

  return (
    <div className="group rounded-xl border border-[#e5eeff] bg-white p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconClassName}`}
        >
          {config.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-black">
                {insight.title}
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
                {insight.description}
              </p>
            </div>

            <ConfidenceBadge
              confidence={insight.confidence}
              level={insight.confidenceLevel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfidenceBadge({
  confidence,
  level,
}: {
  confidence: number;
  level: InsightConfidence;
}) {
  const classes = {
    high: "border-emerald-200 bg-emerald-50 text-emerald-700",
    medium: "border-amber-200 bg-amber-50 text-amber-700",
    low: "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${classes[level]}`}
    >
      {confidence}% confidence
    </span>
  );
}

function getInsightConfig(type: AIInsight["type"]) {
  switch (type) {
    case "subscription":
      return {
        icon: <CreditCard size={16} />,
        iconClassName:
          "border border-violet-100 bg-violet-50 text-violet-700",
      };

    case "cloud":
      return {
        icon: <Cloud size={16} />,
        iconClassName:
          "border border-sky-100 bg-sky-50 text-sky-700",
      };

    case "food":
      return {
        icon: <UtensilsCrossed size={16} />,
        iconClassName:
          "border border-orange-100 bg-orange-50 text-orange-700",
      };

    case "spending":
      return {
        icon: <TrendingUp size={16} />,
        iconClassName:
          "border border-rose-100 bg-rose-50 text-rose-700",
      };

    default:
      return {
        icon: <AlertTriangle size={16} />,
        iconClassName:
          "border border-amber-100 bg-amber-50 text-amber-700",
      };
  }
}