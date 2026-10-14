import type { Variants } from "motion/react";
import { EASE_OUT } from "@/components/hero/motion";

/** Parent variant: reveals its children one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/** Child variant: soft fade with a small upward movement. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

/**
 * Connector line that draws downward from one step to the next.
 * Used with `originY: 0` so it grows from the top.
 */
export const drawLine: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.7, ease: EASE_OUT } },
};
