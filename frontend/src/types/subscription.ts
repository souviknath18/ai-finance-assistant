export type DetectedSubscription = {
  merchant: string;
  transactions_count: number;
  average_amount: string;
  last_payment_date: string;
  last_amount: string;
  category: string;
  status: "recurring" | "detected_once";
};

export type DuplicateSubscriptionGroup = {
  group: string;
  services: string[];
  count: number;
};

export type UpcomingSubscriptionBill = {
  merchant: string;
  amount: string;
  next_date: string;
  days_remaining: number;
};

export type SubscriptionDashboardResponse = {
  subscriptions: DetectedSubscription[];
  duplicates: DuplicateSubscriptionGroup[];
  upcoming_bills: UpcomingSubscriptionBill[];
};