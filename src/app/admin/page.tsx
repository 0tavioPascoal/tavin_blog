import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { AdminLoginScreen } from "@/components/admin/admin-login-screen";
import { getAdminAuthState } from "@/features/auth/repositories/auth-repository";
import { listAllCertificatesForAdmin } from "@/features/certificates/repositories/certificates-repository";
import { listAllArticlesForAdmin } from "@/features/posts/repositories/posts-repository";

export default async function AdminPage() {
  const { adminUser, sessionUser } = await getAdminAuthState();

  if (!adminUser) {
    if (sessionUser) {
      return <AdminAccessDenied userEmail={sessionUser.email} />;
    }

    return <AdminLoginScreen />;
  }

  const [articles, certificates] = await Promise.all([
    listAllArticlesForAdmin(),
    listAllCertificatesForAdmin(),
  ]);

  return (
    <AdminDashboard
      user={adminUser}
      articles={articles}
      certificates={certificates}
    />
  );
}
