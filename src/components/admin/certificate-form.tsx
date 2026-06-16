"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { useAdminToast } from "@/components/admin/admin-toast-provider";
import { Button } from "@/components/ui/button";
import { createCertificateAction, updateCertificateAction } from "@/features/certificates/actions/certificate-actions";
import { certificateFormSchema, type CertificateFormInput } from "@/features/certificates/schemas/certificate-schema";
import type { CertificateDetail } from "@/features/certificates/types/certificate";
import type { TagSummary } from "@/features/tags/types/tag";

type CertificateFormProps = {
  certificate?: CertificateDetail;
  tags: TagSummary[];
};

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
      const toastId = toast.info(certificate ? "Atualizando certificado..." : "Criando certificado...");
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
      <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium">Título</label>
          <input
            id="title"
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("title", {
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                if (!certificate) {
                  form.setValue("slug", slugify(event.target.value), { shouldValidate: true });
                }
              },
            })}
          />
          {form.formState.errors.title ? <p className="text-sm text-red-600">{form.formState.errors.title.message}</p> : null}
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
          <label htmlFor="issuer" className="text-sm font-medium">Emissor</label>
          <input
            id="issuer"
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("issuer")}
          />
          {form.formState.errors.issuer ? <p className="text-sm text-red-600">{form.formState.errors.issuer.message}</p> : null}
        </div>
        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">Descrição</label>
          <textarea
            id="description"
            rows={3}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("description")}
          />
          {form.formState.errors.description ? <p className="text-sm text-red-600">{form.formState.errors.description.message}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="credentialUrl" className="text-sm font-medium">URL da credencial</label>
            <input
              id="credentialUrl"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("credentialUrl")}
            />
            {form.formState.errors.credentialUrl ? <p className="text-sm text-red-600">{form.formState.errors.credentialUrl.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <label htmlFor="imageUrl" className="text-sm font-medium">URL da imagem</label>
            <input
              id="imageUrl"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("imageUrl")}
            />
            {form.formState.errors.imageUrl ? <p className="text-sm text-red-600">{form.formState.errors.imageUrl.message}</p> : null}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_160px_120px]">
          <div className="grid gap-2">
            <label htmlFor="issuedAt" className="text-sm font-medium">Emissão</label>
            <input
              id="issuedAt"
              type="date"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("issuedAt")}
            />
            {form.formState.errors.issuedAt ? <p className="text-sm text-red-600">{form.formState.errors.issuedAt.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <label htmlFor="expiresAt" className="text-sm font-medium">Expiração</label>
            <input
              id="expiresAt"
              type="date"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("expiresAt")}
            />
            {form.formState.errors.expiresAt ? <p className="text-sm text-red-600">{form.formState.errors.expiresAt.message}</p> : null}
          </div>
          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select
              id="status"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("status")}
            >
              <option value="draft">Rascunho</option>
              <option value="published">Publicado</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="sortOrder" className="text-sm font-medium">Ordem</label>
            <input
              id="sortOrder"
              type="number"
              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
              {...form.register("sortOrder", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="tagIds" className="text-sm font-medium">Tags</label>
          <select
            id="tagIds"
            multiple
            className="min-h-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:focus:ring-blue-950"
            {...form.register("tagIds")}
          >
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}{tag.isActive ? "" : " (inativa)"}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500">Use Ctrl/Command para selecionar mais de uma tag.</p>
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="h-10 rounded-lg bg-blue-600 px-5 text-white hover:bg-blue-700" disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Salvando..." : "Salvar certificado"}
        </Button>
      </div>
    </form>
  );
}
