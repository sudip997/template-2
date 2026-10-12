"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE_OUT } from "./motion";

// Internal drawing space. The SVG stretches to its container
// (`preserveAspectRatio="none"`) and strokes use `non-scaling-stroke`,
// so lines stay crisp at any width. Markers and labels are plain HTML
// positioned in percentages, so they never stretch with the SVG.
const WIDTH = 640;
const HEIGHT = 240;

export type ActualPoint = {
  /** Days relative to today. Negative values are in the past. */
  day: number;
  value: number;
};

export type ForecastPoint = {
  /** Days relative to today. The first point should sit on day 0. */
  day: number;
  value: number;
  /** Half-width of the confidence range around `value`. Use 0 on day 0. */
  spread: number;
};

export type Point = { x: number; y: number };

type ForecastChartProps = {
  actual: ActualPoint[];
  forecast: ForecastPoint[];
  domain: {
    minDay: number;
    maxDay: number;
    minValue: number;
    maxValue: number;
  };
  /** Values that get a gridline and a label on the y axis. */
  yTicks: number[];
  /** Month (or any period) labels, placed by day. */
  xTicks: { day: number; label: string }[];
  /** Label above the divider between actuals and forecast. */
  todayLabel: string;
  /** Label next to the last forecast value. */
  endLabel: string;
  formatValue: (value: number) => string;
};

function round(value: number) {
  return Math.round(value * 100) / 100;
}

/**
 * Smooth line through the points (Catmull-Rom converted to cubic Béziers).
 * Pass `startWithMove = false` to continue an existing path instead of
 * starting a new one, which is how the confidence band is closed.
 */
export function buildLinePath(points: Point[], startWithMove = true) {
  let d = `${startWithMove ? "M" : "L"} ${round(points[0].x)} ${round(points[0].y)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${round(c1x)} ${round(c1y)}, ${round(c2x)} ${round(c2y)}, ${round(p2.x)} ${round(p2.y)}`;
  }

  return d;
}

