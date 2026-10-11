import type { Variants } from "motion/react";
import { EASE_OUT } from "@/components/hero/motion";

export { EASE_OUT };

/** Parent variant: reveals its children one after another. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Child variant: soft fade with a small upward movement. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};
