type BillingToggleProps = {
  billingCycle: "monthly" | "yearly";
  setBillingCycle: (value: "monthly" | "yearly") => void;
};

export default function BillingToggle({
  billingCycle,
  setBillingCycle,
}: BillingToggleProps) {
  const isYearly = billingCycle === "yearly";

  return (
    <div className="mb-10 flex items-center justify-center gap-3">
      <span
        className={`text-[12px] font-bold uppercase tracking-wide ${
          !isYearly ? "text-black" : "text-[#565e74]"
        }`}
      >
        Monthly
      </span>

      <button
        type="button"
        onClick={() => setBillingCycle(isYearly ? "monthly" : "yearly")}
        className={`relative h-7 w-12 rounded-full transition ${
          isYearly ? "bg-black" : "bg-[#dce9ff]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            isYearly ? "left-6" : "left-1"
          }`}
        />
      </button>

      <span
        className={`text-[12px] font-bold uppercase tracking-wide ${
          isYearly ? "text-black" : "text-[#565e74]"
        }`}
      >
        Yearly
      </span>

      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
        Save 20%
      </span>
    </div>
  );
}