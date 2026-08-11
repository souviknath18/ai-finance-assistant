import Link from "next/link";

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  CircleHelp,
  ReceiptText,
  Upload,
} from "lucide-react";

import CategoryBadge from "@/components/ui/CategoryBadge";

type RecentTransactionsTableProps = {
  transactions: {
    id: string;
    date: string;
    description: string;
    category: string;
    amount: string;
    type:
      | "income"
      | "expense"
      | "transfer"
      | "unknown";
  }[];
  hasData: boolean;
};

function getTransactionTypeStyles(
  type: RecentTransactionsTableProps["transactions"][number]["type"]
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
        container:
          "border-red-100 bg-red-50 text-red-600",
        amount: "text-red-600",
      };

    case "transfer":
      return {
        icon: ArrowLeftRight,
        container:
          "border-blue-100 bg-blue-50 text-blue-700",
        amount: "text-blue-700",
      };

    default:
      return {
        icon: CircleHelp,
        container:
          "border-[#e6edf9] bg-[#f8f9ff] text-[#565e74]",
        amount: "text-black",
      };
  }
}

export default function RecentTransactionsTable({
  transactions,
  hasData,
}: RecentTransactionsTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-700">
              <ReceiptText size={17} />
            </div>

            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-black">
                Recent Transactions
              </h3>

              <p className="mt-0.5 text-[12px] leading-5 text-[#565e74]">
                Latest AI-categorized financial activity.
              </p>
            </div>
          </div>

          <Link
            href="/transactions"
            className="inline-flex h-9 w-fit shrink-0 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-3 text-[11px] font-bold text-black transition-[background-color,border-color,box-shadow,color] duration-200 hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
          >
            View All
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {!hasData || transactions.length === 0 ? (
        <div className="p-5">
          <div className="rounded-2xl border border-dashed border-[#dce9ff] bg-[#fbfcff] p-7 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#e6edf9] bg-white text-[#565e74]">
              <Upload size={18} />
            </div>

            <p className="mt-3 text-[13px] font-bold text-black">
              No recent transactions
            </p>

            <p className="mx-auto mt-1 max-w-md text-[12px] leading-5 text-[#565e74]">
              Upload a bank statement or CSV to start tracking your financial
              activity.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-[#edf2fb] bg-[#fbfcff]">
                <TableHead>
                  Date
                </TableHead>

                <TableHead>
                  Merchant
                </TableHead>

                <TableHead>
                  Category
                </TableHead>

                <TableHead align="right">
                  Amount
                </TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#edf2fb]">
              {transactions.map((transaction) => {
                const typeStyles =
                  getTransactionTypeStyles(
                    transaction.type
                  );

                const TransactionIcon =
                  typeStyles.icon;

                return (
                  <tr
                    key={transaction.id}
                    className="transition-colors duration-150 hover:bg-[#fbfcff]"
                  >
                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4 text-[12px] font-medium text-[#565e74]">
                      {transaction.date}
                    </td>

                    {/* Merchant */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${typeStyles.container}`}
                        >
                          <TransactionIcon size={15} />
                        </div>

                        <div className="min-w-0">
                          <p
                            title={transaction.description}
                            className="max-w-[300px] truncate text-[12px] font-bold text-black"
                          >
                            {transaction.description}
                          </p>

                          <p className="mt-0.5 text-[10px] text-[#7c839b]">
                            AI Classified
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <CategoryBadge
                        category={transaction.category}
                      />
                    </td>

                    {/* Amount */}
                    <td
                      className={`whitespace-nowrap px-5 py-4 text-right text-[13px] font-bold ${typeStyles.amount}`}
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
    </section>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}