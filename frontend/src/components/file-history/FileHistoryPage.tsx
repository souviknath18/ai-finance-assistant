import FileHistoryHeader from "./FileHistoryHeader";
import FileStatsGrid from "./FileStatsGrid";
import FileHistoryTable from "./FileHistoryTable";
import ExtractionTipCard from "./ExtractionTipCard";

export default function FileHistoryPage() {
  return (
    <>
      <FileHistoryHeader />
      <FileStatsGrid />
      <FileHistoryTable />
      <ExtractionTipCard />
    </>
  );
}