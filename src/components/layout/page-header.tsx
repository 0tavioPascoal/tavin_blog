import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  badge?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "border-b border-border/80 pb-8 sm:pb-10",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="max-w-3xl">
          {eyebrow || badge ? (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {eyebrow ? (
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600 dark:text-blue-400">
                  {eyebrow}
                </span>
              ) : null}

              {badge}
            </div>
          ) : null}

          <h1 className="font-sans text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {description ? (
            <div className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </div>
          ) : null}
        </div>

        {action ? <div className="shrink-0 pt-1">{action}</div> : null}
      </div>
    </header>
  );
}
