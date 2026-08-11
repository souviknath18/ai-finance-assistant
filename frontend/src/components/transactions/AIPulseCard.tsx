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
    description:
      "Netflix increased from $14 to $16 this month.",
    confidence: 96,
    confidenceLevel: "high",
    type: "subscription",
  },
  {
    id: "aws-spending-increase",
    title: "Cloud spending",
    description:
      "AWS spending is 18% above your monthly average.",
    confidence: 89,
    confidenceLevel: "high",
    type: "cloud",
  },
  {
    id: "food-spending-increase",
    title: "Dining activity",
    description:
      "Food delivery spending is 27% higher than usual.",
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
            (total, insight) =>
              total + insight.confidence,
            0
          ) / safeInsights.length
        )
      : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#dce9ff] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      {/* DECORATION */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative p-5 sm:p-6">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Brain size={18} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-bold tracking-tight text-black">
                  Aura Insights
                </h3>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  AI Active
                </span>
              </div>

              <p className="mt-1 text-[11px] font-medium text-[#76777d]">
                {generatedLabel}
              </p>
            </div>
          </div>

          <Sparkles
            size={19}
            className="shrink-0 text-emerald-400"
          />
        </div>

        {/* SUMMARY */}
        <div className="mt-5 rounded-xl border border-[#e5eeff] bg-[#f8faff] px-4 py-3.5">
          <p className="text-[12px] leading-5 text-[#565e74]">
            Aura analyzed your recent transactions and
            identified{" "}
            <span className="font-bold text-black">
              {safeInsights.length} important{" "}
              {safeInsights.length === 1
                ? "insight"
                : "insights"}
            </span>{" "}
            worth reviewing.
          </p>
        </div>

        {/* INSIGHTS */}
        <div className="mt-4 space-y-2.5">
          {safeInsights.length > 0 ? (
            safeInsights.map((insight) => (
              <InsightItem
                key={insight.id}
                insight={insight}
              />
            ))
          ) : (
            <EmptyInsights />
          )}
        </div>

        {/* CONFIDENCE */}
        {safeInsights.length > 0 && (
          <div className="mt-5 rounded-xl border border-[#e5eeff] bg-[#fbfcff] p-3.5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#76777d]">
                  Overall AI Confidence
                </p>

                <p className="mt-1 text-[15px] font-bold text-black">
                  {averageConfidence}%
                </p>
              </div>

              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                Pattern Analysis
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#e5eeff]">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{
                  width: `${Math.min(
                    Math.max(averageConfidence, 0),
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[10px] leading-4 text-[#76777d]">
              Confidence is calculated from detected
              transaction patterns and available financial
              context.
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="relative border-t border-[#e5eeff] bg-[#fbfcff] px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={onReviewInsightsAction}
          disabled={safeInsights.length === 0}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[12px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Review All Insights

          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </div>
  );
}

function InsightItem({
  insight,
}: {
  insight: AIInsight;
}) {
  const config = getInsightConfig(insight.type);

  return (
    <div className="group rounded-xl border border-[#e5eeff] bg-white p-3.5 transition hover:border-[#d3def2] hover:bg-[#fbfcff]">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${config.iconClassName}`}
        >
          {config.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-[12px] font-bold text-black">
              {insight.title}
            </p>

            <ConfidenceBadge
              confidence={insight.confidence}
              level={insight.confidenceLevel}
            />
          </div>

          <p className="mt-1.5 text-[11px] leading-5 text-[#565e74]">
            {insight.description}
          </p>
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
  const styles: Record<
    InsightConfidence,
    string
  > = {
    high:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    medium:
      "border-amber-200 bg-amber-50 text-amber-700",
    low:
      "border-red-200 bg-red-50 text-red-600",
  };

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${styles[level]}`}
    >
      {confidence}%
    </span>
  );
}

function EmptyInsights() {
  return (
    <div className="rounded-xl border border-dashed border-[#dce9ff] bg-[#fbfcff] px-4 py-7 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#eff4ff] text-[#76777d]">
        <Brain size={18} />
      </div>

      <p className="mt-3 text-[12px] font-bold text-black">
        No new insights yet
      </p>

      <p className="mx-auto mt-1 max-w-[300px] text-[11px] leading-5 text-[#76777d]">
        Aura will surface useful financial patterns as more
        transactions are analyzed.
      </p>
    </div>
  );
}

function getInsightConfig(
  type: AIInsight["type"]
) {
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