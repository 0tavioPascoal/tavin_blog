import { z } from "zod";

export const defaultTagColorHex = "#2563EB";

export const tagColorHexSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Informe uma cor HEX válida, como #2563EB.")
  .transform((value) => value.toUpperCase());

export const tagRowSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  color_hex: tagColorHexSchema.catch(defaultTagColorHex),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const tagFormSchema = z.object({
  name: z.string().min(2, "Informe um nome com pelo menos 2 caracteres."),
  slug: z
    .string()
    .min(2, "Informe um slug com pelo menos 2 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  description: z.string(),
  colorHex: tagColorHexSchema,
  isActive: z.boolean(),
});

export type TagFormInput = z.infer<typeof tagFormSchema>;
