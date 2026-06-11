import { Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppNotification } from "@/types/notification";

type AuraAIAlertCardProps = {
  notification?: AppNotification;
};

export default function AuraAIAlertCard({ notification }: AuraAIAlertCardProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black p-5 text-white shadow-sm">
      <div className="relative z-10">
        <h2 className="mb-1.5 text-lg font-bold text-[#dae2fd]">Aura AI</h2>

        <p className="mb-5 text-[13px] leading-5 text-[#bec6e0]">
          {notification?.description ||
            "Aura will show AI-powered financial alerts here once insights are available."}
        </p>

        <button
          onClick={() => router.push(notification?.action_url || "/insights")}
          className="rounded-full bg-emerald-200 px-4 py-2 text-[11px] font-bold text-emerald-950"
        >
          {notification?.action_label || "View Insights"}
        </button>
      </div>

      <Brain size={96} className="absolute -bottom-5 -right-5 text-white/10" />
    </div>
  );
}