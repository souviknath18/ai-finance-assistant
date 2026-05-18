import ParsedResult from "./ParsedResult";

export default function RecentParsedResultsCard() {
  return (
    <div className="rounded-3xl border border-[#e5eeff] bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-2xl font-bold text-black">
        Recent Parsed Results
      </h3>

      <div className="space-y-3">
        <ParsedResult title="Bank_Statement.pdf" subtitle="15 transactions found" />
        <ParsedResult title="Invoice_#2940.png" subtitle="₹1,240.00 extracted" />
      </div>

      <button className="mt-6 w-full rounded-xl border border-black py-3 text-sm font-bold text-black transition hover:bg-black hover:text-white">
        Review All Results
      </button>
    </div>
  );
}