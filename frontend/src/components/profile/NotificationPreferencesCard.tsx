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
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-black">Notifications</h2>

      <div className="space-y-5 rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm">
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
    <div className="flex items-center justify-between gap-5">
      <div>
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="mt-1 text-xs text-[#565e74]">{desc}</p>
      </div>

      <button
        type="button"
        onClick={() => setActive(!active)}
        className={`relative h-6 w-10 rounded-full transition ${
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