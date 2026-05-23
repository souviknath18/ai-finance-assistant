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
    <div className="flex flex-col gap-5 rounded-3xl border border-[#dce9ff] bg-white p-6 shadow-sm transition hover:shadow-md md:flex-row md:items-center">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
      >
        <span className="text-lg font-black">{name.charAt(0)}</span>
      </div>

      <div className="flex-1">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-black">{name}</h3>
            <p className="text-sm text-[#565e74]">{detail}</p>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-black">{amount}</p>
            <p
              className={`text-xs font-bold ${
                next.includes("Est") ? "text-emerald-700" : "text-[#7c839b]"
              }`}
            >
              {next}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 md:border-l md:border-[#c6c6cd] md:pl-6">
        <button
          onClick={onSecondaryAction}
          className="rounded-xl border border-[#c6c6cd] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#eff4ff]"
        >
          {secondaryAction}
        </button>

        <button
          onClick={onPrimaryAction}
          className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
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