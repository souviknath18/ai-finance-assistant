import { BadgeCheck, Edit, Flag, Trash2 } from "lucide-react";
import type { TransactionDetails } from "@/types/transaction";

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
  function toTitleCase(text: string) {
    return text
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  return (
    <section className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      {/* Left */}
      <div className="min-w-0">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
          <BadgeCheck size={14} />
          {transaction.status} Transaction
        </div>

        <h1 className="break-words text-2xl font-bold tracking-tight text-black sm:text-3xl">
          {toTitleCase(transaction.title)}
        </h1>
      </div>

      {/* Right */}
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap xl:justify-end">
        <ActionButton
          icon={<Edit size={16} />}
          label="Edit Details"
        />

        <ActionButton
          icon={<Flag size={16} />}
          label={
            transaction.reviewNeeded
              ? "Mark Reviewed"
              : "Flag for Review"
          }
        />

        <button className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-red-700">
          <Trash2 size={16} />
          Delete
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
    <button className="flex items-center justify-center gap-2 rounded-xl border border-[#c6c6cd] bg-white px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]">
      {icon}
      {label}
    </button>
  );
}