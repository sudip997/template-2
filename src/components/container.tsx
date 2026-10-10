import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared page-width wrapper. Every landing-page section should use this so
 * horizontal alignment stays consistent across the template.
 */
export function Container({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
			{...props}
		/>
	);
}
