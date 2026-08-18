import Link from "next/link";

import {
  ArrowRight,
  Brain,
  Landmark,
  PlayCircle,
  RefreshCcw,
  Sparkles,
  Upload,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8 lg:pb-24">
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
              AI-Powered Personal Finance
            </span>
          </div>

          <h1 className="mt-5 max-w-3xl text-[38px] font-bold leading-[1.08] tracking-tight text-black sm:text-[48px] lg:text-[58px]">
            Your finances.
            <span className="block text-emerald-700">
              Understood by AI.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-[14px] leading-7 text-[#565e74] sm:text-[16px]">
            Connect financial accounts or import your existing data.
            Aura organizes transactions, tracks spending patterns,
            detects recurring payments, and gives you personalized
            financial insights.
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
            <span>✓ Secure financial workspace</span>
            <span>✓ AI-powered insights</span>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="rounded-[28px] border border-[#e6edf9] bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.10)] sm:p-6">
            <div className="flex items-center justify-between border-b border-[#edf2fb] pb-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
                  Aura Workspace
                </p>

                <h3 className="mt-1 text-[15px] font-bold text-black">
                  Your Financial Data
                </h3>
              </div>

              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                AI Ready
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-[#e6edf9] bg-[#fbfcff] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                    <Landmark size={17} />
                  </div>

                  <div>
                    <p className="text-[12px] font-bold text-black">
                      Connected Account
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#7c839b]">
                      Automatic transaction sync
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-bold text-emerald-700">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-[#e6edf9] bg-[#fbfcff] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
                    <Upload size={17} />
                  </div>

                  <div>
                    <p className="text-[12px] font-bold text-black">
                      Import Financial Data
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#7c839b]">
                      Statements, receipts and CSV files
                    </p>
                  </div>
                </div>

                <ArrowRight
                  size={14}
                  className="text-[#98a2b3]"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniMetric
                icon={<RefreshCcw size={13} />}
                value="Auto"
                label="Sync"
              />

              <MiniMetric
                icon={<Brain size={13} />}
                value="AI"
                label="Insights"
              />

              <MiniMetric
                icon={<Sparkles size={13} />}
                value="Smart"
                label="Analysis"
              />
            </div>

            <p className="mt-4 text-center text-[9px] text-[#98a2b3]">
              Bank connectivity is currently demonstrated using simulated accounts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniMetric({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-[#edf2fb] bg-[#fbfcff] p-3 text-center">
      <div className="mb-1 flex justify-center text-emerald-700">
        {icon}
      </div>

      <p className="text-[12px] font-bold text-black">
        {value}
      </p>

      <p className="mt-0.5 text-[9px] text-[#7c839b]">
        {label}
      </p>
    </div>
  );
}