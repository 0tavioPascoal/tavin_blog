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
    "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5",
    "text-xs font-semibold transition",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-slate-950",
    copyState === "copied"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
      : copyState === "error"
        ? "border-red-500/30 bg-red-500/10 text-red-300"
        : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
  ].join(" ");

  return (
    <div className="markdown-code-block not-prose overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-xl shadow-slate-950/10 dark:shadow-black/30">
      <div className="markdown-code-toolbar flex min-h-12 items-center justify-between gap-4 border-b border-white/10 bg-slate-900/90 px-3 sm:px-4">
        <span className="markdown-code-language truncate font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
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
          "m-0 max-w-full overflow-x-auto bg-transparent px-4 py-5",
          "font-mono text-sm leading-7 text-slate-100",
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