import InvoiceRow from "./InvoiceRow";

const invoices = [
  {
    date: "Dec 24, 2024",
    invoice: "INV-0129-A",
    amount: "$29.00",
  },
  {
    date: "Nov 24, 2024",
    invoice: "INV-0128-A",
    amount: "$29.00",
  },
  {
    date: "Oct 24, 2024",
    invoice: "INV-0127-A",
    amount: "$29.00",
  },
];

export default function InvoiceHistoryCard() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      <div className="border-b border-[#edf2fb] px-5 py-4">
        <h2 className="text-[15px] font-bold text-black">
          Invoice History
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#fbfcff]">
              <TableHead>Date</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead align="right">
                Action
              </TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#edf2fb]">
            {invoices.map((invoice) => (
              <InvoiceRow
                key={invoice.invoice}
                date={invoice.date}
                invoice={invoice.invoice}
                amount={invoice.amount}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#edf2fb] bg-[#fbfcff] p-4 text-center">
        <button
          type="button"
          className="text-[11px] font-bold text-[#565e74] transition hover:text-black"
        >
          View All Invoices
        </button>
      </div>
    </div>
  );
}

function TableHead({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7c839b] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}