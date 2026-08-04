import {
  Database,
  FileCheck2,
  Files,
  TrendingUp,
} from "lucide-react";

import FileStatCard from "./FileStatCard";
import { UploadStats } from "@/types/upload";

export default function FileStatsGrid({
  stats,
}: {
  stats: UploadStats | null;
}) {
  const successRate =
    stats?.success_rate ?? 0;

  return (
    <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <FileStatCard
        label="Total Uploads"
        value={
          stats
            ? String(stats.total_uploads)
            : "—"
        }
        helper="All uploaded files"
        icon={<Files size={15} />}
      />

      <FileStatCard
        label="Success Rate"
        value={
          stats
            ? `${successRate}%`
            : "—"
        }
        progress={successRate}
        helper="Successfully processed"
        icon={<TrendingUp size={15} />}
        tone="green"
      />

      <FileStatCard
        label="Transactions Extracted"
        value={
          stats
            ? stats.transactions_extracted.toLocaleString(
                "en-IN"
              )
            : "—"
        }
        helper="Current transaction records"
        icon={<FileCheck2 size={15} />}
      />

      <FileStatCard
        label="Uploaded File Size"
        value={
          stats
            ? `${stats.storage_used_mb.toFixed(
                2
              )} MB`
            : "—"
        }
        helper="Total active upload size"
        icon={<Database size={15} />}
        variant="highlight"
      />
    </section>
  );
}