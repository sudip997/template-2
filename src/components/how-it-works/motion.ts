import type { Variants } from "motion/react";
import { EASE_OUT } from "@/components/hero/motion";

export { EASE_OUT };

/** Soft fade with a small upward movement. Used once per block, not per element. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT } },
};

/**
 * Transition helper for the step previews. People who prefer reduced motion
 * get an instant change instead of a tween.
 */
export function tween(
  reduceMotion: boolean | null,
  duration: number,
  delay = 0,
) {
  return reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE_OUT };
}
