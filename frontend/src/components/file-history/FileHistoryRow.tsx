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
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <FileIcon size={22} className="text-black" />

          <div>
            <p className="text-sm font-bold text-black">{file.name}</p>
            <p className="text-xs font-semibold text-[#565e74]">{file.size}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <span className="rounded-full bg-[#e5eeff] px-3 py-1 text-xs font-bold text-[#565e74]">
          {file.type}
        </span>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm text-black">{file.date}</p>
        <p className="text-xs font-semibold text-[#565e74]">{file.time}</p>
      </td>

      <td className="px-6 py-5">
        <div
          className={`flex items-center gap-2 text-sm font-bold ${
            isSuccess
              ? "text-emerald-700"
              : isPending
              ? "text-[#7c839b]"
              : "text-red-600"
          }`}
        >
          {isSuccess && <CheckCircle2 size={17} />}
          {isPending && <LoaderCircle size={17} className="animate-spin" />}
          {isFailed && <XCircle size={17} />}
          {file.status}
        </div>
      </td>

      <td className="px-6 py-5">
        <p
          className={`text-sm font-bold ${
            isFailed ? "text-red-600" : isPending ? "text-[#565e74]" : "text-black"
          }`}
        >
          {file.extraction}
        </p>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-3">
          <button
            className={`rounded-lg p-2 transition ${
              isFailed
                ? "bg-emerald-100 text-emerald-700 hover:scale-105"
                : "text-[#565e74] hover:bg-[#e5eeff] hover:text-black"
            }`}
          >
            <RefreshCcw size={18} />
          </button>

          <button className="rounded-lg p-2 text-red-600 transition hover:bg-red-50">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}