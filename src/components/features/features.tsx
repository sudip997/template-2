"use client";

import { motion, MotionConfig } from "motion/react";
import {
  IconBellRinging,
  IconCode,
  IconFileAnalytics,
  IconLayoutDashboard,
  IconShieldLock,
  IconUsersGroup,
  type Icon,
} from "@tabler/icons-react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { FeatureItem } from "./feature-item";
import { fadeUp, stagger } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the section header and the six features. */
/*  Keep it at six (or any multiple of six) so the grid stays balanced.       */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "Capabilities",
  heading: "Everything your team needs, nothing it doesn't.",
  description:
    "A focused toolkit for tracking performance, catching changes early and sharing what you learn with the people who need it.",
} as const;

type Feature = {
  icon: Icon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: IconLayoutDashboard,
    title: "Live dashboards",
    description:
      "Watch revenue, churn and pipeline update the moment your data changes, with no refreshing and no waiting on a report.",
  },
  {
    icon: IconUsersGroup,
    title: "Cohort analysis",
    description:
      "Group customers by signup month, plan or channel to see which segments stay and which quietly leave.",
  },
  {
    icon: IconFileAnalytics,
    title: "Scheduled reports",
    description:
      "Send board-ready summaries to inboxes or Slack on your schedule, already formatted and ready to forward.",
  },
  {
    icon: IconBellRinging,
    title: "Anomaly alerts",
    description:
      "Get flagged when a metric drifts from its normal range, with context on what changed and where to look first.",
  },
  {
    icon: IconShieldLock,
    title: "Roles and permissions",
    description:
      "Decide who can view revenue, edit models or export data, down to the individual workspace.",
  },
  {
    icon: IconCode,
    title: "Developer API",
    description:
      "Pull every metric into your own tools with a documented REST API and webhooks for the events that matter.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Features({ className }: { className?: string }) {
  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      <section
        id="features"
        aria-labelledby="features-heading"
        className={cn("scroll-mt-20 py-20 sm:py-24 lg:py-28", className)}
      >
        <Container>
          {/* Header: centered, to contrast with the left-aligned sections around it */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
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
              id="features-heading"
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
          </motion.div>

          {/*
            One bordered panel split by hairlines, not six separate cards, so it
            reads differently from the bento grid. The 1px gaps show the
            panel's `bg-border` colour as dividers.
            Mobile: 1 column. Tablet: 2 columns. Desktop: 3 columns.
          */}
          <motion.ul
            role="list"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border shadow-sm sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <FeatureItem
                key={feature.title}
                index={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </motion.ul>
        </Container>
      </section>
    </MotionConfig>
  );
}
