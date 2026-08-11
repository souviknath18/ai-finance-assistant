import {
  BadgeCheck,
  Edit,
  Flag,
  Trash2,
} from "lucide-react";

import type {
  TransactionDetails,
} from "@/types/transaction";

type DetailsHeaderProps = {
  transaction: TransactionDetails;
  deleting: boolean;
  onDelete: () => void;
};

export default function DetailsHeader({
  transaction,
  deleting,
  onDelete,
}: DetailsHeaderProps) {
  function toTitleCase(
    text: string
  ) {
    return text
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  }

  return (
    <section className="mb-5 flex flex-col gap-4 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] sm:flex-row sm:items-start sm:justify-between">
      {/* Left */}
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
            <BadgeCheck size={11} />
            {transaction.status}
          </span>

          {transaction.isRecurring && (
            <span className="rounded-full border border-[#e6edf9] bg-[#fbfcff] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#565e74]">
              Recurring
            </span>
          )}
        </div>

        <h1 className="line-clamp-2 break-words text-xl font-bold leading-tight tracking-tight text-black sm:text-[22px]">
          {toTitleCase(
            transaction.title
          )}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <ActionButton
          icon={
            <Edit size={14} />
          }
          label="Edit Details"
        />

        <ActionButton
          icon={
            <Flag size={14} />
          }
          label={
            transaction.reviewNeeded
              ? "Mark Reviewed"
              : "Flag for Review"
          }
        />

        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-[12px] font-bold text-white transition-[background-color,opacity,box-shadow] duration-200 hover:bg-red-700 hover:shadow-[0_6px_16px_rgba(220,38,38,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={14} />

          {deleting
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    </section>
  );
}

function ActionButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,color,box-shadow] duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700 hover:shadow-[0_4px_12px_rgba(15,23,42,0.05)]"
    >
      {icon}
      {label}
    </button>
  );
}