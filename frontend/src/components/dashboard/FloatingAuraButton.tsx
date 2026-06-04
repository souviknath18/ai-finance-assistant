"use client";

import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

export default function FloatingAuraButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/chat")}
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-[0_18px_45px_rgba(79,70,229,0.35)] transition hover:scale-105 active:scale-95"
    >
      <Bot size={24} />

      <span className="pointer-events-none absolute right-16 rounded-xl bg-black px-3 py-2 text-[12px] font-bold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
        Ask Aura
      </span>
    </button>
  );
}