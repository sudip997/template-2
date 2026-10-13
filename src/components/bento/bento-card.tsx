"use client";

import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";

type BentoCardProps = {
  icon: Icon;
  title: string;
  description: string;
  className?: string;
  /** The card's visual. It is placed below the text and can bleed off the bottom edge. */
  children?: ReactNode;
};

/**
 * Shared shell for every bento card: border, background, icon chip, title and
 * description. Each card supplies its own visual as `children`.
 *
 * Each card reveals itself with `whileInView`, so a card lower in the grid fades
 * in when it is scrolled to, not when the top of the grid appears.
 */
export function BentoCard({
  icon: CardIcon,
  title,
  description,
  className,
  children,
}: BentoCardProps) {
  const titleId = useId();

  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      aria-labelledby={titleId}
      className={cn(
        "group relative isolate flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-300 hover:border-foreground/25 hover:shadow-md",
        className,
      )}
    >
      {/* Soft warm glow in the corner, behind the text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-28 -z-10 size-72 rounded-full bg-highlight-soft/70 blur-3xl dark:bg-highlight-soft/30"
      />

      <header className="p-6 sm:p-8">
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-lg bg-highlight-soft text-highlight-foreground"
        >
          <CardIcon className="size-[1.125rem]" stroke={1.75} />
        </span>
        <h3
          id={titleId}
          className="mt-5 font-heading text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      </header>

      {children}
    </motion.article>
  );
}
