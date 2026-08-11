"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
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
import TableSelect from "@/components/ui/TableSelect";
import CategoryBadge from "@/components/ui/CategoryBadge";

type TransactionRowProps = {
  transaction: TransactionTableItem;
  selected: boolean;
  onToggleSelectAction: (id: string) => void;
  onDeleteAction: (id: string) => void;
  onCategoryChangeAction: (
    id: string,
    category: string
  ) => void;
  openDropdownUp: boolean;
  onFindSimilarAction: (id: string) => void;
};

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

  const handlePointerDown = (
    event: React.PointerEvent<HTMLTableRowElement>
  ) => {
    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLTableRowElement>
  ) => {
    const target = event.target as HTMLElement;

    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("select") ||
      target.closest("a") ||
      target.closest("[data-ignore-row-click]")
    ) {
      return;
    }

    const dx = Math.abs(
      event.clientX - pointerStart.current.x
    );

    const dy = Math.abs(
      event.clientY - pointerStart.current.y
    );

    if (dx > 8 || dy > 8) {
      return;
    }

    router.push(`/transactions/${transaction.id}`);
  };

  return (
    <tr
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`group cursor-pointer transition-colors duration-150 hover:bg-[#f8faff] ${
        selected ? "bg-emerald-50/40" : ""
      } ${
        transaction.ai && transaction.selected
          ? "bg-gradient-to-r from-white to-emerald-50/70"
          : ""
      } ${
        transaction.review
          ? "bg-indigo-50/30"
          : ""
      }`}
    >
      {/* SELECT */}
      <td
        className="w-[52px] p-4"
        data-ignore-row-click
      >
        <input
          type="checkbox"
          aria-label={`Select ${transaction.title}`}
          checked={selected}
          onChange={() =>
            onToggleSelectAction(transaction.id)
          }
          className="h-4 w-4 cursor-pointer rounded border-[#c6c6cd] accent-emerald-700"
        />
      </td>

      {/* DATE */}
      <td className="whitespace-nowrap p-4">
        <span className="text-[13px] font-medium text-black">
          {transaction.date}
        </span>
      </td>

      {/* DESCRIPTION */}
      <td className="p-4">
        <div className="flex max-w-[340px] flex-col">
          <span
            title={transaction.title}
            className="line-clamp-2 text-[13px] font-bold leading-5 text-black"
          >
            {transaction.title}
          </span>

          {transaction.subtitle && (
            <span
              title={transaction.subtitle}
              className="mt-0.5 truncate text-[11px] text-[#76777d]"
            >
              {transaction.subtitle}
            </span>
          )}
        </div>
      </td>

      {/* CATEGORY */}
      <td
        className="p-4"
        data-ignore-row-click
      >
        {transaction.review ? (
          <div className="min-w-[150px]">
            <TableSelect
              value={transaction.category}
              options={categoryOptions}
              openDirection={
                openDropdownUp ? "up" : "down"
              }
              onChangeAction={(category) =>
                onCategoryChangeAction(
                  transaction.id,
                  category
                )
              }
            />
          </div>
        ) : (
          <CategoryBadge
            category={transaction.category}
          />
        )}
      </td>

      {/* AMOUNT */}
      <td className="whitespace-nowrap p-4 text-right">
        <span
          className={`text-[13px] font-bold ${
            transaction.type === "income"
              ? "text-emerald-700"
              : "text-red-600"
          }`}
        >
          {transaction.amount}
        </span>
      </td>

      {/* STATUS */}
      <td
        className="p-4"
        data-ignore-row-click
      >
        <TransactionStatus
          status={transaction.status}
          review={transaction.review ?? false}
        />
      </td>

      {/* ACTIONS */}
      <td
        className="p-4"
        data-ignore-row-click
      >
        <div className="flex items-center justify-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
          <ActionButton
            label="Edit transaction"
            icon={<Edit size={15} />}
            onClick={() =>
              router.push(
                `/transactions/${transaction.id}`
              )
            }
          />

          <div className="group/tooltip relative">
            <ActionButton
              label="Find similar transactions"
              icon={<ScanSearch size={15} />}
              onClick={() =>
                onFindSimilarAction(transaction.id)
              }
              highlight
            />

            <div className="pointer-events-none absolute bottom-[calc(100%+9px)] right-0 z-[100] whitespace-nowrap rounded-lg border border-[#dce9ff] bg-white px-2.5 py-1.5 text-[10px] font-semibold text-[#565e74] opacity-0 shadow-[0_10px_30px_rgba(15,23,42,0.14)] transition-opacity group-hover/tooltip:opacity-100">
              Find similar transactions

              <div className="absolute right-3 top-full h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-[#dce9ff] bg-white" />
            </div>
          </div>

          <ActionButton
            label="Delete transaction"
            icon={<Trash2 size={15} />}
            danger
            onClick={() =>
              onDeleteAction(transaction.id)
            }
          />
        </div>
      </td>
    </tr>
  );
}

function TransactionStatus({
  status,
  review,
}: {
  status: string;
  review: boolean;
}) {
  if (status === "AI Verified") {
    return (
      <StatusBadge
        icon={<Sparkles size={13} />}
        label={status}
        className="border-emerald-200 bg-emerald-50 text-emerald-700"
      />
    );
  }

  if (status === "Rule Verified") {
    return (
      <StatusBadge
        icon={<CheckCircle2 size={13} />}
        label={status}
        className="border-cyan-200 bg-cyan-50 text-cyan-700"
      />
    );
  }

  if (status === "User Verified") {
    return (
      <StatusBadge
        icon={<User size={13} />}
        label={status}
        className="border-blue-200 bg-blue-50 text-blue-700"
      />
    );
  }

  if (review) {
    return (
      <StatusBadge
        icon={<Brain size={13} />}
        label={status || "AI Review Needed"}
        className="border-indigo-200 bg-indigo-50 text-indigo-700"
      />
    );
  }

  return (
    <StatusBadge
      icon={<User size={13} />}
      label={status}
      className="border-[#dce9ff] bg-[#eff4ff] text-[#565e74]"
    />
  );
}

function StatusBadge({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  danger = false,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        danger
          ? "text-[#76777d] hover:bg-red-50 hover:text-red-600"
          : highlight
          ? "text-[#76777d] hover:bg-emerald-50 hover:text-emerald-700"
          : "text-[#76777d] hover:bg-[#eff4ff] hover:text-black"
      }`}
    >
      {icon}
    </button>
  );
}