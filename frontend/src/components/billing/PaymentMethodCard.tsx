import { CreditCard, Plus } from "lucide-react";

export default function PaymentMethodCard() {
  return (
    <div className="rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-black">
          Payment Method
        </h3>

        <button className="text-[13px] font-bold text-emerald-700 hover:underline">
          Edit
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-[#c6c6cd] p-3.5">
        <div className="flex h-10 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#565e74]">
          <CreditCard size={18} />
        </div>

        <div className="flex-1">
          <p className="text-[13px] font-bold text-black">
            Visa ending in 4242
          </p>

          <p className="mt-1 text-[11px] text-[#565e74]">
            Expires 12/26
          </p>
        </div>

        <span className="rounded-full bg-[#eff4ff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#565e74]">
          Default
        </span>
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#c6c6cd] py-3 text-[13px] font-bold text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black">
        <Plus size={15} />
        Add New Method
      </button>
    </div>
  );
}