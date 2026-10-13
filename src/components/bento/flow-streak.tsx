"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type FlowStreakProps = {
  /** Direction of travel: along the x axis (horizontal) or the y axis. */
  axis?: "x" | "y";
  /** Travel right to left, or bottom to top, instead of the default. */
  reverse?: boolean;
  /** Seconds one pass takes. */
  duration?: number;
  /** Seconds to wait before the first pass. */
  delay?: number;
  /** Seconds to rest between passes. Ignored when `loop` is false. */
  restBetween?: number;
  /** Keep flowing forever (default), or play a single pass. */
  loop?: boolean;
  className?: string;
};

/**
 * A soft amber gradient that travels along a line: transparent tail, bright
 * head. Place it inside a `relative overflow-hidden` element that is the line
 * itself; the line clips the streak at both ends, so it appears to flow out of
 * one point and into the next.
 */
export function FlowStreak({
  axis = "x",
  reverse = false,
  duration = 1.4,
  delay = 0,
  restBetween = 0.6,
  loop = true,
  className,
}: FlowStreakProps) {
  const horizontal = axis === "x";

  // The streak is a quarter (x) or two fifths (y) of the line, so travelling
  // from fully before the line to fully past it takes these percentages of the
  // streak's own length.
  const path = horizontal ? ["-100%", "400%"] : ["-100%", "250%"];
  const travel = reverse ? [...path].reverse() : path;

  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "absolute from-transparent via-highlight/50 to-highlight",
        horizontal ? "inset-y-0 left-0 w-1/4" : "inset-x-0 top-0 h-2/5",
        horizontal
          ? reverse
            ? "bg-linear-to-l"
            : "bg-linear-to-r"
          : reverse
            ? "bg-linear-to-t"
            : "bg-linear-to-b",
        className,
      )}
      initial={horizontal ? { x: travel[0] } : { y: travel[0] }}
      animate={horizontal ? { x: travel } : { y: travel }}
      transition={{
        duration,
        delay,
        ease: "linear",
        repeat: loop ? Infinity : 0,
        repeatDelay: restBetween,
      }}
    />
  );
}
