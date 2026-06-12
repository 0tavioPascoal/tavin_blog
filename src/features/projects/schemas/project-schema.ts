import { z } from "zod";

export const projectStatusSchema = z.enum(["draft", "published"]);

export const projectIconNameSchema = z.enum(["blocks", "chart", "database"]);

export const projectRowSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  content_markdown: z.string().nullable(),
  repository_url: z.string().nullable(),
  demo_url: z.string().nullable(),
  cover_image_url: z.string().nullable(),
  icon_name: z.string().min(1),
  status: projectStatusSchema,
  tags: z.array(z.string()),
  is_featured: z.boolean(),
  sort_order: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const projectFormSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  slug: z
    .string()
    .min(3, "Informe um slug com pelo menos 3 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  description: z.string().min(10, "Informe uma descrição mais completa."),
  contentMarkdown: z.string(),
  repositoryUrl: z.union([z.string().url("Informe uma URL válida."), z.literal("")]),
  demoUrl: z.union([z.string().url("Informe uma URL válida."), z.literal("")]),
  coverImageUrl: z.union([z.string().url("Informe uma URL válida."), z.literal("")]),
  iconName: projectIconNameSchema,
  status: projectStatusSchema,
  tags: z.array(z.string()),
  isFeatured: z.boolean(),
  sortOrder: z.number().int(),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
