import { Sparkles, Info, Lightbulb } from "lucide-react";

export default function AIInsightsCard() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-white to-emerald-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-emerald-700" />

        <h3 className="text-base font-bold text-black">
          AI Insights
        </h3>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-800">
              Subscription Alert
            </span>

            <Info size={15} className="text-emerald-700" />
          </div>

          <p className="text-[13px] leading-5 text-[#0b1c30]">
            Your subscription spending increased this month. Review recurring payments.
          </p>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              Smart Tip
            </span>

            <Lightbulb size={15} className="text-indigo-700" />
          </div>

          <p className="text-[13px] leading-5 text-[#0b1c30]">
            You could save ₹5,000 this month by reducing dining and shopping by 15%.
          </p>
        </div>
      </div>
    </div>
  );
}