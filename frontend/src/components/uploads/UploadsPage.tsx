"use client";

import { useEffect, useRef, useState } from "react";
import UploadHeader from "./UploadHeader";
import UploadDropzone from "./UploadDropzone";
import ActiveUploadsCard from "./ActiveUploadsCard";
import ParsedResultsCard from "./ParsedResultsCard";
import IssuesFoundCard from "./IssuesFoundCard";
import AITipCard from "./AITipCard";
import SecurityCard from "./SecurityCard";
import AppToast from "@/components/ui/AppToast";
import PageLoader from "@/components/ui/PageLoader";

import { UploadedFile, UploadAITip } from "@/types/upload";
import { getUploadedFiles, uploadFile, getUploadAITip } from "@/lib/api/uploadApi";

function getFriendlyUploadError(err: any) {
  const message =
    err?.file?.[0] ||
    err?.detail ||
    err?.message ||
    "Upload failed. Please try again.";

  const lower = String(message).toLowerCase();

  if (lower.includes("file size") || lower.includes("10mb")) {
    return "This file is too large. Please upload a file smaller than 10MB.";
  }

  if (
    lower.includes("only pdf") ||
    lower.includes("allowed") ||
    lower.includes("unsupported") ||
    lower.includes("file type")
  ) {
    return "This file type is not supported. Please upload a PDF, CSV, JPG, JPEG, or PNG file.";
  }

  if (lower.includes("network") || lower.includes("fetch")) {
    return "Network issue detected. Please check your internet connection and try again.";
  }

  // return "We could not upload this file. Please check the file and try again.";
  return `Upload failed: ${String(message)}`;
}

export default function UploadsPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiTip, setAiTip] = useState<UploadAITip | null>(null);
  const activeIdsRef = useRef<Set<number>>(new Set());
  const [recentlyCompletedFiles, setRecentlylyCompletedFiles] = useState<UploadedFile[]>([]);

  const [toast, setToast] = useState({
    show: false,
    type: "success" as "success" | "error" | "info",
    title: "",
    message: "",
  });

  const loadFiles = async () => {
    setLoading(true);

    try {
      const data = await getUploadedFiles();
      setFiles(data);
    } catch {
      setError("We could not load your uploaded files. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const loadAITip = async () => {
    try {
      const data = await getUploadAITip();
      setAiTip(data);
    } catch {
      setAiTip(null);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        await Promise.all([
          loadFiles(),
          loadAITip(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    const previousActiveIds = activeIdsRef.current;

    const completedNow = files.filter(
      (file) => file.status === "success" && previousActiveIds.has(file.id)
    );

    if (completedNow.length > 0) {
      setRecentlylyCompletedFiles((prev) => {
        const existingIds = new Set(prev.map((file) => file.id));
        return [...prev, ...completedNow.filter((file) => !existingIds.has(file.id))];
      });

      completedNow.forEach((file) => {
        window.setTimeout(() => {
          setRecentlylyCompletedFiles((prev) =>
            prev.filter((item) => item.id !== file.id)
          );
        }, 1800);
      });
    }

    activeIdsRef.current = new Set(
      files
        .filter((file) => file.status === "pending" || file.status === "processing")
        .map((file) => file.id)
    );
  }, [files]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");

    try {
      const uploaded = await uploadFile(file);
      setFiles((prev) => [uploaded, ...prev]);
      await loadAITip();

      setToast({
        show: true,
        type: "success",
        title: "File uploaded successfully",
        message: `${uploaded.original_filename} is queued for AI processing.`,
      });

      window.clearTimeout((window as any).__toastTimer);

      (window as any).__toastTimer = window.setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 5000);
    } catch (err: any) {
      console.log("UPLOAD ERROR:", err);
      setError(getFriendlyUploadError(err));
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
      loadAITip();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [files]);

  const processingFiles = files.filter(
    (file) => file.status === "pending" || file.status === "processing"
  );

  const successfulFiles = files.filter((file) => file.status === "success");

  const failedFiles = files
    .filter((file) => file.status === "failed")
    .sort(
      (a, b) =>
        new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    )
    .slice(0, 1);

  if (loading) {
    return <PageLoader message="Loading uploads..." />;
  }

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
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] font-semibold text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <UploadDropzone onUploadAction={handleUpload} uploading={uploading} />
          <ActiveUploadsCard
            files={[
              ...processingFiles,
              ...recentlyCompletedFiles.filter(
                (completed) => !processingFiles.some((file) => file.id === completed.id)
              ),
            ]}
          />
        </section>

        <aside className="space-y-4 lg:col-span-4">
          <ParsedResultsCard files={successfulFiles} />
          {failedFiles.length > 0 && (
            <IssuesFoundCard files={failedFiles} onRetryAction={loadFiles} />
          )}
          <AITipCard
            message={aiTip?.message}
          />
          <SecurityCard />
        </aside>
      </div>
    </>
  );
}