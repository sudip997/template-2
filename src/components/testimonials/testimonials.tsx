"use client";

import { useId, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { fadeUp } from "./motion";
import { TestimonialPanel } from "./testimonial-panel";
import { TestimonialTabs } from "./testimonial-tabs";
import type { Testimonial } from "./types";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the section header and the customers.    */
/*  All names and companies below are fictional demo content.                 */
/*  Keep it at three stories so the tab strip stays balanced, or change the   */
/*  `grid-cols-3` class in testimonial-tabs.tsx to match your count.          */
/*  Replace the SVG portraits in /public/testimonials with real photos.       */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "Customer stories",
  heading: "Trusted by the people who run the numbers.",
} as const;

const testimonials: Testimonial[] = [
  {
    id: "amara-okafor",
    quote:
      "We used to close the month and then spend a week explaining the numbers. Now the forecast is already in the room before anyone asks the question. Our board meetings are shorter, and a lot more honest.",
    highlight:
      "the forecast is already in the room before anyone asks the question",
    name: "Amara Okafor",
    role: "VP of Finance",
    company: "Lumen",
    portrait: "/testimonials/amara-okafor.svg",
    result: { value: "41%", label: "less forecast variance within two quarters" },
  },
  {
    id: "daniel-reyes",
    quote:
      "Every team kept its own spreadsheet, and every spreadsheet told a slightly different story. Acme became the one place where sales, finance and customer success look at the same pipeline.",
    highlight:
      "the one place where sales, finance and customer success look at the same pipeline",
    name: "Daniel Reyes",
    role: "Head of Revenue Operations",
    company: "Kiln",
    portrait: "/testimonials/daniel-reyes.svg",
    result: { value: "6 hours", label: "saved every month on pipeline reporting" },
  },
  {
    id: "priya-raman",
    quote:
      "I was skeptical that another analytics tool would change how we plan. Then an alert flagged churn drifting in one segment weeks before it appeared in our reports. We fixed it before it cost us a quarter.",
    highlight:
      "flagged churn drifting in one segment weeks before it appeared in our reports",
    name: "Priya Raman",
    role: "Chief Financial Officer",
    company: "Meridian",
    portrait: "/testimonials/priya-raman.svg",
    result: { value: "3 weeks", label: "earlier warning on churn risk" },
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Testimonials({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const total = testimonials.length;

  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className={cn(
          "scroll-mt-20 border-y bg-secondary/50 py-20 sm:py-24 lg:py-28",
          className,
        )}
      >
        <Container>
          {/* Header: left-aligned, with a quiet counter on the right */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            className="flex items-end justify-between gap-8"
          >
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-highlight"
                />
                {content.eyebrow}
              </p>
              <h2
                id="testimonials-heading"
                className="mt-4 font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                {content.heading}
              </h2>
            </div>

            {/* Decorative: the tabs below already tell assistive technology the position */}
            <p
              aria-hidden="true"
              className="hidden shrink-0 pb-1 font-heading text-sm text-muted-foreground tabular-nums sm:block"
            >
              <span className="font-semibold text-foreground">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="mx-2 text-border">/</span>
              {String(total).padStart(2, "0")}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-12 lg:mt-20"
          >
            {/* Every panel sits in this one grid cell, so the height never jumps */}
            <div className="grid">
              {testimonials.map((testimonial, index) => (
                <TestimonialPanel
                  key={testimonial.id}
                  testimonial={testimonial}
                  baseId={baseId}
                  active={index === activeIndex}
                />
              ))}
            </div>

            <TestimonialTabs
              items={testimonials}
              activeIndex={activeIndex}
              onChange={setActiveIndex}
              baseId={baseId}
              className="mt-12 lg:mt-16"
            />
          </motion.div>
        </Container>
      </section>
    </MotionConfig>
  );
}
