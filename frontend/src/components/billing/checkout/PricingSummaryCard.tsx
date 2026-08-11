export default function PricingSummaryCard() {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <h2 className="mb-4 text-[15px] font-bold text-black">
        Pricing Summary
      </h2>

      <div className="space-y-3">
        <SummaryRow
          label="Aura Elite"
          value="$59.00"
        />

        <SummaryRow
          label="Billing Cycle"
          value="Monthly"
          muted
        />

        <SummaryRow
          label="Discount"
          value="$0.00"
          muted
        />

        <div className="flex items-center justify-between border-t border-[#edf2fb] pt-4">
          <span className="text-[14px] font-bold text-black">
            Total
          </span>

          <span className="text-[18px] font-bold tracking-tight text-black">
            $59.00
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 text-[12px] ${
        muted
          ? "text-[#565e74]"
          : "font-medium text-black"
      }`}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}