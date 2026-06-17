import { z } from "zod";

export const categoryRowSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  sort_order: z.number().int(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const categoryFormSchema = z.object({
  name: z.string().min(2, "Informe um nome com pelo menos 2 caracteres."),
  slug: z
    .string()
    .min(2, "Informe um slug com pelo menos 2 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  description: z.string(),
  sortOrder: z.number().int(),
  isActive: z.boolean(),
});

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
