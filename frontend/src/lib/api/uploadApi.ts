import {
  UploadedFile,
  UploadAITip,
  UploadStats,
  PaginatedUploadsResponse,
  GetUploadsParams,
} from "@/types/upload";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const token = getAccessToken();

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/uploads/upload/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/uploads/?page=1&page_size=100`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data.results || data;
}

export async function retryUploadProcessing(id: number): Promise<UploadedFile> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/uploads/${id}/retry/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getUploadAITip(): Promise<UploadAITip> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/uploads/ai-tip/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
  const token = getAccessToken();

  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (status !== "all") {
    params.set("status", status);
  }

  const response = await fetch(`${API_URL}/api/uploads/?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getUploadStats(): Promise<UploadStats> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/uploads/stats/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteUploadedFile(id: number) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/uploads/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}