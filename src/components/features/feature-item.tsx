"use client";

import { motion } from "motion/react";
import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { fadeUp, iconLift } from "./motion";

export type FeatureItemProps = {
  icon: Icon;
  title: string;
  description: string;
  /** Position in the grid, shown as a small "01" index label. */
  index: number;
  className?: string;
};

/**
 * One cell of the features grid.
 *
 * The cell's background and dividers are static (the parent grid draws them),
 * so only the content fades in. This keeps the hairlines from flickering while
 * the section reveals itself.
 *
 * Must be rendered inside a `motion` parent that animates "hidden" / "show".
 */
export function FeatureItem({
  icon: FeatureIcon,
  title,
  description,
  index,
  className,
}: FeatureItemProps) {
  return (
    <li
      className={cn(
        "group relative bg-card transition-colors duration-300 hover:bg-secondary/60 dark:hover:bg-secondary/50",
        className,
      )}
    >
      {/* Thin accent line that draws across the top of the cell on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-highlight transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />

      <motion.article
        variants={fadeUp}
        whileHover="hover"
        className="flex h-full flex-col p-6 sm:p-8"
      >
        <div className="flex items-start justify-between">
          <motion.span
            variants={iconLift}
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-lg border bg-background text-foreground transition-colors duration-300 group-hover:border-highlight/40 group-hover:text-highlight-foreground"
          >
            <FeatureIcon className="size-5" stroke={1.75} />
          </motion.span>

          <span
            aria-hidden="true"
            className="font-heading text-xs font-medium tracking-widest text-muted-foreground tabular-nums"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h3 className="mt-8 font-heading text-lg font-semibold tracking-tight sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </motion.article>
    </li>
  );
}
