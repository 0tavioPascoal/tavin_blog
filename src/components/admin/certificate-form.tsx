"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Award,
  Bookmark,
  CalendarDays,
  ExternalLink,
  FileText,
  Hash,
  ListOrdered,
  Save,
  Tags,
  Text,
  Upload,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import {
  createCertificateAction,
  updateCertificateAction,
} from "@/features/certificates/actions/certificate-actions";
import {
  certificateFormSchema,
  type CertificateFormInput,
} from "@/features/certificates/schemas/certificate-schema";
import type { CertificateDetail } from "@/features/certificates/types/certificate";
import type { TagSummary } from "@/features/tags/types/tag";

type CertificateFormProps = {
  certificate?: CertificateDetail;
  tags: TagSummary[];
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

function formatDateInputValue(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

export function CertificateForm({
  certificate,
  tags,
}: CertificateFormProps) {
  const router = useRouter();
  const toast = useAdminToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CertificateFormInput>({
    resolver: zodResolver(certificateFormSchema),
    defaultValues: {
      title: certificate?.title ?? "",
      slug: certificate?.slug ?? "",
      issuer: certificate?.issuer ?? "",
      description: certificate?.description ?? "",
      issuedAt: formatDateInputValue(certificate?.issuedAt ?? null),
      expiresAt: formatDateInputValue(certificate?.expiresAt ?? null),
      status: certificate?.status ?? "draft",
      tagIds: certificate?.tags.map((tag) => tag.id) ?? [],
      sortOrder: certificate?.sortOrder ?? 0,
    },
  });

  const selectedTagIds =
    useWatch({
      control: form.control,
      name: "tagIds",
    }) ?? [];

  const [certificatePdf, setCertificatePdf] = useState<File | null>(null);

  function onSubmit(values: CertificateFormInput) {
    startTransition(async () => {
      const toastId = toast.info(
        certificate
          ? "Atualizando certificado..."
          : "Criando certificado...",
      );

      const fileData = new FormData();
      if (certificatePdf) fileData.set("certificatePdf", certificatePdf);

      const result = certificate
        ? await updateCertificateAction(certificate.id, values, fileData)
        : await createCertificateAction(values, fileData);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        setCertificatePdf(null);
        router.push("/admin/certificates");
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
            <Award className="size-5" aria-hidden="true" />
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
              Formação e competências
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {certificate ? "Editar certificado" : "Novo certificado"}
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Cadastre a credencial, o emissor, as datas e os temas relacionados
              ao certificado.
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
              Informações principais
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Dados usados na listagem pública e na identificação da
              credencial.
            </p>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-foreground"
              >
                Título
              </label>

              <div className="relative">
                <Award className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="title"
                  placeholder="Oracle Java Foundations"
                  className={`${inputClassName} pl-10 pr-3`}
                  aria-invalid={Boolean(form.formState.errors.title)}
                  {...form.register("title", {
                    onChange: (
                      event: React.ChangeEvent<HTMLInputElement>,
                    ) => {
                      if (!certificate) {
                        form.setValue("slug", slugify(event.target.value), {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    },
                  })}
                />
              </div>

              <FieldError
                message={form.formState.errors.title?.message}
              />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="issuer"
                className="text-sm font-semibold text-foreground"
              >
                Emissor
              </label>

              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="issuer"
                  placeholder="Oracle"
                  className={`${inputClassName} pl-10 pr-3`}
                  aria-invalid={Boolean(form.formState.errors.issuer)}
                  {...form.register("issuer")}
                />
              </div>

              <FieldError
                message={form.formState.errors.issuer?.message}
              />
            </div>
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
                placeholder="oracle-java-foundations"
                className={`${inputClassName} pl-10 pr-3 font-mono`}
                aria-invalid={Boolean(form.formState.errors.slug)}
                {...form.register("slug")}
              />
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Usado na URL pública. Utilize apenas letras minúsculas, números e
              hífens.
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
                placeholder="Resumo sobre o certificado, conteúdo estudado e competência reforçada."
                className="w-full resize-y rounded-xl border border-slate-300/80 bg-background py-3 pl-10 pr-3 text-sm leading-6 text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                aria-invalid={Boolean(
                  form.formState.errors.description,
                )}
                {...form.register("description")}
              />
            </div>

            <FieldError
              message={form.formState.errors.description?.message}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
        <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <FileText className="size-4" aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-base font-bold text-foreground">
              Arquivo do certificado
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Envie o PDF que será disponibilizado na página pública.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <label htmlFor="certificatePdf" className="text-sm font-semibold text-foreground">
            PDF do certificado
          </label>
          <input
            id="certificatePdf"
            type="file"
            accept="application/pdf,.pdf"
            disabled={isPending}
            onChange={(event) => setCertificatePdf(event.target.files?.[0] ?? null)}
            className="block h-11 w-full rounded-xl border border-slate-300/80 bg-background text-sm text-foreground file:mr-4 file:h-full file:border-0 file:border-r file:border-border file:bg-muted file:px-4 file:text-sm file:font-semibold hover:border-slate-400 disabled:opacity-60 dark:border-slate-700"
          />
          <p className="text-xs leading-5 text-muted-foreground">
            Somente PDF, com tamanho máximo de 5 MB. É obrigatório para publicar.
            {certificate?.pdfUrl ? " Um PDF já está publicado; selecione outro apenas para substituí-lo." : ""}
          </p>
          {certificatePdf ? (
            <p className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <Upload className="size-4" aria-hidden="true" />
              {certificatePdf.name}
            </p>
          ) : null}
        </div>

        {certificate?.pdfUrl ? (
          <a
            href={certificate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-border bg-background px-3.5 text-sm font-semibold text-muted-foreground transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-800 dark:hover:bg-blue-950/30 dark:hover:text-blue-300"
          >
            Abrir PDF atual
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
        <div className="mb-6 flex items-start justify-between gap-3 border-b border-border pb-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Tags className="size-4" aria-hidden="true" />
            </span>

            <div>
              <h2 className="text-base font-bold text-foreground">
                Tags relacionadas
              </h2>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Relacione as tecnologias, áreas e competências da certificação.
              </p>
            </div>
          </div>

          <span className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 px-2 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
            {selectedTagIds.length}
          </span>
        </div>

        {tags.length > 0 ? (
          <div className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => {
              const selected = selectedTagIds.includes(tag.id);

              return (
                <label
                  key={tag.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                    selected
                      ? "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
                      : "border-border bg-background text-muted-foreground hover:border-blue-300 hover:bg-blue-50/50 hover:text-foreground dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={tag.id}
                    className="size-4 shrink-0 accent-blue-600"
                    {...form.register("tagIds")}
                  />

                  <span className="min-w-0 flex-1 truncate">
                    {tag.name}
                  </span>

                  {!tag.isActive ? (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                      Inativa
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma tag cadastrada.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:p-6">
        <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            <CalendarDays className="size-4" aria-hidden="true" />
          </span>

          <div>
            <h2 className="text-base font-bold text-foreground">
              Publicação e validade
            </h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Defina as datas, o status público e a posição do certificado.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="grid gap-2">
            <label
              htmlFor="issuedAt"
              className="text-sm font-semibold text-foreground"
            >
              Emissão
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="issuedAt"
                type="date"
                className={`${inputClassName} pl-10 pr-3`}
                aria-invalid={Boolean(form.formState.errors.issuedAt)}
                {...form.register("issuedAt")}
              />
            </div>

            <FieldError
              message={form.formState.errors.issuedAt?.message}
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="expiresAt"
              className="text-sm font-semibold text-foreground"
            >
              Expiração
            </label>

            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="expiresAt"
                type="date"
                className={`${inputClassName} pl-10 pr-3`}
                aria-invalid={Boolean(form.formState.errors.expiresAt)}
                {...form.register("expiresAt")}
              />
            </div>

            <FieldError
              message={form.formState.errors.expiresAt?.message}
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="status"
              className="text-sm font-semibold text-foreground"
            >
              Status
            </label>

            <div className="relative">
              <Bookmark className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <select
                id="status"
                className={`${inputClassName} pl-10 pr-3`}
                {...form.register("status")}
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

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
                className={`${inputClassName} pl-10 pr-3`}
                {...form.register("sortOrder", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-300/70 bg-card p-4 shadow-sm dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted-foreground">
          Revise os dados, as datas e a URL antes de salvar.
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
            {isPending ? "Salvando..." : "Salvar certificado"}
          </Button>
        </div>
      </div>
    </form>
  );
}
