"use client";

import { useState } from "react";

export default function ToggleSwitch({ enabled = false }: { enabled?: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <button
      type="button"
      onClick={() => setIsEnabled(!isEnabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        isEnabled ? "bg-emerald-700" : "bg-[#c6c6cd]"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
          isEnabled ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}