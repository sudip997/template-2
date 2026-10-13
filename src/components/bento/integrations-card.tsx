"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
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
import { FlowStreak } from "./flow-streak";
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
/*  Timing (seconds). Connectors draw in once; a gradient then flows along    */
/*  each one continuously while the card is on screen. One flow takes         */
/*  DURATION + REST, and STEP spreads the sources across that period so there */
/*  is always a gentle trickle rather than a burst.                           */
/* -------------------------------------------------------------------------- */

const LINE_START = 0.3; // first connector begins drawing
const LINE_STEP = 0.08; // delay between connectors
const FLOW_START = 1.0; // first gradient leaves its source
const FLOW_STEP = 0.45; // delay between sources
const FLOW_DURATION = 2.4; // time a gradient takes to cross a connector
const FLOW_REST = 0.6; // rest before a source sends its next gradient

/** Width and height of an element, kept up to date as it is resized. */
function useElementSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function IntegrationsCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // Unlike `inView`, this follows the card in and out of the viewport, so the
  // signals only run while someone can actually see them.
  const onScreen = useInView(ref, { amount: 0.1 });
  const reduceMotion = useReducedMotion();
  const size = useElementSize(ref);
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
        className="mx-6 flex flex-1 flex-col rounded-t-xl border border-b-0 bg-background shadow-sm sm:mx-8"
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
          {/* Soft warm glow behind the hub */}
          <div className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight-soft blur-2xl dark:bg-highlight-soft/70" />

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

          {/*
            Gradient flow. Each streak rides on a thin line laid exactly over its
            connector, so it needs the diagram's pixel size to get the length
            and angle right.
          */}
          {!reduceMotion &&
            show &&
            onScreen &&
            size.width > 0 &&
            sources.map((source, index) => {
              const x = (source.x / 100) * size.width;
              const y = (source.y / 100) * size.height;
              const dx = size.width / 2 - x;
              const dy = size.height / 2 - y;
              return (
                <div
                  key={source.id}
                  className="pointer-events-none absolute z-10 h-0.5 origin-left overflow-hidden rounded-full"
                  style={{
                    left: x,
                    top: y - 1,
                    width: Math.hypot(dx, dy),
                    transform: `rotate(${Math.atan2(dy, dx)}rad)`,
                  }}
                >
                  <FlowStreak
                    duration={FLOW_DURATION}
                    delay={FLOW_START + index * FLOW_STEP}
                    restBetween={FLOW_REST}
                  />
                </div>
              );
            })}

          {/* Hub */}
          <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-b from-primary to-primary-hover shadow-lg shadow-black/15 ring-1 ring-primary-foreground/10 ring-inset"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.9 }}
              transition={tween(0.6)}
            >
              <span className="flex size-7 items-center justify-center rounded-full border border-primary-foreground/25">
                <span className="size-2.5 rounded-full bg-highlight" />
              </span>
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
                      "flex size-10 items-center justify-center rounded-xl border bg-card shadow-sm transition-[color,border-color,box-shadow] duration-300",
                      active
                        ? "border-highlight/50 text-highlight shadow-md shadow-highlight/10"
                        : "text-primary",
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
