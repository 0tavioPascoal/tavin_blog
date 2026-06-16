"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Toast } from "radix-ui";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminToastVariant = "info" | "success" | "error";

type AdminToast = {
  id: string;
  message: string;
  title: string;
  variant: AdminToastVariant;
};

type ActionResult = {
  ok: boolean;
  message: string;
};

type ShowToastInput = {
  message: string;
  title?: string;
  variant?: AdminToastVariant;
};

type AdminToastContextValue = {
  info: (message: string, title?: string) => string;
  success: (message: string, title?: string) => string;
  error: (message: string, title?: string) => string;
  update: (id: string, input: ShowToastInput) => void;
  handleActionResult: (id: string, result: ActionResult) => void;
};

const AdminToastContext = createContext<AdminToastContextValue | null>(null);

function createToastId(): string {
  return `admin-toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDefaultTitle(variant: AdminToastVariant): string {
  if (variant === "success") return "Tudo certo";
  if (variant === "error") return "Algo deu errado";
  return "Processando";
}

function ToastIcon({ variant }: { variant: AdminToastVariant }) {
  const className = "mt-0.5 size-5 shrink-0";

  if (variant === "success") {
    return (
      <CheckCircle2
        className={cn(className, "text-emerald-600 dark:text-emerald-400")}
      />
    );
  }

  if (variant === "error") {
    return (
      <XCircle className={cn(className, "text-red-600 dark:text-red-400")} />
    );
  }

  return (
    <Info className={cn(className, "text-blue-600 dark:text-blue-400")} />
  );
}

function getToastClassName(variant: AdminToastVariant) {
  if (variant === "success") {
    return "border-emerald-300/70 dark:border-emerald-900/80";
  }

  if (variant === "error") {
    return "border-red-300/70 dark:border-red-900/80";
  }

  return "border-blue-300/70 dark:border-blue-900/80";
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  const show = useCallback((input: ShowToastInput) => {
    const variant = input.variant ?? "info";
    const id = createToastId();

    setToasts((current) => [
      ...current,
      {
        id,
        message: input.message,
        title: input.title ?? getDefaultTitle(variant),
        variant,
      },
    ]);

    return id;
  }, []);

  const update = useCallback((id: string, input: ShowToastInput) => {
    setToasts((current) =>
      current.map((toast) => {
        if (toast.id !== id) return toast;

        const variant = input.variant ?? toast.variant;

        return {
          id,
          message: input.message,
          title: input.title ?? getDefaultTitle(variant),
          variant,
        };
      }),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo<AdminToastContextValue>(
    () => ({
      info: (message, title) => show({ message, title, variant: "info" }),
      success: (message, title) => show({ message, title, variant: "success" }),
      error: (message, title) => show({ message, title, variant: "error" }),
      update,
      handleActionResult: (id, result) => {
        update(id, {
          message: result.message,
          variant: result.ok ? "success" : "error",
        });
      },
    }),
    [show, update],
  );

  return (
    <AdminToastContext.Provider value={value}>
      <Toast.Provider swipeDirection="right" duration={4200}>
        {children}

        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            open
            onOpenChange={(open: boolean) => {
              if (!open) remove(toast.id);
            }}
            className={cn(
              "grid w-[calc(100vw-2rem)] max-w-sm grid-cols-[1fr_auto] gap-3 rounded-2xl border bg-card p-4 shadow-xl shadow-slate-900/10 outline-none backdrop-blur transition-all data-[state=closed]:animate-out data-[state=open]:animate-in data-[swipe=end]:animate-out dark:shadow-black/30 sm:w-96",
              getToastClassName(toast.variant),
            )}
          >
            <div className="flex gap-3">
              <ToastIcon variant={toast.variant} />

              <div className="grid gap-1">
                <Toast.Title className="text-sm font-semibold text-foreground">
                  {toast.title}
                </Toast.Title>

                <Toast.Description className="text-sm leading-5 text-muted-foreground">
                  {toast.message}
                </Toast.Description>
              </div>
            </div>

            <Toast.Close asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Fechar aviso"
                className="rounded-xl text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </Toast.Close>
          </Toast.Root>
        ))}

        <Toast.Viewport className="fixed right-4 top-4 z-50 grid gap-3 outline-none" />
      </Toast.Provider>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);

  if (!context) {
    throw new Error(
      "useAdminToast precisa ser usado dentro de AdminToastProvider.",
    );
  }

  return context;
}