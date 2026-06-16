"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Hash, ListOrdered, Save, Text, Type } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/features/categories/actions/category-actions";
import {
  categoryFormSchema,
  type CategoryFormInput,
} from "@/features/categories/schemas/category-schema";
import type { CategoryDetail } from "@/features/categories/types/category";

type CategoryFormProps = {
  category?: CategoryDetail;
};

type FieldErrorProps = {
  message?: string;
};

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return <p className="text-sm text-red-600 dark:text-red-400">{message}</p>;
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormInput>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      sortOrder: category?.sortOrder ?? 0,
      isActive: category?.isActive ?? true,
    },
  });

  function onSubmit(values: CategoryFormInput) {
    startTransition(async () => {
      const toastId = toast.info(
        category ? "Atualizando categoria..." : "Criando categoria...",
      );

      const result = category
        ? await updateCategoryAction(category.id, values)
        : await createCategoryAction(values);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.push("/admin/categories");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <section className="rounded-3xl border border-slate-300 bg-card p-6 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Informações da categoria
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Defina nome, URL amigável, descrição, ordem de exibição e status da
            categoria.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground">
              Nome
            </label>

            <div className="relative">
              <Type className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="name"
                placeholder="Backend"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("name", {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (!category) {
                      form.setValue("slug", slugify(event.target.value), {
                        shouldValidate: true,
                      });
                    }
                  },
                })}
              />
            </div>

            <FieldError message={form.formState.errors.name?.message} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="slug" className="text-sm font-semibold text-foreground">
              Slug
            </label>

            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="slug"
                placeholder="backend"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("slug")}
              />
            </div>

            <FieldError message={form.formState.errors.slug?.message} />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-foreground"
            >
              Descrição
            </label>

            <div className="relative">
              <Text className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />

              <textarea
                id="description"
                rows={3}
                placeholder="Categoria para artigos sobre APIs, banco de dados, arquitetura e serviços backend."
                className="w-full rounded-xl border border-slate-400/70 bg-card py-3 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("description")}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[180px_1fr]">
            <div className="grid gap-2">
              <label
                htmlFor="sortOrder"
                className="text-sm font-semibold text-foreground"
              >
                Ordem
              </label>

              <div className="relative">
                <ListOrdered className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="sortOrder"
                  type="number"
                  className="h-18 w-full rounded-2xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                  {...form.register("sortOrder", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">
                Status
              </span>

              <label className="flex h-18 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-300 bg-slate-50 px-4 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-800 dark:hover:bg-blue-950/20">
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    Categoria ativa
                  </span>

                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Disponível para uso público no blog.
                  </span>
                </span>

                <input
                  type="checkbox"
                  className="size-4 accent-blue-600"
                  {...form.register("isActive")}
                />
              </label>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 rounded-xl border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-card dark:text-muted-foreground dark:hover:bg-slate-900"
          disabled={isPending}
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>

        <Button
          type="submit"
          className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          disabled={isPending}
        >
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar categoria"}
        </Button>
      </div>
    </form>
  );
}