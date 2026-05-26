"use client";

import { useEffect, useState } from "react";
import SubscriptionsHeader from "./SubscriptionsHeader";
import SummaryMetrics from "./SummaryMetrics";
import ActiveSubscriptions from "./ActiveSubscriptions";
import RecommendationsPanel from "./RecommendationsPanel";
import AddSubscriptionModal from "./AddSubscriptionModal";
import { getDetectedSubscriptions } from "@/lib/api/subscriptionApi";
import { SubscriptionDashboardResponse } from "@/types/subscription";
import SubscriptionFilterModal, {
  SubscriptionFilters,
} from "./SubscriptionFilterModal";

const emptyDashboard: SubscriptionDashboardResponse = {
  subscriptions: [],
  duplicates: [],
  upcoming_bills: [],
};

const defaultFilters: SubscriptionFilters = {
  category: "All",
  source: "all",
  preference_status: "all",
  billing_cycle: "all",
  max_amount: 10000,
};

export default function SubscriptionsPage() {
  const [dashboard, setDashboard] =
    useState<SubscriptionDashboardResponse>(emptyDashboard);

  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<SubscriptionFilters>(defaultFilters);

  const loadSubscriptions = async () => {
    try {
      const data = await getDetectedSubscriptions();
      setDashboard(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const filteredSubscriptions = dashboard.subscriptions.filter((subscription) => {
    const amount = Number(subscription.average_amount);

    const categoryMatch =
      filters.category === "All" ||
      subscription.category?.toLowerCase() === filters.category.toLowerCase();

    const sourceMatch =
      filters.source === "all" || subscription.source === filters.source;

    const preferenceMatch =
      filters.preference_status === "all" ||
      subscription.preference_status === filters.preference_status ||
      (filters.preference_status === "cancel_candidate" &&
        subscription.preference_status === "ignored");

    const billingMatch =
      filters.billing_cycle === "all" ||
      subscription.billing_cycle === filters.billing_cycle;

    const amountMatch = amount <= filters.max_amount;

    return (
      categoryMatch &&
      sourceMatch &&
      preferenceMatch &&
      billingMatch &&
      amountMatch
    );
  });

  return (
    <>
      <SubscriptionsHeader
        count={filteredSubscriptions.length}
        onAddManualAction={() => setAddModalOpen(true)}
        onFilterAction={() => setFilterModalOpen(true)}
      />

      <SummaryMetrics
        subscriptions={filteredSubscriptions}
        duplicates={dashboard.duplicates}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ActiveSubscriptions
          subscriptions={filteredSubscriptions}
          loading={loading}
          onRefreshAction={loadSubscriptions}
          emptyMessage={
            dashboard.subscriptions.length === 0
              ? "No recurring subscriptions detected yet."
              : "No subscriptions match the selected filters."
          }
        />

        <RecommendationsPanel
          subscriptions={dashboard.subscriptions}
          duplicates={dashboard.duplicates}
          upcomingBills={dashboard.upcoming_bills}
          onRefreshAction={loadSubscriptions}
        />
      </div>

      <AddSubscriptionModal
        open={addModalOpen}
        onCloseAction={() => setAddModalOpen(false)}
        onSuccessAction={loadSubscriptions}
      />

      <SubscriptionFilterModal
        open={filterModalOpen}
        filters={filters}
        onCloseAction={() => setFilterModalOpen(false)}
        onApplyAction={setFilters}
        onClearAction={() => setFilters(defaultFilters)}
      />
    </>
  );
}