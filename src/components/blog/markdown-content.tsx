import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
};

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article
      className="
        prose
        prose-slate
        max-w-none

        dark:prose-invert

        prose-headings:font-bold
        prose-headings:text-foreground

        prose-h2:mt-12
        prose-h2:border-b
        prose-h2:border-border
        prose-h2:pb-3
        prose-h2:text-3xl

        prose-h3:mt-10
        prose-h3:text-2xl

        prose-p:text-muted-foreground
        prose-p:leading-8

        prose-li:text-muted-foreground
        prose-li:leading-8

        prose-strong:text-foreground

        prose-blockquote:border-l-4
        prose-blockquote:border-blue-500
        prose-blockquote:bg-blue-50/50
        prose-blockquote:px-5
        prose-blockquote:py-2
        prose-blockquote:italic

        dark:prose-blockquote:bg-blue-950/20

        prose-a:text-blue-600
        prose-a:no-underline
        hover:prose-a:text-blue-500

        prose-img:rounded-2xl
        prose-img:border
        prose-img:border-border
        prose-img:shadow-sm

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
        prose-pre:border-slate-800
        prose-pre:bg-slate-950
        prose-pre:shadow-xl

        prose-table:border
        prose-table:border-border

        prose-th:border-border
        prose-td:border-border
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}