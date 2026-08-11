import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <div className="mb-6">
      <Link
        href="/billing/upgrade"
        className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#565e74] transition hover:text-black"
      >
        <ArrowLeft size={14} />
        Back to Plans
      </Link>

      <h1 className="text-xl font-bold tracking-tight text-black">
        Upgrade to Aura Elite
      </h1>

      <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
        Unlock institutional-grade AI tools, unlimited uploads, and priority
        financial intelligence.
      </p>
    </div>
  );
}