"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { IconCheck } from "@tabler/icons-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EASE_OUT, fadeUp } from "./motion";
import type { BillingCycle, Plan } from "./types";

type PlanCardProps = {
  plan: Plan;
  cycle: BillingCycle;
  currency: string;
  /**
   * On tablets the third card sits alone on its own row. Set this to let it
   * span both columns and lay its features out in two columns.
   */
  wideOnTablet?: boolean;
  className?: string;
};

/**
 * One pricing plan. Must be rendered inside a `motion` parent that animates
 * "hidden" / "show" (see pricing.tsx).
 *
 * The outer `motion.li` only handles the reveal. Hover styles live on the inner
 * card so the two never compete for the same transform.
 */
export function PlanCard({
  plan,
  cycle,
  currency,
  wideOnTablet = false,
  className,
}: PlanCardProps) {
  const { price, featured } = plan;

  return (
    <motion.li
      variants={fadeUp}
      className={cn("flex", wideOnTablet && "md:max-lg:col-span-2", className)}
    >
      <article
        aria-labelledby={`plan-${plan.id}-name`}
        className={cn(
          "group relative flex w-full flex-col overflow-hidden rounded-2xl border p-6 transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8",
          featured
            ? "border-foreground/30 bg-linear-to-b from-highlight-soft/50 via-card to-card shadow-sm hover:border-foreground/45 dark:from-highlight-soft/25"
            : "bg-card hover:border-foreground/25",
        )}
      >
        {/* Thin amber line across the top marks the recommended plan */}
        {featured && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-0.5 bg-highlight"
          />
        )}

        {/* Header: name, optional badge and a one-line description */}
        <div className="flex items-center justify-between gap-3">
          <h3
            id={`plan-${plan.id}-name`}
            className="font-heading text-lg font-semibold tracking-tight sm:text-xl"
          >
            {plan.name}
          </h3>
          {featured && plan.badge && (
            <span className="rounded-md border border-highlight/30 bg-highlight-soft px-2 py-0.5 text-xs font-semibold text-highlight-foreground">
              {plan.badge}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:min-h-12">
          {plan.description}
        </p>

        {/* Price. The wrapper keeps a fixed height so the card never jumps. */}
        <div className="mt-8 min-h-[5.25rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={price.kind === "fixed" ? cycle : "custom"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              {price.kind === "fixed" ? (
                <>
                  <p className="flex items-baseline gap-1">
                    <span className="font-heading text-2xl font-semibold text-muted-foreground">
                      {currency}
                    </span>
                    <span className="font-heading text-5xl leading-none font-semibold tracking-tight tabular-nums">
                      {price[cycle]}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {cycle === "yearly"
                      ? `per month, billed ${currency}${price.yearly * 12} yearly`
                      : "per month, billed monthly"}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-heading text-5xl leading-none font-semibold tracking-tight">
                    {price.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {price.note}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Link
          href={plan.cta.href}
          className={buttonVariants({
            variant: featured ? "default" : "outline",
            size: "xl",
            className: "mt-6 w-full",
          })}
        >
          {plan.cta.label}
        </Link>

        {/* Features */}
        <div className="mt-8 flex-1 border-t pt-6">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            {plan.featuresLabel}
          </p>
          <ul
            role="list"
            className={cn(
              "mt-5 space-y-3.5",
              wideOnTablet &&
                "md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-8 md:max-lg:space-y-0 md:max-lg:gap-y-3.5",
            )}
          >
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm leading-relaxed"
              >
                <IconCheck
                  aria-hidden="true"
                  stroke={2}
                  className="mt-0.5 size-4 shrink-0 text-highlight-foreground"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </motion.li>
  );
}
