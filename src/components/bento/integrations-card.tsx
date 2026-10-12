"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  IconActivity,
  IconCreditCard,
  IconDatabase,
  IconPlugConnected,
  IconReceipt2,
  IconTable,
  IconUsers,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BentoCard } from "./bento-card";
import { EASE_OUT } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the copy and the connected sources.      */
/* -------------------------------------------------------------------------- */

const content = {
  title: "Every source, one truth",
  description:
    "Connect payments, billing, your CRM and warehouse in minutes. Every number is reconciled automatically, so no two dashboards ever disagree.",
  status: "Synced 2 min ago",
} as const;

type Source = {
  id: string;
  label: string;
  icon: Icon;
  /**
   * Position of the source, as a percentage of the diagram.
   * The hub sits at 50 / 50. Keep sources roughly 14–86 so they never clip.
   */
  x: number;
  y: number;
};

/** Generic categories on purpose, so no real brand logos are needed. */
const sources: Source[] = [
  { id: "payments", label: "Payments", icon: IconCreditCard, x: 16, y: 20 },
  { id: "billing", label: "Billing", icon: IconReceipt2, x: 16, y: 50 },
  { id: "crm", label: "CRM", icon: IconUsers, x: 16, y: 80 },
  { id: "warehouse", label: "Warehouse", icon: IconDatabase, x: 84, y: 20 },
  { id: "events", label: "Events", icon: IconActivity, x: 84, y: 50 },
  { id: "sheets", label: "Sheets", icon: IconTable, x: 84, y: 80 },
];

/* -------------------------------------------------------------------------- */
/*  Timing (seconds). The sequence plays once when the card scrolls into view. */
/* -------------------------------------------------------------------------- */

const LINE_START = 0.3; // first connector begins drawing
const LINE_STEP = 0.08; // delay between connectors
const PULSE_START = 1.2; // first signal leaves its source
const PULSE_STEP = 0.25; // delay between signals
const PULSE_DURATION = 0.9;
const SETTLE_DELAY =
  PULSE_START + (sources.length - 1) * PULSE_STEP + PULSE_DURATION;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function IntegrationsCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);

  // People who prefer reduced motion get the finished diagram straight away.
  const show = inView || Boolean(reduceMotion);
  const tween = (duration: number, delay = 0) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE_OUT };

  return (
    <BentoCard
      icon={IconPlugConnected}
      title={content.title}
      description={content.description}
      className={className}
    >
      {/* Product visual. It fills the rest of the card and sits flush with the bottom edge. */}
      <div
        role="group"
        aria-label="Connected data sources preview"
        className="mx-6 flex flex-1 flex-col rounded-t-xl border border-b-0 bg-background sm:mx-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <p className="text-xs font-medium">
            {sources.length} connected sources
          </p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-highlight"
            />
            {content.status}
          </p>
        </div>

        <p className="sr-only">
          {`Connected sources: ${sources.map((source) => source.label).join(", ")}.`}
        </p>

        {/* Diagram */}
        <div ref={ref} className="relative min-h-72 flex-1" aria-hidden="true">
          {/* Connectors. Straight lines, so the stretched viewBox never distorts them. */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full overflow-visible"
          >
            {sources.map((source, index) => {
              const start = `M ${source.x} ${source.y} L ${source.x} ${source.y}`;
              const end = `M ${source.x} ${source.y} L 50 50`;
              return (
                <motion.path
                  key={source.id}
                  fill="none"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  className={cn(
                    "transition-[stroke] duration-300",
                    activeId === source.id
                      ? "stroke-highlight"
                      : "stroke-muted-foreground/30",
                  )}
                  initial={{ d: start }}
                  animate={{ d: show ? end : start }}
                  transition={tween(0.7, LINE_START + index * LINE_STEP)}
                />
              );
            })}
          </svg>

          {/* Signals: one small dot travels from each source to the hub, once. */}
          {!reduceMotion &&
            sources.map((source, index) => {
              const delay = PULSE_START + index * PULSE_STEP;
              return (
                <motion.span
                  key={source.id}
                  className="absolute z-10 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight"
                  initial={{
                    opacity: 0,
                    left: `${source.x}%`,
                    top: `${source.y}%`,
                  }}
                  animate={
                    show
                      ? {
                          left: [`${source.x}%`, "50%"],
                          top: [`${source.y}%`, "50%"],
                          opacity: [0, 1, 1, 0],
                        }
                      : undefined
                  }
                  transition={{
                    left: { duration: PULSE_DURATION, delay, ease: "easeInOut" },
                    top: { duration: PULSE_DURATION, delay, ease: "easeInOut" },
                    opacity: {
                      duration: PULSE_DURATION,
                      delay,
                      times: [0, 0.2, 0.8, 1],
                    },
                  }}
                />
              );
            })}

          {/* Hub */}
          <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative flex size-16 items-center justify-center rounded-2xl bg-primary ring-8 ring-background"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.9 }}
              transition={tween(0.6)}
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-primary-foreground/25">
                <span className="size-2.5 rounded-full bg-highlight" />
              </span>

              {/* One soft ring when the last signal arrives */}
              {!reduceMotion && (
                <motion.span
                  className="absolute inset-0 rounded-2xl border border-highlight"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={
                    show
                      ? { opacity: [0.6, 0], scale: [1, 1.6] }
                      : { opacity: 0, scale: 1 }
                  }
                  transition={{
                    duration: 1,
                    delay: SETTLE_DELAY,
                    ease: EASE_OUT,
                  }}
                />
              )}
            </motion.div>
          </div>

          {/* Sources */}
          {sources.map((source, index) => {
            const SourceIcon = source.icon;
            const active = activeId === source.id;
            return (
              <div
                key={source.id}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${source.x}%`, top: `${source.y}%` }}
              >
                <motion.div
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-background p-1"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.92 }}
                  transition={tween(0.5, 0.1 + index * 0.07)}
                  onMouseEnter={() => setActiveId(source.id)}
                  onMouseLeave={() => setActiveId(null)}
                >
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl border bg-card transition-colors duration-300",
                      active
                        ? "border-foreground/25 text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <SourceIcon className="size-5" stroke={1.75} />
                  </span>
                  <span
                    className={cn(
                      "text-[0.6875rem] leading-none font-medium transition-colors duration-300",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {source.label}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </BentoCard>
  );
}
