"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Hash, Palette, Save, Tag, Text } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { TagBadge } from "@/components/blog/tag-badge";
import { Button } from "@/components/ui/button";
import { createTagAction, updateTagAction } from "@/features/tags/actions/tag-actions";
import {
  defaultTagColorHex,
  tagColorHexSchema,
  tagFormSchema,
  type TagFormInput,
} from "@/features/tags/schemas/tag-schema";
import type { TagDetail } from "@/features/tags/types/tag";

type TagFormProps = {
  tag?: TagDetail;
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

export function TagForm({ tag }: TagFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TagFormInput>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: tag?.name ?? "",
      slug: tag?.slug ?? "",
      description: tag?.description ?? "",
      colorHex: tag?.colorHex ?? defaultTagColorHex,
      isActive: tag?.isActive ?? true,
    },
  });

  const colorHex =
    useWatch({ control: form.control, name: "colorHex" }) ?? defaultTagColorHex;

  const name = useWatch({ control: form.control, name: "name" }) ?? "";

  const colorPickerValue = tagColorHexSchema.safeParse(colorHex).success
    ? colorHex
    : defaultTagColorHex;

  function onSubmit(values: TagFormInput) {
    startTransition(async () => {
      const toastId = toast.info(tag ? "Atualizando tag..." : "Criando tag...");

      const result = tag
        ? await updateTagAction(tag.id, values)
        : await createTagAction(values);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.push("/admin/tags");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <section className="rounded-2xl border border-slate-300 bg-card p-4 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20 sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Informações da tag
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Configure o nome, URL amigável, descrição e cor usada para destacar
            a tag no blog.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-foreground">
              Nome
            </label>

            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="name"
                placeholder="Backend"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("name", {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (!tag) {
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
                placeholder="Assuntos relacionados a backend, APIs, bancos de dados e arquitetura."
                className="w-full rounded-xl border border-slate-400/70 bg-card py-3 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("description")}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[140px_1fr]">
            <div className="grid gap-2">
              <label
                htmlFor="colorPicker"
                className="text-sm font-semibold text-foreground"
              >
                Cor
              </label>

              <div className="relative">
                <Palette className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="colorPicker"
                  type="color"
                  className="h-11 w-full cursor-pointer rounded-xl border border-slate-400/70 bg-card pl-10 pr-2 shadow-sm transition hover:border-slate-500/80 dark:border-slate-700 dark:hover:border-slate-600"
                  value={colorPickerValue}
                  onChange={(event) =>
                    form.setValue("colorHex", event.target.value.toUpperCase(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="colorHex"
                className="text-sm font-semibold text-foreground"
              >
                HEX
              </label>

              <input
                id="colorHex"
                placeholder="#2563EB"
                className="h-11 rounded-xl border border-slate-400/70 bg-card px-3 font-mono text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("colorHex", {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    form.setValue("colorHex", event.target.value.toUpperCase(), {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  },
                })}
              />

              <FieldError message={form.formState.errors.colorHex?.message} />
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">
              Preview
            </span>

            <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
              <TagBadge name={name || "Tag"} colorHex={colorHex} />
            </div>
          </div>

          <label className="flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-foreground transition hover:border-slate-400 dark:border-slate-800 dark:bg-slate-900/30 sm:w-fit">
            <input
              type="checkbox"
              className="size-4 accent-blue-600"
              {...form.register("isActive")}
            />
            Ativa
          </label>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="h-11 w-full rounded-xl border-slate-300 bg-white px-5 sm:w-auto text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 dark:border-slate-800 dark:bg-card dark:text-muted-foreground dark:hover:bg-slate-900"
          disabled={isPending}
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Button>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-blue-600 px-5 sm:w-auto text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          disabled={isPending}
        >
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar tag"}
        </Button>
      </div>
    </form>
  );
}
