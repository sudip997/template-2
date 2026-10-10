"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, RefreshCw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { EASE_OUT } from "./motion";
import { RevenueChart } from "./revenue-chart";

/* -------------------------------------------------------------------------- */
/*  Mock data. Replace with your own product numbers and copy.                */
/* -------------------------------------------------------------------------- */

const RANGES = ["7D", "30D", "90D"] as const;
type Range = (typeof RANGES)[number];

type RangeData = {
	/** Monthly recurring revenue in $K, 12 points each. */
	current: number[];
	previous: number[];
	xLabels: string[];
	deltas: { mrr: string; users: string; retention: string };
	summary: string;
};

const rangeData: Record<Range, RangeData> = {
	"7D": {
		current: [468.2, 469.0, 470.4, 470.1, 473.8, 475.2, 476.9, 478.0, 479.6, 480.8, 481.7, 482.9],
		previous: [462.0, 462.7, 463.1, 464.5, 464.2, 465.9, 467.0, 467.4, 468.8, 469.1, 470.3, 471.0],
		xLabels: ["7d ago", "5d ago", "2d ago", "Today"],
		deltas: { mrr: "+2.1%", users: "+1.4%", retention: "+0.6 pt" },
		summary: "Monthly recurring revenue grew 2.1% over the last 7 days to $482.9K.",
	},
	"30D": {
		current: [431.4, 436.2, 441.0, 439.6, 448.3, 455.1, 459.8, 466.5, 470.2, 474.9, 478.3, 482.9],
		previous: [418.9, 421.3, 424.0, 426.8, 427.5, 432.1, 435.0, 438.6, 441.2, 444.8, 447.0, 450.1],
		xLabels: ["30d ago", "20d ago", "10d ago", "Today"],
		deltas: { mrr: "+12.4%", users: "+8.2%", retention: "+3.0 pt" },
		summary: "Monthly recurring revenue grew 12.4% over the last 30 days to $482.9K.",
	},
	"90D": {
		current: [366.9, 372.4, 380.0, 388.5, 396.1, 404.7, 418.2, 431.0, 447.3, 461.8, 473.5, 482.9],
		previous: [345.0, 347.3, 351.8, 356.4, 360.1, 366.0, 371.2, 378.5, 385.9, 392.4, 398.8, 405.1],
		xLabels: ["90d ago", "60d ago", "30d ago", "Today"],
		deltas: { mrr: "+31.6%", users: "+19.7%", retention: "+7.0 pt" },
		summary: "Monthly recurring revenue grew 31.6% over the last 90 days to $482.9K.",
	},
};

const metrics = [
	{ key: "mrr", label: "MRR", value: "$482.9K" },
	{ key: "users", label: "Active users", value: "24.8K" },
	{ key: "retention", label: "Net retention", value: "118%" },
] as const;

const activity = [
	{ initials: "MR", tone: "amber", text: "Maya commented on", target: "Q4 forecast", time: "2m" },
	{ initials: "DT", tone: "dark", text: "Dev shared the board with", target: "Finance", time: "14m" },
] as const;

