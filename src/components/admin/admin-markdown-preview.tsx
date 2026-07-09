"use client";

import { MarkdownHooks } from "react-markdown";
import rehypePrettyCode, {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import {
  baseRehypePlugins,
  markdownComponents,
  markdownContentClassName,
  safeUrlTransform,
  type MarkdownContentProps,
} from "@/components/blog/markdown-content";

const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
};

const highlightedRehypePlugins: MarkdownContentProps["rehypePlugins"] = [
  ...(baseRehypePlugins ?? []),
  [rehypePrettyCode, prettyCodeOptions],
];

export function AdminMarkdownPreview({ content }: MarkdownContentProps) {
  return (
    <article className={markdownContentClassName}>
      <MarkdownHooks
        fallback={
          <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm text-muted-foreground dark:border-slate-800 dark:bg-slate-900/30 sm:min-h-104">
            Renderizando preview...
          </div>
        }
        remarkPlugins={[remarkGfm]}
        rehypePlugins={highlightedRehypePlugins}
        urlTransform={safeUrlTransform}
        components={markdownComponents}
      >
        {content}
      </MarkdownHooks>
    </article>
  );
}