"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  IconArrowUpRight,
  IconAt,
  IconCheck,
  IconMessageCircle,
  IconSend,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/hero/avatar";
import { BentoCard } from "./bento-card";
import { buildLinePath, type Point } from "./forecast-chart";
import { EASE_OUT } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content and mock data. Replace with your own product copy and people.     */
/* -------------------------------------------------------------------------- */

const content = {
  title: "Decide together, in context",
  description:
    "Comment directly on a metric, mention the people who own it, and resolve the question where the number lives, not in a side thread.",
  metric: { label: "Net retention", value: "118%", change: "+3.0 pt" },
  composerPlaceholder: "Reply or @mention…",
} as const;

type Comment = {
  id: string;
  name: string;
  initials: string;
  tone: "amber" | "dark" | "neutral";
  time: string;
  /** Optional @mention shown as a highlighted chip before the text. */
  mention?: string;
  text: string;
};

const comments: Comment[] = [
  {
    id: "maya",
    name: "Maya Rao",
    initials: "MR",
    tone: "amber",
    time: "2h",
    text: "Retention jumped after the onboarding change. Does it hold for annual plans too?",
  },
  {
    id: "dev",
    name: "Dev Tran",
    initials: "DT",
    tone: "dark",
    time: "14m",
    mention: "@Finance",
    text: "annual cohorts are up 4 pts as well. I'm adding it to the Q4 forecast.",
  },
];

/** Arrives last, after a short "is typing" moment. */
const reply: Comment = {
  id: "priya",
  name: "Priya Nair",
  initials: "PN",
  tone: "neutral",
  time: "Just now",
  text: "Confirmed. Forecast updated, now tracking $1.52M for the quarter.",
};

/** Sparkline data: net retention (%) over the last 12 weeks. */
const sparkline = [
  109.8, 110.4, 111.2, 111.0, 112.1, 113.0, 113.4, 114.9, 116.2, 116.8, 117.5,
  118,
];
/** Index of the data point the thread is attached to. */
const ANCHOR_INDEX = 8;

const SPARK_WIDTH = 112;
const SPARK_HEIGHT = 40;
const SPARK_MIN = 109;
const SPARK_MAX = 119;

/* -------------------------------------------------------------------------- */
/*  Timing (seconds), measured from when the card scrolls into view.          */
/* -------------------------------------------------------------------------- */

