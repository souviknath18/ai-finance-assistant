import { CheckCircle2 } from "lucide-react";
import type {
  TransactionDetails,
  TransactionStatus,
} from "@/types/transaction";

type SummaryCardProps = {
  transaction: TransactionDetails;
  onCategoryChange: (category: string) => void;
};

export default function SummaryCard({
  transaction,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        <InfoBlock
          label="Amount"
          value={transaction.amount}
          helper={
            transaction.isRecurring
              ? "Recurring"
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
        />

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Category
          </p>

          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
            {transaction.category}
          </span>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
            Status
          </p>

          <div
            className={`flex items-center gap-2 text-[13px] font-bold ${getStatusColor(
              transaction.status,
            )}`}
          >
            <CheckCircle2 size={16} />
            {transaction.status}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(
  status: TransactionStatus,
) {
  switch (status) {
    case "AI Verified":
    case "Rule Verified":
    case "User Verified":
      return "text-emerald-700";

    case "AI Review Needed":
      return "text-amber-700";

    default:
      return "text-slate-700";
  }
}

function InfoBlock({
  label,
  value,
  helper,
  valueColor = "text-black",
}: {
  label: string;
  value: string;
  helper?: string;
  valueColor?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </p>

      <p className={`text-[18px] font-bold ${valueColor}`}>
        {value}
      </p>

      {helper && (
        <p className="mt-1 text-[12px] font-bold text-emerald-700">
          {helper}
        </p>
      )}
    </div>
  );
}