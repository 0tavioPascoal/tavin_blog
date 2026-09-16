"use client";

import {
  Check,
  Copy,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type MarkdownCodeBlockProps = HTMLAttributes<HTMLPreElement> & {
  children?: ReactNode;
  "data-language"?: string;
};

type CopyState = "idle" | "copied" | "error";

const languageLabels: Record<string, string> = {
  bash: "Bash",
  c: "C",
  cpp: "C++",
  csharp: "C#",
  cs: "C#",
  css: "CSS",
  dockerfile: "Dockerfile",
  html: "HTML",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  jsx: "JSX",
  markdown: "Markdown",
  md: "Markdown",
  plaintext: "Texto",
  powershell: "PowerShell",
  ps1: "PowerShell",
  python: "Python",
  py: "Python",
  shell: "Shell",
  sql: "SQL",
  text: "Texto",
  ts: "TypeScript",
  tsx: "TSX",
  typescript: "TypeScript",
  xml: "XML",
  yaml: "YAML",
  yml: "YAML",
};

function getLanguageLabel(language?: string) {
  if (!language) {
    return "Texto";
  }

  const normalized = language.trim().toLowerCase();

  return languageLabels[normalized] ?? normalized.toUpperCase();
}

async function copyTextWithFallback(value: string) {
  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");

  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Não foi possível copiar o código.");
  }
}

export function MarkdownCodeBlock({
  children,
  className,
  ...props
}: MarkdownCodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const resetTimeoutRef = useRef<number | null>(null);
  const [copyState, setCopyState] =
    useState<CopyState>("idle");

  const language = getLanguageLabel(
    typeof props["data-language"] === "string"
      ? props["data-language"]
      : undefined,
  );

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current !== null) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  function scheduleStateReset() {
    if (resetTimeoutRef.current !== null) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setCopyState("idle");
      resetTimeoutRef.current = null;
    }, 2000);
  }

  async function copyCode() {
    const codeElement =
      preRef.current?.querySelector("code");

    const code =
      codeElement?.textContent ??
      preRef.current?.textContent ??
      "";

    if (!code.trim()) {
      return;
    }

    try {
      await copyTextWithFallback(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    scheduleStateReset();
  }

  const label =
    copyState === "copied"
      ? "Código copiado"
      : copyState === "error"
        ? "Não foi possível copiar"
        : "Copiar código";

  const buttonClassName = [
    "inline-flex h-8 items-center gap-1.5 rounded-md px-2",
    "text-xs font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    copyState === "copied"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : copyState === "error"
        ? "bg-red-500/10 text-red-700 dark:text-red-400"
        : "text-muted-foreground hover:bg-background/70 hover:text-foreground dark:hover:bg-white/5",
  ].join(" ");

  return (
    <div className="markdown-code-block not-prose my-8 overflow-hidden rounded-lg border border-border bg-muted/60 dark:bg-[#23211f]">
      <div className="markdown-code-toolbar flex h-9 items-center justify-between gap-4 border-b border-border/80 bg-muted/40 px-3 dark:bg-white/[0.025]">
        <span className="markdown-code-language truncate font-mono text-[11px] font-medium text-muted-foreground">
          {language}
        </span>

        <button
          type="button"
          className={buttonClassName}
          onClick={copyCode}
          aria-label={label}
          title={label}
        >
          {copyState === "copied" ? (
            <Check
              aria-hidden="true"
              className="size-3.5"
            />
          ) : copyState === "error" ? (
            <TriangleAlert
              aria-hidden="true"
              className="size-3.5"
            />
          ) : (
            <Copy
              aria-hidden="true"
              className="size-3.5"
            />
          )}

          <span>
            {copyState === "copied"
              ? "Copiado"
              : copyState === "error"
                ? "Erro"
                : "Copiar"}
          </span>
        </button>

        <span
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {copyState === "idle" ? "" : label}
        </span>
      </div>

      <pre
        {...props}
        ref={preRef}
        className={[
          "m-0 max-w-full overflow-x-auto bg-transparent px-4 py-4",
          "font-mono text-[0.9em] leading-[1.65] text-foreground",
          "whitespace-pre break-normal [overflow-wrap:normal] [font-variant-ligatures:none]",
          "[&>code]:grid [&>code]:min-w-full",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </pre>
    </div>
  );
}
