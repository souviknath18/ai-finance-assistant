"use client";

import {
  Landmark,
  Plus,
  Sparkles,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import AccountCard from "./AccountCard";
import AccountsHeader from "./AccountsHeader";
import AccountsSummary from "./AccountsSummary";
import ConnectAccountModal from "./ConnectAccountModal";

import ConfirmModal from "@/components/ui/ConfirmModal";
import ErrorScreen from "@/components/ui/ErrorScreen";
import PageLoader from "@/components/ui/PageLoader";

import {
  disconnectAccount,
  getAccountsDashboard,
  syncAccount,
} from "@/lib/api/accountApi";

import {
  AccountsDashboard,
} from "@/types/account";

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    typeof error ===
      "object" &&
    error !== null
  ) {
    const value =
      error as {
        detail?: string;
        non_field_errors?: string[];
      };

    if (value.detail) {
      return value.detail;
    }

    if (
      value.non_field_errors?.[0]
    ) {
      return value
        .non_field_errors[0];
    }
  }

  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return fallback;
}

export default function AccountsPage() {
  const router =
    useRouter();

  const [
    data,
    setData,
  ] =
    useState<AccountsDashboard | null>(
      null
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    );

  const [
    connectModalOpen,
    setConnectModalOpen,
  ] = useState(false);

  const [
    syncingAccountId,
    setSyncingAccountId,
  ] =
    useState<string | null>(
      null
    );

  const [
    disconnectAccountId,
    setDisconnectAccountId,
  ] =
    useState<string | null>(
      null
    );

  const [
    disconnectLoading,
    setDisconnectLoading,
  ] = useState(false);

  const loadAccounts =
    useCallback(
      async (
        showLoader = false
      ) => {
        try {
          setError(null);

          if (showLoader) {
            setLoading(true);
          }

          const result =
            await getAccountsDashboard();

          setData(result);
        } catch (err) {
          console.error(
            "Failed to load accounts:",
            err
          );

          setError(
            getErrorMessage(
              err,
              "We couldn't load your financial accounts."
            )
          );
        } finally {
          if (showLoader) {
            setLoading(false);
          }
        }
      },
      []
    );

  useEffect(() => {
    loadAccounts(true);
  }, [loadAccounts]);

  const hasSyncingAccounts =
    data?.accounts.some(
      (account) =>
        account.status === "syncing"
    ) ?? false;

  useEffect(() => {
    if (!hasSyncingAccounts) {
      return;
    }

    const intervalId =
      window.setInterval(() => {
        void loadAccounts();
      }, 2500);

    return () => {
      window.clearInterval(
        intervalId
      );
    };
  }, [
    hasSyncingAccounts,
    loadAccounts,
  ]);

  const handleSync =
    async (
      accountId: string
    ) => {
      try {
        setError(null);

        setSyncingAccountId(
          accountId
        );

        await syncAccount(
          accountId
        );

        // Fetch once immediately so the
        // server's "syncing" status appears.
        await loadAccounts();

      } catch (err) {
        console.error(
          "Failed to start account sync:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "We couldn't start syncing this account."
          )
        );

      } finally {
        setSyncingAccountId(
          null
        );
      }
    };

  const handleDisconnect =
    async () => {
      if (
        !disconnectAccountId
      ) {
        return;
      }

      try {
        setDisconnectLoading(
          true
        );

        setError(null);

        await disconnectAccount(
          disconnectAccountId
        );

        setDisconnectAccountId(
          null
        );

        await loadAccounts();
      } catch (err) {
        console.error(
          "Failed to disconnect account:",
          err
        );

        setError(
          getErrorMessage(
            err,
            "We couldn't disconnect this account."
          )
        );
      } finally {
        setDisconnectLoading(
          false
        );
      }
    };

  if (loading) {
    return <PageLoader />;
  }

  if (error && !data) {
    return (
      <ErrorScreen
        title="Unable to load accounts"
        message={error}
        retryText="Try Again"
        backText="Back to Dashboard"
        isRetrying={
          loading
        }
        onRetryAction={() =>
          loadAccounts(true)
        }
        onBackAction={() =>
          router.push(
            "/dashboard"
          )
        }
      />
    );
  }

  if (!data) {
    return null;
  }

  const hasAccounts =
    data.accounts.length > 0;

  return (
    <main className="min-h-screen">
      <AccountsHeader
        onConnectAction={() =>
          setConnectModalOpen(
            true
          )
        }
      />

      {error && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-[12px] font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      <AccountsSummary
        summary={
          data.summary
        }
      />

      {!hasAccounts ? (
        <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col items-center px-6 py-14 text-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#f3f7ff] text-[#0b1c30]">
              <Landmark
                size={28}
              />

              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                <Sparkles
                  size={11}
                />
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Automatic Finance
              Tracking
            </p>

            <h2 className="mt-2 text-[20px] font-bold tracking-tight text-black">
              Connect your first
              account
            </h2>

            <p className="mt-2 max-w-lg text-[12px] leading-6 text-[#667085]">
              Instead of uploading a
              financial statement every
              time, connect a demo bank
              account and let Aura
              automatically receive,
              categorize and analyze
              transaction activity.
            </p>

            <button
              type="button"
              onClick={() =>
                setConnectModalOpen(
                  true
                )
              }
              className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition hover:opacity-90"
            >
              <Plus size={14} />

              Connect Demo Account
            </button>
          </div>
        </section>
      ) : (
        <>
          <section className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-bold text-[#0b1c30]">
                Your Accounts
              </h2>

              <p className="mt-1 text-[11px] text-[#7c839b]">
                Aura uses these
                connections to keep
                your financial picture
                up to date.
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {data.accounts.map(
              (account) => (
                <AccountCard
                  key={
                    account.id
                  }
                  account={
                    account
                  }
                  syncing={
                    syncingAccountId ===
                    account.id
                  }
                  disconnecting={
                    disconnectLoading &&
                    disconnectAccountId ===
                      account.id
                  }
                  onSyncAction={
                    handleSync
                  }
                  onDisconnectAction={(
                    accountId
                  ) =>
                    setDisconnectAccountId(
                      accountId
                    )
                  }
                />
              )
            )}
          </section>
        </>
      )}

      <section className="mt-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-white p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Sparkles
              size={17}
            />
          </div>

          <div>
            <p className="text-[12px] font-bold text-[#0b1c30]">
              How Aura will use
              connected data
            </p>

            <p className="mt-1 max-w-3xl text-[11px] leading-5 text-[#565e74]">
              New transactions can
              flow through Aura&apos;s
              categorization,
              analytics, embeddings,
              semantic search and
              insight pipeline,
              allowing your dashboard
              and AI assistant to stay
              current without repeated
              document uploads.
            </p>
          </div>
        </div>
      </section>

      <ConnectAccountModal
        open={connectModalOpen}
        institutions={
          data.available_institutions
        }
        onCloseAction={() =>
          setConnectModalOpen(false)
        }
        onSuccessAction={() =>
          loadAccounts()
        }
      />

      <ConfirmModal
        open={
          Boolean(
            disconnectAccountId
          )
        }
        title="Disconnect Account"
        message="Are you sure you want to disconnect this financial account? Existing imported transactions can remain in Aura, but automatic syncing will stop."
        confirmText="Disconnect"
        loading={
          disconnectLoading
        }
        onCloseAction={() => {
          if (
            disconnectLoading
          ) {
            return;
          }

          setDisconnectAccountId(
            null
          );
        }}
        onConfirmAction={
          handleDisconnect
        }
      />
    </main>
  );
}