import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  Sparkles,
} from "lucide-react";

type AITipCardProps = {
  message?: string;
};

export default function AITipCard({
  message = "Aura is analyzing your financial activity to generate personalized insights.",
}: AITipCardProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <Lightbulb size={16} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  AI Tip
                </p>

                <Sparkles
                  size={11}
                  className="text-emerald-500"
                />
              </div>

              <h3 className="mt-1 text-[15px] font-bold tracking-tight text-black">
                Aura Recommendation
              </h3>
            </div>
          </div>
        </div>

        <p className="text-[11px] leading-5 text-[#565e74]">
          {message}
        </p>

        <Link
          href="/insights"
          className="group mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-black transition hover:text-emerald-700"
        >
          View Insights

          <ArrowRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </section>
  );
}