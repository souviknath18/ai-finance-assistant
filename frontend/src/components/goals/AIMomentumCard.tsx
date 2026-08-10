import {
  Sparkles,
  TrendingUp,
} from "lucide-react";

type AIMomentumCardProps = {
  message?: string;
  actionLabel?: string;
};

export default function AIMomentumCard({
  message = "Create goals so Aura can generate personalized momentum insights.",
  actionLabel,
}: AIMomentumCardProps) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Soft background decoration */}
      <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-3.5">
          {/* Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
            <Sparkles size={18} />
          </div>

          {/* Content */}
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                Aura Recommendation
              </p>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                AI Powered
              </span>
            </div>

            <h2 className="text-[16px] font-bold tracking-tight text-black">
              Goal Momentum Insight
            </h2>

            <p className="mt-1.5 max-w-3xl text-[13px] leading-6 text-[#565e74]">
              {message}
            </p>
          </div>
        </div>

        {/* Optional action */}
        {actionLabel && (
          <div className="shrink-0">
            <div className="inline-flex items-center gap-2 rounded-xl border border-[#e6edf9] bg-[#fbfcff] px-3.5 py-2.5">
              <TrendingUp
                size={14}
                className="text-emerald-700"
              />

              <span className="text-[11px] font-bold text-[#565e74]">
                {actionLabel}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}