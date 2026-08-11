"use client";

import {
  CalendarDays,
  CheckCircle2,
  Repeat2,
  WalletCards,
} from "lucide-react";

import type {
  TransactionDetails,
  TransactionStatus,
} from "@/types/transaction";
import CategoryBadge from "@/components/ui/CategoryBadge";

type SummaryCardProps = {
  transaction: TransactionDetails;
};

export default function SummaryCard({
  transaction,
}: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Transaction Summary
        </p>

        <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
          Core Details
        </h2>

        <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
          Review the amount, date, category, and verification status.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoBlock
          label="Amount"
          value={transaction.amount}
          icon={<WalletCards size={16} />}
          helper={
            transaction.isRecurring
              ? "Recurring payment"
              : undefined
          }
          valueColor={
            transaction.type === "expense"
              ? "text-red-600"
              : "text-emerald-700"
          }
        />

        <InfoBlock
          label="Date"
          value={transaction.date}
          icon={<CalendarDays size={16} />}
        />

        {/* Category */}
        <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
            Category
          </p>

          <div className="mt-3">
            <CategoryBadge category={transaction.category} />

            {transaction.category === "Uncategorized" && (
              <p className="mt-2 text-[10px] font-medium text-amber-700">
                Category review needed
              </p>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
            Status
          </p>

          <div className="mt-3">
            <StatusBadge
              status={transaction.status}
            />
          </div>
        </div>
      </div>

      {/* Recurring note */}
      {transaction.isRecurring && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-3">
          <Repeat2
            size={14}
            className="mt-0.5 shrink-0 text-emerald-700"
          />

          <p className="text-[11px] leading-5 text-emerald-800">
            Aura detected this transaction as part of a recurring payment
            pattern.
          </p>
        </div>
      )}
    </div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
  helper,
  valueColor = "text-black",
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  helper?: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#7c839b]">
          {label}
        </p>

        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74]">
          {icon}
        </div>
      </div>

      <p className={`text-[18px] font-bold tracking-tight ${valueColor}`}>
        {value}
      </p>

      {helper && (
        <p className="mt-1.5 text-[10px] font-semibold text-emerald-700">
          {helper}
        </p>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const styles = getStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles}`}
    >
      <CheckCircle2 size={12} />
      {status}
    </span>
  );
}

function getStatusStyles(
  status: TransactionStatus
) {
  switch (status) {
    case "AI Verified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Rule Verified":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";

    case "User Verified":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "AI Review Needed":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-[#dce9ff] bg-[#eff4ff] text-[#565e74]";
  }
}