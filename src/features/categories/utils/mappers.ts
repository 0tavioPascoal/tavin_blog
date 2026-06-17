import { categoryRowSchema } from "@/features/categories/schemas/category-schema";
import type { CategoryDetail, CategorySummary } from "@/features/categories/types/category";
import type { Database } from "@/types/supabase";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export function mapCategoryRowToSummary(row: CategoryRow): CategorySummary {
  const category = categoryRowSchema.parse(row);

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    sortOrder: category.sort_order,
    isActive: category.is_active,
  };
}

export function mapCategoryRowToDetail(row: CategoryRow): CategoryDetail {
  const category = categoryRowSchema.parse(row);

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    sortOrder: category.sort_order,
    isActive: category.is_active,
    createdAt: category.created_at,
    updatedAt: category.updated_at,
  };
}
