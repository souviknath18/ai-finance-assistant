import { ArrowRight } from "lucide-react";

const transactions = [
  {
    date: "May 16, 2026",
    description: "Amazon India",
    category: "Shopping",
    amount: "-₹1,499.00",
    type: "expense",
  },
  {
    date: "May 15, 2026",
    description: "Monthly Salary",
    category: "Income",
    amount: "+₹84,000.00",
    type: "income",
  },
  {
    date: "May 14, 2026",
    description: "BigBasket",
    category: "Groceries",
    amount: "-₹820.40",
    type: "expense",
  },
  {
    date: "May 13, 2026",
    description: "Starbucks Coffee",
    category: "Dining",
    amount: "-₹360.00",
    type: "expense",
  },
];

export default function RecentTransactionsTable() {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">
          Recent Transactions
        </h3>

        <button className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 hover:underline">
          View All
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-[#c6c6cd] text-left">
              <th className="pb-3 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                Date
              </th>
              <th className="pb-3 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                Description
              </th>
              <th className="pb-3 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                Category
              </th>
              <th className="pb-3 text-right text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e5eeff]">
            {transactions.map((transaction) => (
              <tr
                key={`${transaction.date}-${transaction.description}`}
                className="transition hover:bg-[#eff4ff]"
              >
                <td className="py-3.5 text-[13px] text-[#0b1c30]">
                  {transaction.date}
                </td>

                <td className="py-3.5 text-[13px] font-semibold text-black">
                  {transaction.description}
                </td>

                <td className="py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      transaction.type === "income"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-[#e5eeff] text-[#0b1c30]"
                    }`}
                  >
                    {transaction.category}
                  </span>
                </td>

                <td
                  className={`py-3.5 text-right text-[13px] font-bold ${
                    transaction.type === "income"
                      ? "text-emerald-700"
                      : "text-black"
                  }`}
                >
                  {transaction.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}