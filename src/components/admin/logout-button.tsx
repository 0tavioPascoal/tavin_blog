"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/auth/actions/auth-actions";

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
      className={className}
      onClick={handleClick}
      disabled={isPending}
    >
      {showIcon ? <LogOut className="size-4" /> : null}
      {isPending ? "Saindo..." : label}
    </Button>
  );
}
