export type CategorySummary = {
  category_id: string | null;
  is_system: boolean;
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

export type CategoryDistributionItem = {
  name: string;
  spending: string;
  transactions: number;
  percentage: string;
};

export type CategoryDistributionResponse = {
  month: string;
  month_label: string;
  count: number;
  total_spending: string;
  results: CategoryDistributionItem[];
};

export type MergeCategoryPayload = {
  source_category_id: string;
  destination_category_id: string;
};

export type MergeCategoryResponse = {
  detail: string;
  source_category: {
    category_id: string;
    name: string;
  };
  destination_category: {
    category_id: string;
    name: string;
  };
  updated_transactions: number;
};

export type UpdateCategoryPayload = {
  name?: string;
  description?: string;
  category_type?: "expense" | "income" | "both";
  keywords?: string;
};