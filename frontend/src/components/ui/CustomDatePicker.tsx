"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type CustomDatePickerProps = {
  label: string;
  name: string;
  value: string;
  optional?: boolean;
  onChangeAction: (
    name: string,
    value: string
  ) => void;
};

const weekDays = [
  "S",
  "M",
  "T",
  "W",
  "T",
  "F",
  "S",
];

function formatDateValue(
  date: Date
) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function CustomDatePicker({
  label,
  name,
  value,
  optional,
  onChangeAction,
}: CustomDatePickerProps) {
  const buttonRef =
    useRef<HTMLButtonElement | null>(
      null
    );

  const calendarRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [mounted, setMounted] =
    useState(false);

  const [open, setOpen] =
    useState(false);

  const [
    position,
    setPosition,
  ] = useState({
    top: 0,
    left: 0,
    width: 260,
  });

  const [
    visibleDate,
    setVisibleDate,
  ] = useState(() => {
    if (!value) {
      return new Date();
    }

    const [
      year,
      month,
      day,
    ] = value
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    );
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!value) {
      return;
    }

    const [
      year,
      month,
      day,
    ] = value
      .split("-")
      .map(Number);

    setVisibleDate(
      new Date(
        year,
        month - 1,
        day
      )
    );
  }, [value]);

  const year =
    visibleDate.getFullYear();

  const month =
    visibleDate.getMonth();

  const days = useMemo(() => {
    const firstDay =
      new Date(
        year,
        month,
        1
      );

    const lastDay =
      new Date(
        year,
        month + 1,
        0
      );

    const result: (
      | Date
      | null
    )[] = [];

    for (
      let index = 0;
      index <
      firstDay.getDay();
      index++
    ) {
      result.push(null);
    }

    for (
      let day = 1;
      day <=
      lastDay.getDate();
      day++
    ) {
      result.push(
        new Date(
          year,
          month,
          day
        )
      );
    }

    return result;
  }, [
    year,
    month,
  ]);

  const selectedDate =
    value
      ? (() => {
          const [
            selectedYear,
            selectedMonth,
            selectedDay,
          ] = value
            .split("-")
            .map(Number);

          return new Date(
            selectedYear,
            selectedMonth - 1,
            selectedDay
          );
        })()
      : null;

  const updatePosition = () => {
    if (!buttonRef.current) {
      return;
    }

    const rect =
      buttonRef.current.getBoundingClientRect();

    const viewportPadding = 12;
    const gap = 8;

    /*
      Approximate height of the calendar.
      The popup can vary slightly depending
      on whether "Clear Date" is visible.
    */
    const calendarHeight =
      value ? 360 : 315;

    const spaceBelow =
      window.innerHeight -
      rect.bottom;

    const spaceAbove =
      rect.top;

    const openUpward =
      spaceBelow <
        calendarHeight +
          gap &&
      spaceAbove >
        spaceBelow;

    const desiredWidth =
      Math.max(
        rect.width,
        260
      );

    const maxAvailableWidth =
      Math.max(
        window.innerWidth -
          viewportPadding *
            2,
        220
      );

    const width =
      Math.min(
        desiredWidth,
        maxAvailableWidth
      );

    const left =
      Math.min(
        Math.max(
          rect.left,
          viewportPadding
        ),
        window.innerWidth -
          width -
          viewportPadding
      );

    let top: number;

    if (openUpward) {
      top =
        rect.top -
        calendarHeight -
        gap;

      top = Math.max(
        viewportPadding,
        top
      );
    } else {
      top =
        rect.bottom +
        gap;

      if (
        top +
          calendarHeight >
        window.innerHeight -
          viewportPadding
      ) {
        top =
          window.innerHeight -
          calendarHeight -
          viewportPadding;
      }

      top = Math.max(
        viewportPadding,
        top
      );
    }

    setPosition({
      top,
      left,
      width,
    });
  };

  const toggleCalendar = () => {
    if (!open) {
      updatePosition();
    }

    setOpen(
      (prev) => !prev
    );
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleScroll = () => {
      setOpen(false);
    };

    const handleResize = () => {
      updatePosition();
    };

    const handleClickOutside = (
      event: MouseEvent
    ) => {
      const target =
        event.target as Node;

      if (
        buttonRef.current?.contains(
          target
        ) ||
        calendarRef.current?.contains(
          target
        )
      ) {
        return;
      }

      setOpen(false);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open]);

  const calendarPopup =
    open && mounted
      ? createPortal(
          <div
            ref={calendarRef}
            className="fixed z-[99999] rounded-2xl border border-[#e6edf9] bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.14)]"
            style={{
              top:
                position.top,
              left:
                position.left,
              width:
                position.width,
            }}
          >
            {/* Calendar Header */}
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setVisibleDate(
                    new Date(
                      year,
                      month - 1,
                      1
                    )
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[#565e74] transition hover:border-[#e6edf9] hover:bg-[#f8f9ff] hover:text-black"
              >
                <ChevronLeft
                  size={17}
                />
              </button>

              <p className="text-[13px] font-bold text-black">
                {visibleDate.toLocaleDateString(
                  "en-US",
                  {
                    month:
                      "long",
                    year:
                      "numeric",
                  }
                )}
              </p>

              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setVisibleDate(
                    new Date(
                      year,
                      month + 1,
                      1
                    )
                  )
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-[#565e74] transition hover:border-[#e6edf9] hover:bg-[#f8f9ff] hover:text-black"
              >
                <ChevronRight
                  size={17}
                />
              </button>
            </div>

            {/* Week Days */}
            <div className="mb-1.5 grid grid-cols-7 gap-1">
              {weekDays.map(
                (
                  day,
                  index
                ) => (
                  <div
                    key={`${day}-${index}`}
                    className="flex h-8 items-center justify-center text-[10px] font-bold uppercase text-[#8a92a5]"
                  >
                    {day}
                  </div>
                )
              )}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(
                (
                  date,
                  index
                ) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${index}`}
                        className="h-8"
                      />
                    );
                  }

                  const dateValue =
                    formatDateValue(
                      date
                    );

                  const selected =
                    selectedDate &&
                    formatDateValue(
                      selectedDate
                    ) ===
                      dateValue;

                  const today =
                    formatDateValue(
                      new Date()
                    ) ===
                    dateValue;

                  return (
                    <button
                      key={
                        dateValue
                      }
                      type="button"
                      onClick={() => {
                        onChangeAction(
                          name,
                          dateValue
                        );

                        setOpen(
                          false
                        );
                      }}
                      className={`relative flex h-8 items-center justify-center rounded-lg text-[11px] font-medium transition ${
                        selected
                          ? "bg-emerald-700 font-bold text-white"
                          : today
                            ? "bg-emerald-50 font-bold text-emerald-700"
                            : "text-[#45464d] hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                }
              )}
            </div>

            {/* Clear */}
            {value && (
              <div className="mt-3 border-t border-[#edf2fb] pt-3">
                <button
                  type="button"
                  onClick={() => {
                    onChangeAction(
                      name,
                      ""
                    );

                    setOpen(
                      false
                    );
                  }}
                  className="h-9 w-full rounded-xl border border-[#dfe9fb] bg-white text-[11px] font-bold text-black transition hover:border-[#c9d9f3] hover:bg-[#f8f9ff]"
                >
                  Clear Date
                </button>
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div>
      {/* Label */}
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#7c839b]">
        {label}

        {optional && (
          <span className="ml-1 font-medium normal-case tracking-normal text-[#9aa2b4]">
            (optional)
          </span>
        )}
      </label>

      {/* Date Input */}
      <button
        ref={buttonRef}
        type="button"
        onClick={
          toggleCalendar
        }
        className={`flex h-11 w-full items-center justify-between rounded-xl border bg-[#f8f9ff] px-3 text-left text-[13px] text-[#0b1c30] outline-none transition ${
          open
            ? "border-emerald-300 ring-2 ring-emerald-100"
            : "border-[#dfe9fb] hover:border-[#c9d9f3] focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
        }`}
      >
        <span
          className={
            value
              ? "text-[#0b1c30]"
              : "text-[#76777d]"
          }
        >
          {value ||
            "Select date"}
        </span>

        <CalendarDays
          size={16}
          className={`shrink-0 transition ${
            open
              ? "text-emerald-700"
              : "text-[#565e74]"
          }`}
        />
      </button>

      {calendarPopup}
    </div>
  );
}