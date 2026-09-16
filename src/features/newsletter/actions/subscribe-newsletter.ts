"use server";

import { newsletterSubscriptionSchema } from "@/features/newsletter/schemas/newsletter-schema";
import { subscribeToNewsletter } from "@/features/newsletter/services/newsletter-service";
import type { NewsletterActionState } from "@/features/newsletter/types/newsletter";
import { enforceRateLimit, hashRateLimitIdentifier } from "@/lib/rate-limit";

export async function subscribeNewsletterAction(
  _previousState: NewsletterActionState,
  formData: FormData,
): Promise<NewsletterActionState> {
  const parsed = newsletterSubscriptionSchema.safeParse({
    email: formData.get("email"),
    source: formData.get("source"),
    website: formData.get("website") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revise o e-mail informado e tente novamente.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await enforceRateLimit({
      scope: "newsletter-subscribe",
      identifier: hashRateLimitIdentifier(parsed.data.email),
      maxAttempts: 5,
      windowSeconds: 15 * 60,
    });
    await subscribeToNewsletter(parsed.data.email, parsed.data.source);
  } catch (error) {
    console.error("Falha ao inscrever na newsletter", error);
    return {
      status: "error",
      message: "Não conseguimos concluir sua inscrição. Tente novamente.",
    };
  }

  return {
    status: "success",
    message: "Pronto! Você receberá os próximos artigos.",
  };
}
