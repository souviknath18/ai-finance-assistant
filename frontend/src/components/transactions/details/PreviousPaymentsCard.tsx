import type {
  PreviousPaymentItem,
  TransactionStatus,
} from "@/types/transaction";

type PreviousPaymentsCardProps = {
  payments: PreviousPaymentItem[];
};

export default function PreviousPaymentsCard({
  payments,
}: PreviousPaymentsCardProps) {

  function getStatusBadge(status: TransactionStatus) {
    switch (status) {
      case "AI Verified":
      case "Rule Verified":
      case "User Verified":
        return "bg-emerald-100 text-emerald-800";

      case "AI Review Needed":
        return "bg-amber-100 text-amber-800";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  if (payments.length === 0) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-bold text-black">
          Previous Payments
        </h3>

        <div className="rounded-2xl border border-[#e5eeff] bg-white p-8 text-center text-[13px] text-[#565e74]">
          No previous matching payments found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-bold text-black">
        Previous Payments
      </h3>

      <div className="overflow-hidden rounded-2xl border border-[#e5eeff] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead className="border-b border-[#e8edf7] bg-[#f8f9ff]">
              <tr>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eef3fb]">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="transition hover:bg-[#eff4ff]"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-[13px] text-black">
                    {payment.date}
                  </td>

                  <td className="px-4 py-4 text-[13px] text-black">
                    {payment.title}
                  </td>

                  <td
                    className={`whitespace-nowrap px-4 py-4 text-[13px] font-bold ${
                      payment.type === "income"
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {payment.amount}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusBadge(
                        payment.status,
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="whitespace-nowrap px-4 py-3.5 text-[11px] font-bold uppercase tracking-wide text-[#565e74]">
      {children}
    </th>
  );
}