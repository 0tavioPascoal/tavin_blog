import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewsletterArticleCta } from "@/components/newsletter/newsletter-article-cta";

export function ArticleFooter() {
  return (
    <footer className="mt-12">
      <NewsletterArticleCta />
      <Link
        href="/blog/artigos"
        className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-blue-400 dark:hover:text-blue-300"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        <span>Ver todos os artigos</span>
      </Link>
    </footer>
  );
}
