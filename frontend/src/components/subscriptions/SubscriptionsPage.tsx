"use client";

import { useEffect, useState } from "react";
import SubscriptionsHeader from "./SubscriptionsHeader";
import SummaryMetrics from "./SummaryMetrics";
import ActiveSubscriptions from "./ActiveSubscriptions";
import RecommendationsPanel from "./RecommendationsPanel";
import { getDetectedSubscriptions } from "@/lib/api/subscriptionApi";
import { SubscriptionDashboardResponse } from "@/types/subscription";

const emptyDashboard: SubscriptionDashboardResponse = {
  subscriptions: [],
  duplicates: [],
  upcoming_bills: [],
};

export default function SubscriptionsPage() {
  const [dashboard, setDashboard] =
    useState<SubscriptionDashboardResponse>(emptyDashboard);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const data = await getDetectedSubscriptions();
        setDashboard(data);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  return (
    <>
      <SubscriptionsHeader count={dashboard.subscriptions.length} />

      <SummaryMetrics subscriptions={dashboard.subscriptions} />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <ActiveSubscriptions
          subscriptions={dashboard.subscriptions}
          loading={loading}
        />

        <RecommendationsPanel
          subscriptions={dashboard.subscriptions}
          duplicates={dashboard.duplicates}
          upcomingBills={dashboard.upcoming_bills}
        />
      </div>
    </>
  );
}