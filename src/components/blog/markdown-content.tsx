import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-blue-700 prose-pre:rounded-lg prose-pre:border prose-pre:border-slate-800 prose-pre:bg-slate-950">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
