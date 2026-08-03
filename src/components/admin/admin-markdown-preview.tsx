import {
  MarkdownContent,
  type MarkdownContentProps,
} from "@/components/blog/markdown-content";

export function AdminMarkdownPreview({ content }: MarkdownContentProps) {
  return <MarkdownContent content={content} />;
}