const COMMENT_START = 0.5; // first comment fades in
const COMMENT_STEP = 0.5; // delay between the first two comments
const TYPING_AT = 2.4; // "Priya is typing"
const REPLY_AT = 4.0; // her reply arrives
const RESOLVE_AT = 4.8; // thread is marked resolved

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const sparkPoints: Point[] = sparkline.map((value, index) => ({
  x: (index / (sparkline.length - 1)) * SPARK_WIDTH,
  y: 4 + (1 - (value - SPARK_MIN) / (SPARK_MAX - SPARK_MIN)) * (SPARK_HEIGHT - 8),
}));
const sparkLine = buildLinePath(sparkPoints);
const sparkArea = `${sparkLine} L ${SPARK_WIDTH} ${SPARK_HEIGHT} L 0 ${SPARK_HEIGHT} Z`;
const anchor = sparkPoints[ANCHOR_INDEX];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function CollaborationCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = useReducedMotion();

  // The thread plays a short story once (typing, reply, resolved). Pressing
  // the button takes over: `override` then decides the resolved state.
  const [demoStep, setDemoStep] = useState(0);
  const [override, setOverride] = useState<boolean | null>(null);

  const show = inView || Boolean(reduceMotion);
  const tween = (duration: number, delay = 0) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE_OUT };

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timers = [
      window.setTimeout(() => setDemoStep(1), TYPING_AT * 1000),
      window.setTimeout(() => setDemoStep(2), REPLY_AT * 1000),
      window.setTimeout(() => setDemoStep(3), RESOLVE_AT * 1000),
    ];
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduceMotion]);

  // People who prefer reduced motion get the finished thread straight away.
  const typing = !reduceMotion && override === null && demoStep === 1;
  const replied = Boolean(reduceMotion) || override !== null || demoStep >= 2;
  const resolved =
    override !== null ? override : Boolean(reduceMotion) || demoStep >= 3;
  const commentCount = comments.length + (replied ? 1 : 0);

  return (
    <BentoCard
      icon={IconMessageCircle}
      title={content.title}
      description={content.description}
      className={className}
    >
      {/* Product visual. It fills the rest of the card and sits flush with the bottom edge. */}
      <div
        ref={ref}
        role="group"
        aria-label="Metric discussion preview"
        className="mx-6 flex flex-1 flex-col rounded-t-xl border border-b-0 bg-background sm:mx-8"
      >
        {/* The metric the conversation is attached to */}
        <div className="flex items-center justify-between gap-4 border-b px-4 py-4 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted-foreground">
              {content.metric.label}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
                {content.metric.value}
              </span>
              <span className="inline-flex items-center gap-0.5 rounded-md bg-highlight-soft px-1.5 py-0.5 text-xs font-medium text-highlight-foreground">
                <IconArrowUpRight
                  className="size-3.5"
                  stroke={2}
                  aria-hidden="true"
                />
                {content.metric.change}
              </span>
            </div>
          </div>

          {/* Sparkline with the comment pinned to a data point */}
          <div
            className="relative shrink-0"
            style={{ width: SPARK_WIDTH, height: SPARK_HEIGHT }}
            aria-hidden="true"
          >
            <svg
              viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`}
              className="size-full overflow-visible"
            >
              <defs>
                <linearGradient
                  id="bento-collab-spark-area"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    style={{ stopColor: "var(--foreground)", stopOpacity: 0.08 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "var(--foreground)", stopOpacity: 0 }}
                  />
                </linearGradient>
              </defs>
              <motion.path
                d={sparkArea}
                fill="url(#bento-collab-spark-area)"
                initial={{ opacity: 0 }}
                animate={{ opacity: show ? 1 : 0 }}
                transition={tween(0.8, 0.5)}
              />
              <motion.path
                d={sparkLine}
                fill="none"
                className="stroke-foreground"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: show ? 1 : 0 }}
                transition={tween(1.1, 0.15)}
              />
            </svg>

            {/* Anchor dot and comment-count pin */}
            <motion.span
              className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight ring-2 ring-background"
              style={{
                left: `${(anchor.x / SPARK_WIDTH) * 100}%`,
                top: `${(anchor.y / SPARK_HEIGHT) * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.5 }}
              transition={tween(0.4, 0.9)}
            />
            <motion.span
              className="absolute flex size-4 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full border border-highlight/40 bg-highlight-soft text-[0.625rem] leading-none font-semibold text-highlight-foreground"
              style={{
                left: `${(anchor.x / SPARK_WIDTH) * 100}%`,
                top: `calc(${(anchor.y / SPARK_HEIGHT) * 100}% - 6px)`,
              }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: show ? 1 : 0, y: show ? 0 : 4 }}
              transition={tween(0.4, 1.05)}
            >
              <motion.span
                key={resolved ? "resolved" : commentCount}
                className="flex"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE_OUT }}
              >
                {resolved ? (
                  <IconCheck className="size-2.5" stroke={3} />
                ) : (
                  commentCount
                )}
              </motion.span>
            </motion.span>
          </div>
        </div>

        {/* Thread bar: status on the left, resolve control on the right */}
        <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
          <p className="flex items-center gap-2 text-xs font-medium">
            Thread
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-medium transition-colors duration-300",
                resolved
                  ? "bg-highlight-soft text-highlight-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {resolved ? (
                <IconCheck className="size-3" stroke={2.5} aria-hidden="true" />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-highlight"
                />
              )}
              {resolved ? "Resolved" : "Open"}
            </span>
          </p>
          <button
            type="button"
            onClick={() => setOverride(!resolved)}
            className="inline-flex items-center gap-1 rounded-md border bg-card px-2 py-1 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            {!resolved && (
              <IconCheck className="size-3.5" stroke={2} aria-hidden="true" />
            )}
            {resolved ? "Reopen" : "Resolve"}
          </button>
        </div>

        <p className="sr-only" aria-live="polite">
          {resolved ? "Thread resolved." : "Thread open."}
        </p>

        {/* Comments */}
        <ul className="flex-1 px-4 pt-5 sm:px-5">
          {comments.map((comment, index) => (
            <motion.li
              key={comment.id}
              className="relative flex gap-3 pb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: show ? 1 : 0, y: show ? 0 : 10 }}
              transition={tween(0.5, COMMENT_START + index * COMMENT_STEP)}
            >
              {/* Line that links this comment to the next */}
              <span
                aria-hidden="true"
                className="absolute top-8 bottom-1 left-3.5 w-px -translate-x-1/2 bg-border"
              />
              <Avatar initials={comment.initials} tone={comment.tone} />
              <div className="min-w-0 flex-1">
                <p className="flex items-baseline gap-2 text-xs">
                  <span className="font-semibold">{comment.name}</span>
                  <span className="text-muted-foreground">{comment.time}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {comment.mention && (
                    <span className="mr-1 rounded bg-highlight-soft px-1 py-0.5 font-medium text-highlight-foreground">
                      {comment.mention}
                    </span>
                  )}
                  {comment.text}
                </p>
              </div>
            </motion.li>
          ))}

          {/*
            The reply and its "is typing" moment share one slot, so the card
            keeps the same height before and after the reply arrives.
          */}
          <li className="relative flex gap-3 pb-5">
            <motion.span
              className="flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: typing || replied ? 1 : 0 }}
              transition={tween(0.3)}
            >
              <Avatar initials={reply.initials} tone={reply.tone} />
            </motion.span>

            <div className="grid min-w-0 flex-1">
              <motion.div
                className="[grid-area:1/1]"
                aria-hidden={!replied}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: replied ? 1 : 0, y: replied ? 0 : 6 }}
                transition={tween(0.4)}
              >
                <p className="flex items-baseline gap-2 text-xs">
                  <span className="font-semibold">{reply.name}</span>
                  <span className="text-muted-foreground">{reply.time}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {reply.text}
                </p>
              </motion.div>

              <motion.p
                className="flex items-center gap-2 self-start text-xs text-muted-foreground [grid-area:1/1]"
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: typing ? 1 : 0 }}
                transition={tween(0.3)}
              >
                <span>{reply.name.split(" ")[0]} is typing</span>
                <span className="flex items-center gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.span
                      key={dot}
                      className="size-1 rounded-full bg-muted-foreground"
                      animate={typing ? { opacity: [0.25, 1, 0.25] } : undefined}
                      transition={{
                        duration: 1.2,
                        delay: dot * 0.18,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </span>
              </motion.p>
            </div>
          </li>
        </ul>

        {/* Reply box. A static mock, so it is hidden from assistive technology. */}
        <div className="border-t px-4 py-3 sm:px-5" aria-hidden="true">
          <div className="flex items-center gap-2.5 rounded-lg border bg-card py-1.5 pr-1.5 pl-3 text-sm text-muted-foreground">
            <span className="min-w-0 flex-1 truncate">
              {content.composerPlaceholder}
            </span>
            <IconAt className="size-4 shrink-0" stroke={1.75} />
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <IconSend className="size-3.5" stroke={2} />
            </span>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