const formatValue = (value: number) =>
	`$${Number.isInteger(value) ? value : value.toFixed(1)}K`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function DashboardPreview() {
	const [range, setRange] = useState<Range>("30D");
	const data = rangeData[range];

	return (
		<figure className="m-0">
			<div className="relative lg:mb-14">
				{/* Floating insight, sits just above the card on large screens */}
				<motion.div
					className="mb-3 lg:absolute lg:-top-5 lg:right-8 lg:z-10 lg:mb-0"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.9, ease: EASE_OUT }}
				>
					<p className="inline-flex items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm">
						<Sparkles className="size-3.5 text-highlight" aria-hidden="true" />
						On track for $1.52M this quarter
					</p>
				</motion.div>

				{/* Main dashboard card */}
				<motion.div
					role="group"
					aria-label="Product dashboard preview"
					className="overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm"
					initial={{ opacity: 0, y: 24, scale: 0.985 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.8, delay: 0.15, ease: EASE_OUT }}
				>
					{/* Header */}
					<div className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
						<div className="flex min-w-0 items-center gap-2.5">
							<span
								aria-hidden="true"
								className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary"
							>
								<span className="size-2 rounded-full bg-highlight" />
							</span>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold leading-tight">
									Revenue overview
								</p>
								<p className="truncate text-xs text-muted-foreground">
									All plans · USD
								</p>
							</div>
						</div>

						<div
							role="group"
							aria-label="Date range"
							className="flex shrink-0 rounded-lg border bg-muted p-0.5"
						>
							{RANGES.map((option) => {
								const active = option === range;
								return (
									<button
										key={option}
										type="button"
										aria-pressed={active}
										onClick={() => setRange(option)}
										className={cn(
											"relative rounded-md px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
											active
												? "text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										{active && (
											<motion.span
												layoutId="hero-range-pill"
												className="absolute inset-0 rounded-md bg-card shadow-sm ring-1 ring-border"
												transition={{ duration: 0.3, ease: EASE_OUT }}
											/>
										)}
										<span className="relative">{option}</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* Key metrics */}
					<dl className="grid grid-cols-3 divide-x divide-border border-y">
						{metrics.map((metric) => (
							<div key={metric.key} className="min-w-0 px-3 py-3 sm:px-5 sm:py-3.5">
								<dt className="truncate text-xs text-muted-foreground">
									{metric.label}
								</dt>
								<dd className="mt-1 font-heading text-lg font-semibold tracking-tight tabular-nums sm:text-2xl">
									{metric.value}
								</dd>
								<motion.dd
									key={`${metric.key}-${range}`}
									className="mt-0.5 flex items-center gap-0.5 text-xs font-medium text-highlight-foreground"
									initial={{ opacity: 0, y: 4 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.35, ease: EASE_OUT }}
								>
									<ArrowUpRight className="size-3.5" aria-hidden="true" />
									<span className="sr-only">Up </span>
									{data.deltas[metric.key]}
								</motion.dd>
							</div>
						))}
					</dl>

					{/* Chart */}
					<div className="px-4 pt-4 pb-4 sm:px-5">
						<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
							<p className="text-sm font-medium">Monthly recurring revenue</p>
							<ul
								className="flex items-center gap-4 text-xs text-muted-foreground"
								aria-hidden="true"
							>
								<li className="flex items-center gap-1.5">
									<span className="h-0.5 w-3 rounded-full bg-foreground" />
									This period
								</li>
								<li className="flex items-center gap-1.5">
									<span className="h-0 w-3 border-t-2 border-dashed border-muted-foreground/60" />
									Previous
								</li>
							</ul>
						</div>

						<p className="sr-only" aria-live="polite">
							{data.summary}
						</p>

						<RevenueChart
							current={data.current}
							previous={data.previous}
							xLabels={data.xLabels}
							endLabel="Today"
							formatValue={formatValue}
						/>
					</div>

					{/* Footer */}
					<div className="flex items-center gap-2 border-t bg-muted/40 px-4 py-3 text-xs text-muted-foreground sm:px-5 lg:justify-end">
						<RefreshCw className="size-3.5" aria-hidden="true" />
						Synced from 6 sources · updated 2 min ago
					</div>
				</motion.div>

				{/* Floating team activity, hangs off the bottom-left on large screens */}
				<motion.div
					className="mt-4 lg:absolute lg:-bottom-12 lg:-left-10 lg:z-10 lg:mt-0 lg:w-72"
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.7, ease: EASE_OUT }}
				>
					<motion.div
						className="rounded-xl border bg-card p-3.5 shadow-md shadow-black/5 dark:shadow-black/30"
						animate={{ y: [0, -5, 0] }}
						transition={{
							duration: 7,
							ease: "easeInOut",
							repeat: Infinity,
							delay: 1.6,
						}}
					>
						<div className="flex items-center justify-between">
							<p className="text-xs font-semibold">Team activity</p>
							<p className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground">
								<span
									aria-hidden="true"
									className="size-1.5 rounded-full bg-highlight"
								/>
								3 online
							</p>
						</div>

						<ul className="mt-3 space-y-2.5">
							{activity.map((item) => (
								<li key={item.target} className="flex items-center gap-2.5">
									<Avatar initials={item.initials} tone={item.tone} />
									<p className="min-w-0 flex-1 text-xs leading-snug text-muted-foreground">
										{item.text}{" "}
										<span className="font-medium text-foreground">
											{item.target}
										</span>
									</p>
									<span className="shrink-0 text-[0.6875rem] text-muted-foreground tabular-nums">
										{item.time}
									</span>
								</li>
							))}
						</ul>
					</motion.div>
				</motion.div>
			</div>

			<figcaption className="mt-3 hidden text-xs text-muted-foreground lg:block lg:text-right">
				Fig. 1 — Revenue overview, live from your connected sources
			</figcaption>
		</figure>
	);
}