export function ForecastChart({
  actual,
  forecast,
  domain,
  yTicks,
  xTicks,
  todayLabel,
  endLabel,
  formatValue,
}: ForecastChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();

  // People who prefer reduced motion get the finished chart straight away.
  const show = inView || Boolean(reduceMotion);
  const tween = (duration: number, delay = 0) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: EASE_OUT };

  const { minDay, maxDay, minValue, maxValue } = domain;
  const toX = (day: number) => ((day - minDay) / (maxDay - minDay)) * WIDTH;
  const toY = (value: number) =>
    HEIGHT - ((value - minValue) / (maxValue - minValue)) * HEIGHT;
  const leftPct = (day: number) => `${(toX(day) / WIDTH) * 100}%`;
  const topPct = (value: number) => `${(toY(value) / HEIGHT) * 100}%`;

  const today = actual[actual.length - 1];
  const end = forecast[forecast.length - 1];
  const todayX = toX(today.day);

  // Actual period: line plus a faint fill underneath.
  const actualPoints = actual.map((p) => ({ x: toX(p.day), y: toY(p.value) }));
  const actualLine = buildLinePath(actualPoints);
  const actualArea = `${actualLine} L ${round(todayX)} ${HEIGHT} L ${round(actualPoints[0].x)} ${HEIGHT} Z`;

  // Forecast: centre line and the range band around it.
  const forecastLine = buildLinePath(
    forecast.map((p) => ({ x: toX(p.day), y: toY(p.value) })),
  );
  const upper = forecast.map((p) => ({
    x: toX(p.day),
    y: toY(p.value + p.spread),
  }));
  const lower = forecast
    .map((p) => ({ x: toX(p.day), y: toY(p.value - p.spread) }))
    .reverse();
  const forecastBand = `${buildLinePath(upper)} ${buildLinePath(lower, false)} Z`;

  // Revealing the forecast with a clip keeps its dashes intact while it "draws".
  const clipWidth = WIDTH - todayX + 16;

  return (
    <div ref={ref} className="pt-9">
      <div className="flex gap-3">
        {/* Y axis labels */}
        <div
          className="relative h-44 w-11 shrink-0 sm:h-56"
          aria-hidden="true"
        >
          {yTicks.map((tick) => (
            <span
              key={tick}
              className="absolute left-0 -translate-y-1/2 text-[0.6875rem] text-muted-foreground tabular-nums"
              style={{ top: topPct(tick) }}
            >
              {formatValue(tick)}
            </span>
          ))}
        </div>

        {/* Plot area */}
        <div className="relative mr-3 h-44 min-w-0 flex-1 sm:h-56">
          {/* Forecast zone: a quiet tint so the future reads as a different space */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 bg-muted/50"
            style={{ left: leftPct(today.day) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={tween(0.6, 0.9)}
          />

          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="none"
            className="relative size-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="bento-forecast-actual-area"
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
              <clipPath id="bento-forecast-reveal">
                <motion.rect
                  x={round(todayX)}
                  y={-12}
                  height={HEIGHT + 24}
                  initial={{ width: 0 }}
                  animate={{ width: show ? round(clipWidth) : 0 }}
                  transition={tween(1, 1)}
                />
              </clipPath>
            </defs>

            {/* Gridlines and baseline */}
            {[...yTicks.map(toY), HEIGHT].map((y) => (
              <line
                key={y}
                x1={0}
                x2={WIDTH}
                y1={y}
                y2={y}
                className="stroke-border"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Actual period */}
            <motion.path
              d={actualArea}
              fill="url(#bento-forecast-actual-area)"
              initial={{ opacity: 0 }}
              animate={{ opacity: show ? 1 : 0 }}
              transition={tween(0.8, 0.5)}
            />
            <motion.path
              d={actualLine}
              fill="none"
              className="stroke-foreground"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: show ? 1 : 0 }}
              transition={tween(1.2, 0.15)}
            />

            {/* Forecast: range band and dashed centre line */}
            <g clipPath="url(#bento-forecast-reveal)">
              <motion.path
                className="fill-highlight/15"
                initial={{ d: forecastBand }}
                animate={{ d: forecastBand }}
                transition={tween(0.6)}
              />
              <motion.path
                fill="none"
                className="stroke-highlight"
                strokeWidth={2}
                strokeDasharray="5 6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ d: forecastLine }}
                animate={{ d: forecastLine }}
                transition={tween(0.6)}
              />
            </g>
          </svg>

          {/* Divider between what happened and what is projected */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 border-l border-dashed border-muted-foreground/40"
            style={{ left: leftPct(today.day) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={tween(0.6, 0.9)}
          />
          <motion.span
            aria-hidden="true"
            className="absolute top-0 -mt-2 -translate-x-1/2 -translate-y-full rounded-md border bg-card px-2 py-0.5 text-[0.6875rem] font-medium whitespace-nowrap shadow-sm"
            style={{ left: leftPct(today.day) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={tween(0.6, 0.9)}
          >
            {todayLabel}
          </motion.span>

          {/* Marker on the latest actual value */}
          <motion.span
            aria-hidden="true"
            className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground ring-4 ring-background"
            style={{ left: leftPct(today.day), top: topPct(today.value) }}
            initial={{ opacity: 0 }}
            animate={{ opacity: show ? 1 : 0 }}
            transition={tween(0.5, 1)}
          />

          {/* Marker on the end of the forecast. It glides when the scenario changes. */}
          <motion.div
            aria-hidden="true"
            className="absolute right-0"
            initial={{ opacity: 0, top: topPct(end.value) }}
            animate={{ opacity: show ? 1 : 0, top: topPct(end.value) }}
            transition={{
              opacity: tween(0.5, 1.9),
              top: tween(0.6),
            }}
          >
            <span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight ring-4 ring-background" />
            <span className="absolute right-0 bottom-full mb-3 flex translate-x-3 items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[0.6875rem] whitespace-nowrap shadow-sm">
              <span className="text-muted-foreground">{endLabel}</span>
              <span className="font-semibold text-foreground tabular-nums">
                {formatValue(end.value)}
              </span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* X axis labels, aligned with the plot area above */}
      <div
        className="relative mt-3 mr-3 ml-14 h-4 text-[0.6875rem] text-muted-foreground"
        aria-hidden="true"
      >
        {xTicks.map((tick) => (
          <span
            key={tick.label}
            className="absolute -translate-x-1/2"
            style={{ left: leftPct(tick.day) }}
          >
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
}
