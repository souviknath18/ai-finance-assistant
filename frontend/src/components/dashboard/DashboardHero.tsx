"use client";

import { useRouter } from "next/navigation";
import {
  Upload,
  MessageCircle,
  FileText,
  Sparkles,
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
    <section className="mb-5 overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-end lg:justify-between">
        {/* Left content */}
        <div className="min-w-0 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <Sparkles size={13} className="shrink-0 text-emerald-600" />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              AI Financial Intelligence
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            {greeting}, Souvik
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#565e74]">
            Gain a unified view of your financial activity with AI-powered
            transaction analysis, intelligent budget tracking, subscription
            monitoring, and semantic search across your uploaded financial
            documents.
          </p>

          {!hasData && (
            <div className="mt-4 inline-flex max-w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
              <span className="text-[12px] font-semibold leading-5 text-emerald-700">
                Upload your first statement to unlock personalized insights and
                automated financial analysis.
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto lg:flex lg:shrink-0 lg:items-center lg:gap-3">
          <button
            type="button"
            onClick={() => router.push("/reports")}
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#e6edf9] bg-white px-4 text-[11px] font-bold text-black transition-[background-color,box-shadow,border-color] duration-200 hover:bg-[#f8f9ff] hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)] lg:text-[12px] xl:text-[13px]"
          >
            <FileText size={15} className="shrink-0" />
            Generate Report
          </button>

          <button
            type="button"
            onClick={() => router.push("/chat")}
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#e6edf9] bg-white px-4 text-[11px] font-bold text-black transition-[background-color,box-shadow,border-color] duration-200 hover:bg-[#f8f9ff] hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)] lg:text-[12px] xl:text-[13px]"
          >
            <MessageCircle size={15} className="shrink-0" />
            Ask Aura
          </button>

          <button
            type="button"
            onClick={() => router.push("/uploads")}
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-black px-5 text-[11px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.14)] lg:text-[12px] xl:text-[13px]"
          >
            <Upload size={15} className="shrink-0" />
            Upload Statement
          </button>
        </div>
      </div>
    </section>
  );
}