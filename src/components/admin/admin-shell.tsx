import { cookies } from "next/headers";

import { AdminShellClient } from "@/components/admin/admin-shell-client";
import type { AdminUser } from "@/features/auth/repositories/auth-repository";

type AdminShellProps = {
  user: AdminUser;
  children: React.ReactNode;
};

export async function AdminShell({ user, children }: AdminShellProps) {
  const cookieStore = await cookies();

  const initialCollapsed =
    cookieStore.get("admin-sidebar-collapsed")?.value === "true";

  return (
    <AdminShellClient user={user} initialCollapsed={initialCollapsed}>
      {children}
    </AdminShellClient>
  );
}