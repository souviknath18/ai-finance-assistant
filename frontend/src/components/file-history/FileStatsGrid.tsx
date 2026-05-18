import { TrendingUp } from "lucide-react";
import FileStatCard from "./FileStatCard";

export default function FileStatsGrid() {
  return (
    <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
      <FileStatCard
        label="Total Uploads"
        value="124"
        helper="+12 this month"
        icon={<TrendingUp size={16} />}
        tone="green"
      />

      <FileStatCard
        label="Success Rate"
        value="98.2%"
        progress={98}
      />

      <FileStatCard
        label="Transactions Extracted"
        value="12,840"
        helper="Across all entities"
      />

      <FileStatCard
        label="Cloud Storage"
        value="2.4 GB"
        helper="Of 10 GB limit"
        variant="highlight"
      />
    </section>
  );
}