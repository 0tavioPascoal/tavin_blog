import { z } from "zod";

export const certificateStatusSchema = z.enum(["draft", "published"]);

const optionalUrlSchema = z.union([z.string().url("Informe uma URL válida."), z.literal("")]);
const dateInputSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.");

export const certificateRowSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  issuer: z.string().min(1),
  description: z.string().min(1),
  credential_url: z.string().nullable(),
  image_url: z.string().nullable(),
  issued_at: z.string(),
  expires_at: z.string().nullable(),
  status: certificateStatusSchema,
  sort_order: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const certificateFormSchema = z.object({
  title: z.string().min(3, "Informe um título com pelo menos 3 caracteres."),
  slug: z
    .string()
    .min(3, "Informe um slug com pelo menos 3 caracteres.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use apenas letras minúsculas, números e hífens."),
  issuer: z.string().min(2, "Informe a instituição emissora."),
  description: z.string().min(10, "Informe uma descrição mais completa."),
  credentialUrl: optionalUrlSchema,
  imageUrl: optionalUrlSchema,
  issuedAt: dateInputSchema,
  expiresAt: z.union([dateInputSchema, z.literal("")]),
  status: certificateStatusSchema,
  tagIds: z.array(z.uuid()),
  sortOrder: z.number().int(),
});

export type CertificateFormInput = z.infer<typeof certificateFormSchema>;
