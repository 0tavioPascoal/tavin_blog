import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteSettings } from "@/features/settings/repositories/settings-repository";

type SiteShellProps = {
  children: React.ReactNode;
};

export async function SiteShell({ children }: SiteShellProps) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
