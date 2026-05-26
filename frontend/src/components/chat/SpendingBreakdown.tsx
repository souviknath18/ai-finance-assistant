import { spendingBreakdown } from "./data";

export default function SpendingBreakdown() {
  return (
    <div className="grid grid-cols-2 gap-2.5 rounded-2xl border border-[#c6c6cd] bg-white p-2.5 md:grid-cols-4">
      {spendingBreakdown.map((item) => (
        <div
          key={item.label}
          className="rounded-xl bg-[#f8f9ff] p-2.5"
        >
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#7c839b]">
            {item.label}
          </p>

          <p className="mt-1 text-base font-bold text-black">
            {item.value}
          </p>

          <p className={`mt-0.5 text-[11px] font-semibold ${item.tone}`}>
            {item.trend}
          </p>
        </div>
      ))}
    </div>
  );
}