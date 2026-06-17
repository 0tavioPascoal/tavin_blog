import type { CSSProperties } from "react";
import Link from "next/link";

import { normalizeTagColorHex } from "@/features/tags/utils/colors";

type TagBadgeProps = {
  name: string;
  colorHex: string;
  href?: string;
  active?: boolean;
  className?: string;
};

function hexToRgb(colorHex: string): { r: number; g: number; b: number } {
  const normalized = normalizeTagColorHex(colorHex).slice(1);
  const value = Number.parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function getTagBadgeStyle(colorHex: string, active: boolean): CSSProperties {
  const normalized = normalizeTagColorHex(colorHex);
  const { r, g, b } = hexToRgb(normalized);

  return {
    borderColor: active
      ? normalized
      : `rgba(${r}, ${g}, ${b}, 0.35)`,
    backgroundColor: active
      ? `rgba(${r}, ${g}, ${b}, 0.18)`
      : `rgba(${r}, ${g}, ${b}, 0.08)`,
    color: normalized,
    boxShadow: active
      ? `inset 0 0 0 1px ${normalized}, 0 8px 18px rgba(${r}, ${g}, ${b}, 0.14)`
      : undefined,
  };
}

export function TagBadge({
  name,
  colorHex,
  href,
  active = false,
  className = "",
}: TagBadgeProps) {
  const style = getTagBadgeStyle(colorHex, active);

  const baseClassName = `
    inline-flex
    w-fit
    items-center
    justify-center
    rounded-full
    border
    px-2.5
    py-1
    text-xs
    font-semibold
    uppercase
    tracking-wide
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-sm
    ${className}
  `;

  if (href) {
    return (
      <Link
        href={href}
        className={baseClassName}
        style={style}
        aria-current={active ? "page" : undefined}
      >
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
