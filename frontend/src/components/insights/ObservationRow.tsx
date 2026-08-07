type ObservationRowProps = {
  title: string;
  desc: string;
  category: string;
  impact: string;
  action: string;
  neutral?: boolean;
};

export default function ObservationRow({
  title,
  desc,
  category,
  impact,
  action,
  neutral = false,
}: ObservationRowProps) {
  return (
    <tr className="transition hover:bg-[#fbfdff]">
      {/* Insight */}
      <td className="px-5 py-4 align-top">
        <div className="max-w-md">
          <p className="text-[13px] font-bold leading-5 text-black">
            {title}
          </p>

          <p className="mt-1 text-[12px] leading-5 text-[#565e74]">
            {desc}
          </p>
        </div>
      </td>

      {/* Category */}
      <td className="px-5 py-4 align-top">
        <span className="inline-flex rounded-full border border-[#e5eeff] bg-[#eff4ff] px-2.5 py-1 text-[11px] font-bold text-black">
          {category || "General"}
        </span>
      </td>

      {/* Impact */}
      <td className="px-5 py-4 align-top">
        <span
          className={`text-[13px] font-bold ${
            neutral ? "text-[#565e74]" : "text-emerald-700"
          }`}
        >
          {impact || "—"}
        </span>
      </td>

      {/* Action */}
      <td className="px-5 py-4 align-top">
        <button
          type="button"
          className="rounded-lg border border-[#e5eeff] bg-white px-3 py-1.5 text-[11px] font-bold text-black shadow-sm transition hover:bg-[#eff4ff]"
        >
          {action || "View"}
        </button>
      </td>
    </tr>
  );
}