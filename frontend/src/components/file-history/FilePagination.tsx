import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChangeAction: (page: number) => void;
};

export default function FilePagination({
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChangeAction,
}: Props) {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#dce9ff] bg-[#f8f9ff] px-5 py-3.5 md:flex-row">
      <p className="text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
        Showing {start} to {end} of {totalCount} files
      </p>

      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => onPageChangeAction(page - 1)}
          className="rounded-lg border border-[#c6c6cd] p-1.5 text-[#565e74] disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <button
            key={item}
            onClick={() => onPageChangeAction(item)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${
              item === page
                ? "bg-black text-white"
                : "text-black hover:bg-[#e5eeff]"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => onPageChangeAction(page + 1)}
          className="rounded-lg border border-[#c6c6cd] p-1.5 text-black hover:bg-[#e5eeff] disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}