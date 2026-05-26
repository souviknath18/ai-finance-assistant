"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

type DateRangeFilterProps = {
  label: string;
  name: "startDate" | "endDate";
  value: string;
  onChangeAction: (name: "startDate" | "endDate", value: string) => void;
};

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function DateRangeFilter({
  label,
  name,
  value,
  onChangeAction,
}: DateRangeFilterProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 260,
  });

  const [visibleDate, setVisibleDate] = useState(() => {
    if (!value) return new Date();

    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const year = visibleDate.getFullYear();
  const month = visibleDate.getMonth();

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const result: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) result.push(null);

    for (let day = 1; day <= lastDay.getDate(); day++) {
      result.push(new Date(year, month, day));
    }

    return result;
  }, [year, month]);

  const selectedDate = value
    ? (() => {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
      })()
    : null;

  const updatePosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 260),
    });
  };

  const toggleCalendar = () => {
    updatePosition();
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleScroll = () => {
      setOpen(false);
    };

    const handleResize = () => {
      setOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        calendarRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const calendarPopup =
    open && mounted
      ? createPortal(
          <div
            ref={calendarRef}
            className="fixed z-[99999] rounded-2xl border border-[#d3e4fe] bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.14)]"
            style={{
              top: position.top,
              left: position.left,
              width: position.width,
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setVisibleDate(new Date(year, month - 1, 1))}
                className="rounded-lg p-2 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
              >
                <ChevronLeft size={17} />
              </button>

              <p className="text-sm font-bold text-black">
                {visibleDate.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <button
                type="button"
                onClick={() => setVisibleDate(new Date(year, month + 1, 1))}
                className="rounded-lg p-2 text-[#565e74] transition hover:bg-[#eff4ff] hover:text-black"
              >
                <ChevronRight size={17} />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1">
              {weekDays.map((day, index) => (
                <div
                  key={`${day}-${index}`}
                  className="flex h-8 items-center justify-center text-xs font-bold text-[#76777d]"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => {
                if (!date) return <div key={`empty-${index}`} className="h-8" />;

                const dateValue = formatDateValue(date);
                const selected =
                  selectedDate && formatDateValue(selectedDate) === dateValue;

                return (
                  <button
                    key={dateValue}
                    type="button"
                    onClick={() => {
                      onChangeAction(name, dateValue);
                      setOpen(false);
                    }}
                    className={`flex h-8 items-center justify-center rounded-lg text-xs transition ${
                      selected
                        ? "bg-black font-bold text-white"
                        : "text-[#45464d] hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChangeAction(name, "");
                  setOpen(false);
                }}
                className="mt-4 w-full rounded-xl border border-[#c6c6cd] py-2 text-xs font-bold text-black transition hover:bg-[#eff4ff]"
              >
                Clear Date
              </button>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wide text-[#565e74]">
        {label}
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={toggleCalendar}
        className="flex h-11 w-full items-center justify-between rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 text-left text-[13px] text-[#0b1c30] outline-none transition hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
      >
        <span className={value ? "text-[#0b1c30]" : "text-[#76777d]"}>
          {value || "Select date"}
        </span>

        <CalendarDays size={16} className="text-[#565e74]" />
      </button>

      {calendarPopup}
    </div>
  );
}