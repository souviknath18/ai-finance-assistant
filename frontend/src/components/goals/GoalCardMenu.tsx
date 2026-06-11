"use client";

import { useEffect, useRef, useState } from "react";
import { Edit3, MoreVertical, Plus, Trash2 } from "lucide-react";

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
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    setMenuOpen(false);
    action();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        className="rounded-lg p-1 text-[#76777d] transition hover:bg-[#eff4ff] hover:text-black"
      >
        <MoreVertical size={18} />
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-8 z-50 w-44 overflow-hidden rounded-xl border border-[#dce9ff] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.14)]">
          <GoalMenuButton
            icon={<Plus size={14} />}
            label="Add Funds"
            onClick={() => handleAction(onAddFundsAction)}
          />

          <GoalMenuButton
            icon={<Edit3 size={14} />}
            label="Edit Goal"
            onClick={() => handleAction(onEditAction)}
          />

          <GoalMenuButton
            danger
            icon={<Trash2 size={14} />}
            label="Delete Goal"
            onClick={() => handleAction(onDeleteAction)}
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
      className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] font-semibold transition ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-[#45464d] hover:bg-[#f8f9ff] hover:text-black"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}