export default function PricingSummaryCard() {
  return (
    <div className="rounded-2xl border border-[#dce9ff] bg-[#eff4ff] p-5">
      <div className="space-y-3">
        <SummaryRow label="Aura Elite Monthly" value="$59.00" />
        <SummaryRow label="Platform Fee" value="$0.00" muted />

        <div className="flex items-center justify-between border-t border-[#c6c6cd] pt-4">
          <span className="text-lg font-bold text-black">Total</span>
          <span className="text-lg font-bold text-black">$59.00</span>
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
      className={`flex items-center justify-between text-[13px] ${
        muted ? "text-[#565e74]" : "text-black"
      }`}
    >
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}