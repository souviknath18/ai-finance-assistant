import { useRef } from "react";
import {
  Sparkles,
  User,
  Edit,
  ScanSearch,
  Trash2,
  CheckCircle2,
  Brain,
} from "lucide-react";

import { TransactionTableItem } from "@/types/transaction";
import { useRouter } from "next/navigation";
import TableSelect from "@/components/ui/TableSelect";
import CategoryBadge from "@/components/ui/CategoryBadge";

type TransactionRowProps = {
  transaction: TransactionTableItem;
  selected: boolean;
  onToggleSelectAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
  onCategoryChangeAction: (id: string, category: string) => void;
  openDropdownUp: boolean;
  onFindSimilarAction: (id: string) => void;
};

export default function TransactionRow({
  transaction,
  selected,
  onToggleSelectAction,
  onDeleteAction,
  onCategoryChangeAction,
  openDropdownUp,
  onFindSimilarAction,
}: TransactionRowProps) {
  const router = useRouter();
  const pointerStart = useRef({
    x: 0,
    y: 0,
  });

  const categoryOptions = [
    { label: "Food", value: "Food" },
    { label: "Groceries", value: "Groceries" },
    { label: "Transport", value: "Transport" },
    { label: "Fuel", value: "Fuel" },
    { label: "Shopping", value: "Shopping" },
    { label: "Rent", value: "Rent" },
    { label: "Utilities", value: "Utilities" },
    { label: "Subscriptions", value: "Subscriptions" },
    { label: "Salary", value: "Salary" },
    { label: "Bank Fees", value: "Bank Fees" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Insurance", value: "Insurance" },
    { label: "Investments", value: "Investments" },
    { label: "Travel", value: "Travel" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Education", value: "Education" },
    { label: "Income", value: "Income" },
    { label: "Uncategorized", value: "Uncategorized" },
  ];

  return (
    <tr
      onPointerDown={(e) => {
        pointerStart.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }}
      onPointerUp={(e) => {
        const target = e.target as HTMLElement;

        // Ignore interactive elements
        if (
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("a") ||
          target.closest("[data-ignore-row-click]")
        ) {
          return;
        }

        // Ignore scrolling / dragging
        const dx = Math.abs(e.clientX - pointerStart.current.x);
        const dy = Math.abs(e.clientY - pointerStart.current.y);

        if (dx > 8 || dy > 8) {
          return;
        }

        router.push(`/transactions/${transaction.id}`);
      }}
      className={`cursor-pointer transition hover:bg-[#eff4ff] ${
        transaction.ai && transaction.selected
          ? "bg-gradient-to-r from-white to-emerald-50"
          : ""
      } ${transaction.review ? "bg-[#eff4ff]/50" : ""}`}
    >
      <td className="p-4" data-ignore-row-click>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelectAction(transaction.id)}
          className="h-4 w-4 rounded border-[#c6c6cd]"
        />
      </td>

      <td className="p-4 text-[13px] text-black">{transaction.date}</td>

      <td className="p-4">
        <div className="flex flex-col">
          <span
            className="line-clamp-2 max-w-[320px] text-[13px] font-bold text-black"
            title={transaction.title}
          >
            {transaction.title}
          </span>

          <span className="text-[11px] text-[#565e74]">
            {transaction.subtitle}
          </span>
        </div>
      </td>

      <td className="p-4" data-ignore-row-click>
        {transaction.review ? (
          <TableSelect
            value={transaction.category}
            options={categoryOptions}
            openDirection={openDropdownUp ? "up" : "down"}
            onChangeAction={(category) =>
              onCategoryChangeAction(transaction.id, category)
            }
          />
        ) : (
          <CategoryBadge category={transaction.category} />
        )}
      </td>

      <td
        className={`p-4 text-right text-[13px] font-bold ${
          transaction.type === "income"
            ? "text-emerald-700"
            : "text-red-600"
        }`}
      >
        {transaction.amount}
      </td>

      <td className="p-4" data-ignore-row-click>
        <div
          className={`flex items-center gap-2 ${
            transaction.status === "AI Verified"
              ? "text-emerald-700"
              : transaction.status === "Rule Verified"
              ? "text-cyan-700"
              : transaction.status === "User Verified"
              ? "text-emerald-700"
              : transaction.review
              ? "text-indigo-700"
              : "text-[#565e74]"
          }`}
        >
          {transaction.status === "AI Verified" ? (
            <Sparkles size={15} />
          ) : transaction.status === "Rule Verified" ? (
            <CheckCircle2 size={15} />
          ) : transaction.status === "User Verified" ? (
            <User size={15} />
          ) : transaction.review ? (
            <Brain size={15} />
          ) : (
            <User size={15} />
          )}

          <span className="text-[11px] font-bold">
            {transaction.status}
          </span>
        </div>
      </td>

      <td className="p-4" data-ignore-row-click>
        <div className="flex justify-center gap-2.5 text-[#76777d]">
          <button className="hover:text-black">
            <Edit size={16} />
          </button>

          <div className="group/tooltip relative inline-flex items-center">
            <button
              onClick={() => onFindSimilarAction(transaction.id)}
              className="flex items-center text-[#565e74] transition hover:text-emerald-700"
            >
              <ScanSearch size={16} />
            </button>

            <div className="pointer-events-none absolute bottom-[calc(100%+10px)] right-0 z-[99999] whitespace-nowrap rounded-xl border border-[#dce9ff] bg-white px-3 py-2 text-[11px] text-[#565e74] opacity-0 shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition-all duration-200 group-hover/tooltip:opacity-100">
              Find similar transactions

              <div className="absolute right-3 top-full h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-[#dce9ff] bg-white" />
            </div>
          </div>

          <button
            onClick={() => onDeleteAction(transaction.id)}
            className="hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}