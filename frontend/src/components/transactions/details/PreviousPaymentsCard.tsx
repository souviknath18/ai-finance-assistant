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
  if (payments.length === 0) {
    return (
      <section className="rounded-3xl border border-[#e6edf9] bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
            Payment History
          </p>

          <h2 className="mt-1 text-[16px] font-bold tracking-tight text-black">
            Previous Payments
          </h2>
        </div>

        <div className="rounded-2xl border border-dashed border-[#dce9ff] bg-[#fbfcff] px-5 py-10 text-center">
          <p className="text-[12px] font-bold text-black">
            No previous payments found
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#76777d]">
            Aura will show matching historical transactions here when they are
            available.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-[#e6edf9] bg-white shadow-[0_6px_24px_rgba(15,23,42,0.05)]">
      {/* Header */}
      <div className="border-b border-[#edf2fb] px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#7c839b]">
          Payment History
        </p>

        <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[16px] font-bold tracking-tight text-black">
              Previous Payments
            </h2>

            <p className="mt-1 text-[11px] leading-5 text-[#565e74]">
              Similar historical transactions detected for this merchant or
              payment pattern.
            </p>
          </div>

          <span className="text-[10px] font-semibold text-[#7c839b]">
            {payments.length}{" "}
            {payments.length === 1 ? "payment" : "payments"}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[#dfe9ff] bg-[#fbfcff]">
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead align="right">
                Amount
              </TableHead>
              <TableHead>
                Status
              </TableHead>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#edf2fb]">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition-colors duration-150 hover:bg-[#fbfcff]"
              >
                <td className="whitespace-nowrap px-4 py-3.5 text-[12px] font-medium text-black">
                  {payment.date}
                </td>

                <td className="px-4 py-3.5">
                  <p className="max-w-[280px] truncate text-[12px] font-semibold text-black">
                    {payment.title}
                  </p>
                </td>

                <td
                  className={`whitespace-nowrap px-4 py-3.5 text-right text-[12px] font-bold ${
                    payment.type === "income"
                      ? "text-emerald-700"
                      : "text-red-600"
                  }`}
                >
                  {payment.amount}
                </td>

                <td className="whitespace-nowrap px-4 py-3.5">
                  <StatusBadge
                    status={payment.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusBadge({
  status,
}: {
  status: TransactionStatus;
}) {
  const styles = getStatusStyles(status);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-bold ${styles}`}
    >
      {status}
    </span>
  );
}

function getStatusStyles(
  status: TransactionStatus
) {
  switch (status) {
    case "AI Verified":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "Rule Verified":
      return "border-cyan-200 bg-cyan-50 text-cyan-700";

    case "User Verified":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "AI Review Needed":
      return "border-amber-200 bg-amber-50 text-amber-700";

    default:
      return "border-[#dce9ff] bg-[#eff4ff] text-[#565e74]";
  }
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
      className={`px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c839b] ${
        align === "right"
          ? "text-right"
          : "text-left"
      }`}
    >
      {children}
    </th>
  );
}