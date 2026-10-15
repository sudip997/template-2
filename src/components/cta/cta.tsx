"use client";

import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { CtaBackdrop } from "./cta-backdrop";
import { fadeUp, panelReveal } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content. Edit this object to customise the copy and links.                */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "Get started",
  headline: {
    before: "Your first forecast is ",
    highlight: "an afternoon",
    after: " away.",
  },
  description:
    "Start your free 14-day trial and connect your data today. No credit card, no migration project and no commitment.",
  primaryCta: { label: "Start free trial", href: "#" },
  /** Remove this object (and its link below) if you only want one button. */
  secondaryCta: { label: "Book a demo", href: "#" },
  perks: ["14-day free trial", "No credit card required", "Cancel anytime"],
} as const;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Cta({ className }: { className?: string }) {
  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      {/*
        No top padding: the section above already ends with generous space.
        Add `pt-*` through `className` if you place this after a short section.
      */}
      <section
        id="get-started"
        aria-labelledby="cta-heading"
        className={cn("scroll-mt-20 pb-20 sm:pb-24 lg:pb-28", className)}
      >
        <Container>
          {/*
            The panel carries the `dark` class, so it uses the template's dark
            palette in both themes: a calm, deep closing moment on a light page,
            and a lifted card on a dark one. Because of that, the stock Button
            variants and colour tokens below work without any overrides.
          */}
          <motion.div
            variants={panelReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="dark relative isolate overflow-hidden rounded-2xl border bg-card p-8 text-foreground sm:p-12 lg:p-16"
          >
            <CtaBackdrop />

            {/*
              Mobile and tablet: stacked. Desktop: the message takes the wide
              left column, and the actions sit in a narrower rail beside it,
              separated by a hairline.
            */}
            <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-0">
              <div className="lg:col-span-7 lg:pr-12 xl:pr-16">
                <motion.p
                  variants={fadeUp}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase"
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-highlight"
                  />
                  {content.eyebrow}
                </motion.p>

                <motion.h2
                  id="cta-heading"
                  variants={fadeUp}
                  className="mt-5 max-w-2xl font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
                >
                  {content.headline.before}
                  <span className="text-highlight">
                    {content.headline.highlight}
                  </span>
                  {content.headline.after}
                </motion.h2>

                <motion.p
                  variants={fadeUp}
                  className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
                >
                  {content.description}
                </motion.p>
              </div>

              <div className="border-t pt-8 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 xl:pl-16">
                <motion.div
                  variants={fadeUp}
                  className="flex flex-col gap-3 sm:flex-row lg:flex-col"
                >
                  <Link
                    href={content.primaryCta.href}
                    className={buttonVariants({
                      size: "xl",
                      className: "w-full sm:flex-1 lg:flex-none",
                    })}
                  >
                    {content.primaryCta.label}
                    <IconArrowRight
                      data-icon="inline-end"
                      className="transition-transform group-hover/button:translate-x-0.5 motion-reduce:transition-none"
                      stroke={1.75}
                      aria-hidden="true"
                    />
                  </Link>
                  <Link
                    href={content.secondaryCta.href}
                    className={buttonVariants({
                      variant: "outline",
                      size: "xl",
                      className: "w-full sm:flex-1 lg:flex-none",
                    })}
                  >
                    {content.secondaryCta.label}
                  </Link>
                </motion.div>

                <motion.ul
                  role="list"
                  variants={fadeUp}
                  className="mt-7 space-y-3 text-sm text-muted-foreground"
                >
                  {content.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5">
                      <IconCheck
                        aria-hidden="true"
                        className="size-4 shrink-0 text-highlight"
                        stroke={2}
                      />
                      {perk}
                    </li>
                  ))}
                </motion.ul>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}
