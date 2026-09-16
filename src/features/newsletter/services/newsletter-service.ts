import "server-only";

import {
  createSubscriber,
  findSubscriberByEmail,
  reactivateSubscriber,
} from "@/features/newsletter/repositories/newsletter-subscriber-repository";
import type { NewsletterSource } from "@/features/newsletter/types/newsletter";

export async function subscribeToNewsletter(email: string, source: NewsletterSource) {
  const normalizedEmail = email.trim().toLowerCase();
  let subscriber = await findSubscriberByEmail(normalizedEmail);

  if (!subscriber) {
    subscriber = await createSubscriber(normalizedEmail, source);
  }

  if (subscriber.status === "unsubscribed") {
    subscriber = await reactivateSubscriber(subscriber.id, source);
  } else if (subscriber.status === "bounced" || subscriber.status === "complained") {
    return;
  }
}
