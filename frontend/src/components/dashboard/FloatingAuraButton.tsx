"use client";

import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

export default function FloatingAuraButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/chat")}
      aria-label="Ask Aura"
      className="group fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-[0_14px_34px_rgba(15,23,42,0.22)] transition-[transform,box-shadow,opacity] duration-200 hover:scale-105 hover:shadow-[0_18px_40px_rgba(15,23,42,0.28)] active:scale-95 sm:bottom-6 sm:right-6"
    >
      <Bot size={19} />

      <span className="pointer-events-none absolute right-[58px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl bg-black px-3 py-2 text-[10px] font-bold text-white opacity-0 shadow-[0_8px_20px_rgba(15,23,42,0.18)] transition-opacity duration-200 group-hover:opacity-100 sm:block">
        Ask Aura
      </span>
    </button>
  );
}