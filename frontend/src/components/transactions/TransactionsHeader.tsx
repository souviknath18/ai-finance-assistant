import { Plus, Download } from "lucide-react";

export default function TransactionsHeader() {
  return (
    <section className="mb-7">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-black">
            Transactions
          </h1>

          <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
            Monitor and manage your financial records with AI-enhanced
            precision.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
            <Plus size={15} />
            Add Record
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-[#dce9ff] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#d3e4fe]">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>
    </section>
  );
}