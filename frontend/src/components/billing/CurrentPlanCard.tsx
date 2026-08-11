import Link from "next/link";
import UsageMetric from "./UsageMetric";

export default function CurrentPlanCard() {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Current Plan
          </p>

          <h2 className="mt-2 text-[22px] font-bold tracking-tight text-black">
            Aura Pro
          </h2>

          <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
            Next billing date: Jan 24, 2025 ($29.00/mo)
          </p>
        </div>

        <Link
          href="/billing/upgrade"
          className="inline-flex h-10 w-fit shrink-0 items-center justify-center rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_8px_20px_rgba(15,23,42,0.12)]"
        >
          Upgrade Plan
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <UsageMetric
          label="Uploads"
          value="840 / 1000"
          progress={84}
          helper="Reset in 12 days"
          color="bg-black"
        />

        <UsageMetric
          label="AI Messages"
          value="45 / 500"
          progress={9}
          helper="Reset in 12 days"
          color="bg-emerald-700"
        />

        <UsageMetric
          label="Reports"
          value="18 / 20"
          progress={90}
          helper="90% of limit reached"
          helperColor="text-red-600"
          color="bg-red-600"
        />
      </div>
    </div>
  );
}