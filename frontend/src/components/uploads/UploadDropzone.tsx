"use client";

import { useRef, useState } from "react";
import { Upload, FileText, FileImage, FileSpreadsheet } from "lucide-react";
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

  const handleFile = (file?: File) => {
    if (!file) return;
    onUploadAction(file);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFile(event.dataTransfer.files[0]);
      }}
      className={`group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-8 text-center shadow-sm transition hover:border-emerald-600 hover:shadow-md ${
        dragging ? "border-emerald-600 bg-emerald-50" : "border-[#c6c6cd]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#e5eeff] transition group-hover:scale-110">
        <Upload size={26} className="text-black" />
      </div>

      <h2 className="mb-2 text-xl font-bold text-black">
        Drag and drop bank statements
      </h2>

      <p className="mb-6 text-[13px] text-[#565e74]">
        Supports expense CSVs, invoices, bills, screenshots, or salary slips
      </p>

      <div className="mb-6 flex flex-wrap justify-center gap-2.5">
        <FileBadge icon={<FileText size={15} />} label="PDF" tone="red" />
        <FileBadge icon={<FileSpreadsheet size={15} />} label="CSV" tone="green" />
        <FileBadge icon={<FileImage size={15} />} label="JPG/PNG" tone="blue" />
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl bg-black px-6 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {uploading ? "Uploading..." : "Select Files from Computer"}
      </button>

      <p className="mt-5 text-[13px] italic text-[#76777d]">
        All data is encrypted end-to-end and handled with secure processing.
      </p>
    </div>
  );
}