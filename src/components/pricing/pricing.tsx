"use client";

import { useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { BillingToggle } from "./billing-toggle";
import { fadeUp, stagger } from "./motion";
import { PlanCard } from "./plan-card";
import type { BillingCycle, Plan } from "./types";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the section header, prices and features. */
/*                                                                            */
/*  For a "fixed" price, `monthly` is the price when billed monthly and       */
/*  `yearly` is the per-month price when billed annually. The "billed $X      */
/*  yearly" line is worked out from `yearly`. Update `yearlyNote` below if    */
/*  you change the size of the discount. All figures are demo content.        */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "Pricing",
  heading: "Simple pricing that grows with your team.",
  description:
    "Start free for 14 days, then pick the plan that fits. Switch or cancel whenever you like.",
  currency: "$",
  yearlyNote: "Save 20%",
  footnote: "All plans include a 14-day free trial. No credit card required.",
} as const;

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "For small teams getting their first reliable view of revenue.",
    price: { kind: "fixed", monthly: 15, yearly: 12 },
    featuresLabel: "What's included",
    features: [
      "Up to 3 team members",
      "5 live dashboards",
      "Core revenue and churn metrics",
      "Weekly email reports",
      "30 days of data history",
      "Email support",
    ],
    cta: { label: "Start free trial", href: "#" },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams that plan, forecast and report together.",
    price: { kind: "fixed", monthly: 40, yearly: 32 },
    featuresLabel: "Everything in Starter, plus",
    features: [
      "Up to 15 team members",
      "Unlimited dashboards",
      "Forecasting and cohort analysis",
      "Anomaly alerts in Slack and email",
      "Scheduled, board-ready reports",
      "Developer API and webhooks",
      "Priority support",
    ],
    cta: { label: "Start free trial", href: "#" },
    featured: true,
    badge: "Most popular",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For organizations with advanced security and scale needs.",
    price: {
      kind: "custom",
      label: "Custom",
      note: "Volume pricing and flexible terms",
    },
    featuresLabel: "Everything in Pro, plus",
    features: [
      "Unlimited team members",
      "Single sign-on (SAML) and SCIM",
      "Custom roles and audit logs",
      "Unlimited data history",
      "99.9% uptime SLA",
      "Dedicated customer success manager",
    ],
    cta: { label: "Talk to sales", href: "#" },
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Pricing({ className }: { className?: string }) {
  const [cycle, setCycle] = useState<BillingCycle>("yearly");

  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        className={cn("scroll-mt-20 py-20 sm:py-24 lg:py-28", className)}
      >
        <Container>
          {/* Header: text on the left, billing switch on the right (stacked on small screens) */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12"
          >
            <div className="max-w-2xl">
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
                id="pricing-heading"
                variants={fadeUp}
                className="mt-4 font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                {content.heading}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
              >
                {content.description}
              </motion.p>
            </div>

            <motion.div variants={fadeUp} className="shrink-0">
              <BillingToggle
                value={cycle}
                onChange={setCycle}
                yearlyNote={content.yearlyNote}
              />
            </motion.div>
          </motion.div>

          {/* Announces the change to screen reader users when the switch is used */}
          <p role="status" className="sr-only">
            Showing {cycle} billing prices.
          </p>

          {/*
            Mobile: 1 column. Tablet: 2 columns, with Enterprise spanning both.
            Desktop: 3 columns. `items-stretch` (the grid default) keeps the
            cards the same height within a row.
          */}
          <motion.ul
            role="list"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6"
          >
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                cycle={cycle}
                currency={content.currency}
                wideOnTablet={index === plans.length - 1 && plans.length % 2 === 1}
              />
            ))}
          </motion.ul>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            {content.footnote}
          </motion.p>
        </Container>
      </section>
    </MotionConfig>
  );
}
