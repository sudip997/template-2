"use client";

import { motion } from "motion/react";
import { IconPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export type FaqItemProps = {
  entry: FaqEntry;
  /** Position in the list, shown as a small "01" index label. */
  index: number;
  open: boolean;
  onToggle: () => void;
  className?: string;
};

/**
 * One accordion row, following the WAI-ARIA accordion pattern: the question is
 * a real <button> inside a heading, and it controls the answer region.
 * Enter and Space toggle it, and Tab moves between questions.
 *
 * The answer animates with a CSS grid-row transition (0fr to 1fr), which can
 * animate to the content's natural height without measuring it in JavaScript.
 * While closed the answer is `inert`, so its links can't be tabbed to.
 *
 * Must be rendered inside a `motion` parent that animates "hidden" / "show".
 */
export function FaqItem({
  entry,
  index,
  open,
  onToggle,
  className,
}: FaqItemProps) {
  const triggerId = `faq-trigger-${entry.id}`;
  const panelId = `faq-panel-${entry.id}`;

  return (
    <motion.li
      variants={fadeUp}
      data-open={open || undefined}
      className={cn(
        "group relative border-b transition-colors duration-300 data-[open]:bg-card/60",
        className,
      )}
    >
      {/* Thin accent line down the left edge of the open row */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-highlight transition-transform duration-500 ease-out group-data-[open]:scale-y-100 motion-reduce:transition-none"
      />

      <h3>
        <button
          type="button"
          id={triggerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-start gap-4 rounded-lg px-4 py-5 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:px-6 sm:py-6"
        >
          <span
            aria-hidden="true"
            className="w-6 shrink-0 pt-1 font-heading text-xs font-medium tracking-widest text-muted-foreground tabular-nums transition-colors duration-300 group-data-[open]:text-highlight-foreground"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="flex-1 font-heading text-base leading-snug font-semibold tracking-tight text-pretty sm:text-lg">
            {entry.question}
          </span>

          <span
            aria-hidden="true"
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border bg-background text-muted-foreground transition-colors duration-300 group-hover:border-highlight/40 group-hover:text-foreground group-data-[open]:border-highlight/40 group-data-[open]:bg-highlight-soft group-data-[open]:text-highlight-foreground"
          >
            <IconPlus
              className="size-4 transition-transform duration-300 ease-out group-data-[open]:rotate-45 motion-reduce:transition-none"
              stroke={1.75}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        {/* `min-h-0` lets the row collapse fully; `overflow-hidden` clips the text meanwhile */}
        <div className="min-h-0 overflow-hidden">
          {/* Left padding lines the answer up under the question text (padding + index + gap) */}
          <p className="pr-16 pb-6 pl-14 text-sm leading-relaxed text-pretty text-muted-foreground sm:pr-20 sm:pb-7 sm:pl-16 sm:text-base">
            {entry.answer}
          </p>
        </div>
      </div>
    </motion.li>
  );
}
