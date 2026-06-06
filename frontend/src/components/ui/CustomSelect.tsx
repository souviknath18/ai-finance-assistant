"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

export type SelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  name: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  open?: boolean;
  onOpenChangeAction?: (open: boolean) => void;
  onChangeAction: (name: string, value: string) => void;
};

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
};

export default function CustomSelect({
  name,
  value,
  options,
  placeholder = "Select",
  open: controlledOpen,
  onOpenChangeAction,
  onChangeAction,
}: CustomSelectProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    top: 0,
    left: 0,
    width: 0,
  });

  const open = controlledOpen ?? internalOpen;

  const selectedOption = options.find((option) => option.value === value);

  const setOpen = (value: boolean) => {
    if (onOpenChangeAction) {
      onOpenChangeAction(value);
    } else {
      setInternalOpen(value);
    }
  };

  const updateDropdownPosition = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    updateDropdownPosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const clickedInsideButton = wrapperRef.current?.contains(target);
      const clickedInsideDropdown = dropdownRef.current?.contains(target);

      if (clickedInsideButton || clickedInsideDropdown) return;

      setOpen(false);
    };

    const handleResize = () => {
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  return (
    <>
      <div ref={wrapperRef} className="relative z-10">
        <button
          type="button"
          onClick={() => {
            updateDropdownPosition();
            setOpen(!open);
          }}
          className="flex h-11 w-full items-center justify-between rounded-xl border border-[#c6c6cd] bg-[#f8f9ff] px-3 text-left text-[13px] text-[#0b1c30] outline-none transition hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        >
          <span>{selectedOption?.label || placeholder}</span>

          <ChevronDown
            size={16}
            className={`text-[#565e74] transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {mounted &&
        open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
            className="fixed z-[99999] max-h-56 overflow-y-auto rounded-xl border border-[#d3e4fe] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.14)] custom-select-scrollbar"
          >
            {options.map((option) => {
              const selected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChangeAction(name, option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-[13px] transition ${
                    selected
                      ? "bg-emerald-50 font-semibold text-emerald-700"
                      : "text-[#45464d] hover:bg-[#eff4ff] hover:text-black"
                  }`}
                >
                  <span>{option.label}</span>
                  {selected && <Check size={14} />}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}