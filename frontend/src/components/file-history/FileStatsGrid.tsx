import { TrendingUp } from "lucide-react";
import FileStatCard from "./FileStatCard";
import { UploadStats } from "@/types/upload";

export default function FileStatsGrid({ stats }: { stats: UploadStats | null }) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
      <FileStatCard
        label="Total Uploads"
        value={stats ? String(stats.total_uploads) : "—"}
        helper="All uploaded files"
        icon={<TrendingUp size={15} />}
        tone="green"
      />

      <FileStatCard
        label="Success Rate"
        value={stats ? `${stats.success_rate}%` : "—"}
        progress={stats?.success_rate || 0}
      />

      <FileStatCard
        label="Transactions Extracted"
        value={stats ? stats.transactions_extracted.toLocaleString("en-IN") : "—"}
        helper="Across all files"
      />

      <FileStatCard
        label="Cloud Storage"
        value={stats ? `${stats.storage_used_mb} MB` : "—"}
        helper="Used storage"
        variant="highlight"
      />
    </section>
  );
}