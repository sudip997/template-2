"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/container";
import { EASE_OUT } from "@/components/hero/motion";
import { ThemeToggle } from "./theme-toggle";

/* -------------------------------------------------------------------------- */
/*  Content. Edit this object to customise the brand, links and CTA.          */
/* -------------------------------------------------------------------------- */

const content = {
	brand: { name: "Acme", href: "/" },
	links: [
		{ label: "Features", href: "#features" },
		{ label: "Pricing", href: "#pricing" },
		{ label: "Testimonials", href: "#testimonials" },
		{ label: "FAQ", href: "#faq" },
	],
	cta: { label: "Get Started", href: "#pricing" },
} as const;

const MOBILE_MENU_ID = "mobile-menu";
const focusRing =
	"outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Navbar() {
	const [open, setOpen] = useState(false);
	const toggleRef = useRef<HTMLButtonElement>(null);

	// Close on Escape (returning focus to the toggle) and when the viewport
	// grows to the desktop layout, so the menu can never be left open and hidden.
	useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setOpen(false);
				toggleRef.current?.focus();
			}
		};
		const desktop = window.matchMedia("(min-width: 768px)");
		const onChange = (event: MediaQueryListEvent) => {
			if (event.matches) setOpen(false);
		};

		document.addEventListener("keydown", onKeyDown);
		desktop.addEventListener("change", onChange);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			desktop.removeEventListener("change", onChange);
		};
	}, [open]);

	return (
		// `reducedMotion="user"` turns off movement for people who prefer less motion.
		<MotionConfig reducedMotion="user">
			<header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md">
				<Container>
					<div className="flex h-16 items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
						{/* Left: brand */}
						<Link
							href={content.brand.href}
							onClick={() => setOpen(false)}
							className={`flex items-center gap-2 justify-self-start rounded-md font-heading text-lg font-semibold tracking-tight ${focusRing}`}
						>
							<span
								aria-hidden="true"
								className="size-2.5 rounded-[3px] bg-highlight"
							/>
							{content.brand.name}
						</Link>

						{/* Center: desktop links */}
						<nav aria-label="Main" className="hidden md:block">
							<ul className="flex items-center gap-1">
								{content.links.map((link) => (
									<li key={link.href}>
										<Link
											href={link.href}
											className={`rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${focusRing}`}
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						{/* Right: theme toggle + CTA (desktop), menu button (mobile) */}
						<div className="flex items-center gap-2 justify-self-end">
							<ThemeToggle />
							<Link
								href={content.cta.href}
								className={buttonVariants({
									size: "lg",
									className: "hidden md:inline-flex px-3 py-1.5",
								})}
							>
								{content.cta.label}
							</Link>
							<Button
								ref={toggleRef}
								type="button"
								variant="ghost"
								size="icon-lg"
								className="md:hidden"
								aria-label={open ? "Close menu" : "Open menu"}
								aria-expanded={open}
								aria-controls={MOBILE_MENU_ID}
								onClick={() => setOpen((value) => !value)}
							>
								{open ? (
									<X className="size-5" aria-hidden="true" />
								) : (
									<Menu className="size-5" aria-hidden="true" />
								)}
							</Button>
						</div>
					</div>
				</Container>

				{/* Mobile menu */}
				<AnimatePresence>
					{open && (
						<motion.div
							id={MOBILE_MENU_ID}
							initial={{ opacity: 0, y: -6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -6 }}
							transition={{ duration: 0.18, ease: EASE_OUT }}
							className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-b bg-background md:hidden"
						>
							<Container className="py-4">
								<nav aria-label="Mobile">
									<ul className="flex flex-col">
										{content.links.map((link) => (
											<li key={link.href} className="border-b last:border-b-0">
												<Link
													href={link.href}
													onClick={() => setOpen(false)}
													className={`block rounded-md py-3 text-base font-medium text-foreground ${focusRing}`}
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</nav>
								<Link
									href={content.cta.href}
									onClick={() => setOpen(false)}
									className={buttonVariants({
										size: "xl",
										className: "mt-4 w-full",
									})}
								>
									{content.cta.label}
								</Link>
							</Container>
						</motion.div>
					)}
				</AnimatePresence>
			</header>
		</MotionConfig>
	);
}
