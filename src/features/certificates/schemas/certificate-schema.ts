import { z } from "zod";
import { format, isValid, parse } from "date-fns";

export const certificateStatusSchema = z.enum(["draft", "published"]);

const dateInputSchema = z.string().transform((value, context) => {
  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : (() => {
        const parsed = parse(value, "dd/MM/yyyy", new Date());
        return isValid(parsed) && format(parsed, "dd/MM/yyyy") === value
          ? format(parsed, "yyyy-MM-dd")
          : null;
      })();

  if (!normalized) {
    context.addIssue({ code: "custom", message: "Informe uma data válida no formato DD/MM/AAAA." });
    return z.NEVER;
  }

  return normalized;
});

export const certificateRowSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  issuer: z.string().min(1),
  description: z.string().min(1),
  credential_url: z.string().nullable(),
  image_url: z.string().nullable(),
  pdf_url: z.preprocess((value) => value ?? null, z.string().nullable()),
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
  issuedAt: dateInputSchema,
  expiresAt: z.union([dateInputSchema, z.literal("")]),
  doesNotExpire: z.boolean(),
  status: certificateStatusSchema,
  tagIds: z.array(z.uuid()),
  sortOrder: z.number().int(),
}).superRefine((certificate, context) => {
  const today = format(new Date(), "yyyy-MM-dd");

  if (certificate.issuedAt > today) {
    context.addIssue({ code: "custom", path: ["issuedAt"], message: "A emissão não pode estar no futuro." });
  }

  if (!certificate.doesNotExpire && certificate.expiresAt === "") {
    context.addIssue({ code: "custom", path: ["expiresAt"], message: "Informe a expiração ou marque Sem expiração." });
  }

  if (certificate.expiresAt && certificate.expiresAt < certificate.issuedAt) {
    context.addIssue({ code: "custom", path: ["expiresAt"], message: "A expiração não pode ser anterior à emissão." });
  }
}).transform((certificate) => ({
  ...certificate,
  expiresAt: certificate.doesNotExpire ? "" : certificate.expiresAt,
}));

export type CertificateFormInput = z.infer<typeof certificateFormSchema>;
