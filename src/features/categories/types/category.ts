export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type CategoryDetail = CategorySummary & {
  createdAt: string;
  updatedAt: string;
};

export type CategoryMutationInput = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};
