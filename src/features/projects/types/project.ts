import type { LucideIcon } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  tags: string[];
  isFeatured: boolean;
};
