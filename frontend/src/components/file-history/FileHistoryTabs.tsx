import { UploadStatus } from "@/types/upload";

type Props = {
  statusFilter:
    | "all"
    | UploadStatus;

  onStatusFilterChangeAction: (
    value: "all" | UploadStatus
  ) => void;
};

const tabs: {
  label: string;
  value: "all" | UploadStatus;
}[] = [
  {
    label: "All Files",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Processed",
    value: "success",
  },
  {
    label: "Failed",
    value: "failed",
  },
];

export default function FileHistoryTabs({
  statusFilter,
  onStatusFilterChangeAction,
}: Props) {
  return (
    <div className="overflow-x-auto border-b border-[#dce9ff] bg-[#f8f9ff] px-5 py-3.5">
      <div className="flex min-w-max gap-5">
        {tabs.map((tab) => {
          const isActive =
            statusFilter === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                onStatusFilterChangeAction(
                  tab.value
                )
              }
              className={`border-b-2 pb-1 text-[11px] font-bold uppercase tracking-wide transition ${
                isActive
                  ? "border-black text-black"
                  : "border-transparent text-[#565e74] hover:text-black"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}