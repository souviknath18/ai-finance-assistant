export type UploadStatus = "pending" | "processing" | "success" | "failed";

export type UploadFileType = "pdf" | "csv" | "image" | "unknown";

export type UploadedFile = {
  id: number;
  upload_id: string;
  original_filename: string;
  file: string;
  file_url: string | null;
  file_type: UploadFileType;
  status: UploadStatus;
  file_size: number;
  file_size_mb: number;
  extracted_transactions_count: number;
  extracted_amount: string | null;
  processing_progress: number;
  processing_step: string | null;
  error_message: string | null;
  uploaded_at: string;
  processed_at: string | null;
};

export type UploadAITip = {
  message: string;
  source: string;
};

export type UploadStats = {
  total_uploads: number;
  success_rate: number;
  transactions_extracted: number;
  storage_used_mb: number;
};

export type PaginatedUploadsResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: UploadedFile[];
};

export type GetUploadsParams = {
  page?: number;
  pageSize?: number;
  status?: "all" | UploadStatus;
};