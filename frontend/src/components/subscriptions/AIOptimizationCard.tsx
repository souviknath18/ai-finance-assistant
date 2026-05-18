import { Bolt, Sparkles } from "lucide-react";

export default function AIOptimizationCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-100 bg-white p-6 shadow-sm md:col-span-2">
      <Sparkles size={70} className="absolute right-5 top-5 text-emerald-100" />

      <div className="relative z-10">
        <div className="mb-2 flex items-center gap-2 text-emerald-700">
          <Bolt size={18} />

          <span className="text-xs font-bold uppercase tracking-wider">
            AI Optimization Opportunity
          </span>
        </div>

        <h3 className="mb-2 text-2xl font-bold text-black">
          Save $45.00/mo
        </h3>

        <p className="text-sm leading-6 text-[#565e74]">
          We found 2 duplicate media services and 1 unused SaaS tool from the
          last 90 days.
        </p>
      </div>
    </div>
  );
}