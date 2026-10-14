"use client";

import { useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { tween } from "./motion";
import { PreviewFrame, PreviewStage } from "./preview-frame";

/* -------------------------------------------------------------------------- */
/*  Content and mock data. Replace with your own model and numbers.           */
/* -------------------------------------------------------------------------- */

const content = {
  title: "Forecast model",
  result: "MRR in 12 months",
  reset: "Reset",
} as const;

/** Monthly recurring revenue today, in $K. Matches the hero dashboard. */
const BASE_MRR = 482.9;
const MONTHS = 12;
/** Top of the chart, in $K. Fixed, so moving a slider visibly moves the bars. */
const DOMAIN_MAX = 1300;

type Key = "growth" | "expansion" | "churn";
type Values = Record<Key, number>;

type Assumption = {
  key: Key;
  label: string;
  min: number;
  max: number;
  step: number;
};

const assumptions: Assumption[] = [
  { key: "growth", label: "New customer growth", min: 1, max: 6, step: 0.1 },
  { key: "expansion", label: "Expansion revenue", min: 0, max: 3, step: 0.1 },
  { key: "churn", label: "Monthly churn", min: 0.5, max: 4, step: 0.1 },
];

/** Starting scenario, in % per month. */
const defaults: Values = { growth: 3, expansion: 1, churn: 1.5 };

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/** MRR for each of the next 12 months, compounding at the net monthly rate. */
function project(values: Values) {
  const net = (values.growth + values.expansion - values.churn) / 100;
  return Array.from(
    { length: MONTHS },
    (_, index) => BASE_MRR * Math.pow(1 + net, index + 1),
  );
}

const formatMrr = (valueInK: number) =>
  valueInK >= 1000
    ? `$${(valueInK / 1000).toFixed(2)}M`
    : `$${Math.round(valueInK)}K`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ForecastPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const uid = useId();

  const [values, setValues] = useState<Values>(defaults);
  // Bars rise one after another the first time, then follow the sliders directly.
  const [touched, setTouched] = useState(false);

  const show = inView || Boolean(reduceMotion);
  const series = project(values);
  const end = series[MONTHS - 1];
  const change = (end / BASE_MRR - 1) * 100;
  const rising = change >= 0;
  const changed = assumptions.some(({ key }) => values[key] !== defaults[key]);
  const changeLabel = `${rising ? "+" : "−"}${Math.abs(change).toFixed(1)}%`;
  const DeltaIcon = rising ? IconArrowUpRight : IconArrowDownRight;

  return (
    <div ref={ref}>
      <PreviewStage>
        <PreviewFrame
          label="Forecast assumptions preview"
          title={content.title}
          meta={
            <button
              type="button"
              disabled={!changed}
              onClick={() => {
                setTouched(true);
                setValues(defaults);
              }}
              className="rounded-md border bg-card px-2 py-1 text-xs font-medium text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40"
            >
              {content.reset}
            </button>
          }
        >
          {/* Result */}
          <div className="px-4 pt-4 sm:px-5">
            <p className="text-xs text-muted-foreground">{content.result}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <span className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
                {formatMrr(end)}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium transition-colors duration-300",
                  rising
                    ? "bg-highlight-soft text-highlight-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <DeltaIcon className="size-3.5" stroke={2} aria-hidden="true" />
                {changeLabel}
              </span>
            </p>
            <p className="sr-only" aria-live="polite">
              {`Projected MRR in 12 months: ${formatMrr(end)}, ${changeLabel} from today.`}
            </p>
          </div>

          {/* Projection: one bar per month, the last one highlighted */}
          <div className="px-4 pt-5 sm:px-5" aria-hidden="true">
            <div className="flex h-28 items-end gap-1 border-b sm:gap-1.5">
              {series.map((value, index) => (
                <div key={index} className="flex h-full flex-1 items-end">
                  <motion.div
                    className={cn(
                      "w-full rounded-t-sm",
                      index === MONTHS - 1 ? "bg-highlight" : "bg-primary/15",
                    )}
                    initial={{ height: "0%" }}
                    animate={{
                      height: show ? `${(value / DOMAIN_MAX) * 100}%` : "0%",
                    }}
                    transition={tween(
                      reduceMotion,
                      touched ? 0.3 : 0.6,
                      touched ? 0 : 0.15 + index * 0.04,
                    )}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[0.6875rem] text-muted-foreground">
              <span>Month 1</span>
              <span>Month 12</span>
            </div>
          </div>

          {/* Assumptions */}
          <div className="mt-5 space-y-4 border-t px-4 py-4 sm:px-5">
            {assumptions.map((assumption) => {
              const id = `${uid}-${assumption.key}`;
              return (
                <div key={assumption.key}>
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <label htmlFor={id} className="font-medium">
                      {assumption.label}
                    </label>
                    <output
                      htmlFor={id}
                      className="text-muted-foreground tabular-nums"
                    >
                      {values[assumption.key].toFixed(1)}% / month
                    </output>
                  </div>
                  <input
                    id={id}
                    type="range"
                    min={assumption.min}
                    max={assumption.max}
                    step={assumption.step}
                    value={values[assumption.key]}
                    onChange={(event) => {
                      setTouched(true);
                      setValues((current) => ({
                        ...current,
                        [assumption.key]: Number(event.target.value),
                      }));
                    }}
                    className="mt-2 h-1.5 w-full cursor-pointer accent-highlight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  />
                </div>
              );
            })}
          </div>
        </PreviewFrame>
      </PreviewStage>
    </div>
  );
}
