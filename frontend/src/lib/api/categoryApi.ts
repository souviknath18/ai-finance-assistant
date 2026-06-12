import {
  Category,
  PaginatedCategorySummaryResponse,
  CreateCategoryPayload,
} from "@/types/category";

import { authFetch } from "@/lib/api/authFetch";

export async function getCategorySummary({
  page = 1,
  pageSize = 5,
}: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedCategorySummaryResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  const response = await authFetch(
    `/api/categories/summary/?${params.toString()}`,
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

export async function createCategory(
  payload: CreateCategoryPayload
): Promise<Category> {
  const response = await authFetch("/api/categories/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await authFetch("/api/categories/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function getCategoryOptions(): Promise<Category[]> {
  const response = await authFetch("/api/categories/options/", {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

export async function deleteCategory(categoryId: string) {
  const response = await authFetch(`/api/categories/${categoryId}/`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw data;
  }

  return true;
}