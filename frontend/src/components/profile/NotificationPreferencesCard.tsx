"use client";

import { useState } from "react";

const notifications = [
  {
    title: "AI Smart Alerts",
    desc: "Predictive alerts for spending anomalies",
    enabled: true,
  },
  {
    title: "Weekly Digest",
    desc: "Sunday evening performance summary",
    enabled: true,
  },
  {
    title: "Goal Milestones",
    desc: "Celebrate progress on your objectives",
    enabled: false,
  },
];

export default function NotificationPreferencesCard() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-black">Notifications</h2>

      <div className="space-y-4 rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm">
        {notifications.map((item) => (
          <NotificationToggle key={item.title} {...item} />
        ))}
      </div>
    </div>
  );
}

function NotificationToggle({
  title,
  desc,
  enabled,
}: {
  title: string;
  desc: string;
  enabled: boolean;
}) {
  const [active, setActive] = useState(enabled);

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[13px] font-bold text-black">{title}</p>
        <p className="mt-1 text-[12px] leading-5 text-[#565e74]">{desc}</p>
      </div>

      <button
        type="button"
        onClick={() => setActive(!active)}
        className={`relative h-6 w-10 shrink-0 rounded-full transition ${
          active ? "bg-emerald-700" : "bg-[#c6c6cd]"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            active ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}