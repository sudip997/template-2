"use client";

import { motion } from "motion/react";
import { drawLine, glowIn } from "./motion";

/**
 * Quiet decoration for the CTA panel: a warm amber glow, a faded dot grid and a
 * thin amber line along the top edge.
 *
 * Must be rendered inside the panel's `motion` parent (see cta.tsx), which
 * drives the "hidden" / "show" variants. Everything here is `aria-hidden`, and
 * the panel still reads well if you delete this file's contents.
 */
export function CtaBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      {/* Warm glow in the top-right corner, behind the action rail */}
      <motion.div
        variants={glowIn}
        className="absolute -top-32 -right-24 size-120 max-w-full rounded-full bg-highlight/15 blur-3xl"
      />

      {/* Dot grid, faded out toward the bottom-left so the headline stays clean */}
      <div className="absolute inset-0 [background-image:radial-gradient(var(--foreground)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_90%_at_100%_0%,black,transparent_75%)] opacity-[0.09]" />

      {/* Amber line along the top edge, same detail as the featured pricing plan */}
      <motion.span
        variants={drawLine}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-linear-to-r from-highlight via-highlight/50 to-transparent"
      />
    </div>
  );
}
