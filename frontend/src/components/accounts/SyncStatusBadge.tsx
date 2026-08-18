import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  Unplug,
} from "lucide-react";

import {
  AccountConnectionStatus,
} from "@/types/account";

type SyncStatusBadgeProps = {
  status: AccountConnectionStatus;
};

export default function SyncStatusBadge({
  status,
}: SyncStatusBadgeProps) {
  if (status === "syncing") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
        <LoaderCircle
          size={11}
          className="animate-spin"
        />

        Syncing
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-700">
        <AlertTriangle size={11} />

        Attention
      </span>
    );
  }

  if (status === "disconnected") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold text-slate-600">
        <Unplug size={11} />

        Disconnected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
      <CheckCircle2 size={11} />

      Connected
    </span>
  );
}