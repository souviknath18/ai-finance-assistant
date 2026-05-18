import IconCircle from "./IconCircle";

type WealthTipCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function WealthTipCard({
  icon,
  title,
  description,
}: WealthTipCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-transparent bg-white p-6 shadow-sm transition hover:border-[#c6c6cd] hover:shadow-md">
      <div>
        <div className="mb-5 flex items-center gap-3">
          <IconCircle tone="purple">{icon}</IconCircle>

          <h3 className="text-xs font-bold uppercase tracking-wide text-black">
            Wealth Tip
          </h3>
        </div>

        <h4 className="mb-3 text-2xl font-bold text-black">
          {title}
        </h4>

        <p className="text-sm leading-7 text-[#565e74]">
          {description}
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-5 rounded-3xl bg-[#dce9ff] p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-black">
            Potential Earn
          </p>

          <p className="text-2xl font-bold text-emerald-700">
            +₹1,840/mo
          </p>

          <p className="text-sm text-[#565e74]">
            by moving to High-Yield Savings.
          </p>
        </div>

        <button className="w-full rounded-xl bg-black py-3 text-sm font-bold text-white transition hover:opacity-90">
          Execute Transfer
        </button>
      </div>
    </div>
  );
}