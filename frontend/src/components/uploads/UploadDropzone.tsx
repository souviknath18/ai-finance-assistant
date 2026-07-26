"use client";

import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  FileImage,
  FileSpreadsheet,
  LoaderCircle,
  Camera,
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
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const dragCounter = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleFile = (file?: File) => {
    if (!file || uploading) return;

    setSelectedFileName(file.name);
    onUploadAction(file);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={uploading ? -1 : 0}
      aria-disabled={uploading}

      onClick={() => {
        if (!uploading) {
          inputRef.current?.click();
        }
      }}

      onKeyDown={(event) => {
        if (
          !uploading &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();

        if (uploading) return;

        dragCounter.current += 1;
        setDragging(true);
      }}

      onDragOver={(event) => {
        event.preventDefault();
      }}

      onDragLeave={(event) => {
        event.preventDefault();

        if (uploading) return;

        dragCounter.current = Math.max(
          dragCounter.current - 1,
          0,
        );

        if (dragCounter.current === 0) {
          setDragging(false);
        }
      }}

      onDrop={(event) => {
        event.preventDefault();

        dragCounter.current = 0;
        setDragging(false);

        handleFile(event.dataTransfer.files[0]);
      }}
      className={`group flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white p-8 text-center shadow-sm transition hover:border-emerald-600 hover:shadow-md ${
        dragging ? "border-emerald-600 bg-emerald-50" : "border-[#c6c6cd]"
      } ${
        uploading
          ? "pointer-events-none border-emerald-200 bg-emerald-50/40"
          : ""
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.jpg,.jpeg,.png"
        className="hidden"
        disabled={uploading}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={uploading}
        onClick={(event) => event.stopPropagation()}
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
        {dragging
          ? "Drop your file here"
          : uploading
            ? "Uploading your financial document"
            : "Upload financial documents"}
      </h2>

      <p className="mb-6 max-w-xl text-[13px] leading-6 text-[#565e74]">
        {uploading
          ? "Aura is securely saving your file. AI analysis will continue in the background."
          : "Upload bank statements, salary slips, receipts, invoices, subscription bills, screenshots, or transaction CSVs."}
      </p>

      {!uploading && (
        <div className="mb-6 flex flex-wrap justify-center gap-2.5">
          <FileBadge icon={<FileText size={15} />} label="PDF" tone="red" />
          <FileBadge
            icon={<FileSpreadsheet size={15} />}
            label="CSV"
            tone="green"
          />
          <FileBadge
            icon={<FileImage size={15} />}
            label="JPG/PNG"
            tone="blue"
          />
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
                Uploading now. You will see processing progress below.
              </p>
            </div>

            <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
              Uploading
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#e5eeff]">
            <div className="h-full w-1/2 animate-[uploadProgress_1.4s_ease-in-out_infinite] rounded-full bg-emerald-700" />
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          disabled={uploading}
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
          className="rounded-xl bg-black px-6 py-2.5 text-[13px] font-bold text-white transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Choose a Financial File
        </button>

        <button
          type="button"
          disabled={uploading}
          onClick={(event) => {
            event.stopPropagation();
            cameraInputRef.current?.click();
          }}
          className="flex items-center gap-2 rounded-xl border border-[#c6c6cd] bg-white px-6 py-2.5 text-[13px] font-bold text-black transition hover:bg-[#eff4ff] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Camera size={16} />
          Take Photo
        </button>
      </div>

      {/* <p className="mt-5 text-[13px] italic text-[#76777d]">
        {uploading
          ? "Once uploaded, Aura will analyze it in the background."
          : "All data is encrypted end-to-end and handled with secure processing."}
      </p> */}
      <p className="mt-5 max-w-xl text-[13px] italic text-[#76777d]">
        {uploading
          ? "Once uploaded, Aura will detect the document type, extract transactions, and generate insights."
          : "Supports PDF, CSV, JPG, JPEG, and PNG files up to 10 MB. Your files are handled securely."}
      </p>
    </div>
  );
}