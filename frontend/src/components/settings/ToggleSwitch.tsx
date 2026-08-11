"use client";

import { useState } from "react";

export default function ToggleSwitch({
  enabled = false,
}: {
  enabled?: boolean;
}) {
  const [
    isEnabled,
    setIsEnabled,
  ] = useState(enabled);

  return (
    <button
      type="button"
      onClick={() =>
        setIsEnabled(
          (previous) => !previous
        )
      }
      aria-pressed={isEnabled}
      className={`relative h-6 w-10 shrink-0 rounded-full transition ${
        isEnabled
          ? "bg-emerald-700"
          : "bg-[#c6c6cd]"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
          isEnabled
            ? "right-1"
            : "left-1"
        }`}
      />
    </button>
  );
}