"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";

type ActionResult = {
  ok: boolean;
  message: string;
};

type DeleteActionButtonProps = {
  action: () => Promise<ActionResult>;
  pendingMessage: string;
};

export function DeleteActionButton({ action, pendingMessage }: DeleteActionButtonProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const toastId = toast.info(pendingMessage);
      const result = await action();

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <Button type="button" variant="destructive" size="sm" onClick={handleClick} disabled={isPending}>
      <Trash2 className="size-4" />
      {isPending ? "Removendo..." : "Remover"}
    </Button>
  );
}
