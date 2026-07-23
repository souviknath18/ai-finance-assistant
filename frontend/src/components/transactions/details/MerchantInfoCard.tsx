import type { TransactionDetails } from "@/types/transaction";

type MerchantInfoCardProps = {
  merchant: TransactionDetails["merchant"];
};

export default function MerchantInfoCard({
  merchant,
}: MerchantInfoCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5eeff] bg-white shadow-sm">
      <div className="h-24 bg-gradient-to-br from-[#dce9ff] to-[#0b1c30]" />

      <div className="p-5">
        <h4 className="text-[16px] font-bold text-black">
          {merchant.name}
        </h4>

        <p className="mt-2 text-[13px] leading-6 text-[#565e74]">
          {merchant.location ?? "Location unavailable"}
        </p>

        <p className="text-[13px] leading-6 text-[#565e74]">
          {merchant.industry ?? "Industry unavailable"}
        </p>

        <button
          type="button"
          disabled
          className="mt-5 w-full cursor-not-allowed rounded-xl border border-[#c6c6cd] py-2.5 text-[13px] font-bold text-[#8a8f9d]"
        >
          Merchant Profile Coming Soon
        </button>
      </div>
    </div>
  );
}