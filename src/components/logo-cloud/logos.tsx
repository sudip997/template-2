import type { ReactNode } from "react";

/**
 * Placeholder brands for the logo cloud. All of them are fictional.
 *
 * To use real customer logos, replace the entries below. Every mark must be a
 * monochrome SVG that paints with `currentColor` (not a fixed hex value), so it
 * follows the theme and stays legible in both light and dark mode.
 */

export type Logo = {
	/** Brand name. Rendered as the wordmark next to the mark. */
	name: string;
	/** Monochrome mark drawn with `currentColor`. */
	mark: ReactNode;
	/** Optional Tailwind classes to give each wordmark its own typographic voice. */
	wordmarkClassName?: string;
};

/** Shared props so every mark has the same size and stroke weight. */
const markProps = {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.75,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": true,
	className: "size-5 shrink-0",
} as const;

export const logos: Logo[] = [
	{
		name: "Lumen",
		wordmarkClassName: "font-heading font-semibold tracking-tight",
		mark: (
			<svg {...markProps}>
				<circle cx="12" cy="12" r="8.25" />
				<circle cx="12" cy="12" r="2.75" fill="currentColor" stroke="none" />
			</svg>
		),
	},
	{
		name: "Orbit",
		wordmarkClassName: "font-medium tracking-wide",
		mark: (
			<svg {...markProps}>
				<ellipse
					cx="12"
					cy="12"
					rx="9.25"
					ry="4.5"
					transform="rotate(-30 12 12)"
				/>
				<circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
			</svg>
		),
	},
	{
		name: "Vertex",
		wordmarkClassName: "font-heading font-bold tracking-tighter",
		mark: (
			<svg {...markProps}>
				<path d="M12 3.5 21 19.5H3L12 3.5Z" />
			</svg>
		),
	},
	{
		name: "Kiln",
		wordmarkClassName: "font-mono font-semibold tracking-wider uppercase",
		mark: (
			<svg {...markProps}>
				<rect x="3.5" y="3.5" width="17" height="17" rx="4" />
				<path d="M8 16V8M12 16v-5M16 16v-8" />
			</svg>
		),
	},
	{
		name: "Halo",
		wordmarkClassName: "font-serif font-semibold tracking-tight",
		mark: (
			<svg {...markProps}>
				<circle cx="9" cy="12" r="5.75" />
				<circle cx="15" cy="12" r="5.75" />
			</svg>
		),
	},
	{
		name: "Meridian",
		wordmarkClassName: "font-heading font-semibold tracking-tight",
		mark: (
			<svg {...markProps}>
				<circle cx="12" cy="12" r="8.75" />
				<ellipse cx="12" cy="12" rx="3.5" ry="8.75" />
				<path d="M3.25 12h17.5" />
			</svg>
		),
	},
];
