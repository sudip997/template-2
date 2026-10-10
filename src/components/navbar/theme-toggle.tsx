"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * Light/dark switch that reuses the app's existing next-themes provider.
 *
 * Both icons are always rendered and swapped with the `dark:` variant, so the
 * server and client markup match and there is no hydration mismatch.
 */
export function ThemeToggle({ className }: { className?: string }) {
	const { resolvedTheme, setTheme } = useTheme();

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-lg"
			className={className}
			aria-label="Toggle theme"
			onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
		>
			<Sun className="size-4.5 dark:hidden" aria-hidden="true" />
			<Moon className="hidden size-4.5 dark:block" aria-hidden="true" />
		</Button>
	);
}
