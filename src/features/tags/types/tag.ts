export type TagSummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  colorHex: string;
  isActive: boolean;
};

export type TagDetail = TagSummary & {
  createdAt: string;
  updatedAt: string;
};

export type TagMutationInput = {
  name: string;
  slug: string;
  description: string;
  colorHex: string;
  isActive: boolean;
};
