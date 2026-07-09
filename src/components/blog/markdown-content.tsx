import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { ComponentProps, ReactNode } from "react";

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown>;

export type MarkdownContentProps = {
  content: string;
  rehypePlugins?: ReactMarkdownProps["rehypePlugins"];
};

export const baseRehypePlugins: ReactMarkdownProps["rehypePlugins"] = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "append",
      content: {
        type: "text",
        value: "#",
      },
      properties: {
        ariaLabel: "Link direto para esta seção",
        className: ["heading-anchor"],
      },
    },
  ],
];

function isExternalUrl(value?: string) {
  return value ? /^https?:\/\//i.test(value) : false;
}

export function safeUrlTransform(value: string) {
  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("#") ||
    trimmedValue.startsWith("/") && !trimmedValue.startsWith("//") ||
    trimmedValue.startsWith("./") ||
    trimmedValue.startsWith("../")
  ) {
    return value;
  }

  try {
    const url = new URL(trimmedValue);
    const allowedProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

    return allowedProtocols.has(url.protocol) ? value : "";
  } catch {
    return "";
  }
}

export const markdownComponents: ReactMarkdownProps["components"] = {
  a({ href, children, ...props }) {
    return (
      <a
        {...props}
        href={href}
        target={isExternalUrl(href) ? "_blank" : undefined}
        rel={isExternalUrl(href) ? "noopener noreferrer" : undefined}
      >
        {children as ReactNode}
      </a>
    );
  },
};

export const markdownContentClassName = `
        prose
        prose-slate
        max-w-none

        dark:prose-invert

        prose-headings:font-bold
        prose-headings:scroll-mt-24
        prose-headings:text-foreground

        prose-h2:mt-12
        prose-h2:border-b
        prose-h2:border-border
        prose-h2:pb-3
        prose-h2:text-2xl
        sm:prose-h2:text-3xl

        prose-h3:mt-10
        prose-h3:text-xl
        sm:prose-h3:text-2xl

        prose-p:text-muted-foreground
        prose-p:leading-7
        sm:prose-p:leading-8

        prose-li:text-muted-foreground
        prose-li:leading-7
        sm:prose-li:leading-8

        prose-strong:text-foreground

        prose-blockquote:border-l-4
        prose-blockquote:border-blue-500
        prose-blockquote:bg-blue-50/50
        prose-blockquote:px-5
        prose-blockquote:py-2
        prose-blockquote:italic

        dark:prose-blockquote:bg-blue-950/20

        prose-a:text-blue-600
        prose-a:font-semibold
        prose-a:underline
        prose-a:decoration-blue-500/30
        prose-a:underline-offset-4
        hover:prose-a:text-blue-500
        hover:prose-a:decoration-blue-500

        [&_.heading-anchor]:ml-2
        [&_.heading-anchor]:text-blue-500/0
        [&_.heading-anchor]:no-underline
        [&_.heading-anchor]:transition-colors
        hover:[&_.heading-anchor]:text-blue-500/70

        prose-img:rounded-2xl
        prose-img:border
        prose-img:border-border
        prose-img:shadow-sm
        prose-img:max-w-full

        prose-code:rounded-md
        prose-code:bg-slate-100
        prose-code:px-1.5
        prose-code:py-0.5
        prose-code:text-[0.9em]
        prose-code:text-pink-600

        dark:prose-code:bg-slate-800
        dark:prose-code:text-pink-400

        prose-pre:rounded-2xl
        prose-pre:border
        prose-pre:border-slate-200
        prose-pre:bg-slate-50
        prose-pre:text-slate-900
        prose-pre:shadow-sm
        prose-pre:max-w-full
        prose-pre:overflow-x-auto

        dark:prose-pre:border-slate-800
        dark:prose-pre:bg-slate-950
        dark:prose-pre:text-slate-100
        dark:prose-pre:shadow-xl

        prose-table:border
        prose-table:border-border
        prose-table:block
        prose-table:max-w-full
        prose-table:overflow-x-auto
        prose-table:whitespace-nowrap

        prose-th:border-border
        prose-td:border-border
      `;

export function MarkdownContent({
  content,
  rehypePlugins = baseRehypePlugins,
}: MarkdownContentProps) {
  return (
    <article
      className={markdownContentClassName}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        urlTransform={safeUrlTransform}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

