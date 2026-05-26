import { Sparkles } from "lucide-react";
import { ReportDashboard } from "@/types/report";

type AIReportInsightProps = {
  data: ReportDashboard["ai_insight"];
};

export default function AIReportInsight({ data }: AIReportInsightProps) {
  return (
    <div className="relative rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm md:col-span-4">
      <div className="mb-4 flex items-center gap-2 text-emerald-700">
        <Sparkles size={18} />
        <h3 className="text-[11px] font-bold uppercase tracking-widest">
          AI Intelligence Layer
        </h3>
      </div>

      <p className="mb-5 text-[13px] leading-6 text-black">
        {data.summary}
      </p>

      <div className="mt-auto space-y-3">
        <div className="rounded-2xl border border-[#c6c6cd] bg-[#e5eeff] p-3.5">
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Top Unusual Expense
          </p>

          <div className="flex justify-between gap-4">
            <span className="text-[13px] font-bold text-black">
              {data.top_unusual_title}
            </span>
            <span className="text-[13px] font-bold text-red-600">
              {data.top_unusual_amount}
            </span>
          </div>
        </div>

        <button className="w-full rounded-xl border border-emerald-700 py-2.5 text-[13px] font-bold text-emerald-700 transition hover:bg-emerald-700 hover:text-white">
          Review Insight
        </button>
      </div>
    </div>
  );
}