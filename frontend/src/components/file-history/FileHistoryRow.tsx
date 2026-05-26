import {
  CheckCircle2,
  FileText,
  Image,
  RefreshCcw,
  Table,
  Trash2,
  XCircle,
  LoaderCircle,
} from "lucide-react";

type FileRow = {
  name: string;
  size: string;
  type: string;
  date: string;
  time: string;
  status: string;
  extraction: string;
  fileKind: string;
};

export default function FileHistoryRow({ file }: { file: FileRow }) {
  const FileIcon =
    file.fileKind === "csv" ? Table : file.fileKind === "image" ? Image : FileText;

  const isSuccess = file.status === "Success";
  const isPending = file.status === "Pending";
  const isFailed = file.status === "Failed";

  return (
    <tr className="transition hover:bg-[#eff4ff]/60">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <FileIcon size={19} className="text-black" />

          <div>
            <p className="text-[13px] font-bold text-black">{file.name}</p>
            <p className="text-[11px] font-semibold text-[#565e74]">
              {file.size}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="rounded-full bg-[#e5eeff] px-2.5 py-1 text-[11px] font-bold text-[#565e74]">
          {file.type}
        </span>
      </td>

      <td className="px-5 py-4">
        <p className="text-[13px] text-black">{file.date}</p>
        <p className="text-[11px] font-semibold text-[#565e74]">
          {file.time}
        </p>
      </td>

      <td className="px-5 py-4">
        <div
          className={`flex items-center gap-2 text-[13px] font-bold ${
            isSuccess
              ? "text-emerald-700"
              : isPending
              ? "text-[#7c839b]"
              : "text-red-600"
          }`}
        >
          {isSuccess && <CheckCircle2 size={15} />}
          {isPending && <LoaderCircle size={15} className="animate-spin" />}
          {isFailed && <XCircle size={15} />}
          {file.status}
        </div>
      </td>

      <td className="px-5 py-4">
        <p
          className={`text-[13px] font-bold ${
            isFailed ? "text-red-600" : isPending ? "text-[#565e74]" : "text-black"
          }`}
        >
          {file.extraction}
        </p>
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <button
            className={`rounded-lg p-1.5 transition ${
              isFailed
                ? "bg-emerald-100 text-emerald-700 hover:scale-105"
                : "text-[#565e74] hover:bg-[#e5eeff] hover:text-black"
            }`}
          >
            <RefreshCcw size={16} />
          </button>

          <button className="rounded-lg p-1.5 text-red-600 transition hover:bg-red-50">
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}