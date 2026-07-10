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

type TagBadgeStyle = CSSProperties & {
  "--tag-color": string;
  "--tag-color-dark": string;
  "--tag-border": string;
  "--tag-border-dark": string;
  "--tag-bg": string;
  "--tag-bg-dark": string;
  "--tag-bg-hover": string;
  "--tag-bg-hover-dark": string;
  "--tag-shadow": string;
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

function mixRgb(
  color: { r: number; g: number; b: number },
  target: { r: number; g: number; b: number },
  amount: number,
) {
  return {
    r: Math.round(color.r + (target.r - color.r) * amount),
    g: Math.round(color.g + (target.g - color.g) * amount),
    b: Math.round(color.b + (target.b - color.b) * amount),
  };
}

function rgbToCss({ r, g, b }: { r: number; g: number; b: number }) {
  return `rgb(${r}, ${g}, ${b})`;
}

function getTagBadgeStyle(
  colorHex: string,
  active: boolean,
): TagBadgeStyle {
  const normalized = normalizeTagColorHex(colorHex);
  const rgb = hexToRgb(normalized);

  const darkText = mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.32);

  return {
    "--tag-color": normalized,
    "--tag-color-dark": rgbToCss(darkText),

    "--tag-border": active
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.48)`
      : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.24)`,

    "--tag-border-dark": active
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.58)`
      : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.34)`,

    "--tag-bg": active
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.14)`
      : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.055)`,

    "--tag-bg-dark": active
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
      : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,

    "--tag-bg-hover": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
      active ? 0.18 : 0.1
    })`,

    "--tag-bg-hover-dark": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${
      active ? 0.25 : 0.16
    })`,

    "--tag-shadow": `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`,
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
    [background-color:var(--tag-bg)]
    [border-color:var(--tag-border)]
    [color:var(--tag-color)]
    transition-[background-color,border-color,color,box-shadow]
    duration-200
    ease-out
    hover:[background-color:var(--tag-bg-hover)]
    hover:[border-color:var(--tag-color)]
    hover:[box-shadow:0_4px_12px_var(--tag-shadow)]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[var(--tag-color)]
    focus-visible:ring-offset-2
    dark:[background-color:var(--tag-bg-dark)]
    dark:[border-color:var(--tag-border-dark)]
    dark:[color:var(--tag-color-dark)]
    dark:hover:[background-color:var(--tag-bg-hover-dark)]
    dark:hover:[border-color:var(--tag-color-dark)]
    dark:focus-visible:ring-offset-slate-950
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