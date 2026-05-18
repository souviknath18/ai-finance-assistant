export default function MerchantInfoCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e5eeff] bg-white shadow-sm">
      <div className="h-32 bg-gradient-to-br from-[#dce9ff] to-[#0b1c30]" />

      <div className="p-6">
        <h4 className="mb-2 text-lg font-bold text-black">
          CloudScale AI Services
        </h4>

        <p className="mb-5 text-sm leading-6 text-[#565e74]">
          San Francisco, CA · Enterprise AI Infrastructure
        </p>

        <button className="w-full rounded-xl border border-[#c6c6cd] py-3 text-sm font-bold text-black transition hover:bg-[#eff4ff]">
          View Merchant Profile
        </button>
      </div>
    </div>
  );
}