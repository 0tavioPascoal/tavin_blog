import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Informe um e-mail válido.")
    .pipe(z.email("Informe um e-mail válido."))
    .transform((value) => value.toLowerCase()),
  source: z.enum(["article", "articles-page", "footer", "header"]),
  website: z.string().max(0).optional().default(""),
});
