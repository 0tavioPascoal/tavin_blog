type SectionHeadingProps = {
  title: string;
  action?: React.ReactNode;
};

export function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="border-l-4 border-blue-600 pl-3 text-lg font-semibold text-slate-950 dark:text-white">
        {title}
      </h2>
      {action}
    </div>
  );
}
