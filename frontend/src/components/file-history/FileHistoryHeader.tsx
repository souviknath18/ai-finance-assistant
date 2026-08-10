import Link from "next/link";
import { Upload } from "lucide-react";

export default function FileHistoryHeader() {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-black">
            File History
          </h1>

          <p className="mt-1 max-w-2xl text-[12px] leading-5 text-[#565e74]">
            Review uploaded documents, extraction status, parsed
            transactions, and Aura processing results.
          </p>
        </div>
      </div>

      <Link
        href="/uploads"
        className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)]"
      >
        <Upload size={15} />
        Upload New File
      </Link>
    </header>
  );
}