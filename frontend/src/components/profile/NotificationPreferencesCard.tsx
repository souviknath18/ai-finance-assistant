"use client";

import { useState } from "react";
import {
  Bell,
  Sparkles,
  Target,
} from "lucide-react";

const notifications = [
  {
    title: "AI Smart Alerts",
    desc: "Predictive alerts for spending anomalies",
    enabled: true,
    icon: Sparkles,
  },
  {
    title: "Weekly Digest",
    desc: "Sunday evening performance summary",
    enabled: true,
    icon: Bell,
  },
  {
    title: "Goal Milestones",
    desc: "Celebrate progress on your objectives",
    enabled: false,
    icon: Target,
  },
];

export default function NotificationPreferencesCard() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Bell
          size={15}
          className="text-emerald-700"
        />

        <h2 className="text-[15px] font-bold text-black">
          Notifications
        </h2>
      </div>

      <div className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
        <div className="space-y-3">
          {notifications.map((item) => (
            <NotificationToggle
              key={item.title}
              {...item}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({
  title,
  desc,
  enabled,
  icon: Icon,
}: {
  title: string;
  desc: string;
  enabled: boolean;
  icon: React.ElementType;
}) {
  const [active, setActive] =
    useState(enabled);

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <Icon size={15} />
        </div>

        <div className="min-w-0">
          <p className="text-[12px] font-bold text-black">
            {title}
          </p>

          <p className="mt-0.5 text-[10px] leading-4 text-[#7c839b]">
            {desc}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setActive((previous) => !previous)
        }
        aria-label={`${active ? "Disable" : "Enable"} ${title}`}
        aria-pressed={active}
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200 ${
          active
            ? "bg-emerald-700"
            : "bg-[#c6c6cd]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
            active
              ? "left-5"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}