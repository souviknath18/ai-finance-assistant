import { ShieldCheck } from "lucide-react";

export default function SecurityBadges() {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-700">
          <ShieldCheck size={16} />
        </div>

        <p className="text-[11px] leading-5 text-[#565e74]">
          Secured with industry-standard encryption. This checkout can be
          connected to Stripe or Razorpay for production payments.
        </p>
      </div>
    </div>
  );
}