import { ArrowRight, Lightbulb } from "lucide-react";

export default function AITipCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-200 bg-white p-5 shadow-sm">
      <Lightbulb size={72} className="absolute right-4 top-4 text-emerald-100" />

      <h4 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
        AI Tip
      </h4>

      <p className="mb-4 text-[13px] font-semibold leading-5 text-black">
        Aura has detected recurring patterns in your previous uploads. Connect
        your bank API for even faster reconciliation.
      </p>

      <button className="flex items-center gap-2 text-[13px] font-bold text-black transition hover:gap-3">
        Connect Now
        <ArrowRight size={15} />
      </button>
    </div>
  );
}