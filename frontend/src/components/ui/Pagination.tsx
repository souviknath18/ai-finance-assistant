"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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

  const start =
    total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  const end = Math.min(currentPage * rowsPerPage, total);

  const mobilePages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).filter((page) => {
    return (
      page === 1 ||
      page === totalPages ||
      (page >= currentPage - 1 && page <= currentPage + 1)
    );
  });

  const desktopPages = Array.from(
    new Set([
      1,
      2,
      3,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      totalPages - 1,
      totalPages,
    ]),
  )
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const renderPageButtons = (pages: number[]) => {
    return pages.map((page, index) => {
      const previousPage = pages[index - 1];
      const shouldShowEllipsis =
        previousPage !== undefined && page - previousPage > 1;

      return (
        <div key={page} className="flex items-center gap-1">
          {shouldShowEllipsis && (
            <span className="px-1 text-[13px] text-[#7b8191]">
              ...
            </span>
          )}

          <button
            type="button"
            onClick={() => onPageChangeAction(page)}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[13px] font-semibold transition ${
              currentPage === page
                ? "border-black bg-black text-white"
                : "border-[#c6c6cd] bg-white text-[#0b1c30] hover:bg-[#edf3ff]"
            }`}
          >
            {page}
          </button>
        </div>
      );
    });
  };

  return (
    <div className="relative z-20 flex flex-col items-center justify-between gap-3 border-t border-[#e5eeff] p-4 lg:flex-row">
      {/* Left side */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <span className="text-[13px] text-[#565e74]">
          Showing{" "}
          <strong>
            {start}-{end}
          </strong>{" "}
          of {total} {itemLabel}
        </span>

        <div className="relative flex items-center gap-2">
          <span className="text-[13px] text-[#565e74]">
            Rows:
          </span>

          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((previous) => !previous)}
            className="flex h-8 min-w-[70px] items-center justify-between rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 text-[13px] font-semibold text-[#0b1c30] outline-none transition hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            {rowsPerPage}

            <ChevronDown
              size={15}
              className={`text-[#565e74] transition ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div
              role="listbox"
              className="absolute left-[44px] top-[calc(100%+6px)] z-[999] w-[70px] overflow-hidden rounded-xl border border-[#d3e4fe] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.14)]"
            >
              {rowOptions.map((option) => {
                const selected = option === rowsPerPage;

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onRowsPerPageChangeAction(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] transition ${
                      selected
                        ? "bg-emerald-50 font-semibold text-emerald-700"
                        : "text-[#45464d] hover:bg-[#eff4ff] hover:text-black"
                    }`}
                  >
                    <span>{option}</span>

                    {selected && <Check size={14} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex max-w-full items-center gap-2">
        <PaginationButton
          disabled={currentPage === 1}
          onClick={() =>
            onPageChangeAction(Math.max(1, currentPage - 1))
          }
        >
          <ChevronLeft size={16} />
        </PaginationButton>

        {/* Mobile: original pagination behavior */}
        <div className="flex items-center gap-1 sm:hidden">
          {renderPageButtons(mobilePages)}
        </div>

        {/* Tablet and desktop: first 3 and last 2 pages */}
        <div className="hidden items-center gap-1 sm:flex">
          {renderPageButtons(desktopPages)}
        </div>

        <PaginationButton
          disabled={
            currentPage === totalPages || totalPages === 0
          }
          onClick={() =>
            onPageChangeAction(
              Math.min(totalPages, currentPage + 1),
            )
          }
        >
          <ChevronRight size={16} />
        </PaginationButton>
      </div>
    </div>
  );
}