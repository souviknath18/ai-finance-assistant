"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import PaginationButton from "./PaginationButton";

type PaginationProps = {
  total: number;
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  itemLabel?: string;
  onPageChangeAction: (page: number) => void;
  onRowsPerPageChangeAction: (value: number) => void;
};

const rowOptions = [5, 10, 25, 50];

export default function Pagination({
  total,
  currentPage,
  totalPages,
  rowsPerPage,
  itemLabel = "items",
  onPageChangeAction,
  onRowsPerPageChangeAction,
}: PaginationProps) {
  const [open, setOpen] = useState(false);

  const start = total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const end = Math.min(currentPage * rowsPerPage, total);

  return (
    <div className="relative z-20 flex flex-col items-center justify-between gap-4 border-t border-[#c6c6cd] p-5 lg:flex-row">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <span className="text-sm text-[#565e74]">
          Showing <strong>{start}-{end}</strong> of {total} {itemLabel}
        </span>

        <div className="relative flex items-center gap-2">
          <span className="text-sm text-[#565e74]">Rows:</span>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-9 min-w-[76px] items-center justify-between rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 text-sm font-semibold text-[#0b1c30] outline-none transition hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            {rowsPerPage}

            <ChevronDown
              size={16}
              className={`text-[#565e74] transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute left-[48px] top-[calc(100%+6px)] z-[999] w-[76px] overflow-hidden rounded-xl border border-[#d3e4fe] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.14)]">
              {rowOptions.map((option) => {
                const selected = option === rowsPerPage;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onRowsPerPageChangeAction(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition ${
                      selected
                        ? "bg-emerald-50 font-semibold text-emerald-700"
                        : "text-[#45464d] hover:bg-[#eff4ff] hover:text-black"
                    }`}
                  >
                    <span>{option}</span>
                    {selected && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() => onPageChangeAction(currentPage - 1)}
        >
          <ChevronLeft size={18} />
        </PaginationButton>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              );
            })
            .map((page, index, array) => {
              const previousPage = array[index - 1];

              return (
                <div key={page} className="flex items-center gap-1">
                  {previousPage && page - previousPage > 1 && (
                    <span className="px-1 text-sm text-[#7b8191]">...</span>
                  )}

                  <button
                    type="button"
                    onClick={() => onPageChangeAction(page)}
                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                      currentPage === page
                        ? "border-black bg-black text-white"
                        : "border-[#c6c6cd] bg-white text-[#0b1c30] hover:bg-[#edf3ff]"
                    }`}
                  >
                    {page}
                  </button>
                </div>
              );
            })}
        </div>

        <PaginationButton
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChangeAction(currentPage + 1)}
        >
          <ChevronRight size={18} />
        </PaginationButton>
      </div>
    </div>
  );
}