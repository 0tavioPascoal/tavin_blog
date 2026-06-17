import { SiteShell } from "@/components/layout/site-shell";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
