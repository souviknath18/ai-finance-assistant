import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CheckoutHeader() {
  return (
    <div>
      <Link
        href="/billing/upgrade"
        className="mb-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wide text-emerald-700 hover:underline"
      >
        <ArrowLeft size={15} />
        Back to Plans
      </Link>

      <h1 className="text-2xl font-bold tracking-tight text-black md:text-3xl">
        Upgrade to Aura Elite
      </h1>

      <p className="mt-2 text-[13px] leading-6 text-[#565e74] md:text-[14px]">
        Unlock institutional-grade AI tools, unlimited uploads, and priority
        financial intelligence.
      </p>
    </div>
  );
}