import { Brain } from "lucide-react";
import type { TransactionDetails } from "@/types/transaction";

type AIInsightsCardProps = {
  insight: NonNullable<TransactionDetails["ai"]>;
};

export default function AIInsightsCard({
  insight,
}: AIInsightsCardProps) {
  const confidence =
    insight.confidence !== null
      ? Math.round(insight.confidence)
      : null;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
          <Brain size={20} />
        </div>

        <h2 className="text-lg font-bold text-black">
          AI Insights
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-[#eff4ff] p-4">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Confidence Score
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-emerald-700 text-[13px] font-bold text-black">
              {confidence !== null
                ? `${confidence}%`
                : "N/A"}
            </div>

            <p className="text-[13px] leading-6 text-[#565e74]">
              {getConfidenceMessage(confidence)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-[#eff4ff] p-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Reasoning
          </p>

          <p className="text-[13px] italic leading-6 text-black">
            {insight.reason
              ? `“${insight.reason}”`
              : "No AI reasoning is available for this transaction."}
          </p>
        </div>
      </div>
    </div>
  );
}

function getConfidenceMessage(
  confidence: number | null,
) {
  if (confidence === null) {
    return "No confidence score is available.";
  }

  if (confidence >= 90) {
    return "High confidence in the AI-generated transaction category.";
  }

  if (confidence >= 70) {
    return "Moderate confidence. You may want to verify the category.";
  }

  return "Low confidence. This transaction may need manual review.";
}