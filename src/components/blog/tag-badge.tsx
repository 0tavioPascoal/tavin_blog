import type { CSSProperties } from "react";
import Link from "next/link";

import { defaultTagColorHex, tagColorHexSchema } from "@/features/tags/schemas/tag-schema";

type TagBadgeProps = {
  name: string;
  colorHex: string;
  href?: string;
  active?: boolean;
  className?: string;
};

function normalizeColorHex(colorHex: string): string {
  const parsed = tagColorHexSchema.safeParse(colorHex);
  return parsed.success ? parsed.data : defaultTagColorHex;
}

function hexToRgb(colorHex: string): { r: number; g: number; b: number } {
  const normalized = normalizeColorHex(colorHex).slice(1);
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function getTagBadgeStyle(colorHex: string, active: boolean): CSSProperties {
  const normalized = normalizeColorHex(colorHex);
  const { r, g, b } = hexToRgb(normalized);
  const backgroundAlpha = active ? 0.18 : 0.1;

  return {
    borderColor: active ? normalized : `rgba(${r}, ${g}, ${b}, 0.35)`,
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${backgroundAlpha})`,
    color: normalized,
    boxShadow: active ? `inset 0 0 0 1px ${normalized}, 0 8px 18px rgba(${r}, ${g}, ${b}, 0.16)` : undefined,
  };
}

export function TagBadge({ name, colorHex, href, active = false, className = "" }: TagBadgeProps) {
  const baseClassName = `inline-flex w-fit items-center justify-center rounded-md border px-2 py-1 text-xs font-semibold uppercase transition ${className}`;
  const style = getTagBadgeStyle(colorHex, active);

  if (href) {
    return (
      <Link href={href} className={baseClassName} style={style} aria-current={active ? "page" : undefined}>
        {name}
      </Link>
    );
  }

  return (
    <span className={baseClassName} style={style}>
      {name}
    </span>
  );
}
