import { ShieldCheck } from "lucide-react";

export default function SecurityBadges() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#dce9ff] bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <ShieldCheck size={19} />
      </div>

      <p className="text-[12px] leading-5 text-[#565e74]">
        Secured with industry-standard encryption. This checkout UI can later be
        connected to Stripe or Razorpay for real payments.
      </p>
    </div>
  );
}