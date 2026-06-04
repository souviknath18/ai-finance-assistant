import Link from "next/link";
import {
  ArrowRight,
  Upload,
  ReceiptText,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";

type RecentTransactionsTableProps = {
  transactions: {
    date: string;
    description: string;
    category: string;
    amount: string;
    type: "income" | "expense" | "transfer" | "unknown";
  }[];
  hasData: boolean;
};

export default function RecentTransactionsTable({
  transactions,
  hasData,
}: RecentTransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#dbe5f5] bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-[#edf2fb] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ReceiptText size={20} />
          </div>

          <div>
            <h3 className="text-[15px] font-bold text-black">
              Recent Transactions
            </h3>

            <p className="text-[12px] text-[#565e74]">
              Latest AI categorized activity
            </p>
          </div>
        </div>

        <Link
          href="/transactions"
          className="flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-[12px] font-bold text-indigo-700 transition hover:bg-indigo-100"
        >
          View All
          <ArrowRight size={13} />
        </Link>
      </div>

      {!hasData || transactions.length === 0 ? (
        <div className="p-8">
          <div className="rounded-2xl border border-dashed border-[#dce9ff] bg-[#f8f9ff] p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <Upload size={20} />
            </div>

            <p className="text-[14px] font-bold text-black">
              No recent transactions
            </p>

            <p className="mt-1.5 text-[13px] text-[#565e74]">
              Upload a bank statement or CSV to start tracking your finances.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-[#edf2fb] bg-[#fafbfe]">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
                  Date
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
                  Merchant
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
                  Category
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={`${transaction.date}-${transaction.description}-${transaction.amount}`}
                  className="border-b border-[#edf2fb] transition hover:bg-[#fafbfe]"
                >
                  <td className="px-5 py-4 text-[13px] font-medium text-[#565e74]">
                    {transaction.date}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                          transaction.type === "income"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-indigo-50 text-indigo-700"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowDownLeft size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </div>

                      <div>
                        <p className="text-[13px] font-bold text-black">
                          {transaction.description}
                        </p>

                        <p className="text-[11px] text-[#7c839b]">
                          AI Classified
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                        transaction.type === "income"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {transaction.category}
                    </span>
                  </td>

                  <td
                    className={`px-5 py-4 text-right text-[14px] font-bold ${
                      transaction.type === "income"
                        ? "text-emerald-700"
                        : "text-black"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}