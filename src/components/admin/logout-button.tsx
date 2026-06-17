"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions/auth-actions";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  label?: string;
  showIcon?: boolean;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
};

export function LogoutButton({
  className,
  label = "Sair",
  showIcon = true,
  variant = "outline",
  size,
}: LogoutButtonProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const toastId = toast.info("Encerrando sua sessão...");
      const result = await signOutAction();

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "gap-2 rounded-xl font-medium transition-all",
        variant === "outline" &&
        "border-slate-300/70 bg-card text-muted-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:hover:border-red-900 dark:hover:bg-red-950/30 dark:hover:text-red-400",
        variant === "ghost" &&
        "text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400",
        className,
      )}
    >
      {showIcon ? <LogOut className="size-4 shrink-0" /> : null}

      {label ? (isPending ? "Saindo..." : label) : null}
    </Button>
  );
}