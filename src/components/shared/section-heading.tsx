type SectionHeadingProps = {
  title: string;
  action?: React.ReactNode;
};

export function SectionHeading({ title, action }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <h2 className="border-l-4 border-blue-600 pl-3 text-base font-semibold text-slate-950 dark:text-white sm:text-lg">
        {title}
      </h2>
      {action}
    </div>
  );
}
