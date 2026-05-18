import { CreditCard, Plus } from "lucide-react";

export default function PaymentMethodCard() {
  return (
    <div className="rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-black">
          Payment Method
        </h3>

        <button className="text-sm font-bold text-emerald-700 hover:underline">
          Edit
        </button>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-[#c6c6cd] p-4">
        <div className="flex h-12 w-14 items-center justify-center rounded-xl bg-[#eff4ff] text-[#565e74]">
          <CreditCard size={22} />
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold text-black">
            Visa ending in 4242
          </p>

          <p className="mt-1 text-xs text-[#565e74]">
            Expires 12/26
          </p>
        </div>

        <span className="rounded-full bg-[#eff4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#565e74]">
          Default
        </span>
      </div>

      <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#c6c6cd] py-4 text-sm font-bold text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black">
        <Plus size={17} />
        Add New Method
      </button>
    </div>
  );
}