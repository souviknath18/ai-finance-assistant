export type SubscriptionPreferenceStatus =
  | "active"
  | "confirmed"
  | "ignored"
  | "cancel_candidate";

export type SubscriptionSource = "detected" | "manual";
export type SubscriptionBillingCycle = "weekly" | "monthly" | "yearly";
export type SubscriptionStatus = "detected_once" | "recurring";

export type DetectedSubscription = {
  id: number;
  subscription_id: string;
  merchant: string;
  transactions_count: number;
  average_amount: string;
  last_payment_date: string | null;
  last_amount: string;
  next_billing_date: string | null;
  category: string | null;
  status: SubscriptionStatus;
  source: SubscriptionSource;
  billing_cycle: SubscriptionBillingCycle;
  preference_status: SubscriptionPreferenceStatus;
  preference_note?: string | null;
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

export type CreateManualSubscriptionPayload = {
  merchant: string;
  category: string;
  amount: string;
  billing_cycle: SubscriptionBillingCycle;
  next_billing_date: string;
  smart_reminder: boolean;
};

export type UpdateSubscriptionPreferencePayload = {
  subscription_id: string;
  status: SubscriptionPreferenceStatus;
  note?: string;
};