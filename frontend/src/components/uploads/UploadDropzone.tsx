"use client";

import {
  useRef,
  useState,
} from "react";

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
  onUploadAction: (
    file: File
  ) => void;
  uploading: boolean;
};

export default function UploadDropzone({
  onUploadAction,
  uploading,
}: UploadDropzoneProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const cameraInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const dragCounter =
    useRef(0);

  const [
    dragging,
    setDragging,
  ] = useState(false);

  const [
    selectedFileName,
    setSelectedFileName,
  ] = useState("");

  const handleFile = (
    file?: File
  ) => {
    if (
      !file ||
      uploading
    ) {
      return;
    }

    setSelectedFileName(
      file.name
    );

    onUploadAction(file);

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }

    if (
      cameraInputRef.current
    ) {
      cameraInputRef.current.value =
        "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={
        uploading ? -1 : 0
      }
      aria-disabled={
        uploading
      }
      onClick={() => {
        if (!uploading) {
          inputRef.current?.click();
        }
      }}
      onKeyDown={(event) => {
        if (
          !uploading &&
          (event.key ===
            "Enter" ||
            event.key ===
              " ")
        ) {
          event.preventDefault();

          inputRef.current?.click();
        }
      }}
      onDragEnter={(
        event
      ) => {
        event.preventDefault();

        if (uploading) {
          return;
        }

        dragCounter.current += 1;

        setDragging(true);
      }}
      onDragOver={(
        event
      ) => {
        event.preventDefault();
      }}
      onDragLeave={(
        event
      ) => {
        event.preventDefault();

        if (uploading) {
          return;
        }

        dragCounter.current =
          Math.max(
            dragCounter.current -
              1,
            0
          );

        if (
          dragCounter.current ===
          0
        ) {
          setDragging(false);
        }
      }}
      onDrop={(event) => {
        event.preventDefault();

        dragCounter.current = 0;

        setDragging(false);

        handleFile(
          event.dataTransfer
            .files[0]
        );
      }}
      className={`group flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed bg-white px-5 py-8 text-center transition-all duration-200 sm:px-8 ${
        dragging
          ? "border-emerald-400 bg-emerald-50/50"
          : "border-[#dfe9fb] hover:border-emerald-300 hover:bg-[#fbfdfc]"
      } ${
        uploading
          ? "pointer-events-none border-emerald-200 bg-emerald-50/30"
          : ""
      }`}
    >
      {/* File input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.csv,.jpg,.jpeg,.png"
        className="hidden"
        disabled={uploading}
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
        onChange={(
          event
        ) =>
          handleFile(
            event.target
              .files?.[0]
          )
        }
      />

      {/* Mobile camera */}
      <input
        ref={
          cameraInputRef
        }
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={uploading}
        onClick={(
          event
        ) =>
          event.stopPropagation()
        }
        onChange={(
          event
        ) =>
          handleFile(
            event.target
              .files?.[0]
          )
        }
      />

      {/* Icon */}
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-200 ${
          uploading
            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
            : dragging
              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
              : "border-[#e6edf9] bg-[#f8faff] text-black group-hover:border-emerald-100 group-hover:bg-emerald-50 group-hover:text-emerald-700"
        }`}
      >
        {uploading ? (
          <LoaderCircle
            size={21}
            className="animate-spin"
          />
        ) : (
          <Upload
            size={21}
          />
        )}
      </div>

      {/* Title */}
      <h2 className="text-[17px] font-bold tracking-tight text-black">
        {dragging
          ? "Drop your file here"
          : uploading
            ? "Uploading your document"
            : "Upload financial documents"}
      </h2>

      {/* Description */}
      <p className="mt-2 max-w-xl text-[12px] leading-5 text-[#565e74]">
        {uploading
          ? "Aura is securely saving your file. AI analysis will continue in the background."
          : "Upload bank statements, salary slips, receipts, invoices, subscription bills, screenshots, or transaction CSVs."}
      </p>

      {/* Supported formats */}
      {!uploading && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <FileBadge
            icon={
              <FileText
                size={14}
              />
            }
            label="PDF"
            tone="red"
          />

          <FileBadge
            icon={
              <FileSpreadsheet
                size={14}
              />
            }
            label="CSV"
            tone="green"
          />

          <FileBadge
            icon={
              <FileImage
                size={14}
              />
            }
            label="JPG / PNG"
            tone="blue"
          />
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mt-5 w-full max-w-md rounded-2xl border border-emerald-100 bg-white p-4 text-left">
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p
                title={
                  selectedFileName
                }
                className="truncate text-[12px] font-bold text-black"
              >
                {selectedFileName ||
                  "Selected file"}
              </p>

              <p className="mt-1 text-[10px] leading-4 text-[#7c839b]">
                Uploading securely.
                Processing will
                continue below.
              </p>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-emerald-700">
              Uploading
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-[#edf2fb]">
            <div className="h-full w-1/2 animate-[uploadProgress_1.4s_ease-in-out_infinite] rounded-full bg-emerald-600" />
          </div>
        </div>
      )}

      {/* Actions */}
      {!uploading && (
        <div className="mt-5 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={(
              event
            ) => {
              event.stopPropagation();

              inputRef.current?.click();
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-5 text-[12px] font-bold text-white transition-[opacity,transform,box-shadow] duration-200 hover:opacity-90 hover:shadow-[0_6px_16px_rgba(15,23,42,0.12)] active:scale-[0.98]"
          >
            <Upload
              size={14}
            />

            Choose File
          </button>

          <button
            type="button"
            onClick={(
              event
            ) => {
              event.stopPropagation();

              cameraInputRef.current?.click();
            }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfe9fb] bg-white px-5 text-[12px] font-bold text-black transition hover:border-[#c9d9f3] hover:bg-[#eff4ff] active:scale-[0.98] lg:hidden"
          >
            <Camera
              size={14}
            />

            Take Photo
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="mt-4 max-w-lg text-[10px] leading-5 text-[#7c839b]">
        {uploading
          ? "Once uploaded, Aura will detect the document type, extract transactions, and generate insights."
          : "PDF, CSV, JPG, JPEG, and PNG supported up to 10 MB. Your files are handled securely."}
      </p>
    </div>
  );
}