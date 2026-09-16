/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element -- `node` must not reach DOM elements and remote Markdown images intentionally bypass the Next.js proxy. */
import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { MarkdownCodeBlock } from "@/components/blog/markdown-code-block";

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown>;

type MarkdownImageProps = ComponentProps<"img"> & {
  node?: unknown;
};

type MarkdownAstNode = {
  type: string;
  tagName?: string;
  children?: MarkdownAstNode[];
};

export type MarkdownContentProps = {
  content: string;
  articleTitle?: string;
  rehypePlugins?: ReactMarkdownProps["rehypePlugins"];
};

function normalizeComparableHeading(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

export function removeDuplicateLeadingTitle(content: string, articleTitle?: string) {
  if (!articleTitle) return content;

  const leadingH1 = /^(?:\uFEFF)?(?:[ \t]*\r?\n)*[ \t]*#[ \t]+(.+?)(?:[ \t]+#+)?[ \t]*(?:\r?\n|$)/;
  const atxMatch = content.match(leadingH1);
  if (atxMatch && normalizeComparableHeading(atxMatch[1]) === normalizeComparableHeading(articleTitle)) {
    return content.slice(atxMatch[0].length).replace(/^(?:[ \t]*\r?\n)+/, "");
  }

  const leadingSetextH1 = /^(?:\uFEFF)?(?:[ \t]*\r?\n)*([^\r\n]+)\r?\n[ \t]*=+[ \t]*(?:\r?\n|$)/;
  const setextMatch = content.match(leadingSetextH1);
  if (setextMatch && normalizeComparableHeading(setextMatch[1]) === normalizeComparableHeading(articleTitle)) {
    return content.slice(setextMatch[0].length).replace(/^(?:[ \t]*\r?\n)+/, "");
  }

  return content;
}

export const baseRemarkPlugins: NonNullable<
  ReactMarkdownProps["remarkPlugins"]
> = [remarkGfm];

function rehypeNormalizeArticleHeadings() {
  return (tree: MarkdownAstNode) => {
    const headings: MarkdownAstNode[] = [];

    function collectHeadings(node: MarkdownAstNode) {
      if (
        node.type === "element" &&
        typeof node.tagName === "string" &&
        /^h[1-6]$/.test(node.tagName)
      ) {
        headings.push(node);
      }

      node.children?.forEach(collectHeadings);
    }

    collectHeadings(tree);

    const firstHeading = headings[0];

    if (!firstHeading?.tagName) {
      return;
    }

    const firstDepth = Number(firstHeading.tagName.slice(1));
    const depthOffset = 2 - firstDepth;
    let previousDepth = 2;

    headings.forEach((heading, index) => {
      const originalDepth = Number(heading.tagName?.slice(1));
      const shiftedDepth = Math.min(
        6,
        Math.max(2, originalDepth + depthOffset),
      );
      const normalizedDepth =
        index === 0
          ? 2
          : Math.min(shiftedDepth, previousDepth + 1);

      heading.tagName = "h" + normalizedDepth;
      previousDepth = normalizedDepth;
    });
  };
}

export const baseRehypePlugins: NonNullable<
  ReactMarkdownProps["rehypePlugins"]
> = [
  rehypeNormalizeArticleHeadings,
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

export function safeUrlTransform(value: string): string | undefined {
  const trimmedValue = value.trim();

  if (
    trimmedValue.startsWith("#") ||
    (trimmedValue.startsWith("/") &&
      !trimmedValue.startsWith("//")) ||
    trimmedValue.startsWith("./") ||
    trimmedValue.startsWith("../")
  ) {
    return value;
  }

  try {
    const url = new URL(trimmedValue);
    const allowedProtocols = new Set([
      "http:",
      "https:",
      "mailto:",
      "tel:",
    ]);

    return allowedProtocols.has(url.protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

function hasRenderableImageSource(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function MarkdownImage({
  node: _node,
  className,
  alt,
  src,
  ...props
}: MarkdownImageProps) {
  if (!hasRenderableImageSource(src)) {
    return null;
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      className={[
        "mx-auto h-auto max-w-full rounded-lg",
        "object-contain",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export const markdownComponents: ReactMarkdownProps["components"] = {
  a({
    href,
    children,
    node: _node,
    ...props
  }) {
    const external = isExternalUrl(href);

    return (
      <a
        {...props}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children as ReactNode}
      </a>
    );
  },

  p({
    children,
    node: _node,
    ...props
  }) {
    const childItems = Children.toArray(children);
    const onlyChild = childItems[0];

    const isStandaloneImage =
      childItems.length === 1 &&
      isValidElement<{ alt?: string; src?: string }>(onlyChild) &&
      onlyChild.type === MarkdownImage;

    if (isStandaloneImage) {
      if (!hasRenderableImageSource(onlyChild.props.src)) {
        return null;
      }

      const caption = onlyChild.props.alt?.trim();

      return (
        <figure className="not-prose my-8 sm:my-10">
          {onlyChild}

          {caption ? (
            <figcaption className="mx-auto mt-3 max-w-2xl text-center [font-family:var(--font-article-serif)] text-sm leading-6 text-muted-foreground">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }

    return <p {...props}>{children}</p>;
  },

  img: MarkdownImage,

  pre({
    children,
    node: _node,
    ...props
  }) {
    return (
      <MarkdownCodeBlock {...props}>
        {children}
      </MarkdownCodeBlock>
    );
  },

  figure({
    children,
    node: _node,
    className,
    ...props
  }) {
    return (
      <figure
        {...props}
        className={[
          "not-prose my-8 sm:my-10",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </figure>
    );
  },

  table({
    children,
    node: _node,
    ...props
  }) {
    return (
      <div className="not-prose my-8 max-w-full overflow-x-auto rounded-lg border border-border bg-background">
        <table
          {...props}
          className="w-full min-w-140 border-collapse text-left [font-family:var(--font-article-sans)] text-[0.9em] leading-[1.55]"
        >
          {children}
        </table>
      </div>
    );
  },

  thead({
    children,
    node: _node,
    ...props
  }) {
    return (
      <thead
        {...props}
        className="border-b border-border bg-muted/70"
      >
        {children}
      </thead>
    );
  },

  tbody({
    children,
    node: _node,
    ...props
  }) {
    return (
      <tbody
        {...props}
        className="divide-y divide-border/60"
      >
        {children}
      </tbody>
    );
  },

  tr({
    children,
    node: _node,
    ...props
  }) {
    return (
      <tr
        {...props}
        className="even:bg-muted/15"
      >
        {children}
      </tr>
    );
  },

  th({
    children,
    node: _node,
    ...props
  }) {
    return (
      <th
        {...props}
        className="whitespace-nowrap px-4 py-3 font-semibold text-foreground"
      >
        {children}
      </th>
    );
  },

  td({
    children,
    node: _node,
    ...props
  }) {
    return (
      <td
        {...props}
        className="px-4 py-3 align-top leading-6 text-foreground/90"
      >
        {children}
      </td>
    );
  },

  hr({
    node: _node,
    ...props
  }) {
    return (
      <hr
        {...props}
        className="not-prose my-10 border-0 border-t border-border sm:my-12"
      />
    );
  },
};

export const markdownContentClassName = `
  article-content
  prose
  prose-slate
  [font-family:var(--font-article-serif)]
  mx-auto
  w-full
  max-w-[47.5rem]
  [text-rendering:optimizeLegibility]
  [font-kerning:normal]

  text-[1.0625rem]
  leading-[1.78]

  dark:prose-invert

  [&>*:first-child]:mt-0
  [&>*:last-child]:mb-0

  prose-headings:[font-family:var(--font-article-sans)]
  prose-headings:scroll-mt-28
  prose-headings:font-bold
  prose-headings:tracking-[-0.012em]
  prose-headings:text-foreground

  prose-h1:mb-7
  prose-h1:mt-0
  prose-h1:text-3xl
  prose-h1:leading-[1.15]
  sm:prose-h1:text-4xl

  prose-h2:mb-4
  prose-h2:mt-10
  prose-h2:text-[1.625rem]
  prose-h2:leading-[1.2]
  sm:prose-h2:text-[1.75rem]

  prose-h3:mb-3
  prose-h3:mt-8
  prose-h3:text-[1.3125rem]
  prose-h3:leading-[1.25]
  sm:prose-h3:text-[1.4375rem]

  prose-h4:mb-2
  prose-h4:mt-7
  prose-h4:text-[1.1rem]
  prose-h4:leading-[1.15]

  prose-h5:mb-2
  prose-h5:mt-6
  prose-h5:text-base
  prose-h5:leading-snug

  prose-h6:mb-2
  prose-h6:mt-5
  prose-h6:text-sm
  prose-h6:leading-snug
  prose-h6:uppercase
  prose-h6:tracking-wide

  [&_hr+h2]:mt-0
  [&_hr+h3]:mt-0

  [&_h2+*]:mt-0
  [&_h3+*]:mt-0
  [&_h4+*]:mt-0
  [&_h5+*]:mt-0
  [&_h6+*]:mt-0

  prose-p:my-4
  prose-p:max-w-none
  prose-p:leading-[1.78]
  prose-p:text-foreground/95
  [&_p]:[text-wrap:pretty]

  prose-ul:my-5
  prose-ul:list-disc
  prose-ul:pl-6
  sm:prose-ul:pl-7

  prose-ol:my-5
  prose-ol:list-decimal
  prose-ol:pl-6
  sm:prose-ol:pl-7

  prose-li:my-1.5
  prose-li:pl-1
  prose-li:leading-[1.72]
  prose-li:text-foreground/95
  [&_li]:[text-wrap:pretty]

  prose-li:marker:font-semibold
  prose-li:marker:text-foreground/60

  [&_li>p]:my-2
  [&_li>ul]:my-2
  [&_li>ol]:my-2
  [&_ul_ul]:my-2
  [&_ol_ol]:my-2
  [&_ul_ol]:my-2
  [&_ol_ul]:my-2

  [&_.contains-task-list]:list-none
  [&_.contains-task-list]:pl-0
  [&_.task-list-item]:list-none
  [&_.task-list-item]:pl-0

  [&_input[type='checkbox']]:mr-2
  [&_input[type='checkbox']]:size-4
  [&_input[type='checkbox']]:translate-y-0.5
  [&_input[type='checkbox']]:accent-primary

  prose-strong:font-semibold
  prose-strong:text-foreground

  prose-em:italic
  prose-em:text-foreground

  prose-del:text-muted-foreground
  prose-del:decoration-red-400/70

  prose-blockquote:my-8
  prose-blockquote:border-l-[3px]
  prose-blockquote:border-primary
  prose-blockquote:bg-transparent
  prose-blockquote:py-0
  prose-blockquote:pl-5
  prose-blockquote:pr-0
  prose-blockquote:not-italic
  prose-blockquote:text-foreground/95

  [&_blockquote_p]:my-2
  [&_blockquote_p:first-child]:mt-0
  [&_blockquote_p:last-child]:mb-0

  prose-a:font-medium
  prose-a:text-primary
  prose-a:underline
  prose-a:underline-offset-[0.15em]
  prose-a:decoration-from-font
  [&_a]:[text-decoration-skip-ink:auto]
  prose-a:transition-colors
  hover:prose-a:text-primary/80

  focus-visible:prose-a:rounded-sm
  focus-visible:prose-a:outline-2
  focus-visible:prose-a:outline-offset-3
  focus-visible:prose-a:outline-primary

  [&_.heading-anchor]:ml-2.5
  [&_.heading-anchor]:inline-flex
  [&_.heading-anchor]:align-middle
  [&_.heading-anchor]:font-normal
  [&_.heading-anchor]:text-primary
  [&_.heading-anchor]:opacity-0
  [&_.heading-anchor]:no-underline
  [&_.heading-anchor]:transition-all

  focus-visible:[&_.heading-anchor]:opacity-100
  focus-visible:[&_.heading-anchor]:text-primary
  focus-visible:[&_.heading-anchor]:outline-none
  focus-visible:[&_.heading-anchor]:ring-2
  focus-visible:[&_.heading-anchor]:ring-primary
  focus-visible:[&_.heading-anchor]:ring-offset-2

  prose-code:rounded-md
  prose-code:bg-muted/75
  prose-code:px-[0.35em]
  prose-code:py-[0.15em]
  prose-code:font-mono
  prose-code:text-[0.85em]
  prose-code:font-normal
  prose-code:text-foreground

  before:prose-code:content-none
  after:prose-code:content-none

  [&_[data-rehype-pretty-code-figure]]:my-8

  prose-figcaption:text-sm
  prose-figcaption:leading-6
  prose-figcaption:text-muted-foreground
`;

export function MarkdownContent({
  content,
  articleTitle,
  rehypePlugins = baseRehypePlugins,
}: MarkdownContentProps) {
  const renderedContent = removeDuplicateLeadingTitle(content, articleTitle);

  return (
    <article className={markdownContentClassName}>
      <ReactMarkdown
        remarkPlugins={baseRemarkPlugins}
        rehypePlugins={rehypePlugins}
        urlTransform={safeUrlTransform}
        components={markdownComponents}
      >
        {renderedContent}
      </ReactMarkdown>
    </article>
  );
}
