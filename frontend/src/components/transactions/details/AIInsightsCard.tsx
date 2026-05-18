import { Brain } from "lucide-react";

export default function AIInsightsCard() {
  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <Brain size={22} />
        </div>

        <h2 className="text-2xl font-bold text-black">AI Insights</h2>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-[#eff4ff] p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Confidence Score
          </p>

          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-700 text-sm font-bold text-black">
              98%
            </div>

            <p className="text-sm leading-6 text-[#565e74]">
              High accuracy from historical frequency and vendor naming
              consistency.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-[#eff4ff] p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#565e74]">
            Reasoning
          </p>

          <p className="text-sm italic leading-6 text-black">
            “Matches previous monthly subscription patterns for CloudScale.”
          </p>
        </div>
      </div>
    </div>
  );
}