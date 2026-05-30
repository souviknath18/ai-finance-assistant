"use client";

import { useEffect, useState } from "react";
import FileHistoryHeader from "./FileHistoryHeader";
import FileStatsGrid from "./FileStatsGrid";
import FileHistoryTable from "./FileHistoryTable";
import ExtractionTipCard from "./ExtractionTipCard";
import ConfirmModal from "@/components/ui/ConfirmModal";
import PageLoader from "@/components/ui/PageLoader";

import { UploadedFile, UploadStats, UploadStatus } from "@/types/upload";
import {
  deleteUploadedFile,
  getPaginatedUploads,
  getUploadStats,
} from "@/lib/api/uploadApi";

export default function FileHistoryPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | UploadStatus>("all");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteFile, setDeleteFile] = useState<UploadedFile | null>(null);

  const loadData = async () => {
    setLoading(true);

    try {
      const [uploadData, statsData] = await Promise.all([
        getPaginatedUploads({
          page,
          pageSize: rowsPerPage,
          status: statusFilter,
        }),
        getUploadStats(),
      ]);

      setFiles(uploadData.results);
      setTotalCount(uploadData.count);
      setTotalPages(uploadData.total_pages);
      setStats(statsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, statusFilter]);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteFile) return;

    setDeleting(true);

    try {
      await deleteUploadedFile(deleteFile.id);
      setDeleteFile(null);
      await loadData();
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading file history..." />;
  }

  return (
    <>
      <FileHistoryHeader />
      <FileStatsGrid stats={stats} />

      <FileHistoryTable
        files={files}
        loading={loading}
        statusFilter={statusFilter}
        onStatusFilterChangeAction={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChangeAction={setPage}
        onRowsPerPageChangeAction={handleRowsPerPageChange}
        onDeleteAction={setDeleteFile}
      />

      <ExtractionTipCard />

      <ConfirmModal
        open={!!deleteFile}
        title="Delete File?"
        message={`This will permanently delete ${
          deleteFile?.original_filename || "this file"
        } and its uploaded document data.`}
        confirmText="Delete"
        loading={deleting}
        onCloseAction={() => setDeleteFile(null)}
        onConfirmAction={handleConfirmDelete}
      />
    </>
  );
}