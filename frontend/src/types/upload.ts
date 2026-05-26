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
  error_message: string | null;
  uploaded_at: string;
  processed_at: string | null;
};

export type UploadAITip = {
  message: string;
  source: string;
};