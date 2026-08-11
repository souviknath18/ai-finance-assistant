import {
  CreditCard,
  Plus,
} from "lucide-react";

export default function PaymentMethodCard() {
  return (
    <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold text-black">
          Payment Method
        </h2>

        <button
          type="button"
          className="text-[11px] font-bold text-emerald-700 transition hover:opacity-70"
        >
          Edit
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5">
        <div className="flex h-10 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74]">
          <CreditCard size={17} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-bold text-black">
            Visa ending in 4242
          </p>

          <p className="mt-0.5 text-[10px] text-[#7c839b]">
            Expires 12/26
          </p>
        </div>

        <span className="rounded-full border border-[#e6edf9] bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-[#565e74]">
          Default
        </span>
      </div>

      <button
        type="button"
        className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#c9d9f3] bg-[#fbfcff] text-[11px] font-bold text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-emerald-700"
      >
        <Plus size={14} />
        Add New Method
      </button>
    </div>
  );
}