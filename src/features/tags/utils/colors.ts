export const defaultTagColorHex = "#2563EB";

const tagColorHexPattern = /^#[0-9A-Fa-f]{6}$/;

export function normalizeTagColorHex(colorHex: string): string {
  const normalized = colorHex.trim();
  return tagColorHexPattern.test(normalized)
    ? normalized.toUpperCase()
    : defaultTagColorHex;
}
