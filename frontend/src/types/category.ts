export type CategorySummary = {
  name: string;
  transactions: number;
  spending: string;
  income: string;
  expense: string;
};

export type Category = {
  id: number;
  category_id: string;
  name: string;
  description: string | null;
  category_type: "expense" | "income" | "both";
  keywords: string | null;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
  category_type: "expense" | "income" | "both";
  keywords?: string;
};

export type PaginatedCategorySummaryResponse = {
  count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  results: CategorySummary[];
};