import { Upload } from "lucide-react";

export default function FileHistoryHeader() {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-black">
          File History
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#565e74]">
          Review uploaded documents, extraction status, parsed transactions, and
          AI processing results.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90">
        <Upload size={17} />
        Upload New File
      </button>
    </header>
  );
}