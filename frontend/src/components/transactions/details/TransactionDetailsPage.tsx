import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import DetailsHeader from "./DetailsHeader";
import SummaryCard from "./SummaryCard";
import AIInsightsCard from "./AIInsightsCard";
import SourceAuditCard from "./SourceAuditCard";
import PreviousPaymentsCard from "./PreviousPaymentsCard";
import AIPulseCard from "./AIPulseCard";
import OptimizationTipsCard from "./OptimizationTipsCard";
import MerchantInfoCard from "./MerchantInfoCard";

export default function TransactionDetailsPage() {
  return (
    <>
      <Link
        href="/transactions"
        className="mb-8 flex items-center gap-2 text-sm font-bold text-[#565e74] transition hover:text-black"
      >
        <ArrowLeft size={18} />
        Back to Transactions
      </Link>

      <DetailsHeader />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="space-y-6 lg:col-span-8">
          <SummaryCard />
          <AIInsightsCard />
          <SourceAuditCard />
          <PreviousPaymentsCard />
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <AIPulseCard />
          <OptimizationTipsCard />
          <MerchantInfoCard />
        </aside>
      </div>
    </>
  );
}