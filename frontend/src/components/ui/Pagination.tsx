"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

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

  onPageChangeAction: (
    page: number
  ) => void;

  onRowsPerPageChangeAction: (
    value: number
  ) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

const rowOptions = [
  5,
  10,
  25,
  50,
];

export default function Pagination({
  total,
  currentPage,
  totalPages,
  rowsPerPage,
  itemLabel = "items",
  onPageChangeAction,
  onRowsPerPageChangeAction,
}: PaginationProps) {
  const buttonRef =
    useRef<HTMLButtonElement | null>(
      null
    );

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [open, setOpen] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [
    dropdownPosition,
    setDropdownPosition,
  ] =
    useState<DropdownPosition>({
      top: 0,
      left: 0,
      width: 70,
    });

  const start =
    total === 0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const end = Math.min(
    currentPage * rowsPerPage,
    total
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateDropdownPosition =
    () => {
      if (
        !buttonRef.current
      ) {
        return;
      }

      const rect =
        buttonRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      });
    };

  useLayoutEffect(() => {
    if (!open) return;

    updateDropdownPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      const clickedButton =
        buttonRef.current?.contains(
          target
        );

      const clickedDropdown =
        dropdownRef.current?.contains(
          target
        );

      if (
        clickedButton ||
        clickedDropdown
      ) {
        return;
      }

      setOpen(false);
    };

    const handleScroll = (
      event: Event
    ) => {
      const target =
        event.target;

      if (
        target instanceof Node &&
        dropdownRef.current?.contains(
          target
        )
      ) {
        return;
      }

      setOpen(false);
    };

    const handleResize = () => {
      setOpen(false);
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, [open]);

  const mobilePages =
    Array.from(
      {
        length:
          totalPages,
      },
      (_, index) =>
        index + 1
    ).filter((page) => {
      return (
        page === 1 ||
        page ===
          totalPages ||
        (page >=
          currentPage - 1 &&
          page <=
            currentPage + 1)
      );
    });

  const desktopPages =
    Array.from(
      new Set([
        1,
        2,
        3,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        totalPages - 1,
        totalPages,
      ])
    )
      .filter(
        (page) =>
          page >= 1 &&
          page <=
            totalPages
      )
      .sort(
        (a, b) =>
          a - b
      );

  const renderPageButtons = (
    pages: number[]
  ) => {
    return pages.map(
      (
        page,
        index
      ) => {
        const previousPage =
          pages[index - 1];

        const shouldShowEllipsis =
          previousPage !==
            undefined &&
          page -
            previousPage >
            1;

        return (
          <div
            key={page}
            className="flex items-center gap-1"
          >
            {shouldShowEllipsis && (
              <span className="px-1 text-[13px] text-[#7b8191]">
                ...
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                onPageChangeAction(
                  page
                )
              }
              aria-label={`Go to page ${page}`}
              aria-current={
                currentPage ===
                page
                  ? "page"
                  : undefined
              }
              className={`flex h-8 min-w-8 items-center justify-center rounded-lg border px-2 text-[13px] font-semibold transition-[background-color,border-color,color] ${
                currentPage ===
                page
                  ? "border-black bg-black text-white"
                  : "border-[#dfe9fb] bg-white text-[#0b1c30] hover:border-[#c9d9f3] hover:bg-[#f8f9ff]"
              }`}
            >
              {page}
            </button>
          </div>
        );
      }
    );
  };

  return (
    <>
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-[12px] text-[#565e74]">
            Showing{" "}
            <span className="font-bold text-black">
              {start}-
              {end}
            </span>{" "}
            of{" "}
            <span className="font-bold text-black">
              {total}
            </span>{" "}
            {itemLabel}
          </p>

          {/* Rows */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#565e74]">
              Rows:
            </span>

            <button
              ref={buttonRef}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={
                open
              }
              onClick={() => {
                updateDropdownPosition();

                setOpen(
                  (previous) =>
                    !previous
                );
              }}
              className={`flex h-8 min-w-[70px] items-center justify-between rounded-xl border bg-[#f8f9ff] px-3 text-[12px] font-semibold text-[#0b1c30] outline-none transition ${
                open
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              }`}
            >
              {
                rowsPerPage
              }

              <ChevronDown
                size={14}
                className={`text-[#565e74] transition ${
                  open
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex max-w-full items-center gap-2">
          <PaginationButton
            disabled={
              currentPage ===
              1
            }
            ariaLabel="Previous page"
            onClick={() =>
              onPageChangeAction(
                Math.max(
                  1,
                  currentPage -
                    1
                )
              )
            }
          >
            <ChevronLeft
              size={16}
            />
          </PaginationButton>

          {/* Mobile */}
          <div className="flex items-center gap-1 sm:hidden">
            {renderPageButtons(
              mobilePages
            )}
          </div>

          {/* Desktop */}
          <div className="hidden items-center gap-1 sm:flex">
            {renderPageButtons(
              desktopPages
            )}
          </div>

          <PaginationButton
            disabled={
              currentPage ===
                totalPages ||
              totalPages ===
                0
            }
            ariaLabel="Next page"
            onClick={() =>
              onPageChangeAction(
                Math.min(
                  totalPages,
                  currentPage +
                    1
                )
              )
            }
          >
            <ChevronRight
              size={16}
            />
          </PaginationButton>
        </div>
      </div>

      {/* Portal Dropdown */}
      {mounted &&
        open &&
        createPortal(
          <div
            ref={
              dropdownRef
            }
            role="listbox"
            style={{
              top:
                dropdownPosition.top,
              left:
                dropdownPosition.left,
              width:
                dropdownPosition.width,
            }}
            className="fixed z-[99999] overflow-hidden rounded-xl border border-[#dfe9fb] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.14)]"
          >
            {rowOptions.map(
              (
                option
              ) => {
                const selected =
                  option ===
                  rowsPerPage;

                return (
                  <button
                    key={
                      option
                    }
                    type="button"
                    role="option"
                    aria-selected={
                      selected
                    }
                    onClick={() => {
                      onRowsPerPageChangeAction(
                        option
                      );

                      setOpen(
                        false
                      );
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-[12px] transition ${
                      selected
                        ? "bg-emerald-50 font-semibold text-emerald-700"
                        : "text-[#45464d] hover:bg-[#eff4ff] hover:text-black"
                    }`}
                  >
                    <span>
                      {
                        option
                      }
                    </span>

                    {selected && (
                      <Check
                        size={
                          14
                        }
                      />
                    )}
                  </button>
                );
              }
            )}
          </div>,
          document.body
        )}
    </>
  );
}