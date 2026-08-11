import {
  Brain,
  CheckCircle2,
  CircleAlert,
  Sparkles,
} from "lucide-react";

import type {
  TransactionDetails,
} from "@/types/transaction";

type AIInsightsCardProps = {
  insight: NonNullable<
    TransactionDetails["ai"]
  >;
};

export default function AIInsightsCard({
  insight,
}: AIInsightsCardProps) {
  const confidence =
    insight.confidence !== null
      ? Math.round(insight.confidence)
      : null;

  const confidenceConfig =
    getConfidenceConfig(confidence);

  const sourceConfig =
    getSourceConfig(
      insight.categorySource
    );

  return (
    <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Brain size={18} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[16px] font-bold tracking-tight text-black">
                Categorization Insights
              </h2>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                <Sparkles size={10} />
                Aura AI
              </span>
            </div>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              Understand how Aura classified
              this transaction.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Categorization */}
        <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
            Categorization Method
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${sourceConfig.iconClass}`}
            >
              {sourceConfig.icon}
            </div>

            <div>
              <p className="text-[13px] font-bold text-black">
                {sourceConfig.label}
              </p>

              <p className="mt-0.5 text-[10px] text-[#76777d]">
                {sourceConfig.description}
              </p>
            </div>
          </div>

          {/* AI confidence */}
          {insight.categorySource ===
            "ai" && (
            <div className="mt-5 border-t border-[#edf2fb] pt-4">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                    Confidence Score
                  </p>

                  <p
                    className={`mt-1 text-[22px] font-bold tracking-tight ${confidenceConfig.textClass}`}
                  >
                    {confidence !== null
                      ? `${confidence}%`
                      : "N/A"}
                  </p>
                </div>

                {confidence !==
                  null && (
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[9px] font-bold ${confidenceConfig.badgeClass}`}
                  >
                    {
                      confidenceConfig.label
                    }
                  </span>
                )}
              </div>

              {confidence !==
                null && (
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-[#e8edf7]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${confidenceConfig.barClass}`}
                      style={{
                        width: `${Math.min(
                          Math.max(
                            confidence,
                            0
                          ),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <p className="mt-3 text-[11px] leading-5 text-[#565e74]">
                {getConfidenceMessage(
                  confidence
                )}
              </p>
            </div>
          )}
        </div>

        {/* Reasoning */}
        <div className="flex flex-col rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
          <div className="flex items-center gap-2">
            <Sparkles
              size={14}
              className="text-emerald-700"
            />

            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
              Aura Reasoning
            </p>
          </div>

          <div className="mt-3 flex-1 rounded-xl border border-[#e6edf9] bg-white p-3.5">
            {insight.reason ? (
              <p className="text-[12px] leading-6 text-[#0b1c30]">
                “{insight.reason}”
              </p>
            ) : (
              <div className="flex items-start gap-2">
                <CircleAlert
                  size={14}
                  className="mt-0.5 shrink-0 text-[#8a92a5]"
                />

                <p className="text-[11px] leading-5 text-[#76777d]">
                  No categorization
                  reasoning is available for
                  this transaction.
                </p>
              </div>
            )}
          </div>

          {insight.reason && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700">
              <CheckCircle2
                size={12}
              />
              Explanation available
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function getSourceConfig(
  source: string
) {
  switch (source) {
    case "ai":
      return {
        label: "AI Generated",
        description:
          "Categorized using Aura AI",
        icon: <Brain size={15} />,
        iconClass:
          "border border-emerald-100 bg-emerald-50 text-emerald-700",
      };

    case "rule":
      return {
        label: "Rule Engine",
        description:
          "Matched using categorization rules",
        icon: (
          <CheckCircle2 size={15} />
        ),
        iconClass:
          "border border-cyan-100 bg-cyan-50 text-cyan-700",
      };

    case "user":
      return {
        label: "User Verified",
        description:
          "Selected or confirmed manually",
        icon: (
          <CheckCircle2 size={15} />
        ),
        iconClass:
          "border border-blue-100 bg-blue-50 text-blue-700",
      };

    default:
      return {
        label: "Uncategorized",
        description:
          "No categorization method applied",
        icon: (
          <CircleAlert size={15} />
        ),
        iconClass:
          "border border-amber-100 bg-amber-50 text-amber-700",
      };
  }
}

function getConfidenceConfig(
  confidence: number | null
) {
  if (confidence === null) {
    return {
      label: "Unavailable",
      textClass: "text-[#565e74]",
      badgeClass:
        "border-[#dce9ff] bg-[#eff4ff] text-[#565e74]",
      barClass: "bg-[#c6c6cd]",
    };
  }

  if (confidence >= 90) {
    return {
      label: "High Confidence",
      textClass:
        "text-emerald-700",
      badgeClass:
        "border-emerald-200 bg-emerald-50 text-emerald-700",
      barClass: "bg-emerald-600",
    };
  }

  if (confidence >= 70) {
    return {
      label: "Moderate",
      textClass: "text-amber-700",
      badgeClass:
        "border-amber-200 bg-amber-50 text-amber-700",
      barClass: "bg-amber-500",
    };
  }

  return {
    label: "Needs Review",
    textClass: "text-red-600",
    badgeClass:
      "border-red-200 bg-red-50 text-red-600",
    barClass: "bg-red-500",
  };
}

function getConfidenceMessage(
  confidence: number | null
) {
  if (confidence === null) {
    return "No confidence score is available for this transaction.";
  }

  if (confidence >= 90) {
    return "Aura has high confidence in the generated transaction category.";
  }

  if (confidence >= 70) {
    return "Aura has moderate confidence. You may want to verify this category.";
  }

  return "Aura has low confidence in this classification. Manual review is recommended.";
}