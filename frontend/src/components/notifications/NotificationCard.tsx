"use client";

import { useRouter } from "next/navigation";

import { dismissNotification } from "@/lib/api/notificationsApi";

type NotificationCardProps = {
  id: number;
  icon: React.ReactNode;
  tone:
    | "red"
    | "green"
    | "dark"
    | "purple"
    | "muted";
  title: string;
  time: string;
  description: string;
  actions: string[];
  actionUrl?: string | null;
  dangerAction?: string;
  progress?: number;
  onRefreshAction: () => void;
};

export default function NotificationCard({
  id,
  icon,
  tone,
  title,
  time,
  description,
  actions,
  actionUrl,
  dangerAction,
  progress,
  onRefreshAction,
}: NotificationCardProps) {
  const router = useRouter();

  const toneMap = {
    red: {
      border: "border-red-100",
      accent: "bg-red-500",
      iconBg: "bg-red-50",
      iconText: "text-red-600",
    },

    green: {
      border: "border-emerald-100",
      accent: "bg-emerald-500",
      iconBg: "bg-emerald-50",
      iconText: "text-emerald-700",
    },

    dark: {
      border: "border-[#e6edf9]",
      accent: "bg-black",
      iconBg: "bg-[#f3f6fc]",
      iconText: "text-black",
    },

    purple: {
      border: "border-indigo-100",
      accent: "bg-indigo-500",
      iconBg: "bg-indigo-50",
      iconText: "text-indigo-700",
    },

    muted: {
      border: "border-[#e6edf9]",
      accent: "bg-[#8a92a5]",
      iconBg: "bg-[#f3f6fc]",
      iconText: "text-[#565e74]",
    },
  };

  const current =
    toneMap[tone];

  const safeProgress =
    progress === undefined
      ? undefined
      : Math.min(
          Math.max(progress, 0),
          100
        );

  const handleAction = async (
    action: string
  ) => {
    if (action === "Dismiss") {
      await dismissNotification(id);
      onRefreshAction();
      return;
    }

    if (actionUrl) {
      router.push(actionUrl);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${current.border} bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)] transition-[border-color,box-shadow] duration-200 hover:shadow-[0_8px_28px_rgba(15,23,42,0.07)]`}
    >
      <div
        className={`absolute bottom-0 left-0 top-0 w-1 ${current.accent}`}
      />

      <div className="flex gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/60 ${current.iconBg} ${current.iconText}`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h3 className="text-[14px] font-bold text-black">
              {title}
            </h3>

            <span className="shrink-0 text-[10px] font-medium text-[#8a92a5]">
              {time}
            </span>
          </div>

          <p className="mt-1.5 text-[12px] leading-5 text-[#565e74]">
            {description}
          </p>

          {safeProgress !== undefined && (
            <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[#edf2fb]">
              <div
                className="h-full rounded-full bg-emerald-700 transition-[width] duration-500"
                style={{
                  width: `${safeProgress}%`,
                }}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {actions.map((action) => {
              const danger =
                action === dangerAction;

              const dismiss =
                action === "Dismiss";

              return (
                <button
                  key={action}
                  type="button"
                  onClick={() =>
                    handleAction(action)
                  }
                  className={`text-[10px] font-bold uppercase tracking-wide transition hover:opacity-70 ${
                    danger
                      ? "text-red-600"
                      : dismiss
                      ? "text-[#7c839b] hover:text-black"
                      : "text-emerald-700"
                  }`}
                >
                  {action}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}