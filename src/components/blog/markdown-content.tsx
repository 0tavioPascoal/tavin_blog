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
        "mx-auto h-auto max-w-full rounded-lg",
        "border border-border bg-card object-contain",
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
      isValidElement<{ alt?: string }>(onlyChild) &&
      onlyChild.type === MarkdownImage;

    if (isStandaloneImage) {
      const caption = onlyChild.props.alt?.trim();

      return (
        <figure className="not-prose my-8 sm:my-10">
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
          "not-prose my-7 sm:my-8",
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
      <div className="not-prose my-8 max-w-full overflow-x-auto rounded-lg border border-border bg-card">
        <table
          {...props}
          className="w-full min-w-160 border-collapse text-left text-sm"
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
        className="even:bg-muted/20"
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
        className="px-4 py-3 align-top leading-6 text-foreground/80"
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
  prose
  prose-slate
  mx-auto
  w-full
  max-w-[48rem]

  text-[1.0625rem]
  leading-[1.75]

  sm:text-lg
  sm:leading-[1.8]

  dark:prose-invert

  [&>*:first-child]:mt-0
  [&>*:last-child]:mb-0

  prose-headings:scroll-mt-28
  prose-headings:font-bold
  prose-headings:tracking-[-0.025em]
  prose-headings:text-foreground

  prose-h1:mb-7
  prose-h1:mt-0
  prose-h1:text-3xl
  prose-h1:leading-[1.15]
  sm:prose-h1:text-4xl

  prose-h2:mb-4
  prose-h2:mt-10
  prose-h2:text-2xl
  prose-h2:leading-[1.25]
  sm:prose-h2:mt-12
  sm:prose-h2:text-[1.8rem]

  prose-h3:mb-3
  prose-h3:mt-8
  prose-h3:text-xl
  prose-h3:leading-[1.3]
  sm:prose-h3:mt-10
  sm:prose-h3:text-2xl

  prose-h4:mb-3
  prose-h4:mt-7
  prose-h4:text-lg
  prose-h4:leading-snug

  [&_hr+h2]:mt-0
  [&_hr+h3]:mt-0

  [&_h2+*]:mt-0
  [&_h3+*]:mt-0
  [&_h4+*]:mt-0

  prose-p:my-5
  prose-p:max-w-none
  prose-p:leading-[1.75]
  prose-p:text-foreground/85
  sm:prose-p:leading-[1.8]

  prose-ul:my-6
  prose-ul:pl-7

  prose-ol:my-6
  prose-ol:pl-7

  prose-li:my-1.5
  prose-li:pl-1
  prose-li:leading-[1.7]
  prose-li:text-foreground/85

  prose-li:marker:font-bold
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
  [&_input[type='checkbox']]:accent-blue-600

  prose-strong:font-bold
  prose-strong:text-foreground

  prose-em:text-foreground/90

  prose-del:text-muted-foreground
  prose-del:decoration-red-400/70

  prose-blockquote:my-7
  prose-blockquote:border-l-4
  prose-blockquote:border-slate-400
  prose-blockquote:py-1
  prose-blockquote:pl-5
  prose-blockquote:not-italic
  prose-blockquote:text-foreground/85

  dark:prose-blockquote:border-slate-600

  [&_blockquote>p]:my-0
  [&_blockquote>p]:text-inherit
  [&_blockquote>p+p]:mt-4

  prose-a:font-medium
  prose-a:text-blue-600
  prose-a:underline
  prose-a:decoration-blue-500/35
  prose-a:decoration-1
  prose-a:underline-offset-2
  prose-a:transition-colors

  hover:prose-a:text-blue-700
  hover:prose-a:decoration-blue-600

  dark:prose-a:text-blue-400
  dark:hover:prose-a:text-blue-300

  focus-visible:prose-a:rounded-sm
  focus-visible:prose-a:outline-2
  focus-visible:prose-a:outline-offset-3
  focus-visible:prose-a:outline-blue-500

  [&_.heading-anchor]:ml-2
  [&_.heading-anchor]:inline-flex
  [&_.heading-anchor]:align-middle
  [&_.heading-anchor]:font-normal
  [&_.heading-anchor]:text-blue-500/0
  [&_.heading-anchor]:no-underline
  [&_.heading-anchor]:transition-colors

  hover:[&_.heading-anchor]:text-blue-500/60
  focus-visible:[&_.heading-anchor]:text-blue-500

  prose-code:rounded
  prose-code:bg-slate-100
  prose-code:px-1.5
  prose-code:py-0.5
  prose-code:font-mono
  prose-code:text-[0.88em]
  prose-code:font-medium
  prose-code:text-slate-900

  before:prose-code:content-none
  after:prose-code:content-none

  dark:prose-code:bg-slate-800
  dark:prose-code:text-slate-100

  [&_[data-rehype-pretty-code-figure]]:my-7
  sm:[&_[data-rehype-pretty-code-figure]]:my-8

  prose-figcaption:text-sm
  prose-figcaption:leading-6
  prose-figcaption:text-muted-foreground
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