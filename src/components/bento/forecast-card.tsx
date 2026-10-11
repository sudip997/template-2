"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { IconArrowUpRight, IconChartLine } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BentoCard } from "./bento-card";
import {
  ForecastChart,
  type ActualPoint,
  type ForecastPoint,
} from "./forecast-chart";
import { EASE_OUT } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content and mock data. Replace with your own product copy and numbers.    */
/*  Values are monthly recurring revenue in $K.                               */
/* -------------------------------------------------------------------------- */

const content = {
  title: "Forecast with confidence",
  description:
    "Scenario-based forecasts refresh daily from your live data, with a clear range around every number, so planning never starts from a guess.",
  figureLabel: "Projected Q4 revenue",
  comparison: "vs Q3",
  rangeLabel: "Likely range",
  todayLabel: "Today",
  endLabel: "Dec 31",
} as const;

/** The last 90 days, 12 evenly spaced points. Day 0 is today. */
const actual: ActualPoint[] = [
  366.9, 372.4, 380.0, 388.5, 396.1, 404.7, 418.2, 431.0, 447.3, 461.8, 473.5,
  482.9,
].map((value, index) => ({ day: Math.round(-90 + index * (90 / 11)), value }));

/** Days after today where the forecast has a point. */
const forecastDays = [0, 14, 28, 42, 56, 70, 81];

type Scenario = {
  label: string;
  /** Headline figure and how it compares with the previous quarter. */
  total: string;
  change: string;
  range: string;
  /** One value and one confidence spread per entry in `forecastDays`. */
  values: number[];
  spreads: number[];
};

const scenarios = {
  base: {
    label: "Base",
    total: "$1.52M",
    change: "+26%",
    range: "$1.47M – $1.57M",
    values: [482.9, 491, 499, 508, 517, 527, 535],
    spreads: [0, 2, 4, 6.5, 9, 12, 14.5],
  },
  upside: {
    label: "Upside",
    total: "$1.56M",
    change: "+29%",
    range: "$1.50M – $1.62M",
    values: [482.9, 495, 508, 522, 537, 553, 566],
    spreads: [0, 2.5, 5, 7.5, 10.5, 14, 17],
  },
  downside: {
    label: "Downside",
    total: "$1.48M",
    change: "+22%",
    range: "$1.44M – $1.52M",
    values: [482.9, 487, 491, 494, 498, 501, 504],
    spreads: [0, 1.5, 3, 4.5, 6.5, 8.5, 10],
  },
} satisfies Record<string, Scenario>;

type ScenarioKey = keyof typeof scenarios;
const scenarioKeys = Object.keys(scenarios) as ScenarioKey[];

const chartConfig = {
  domain: { minDay: -90, maxDay: 81, minValue: 350, maxValue: 600 },
  yTicks: [400, 500, 600],
  xTicks: [
    { day: -71, label: "Aug" },
    { day: -40, label: "Sep" },
    { day: -10, label: "Oct" },
    { day: 21, label: "Nov" },
    { day: 51, label: "Dec" },
  ],
};

const formatValue = (value: number) => `$${Math.round(value)}K`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ForecastCard({ className }: { className?: string }) {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("base");
  const scenario = scenarios[scenarioKey];

  const forecast: ForecastPoint[] = forecastDays.map((day, index) => ({
    day,
    value: scenario.values[index],
    spread: scenario.spreads[index],
  }));

  return (
    <BentoCard
      icon={IconChartLine}
      title={content.title}
      description={content.description}
      className={className}
    >
      {/* Product visual. It sits flush with the bottom edge of the card. */}
      <div
        role="group"
        aria-label="Revenue forecast preview"
        className="mx-6 mt-auto rounded-t-xl border border-b-0 bg-background sm:mx-8"
      >
        <div className="flex flex-col gap-4 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:pt-5">
          {/* Headline figure */}
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {content.figureLabel}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <motion.span
                key={`total-${scenarioKey}`}
                className="font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                {scenario.total}
              </motion.span>
              <motion.span
                key={`change-${scenarioKey}`}
                className="inline-flex items-center gap-0.5 rounded-md bg-highlight-soft px-1.5 py-0.5 text-xs font-medium text-highlight-foreground"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: EASE_OUT }}
              >
                <IconArrowUpRight
                  className="size-3.5"
                  stroke={2}
                  aria-hidden="true"
                />
                {scenario.change} {content.comparison}
              </motion.span>
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground tabular-nums">
              {content.rangeLabel} {scenario.range}
            </p>
          </div>

          {/* Scenario selector */}
          <div
            role="group"
            aria-label="Forecast scenario"
            className="flex shrink-0 self-start rounded-lg border bg-muted p-0.5"
          >
            {scenarioKeys.map((key) => {
              const active = key === scenarioKey;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setScenarioKey(key)}
                  className={cn(
                    "relative rounded-md px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="bento-scenario-pill"
                      className="absolute inset-0 rounded-md bg-card shadow-sm ring-1 ring-border"
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    />
                  )}
                  <span className="relative">{scenarios[key].label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pb-5 sm:px-5 sm:pb-6">
          {/* Legend */}
          <ul
            className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground"
            aria-hidden="true"
          >
            <li className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 rounded-full bg-foreground" />
              Actual
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-0 w-3 border-t-2 border-dashed border-highlight" />
              Forecast
            </li>
            <li className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-highlight/20 ring-1 ring-highlight/30" />
              Range
            </li>
          </ul>

          <p className="sr-only" aria-live="polite">
            {`${scenario.label} scenario: projected Q4 revenue ${scenario.total}, ${scenario.change} ${content.comparison}, likely range ${scenario.range}.`}
          </p>

          <ForecastChart
            actual={actual}
            forecast={forecast}
            domain={chartConfig.domain}
            yTicks={chartConfig.yTicks}
            xTicks={chartConfig.xTicks}
            todayLabel={content.todayLabel}
            endLabel={content.endLabel}
            formatValue={formatValue}
          />
        </div>
      </div>
    </BentoCard>
  );
}
