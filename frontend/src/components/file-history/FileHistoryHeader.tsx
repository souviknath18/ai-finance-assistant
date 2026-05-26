import { Upload } from "lucide-react";

export default function FileHistoryHeader() {
  return (
    <header className="mb-7 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black">
          File History
        </h1>

        <p className="mt-1.5 text-[13px] leading-6 text-[#565e74]">
          Review uploaded documents, extraction status, parsed transactions, and
          AI processing results.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
        <Upload size={15} />
        Upload New File
      </button>
    </header>
  );
}