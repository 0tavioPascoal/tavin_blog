import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

import { getNewsletterDeliveryConfig, getSiteUrlFallback } from "@/lib/env";

type UnsubscribeTokenPayload = {
  subscriberId: string;
  expiresAt: number;
};

const unsubscribeTokenLifetimeSeconds = 365 * 24 * 60 * 60;

function getSecret(): string {
  const config = getNewsletterDeliveryConfig();
  if (!config) {
    throw new Error("A configuração de entrega da newsletter está incompleta.");
  }
  return config.NEWSLETTER_UNSUBSCRIBE_SECRET;
}

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", getSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createNewsletterUnsubscribeUrl(subscriberId: string): string {
  const payload: UnsubscribeTokenPayload = {
    subscriberId,
    expiresAt: Math.floor(Date.now() / 1000) + unsubscribeTokenLifetimeSeconds,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const token = `${encodedPayload}.${signPayload(encodedPayload)}`;
  const url = new URL("/newsletter/unsubscribe", getSiteUrlFallback());
  url.searchParams.set("token", token);
  return url.toString();
}

export function verifyNewsletterUnsubscribeToken(token: string): string | null {
  const [encodedPayload, receivedSignature, extraPart] = token.split(".");
  if (!encodedPayload || !receivedSignature || extraPart) return null;

  const expectedSignature = signPayload(encodedPayload);
  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("subscriberId" in parsed) ||
      !("expiresAt" in parsed) ||
      typeof parsed.subscriberId !== "string" ||
      typeof parsed.expiresAt !== "number" ||
      parsed.expiresAt < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return parsed.subscriberId;
  } catch {
    return null;
  }
}
