import {
  Category,
  CategorySummary,
  CreateCategoryPayload,
} from "@/types/category";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function getCategorySummary(): Promise<CategorySummary[]> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/categories/summary/`, {
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


export async function createCategory(
  payload: CreateCategoryPayload
): Promise<Category> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}


export async function getCategories(): Promise<Category[]> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/categories/`, {
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


export async function getCategoryOptions(): Promise<Category[]> {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/categories/options/`, {
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


export async function deleteCategory(categoryId: string) {
  const token = getAccessToken();

  const response = await fetch(`${API_URL}/api/categories/${categoryId}/`, {
    method: "DELETE",
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