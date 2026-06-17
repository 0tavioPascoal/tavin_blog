import { tagRowSchema } from "@/features/tags/schemas/tag-schema";
import type { TagDetail, TagSummary } from "@/features/tags/types/tag";
import type { Database } from "@/types/supabase";

type TagRow = Database["public"]["Tables"]["tags"]["Row"];

export function mapTagRowToSummary(row: TagRow): TagSummary {
  const tag = tagRowSchema.parse(row);

  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    colorHex: tag.color_hex,
    isActive: tag.is_active,
  };
}

export function mapTagRowToDetail(row: TagRow): TagDetail {
  const tag = tagRowSchema.parse(row);

  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    colorHex: tag.color_hex,
    isActive: tag.is_active,
    createdAt: tag.created_at,
    updatedAt: tag.updated_at,
  };
}
