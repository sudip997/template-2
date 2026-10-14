"use client";

import { motion, MotionConfig } from "motion/react";
import {
  IconChartAreaLine,
  IconPlugConnected,
  IconUsersPlus,
  type Icon,
} from "@tabler/icons-react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "./motion";
import { StepItem } from "./step-item";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the section header and the three steps.  */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "How it works",
  heading: "From first login to first forecast in an afternoon.",
  description:
    "No migration project and no consultants. Connect the tools you already use, and your team is looking at live numbers the same day.",
} as const;

type Step = {
  icon: Icon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    icon: IconPlugConnected,
    title: "Connect your data",
    description:
      "Link your billing, CRM and warehouse with a few clicks. Historical data syncs automatically, so you start with context, not an empty chart.",
  },
  {
    icon: IconChartAreaLine,
    title: "Build your forecast",
    description:
      "Pick a starting model and adjust the assumptions that matter to you. Every change updates the projections instantly.",
  },
  {
    icon: IconUsersPlus,
    title: "Share with your team",
    description:
      "Invite finance, sales and leadership with the right permissions. Everyone works from the same numbers and gets alerted when they move.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function HowItWorks({ className }: { className?: string }) {
  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className={cn("scroll-mt-20 py-20 sm:py-24 lg:py-28", className)}
      >
        <Container>
          {/*
            Split layout, unlike the centered Features header and the wide
            Bento header: a heading column beside a vertical timeline.
            The heading column sticks while the steps scroll past on desktop.
            Mobile and tablet: a single column, heading first.
          */}
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="lg:sticky lg:top-28 lg:self-start"
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
                id="how-it-works-heading"
                variants={fadeUp}
                className="mt-4 max-w-xl font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                {content.heading}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-md text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
              >
                {content.description}
              </motion.p>
            </motion.div>

            <motion.ol
              role="list"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="lg:pt-2"
            >
              {steps.map((step, index) => (
                <StepItem
                  key={step.title}
                  index={index}
                  icon={step.icon}
                  title={step.title}
                  description={step.description}
                  isLast={index === steps.length - 1}
                />
              ))}
            </motion.ol>
          </div>
        </Container>
      </section>
    </MotionConfig>
  );
}
