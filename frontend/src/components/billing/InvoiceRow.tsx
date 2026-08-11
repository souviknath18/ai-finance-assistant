import { Download } from "lucide-react";

type InvoiceRowProps = {
  date: string;
  invoice: string;
  amount: string;
};

export default function InvoiceRow({
  date,
  invoice,
  amount,
}: InvoiceRowProps) {
  return (
    <tr className="transition-[background-color] hover:bg-[#fbfcff]">
      <td className="px-5 py-3.5 text-[12px] text-[#565e74]">
        {date}
      </td>

      <td className="px-5 py-3.5 text-[12px] font-semibold text-black">
        {invoice}
      </td>

      <td className="px-5 py-3.5 text-[12px] font-bold text-black">
        {amount}
      </td>

      <td className="px-5 py-3.5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Paid
        </span>
      </td>

      <td className="px-5 py-3.5 text-right">
        <button
          type="button"
          aria-label={`Download ${invoice}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#e6edf9] bg-white text-[#565e74] transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        >
          <Download size={14} />
        </button>
      </td>
    </tr>
  );
}