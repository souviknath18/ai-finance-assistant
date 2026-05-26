"use client";

import { useState } from "react";

export default function ToggleSwitch({ enabled = false }: { enabled?: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <button
      type="button"
      onClick={() => setIsEnabled(!isEnabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
        isEnabled ? "bg-emerald-700" : "bg-[#c6c6cd]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          isEnabled ? "translate-x-4" : "translate-x-1"
        }`}
      />
    </button>
  );
}