"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Edit3,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react";

type GoalCardMenuProps = {
  onAddFundsAction: () => void;
  onEditAction: () => void;
  onDeleteAction: () => void;
};

export default function GoalCardMenu({
  onAddFundsAction,
  onEditAction,
  onDeleteAction,
}: GoalCardMenuProps) {
  const menuRef =
    useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleAction = (
    action: () => void
  ) => {
    setMenuOpen(false);
    action();
  };

  return (
    <div
      ref={menuRef}
      className="relative"
    >
      {/* Menu Trigger */}
      <button
        type="button"
        onClick={() =>
          setMenuOpen(
            (previous) => !previous
          )
        }
        aria-label="Goal actions"
        aria-expanded={menuOpen}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border bg-white text-[#565e74] transition-[background-color,border-color,color] duration-200 ${
          menuOpen
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : "border-[#e6edf9] hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
      >
        <MoreVertical size={15} />
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 top-9 z-50 w-40 overflow-hidden rounded-xl border border-[#e6edf9] bg-white p-1 shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
          <GoalMenuButton
            icon={<Plus size={14} />}
            label="Add Funds"
            onClick={() =>
              handleAction(
                onAddFundsAction
              )
            }
          />

          <GoalMenuButton
            icon={<Edit3 size={14} />}
            label="Edit Goal"
            onClick={() =>
              handleAction(
                onEditAction
              )
            }
          />

          <div className="mx-2 my-0.5 h-px bg-[#edf2fb]" />

          <GoalMenuButton
            danger
            icon={<Trash2 size={14} />}
            label="Delete Goal"
            onClick={() =>
              handleAction(
                onDeleteAction
              )
            }
          />
        </div>
      )}
    </div>
  );
}

function GoalMenuButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold transition-colors duration-200 ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-[#45464d] hover:bg-[#f8faff] hover:text-black"
      }`}
    >
      <span
        className={`shrink-0 ${
          danger
            ? "text-red-500"
            : "text-[#7c839b]"
        }`}
      >
        {icon}
      </span>

      {label}
    </button>
  );
}