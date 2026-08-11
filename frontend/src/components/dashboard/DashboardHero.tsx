"use client";

import { useRouter } from "next/navigation";

import {
  FileText,
  MessageCircle,
  Sparkles,
  Upload,
} from "lucide-react";

type DashboardHeroProps = {
  hasData: boolean;
};

export default function DashboardHero({
  hasData,
}: DashboardHeroProps) {
  const router = useRouter();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <section className="mb-5 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1">
            <Sparkles
              size={11}
              className="text-emerald-700"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              AI Financial Intelligence
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-black sm:text-[22px]">
            {greeting}, Souvik
          </h1>

          <p className="mt-1.5 max-w-2xl text-[12px] leading-5 text-[#565e74]">
            Gain a unified view of your financial activity with AI-powered
            transaction analysis, budget tracking, subscription monitoring,
            and semantic search across your financial data.
          </p>

          {!hasData && (
            <div className="mt-4 inline-flex max-w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
              <p className="text-[11px] font-semibold leading-5 text-emerald-800">
                Upload your first statement to unlock personalized insights
                and automated financial analysis.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto lg:shrink-0">
          <button
            type="button"
            onClick={() =>
              router.push("/reports")
            }
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#e6edf9] bg-white px-4 text-[11px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#d6e2f3] hover:bg-[#f8faff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
          >
            <FileText size={14} />
            Generate Report
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/chat")
            }
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#e6edf9] bg-white px-4 text-[11px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
          >
            <MessageCircle size={14} />
            Ask Aura
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/uploads")
            }
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-black px-5 text-[11px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)]"
          >
            <Upload size={14} />
            Upload Statement
          </button>
        </div>
      </div>
    </section>
  );
}