import { UploadedFile, UploadAITip } from "@/types/upload";

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

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getUploadedFiles(): Promise<UploadedFile[]> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/uploads/`, {
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