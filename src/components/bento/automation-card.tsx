"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  IconBellRinging,
  IconBolt,
  IconCheck,
  IconChecklist,
  IconFilter,
  IconMail,
  IconRefresh,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BentoCard } from "./bento-card";
import { FlowStreak } from "./flow-streak";
import { EASE_OUT } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content. Edit this object to customise the copy of the card and the rule. */
/* -------------------------------------------------------------------------- */

const content = {
  title: "Let the numbers come to you",
  description:
    "Set a threshold once. Your team is alerted in the tools they already use the moment a metric moves, with the context to act on it.",
  rule: {
    name: "Retention drop alert",
    meta: "Checked hourly · last run 2 min ago",
  },
  stats: [
    { label: "Active rules", value: "12" },
    { label: "Runs this month", value: "1,284" },
    { label: "Median alert time", value: "38s" },
  ],
  trigger: {
    label: "When",
    text: "Every hour",
    detail: "Net retention is recalculated",
  },
  condition: {
    label: "If",
    text: "Net retention drops below",
    threshold: "110%",
    live: "Live",
    healthy: { value: "118%", status: "Not met" },
    breached: { value: "108%", status: "Condition met" },
  },
  actionsLabel: "Then",
  actions: [
    { icon: IconBellRinging, title: "Alert #revenue", status: "Sent" },
    { icon: IconChecklist, title: "Task for Finance", status: "Created" },
    { icon: IconMail, title: "Weekly digest", status: "Queued" },
  ],
  toast: {
    title: "Net retention fell below 110%",
    body: "Now at 108%, down 2.0 pt this week. #revenue was alerted and a task was created for Finance.",
    time: "now",
  },
  /** Read by screen readers instead of the animated walkthrough. */
  summary:
    "Example automation: every hour, when net retention drops below 110%, alert #revenue, create a task for Finance and schedule a weekly digest.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Timing                                                                    */
/*                                                                            */
/*  The walkthrough loops while the card is on screen. Stage 0 is the quiet   */
/*  start, stages 1 to 3 light up the trigger, the condition and the actions, */
/*  and stage 4 shows the notification before the loop begins again.          */
/*  Gradients flow down the connectors near the end of the stage before the   */
/*  step they lead to, so they arrive just as it lights up. Values are in     */
/*  seconds.                                                                  */
/* -------------------------------------------------------------------------- */

const STAGE_SECONDS = [1.8, 2.0, 3.2, 2.4, 3.6];
const LAST_STAGE = STAGE_SECONDS.length - 1;
/** Time a gradient takes to cross the line from the trigger to the condition. */
const TRIGGER_HOP = 0.8;
/** Time it takes to cross each stretch of line inside the fork. */
const HOP = 0.5;
/** Delay inside `stage` so the last `hopsToGo` hops finish as the stage ends. */
const hopDelay = (stage: number, hopsToGo: number) =>
  STAGE_SECONDS[stage] - hopsToGo * HOP;

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

type TileProps = {
  icon: Icon;
  /** The step has been reached, so the tile turns warm. */
  lit: boolean;
  className?: string;
};

/** Square icon tile. A gradient fades in over the neutral base when lit. */
function Tile({ icon: TileIcon, lit, className }: TileProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-muted-foreground transition-colors duration-500",
        lit && "text-highlight-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "absolute inset-0 bg-linear-to-br from-highlight-soft to-highlight/30 transition-opacity duration-500",
          lit ? "opacity-100" : "opacity-0",
        )}
      />
      <TileIcon className="relative size-[1.125rem]" stroke={1.75} />
    </span>
  );
}

type LineProps = {
  /** The run has already passed through this line. */
  lit: boolean;
  className?: string;
  /** A `FlowStreak`, while one is travelling. */
  children?: ReactNode;
};

/** A 2px connector. The streak inside it is clipped to the line's length. */
function Line({ lit, className, children }: LineProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block overflow-hidden transition-colors duration-500",
        lit ? "bg-highlight/40" : "bg-border",
        className,
      )}
    >
      {children}
    </span>
  );
}

type StepProps = {
  icon: Icon;
  label: string;
  reached: boolean;
  /** The step is the one being processed right now. */
  active: boolean;
  /** Content on the right, vertically centred. */
  aside?: ReactNode;
  children: ReactNode;
};

