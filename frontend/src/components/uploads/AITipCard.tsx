import Link from "next/link";
import { ArrowRight, Lightbulb } from "lucide-react";

type AITipCardProps = {
  message?: string;
};

export default function AITipCard({
  message = "Aura is analyzing your financial activity to generate personalized insights.",
}: AITipCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-5 shadow-sm">
      <Lightbulb
        size={72}
        className="pointer-events-none absolute right-4 top-4 z-0 text-emerald-100"
      />

      <div className="relative z-10">
        <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
          AI Tip
        </h4>

        <p className="mb-4 text-[13px] font-semibold leading-5 text-black">
          {message}
        </p>

        <Link
          href="/dashboard/insights"
          className="flex items-center gap-2 text-[13px] font-bold text-black transition hover:gap-3"
        >
          View Insights
          <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}