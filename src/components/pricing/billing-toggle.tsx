"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "./motion";
import type { BillingCycle } from "./types";

const options: { value: BillingCycle; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

type BillingToggleProps = {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
  /** Small note shown next to "Yearly", e.g. "Save 20%". Leave empty to hide it. */
  yearlyNote?: string;
  className?: string;
};

/**
 * Segmented monthly / yearly switch. It follows the WAI-ARIA radio group
 * pattern: one tab stop, arrow keys move (and select) between the options.
 */
export function BillingToggle({
  value,
  onChange,
  yearlyNote,
  className,
}: BillingToggleProps) {
  const pillId = useId();
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = options.findIndex((option) => option.value === value);
    let next: number;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (current + 1) % options.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (current - 1 + options.length) % options.length;
        break;
      default:
        return;
    }

    event.preventDefault();
    onChange(options[next].value);
    optionRefs.current[next]?.focus();
  }

  return (
    <div
      role="radiogroup"
      aria-label="Billing period"
      onKeyDown={handleKeyDown}
      className={cn("inline-flex rounded-xl border bg-muted p-1", className)}
    >
      {options.map((option, index) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex h-9 items-center gap-2 rounded-lg px-4 text-sm font-medium outline-none transition-colors duration-300 focus-visible:ring-3 focus-visible:ring-ring/50",
              selected
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {/* Pill that glides between the two options */}
            {selected && (
              <motion.span
                layoutId={`${pillId}-pill`}
                aria-hidden="true"
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="absolute inset-0 rounded-lg border bg-card shadow-sm"
              />
            )}

            <span className="relative">{option.label}</span>

            {option.value === "yearly" && yearlyNote && (
              <span className="relative rounded-md bg-highlight-soft px-1.5 py-0.5 text-xs font-semibold text-highlight-foreground">
                {yearlyNote}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
