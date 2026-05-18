const spending = [
  { label: "Housing", amount: "₹18,000", width: "58%", color: "bg-black" },
  { label: "Food & Dining", amount: "₹6,500", width: "21%", color: "bg-emerald-700" },
  { label: "Entertainment", amount: "₹4,200", width: "14%", color: "bg-indigo-500" },
];

export default function TopSpendingCard() {
  return (
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-bold text-black">
        Top Spending
      </h3>

      <div className="space-y-5">
        {spending.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between text-xs font-semibold text-[#0b1c30]">
              <span>{item.label}</span>
              <span>{item.amount}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-[#e5eeff]">
              <div
                className={`h-2 rounded-full ${item.color}`}
                style={{ width: item.width }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}