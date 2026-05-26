import ParsedResult from "./ParsedResult";

export default function RecentParsedResultsCard() {
  return (
    <div className="rounded-2xl border border-[#e5eeff] bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-lg font-bold text-black">
        Recent Parsed Results
      </h3>

      <div className="space-y-2.5">
        <ParsedResult
          title="Bank_Statement.pdf"
          subtitle="15 transactions found"
        />

        <ParsedResult
          title="Invoice_#2940.png"
          subtitle="₹1,240.00 extracted"
        />
      </div>

      <button className="mt-5 w-full rounded-xl border border-black py-2.5 text-[13px] font-bold text-black transition hover:bg-black hover:text-white">
        Review All Results
      </button>
    </div>
  );
}