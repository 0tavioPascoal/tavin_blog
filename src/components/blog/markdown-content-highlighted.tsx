import "server-only";

import {
  MarkdownAsync,
  type Options as ReactMarkdownOptions,
} from "react-markdown";
import rehypePrettyCode, {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

import {
  baseRehypePlugins,
  markdownComponents,
  markdownContentClassName,
  removeDuplicateLeadingTitle,
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

const remarkPlugins: NonNullable<
  ReactMarkdownOptions["remarkPlugins"]
> = [remarkGfm];

const normalizedBaseRehypePlugins: NonNullable<
  ReactMarkdownOptions["rehypePlugins"]
> = baseRehypePlugins ?? [];

const highlightedRehypePlugins: NonNullable<
  ReactMarkdownOptions["rehypePlugins"]
> = [
  ...normalizedBaseRehypePlugins,
  [rehypePrettyCode, prettyCodeOptions],
];

export async function HighlightedMarkdownContent({
  content,
  articleTitle,
}: MarkdownContentProps) {
  const renderedContent = removeDuplicateLeadingTitle(content, articleTitle);

  return (
    <article className={markdownContentClassName}>
      <MarkdownAsync
        remarkPlugins={remarkPlugins}
        rehypePlugins={highlightedRehypePlugins}
        urlTransform={safeUrlTransform}
        components={markdownComponents}
      >
        {renderedContent}
      </MarkdownAsync>
    </article>
  );
}
