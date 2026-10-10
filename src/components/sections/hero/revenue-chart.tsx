"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "./motion";

// Internal drawing space. The SVG stretches to its container
// (`preserveAspectRatio="none"`) and strokes use `non-scaling-stroke`,
// so lines stay crisp at any width.
const WIDTH = 600;
const HEIGHT = 200;

type Point = { x: number; y: number };

type RevenueChartProps = {
	/** Values for the current period. Keep the same length as `previous`. */
	current: number[];
	/** Values for the comparison period. */
	previous: number[];
	/** Evenly spaced labels shown under the chart. */
	xLabels: string[];
	/** Label shown next to the latest value, e.g. "Today". */
	endLabel: string;
	formatValue: (value: number) => string;
};

function round(value: number) {
	return Math.round(value * 100) / 100;
}

/** Smooth line through the points (Catmull-Rom converted to cubic Béziers). */
function buildLinePath(points: Point[]) {
	let d = `M ${round(points[0].x)} ${round(points[0].y)}`;

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

export function RevenueChart({
	current,
	previous,
	xLabels,
	endLabel,
	formatValue,
}: RevenueChartProps) {
	// Round the axis to tidy 10-unit bounds so tick labels stay readable.
	const all = [...current, ...previous];
	const min = Math.min(...all);
	const max = Math.max(...all);
	const padding = (max - min) * 0.1;
	const lo = Math.floor((min - padding) / 10) * 10;
	const hi = Math.ceil((max + padding) / 10) * 10;

	const toPoints = (values: number[]): Point[] =>
		values.map((value, index) => ({
			x: (index / (values.length - 1)) * WIDTH,
			y: HEIGHT - ((value - lo) / (hi - lo)) * HEIGHT,
		}));

	const currentPoints = toPoints(current);
	const currentLine = buildLinePath(currentPoints);
	const previousLine = buildLinePath(toPoints(previous));
	const currentArea = `${currentLine} L ${WIDTH} ${HEIGHT} L 0 ${HEIGHT} Z`;

	const lastValue = current[current.length - 1];
	const endTop = `${(currentPoints[currentPoints.length - 1].y / HEIGHT) * 100}%`;

	// Top, middle and bottom axis ticks (0% = top of the plot).
	const ticks = [
		{ top: "0%", value: hi },
		{ top: "50%", value: (hi + lo) / 2 },
		{ top: "100%", value: lo },
	];

	return (
		<div className="pt-8">
			<div className="flex gap-3">
				{/* Y axis labels */}
				<div className="relative h-40 w-11 shrink-0 sm:h-48" aria-hidden="true">
					{ticks.map((tick) => (
						<span
							key={tick.top}
							className="absolute left-0 -translate-y-1/2 text-[0.6875rem] text-muted-foreground tabular-nums"
							style={{ top: tick.top }}
						>
							{formatValue(tick.value)}
						</span>
					))}
				</div>

				{/* Plot area */}
				<div className="relative mr-3 h-40 min-w-0 flex-1 sm:h-48">
					<svg
						viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
						preserveAspectRatio="none"
						className="size-full overflow-visible"
						aria-hidden="true"
					>
						<defs>
							<linearGradient id="hero-revenue-area" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="0%"
									style={{ stopColor: "var(--highlight)", stopOpacity: 0.28 }}
								/>
								<stop
									offset="100%"
									style={{ stopColor: "var(--highlight)", stopOpacity: 0 }}
								/>
							</linearGradient>
						</defs>

						{/* Gridlines */}
						{[0, HEIGHT / 2, HEIGHT].map((y) => (
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

						{/* Area under the current period */}
						<motion.path
							fill="url(#hero-revenue-area)"
							initial={{ opacity: 0, d: currentArea }}
							animate={{ opacity: 1, d: currentArea }}
							transition={{
								opacity: { duration: 0.8, delay: 0.7, ease: EASE_OUT },
								d: { duration: 0.6, ease: EASE_OUT },
							}}
						/>

						{/* Previous period (dashed) */}
						<motion.path
							fill="none"
							className="stroke-muted-foreground/60"
							strokeWidth={1.5}
							strokeDasharray="4 5"
							strokeLinecap="round"
							vectorEffect="non-scaling-stroke"
							initial={{ opacity: 0, d: previousLine }}
							animate={{ opacity: 1, d: previousLine }}
							transition={{
								opacity: { duration: 0.8, delay: 0.5, ease: EASE_OUT },
								d: { duration: 0.6, ease: EASE_OUT },
							}}
						/>

						{/* Current period */}
						<motion.path
							fill="none"
							className="stroke-foreground"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
							vectorEffect="non-scaling-stroke"
							initial={{ pathLength: 0, d: currentLine }}
							animate={{ pathLength: 1, d: currentLine }}
							transition={{
								pathLength: { duration: 1.2, delay: 0.35, ease: EASE_OUT },
								d: { duration: 0.6, ease: EASE_OUT },
							}}
						/>
					</svg>

					{/* Latest value marker (HTML so it never stretches with the SVG) */}
					<motion.div
						className="absolute right-0"
						initial={{ opacity: 0, top: endTop }}
						animate={{ opacity: 1, top: endTop }}
						transition={{
							opacity: { duration: 0.5, delay: 1.3 },
							top: { duration: 0.6, ease: EASE_OUT },
						}}
					>
						<span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-highlight ring-4 ring-card" />
						<span className="absolute right-0 bottom-full mb-3 flex translate-x-3 items-center gap-1.5 rounded-md border bg-card px-2 py-1 text-[0.6875rem] whitespace-nowrap shadow-sm">
							<span className="text-muted-foreground">{endLabel}</span>
							<span className="font-semibold text-foreground tabular-nums">
								{formatValue(lastValue)}
							</span>
						</span>
					</motion.div>
				</div>
			</div>

			{/* X axis labels */}
			<div
				className="mt-2 flex justify-between pr-3 pl-14 text-[0.6875rem] text-muted-foreground"
				aria-hidden="true"
			>
				{xLabels.map((label) => (
					<span key={label}>{label}</span>
				))}
			</div>
		</div>
	);
}
