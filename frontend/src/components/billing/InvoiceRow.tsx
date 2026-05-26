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
      <td className="px-5 py-3.5 text-[13px] text-black">{date}</td>

      <td className="px-5 py-3.5 text-[13px] text-black">{invoice}</td>

      <td className="px-5 py-3.5 text-[13px] text-black">{amount}</td>

      <td className="px-5 py-3.5">
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
          Paid
        </span>
      </td>

      <td className="px-5 py-3.5 text-right">
        <button className="text-[#565e74] transition hover:text-black">
          <Download size={16} />
        </button>
      </td>
    </tr>
  );
}