"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Hash,
  Palette,
  Save,
  Tag,
  Text,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { TagBadge } from "@/components/blog/tag-badge";
import { Button } from "@/components/ui/button";
import {
  createTagAction,
  updateTagAction,
} from "@/features/tags/actions/tag-actions";
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

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-300/80 bg-background text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600";

function FieldError({ message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      className="text-sm font-medium text-red-600 dark:text-red-400"
    >
      {message}
    </p>
  );
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
    useWatch({
      control: form.control,
      name: "colorHex",
    }) ?? defaultTagColorHex;

  const name =
    useWatch({
      control: form.control,
      name: "name",
    }) ?? "";

  const isActive =
    useWatch({
      control: form.control,
      name: "isActive",
    }) ?? true;

  const colorPickerValue = tagColorHexSchema.safeParse(colorHex).success
    ? colorHex
    : defaultTagColorHex;

  function onSubmit(values: TagFormInput) {
    startTransition(async () => {
      const toastId = toast.info(
        tag ? "Atualizando tag..." : "Criando tag...",
      );

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
      <section className="relative isolate overflow-hidden rounded-[2rem] border border-slate-300/70 bg-card px-5 py-7 shadow-sm dark:border-slate-800 sm:px-7 sm:py-8">
        <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-size-[32px_32px] dark:bg-[linear-gradient(to_right,rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.03)_1px,transparent_1px)]" />
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />

        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50/90 text-blue-600 shadow-sm dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-400">
            <Tag className="size-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
              Organização de conteúdo
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {tag ? "Editar tag" : "Nova tag"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Configure o nome, a URL amigável, a descrição e a identidade
              visual usada para destacar a tag no blog.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
        <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Text className="size-4" aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-base font-bold text-foreground">
              Informações da tag
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Defina os dados principais usados na listagem e nas páginas do
              blog.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-foreground"
            >
              Nome
            </label>

            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="name"
                placeholder="Backend"
                className={`${inputClassName} pl-10 pr-3`}
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name", {
                  onChange: (
                    event: React.ChangeEvent<HTMLInputElement>,
                  ) => {
                    if (!tag) {
                      form.setValue("slug", slugify(event.target.value), {
                        shouldDirty: true,
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
            <label
              htmlFor="slug"
              className="text-sm font-semibold text-foreground"
            >
              Slug
            </label>

            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="slug"
                placeholder="backend"
                className={`${inputClassName} pl-10 pr-3 font-mono`}
                aria-invalid={Boolean(form.formState.errors.slug)}
                {...form.register("slug")}
              />
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Usado na URL pública da tag. Utilize apenas letras minúsculas,
              números e hífens.
            </p>

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
              <Text className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground" />

              <textarea
                id="description"
                rows={4}
                placeholder="Assuntos relacionados a backend, APIs, bancos de dados e arquitetura."
                className="w-full resize-y rounded-xl border border-slate-300/80 bg-background py-3 pl-10 pr-3 text-sm leading-6 text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("description")}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
        <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <Palette className="size-4" aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-base font-bold text-foreground">
              Identidade visual
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Escolha a cor da tag e confira o resultado antes de salvar.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-5 sm:grid-cols-[160px_minmax(0,1fr)]">
            <div className="grid gap-2">
              <label
                htmlFor="colorPicker"
                className="text-sm font-semibold text-foreground"
              >
                Seletor de cor
              </label>

              <div className="relative">
                <Palette className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="colorPicker"
                  type="color"
                  className="h-11 w-full cursor-pointer rounded-xl border border-slate-300/80 bg-background pl-10 pr-2 shadow-sm transition hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600"
                  value={colorPickerValue}
                  onChange={(event) =>
                    form.setValue(
                      "colorHex",
                      event.target.value.toUpperCase(),
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    )
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="colorHex"
                className="text-sm font-semibold text-foreground"
              >
                Código hexadecimal
              </label>

              <input
                id="colorHex"
                placeholder="#2563EB"
                className={`${inputClassName} px-3 font-mono uppercase`}
                aria-invalid={Boolean(form.formState.errors.colorHex)}
                {...form.register("colorHex", {
                  onChange: (
                    event: React.ChangeEvent<HTMLInputElement>,
                  ) => {
                    form.setValue(
                      "colorHex",
                      event.target.value.toUpperCase(),
                      {
                        shouldDirty: true,
                        shouldValidate: true,
                      },
                    );
                  },
                })}
              />

              <FieldError
                message={form.formState.errors.colorHex?.message}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">
              Preview
            </span>

            <div className="flex min-h-28 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-muted/30 p-5 dark:border-slate-800">
              <TagBadge
                name={name.trim() || "Tag"}
                colorHex={colorPickerValue}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-4 transition hover:border-blue-300 hover:bg-blue-50/60 dark:hover:border-blue-800 dark:hover:bg-blue-950/20">
          <span className="flex min-w-0 items-center gap-3">
            <span
              className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${
                isActive
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
            </span>

            <span className="min-w-0">
              <span className="block text-sm font-bold text-foreground">
                Tag ativa
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                Tags inativas permanecem cadastradas, mas não aparecem nas
                áreas públicas.
              </span>
            </span>
          </span>

          <input
            type="checkbox"
            className="size-4 shrink-0 accent-blue-600"
            {...form.register("isActive")}
          />
        </label>
      </section>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Revise o nome, o slug e a cor antes de salvar.
        </p>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-11 w-full rounded-xl px-5 sm:w-auto"
            disabled={isPending}
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar
          </Button>

          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
            disabled={isPending}
          >
            <Save className="size-4" aria-hidden="true" />
            {isPending ? "Salvando..." : "Salvar tag"}
          </Button>
        </div>
      </div>
    </form>
  );
}