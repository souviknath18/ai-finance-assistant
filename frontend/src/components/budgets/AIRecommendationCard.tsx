import { Lightbulb } from "lucide-react";

export default function AIRecommendationCard() {
  return (
    <div className="mb-8 flex items-start gap-5 rounded-3xl border border-emerald-200 bg-white p-6 shadow-[0_0_15px_rgba(107,216,203,0.18)]">
      <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
        <Lightbulb size={22} />
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
          AI Recommendation
        </p>

        <h2 className="text-2xl font-bold text-black">
          Reduce Food budget by 12%
        </h2>

        <p className="mt-2 text-sm leading-7 text-[#565e74]">
          Based on your spending patterns from the last 3 months, you
          consistently spend ₹14,000 less than your Food limit. Reallocating
          this to Goals could help you reach your vacation target 2 months
          earlier.
        </p>
      </div>
    </div>
  );
}