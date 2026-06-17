type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-400">
      <h2 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6">{description}</p>
    </div>
  );
}
