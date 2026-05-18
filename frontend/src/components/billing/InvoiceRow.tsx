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
    <tr className="border-b border-[#e5eeff] transition hover:bg-[#eff4ff]/50">
      <td className="px-6 py-4 text-sm text-black">{date}</td>

      <td className="px-6 py-4 text-sm text-black">{invoice}</td>

      <td className="px-6 py-4 text-sm text-black">{amount}</td>

      <td className="px-6 py-4">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
          Paid
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <button className="text-[#565e74] transition hover:text-black">
          <Download size={18} />
        </button>
      </td>
    </tr>
  );
}