import { cn } from "@/lib/utils";

type AvatarTone = "neutral" | "amber" | "dark" | "light";

const toneClasses: Record<AvatarTone, string> = {
	neutral: "bg-secondary text-secondary-foreground",
	amber: "bg-highlight-soft text-highlight-foreground",
	dark: "bg-primary text-primary-foreground",
	light: "bg-muted text-muted-foreground",
};

type AvatarProps = {
	initials: string;
	tone?: AvatarTone;
	className?: string;
};

/**
 * Initials-only avatar used in the hero mock UI. Swap for real images
 * (e.g. next/image) in production if you want photos.
 */
export function Avatar({ initials, tone = "neutral", className }: AvatarProps) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-semibold ring-2 ring-card",
				toneClasses[tone],
				className,
			)}
		>
			{initials}
		</span>
	);
}
