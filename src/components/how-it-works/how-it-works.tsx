"use client";

import type { ComponentType } from "react";
import { motion, MotionConfig } from "motion/react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { ConnectPreview } from "./connect-preview";
import { ForecastPreview } from "./forecast-preview";
import { fadeUp } from "./motion";
import { SharePreview } from "./share-preview";
import { StepItem } from "./step-item";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the section header and the three steps.  */
/*  Each step's preview keeps its own copy and mock data in its own file.     */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "How it works",
  heading: "From first login to first forecast in an afternoon.",
  description:
    "No migration project and no consultants. Connect the tools you already use, and your team is looking at live numbers the same day.",
} as const;

type Step = {
  title: string;
  description: string;
  duration: string;
  Preview: ComponentType;
};

const steps: Step[] = [
  {
    title: "Connect your data",
    description:
      "Link your billing, CRM and warehouse with a few clicks. Historical data syncs automatically, so you start with context, not an empty chart.",
    duration: "About 5 minutes",
    Preview: ConnectPreview,
  },
  {
    title: "Build your forecast",
    description:
      "Pick a starting model and adjust the assumptions that matter to you. Every change updates the projections instantly.",
    duration: "About 10 minutes",
    Preview: ForecastPreview,
  },
  {
    title: "Share with your team",
    description:
      "Invite finance, sales and leadership with the right permissions. Everyone works from the same numbers and gets alerted when they move.",
    duration: "About 2 minutes",
    Preview: SharePreview,
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
          {/* Header: left-aligned, between the centered Features header and the steps */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-2xl"
          >
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-highlight"
              />
              {content.eyebrow}
            </p>
            <h2
              id="how-it-works-heading"
              className="mt-4 font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
            >
              {content.heading}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg">
              {content.description}
            </p>
          </motion.div>

          {/*
            Desktop: the numbered rail runs down the centre and each step's text
            and preview swap sides. Mobile: the rail sits on the left.
          */}
          <ol role="list" className="mt-14 lg:mt-20">
            {steps.map(({ Preview, ...step }, index) => (
              <StepItem
                key={step.title}
                index={index}
                title={step.title}
                description={step.description}
                duration={step.duration}
                isLast={index === steps.length - 1}
              >
                <Preview />
              </StepItem>
            ))}
          </ol>
        </Container>
      </section>
    </MotionConfig>
  );
}
