"use client";

import { motion } from "motion/react";
import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { drawLine, fadeUp } from "./motion";

export type StepItemProps = {
  icon: Icon;
  title: string;
  description: string;
  /** Zero-based position. Shown as "01", "02", ... */
  index: number;
  /** The last step has no connector line below it. */
  isLast?: boolean;
  className?: string;
};

/**
 * One step in the vertical timeline.
 *
 * Layout: an icon "node" in the left rail with a connector line running down
 * to the next step, and the number, title and description beside it.
 *
 * The connector is a static hairline with an amber line drawn over it when the
 * step scrolls into view. With reduced motion the amber line simply appears.
 *
 * Must be rendered inside a `motion` parent that animates "hidden" / "show".
 */
export function StepItem({
  icon: StepIcon,
  title,
  description,
  index,
  isLast = false,
  className,
}: StepItemProps) {
  return (
    <motion.li
      variants={fadeUp}
      className={cn("relative flex gap-5 sm:gap-7", className)}
    >
      {/* Left rail: icon node + connector */}
      <div className="flex flex-col items-center">
        <span
          aria-hidden="true"
          className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-xl border bg-card text-highlight-foreground shadow-sm"
        >
          <StepIcon className="size-5" stroke={1.75} />
        </span>

        {!isLast && (
          <span
            aria-hidden="true"
            className="relative mt-2 mb-2 w-px flex-1 bg-border"
          >
            <motion.span
              variants={drawLine}
              style={{ originY: 0 }}
              className="absolute inset-0 bg-highlight/70"
            />
          </span>
        )}
      </div>

      {/* Content */}
      <div className={cn("min-w-0 pt-1.5", !isLast && "pb-12 sm:pb-14")}>
        <p className="font-heading text-xs font-medium tracking-widest text-muted-foreground tabular-nums">
          <span className="sr-only">Step </span>
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-base leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.li>
  );
}
