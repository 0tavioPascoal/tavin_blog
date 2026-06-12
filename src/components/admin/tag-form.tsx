"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { createTagAction, updateTagAction } from "@/features/tags/actions/tag-actions";
import { tagFormSchema, type TagFormInput } from "@/features/tags/schemas/tag-schema";
import type { TagDetail } from "@/features/tags/types/tag";

type TagFormProps = {
  tag?: TagDetail;
};

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TagForm({ tag }: TagFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TagFormInput>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: tag?.name ?? "",
      slug: tag?.slug ?? "",
      description: tag?.description ?? "",
      isActive: tag?.isActive ?? true,
    },
  });

  function onSubmit(values: TagFormInput) {
    startTransition(async () => {
      const result = tag
        ? await updateTagAction(tag.id, values)
        : await createTagAction(values);

      setMessage(result.message);

      if (result.ok) {
        router.push("/admin/tags");
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
                if (!tag) {
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
        <label className="flex w-fit items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-800">
          <input type="checkbox" className="size-4" {...form.register("isActive")} />
          Ativa
        </label>
      </div>
      {message ? <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" className="h-10 rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar tag"}
        </Button>
      </div>
    </form>
  );
}
