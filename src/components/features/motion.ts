import type { Variants } from "motion/react";
import { EASE_OUT } from "@/components/hero/motion";

/** Parent variant: reveals its children one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/** Child variant: soft fade with a small upward movement. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

/**
 * Hover variants for a feature's icon. The parent `whileHover="hover"` drives
 * these, so the whole cell reacts, not just the icon.
 */
export const iconLift: Variants = {
  hover: { y: -3, transition: { duration: 0.25, ease: EASE_OUT } },
};
