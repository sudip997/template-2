"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll } from "motion/react";
import { IconClock } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";

export type StepItemProps = {
  /** Zero-based position. Shown as 1, 2, 3 in the node. */
  index: number;
  title: string;
  description: string;
  /** Short time estimate, for example "About 5 minutes". */
  duration: string;
  /** The step's UI preview. */
  children: ReactNode;
  /** The last step has no connector line below it. */
  isLast?: boolean;
  className?: string;
};

/**
 * One step of the journey: a numbered node on the rail, the step's text, and
 * a UI preview.
 *
 * Desktop: a three-column grid. The rail is the narrow centre column, and the
 * text and preview swap sides from step to step.
 * Mobile: the rail moves to the left and the text and preview stack beside it.
 *
 * The connector below the node fills with amber as the step scrolls past, and
 * the node darkens once it has been reached. With reduced motion, both are
 * simply shown in their finished state.
 *
 * Must be rendered inside an ordered list.
 */
export function StepItem({
  index,
  title,
  description,
  duration,
  children,
  isLast = false,
  className,
}: StepItemProps) {
  const ref = useRef<HTMLLIElement>(null);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  // 0 when the step's top reaches 65% down the screen, 1 when its bottom does.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 65%"],
  });
  const reached = useInView(nodeRef, {
    once: true,
    margin: "0px 0px -35% 0px",
  });
  const lit = reached || Boolean(reduceMotion);

  const textOnLeft = index % 2 === 0;

  return (
    <li
      ref={ref}
      className={cn(
        "relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 sm:gap-x-6 lg:grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,1fr)] lg:gap-x-12",
        !isLast && "pb-14 lg:pb-24",
        className,
      )}
    >
      {/* Connector: a hairline with an amber fill that follows the scroll */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute top-9 bottom-0 left-[1.125rem] w-px -translate-x-1/2 bg-border lg:left-1/2"
        >
          <motion.span
            className="absolute inset-0 bg-highlight"
            style={{
              scaleY: reduceMotion ? 1 : scrollYProgress,
              originY: 0,
            }}
          />
        </span>
      )}

      {/* Rail: the numbered node */}
      <div className="relative z-10 col-start-1 row-span-2 lg:col-start-2 lg:row-span-1 lg:row-start-1">
        <span
          ref={nodeRef}
          aria-hidden="true"
          className={cn(
            "flex size-9 items-center justify-center rounded-lg border font-heading text-sm font-semibold tabular-nums shadow-sm transition-colors duration-500",
            lit
              ? "border-primary bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground",
          )}
        >
          {index + 1}
        </span>
      </div>

      {/* Text */}
      <div
        className={cn(
          "col-start-2 min-w-0 pt-1 lg:row-start-1 lg:max-w-md lg:self-start",
          textOnLeft
            ? "lg:col-start-1 lg:justify-self-end"
            : "lg:col-start-3 lg:justify-self-start",
        )}
      >
        <h3 className="font-heading text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">
          <span className="sr-only">Step {index + 1}: </span>
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg">
          {description}
        </p>
        <p className="mt-5 inline-flex items-center gap-2 text-sm text-muted-foreground">
          <IconClock className="size-4" stroke={1.75} aria-hidden="true" />
          {duration}
        </p>
      </div>

      {/* Preview */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={cn(
          "col-start-2 mt-8 min-w-0 lg:row-start-1 lg:mt-0 lg:self-start",
          textOnLeft ? "lg:col-start-3" : "lg:col-start-1",
        )}
      >
        {children}
      </motion.div>
    </li>
  );
}
