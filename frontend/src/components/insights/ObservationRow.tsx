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
    <tr className="transition hover:bg-[#f8f9ff]">
      <td className="px-5 py-4">
        <p className="text-[13px] font-bold text-black">{title}</p>
        <p className="mt-1 text-[13px] text-[#565e74]">{desc}</p>
      </td>

      <td className="px-5 py-4">
        <span className="rounded-full bg-[#dce9ff] px-2.5 py-1 text-[11px] font-bold text-black">
          {category}
        </span>
      </td>

      <td
        className={`px-5 py-4 text-[13px] font-bold ${
          neutral ? "text-[#565e74]" : "text-emerald-700"
        }`}
      >
        {impact}
      </td>

      <td className="px-5 py-4">
        <button className="text-[13px] font-bold text-black underline">
          {action}
        </button>
      </td>
    </tr>
  );
}