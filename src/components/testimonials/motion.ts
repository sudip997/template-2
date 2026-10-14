import type { Variants } from "motion/react";
import { EASE_OUT } from "@/components/hero/motion";

export { EASE_OUT };

/** Soft fade with a small upward movement. Used once per block, not per element. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};
