export type SemanticSearchMetadata = {
  user_id: string;
  transaction_id: string;
  category: string;
  transaction_type: string;
  amount: string;
  date: string;
  merchant: string;
  description: string;
};

export type SemanticSearchResult = {
  transaction_id: string;
  document: string;
  metadata: SemanticSearchMetadata;
  distance: number;
};