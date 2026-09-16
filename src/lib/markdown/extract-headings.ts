import GithubSlugger from "github-slugger";

export type ArticleHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/**
 * Remove formatações Markdown inline para obter texto puro para o slug e título visual do TOC.
 */
function stripMarkdownFormatting(rawText: string): string {
  return rawText
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // ![alt](url) -> alt
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replace(/`([^`]+)`/g, "$1") // `code` -> code
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // **bold** or __bold__ -> bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // *italic* or _italic_ -> italic
    .replace(/~~(.*?)~~/g, "$1") // ~~strikethrough~~ -> strikethrough
    .replace(/<[^>]+>/g, "") // <tags> -> ""
    .trim();
}

/**
 * Extrai headings (H2 e H3) de um documento Markdown e gera slugs compatíveis
 * com a implementação de rehype-slug (utilizando github-slugger).
 */
export function extractHeadings(markdown: string): ArticleHeading[] {
  if (!markdown || typeof markdown !== "string") {
    return [];
  }

  const lines = markdown.split("\n");
  const slugger = new GithubSlugger();
  const parsedHeadings: Array<{ id: string; text: string; originalLevel: number }> = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmedLine = line.trimStart();

    // Detecta abertura e fechamento de blocos de código
    if (trimmedLine.startsWith("```") || trimmedLine.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    // Identifica linhas de heading Markdown (# até ######)
    const match = trimmedLine.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?$/);
    if (!match) {
      continue;
    }

    const level = match[1].length;
    const rawHeadingText = match[2];
    const plainText = stripMarkdownFormatting(rawHeadingText);

    if (!plainText) {
      continue;
    }

    // Registra todos os headings no slugger para garantir a contagem de duplicados idêntica ao rehype-slug
    const id = slugger.slug(plainText);

    parsedHeadings.push({ id, text: plainText, originalLevel: level });
  }

  const firstHeading = parsedHeadings[0];
  if (!firstHeading) return [];

  const depthOffset = 2 - firstHeading.originalLevel;
  let previousLevel = 2;

  return parsedHeadings.flatMap((heading, index) => {
    const shiftedLevel = Math.min(
      6,
      Math.max(2, heading.originalLevel + depthOffset),
    );
    const normalizedLevel = index === 0
      ? 2
      : Math.min(shiftedLevel, previousLevel + 1);

    previousLevel = normalizedLevel;

    return normalizedLevel === 2 || normalizedLevel === 3
      ? [{ id: heading.id, text: heading.text, level: normalizedLevel }]
      : [];
  });
}
