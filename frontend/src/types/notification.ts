export type NotificationTone =
  | "red"
  | "green"
  | "dark"
  | "purple"
  | "muted";

export type NotificationType =
  | "budget"
  | "goal"
  | "report"
  | "subscription"
  | "ai_alert"
  | "transaction";

export type AppNotification = {
  id: number;
  notification_id: string;
  title: string;
  description: string;
  notification_type: NotificationType;
  tone: NotificationTone;
  action_label?: string | null;
  action_url?: string | null;
  progress?: number | null;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  time: string;
};

export type NotificationResponse = {
  results: AppNotification[];
  counts: {
    all: number;
    budget: number;
    goal: number;
    report: number;
    subscription: number;
    ai_alert: number;
    transaction: number;
  };
};