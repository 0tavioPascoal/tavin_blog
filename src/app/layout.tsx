import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getSiteUrlFallback } from "@/lib/env";
import { ThemeProvider } from "@/providers/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrlFallback();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Otávio Pascoal | Blog e Portfólio",
    template: "%s | Otávio Pascoal",
  },

  description:
    "Blog técnico e portfólio de Otávio Pascoal sobre desenvolvimento fullstack, arquitetura de software, qualidade, produto e regras de negócio.",

  authors: [
    {
      name: "Otávio Pascoal",
      url: siteUrl,
    },
  ],

  creator: "Otávio Pascoal",
  publisher: "Otávio Pascoal",

  keywords: [
    "Otávio Pascoal",
    "desenvolvimento de software",
    "desenvolvimento fullstack",
    "backend",
    "arquitetura de software",
    "qualidade de software",
    "regras de negócio",
    "ASP.NET Core",
    "Next.js",
  ],

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Otávio Pascoal | Blog e Portfólio",
    title: "Otávio Pascoal | Blog e Portfólio",
    description:
      "Conteúdos técnicos, projetos e experiências sobre desenvolvimento de software, arquitetura, qualidade e negócio.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Otávio Pascoal | Blog e Portfólio",
    description:
      "Conteúdos técnicos, projetos e experiências sobre desenvolvimento de software, arquitetura, qualidade e negócio.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}