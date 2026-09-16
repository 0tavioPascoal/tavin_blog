import type { ComponentProps, ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageContainerProps<T extends ElementType = "div"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  size?: "default" | "narrow" | "wide";
} & Omit<ComponentProps<T>, "as" | "className" | "children" | "size">;

export function PageContainer<T extends ElementType = "div">({
  as,
  children,
  className,
  size = "default",
  ...props
}: PageContainerProps<T>) {
  const Component = as ?? "div";

  const sizeClass = {
    narrow: "max-w-4xl",
    default: "max-w-7xl",
    wide: "max-w-[1440px]",
  }[size];

  return (
    <Component
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12",
        sizeClass,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
