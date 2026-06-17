"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Award,
  Bookmark,
  CalendarDays,
  Hash,
  ImageIcon,
  LinkIcon,
  ListOrdered,
  Save,
  Text,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

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

function formatDateInputValue(value: string | null): string {
  return value ? value.slice(0, 10) : "";
}

export function CertificateForm({ certificate, tags }: CertificateFormProps) {
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
      credentialUrl: certificate?.credentialUrl ?? "",
      imageUrl: certificate?.imageUrl ?? "",
      issuedAt: formatDateInputValue(certificate?.issuedAt ?? null),
      expiresAt: formatDateInputValue(certificate?.expiresAt ?? null),
      status: certificate?.status ?? "draft",
      tagIds: certificate?.tags.map((tag) => tag.id) ?? [],
      sortOrder: certificate?.sortOrder ?? 0,
    },
  });

  function onSubmit(values: CertificateFormInput) {
    startTransition(async () => {
      const toastId = toast.info(
        certificate ? "Atualizando certificado..." : "Criando certificado...",
      );

      const result = certificate
        ? await updateCertificateAction(certificate.id, values)
        : await createCertificateAction(values);

      toast.handleActionResult(toastId, result);

      if (result.ok) {
        router.push("/admin/certificates");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <section className="rounded-2xl border border-slate-300 bg-card p-4 shadow-sm shadow-slate-200/80 dark:border-slate-800 dark:shadow-black/20 sm:rounded-3xl sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">
            Informações do certificado
          </h2>

          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Configure título, emissor, links, datas, status e tags relacionadas
            ao certificado.
          </p>
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-foreground">
              Título
            </label>

            <div className="relative">
              <Award className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="title"
                placeholder="Oracle Java Foundations"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("title", {
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (!certificate) {
                      form.setValue("slug", slugify(event.target.value), {
                        shouldValidate: true,
                      });
                    }
                  },
                })}
              />
            </div>

            <FieldError message={form.formState.errors.title?.message} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="slug" className="text-sm font-semibold text-foreground">
              Slug
            </label>

            <div className="relative">
              <Hash className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="slug"
                placeholder="oracle-java-foundations"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("slug")}
              />
            </div>

            <FieldError message={form.formState.errors.slug?.message} />
          </div>

          <div className="grid gap-2">
            <label htmlFor="issuer" className="text-sm font-semibold text-foreground">
              Emissor
            </label>

            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                id="issuer"
                placeholder="Oracle"
                className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("issuer")}
              />
            </div>

            <FieldError message={form.formState.errors.issuer?.message} />
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
                placeholder="Resumo curto sobre o certificado, conteúdo estudado e competência reforçada."
                className="w-full rounded-xl border border-slate-400/70 bg-card py-3 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                {...form.register("description")}
              />
            </div>

            <FieldError message={form.formState.errors.description?.message} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="grid gap-2">
              <label
                htmlFor="credentialUrl"
                className="text-sm font-semibold text-foreground"
              >
                URL da credencial
              </label>

              <div className="relative">
                <LinkIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="credentialUrl"
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                  {...form.register("credentialUrl")}
                />
              </div>

              <FieldError message={form.formState.errors.credentialUrl?.message} />
            </div>

            <div className="grid gap-2">
              <label
                htmlFor="imageUrl"
                className="text-sm font-semibold text-foreground"
              >
                URL da imagem
              </label>

              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="imageUrl"
                  placeholder="/images/certificado.png"
                  className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground/70 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                  {...form.register("imageUrl")}
                />
              </div>

              <FieldError message={form.formState.errors.imageUrl?.message} />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
            <div className="grid gap-2">
              <span className="text-sm font-semibold text-foreground">
                Tags
              </span>

              <div className="rounded-2xl border border-slate-300 bg-slate-50 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/30">
                {tags.length > 0 ? (
                  <div className="grid max-h-72 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                      >
                        <input
                          type="checkbox"
                          value={tag.id}
                          className="size-4 accent-blue-600"
                          {...form.register("tagIds")}
                        />

                        <span className="min-w-0 flex-1 truncate">
                          {tag.name}
                        </span>

                        {!tag.isActive ? (
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Inativa
                          </span>
                        ) : null}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhuma tag cadastrada.
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">
                Selecione as tags relacionadas ao certificado.
              </p>
            </div>

            <div className="grid content-start gap-5">
              <div className="grid gap-5 md:grid-cols-2">
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
                      className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                      {...form.register("issuedAt")}
                    />
                  </div>

                  <FieldError message={form.formState.errors.issuedAt?.message} />
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
                      className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600"
                      {...form.register("expiresAt")}
                    />
                  </div>

                  <FieldError message={form.formState.errors.expiresAt?.message} />
                </div>
              </div>

              <div className="grid items-stretch gap-5 md:grid-cols-[1fr_180px]">
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
                      className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600 md:h-20 md:rounded-2xl"
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
                      className="h-11 w-full rounded-xl border border-slate-400/70 bg-card pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 hover:border-slate-500/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:hover:border-slate-600 md:h-20 md:rounded-2xl"
                      {...form.register("sortOrder", { valueAsNumber: true })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          {isPending ? "Salvando..." : "Salvar certificado"}
        </Button>
      </div>
    </form>
  );
}
