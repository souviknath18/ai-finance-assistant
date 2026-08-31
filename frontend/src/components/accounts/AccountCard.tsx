"use client";

import {
  Building2,
  RefreshCcw,
  Trash2,
} from "lucide-react";

import SyncStatusBadge from "./SyncStatusBadge";

import {
  FinancialAccount,
} from "@/types/account";

type AccountCardProps = {
  account: FinancialAccount;

  syncing: boolean;
  disconnecting: boolean;

  onSyncAction: (
    accountId: string
  ) => void;

  onDisconnectAction: (
    accountId: string
  ) => void;
};

function formatCurrency(
  amount: number | null,
  currency: string
) {
  if (amount === null) {
    return "Balance unavailable";
  }

  try {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency:
          currency || "INR",
        maximumFractionDigits: 2,
      }
    ).format(amount);
  } catch {
    return `₹${amount.toLocaleString(
      "en-IN"
    )}`;
  }
}

function formatDate(
  value: string | null
) {
  if (!value) {
    return "Never synced";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "Never synced";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}

export default function AccountCard({
  account,
  syncing,
  disconnecting,
  onSyncAction,
  onDisconnectAction,
}: AccountCardProps) {
  const isSyncing =
    syncing ||
    account.status === "syncing";

  const busy =
    isSyncing ||
    disconnecting;

  return (
    <article className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.045)]">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#e6edf9] bg-[#f8faff] text-[#0b1c30]">
              <Building2
                size={18}
              />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[14px] font-bold text-[#0b1c30]">
                {
                  account.institution_name
                }
              </h2>

              <p className="mt-0.5 truncate text-[11px] font-medium text-[#7c839b]">
                {
                  account.account_name
                }
                {" · "}
                {
                  account.account_type
                }
              </p>
            </div>
          </div>

          <SyncStatusBadge
            status={
              isSyncing
                ? "syncing"
                : account.status
            }
          />
        </div>

        <div className="mt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#98a2b3]">
            Current Balance
          </p>

          <p className="mt-1 text-[24px] font-bold tracking-tight text-black">
            {formatCurrency(
              account.balance,
              account.currency
            )}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#f8faff] p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
              Account
            </p>

            <p className="mt-1 text-[12px] font-semibold text-[#334155]">
              ••••{" "}
              {
                account.masked_account_number
              }
            </p>
          </div>

          <div className="rounded-2xl bg-[#f8faff] p-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#98a2b3]">
              Currency
            </p>

            <p className="mt-1 text-[12px] font-semibold text-[#334155]">
              {
                account.currency
              }
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-[#edf2fb] pt-4">
          <p className="text-[10px] font-medium text-[#8a93a6]">
            Last synced
          </p>

          <p className="mt-0.5 text-[11px] font-semibold text-[#4f5b70]">
            {formatDate(
              account.last_synced_at
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[#edf2fb] bg-[#fbfcff] px-5 py-3.5">
        <button
          type="button"
          disabled={
            busy ||
            account.status ===
              "disconnected"
          }
          onClick={() =>
            onSyncAction(
              account.id
            )
          }
          className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-black px-4 text-[11px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCcw
            size={13}
            className={
              isSyncing
                ? "animate-spin"
                : ""
            }
          />

          {isSyncing
            ? "Syncing..."
            : "Sync Now"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() =>
            onDisconnectAction(
              account.id
            )
          }
          aria-label={`Disconnect ${account.institution_name}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </article>
  );
}