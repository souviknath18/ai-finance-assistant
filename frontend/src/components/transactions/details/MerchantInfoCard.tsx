import {
  Building2,
  MapPin,
  Store,
} from "lucide-react";

import type {
  TransactionDetails,
} from "@/types/transaction";

type MerchantInfoCardProps = {
  merchant: TransactionDetails["merchant"];
};

export default function MerchantInfoCard({
  merchant,
}: MerchantInfoCardProps) {
  const hasLocation = Boolean(
    merchant.location
  );

  const hasIndustry = Boolean(
    merchant.industry
  );

  return (
    <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Merchant
          </p>

          <h3 className="mt-1 text-[16px] font-bold tracking-tight text-black">
            Merchant Information
          </h3>

          <p className="mt-1 text-[11px] leading-5 text-[#76777d]">
            Details associated with this
            transaction.
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700">
          <Store size={16} />
        </div>
      </div>

      {/* Merchant Name */}
      <div className="rounded-2xl border border-[#edf2fb] bg-[#fbfcff] p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74]">
            <Building2 size={17} />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a92a5]">
              Merchant Name
            </p>

            <h4
              title={merchant.name}
              className="mt-1 break-words text-[13px] font-bold leading-5 text-black"
            >
              {merchant.name ||
                "Unknown Merchant"}
            </h4>
          </div>
        </div>
      </div>

      {/* Merchant Details */}
      <div className="mt-3 grid grid-cols-1 gap-3">
        <MerchantDetail
          icon={<MapPin size={14} />}
          label="Location"
          value={
            merchant.location ??
            "Location unavailable"
          }
          available={hasLocation}
        />

        <MerchantDetail
          icon={<Store size={14} />}
          label="Industry"
          value={
            merchant.industry ??
            "Industry unavailable"
          }
          available={hasIndustry}
        />
      </div>

      {/* Coming Soon */}
      <div className="mt-4 rounded-2xl border border-dashed border-[#dce9ff] bg-[#fbfcff] p-3.5">
        <p className="text-[10px] leading-5 text-[#76777d]">
          Aura will eventually combine
          merchant history, recurring
          payments, spending patterns, and
          related insights into a dedicated
          merchant profile.
        </p>
      </div>

      <button
        type="button"
        disabled
        className="mt-4 flex h-10 w-full cursor-not-allowed items-center justify-center rounded-xl border border-[#e6edf9] bg-[#f8f9ff] px-4 text-[11px] font-bold text-[#9aa2b4] disabled:opacity-80"
      >
        Merchant Profile Coming Soon
      </button>
    </section>
  );
}

function MerchantDetail({
  icon,
  label,
  value,
  available,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  available: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#edf2fb] bg-[#fbfcff] px-3.5 py-3">
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
          available
            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
            : "border-[#e6edf9] bg-white text-[#9aa2b4]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a92a5]">
          {label}
        </p>

        <p
          title={value}
          className={`mt-1 break-words text-[11px] font-semibold leading-5 ${
            available
              ? "text-black"
              : "text-[#8a92a5]"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}