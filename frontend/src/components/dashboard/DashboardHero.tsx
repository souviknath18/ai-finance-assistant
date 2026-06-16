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
    <section className="relative mb-5 overflow-hidden rounded-2xl border border-[#dbe5f5] bg-white p-4 shadow-sm sm:p-5">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute left-24 bottom-0 h-32 w-32 rounded-full bg-green-100/40 blur-3xl" />
      </div>

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        {/* Left Content */}
        <div className="max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
            <Sparkles
              size={13}
              className="text-emerald-600"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              AI Financial Intelligence
            </span>
          </div>

          <h1 className="text-xl font-bold tracking-tight text-black sm:text-2xl">
            {greeting}, Souvik
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] leading-5 text-[#565e74]">
            Gain a unified view of your financial activity with
            AI-powered transaction analysis, intelligent budget
            tracking, subscription monitoring, and semantic search
            across your uploaded financial documents.
          </p>

          {!hasData && (
            <div className="mt-4 inline-flex rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
              <span className="text-[12px] font-semibold text-emerald-700">
                Upload your first statement to unlock personalized
                insights and automated financial analysis.
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex lg:items-center lg:gap-3">
          <button
            onClick={() => router.push("/reports")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dbe5f5] bg-white/90 px-4 text-[11px] lg:text-[12px] xl:text-[13px] font-bold whitespace-nowrap text-black backdrop-blur-sm transition-all duration-200 hover:bg-[#f8fbff] hover:shadow-sm"
          >
            <FileText size={15} />
            Generate Report
          </button>

          <button
            onClick={() => router.push("/chat")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dbe5f5] bg-white/90 px-4 text-[11px] lg:text-[12px] xl:text-[13px] font-bold whitespace-nowrap text-black backdrop-blur-sm transition-all duration-200 hover:bg-[#f8fbff] hover:shadow-sm"
          >
            <MessageCircle size={15} />
            Ask Aura
          </button>

          <button
            onClick={() => router.push("/uploads")}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[11px] lg:text-[12px] xl:text-[13px] font-bold whitespace-nowrap text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
          >
            <Upload size={15} />
            Upload Statement
          </button>
        </div>
      </div>
    </section>
  );
}