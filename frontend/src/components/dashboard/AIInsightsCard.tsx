import { Sparkles, Info, Lightbulb } from "lucide-react";

export default function AIInsightsCard() {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Sparkles size={20} className="text-emerald-700" />

        <h3 className="text-lg font-bold text-black">
          AI Insights
        </h3>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-emerald-800">
              Subscription Alert
            </span>

            <Info size={16} className="text-emerald-700" />
          </div>

          <p className="text-sm leading-6 text-[#0b1c30]">
            Your subscription spending increased this month. Review recurring payments.
          </p>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide text-indigo-700">
              Smart Tip
            </span>

            <Lightbulb size={16} className="text-indigo-700" />
          </div>

          <p className="text-sm leading-6 text-[#0b1c30]">
            You could save ₹5,000 this month by reducing dining and shopping by 15%.
          </p>
        </div>
      </div>
    </div>
  );
}