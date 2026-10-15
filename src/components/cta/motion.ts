import type { Variants } from "motion/react";
import { EASE_OUT } from "@/components/hero/motion";

export { EASE_OUT };

/**
 * The panel reveals itself and then hands over to its children one after
 * another. Every child below it just needs `variants={fadeUp}` (or one of the
 * variants below), with no `initial` / `whileInView` of its own.
 */
export const panelReveal: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: EASE_OUT,
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

/** Child variant: soft fade with a small upward movement. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

/** Slow fade for background glow, so it settles in after the content. */
export const glowIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.4, ease: EASE_OUT } },
};

/** A thin line that draws itself from left to right, once. */
export const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: EASE_OUT } },
};
