"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import FileHistoryHeader from "./FileHistoryHeader";
import FileStatsGrid from "./FileStatsGrid";
import FileHistoryTable from "./FileHistoryTable";
import ExtractionTipCard from "./ExtractionTipCard";

import ConfirmModal from "@/components/ui/ConfirmModal";
import PageLoader from "@/components/ui/PageLoader";
import AppToast from "@/components/ui/AppToast";

import {
  UploadedFile,
  UploadStats,
  UploadStatus,
} from "@/types/upload";

import {
  deleteUploadedFile,
  getPaginatedUploads,
  getUploadStats,
  retryUploadProcessing,
} from "@/lib/api/uploadApi";

type ToastState = {
  show: boolean;
  type: "success" | "error" | "info";
  title: string;
  message: string;
};

function getFriendlyError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null
  ) {
    const apiError = error as {
      detail?: string;
      message?: string;
      error?: string;
    };

    return (
      apiError.detail ||
      apiError.message ||
      apiError.error ||
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
}

export default function FileHistoryPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [stats, setStats] = useState<UploadStats | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "all" | UploadStatus
  >("all");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [pageLoading, setPageLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [retryingId, setRetryingId] = useState<number | null>(
    null
  );

  const [deleteFile, setDeleteFile] =
    useState<UploadedFile | null>(null);

  const [error, setError] = useState("");

  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "success",
    title: "",
    message: "",
  });

  const toastTimerRef = useRef<number | null>(null);
  const firstLoadRef = useRef(true);

  const showToast = useCallback(
    (
      type: ToastState["type"],
      title: string,
      message: string
    ) => {
      setToast({
        show: true,
        type,
        title,
        message,
      });

      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }

      toastTimerRef.current = window.setTimeout(() => {
        setToast((previous) => ({
          ...previous,
          show: false,
        }));
      }, 5000);
    },
    []
  );

  const loadFiles = useCallback(
    async (showTableLoader = false) => {
      if (showTableLoader) {
        setTableLoading(true);
      }

      try {
        const uploadData = await getPaginatedUploads({
          page,
          pageSize: rowsPerPage,
          status: statusFilter,
        });

        setFiles(uploadData.results);
        setTotalCount(uploadData.count);
        setTotalPages(uploadData.total_pages);

        if (
          uploadData.total_pages > 0 &&
          page > uploadData.total_pages
        ) {
          setPage(uploadData.total_pages);
        }

        return uploadData;
      } finally {
        if (showTableLoader) {
          setTableLoading(false);
        }
      }
    },
    [page, rowsPerPage, statusFilter]
  );

  const loadStats = useCallback(async () => {
    const statsData = await getUploadStats();
    setStats(statsData);

    return statsData;
  }, []);

  const loadInitialData = useCallback(async () => {
    setPageLoading(true);
    setError("");

    try {
      await Promise.all([
        loadFiles(false),
        loadStats(),
      ]);
    } catch (requestError) {
      setError(
        getFriendlyError(requestError) ||
          "We could not load your file history."
      );
    } finally {
      firstLoadRef.current = false;
      setPageLoading(false);
    }
  }, [loadFiles, loadStats]);

  const reloadTableData = useCallback(async () => {
    setError("");

    try {
      await loadFiles(true);
    } catch (requestError) {
      setError(
        getFriendlyError(requestError) ||
          "We could not refresh your file history."
      );
    }
  }, [loadFiles]);

  useEffect(() => {
    if (firstLoadRef.current) {
      loadInitialData();
      return;
    }

    reloadTableData();
  }, [loadInitialData, reloadTableData]);

  const hasProcessingFiles = useMemo(
    () =>
      files.some(
        (file) =>
          file.status === "pending" ||
          file.status === "processing"
      ),
    [files]
  );

  useEffect(() => {
    if (!hasProcessingFiles) {
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;

    const poll = async () => {
      try {
        await loadFiles(false);

        if (!cancelled) {
          await loadStats();
        }
      } catch {
        // Do not interrupt the page because of one
        // temporary polling request failure.
      }

      if (!cancelled) {
        timeoutId = window.setTimeout(
          poll,
          3000
        );
      }
    };

    timeoutId = window.setTimeout(
      poll,
      3000
    );

    return () => {
      cancelled = true;

      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    hasProcessingFiles,
    loadFiles,
    loadStats,
  ]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(
          toastTimerRef.current
        );
      }
    };
  }, []);

  const handleStatusFilterChange = (
    value: "all" | UploadStatus
  ) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleRowsPerPageChange = (
    value: number
  ) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const handleRetry = async (
    file: UploadedFile
  ) => {
    if (
      file.status !== "failed" ||
      retryingId !== null
    ) {
      return;
    }

    setRetryingId(file.id);
    setError("");

    try {
      const retriedFile =
        await retryUploadProcessing(file.id);

      setFiles((previousFiles) =>
        previousFiles.map((item) =>
          item.id === retriedFile.id
            ? retriedFile
            : item
        )
      );

      showToast(
        "info",
        "Processing restarted",
        `${retriedFile.original_filename} has been queued for processing again.`
      );

      await Promise.allSettled([
        loadFiles(false),
        loadStats(),
      ]);
    } catch (requestError) {
      const message =
        getFriendlyError(requestError);

      setError(message);

      showToast(
        "error",
        "Retry failed",
        message
      );
    } finally {
      setRetryingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteFile || deleting) {
      return;
    }

    const fileBeingDeleted = deleteFile;

    setDeleting(true);
    setError("");

    try {
      await deleteUploadedFile(
        fileBeingDeleted.id
      );

      setDeleteFile(null);

      showToast(
        "success",
        "File deleted",
        `${fileBeingDeleted.original_filename} was deleted successfully.`
      );

      const shouldMoveToPreviousPage =
        files.length === 1 && page > 1;

      if (shouldMoveToPreviousPage) {
        setPage((previousPage) =>
          Math.max(previousPage - 1, 1)
        );
      } else {
        await Promise.all([
          loadFiles(false),
          loadStats(),
        ]);
      }
    } catch (requestError) {
      const message =
        getFriendlyError(requestError);

      setError(message);

      showToast(
        "error",
        "Delete failed",
        message
      );
    } finally {
      setDeleting(false);
    }
  };

  if (pageLoading) {
    return (
      <PageLoader message="Loading file history..." />
    );
  }

  return (
    <>
      <AppToast
        show={toast.show}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onCloseAction={() =>
          setToast((previous) => ({
            ...previous,
            show: false,
          }))
        }
      />

      <FileHistoryHeader />

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
          {error}
        </div>
      )}

      <FileStatsGrid stats={stats} />

      <FileHistoryTable
        files={files}
        loading={tableLoading}
        statusFilter={statusFilter}
        onStatusFilterChangeAction={
          handleStatusFilterChange
        }
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        totalPages={totalPages}
        retryingId={retryingId}
        onPageChangeAction={setPage}
        onRowsPerPageChangeAction={
          handleRowsPerPageChange
        }
        onRetryAction={handleRetry}
        onDeleteAction={setDeleteFile}
      />

      <ExtractionTipCard />

      <ConfirmModal
        open={Boolean(deleteFile)}
        title="Delete File?"
        message={`This will permanently delete ${
          deleteFile?.original_filename ||
          "this file"
        } and all transactions extracted from it.`}
        confirmText="Delete"
        loading={deleting}
        onCloseAction={() => {
          if (!deleting) {
            setDeleteFile(null);
          }
        }}
        onConfirmAction={
          handleConfirmDelete
        }
      />
    </>
  );
}