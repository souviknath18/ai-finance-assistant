type SubscriptionCardProps = {
  name: string;
  detail: string;
  amount: string;
  next: string;
  tone: string;
  primaryAction: string;
  secondaryAction: string;
  danger?: boolean;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

export default function SubscriptionCard({
  name,
  detail,
  amount,
  next,
  tone,
  primaryAction,
  secondaryAction,
  danger = false,
  onPrimaryAction,
  onSecondaryAction,
}: SubscriptionCardProps) {
  const toneClass =
    tone === "red"
      ? "bg-red-50 text-red-600"
      : tone === "green"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-[#dce9ff] text-black";

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#dce9ff] bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:items-center">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
      >
        <span className="text-base font-black">{name.charAt(0)}</span>
      </div>

      <div className="flex-1">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-black">{name}</h3>
            <p className="text-[13px] text-[#565e74]">{detail}</p>
          </div>

          <div className="text-right">
            <p className="text-base font-bold text-black">{amount}</p>
            <p
              className={`text-[11px] font-bold ${
                next.includes("Est") ? "text-emerald-700" : "text-[#7c839b]"
              }`}
            >
              {next}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 md:border-l md:border-[#c6c6cd] md:pl-5">
        <button
          onClick={onSecondaryAction}
          className="rounded-xl border border-[#c6c6cd] px-4 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff]"
        >
          {secondaryAction}
        </button>

        <button
          onClick={onPrimaryAction}
          className={`rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${
            danger
              ? "border border-red-600 text-red-600 hover:bg-red-50"
              : "bg-black text-white hover:opacity-90"
          }`}
        >
          {primaryAction}
        </button>
      </div>
    </div>
  );
}