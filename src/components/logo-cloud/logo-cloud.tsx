"use client";

import { motion, MotionConfig, type Variants } from "motion/react";
import { Container } from "@/components/container";
import { EASE_OUT } from "@/components/hero/motion";
import { cn } from "@/lib/utils";
import { logos } from "./logos";

/* -------------------------------------------------------------------------- */
/*  Content. Edit this object to customise the heading.                       */
/*  The brands themselves live in ./logos.tsx.                                */
/* -------------------------------------------------------------------------- */

const content = {
	heading: "Trusted by innovative teams worldwide",
} as const;

/* -------------------------------------------------------------------------- */
/*  Motion                                                                    */
/* -------------------------------------------------------------------------- */

const stagger: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 8 },
	show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function LogoCloud({ className }: { className?: string }) {
	return (
		// `reducedMotion="user"` turns off movement for people who prefer less motion.
		<MotionConfig reducedMotion="user">
			<section
				aria-labelledby="logo-cloud-heading"
				className={cn("border-y py-10 sm:py-12", className)}
			>
				<Container>
					{/* Heading sits left of the logos on desktop, above them on smaller screens */}
					<motion.div
						variants={stagger}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true, amount: 0.3 }}
						className="grid items-center gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12"
					>
						<motion.h2
							id="logo-cloud-heading"
							variants={fadeUp}
							className="text-center text-sm leading-snug text-muted-foreground lg:text-left"
						>
							{content.heading}
						</motion.h2>

						<ul className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:flex lg:justify-between lg:gap-x-6">
							{logos.map((logo) => (
								<motion.li
									key={logo.name}
									variants={fadeUp}
									className="flex justify-center lg:justify-start"
								>
									<div className="flex items-center gap-2 text-base text-muted-foreground transition-colors duration-300 hover:text-foreground xl:text-lg">
										{logo.mark}
										<span
											className={cn(
												"leading-none whitespace-nowrap",
												logo.wordmarkClassName,
											)}
										>
											{logo.name}
										</span>
									</div>
								</motion.li>
							))}
						</ul>
					</motion.div>
				</Container>
			</section>
		</MotionConfig>
	);
}
