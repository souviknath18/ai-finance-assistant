import Link from "next/link";

import {
  ArrowRight,
  FileText,
  Image,
  PlayCircle,
  Sparkles,
  Table,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24">
      {/* Background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-28 top-24 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <Sparkles
              size={12}
              className="text-emerald-700"
            />

            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
              AI-Powered Financial Intelligence
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl text-[38px] font-bold leading-[1.08] tracking-tight text-black sm:text-[48px] lg:text-[58px]">
            Understand your money.
            <span className="block text-emerald-700">
              Let Aura do the analysis.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[14px] leading-7 text-[#565e74] sm:text-[16px]">
            Upload statements, invoices, receipts, salary slips, or CSVs.
            Aura organizes your transactions, detects patterns, and turns
            financial activity into useful insights.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white shadow-[0_6px_16px_rgba(15,23,42,0.12)] transition-[opacity,box-shadow] hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.16)]"
            >
              Get Started for Free
              <ArrowRight size={14} />
            </Link>

            <button
              type="button"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-5 text-[12px] font-bold text-black transition hover:border-emerald-200 hover:bg-emerald-50/40"
            >
              <PlayCircle size={15} />
              Watch Demo
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-[#7c839b]">
            <span>✓ No credit card required</span>
            <span>✓ Secure document processing</span>
            <span>✓ AI-powered insights</span>
          </div>
        </div>

        {/* Right Preview */}
        <div className="relative">
          <div className="rounded-[28px] border border-[#e6edf9] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-6">
            <div className="flex items-center justify-between border-b border-[#edf2fb] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                  Aura Workspace
                </p>

                <h3 className="mt-1 text-[15px] font-bold text-black">
                  Import Financial Data
                </h3>
              </div>

              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                AI Ready
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-[#cfd9e8] bg-[#fbfcff] p-7 text-center">
              <div className="mb-7 flex justify-center -space-x-3">
                <FileMockup
                  icon={<FileText size={25} />}
                  badge="PDF"
                  tone="red"
                  rotate="-rotate-6"
                />

                <FileMockup
                  icon={<Table size={25} />}
                  badge="CSV"
                  tone="green"
                  rotate="z-10"
                />

                <FileMockup
                  icon={<Image size={25} />}
                  badge="IMG"
                  tone="blue"
                  rotate="rotate-6"
                />
              </div>

              <h4 className="text-[16px] font-bold text-black">
                Upload your financial documents
              </h4>

              <p className="mx-auto mt-2 max-w-sm text-[11px] leading-5 text-[#7c839b]">
                Aura automatically detects document type, extracts
                transactions, and prepares them for analysis.
              </p>

              <button className="mt-5 rounded-xl bg-black px-5 py-2.5 text-[11px] font-bold text-white">
                Choose a Financial File
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniMetric
                value="Auto"
                label="Categorization"
              />

              <MiniMetric
                value="AI"
                label="Insights"
              />

              <MiniMetric
                value="Smart"
                label="Search"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FileMockup({
  icon,
  badge,
  tone,
  rotate,
}: {
  icon: React.ReactNode;
  badge: string;
  tone: "red" | "green" | "blue";
  rotate: string;
}) {
  const styles =
    tone === "red"
      ? "border-red-100 bg-red-50 text-red-600"
      : tone === "green"
        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
        : "border-blue-100 bg-blue-50 text-blue-700";

  return (
    <div
      className={`relative flex h-20 w-16 items-center justify-center rounded-xl border bg-white shadow-[0_5px_15px_rgba(15,23,42,0.08)] ${rotate}`}
    >
      <span className={styles}>
        {icon}
      </span>

      <span
        className={`absolute -bottom-2 rounded-full border px-2 py-0.5 text-[8px] font-bold ${styles}`}
      >
        {badge}
      </span>
    </div>
  );
}

function MiniMetric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-[#edf2fb] bg-[#fbfcff] p-3 text-center">
      <p className="text-[12px] font-bold text-black">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-[#7c839b]">
        {label}
      </p>
    </div>
  );
}