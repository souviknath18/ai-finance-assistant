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
      ? "border-red-100 bg-red-50 text-red-600"
      : tone === "green"
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-[#e6edf9] bg-[#f3f6fc] text-black";

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-[border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:shadow-[0_8px_26px_rgba(15,23,42,0.07)] md:flex-row md:items-center">
      {/* Service icon */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-[14px] font-bold ${toneClass}`}
      >
        {name.charAt(0).toUpperCase()}
      </div>

      {/* Subscription information */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-bold text-black">
              {name}
            </h3>

            <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
              {detail}
            </p>
          </div>

          {/* Amount */}
          <div className="shrink-0 sm:text-right">
            <p className="text-[16px] font-bold tracking-tight text-black">
              {amount}
            </p>

            <p
              className={`mt-1 text-[10px] font-bold ${
                next.includes("Est")
                  ? "text-emerald-700"
                  : "text-[#7c839b]"
              }`}
            >
              {next}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2 border-t border-[#edf2fb] pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
        <button
          type="button"
          onClick={onSecondaryAction}
          className="h-10 rounded-xl border border-[#e6edf9] bg-white px-4 text-[12px] font-bold text-black transition-[background-color,border-color,box-shadow] duration-200 hover:border-[#dbe5f5] hover:bg-[#f8faff] hover:shadow-[0_4px_12px_rgba(15,23,42,0.04)]"
        >
          {secondaryAction}
        </button>

        <button
          type="button"
          onClick={onPrimaryAction}
          className={`h-10 rounded-xl px-4 text-[12px] font-bold transition-[background-color,border-color,opacity,box-shadow] duration-200 ${
            danger
              ? "border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50"
              : "border border-black bg-black text-white hover:opacity-90 hover:shadow-[0_4px_12px_rgba(15,23,42,0.12)]"
          }`}
        >
          {primaryAction}
        </button>
      </div>
    </div>
  );
}