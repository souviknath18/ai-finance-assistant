"use client";

import { useEffect, useState } from "react";

import UploadHeader from "./UploadHeader";
import UploadDropzone from "./UploadDropzone";
import ActiveUploadsCard from "./ActiveUploadsCard";
import ParsedResultsCard from "./ParsedResultsCard";
import IssuesFoundCard from "./IssuesFoundCard";
import AITipCard from "./AITipCard";
import SecurityCard from "./SecurityCard";
import AppToast from "@/components/ui/AppToast";

import { UploadedFile } from "@/types/upload";
import { getUploadedFiles, uploadFile } from "@/lib/api/uploadApi";

export default function UploadsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "success" as "success" | "error" | "info",
    title: "",
    message: "",
  });

  const loadFiles = async () => {
    try {
      const data = await getUploadedFiles();
      setFiles(data);
    } catch {
      setError("Failed to load uploaded files.");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadFile(file);
      setFiles((prev) => [uploaded, ...prev]);

      setToast({
        show: true,
        type: "success",
        title: "File uploaded successfully",
        message: `${uploaded.original_filename} has been processed successfully.`,
      });

      window.clearTimeout((window as any).__toastTimer);

      (window as any).__toastTimer = window.setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 5000);
    } catch (err: any) {
      setError(
        err?.file?.[0] ||
          err?.detail ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const hasProcessing = files.some(
      (file) => file.status === "pending" || file.status === "processing"
    );

    if (!hasProcessing) return;

    const interval = window.setInterval(() => {
      loadFiles();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [files]);

  const processingFiles = files.filter(
    (file) => file.status === "pending" || file.status === "processing"
  );

  const successfulFiles = files.filter((file) => file.status === "success");

  const failedFiles = files.filter((file) => file.status === "failed");

  return (
    <>
      <AppToast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onCloseAction={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <UploadHeader />

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <UploadDropzone onUploadAction={handleUpload} uploading={uploading} />
          <ActiveUploadsCard files={processingFiles} />
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <ParsedResultsCard files={successfulFiles} />
          <IssuesFoundCard files={failedFiles} onRetryAction={loadFiles} />
          <AITipCard />
          <SecurityCard />
        </aside>
      </div>
    </>
  );
}