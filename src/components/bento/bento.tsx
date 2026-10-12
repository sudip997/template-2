"use client";

import { motion, MotionConfig } from "motion/react";
import { Container } from "@/components/container";
import { CollaborationCard } from "./collaboration-card";
import { ForecastCard } from "./forecast-card";
import { IntegrationsCard } from "./integrations-card";
import { fadeUp, stagger } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content. Edit this object to customise the section header.                */
/*  Each card keeps its own copy in its own file.                             */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "Platform",
  heading: "One workspace for every revenue decision.",
  description:
    "Forecasts, data sources, discussions and alerts live together, so the whole team moves from the same numbers to the same next step.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Bento() {
  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      <section
        id="features"
        aria-labelledby="bento-heading"
        className="scroll-mt-20 py-20 sm:py-24 lg:py-28"
      >
        <Container>
          {/* Header: left-aligned, with the supporting copy beside it on desktop */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16"
          >
            <div>
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
                id="bento-heading"
                variants={fadeUp}
                className="mt-4 max-w-2xl font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                {content.heading}
              </motion.h2>
            </div>

            <motion.p
              variants={fadeUp}
              className="max-w-md text-base leading-relaxed text-muted-foreground lg:justify-self-end lg:pb-1 lg:text-lg"
            >
              {content.description}
            </motion.p>
          </motion.div>

          {/*
            Desktop layout (12 columns):
              Row 1: Forecasting (7)       | Integrations (5)
              Row 2: Collaboration (5)     | Automation (7)
            Tablet: two columns, wide cards span both. Mobile: one column.
          */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:mt-16 lg:grid-cols-12"
          >
            <ForecastCard className="sm:col-span-2 lg:col-span-7" />
            <IntegrationsCard className="lg:col-span-5" />
            <CollaborationCard className="lg:col-span-5" />
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}
