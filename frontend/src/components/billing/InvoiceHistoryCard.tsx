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
    <div className="rounded-2xl border border-[#dce9ff] bg-white shadow-sm">
      <div className="border-b border-[#e5eeff] px-5 py-4">
        <h3 className="text-lg font-bold text-black">
          Invoice History
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse">
          <thead>
            <tr className="bg-[#eff4ff]/70">
              <TableHead>DATE</TableHead>
              <TableHead>INVOICE</TableHead>
              <TableHead>AMOUNT</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead align="right">ACTION</TableHead>
            </tr>
          </thead>

          <tbody>
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

      <div className="p-4 text-center">
        <button className="text-[13px] font-bold text-[#565e74] transition hover:text-black">
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
      className={`px-5 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74] ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}