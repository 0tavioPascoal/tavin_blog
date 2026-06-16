"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { createCategoryAction, updateCategoryAction } from "@/features/categories/actions/category-actions";
import { categoryFormSchema, type CategoryFormInput } from "@/features/categories/schemas/category-schema";
import type { CategoryDetail } from "@/features/categories/types/category";

type CategoryFormProps = {
  category?: CategoryDetail;
};

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
      const toastId = toast.info(category ? "Atualizando categoria..." : "Criando categoria...");
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
      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">Nome</label>
          <input
            id="name"
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("name", {
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                if (!category) {
                  form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }
              },
            })}
          />
          {form.formState.errors.name ? <p className="text-sm text-red-600">{form.formState.errors.name.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="slug" className="text-sm font-medium">Slug</label>
          <input
            id="slug"
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("slug")}
          />
          {form.formState.errors.slug ? <p className="text-sm text-red-600">{form.formState.errors.slug.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">Descrição</label>
          <textarea
            id="description"
            rows={3}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("description")}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-[160px_160px]">
          <div className="grid gap-2">
            <label htmlFor="sortOrder" className="text-sm font-medium">Ordem</label>
            <input
              id="sortOrder"
              type="number"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("sortOrder", { valueAsNumber: true })}
            />
          </div>
          <label className="flex items-center gap-2 self-end rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-800">
            <input type="checkbox" className="size-4" {...form.register("isActive")} />
            Ativa
          </label>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="h-10 rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar categoria"}
        </Button>
      </div>
    </form>
  );
}
