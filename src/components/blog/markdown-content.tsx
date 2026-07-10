import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from "react";
import { ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { MarkdownCodeBlock } from "@/components/blog/markdown-code-block";

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown>;

type MarkdownImageProps = ComponentProps<"img"> & {
  node?: unknown;
};

export type MarkdownContentProps = {
  content: string;
  rehypePlugins?: ReactMarkdownProps["rehypePlugins"];
};

export const baseRemarkPlugins: NonNullable<
  ReactMarkdownProps["remarkPlugins"]
> = [remarkGfm];

export const baseRehypePlugins: NonNullable<
  ReactMarkdownProps["rehypePlugins"]
> = [
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

    return allowedProtocols.has(url.protocol) ? value : "";
  } catch {
    return "";
  }
}

function MarkdownImage({
  node: _node,
  className,
  alt,
  ...props
}: MarkdownImageProps) {
  return (
    <img
      {...props}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      className={[
        "mx-auto h-auto max-w-full rounded-2xl",
        "border border-border bg-card object-contain",
        "shadow-lg shadow-slate-950/5 dark:shadow-black/25",
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
        <span>{children as ReactNode}</span>

        {external ? (
          <ExternalLink
            className="ml-1 inline-block size-[0.8em] shrink-0 align-baseline"
            aria-hidden="true"
          />
        ) : null}
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
      isValidElement<{ alt?: string }>(onlyChild) &&
      onlyChild.type === MarkdownImage;

    if (isStandaloneImage) {
      const caption = onlyChild.props.alt?.trim();

      return (
        <figure className="not-prose my-12">
          {onlyChild}

          {caption ? (
            <figcaption className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-muted-foreground">
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
          "not-prose my-10",
          "[&>figcaption]:rounded-t-xl",
          "[&>figcaption]:border",
          "[&>figcaption]:border-b-0",
          "[&>figcaption]:border-slate-800",
          "[&>figcaption]:bg-slate-900",
          "[&>figcaption]:px-4",
          "[&>figcaption]:py-2.5",
          "[&>figcaption]:font-mono",
          "[&>figcaption]:text-xs",
          "[&>figcaption]:font-semibold",
          "[&>figcaption]:text-slate-300",
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
      <div className="not-prose my-10 max-w-full overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table
          {...props}
          className="w-full min-w-[42rem] border-collapse text-left text-sm"
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
        className="divide-y divide-border"
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
        className="transition-colors even:bg-muted/25 hover:bg-blue-50/50 dark:hover:bg-blue-950/15"
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
        className="whitespace-nowrap px-4 py-3 font-bold text-foreground"
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
        className="px-4 py-3 align-top leading-6 text-muted-foreground"
      >
        {children}
      </td>
    );
  },

  hr() {
    return (
      <div
        className="not-prose my-16 flex items-center gap-3 sm:my-20"
        role="separator"
      >
        <span className="h-px flex-1 bg-border" />
        <span className="size-1.5 rounded-full bg-blue-500/60" />
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  },
};

export const markdownContentClassName = `
  prose
  prose-slate
  max-w-none

  text-[1.04rem]
  leading-[1.82]
  sm:text-[1.075rem]
  sm:leading-[1.88]

  dark:prose-invert

  [&>*:first-child]:mt-0
  [&>*:last-child]:mb-0

  prose-headings:scroll-mt-28
  prose-headings:font-bold
  prose-headings:tracking-[-0.03em]
  prose-headings:text-foreground

  prose-h1:mb-8
  prose-h1:mt-0
  prose-h1:text-3xl
  prose-h1:leading-[1.15]
  sm:prose-h1:text-4xl
  lg:prose-h1:text-[2.75rem]

  prose-h2:mb-5
  prose-h2:mt-16
  prose-h2:text-2xl
  prose-h2:leading-[1.2]
  sm:prose-h2:mt-20
  sm:prose-h2:text-3xl

  prose-h3:mb-4
  prose-h3:mt-12
  prose-h3:text-xl
  prose-h3:leading-[1.3]
  sm:prose-h3:mt-14
  sm:prose-h3:text-2xl

  prose-h4:mb-3
  prose-h4:mt-10
  prose-h4:text-lg
  prose-h4:leading-snug
  sm:prose-h4:text-xl

  [&_h2+*]:mt-0
  [&_h3+*]:mt-0
  [&_h4+*]:mt-0

  prose-p:my-7
  prose-p:max-w-none
  prose-p:leading-[1.82]
  prose-p:text-muted-foreground
  sm:prose-p:leading-[1.88]

  prose-ul:my-8
  prose-ul:pl-7

  prose-ol:my-8
  prose-ol:pl-7

  prose-li:my-2.5
  prose-li:pl-1
  prose-li:leading-[1.75]
  prose-li:text-muted-foreground

  prose-li:marker:font-bold
  prose-li:marker:text-blue-500

  [&_li>p]:my-2
  [&_li>ul]:my-3
  [&_li>ol]:my-3
  [&_ul_ul]:my-3
  [&_ol_ol]:my-3
  [&_ul_ol]:my-3
  [&_ol_ul]:my-3

  [&_.contains-task-list]:list-none
  [&_.contains-task-list]:pl-0
  [&_.task-list-item]:list-none
  [&_.task-list-item]:pl-0

  [&_input[type='checkbox']]:mr-2.5
  [&_input[type='checkbox']]:size-4
  [&_input[type='checkbox']]:translate-y-0.5
  [&_input[type='checkbox']]:accent-blue-600

  prose-strong:font-bold
  prose-strong:text-foreground

  prose-em:text-foreground

  prose-del:text-muted-foreground
  prose-del:decoration-red-400/70

  prose-blockquote:my-10
  prose-blockquote:rounded-r-2xl
  prose-blockquote:border-l-4
  prose-blockquote:border-blue-500
  prose-blockquote:bg-blue-50/70
  prose-blockquote:px-6
  prose-blockquote:py-5
  prose-blockquote:not-italic
  prose-blockquote:text-slate-700
  prose-blockquote:shadow-sm

  [&_blockquote>p]:my-0
  [&_blockquote>p]:text-inherit
  [&_blockquote>p+p]:mt-4

  dark:prose-blockquote:bg-blue-950/25
  dark:prose-blockquote:text-slate-300

  prose-a:inline
  prose-a:font-semibold
  prose-a:text-blue-600
  prose-a:underline
  prose-a:decoration-blue-500/30
  prose-a:decoration-2
  prose-a:underline-offset-4
  prose-a:transition-colors

  hover:prose-a:text-blue-500
  hover:prose-a:decoration-blue-500

  focus-visible:prose-a:rounded-sm
  focus-visible:prose-a:outline-2
  focus-visible:prose-a:outline-offset-4
  focus-visible:prose-a:outline-blue-500

  [&_.heading-anchor]:ml-2
  [&_.heading-anchor]:inline-flex
  [&_.heading-anchor]:align-middle
  [&_.heading-anchor]:font-normal
  [&_.heading-anchor]:text-blue-500/0
  [&_.heading-anchor]:no-underline
  [&_.heading-anchor]:transition-colors

  hover:[&_.heading-anchor]:text-blue-500/65
  focus-visible:[&_.heading-anchor]:text-blue-500

  prose-code:rounded-md
  prose-code:bg-slate-100
  prose-code:px-1.5
  prose-code:py-0.5
  prose-code:font-mono
  prose-code:text-[0.88em]
  prose-code:font-semibold
  prose-code:text-pink-600

  before:prose-code:content-none
  after:prose-code:content-none

  dark:prose-code:bg-slate-800
  dark:prose-code:text-pink-400

  [&_[data-rehype-pretty-code-figure]]:my-10
  [&_[data-rehype-pretty-code-figure]>div]:rounded-t-none
  [&_[data-rehype-pretty-code-figure]>div]:border-t-0
`;

export function MarkdownContent({
  content,
  rehypePlugins = baseRehypePlugins,
}: MarkdownContentProps) {
  return (
    <article className={markdownContentClassName}>
      <ReactMarkdown
        remarkPlugins={baseRemarkPlugins}
        rehypePlugins={rehypePlugins}
        urlTransform={safeUrlTransform}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}