/** A node in the flow: icon tile, small label, and its text. */
function Step({ icon, label, reached, active, aside, children }: StepProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-sm items-start gap-3 rounded-xl border bg-card p-3.5 shadow-sm transition-[border-color,box-shadow] duration-500",
        active
          ? "border-highlight/40 shadow-md shadow-highlight/10"
          : "hover:border-foreground/25",
      )}
    >
      <Tile icon={icon} lit={reached} className="size-9" />
      <div className="min-w-0 flex-1">
        <p className="text-[0.6875rem] font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </p>
        {children}
      </div>
      {aside && <div className="shrink-0 self-center">{aside}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function AutomationCard({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const ruleNameId = useId();
  const inView = useInView(ref, { once: true, amount: 0.4 });
  // Follows the card in and out of the viewport, so the loop only runs while
  // someone can actually see it.
  const onScreen = useInView(ref, { amount: 0.1 });
  const reduceMotion = useReducedMotion();

  const [enabled, setEnabled] = useState(true);
  const [stage, setStage] = useState(0);

  const show = inView || Boolean(reduceMotion);
  const tween = (duration: number, delay = 0) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE_OUT };

  // Advance to the next stage after the current one has played out.
  const running = enabled && inView && onScreen && !reduceMotion;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setStage((previous) => (previous + 1) % STAGE_SECONDS.length),
      STAGE_SECONDS[stage] * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [running, stage]);

  // A paused rule stays quiet. People who prefer reduced motion get the
  // finished state (condition met, notification sent) without any looping.
  const current = !enabled ? 0 : reduceMotion ? LAST_STAGE : stage;
  const breached = current >= 2;
  const reading = breached
    ? content.condition.breached
    : content.condition.healthy;
  /** True while gradients should be flowing during `stageNumber`. */
  const flowsIn = (stageNumber: number) =>
    !reduceMotion && current === stageNumber;

  const toggle = () => {
    setEnabled((value) => !value);
    setStage(0);
  };

  return (
    <BentoCard
      icon={IconBolt}
      title={content.title}
      description={content.description}
      className={className}
    >
      {/* Product visual. It fills the rest of the card and sits flush with the bottom edge. */}
      <div
        ref={ref}
        role="group"
        aria-label="Automation rule preview"
        className="mx-6 flex flex-1 flex-col rounded-t-xl border border-b-0 bg-linear-to-b from-background to-muted/40 shadow-sm sm:mx-8"
      >
        {/* Rule header with an on/off switch */}
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <p id={ruleNameId} className="truncate text-sm font-semibold">
              {content.rule.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {content.rule.meta}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={enabled}
            aria-labelledby={ruleNameId}
            onClick={toggle}
            className="inline-flex shrink-0 items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <span
              aria-hidden="true"
              className="hidden text-xs text-muted-foreground sm:inline"
            >
              {enabled ? "Active" : "Paused"}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors duration-300",
                enabled
                  ? "bg-highlight"
                  : "bg-muted ring-1 ring-border ring-inset",
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 size-4 rounded-full bg-card shadow-sm transition-transform duration-300",
                  enabled && "translate-x-4",
                )}
              />
            </span>
          </button>
        </div>

        {/* Numbers for the whole workspace, in the same style as the hero */}
        <dl className="grid grid-cols-3 divide-x divide-border border-b">
          {content.stats.map((stat) => (
            <div key={stat.label} className="min-w-0 px-3 py-3 sm:px-5">
              <dt className="truncate text-xs text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-0.5 font-heading text-lg font-semibold tracking-tight tabular-nums sm:text-xl">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="sr-only">{content.summary}</p>

        {/* The workflow: trigger, condition, then a fork into three actions */}
        <div
          className={cn(
            "flex flex-col items-center px-4 pt-6 transition-opacity duration-500 sm:px-5",
            !enabled && "opacity-60",
          )}
        >
          <motion.div
            className="flex w-full justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
            transition={tween(0.7, 0.1)}
          >
            <Step
              icon={IconRefresh}
              label={content.trigger.label}
              reached={current >= 1}
              active={current === 1}
            >
              <p className="mt-0.5 text-sm font-medium">
                {content.trigger.text}
              </p>
              <p className="text-xs text-muted-foreground">
                {content.trigger.detail}
              </p>
            </Step>
          </motion.div>

          <Line lit={current >= 2} className="h-6 w-0.5">
            {flowsIn(1) && (
              <FlowStreak
                axis="y"
                loop={false}
                duration={TRIGGER_HOP}
                delay={STAGE_SECONDS[1] - TRIGGER_HOP}
              />
            )}
          </Line>

          <motion.div
            className="flex w-full justify-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
            transition={tween(0.7, 0.35)}
          >
            <Step
              icon={IconFilter}
              label={content.condition.label}
              reached={current >= 2}
              active={current === 2}
              aside={
                <div className="text-right">
                  <p className="text-[0.6875rem] text-muted-foreground">
                    {content.condition.live}
                  </p>
                  <motion.p
                    key={reading.value}
                    className={cn(
                      "font-heading text-lg leading-tight font-semibold tabular-nums transition-colors duration-500",
                      breached && "text-highlight-foreground",
                    )}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={tween(0.4)}
                  >
                    {reading.value}
                  </motion.p>
                  <p
                    className={cn(
                      "text-[0.6875rem] transition-colors duration-500",
                      breached
                        ? "font-medium text-highlight-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {reading.status}
                  </p>
                </div>
              }
            >
              <p className="mt-0.5 text-sm">
                {content.condition.text}{" "}
                <span className="rounded-md border bg-background px-1.5 py-0.5 text-xs font-medium tabular-nums">
                  {content.condition.threshold}
                </span>
              </p>
            </Step>
          </motion.div>

          {/* Trunk down from the condition */}
          <Line lit={current >= 3} className="h-5 w-0.5">
            {flowsIn(2) && (
              <FlowStreak
                axis="y"
                loop={false}
                duration={HOP}
                delay={hopDelay(2, 4)}
              />
            )}
          </Line>

          {/*
            The fork. Each cell draws its own part of the bar and its own stub,
            so the lines line up with the three actions at any width.
          */}
          <ul className="grid w-full grid-cols-3">
            {content.actions.map((action, index) => {
              const first = index === 0;
              const last = index === content.actions.length - 1;
              const middle = !first && !last;
              const ActionIcon = action.icon;
              const done = current >= 3;

              return (
                <motion.li
                  key={action.title}
                  className="relative min-w-0 pt-6"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
                  transition={tween(0.7, 0.6 + index * 0.12)}
                >
                  {/* Bar, flowing outwards from the centre of the fork */}
                  {(middle || last) && (
                    <Line
                      lit={current >= 3}
                      className="absolute top-0 left-0 h-0.5 w-1/2"
                    >
                      {flowsIn(2) && (
                        <FlowStreak
                          reverse={middle}
                          loop={false}
                          duration={HOP}
                          delay={hopDelay(2, middle ? 3 : 2)}
                        />
                      )}
                    </Line>
                  )}
                  {(middle || first) && (
                    <Line
                      lit={current >= 3}
                      className="absolute top-0 left-1/2 h-0.5 w-1/2"
                    >
                      {flowsIn(2) && (
                        <FlowStreak
                          reverse={first}
                          loop={false}
                          duration={HOP}
                          delay={hopDelay(2, middle ? 3 : 2)}
                        />
                      )}
                    </Line>
                  )}

                  {/* Stub down to the action */}
                  <Line
                    lit={current >= 3}
                    className="absolute top-0 left-1/2 h-6 w-0.5 -translate-x-1/2"
                  >
                    {flowsIn(2) && (
                      <FlowStreak
                        axis="y"
                        loop={false}
                        duration={HOP}
                        delay={hopDelay(2, middle ? 3 : 1)}
                      />
                    )}
                  </Line>

                  <div
                    className={cn(
                      "mx-1 flex h-full flex-col gap-2 rounded-xl border bg-card p-2.5 shadow-sm transition-[border-color,box-shadow] duration-500 sm:mx-1.5 sm:p-3",
                      done
                        ? "border-highlight/40 shadow-md shadow-highlight/10"
                        : "hover:border-foreground/25",
                    )}
                  >
                    <Tile icon={ActionIcon} lit={done} className="size-8" />
                    <p className="text-xs leading-snug font-medium sm:text-sm">
                      {action.title}
                    </p>
                    <p
                      aria-hidden="true"
                      className={cn(
                        "mt-auto flex items-center gap-1 text-[0.6875rem] font-medium text-highlight-foreground transition-opacity duration-500",
                        done ? "opacity-100" : "opacity-0",
                      )}
                      style={{
                        transitionDelay: done ? `${0.3 + index * 0.5}s` : "0s",
                      }}
                    >
                      <IconCheck className="size-3" stroke={2.5} />
                      {action.status}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Notification. Its space is always reserved, so the card never jumps. */}
        <div className="mt-auto px-4 pt-5 pb-5 sm:px-5" aria-hidden="true">
          <motion.div
            className="flex items-start gap-3 rounded-xl border border-highlight/30 bg-linear-to-br from-card to-highlight-soft/50 p-3.5 shadow-lg shadow-black/5"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: current >= 4 ? 1 : 0,
              y: current >= 4 ? 0 : 12,
            }}
            transition={tween(0.7)}
          >
            <Tile icon={IconBellRinging} lit className="size-9" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">{content.toast.title}</p>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {content.toast.time}
                </p>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {content.toast.body}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </BentoCard>
  );
}
