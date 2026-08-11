type BillingToggleProps = {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (value: "monthly" | "yearly") => void;
};

export default function BillingToggle({
  billingCycle,
  setBillingCycle,
}: BillingToggleProps) {
  const isYearly =
    billingCycle === "yearly";

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
      <span
        className={`text-[11px] font-bold uppercase tracking-wide ${
          !isYearly
            ? "text-black"
            : "text-[#7c839b]"
        }`}
      >
        Monthly
      </span>

      <button
        type="button"
        onClick={() =>
          setBillingCycle(
            isYearly
              ? "monthly"
              : "yearly"
          )
        }
        className={`relative h-6 w-10 shrink-0 rounded-full transition ${
          isYearly
            ? "bg-emerald-700"
            : "bg-[#c6c6cd]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
            isYearly
              ? "right-1"
              : "left-1"
          }`}
        />
      </button>

      <span
        className={`text-[11px] font-bold uppercase tracking-wide ${
          isYearly
            ? "text-black"
            : "text-[#7c839b]"
        }`}
      >
        Yearly
      </span>

      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
        Save 20%
      </span>
    </div>
  );
}