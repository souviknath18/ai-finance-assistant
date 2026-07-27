import ParsedResult from "./ParsedResult";
import { UploadedFile } from "@/types/upload";
import { useRouter } from "next/navigation";

type ParsedResultsCardProps = {
  files: UploadedFile[];
};

export default function ParsedResultsCard({ files }: ParsedResultsCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-[#dfe9fb] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
      <h3 className="mb-5 text-lg font-bold text-black">
        Recent Parsed Results
      </h3>

      {files.length === 0 ? (
        <p className="text-[13px] text-[#565e74]">No parsed files yet.</p>
      ) : (
        <div className="space-y-2.5">
          {files.slice(0, 3).map((file) => (
            <ParsedResult
              key={file.id}
              title={file.original_filename}
              subtitle={`${file.extracted_transactions_count} transactions found`}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => router.push("/history")}
        className="mt-5 w-full rounded-xl border border-[#dfe9fb] bg-white py-2.5 text-[13px] font-bold text-black transition hover:border-[#c9d9f3] hover:bg-[#eff4ff]"
      >
        Review All Results
      </button>
    </div>
  );
}