"use client";

import Link from "next/link";
import { motion, MotionConfig, type Variants } from "motion/react";
import { ArrowRight, Check, ChevronRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/container";
import { Avatar } from "./avatar";
import { DashboardPreview } from "./dashboard-preview";
import { EASE_OUT } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content. Edit this object to customise the copy and links.                */
/* -------------------------------------------------------------------------- */

const content = {
  badge: { label: "New", text: "Forecasting 2.0 is live", href: "#" },
  headline: {
    before: "Turn raw data into ",
    highlight: "confident",
    after: " decisions.",
  },
  description:
    "Pull revenue, product usage and team activity into one calm workspace, so everyone works from the same numbers and the next move is obvious.",
  primaryCta: { label: "Start free trial", href: "#" },
  secondaryCta: { label: "Book a demo", href: "#" },
  perks: ["14-day free trial", "No credit card required"],
  proof: {
    rating: "4.9",
    text: "Trusted by 4,200+ revenue and product teams",
  },
} as const;

const proofAvatars = [
  { initials: "AK", tone: "amber" },
  { initials: "JS", tone: "dark" },
  { initials: "LM", tone: "neutral" },
  { initials: "TR", tone: "light" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Motion                                                                    */
/* -------------------------------------------------------------------------- */

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Hero() {
  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="hero-heading"
        className="relative isolate overflow-x-clip pt-12 pb-20 sm:pt-16 md:pt-16 lg:pb-28"
      >
        {/* Soft warm wash behind the product visual */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute top-16 right-0 h-112 w-xl max-w-full translate-x-1/4 rounded-full bg-highlight-soft/70 blur-3xl dark:bg-highlight-soft/40" />
        </div>

        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-20">
            {/* Left: message */}
            <motion.div
              className="max-w-2xl"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={fadeUp}>
                <Link
                  href={content.badge.href}
                  className="group inline-flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="rounded-full bg-highlight-soft px-2 py-0.5 text-xs font-semibold text-highlight-foreground">
                    {content.badge.label}
                  </span>
                  {content.badge.text}
                  <ChevronRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </motion.div>

              <motion.h1
                id="hero-heading"
                variants={fadeUp}
                className="mt-6 font-heading text-[2.625rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl"
              >
                {content.headline.before}
                <span className="relative inline-block">
                  {content.headline.highlight}
                  <svg
                    viewBox="0 0 220 12"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-1 h-2.5 w-full overflow-visible text-highlight"
                  >
                    <motion.path
                      d="M2 8 C 40 2, 90 2, 130 6 S 200 9, 218 4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.8, ease: EASE_OUT }}
                    />
                  </svg>
                </span>
                {content.headline.after}
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              >
                {content.description}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-col gap-3 sm:flex-row"
              >
                <Link
                  href={content.primaryCta.href}
                  className={buttonVariants({
                    size: "xl",
                    className: "w-full sm:w-auto",
                  })}
                >
                  {content.primaryCta.label}
                  <ArrowRight
                    data-icon="inline-end"
                    className="transition-transform group-hover/button:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href={content.secondaryCta.href}
                  className={buttonVariants({
                    variant: "outline",
                    size: "xl",
                    className: "w-full sm:w-auto",
                  })}
                >
                  {content.secondaryCta.label}
                </Link>
              </motion.div>

              {/* <motion.ul
                variants={fadeUp}
                className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground"
              >
                {content.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-1.5">
                    <Check
                      className="size-3.5 text-highlight"
                      aria-hidden="true"
                    />
                    {perk}
                  </li>
                ))}
              </motion.ul> */}

              <motion.div
                variants={fadeUp}
                className="mt-7 flex items-center gap-4 pt-6"
              >
                <div className="flex -space-x-2">
                  {proofAvatars.map((avatar) => (
                    <Avatar
                      key={avatar.initials}
                      initials={avatar.initials}
                      tone={avatar.tone}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="flex items-center gap-1">
                    <span className="flex" aria-hidden="true">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className="size-3.5 fill-highlight text-highlight"
                        />
                      ))}
                    </span>
                    <span className="ml-1 font-medium">
                      {content.proof.rating}
                      <span className="sr-only"> out of 5 stars</span>
                    </span>
                  </p>
                  <p className="mt-0.5 text-muted-foreground">
                    {content.proof.text}
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: product visual */}
            <div className="min-w-0">
              <DashboardPreview />
            </div>
          </div>
        </Container>
      </section>
    </MotionConfig>
  );
}
