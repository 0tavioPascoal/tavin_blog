"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdminUser } from "@/features/auth/repositories/auth-repository";
import { projectFormSchema } from "@/features/projects/schemas/project-schema";
import { createProject, updateProject } from "@/features/projects/repositories/projects-repository";
import type { ProjectMutationInput } from "@/features/projects/types/project";

export type ProjectActionState = {
  ok: boolean;
  message: string;
};

function normalizeOptionalText(value: string): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toMutationInput(input: unknown): ProjectMutationInput {
  const project = projectFormSchema.parse(input);

  return {
    title: project.title,
    slug: project.slug,
    description: project.description,
    contentMarkdown: normalizeOptionalText(project.contentMarkdown),
    repositoryUrl: normalizeOptionalText(project.repositoryUrl),
    demoUrl: normalizeOptionalText(project.demoUrl),
    coverImageUrl: normalizeOptionalText(project.coverImageUrl),
    iconName: project.iconName,
    status: project.status,
    tagIds: project.tagIds,
    isFeatured: project.isFeatured,
    sortOrder: project.sortOrder,
  };
}

async function requireAdmin(): Promise<void> {
  const user = await getCurrentAdminUser();

  if (!user) {
    throw new Error("Você precisa estar autenticado como administrador.");
  }
}

export async function createProjectAction(input: unknown): Promise<ProjectActionState> {
  try {
    await requireAdmin();
    await createProject(toMutationInput(input));
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível criar o projeto.",
    };
  }

  revalidatePath("/");
  revalidatePath("/projetos");
  revalidatePath("/admin/projects");

  return {
    ok: true,
    message: "Projeto criado com sucesso.",
  };
}

export async function updateProjectAction(id: string, input: unknown): Promise<ProjectActionState> {
  try {
    await requireAdmin();
    await updateProject(id, toMutationInput(input));
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Não foi possível atualizar o projeto.",
    };
  }

  revalidatePath("/");
  revalidatePath("/projetos");
  revalidatePath("/admin/projects");

  return {
    ok: true,
    message: "Projeto atualizado com sucesso.",
  };
}
