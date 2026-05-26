"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  LoaderCircle,
} from "lucide-react";
import FileBadge from "./FileBadge";

type UploadDropzoneProps = {
  onUploadAction: (file: File) => void;
  uploading: boolean;
};

export default function UploadDropzone({
  onUploadAction,
  uploading,
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFile = (file?: File) => {
    if (!file || uploading) return;

    setSelectedFileName(file.name);
    onUploadAction(file);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        if (!uploading) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFile(event.dataTransfer.files[0]);
      }}
      className={`group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-8 text-center shadow-sm transition hover:border-emerald-600 hover:shadow-md ${
        dragging ? "border-emerald-600 bg-emerald-50" : "border-[#c6c6cd]"
      } ${uploading ? "pointer-events-none border-emerald-200 bg-emerald-50/40" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.jpg,.jpeg,.png"
        className="hidden"
        disabled={uploading}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5eeff] transition group-hover:scale-110">
        {uploading ? (
          <LoaderCircle size={26} className="animate-spin text-emerald-700" />
        ) : (
          <Upload size={26} className="text-black" />
        )}
      </div>

      <h2 className="mb-2 text-xl font-bold text-black">
        {uploading ? "Processing your document" : "Drag and drop bank statements"}
      </h2>

      <p className="mb-6 text-[13px] text-[#565e74]">
        {uploading
          ? "Aura is uploading, reading, and preparing your financial data."
          : "Supports expense CSVs, invoices, bills, screenshots, or salary slips"}
      </p>

      {!uploading && (
        <div className="mb-6 flex flex-wrap justify-center gap-2.5">
          <FileBadge icon={<FileText size={15} />} label="PDF" tone="red" />
          <FileBadge
            icon={<FileSpreadsheet size={15} />}
            label="CSV"
            tone="green"
          />
          <FileBadge icon={<FileImage size={15} />} label="JPG/PNG" tone="blue" />
        </div>
      )}

      {uploading && (
        <div className="mb-6 w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-4 text-left">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-[13px] font-bold text-black">
                {selectedFileName || "Selected file"}
              </p>
              <p className="mt-1 text-[12px] text-[#565e74]">
                This may take longer for large files or files with many transactions.
              </p>
            </div>

            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              Working
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#e5eeff]">
            <div className="h-full w-1/2 animate-[uploadProgress_1.4s_ease-in-out_infinite] rounded-full bg-emerald-700" />
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl bg-black px-6 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Processing..." : "Select Files from Computer"}
      </button>

      <p className="mt-5 text-[13px] italic text-[#76777d]">
        {uploading
          ? "Please keep this page open while Aura processes your document."
          : "All data is encrypted end-to-end and handled with secure processing."}
      </p>
    </div>
  );
}