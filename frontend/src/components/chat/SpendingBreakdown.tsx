import { spendingBreakdown } from "./data";

export default function SpendingBreakdown() {
  return (
    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#c6c6cd] bg-white p-3 md:grid-cols-4">
      {spendingBreakdown.map((item) => (
        <div key={item.label} className="rounded-xl bg-[#f8f9ff] p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7c839b]">
            {item.label}
          </p>

          <p className="mt-1 text-lg font-bold text-black">{item.value}</p>

          <p className={`text-xs font-semibold ${item.tone}`}>{item.trend}</p>
        </div>
      ))}
    </div>
  );
}