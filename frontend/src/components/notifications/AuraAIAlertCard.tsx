"use client";

import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";

import { AppNotification } from "@/types/notification";

type AuraAIAlertCardProps = {
  notification?: AppNotification;
};

export default function AuraAIAlertCard({
  notification,
}: AuraAIAlertCardProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-[#0f2e28] p-5 shadow-[0_8px_28px_rgba(15,23,42,0.10)]">
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
          Aura AI
        </p>

        <h3 className="mt-2 text-[16px] font-bold text-white">
          Financial Intelligence Alert
        </h3>

        <p className="mt-2 text-[12px] leading-5 text-[#c6d5d2]">
          {notification?.description ||
            "Aura will show AI-powered financial alerts here once insights are available."}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push(
              notification?.action_url ||
                "/insights"
            )
          }
          className="mt-5 inline-flex h-9 items-center justify-center rounded-xl bg-emerald-200 px-4 text-[11px] font-bold text-emerald-950 transition hover:bg-emerald-100"
        >
          {notification?.action_label ||
            "View Insights"}
        </button>
      </div>

      <Brain
        size={100}
        className="pointer-events-none absolute -bottom-6 -right-5 text-white/[0.06]"
      />
    </div>
  );
}