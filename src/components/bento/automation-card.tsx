"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  IconBell,
  IconBellRinging,
  IconBolt,
  IconCheck,
  IconChecklist,
  IconClock,
  IconFilter,
  IconRefresh,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BentoCard } from "./bento-card";
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
  trigger: {
    label: "When",
    text: "Net retention is recalculated",
    schedule: "Every hour",
  },
  condition: {
    label: "If",
    text: "Net retention drops below",
    threshold: "110%",
    live: "Live",
    healthy: { value: "118%", status: "Not met" },
    breached: { value: "108%", status: "Condition met" },
  },
  actions: {
    label: "Then",
    items: [
      {
        icon: IconBell,
        text: "Send an alert to",
        target: "#revenue",
        done: "Sent",
      },
      {
        icon: IconChecklist,
        text: "Create a task for",
        target: "Finance",
        done: "Created",
      },
    ],
  },
  toast: {
    title: "Net retention fell below 110%",
    body: "Now at 108%, down 2.0 pt this week. #revenue was notified and a task was created for Finance.",
    time: "now",
  },
  /** Read by screen readers instead of the animated walkthrough. */
  summary:
    "Example automation: every hour, when net retention drops below 110%, send an alert to #revenue and create a task for Finance.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Timing                                                                    */
/*                                                                            */
/*  The walkthrough loops while the card is on screen. Stage 0 is the quiet   */
/*  start, stages 1 to 3 light up each step in turn, and stage 4 shows the    */
/*  notification before the loop begins again. Values are in seconds.         */
/* -------------------------------------------------------------------------- */

const STAGE_SECONDS = [1.8, 1.6, 2.2, 2.4, 3.6];
const LAST_STAGE = STAGE_SECONDS.length - 1;
/**
 * Time a signal takes to cross a connector. Signals leave near the end of the
 * stage before, so they arrive just as the next step lights up.
 */
const SIGNAL_SECONDS = 0.8;
const signalDelay = (stage: number) => STAGE_SECONDS[stage] - SIGNAL_SECONDS;

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                           */
/* -------------------------------------------------------------------------- */

type StepProps = {
  icon: Icon;
  label: string;
  /** The step has been reached in the current run. */
  reached: boolean;
  /** The step is the one being processed right now. */
  active: boolean;
  /** Content on the right, vertically centred. */
  aside?: ReactNode;
  children: ReactNode;
};

function Step({
  icon: StepIcon,
  label,
  reached,
  active,
  aside,
  children,
}: StepProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-3.5 transition-colors duration-500",
        active ? "border-highlight/40" : "hover:border-foreground/25",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-500",
          reached
            ? "bg-highlight-soft text-highlight-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        <StepIcon className="size-[1.125rem]" stroke={1.75} />
      </span>
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

type ConnectorProps = {
  /** The run has already passed through this connector. */
  lit: boolean;
  /** A signal is crossing it during the current stage. */
  travelling: boolean;
  /** Seconds to wait inside the stage before the signal sets off. */
  delay?: number;
};

/** Vertical line between two steps, lined up with the centre of the step icons. */
function Connector({ lit, travelling, delay = 0 }: ConnectorProps) {
  return (
    <div aria-hidden="true" className="relative h-6">
      <span
        className={cn(
          "absolute inset-y-0 left-8.25 w-px -translate-x-1/2 transition-colors duration-500",
          lit ? "bg-highlight/50" : "bg-border",
        )}
      />
      {travelling && (
        <motion.span
          className="absolute left-8.25 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight"
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
          transition={{ duration: SIGNAL_SECONDS, delay, ease: "easeInOut" }}
        />
      )}
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
        className="mx-6 flex flex-1 flex-col rounded-t-xl border border-b-0 bg-background sm:mx-8"
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

        <p className="sr-only">{content.summary}</p>

        {/* Steps */}
        <ol
          className={cn(
            "px-4 pt-5 transition-opacity duration-500 sm:px-5",
            !enabled && "opacity-60",
          )}
        >
          <motion.li
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
            transition={tween(0.7, 0.1)}
          >
            <Step
              icon={IconRefresh}
              label={content.trigger.label}
              reached={current >= 1}
              active={current === 1}
              aside={
                <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                  <IconClock
                    className="size-3.5"
                    stroke={1.75}
                    aria-hidden="true"
                  />
                  {content.trigger.schedule}
                </span>
              }
            >
              <p className="mt-1 text-sm">{content.trigger.text}</p>
            </Step>
          </motion.li>

          <li aria-hidden="true">
            <Connector
              lit={current >= 2}
              travelling={!reduceMotion && current === 1}
              delay={signalDelay(1)}
            />
          </li>

          <motion.li
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
            transition={tween(0.7, 0.4)}
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
              <p className="mt-1 text-sm">
                {content.condition.text}{" "}
                <span className="rounded-md border bg-background px-1.5 py-0.5 text-xs font-medium tabular-nums">
                  {content.condition.threshold}
                </span>
              </p>
            </Step>
          </motion.li>

          <li aria-hidden="true">
            <Connector
              lit={current >= 3}
              travelling={!reduceMotion && current === 2}
              delay={signalDelay(2)}
            />
          </li>

          <motion.li
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 12 }}
            transition={tween(0.7, 0.7)}
          >
            <Step
              icon={IconBellRinging}
              label={content.actions.label}
              reached={current >= 3}
              active={current === 3}
            >
              <ul className="mt-1 divide-y">
                {content.actions.items.map((item, index) => {
                  const ActionIcon = item.icon;
                  const done = current >= 3;
                  return (
                    <li
                      key={item.target}
                      className="flex items-center gap-2.5 py-2 first:pt-1 last:pb-0.5"
                    >
                      <ActionIcon
                        className="size-4 shrink-0 text-muted-foreground"
                        stroke={1.75}
                        aria-hidden="true"
                      />
                      <p className="min-w-0 flex-1 text-sm">
                        {item.text}{" "}
                        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium">
                          {item.target}
                        </span>
                      </p>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1 text-xs font-medium text-highlight-foreground transition-opacity duration-500",
                          done ? "opacity-100" : "opacity-0",
                        )}
                        style={{
                          transitionDelay: done
                            ? `${0.6 + index * 0.7}s`
                            : "0s",
                        }}
                      >
                        <IconCheck className="size-3.5" stroke={2.5} />
                        {item.done}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Step>
          </motion.li>
        </ol>

        {/* Notification. Its space is always reserved, so the card never jumps. */}
        <div className="mt-auto px-4 pb-5 sm:px-5" aria-hidden="true">
          <Connector
            lit={current >= 4}
            travelling={!reduceMotion && current === 3}
            delay={signalDelay(3)}
          />
          <motion.div
            className="flex items-start gap-3 rounded-xl border border-highlight/30 bg-card p-3.5 shadow-sm"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: current >= 4 ? 1 : 0,
              y: current >= 4 ? 0 : 12,
            }}
            transition={tween(0.7)}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-highlight-soft text-highlight-foreground">
              <IconBellRinging className="size-[1.125rem]" stroke={1.75} />
            </span>
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
