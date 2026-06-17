import type { ComponentType, ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  meta?: ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  meta,
  className = "",
}: PageHeroProps) {
  return (
    <div className={`rounded-2xl border border-slate-300/70 bg-card p-5 shadow-sm dark:border-slate-800 sm:rounded-3xl sm:p-8 lg:p-10 ${className}`}>
      <div className="max-w-4xl">
        {Icon ? (
          <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
            <Icon className="size-6" />
          </div>
        ) : null}

        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h1>

        {description ? (
          <div className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:mt-5 sm:text-lg sm:leading-8">
            {description}
          </div>
        ) : null}

        {meta ? (
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-muted-foreground">
            {meta}
          </div>
        ) : null}
      </div>
    </div>
  );
}
