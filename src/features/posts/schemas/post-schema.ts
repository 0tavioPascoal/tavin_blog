import { z } from "zod";

export const postStatusSchema = z.enum(["draft", "published"]);

export const articleRowSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  content_markdown: z.string(),
  published_at: z.string().nullable(),
  updated_at: z.string(),
  status: postStatusSchema,
  tags: z.array(z.string()),
  reading_time_minutes: z.number().int().positive(),
  is_featured: z.boolean(),
});

export const postFormSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  slug: z
    .string()
    .min(3, "Informe um slug com pelo menos 3 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  description: z.string().min(10, "Informe uma descrição mais completa."),
  contentMarkdown: z.string().min(20, "O artigo precisa de conteúdo."),
  status: postStatusSchema,
  tags: z.array(z.string()),
  readingTimeMinutes: z.number().int().positive(),
  isFeatured: z.boolean(),
});

export type PostFormInput = z.infer<typeof postFormSchema>;
