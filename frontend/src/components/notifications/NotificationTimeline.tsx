import {
  AlertTriangle,
  Repeat,
  TrendingUp,
  ShoppingCart,
  FileText,
  Brain,
} from "lucide-react";

import NotificationSection from "./NotificationSection";
import NotificationCard from "./NotificationCard";
import { AppNotification } from "@/types/notification";

type NotificationTimelineProps = {
  notifications: AppNotification[];
  onRefreshAction: () => void;
};

function getIcon(type: AppNotification["notification_type"]) {
  if (type === "budget") return <AlertTriangle size={18} />;
  if (type === "subscription") return <Repeat size={18} />;
  if (type === "goal") return <TrendingUp size={18} />;
  if (type === "report") return <FileText size={18} />;
  if (type === "ai_alert") return <Brain size={18} />;
  return <ShoppingCart size={18} />;
}

function getSectionTitle(createdAt: string) {
  const date = new Date(createdAt);
  const today = new Date();

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return "Earlier";
}

export default function NotificationTimeline({
  notifications,
  onRefreshAction,
}: NotificationTimelineProps) {
  const grouped = {
    Today: notifications.filter(
      (item) => getSectionTitle(item.created_at) === "Today"
    ),
    Yesterday: notifications.filter(
      (item) => getSectionTitle(item.created_at) === "Yesterday"
    ),
    Earlier: notifications.filter(
      (item) => getSectionTitle(item.created_at) === "Earlier"
    ),
  };

  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-[#e5eeff] bg-white p-8 text-center shadow-sm">
        <h3 className="text-lg font-bold text-black">No notifications yet</h3>
        <p className="mt-2 text-[13px] text-[#565e74]">
          Aura will show budget warnings, reports, subscriptions, and AI alerts
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([title, items]) => {
        if (items.length === 0) return null;

        return (
          <NotificationSection
            key={title}
            title={title}
            muted={title === "Yesterday"}
            faded={title === "Earlier"}
          >
            {items.map((item) => (
              <NotificationCard
                key={item.id}
                id={item.id}
                icon={getIcon(item.notification_type)}
                tone={item.tone}
                title={item.title}
                time={item.time}
                description={item.description}
                actions={[
                  item.action_label || "View Details",
                  "Dismiss",
                ]}
                actionUrl={item.action_url}
                progress={item.progress || undefined}
                onRefreshAction={onRefreshAction}
              />
            ))}
          </NotificationSection>
        );
      })}
    </div>
  );
}