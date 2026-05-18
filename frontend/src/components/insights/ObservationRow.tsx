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
      <td className="px-6 py-5">
        <p className="text-sm font-bold text-black">{title}</p>
        <p className="mt-1 text-sm text-[#565e74]">{desc}</p>
      </td>

      <td className="px-6 py-5">
        <span className="rounded-full bg-[#dce9ff] px-3 py-1 text-xs font-bold text-black">
          {category}
        </span>
      </td>

      <td
        className={`px-6 py-5 text-sm font-bold ${
          neutral ? "text-[#565e74]" : "text-emerald-700"
        }`}
      >
        {impact}
      </td>

      <td className="px-6 py-5">
        <button className="text-sm font-bold text-black underline">
          {action}
        </button>
      </td>
    </tr>
  );
}