import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import { getSiteUrlFallback } from "@/lib/env";
import { ThemeProvider } from "@/providers/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrlFallback()),
  title: {
    default: "Otávio Pascoal | Blog e Portfólio",
    template: "%s | Otávio Pascoal",
  },
  description:
    "Blog técnico e portfólio de Otávio Pascoal sobre desenvolvimento fullstack, arquitetura de software, qualidade e produto.",
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
      <body className="min-h-screen overflow-x-hidden bg-background text-foreground">
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