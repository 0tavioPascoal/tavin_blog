"use client";

import { RotateCcw } from "lucide-react";
import { useTransition } from "react";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { retryArticleCampaignAction } from "@/features/newsletter/actions/retry-article-campaign";

export function NewsletterRetryButton({ postId }: { postId: string }) {
  const [pending, startTransition] = useTransition();
  const toast = useAdminToast();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => {
        const toastId = toast.info("Reenviando newsletter...");
        const result = await retryArticleCampaignAction(postId);
        toast.handleActionResult(toastId, result);
      })}
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
    >
      <RotateCcw className={`size-3.5 ${pending ? "animate-spin" : ""}`} aria-hidden="true" />
      {pending ? "Reenviando..." : "Reenviar"}
    </button>
  );
}
