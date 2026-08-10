"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import SubscriptionsHeader from "./SubscriptionsHeader";
import SummaryMetrics from "./SummaryMetrics";
import ActiveSubscriptions from "./ActiveSubscriptions";
import RecommendationsPanel from "./RecommendationsPanel";
import AddSubscriptionModal from "./AddSubscriptionModal";
import SubscriptionFilterModal, {
  SubscriptionFilters,
} from "./SubscriptionFilterModal";

import PageLoader from "@/components/ui/PageLoader";
import ErrorScreen from "@/components/ui/ErrorScreen";

import { getDetectedSubscriptions } from "@/lib/api/subscriptionApi";

import { SubscriptionDashboardResponse } from "@/types/subscription";

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
  const [
    dashboard,
    setDashboard,
  ] =
    useState<SubscriptionDashboardResponse>(
      emptyDashboard
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [
    addModalOpen,
    setAddModalOpen,
  ] = useState(false);

  const [
    filterModalOpen,
    setFilterModalOpen,
  ] = useState(false);

  const [filters, setFilters] =
    useState<SubscriptionFilters>(
      defaultFilters
    );

  const loadSubscriptions =
    useCallback(async () => {
      try {
        setError(null);

        const data =
          await getDetectedSubscriptions();

        setDashboard(data);
      } catch (error) {
        console.error(
          "Failed to load subscriptions:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load subscriptions."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const filteredSubscriptions =
    dashboard.subscriptions.filter(
      (subscription) => {
        const amount = Number(
          subscription.average_amount
        );

        const categoryMatch =
          filters.category === "All" ||
          subscription.category?.toLowerCase() ===
            filters.category.toLowerCase();

        const sourceMatch =
          filters.source === "all" ||
          subscription.source ===
            filters.source;

        const preferenceMatch =
          filters.preference_status ===
            "all" ||
          subscription.preference_status ===
            filters.preference_status ||
          (filters.preference_status ===
            "cancel_candidate" &&
            subscription.preference_status ===
              "ignored");

        const billingMatch =
          filters.billing_cycle ===
            "all" ||
          subscription.billing_cycle ===
            filters.billing_cycle;

        const amountMatch =
          amount <=
          filters.max_amount;

        return (
          categoryMatch &&
          sourceMatch &&
          preferenceMatch &&
          billingMatch &&
          amountMatch
        );
      }
    );

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <ErrorScreen
        title="Unable to load subscriptions"
        message={error}
        retryText="Try Again"
        onRetryAction={() => {
          setLoading(true);
          loadSubscriptions();
        }}
      />
    );
  }

  return (
    <>
      {/* Page Header */}
      <SubscriptionsHeader
        count={
          filteredSubscriptions.length
        }
        onAddManualAction={() =>
          setAddModalOpen(true)
        }
        onFilterAction={() =>
          setFilterModalOpen(true)
        }
      />

      {/* Summary */}
      <SummaryMetrics
        subscriptions={
          filteredSubscriptions
        }
        duplicates={
          dashboard.duplicates
        }
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <ActiveSubscriptions
          subscriptions={
            filteredSubscriptions
          }
          loading={false}
          onRefreshAction={
            loadSubscriptions
          }
          emptyMessage={
            dashboard.subscriptions
              .length === 0
              ? "No recurring subscriptions detected yet."
              : "No subscriptions match the selected filters."
          }
        />

        <RecommendationsPanel
          subscriptions={
            dashboard.subscriptions
          }
          duplicates={
            dashboard.duplicates
          }
          upcomingBills={
            dashboard.upcoming_bills
          }
          onRefreshAction={
            loadSubscriptions
          }
        />
      </div>

      {/* Add Subscription */}
      <AddSubscriptionModal
        open={addModalOpen}
        onCloseAction={() =>
          setAddModalOpen(false)
        }
        onSuccessAction={
          loadSubscriptions
        }
      />

      {/* Filters */}
      <SubscriptionFilterModal
        open={filterModalOpen}
        filters={filters}
        onCloseAction={() =>
          setFilterModalOpen(false)
        }
        onApplyAction={
          setFilters
        }
        onClearAction={() =>
          setFilters(
            defaultFilters
          )
        }
      />
    </>
  );
}