import IconCircle from "./IconCircle";

type WealthTipCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  potentialEarn: string;
  potentialDescription: string;
};

export default function WealthTipCard({
  icon,
  title,
  description,
  potentialEarn,
  potentialDescription,
}: WealthTipCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-transparent bg-white p-5 shadow-sm transition hover:border-[#c6c6cd] hover:shadow-md">
      <div>
        <div className="mb-4 flex items-center gap-3">
          <IconCircle tone="purple">{icon}</IconCircle>

          <h3 className="text-[11px] font-bold uppercase tracking-wide text-black">
            Wealth Tip
          </h3>
        </div>

        <h4 className="mb-2 text-xl font-bold text-black">{title}</h4>

        <p className="text-[13px] leading-6 text-[#565e74]">{description}</p>
      </div>

      <div className="mt-5">
        <div className="mb-4 rounded-2xl bg-[#dce9ff] p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-black">
            Potential Earn
          </p>

          <p className="text-xl font-bold text-emerald-700">
            {potentialEarn}
          </p>

          <p className="text-[13px] text-[#565e74]">
            {potentialDescription}
          </p>
        </div>

        <button className="w-full rounded-xl bg-black py-2.5 text-[13px] font-bold text-white transition hover:opacity-90">
          Execute Transfer
        </button>
      </div>
    </div>
  );
}