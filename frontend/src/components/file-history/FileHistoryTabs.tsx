import { Filter } from "lucide-react";
import { UploadStatus } from "@/types/upload";

type Props = {
  statusFilter: "all" | UploadStatus;
  onStatusFilterChangeAction: (value: "all" | UploadStatus) => void;
};

const tabs: { label: string; value: "all" | UploadStatus }[] = [
  { label: "All Files", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processed", value: "success" },
  { label: "Failed", value: "failed" },
];

export default function FileHistoryTabs({
  statusFilter,
  onStatusFilterChangeAction,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b border-[#dce9ff] bg-[#f8f9ff] px-5 py-3.5">
      <div className="flex gap-5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusFilterChangeAction(tab.value)}
            className={`pb-1 text-[11px] font-bold uppercase tracking-wide ${
              statusFilter === tab.value
                ? "border-b-2 border-black text-black"
                : "text-[#565e74] hover:text-black"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-[#565e74] hover:text-black">
        <Filter size={15} />
        Filters
      </button>
    </div>
  );
}