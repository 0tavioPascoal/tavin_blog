import { MarkdownAsync } from "react-markdown";
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

export async function HighlightedMarkdownContent({
  content,
}: MarkdownContentProps) {
  return (
    <article className={markdownContentClassName}>
      <MarkdownAsync
        remarkPlugins={[remarkGfm]}
        rehypePlugins={highlightedRehypePlugins}
        urlTransform={safeUrlTransform}
        components={markdownComponents}
      >
        {content}
      </MarkdownAsync>
    </article>
  );
}
