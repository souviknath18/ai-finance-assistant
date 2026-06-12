import {
  UploadedFile,
  UploadAITip,
  UploadStats,
  PaginatedUploadsResponse,
  GetUploadsParams,
} from "@/types/upload";

import { authFetch } from "@/lib/api/authFetch";

export async function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await authFetch("/api/uploads/upload/", {
    method: "POST",
    body: formData,
  });

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : { detail: await response.text() };

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getUploadedFiles(): Promise<UploadedFile[]> {
  const response = await authFetch(
    "/api/uploads/?page=1&page_size=100",
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.results || data;
}

export async function retryUploadProcessing(
  id: number
): Promise<UploadedFile> {
  const response = await authFetch(
    `/api/uploads/${id}/retry/`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getUploadAITip(): Promise<UploadAITip> {
  const response = await authFetch(
    "/api/uploads/ai-tip/",
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getPaginatedUploads({
  page = 1,
  pageSize = 10,
  status = "all",
}: GetUploadsParams): Promise<PaginatedUploadsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (status !== "all") {
    params.set("status", status);
  }

  const response = await authFetch(
    `/api/uploads/?${params.toString()}`,
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getUploadStats(): Promise<UploadStats> {
  const response = await authFetch(
    "/api/uploads/stats/",
    {
      method: "GET",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteUploadedFile(id: number) {
  const response = await authFetch(
    `/api/uploads/${id}/`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}