import { Plus, Download } from "lucide-react";

export default function TransactionsHeader() {
  return (
    <section className="mb-8">
      <div className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-black">
            Transactions
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#565e74]">
            Monitor and manage your financial records with AI-enhanced
            precision.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90">
            <Plus size={17} />
            Add Record
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-[#dce9ff] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#d3e4fe]">
            <Download size={17} />
            Export
          </button>
        </div>
      </div>
    </section>
  );
}