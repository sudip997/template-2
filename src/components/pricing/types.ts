export type BillingCycle = "monthly" | "yearly";

/** Price shown per month. `yearly` is the per-month price when billed annually. */
export type PlanPrice =
  | { kind: "fixed"; monthly: number; yearly: number }
  | { kind: "custom"; label: string; note: string };

export type Plan = {
  id: string;
  name: string;
  description: string;
  price: PlanPrice;
  /** Small lead-in above the feature list, e.g. "Everything in Starter, plus". */
  featuresLabel: string;
  features: string[];
  cta: { label: string; href: string };
  /** Marks the recommended plan. Gets a quiet highlight and the badge below. */
  featured?: boolean;
  badge?: string;
};
