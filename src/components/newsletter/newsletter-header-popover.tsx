"use client";

import { Mail } from "lucide-react";
import { useId, useRef } from "react";
import { Popover } from "radix-ui";

import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { Button } from "@/components/ui/button";

export function NewsletterHeaderPopover() {
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label="Assinar newsletter"
          className="h-9 rounded-lg border-border/80 bg-background/60 px-2.5 text-muted-foreground shadow-none hover:bg-accent hover:text-foreground xl:px-3"
        >
          <Mail className="size-4" aria-hidden="true" />
          <span className="hidden xl:inline">Newsletter</span>
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          collisionPadding={16}
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
          className="z-60 w-[min(22.5rem,calc(100vw-2rem))] rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl shadow-foreground/10 outline-none"
        >
          <div className="mb-4 flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
              <Mail className="size-4" aria-hidden="true" />
            </span>
            <div>
              <h2 id={titleId} className="text-sm font-bold text-foreground">
                Receba novos artigos
              </h2>
              <p id={descriptionId} className="mt-1 text-sm leading-5 text-muted-foreground">
                Desenvolvimento, arquitetura e tecnologia no seu email.
              </p>
            </div>
          </div>

          <NewsletterForm
            source="header"
            variant="compact"
            inputRef={inputRef}
          />

          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Sem spam. Cancele quando quiser.
          </p>
          <Popover.Arrow className="fill-card stroke-border" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function NewsletterHeaderMobile() {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="border-y border-border/80 py-4">
      <div className="mb-3 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
          <Mail className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id={titleId} className="text-sm font-bold text-foreground">
            Newsletter
          </h2>
          <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
            Receba novos artigos no seu email.
          </p>
        </div>
      </div>

      <NewsletterForm source="header" variant="compact" />
      <p className="mt-2 text-xs text-muted-foreground">
        Sem spam. Cancele quando quiser.
      </p>
    </section>
  );
}
