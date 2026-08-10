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
    <div className="border-b border-[#edf2fb] px-5 pt-4">
      <div className="flex flex-wrap gap-1">
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
              className={`rounded-t-xl border-b-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wide transition-[background-color,border-color,color] duration-200 ${
                isActive
                  ? "border-emerald-700 bg-emerald-50/60 text-emerald-700"
                  : "border-transparent text-[#7c839b] hover:bg-[#fbfcff] hover:text-black"
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