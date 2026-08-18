import {
  ArrowRight,
  Landmark,
  LockKeyhole,
} from "lucide-react";

import {
  BankInstitution,
} from "@/types/account";

type BankOptionCardProps = {
  institution: BankInstitution;
  selected: boolean;
  disabled?: boolean;
  onSelectAction: (
    institution: BankInstitution
  ) => void;
};

export default function BankOptionCard({
  institution,
  selected,
  disabled = false,
  onSelectAction,
}: BankOptionCardProps) {
  return (
    <button
      type="button"
      disabled={
        disabled ||
        !institution.available
      }
      onClick={() =>
        onSelectAction(
          institution
        )
      }
      className={`group flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition ${
        selected
          ? "border-emerald-300 bg-emerald-50/70 ring-2 ring-emerald-100"
          : "border-[#e6edf9] bg-white hover:border-emerald-200 hover:bg-emerald-50/30"
      } ${
        !institution.available
          ? "cursor-not-allowed opacity-50"
          : ""
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${
            selected
              ? "border-emerald-200 bg-white text-emerald-700"
              : "border-[#e6edf9] bg-[#f8faff] text-[#4f5b70]"
          }`}
        >
          <Landmark size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-[13px] font-bold text-[#0b1c30]">
              {
                institution.name
              }
            </p>

            {institution.available && (
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-blue-700">
                Demo
              </span>
            )}
          </div>

          <p className="mt-1 text-[11px] leading-4 text-[#7c839b]">
            {institution.description ||
              "Connect a demo account to import sample financial activity."}
          </p>
        </div>
      </div>

      {!institution.available ? (
        <LockKeyhole
          size={15}
          className="shrink-0 text-[#98a2b3]"
        />
      ) : (
        <ArrowRight
          size={15}
          className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
            selected
              ? "text-emerald-700"
              : "text-[#98a2b3]"
          }`}
        />
      )}
    </button>
  );
}