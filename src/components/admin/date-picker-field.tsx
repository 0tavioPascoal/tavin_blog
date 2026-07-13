"use client";

import { useState } from "react";
import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Popover } from "radix-ui";
import { DayPicker, type Matcher } from "react-day-picker";

import { cn } from "@/lib/utils";

type DatePickerFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
  startMonth: Date;
  endMonth: Date;
  disabledDates?: Matcher | Matcher[];
};

function parseDisplayDate(value: string): Date | undefined {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return undefined;
  const date = parse(value, "dd/MM/yyyy", new Date());
  return isValid(date) && format(date, "dd/MM/yyyy") === value ? date : undefined;
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function DatePickerField({
  id,
  value,
  onChange,
  onBlur,
  placeholder = "DD/MM/AAAA",
  disabled,
  invalid,
  describedBy,
  startMonth,
  endMonth,
  disabledDates,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDisplayDate(value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onBlur={onBlur}
          onChange={(event) => onChange(maskDate(event.target.value))}
          className={cn(
            "h-11 w-full rounded-xl border border-slate-300/80 bg-background px-3 pr-11 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/70 hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:border-slate-600",
            invalid && "border-red-500 focus:border-red-500 focus:ring-red-500/10",
          )}
        />

        <Popover.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Abrir calendário de ${id === "issuedAt" ? "emissão" : "expiração"}`}
            className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-blue-500 disabled:pointer-events-none dark:hover:bg-blue-950/40 dark:hover:text-blue-300"
          >
            <CalendarDays className="size-4" aria-hidden="true" />
          </button>
        </Popover.Trigger>
      </div>

      <Popover.Portal>
        <Popover.Content
          sideOffset={8}
          align="start"
          collisionPadding={12}
          className="z-60 rounded-2xl border border-slate-300/80 bg-card p-3 text-foreground shadow-2xl shadow-slate-950/15 outline-none dark:border-slate-700 dark:shadow-black/40"
        >
          <DayPicker
            mode="single"
            locale={ptBR}
            selected={selected}
            defaultMonth={selected ?? new Date()}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "dd/MM/yyyy"));
              setOpen(false);
            }}
            startMonth={startMonth}
            endMonth={endMonth}
            disabled={disabledDates}
            captionLayout="dropdown"
            navLayout="after"
            fixedWeeks
            showOutsideDays
            className="admin-date-calendar"
          />
          <Popover.Arrow className="fill-card" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
