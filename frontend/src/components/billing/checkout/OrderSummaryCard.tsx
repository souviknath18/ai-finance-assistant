import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Real-time Market Prediction",
  "Priority 24/7 AI Support",
  "Unlimited Document Uploads",
  "Advanced Tax Optimization",
];

export default function OrderSummaryCard() {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-800">
            Elite Plan
          </span>

          <h2 className="mt-3 text-xl font-bold text-black">
            Aura Elite
          </h2>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-black">
            $59
            <span className="text-[12px] font-medium text-[#565e74]">
              /mo
            </span>
          </p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[#565e74]">
            Billed Monthly
          </p>
        </div>
      </div>

      <div className="space-y-3 border-t border-[#e5eeff] pt-4">
        {benefits.map((benefit) => (
          <div key={benefit} className="flex items-center gap-2.5">
            <CheckCircle2 size={17} className="text-emerald-700" />

            <span className="text-[13px] font-medium text-black">
              {benefit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}