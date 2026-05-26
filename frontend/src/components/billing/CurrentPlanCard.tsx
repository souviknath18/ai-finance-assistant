import UsageMetric from "./UsageMetric";

export default function CurrentPlanCard() {
  return (
    <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-800">
            Current Plan
          </span>

          <h2 className="mt-3 text-2xl font-bold text-black">
            Aura Pro
          </h2>

          <p className="mt-1.5 text-[13px] text-[#565e74]">
            Next billing date: Jan 24, 2025 ($29.00/mo)
          </p>
        </div>

        <button className="rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
          Upgrade Plan
        </button>
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