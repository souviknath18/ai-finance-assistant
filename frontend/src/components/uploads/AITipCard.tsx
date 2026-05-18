import { ArrowRight, Lightbulb } from "lucide-react";

export default function AITipCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-200 bg-white p-6 shadow-sm">
      <Lightbulb size={90} className="absolute right-4 top-4 text-emerald-100" />

      <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
        AI Tip
      </h4>

      <p className="mb-4 text-sm font-semibold leading-6 text-black">
        Aura has detected recurring patterns in your previous uploads. Connect
        your bank API for even faster reconciliation.
      </p>

      <button className="flex items-center gap-2 text-sm font-bold text-black transition hover:gap-3">
        Connect Now
        <ArrowRight size={16} />
      </button>
    </div>
  );
}