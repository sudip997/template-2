"use client";

import { useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { IconArrowRight } from "@tabler/icons-react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import { FaqItem, type FaqEntry } from "./faq-item";
import { fadeUp, stagger } from "./motion";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the header, the help note and the        */
/*  questions. Keep 5 to 8 questions; each `id` must be unique. All answers   */
/*  below are demo content.                                                   */
/* -------------------------------------------------------------------------- */

const content = {
  eyebrow: "FAQ",
  heading: "Answers to the questions teams ask first.",
  description:
    "Everything you need to know before you start. If something isn't covered here, we're happy to help.",
  help: {
    title: "Still have a question?",
    description: "Our team replies within one business day.",
    cta: { label: "Contact support", href: "#" },
  },
  /** Which question is open on first load. Use `null` to start with all closed. */
  defaultOpenId: "free-trial" as string | null,
} as const;

const faqs: FaqEntry[] = [
  {
    id: "free-trial",
    question: "How does the free trial work?",
    answer:
      "Every plan starts with 14 days of full access, and you don't need a credit card to begin. If you decide not to continue, your workspace simply pauses. Nothing is deleted, so you can pick a plan and carry on whenever you're ready.",
  },
  {
    id: "setup",
    question: "How long does setup take?",
    answer:
      "Most teams are looking at live dashboards within an afternoon. Connect your billing, CRM and data warehouse in a few clicks, and your historical data syncs automatically, so there's no migration project and no consultants.",
  },
  {
    id: "integrations",
    question: "Which tools can I connect?",
    answer:
      "Acme works with the major billing platforms, CRMs and data warehouses, and you can import anything else from CSV. For custom sources, the developer API and webhooks let you send data in and pull every metric back out.",
  },
  {
    id: "security",
    question: "Is my data secure?",
    answer:
      "Your data is encrypted in transit and at rest, and access is controlled with roles and permissions down to the individual workspace. Enterprise plans add single sign-on, audit logs and a 99.9% uptime SLA. We never sell or share your data.",
  },
  {
    id: "change-plan",
    question: "Can I change or cancel my plan later?",
    answer:
      "Yes, at any time. Upgrades take effect immediately and are prorated, and downgrades apply from your next billing date. If you cancel, you can export your data first and keep access until the end of the period you've paid for.",
  },
  {
    id: "discounts",
    question: "Do you offer discounts for startups or nonprofits?",
    answer:
      "We do. Early-stage startups and registered nonprofits can apply for reduced pricing, and yearly billing already saves 20% on every plan. Get in touch and we'll find the right fit for your team.",
  },
  {
    id: "support",
    question: "What kind of support do you provide?",
    answer:
      "Starter includes email support, and Pro adds priority responses from the team that builds the product. Enterprise customers also get a dedicated customer success manager to help with rollout and reporting.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Faq({ className }: { className?: string }) {
  const [openId, setOpenId] = useState<string | null>(content.defaultOpenId);

  return (
    // `reducedMotion="user"` turns off movement for people who prefer less motion.
    <MotionConfig reducedMotion="user">
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className={cn(
          "scroll-mt-20 border-t py-20 sm:py-24 lg:py-28",
          className,
        )}
      >
        <Container>
          {/*
            Mobile: stacked. Desktop: a short header on the left that stays in
            view while the questions scroll past on the right.
          */}
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start"
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
                id="faq-heading"
                variants={fadeUp}
                className="mt-4 max-w-lg font-heading text-3xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl"
              >
                {content.heading}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-md text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
              >
                {content.description}
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 border-t pt-6 lg:mt-10"
              >
                <p className="font-heading text-sm font-semibold tracking-tight">
                  {content.help.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {content.help.description}
                </p>
                <a
                  href={content.help.cta.href}
                  className="group/link mt-3 inline-flex items-center gap-1.5 rounded-sm text-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {content.help.cta.label}
                  <IconArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover/link:translate-x-0.5 motion-reduce:transition-none"
                    stroke={1.75}
                  />
                </a>
              </motion.div>
            </motion.div>

            {/* One continuous list divided by hairlines, not a stack of separate cards */}
            <motion.ul
              role="list"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="border-t lg:col-span-7"
            >
              {faqs.map((entry, index) => (
                <FaqItem
                  key={entry.id}
                  entry={entry}
                  index={index}
                  open={openId === entry.id}
                  onToggle={() =>
                    setOpenId((current) =>
                      current === entry.id ? null : entry.id,
                    )
                  }
                />
              ))}
            </motion.ul>
          </div>
        </Container>
      </section>
    </MotionConfig>
  );
}
