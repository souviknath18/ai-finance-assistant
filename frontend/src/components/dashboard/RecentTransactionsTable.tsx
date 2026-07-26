import Link from "next/link";
import {
  ArrowRight,
  Upload,
  ReceiptText,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CircleHelp,
} from "lucide-react";

import { getCategoryStyles } from "@/lib/utils/categoryStyles";

type RecentTransactionsTableProps = {
  transactions: {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: string;
    type: "income" | "expense" | "transfer" | "unknown";
  }[];
  hasData: boolean;
};

function getTransactionTypeStyles(
  type: RecentTransactionsTableProps["transactions"][number]["type"],
) {
  switch (type) {
    case "income":
      return {
        icon: ArrowDownLeft,
        container:
          "border-emerald-100 bg-emerald-50 text-emerald-700",
        amount: "text-emerald-700",
      };

    case "expense":
      return {
        icon: ArrowUpRight,
        container: "border-red-100 bg-red-50 text-red-600",
        amount: "text-black",
      };

    case "transfer":
      return {
        icon: ArrowLeftRight,
        container: "border-blue-100 bg-blue-50 text-blue-700",
        amount: "text-blue-700",
      };

    default:
      return {
        icon: CircleHelp,
        container: "border-slate-200 bg-slate-50 text-slate-600",
        amount: "text-black",
      };
  }
}

export default function RecentTransactionsTable({
  transactions,
  hasData,
}: RecentTransactionsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      {/* Header */}

      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <ReceiptText size={20} />
            </div>

            <div className="min-w-0">
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
            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3 py-2 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow,transform] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:shadow-[0_6px_16px_rgba(15,23,42,0.08)] active:translate-y-px"
          >
            View All
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {!hasData || transactions.length === 0 ? (
        <div className="p-5 sm:p-8">
          <div className="rounded-2xl border border-dashed border-[#dce9ff] bg-[#fbfcff] p-6 text-center sm:p-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#edf2fb] bg-white">
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
              <tr className="border-b border-[#edf2fb] bg-[#fbfcff]">
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
              {transactions.map((transaction) => {
                const categoryStyles = getCategoryStyles(
                  transaction.category,
                );

                const transactionTypeStyles = getTransactionTypeStyles(
                  transaction.type,
                );

                const TransactionIcon = transactionTypeStyles.icon;

                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-[#edf2fb] transition-colors duration-200 last:border-b-0 hover:bg-[#f8fbff]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-[13px] font-medium text-[#565e74]">
                      {transaction.date}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${transactionTypeStyles.container}`}
                        >
                          <TransactionIcon size={16} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-[13px] font-bold leading-5 text-black">
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
                        className={`inline-flex max-w-[180px] items-center truncate rounded-full border px-3 py-1 text-[11px] font-bold ${categoryStyles.badge}`}
                      >
                        {transaction.category}
                      </span>
                    </td>

                    <td
                      className={`min-w-[110px] whitespace-nowrap px-5 py-4 text-right text-[14px] font-bold ${transactionTypeStyles.amount}`}
                    >
                      {transaction.amount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}