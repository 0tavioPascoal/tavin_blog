const WORDS_PER_MINUTE = 180;

export function calculateReadingTimeMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
}
