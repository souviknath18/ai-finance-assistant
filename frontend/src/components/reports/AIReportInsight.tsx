import {
  AlertTriangle,
  Sparkles,
} from "lucide-react";

import { ReportDashboard } from "@/types/report";

type AIReportInsightProps = {
  data: ReportDashboard["ai_insight"];
};

export default function AIReportInsight({
  data,
}: AIReportInsightProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] md:col-span-4">
      <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Sparkles
              size={17}
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              Aura Intelligence
            </p>

            <h2 className="mt-0.5 text-[15px] font-bold text-black">
              AI Report Insight
            </h2>
          </div>
        </div>

        <p className="text-[12px] leading-6 text-[#565e74]">
          {data.summary}
        </p>
      </div>

      <div className="relative z-10 mt-auto pt-5">
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-red-600">
            <AlertTriangle
              size={14}
            />

            <p className="text-[9px] font-bold uppercase tracking-[0.12em]">
              Top Unusual Expense
            </p>
          </div>

          <div className="flex items-start justify-between gap-3">
            <span className="text-[12px] font-bold text-black">
              {
                data.top_unusual_title
              }
            </span>

            <span className="shrink-0 text-[13px] font-bold text-red-600">
              {
                data.top_unusual_amount
              }
            </span>
          </div>
        </div>

        <button
          type="button"
          className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[12px] font-bold text-black transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
        >
          Review Insight
        </button>
      </div>
    </div>
  );
}