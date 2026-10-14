/** One customer story. Edit the demo data in `testimonials.tsx`. */
export type Testimonial = {
  /** Unique, URL-safe key. Used to link each tab to its panel. */
  id: string;
  /** The quote itself, without surrounding quotation marks. */
  quote: string;
  /**
   * Optional phrase from the quote to emphasise with a soft amber underlay.
   * It must appear in `quote` exactly, otherwise it is ignored.
   */
  highlight?: string;
  name: string;
  role: string;
  company: string;
  /** Path or URL of the customer's portrait. Portrait orientation (4:5) works best. */
  portrait: string;
  /** A single headline result, for example "41%" and "less forecast variance". */
  result: { value: string; label: string };
};

/** Shared id helpers so each tab and its panel can reference one another. */
export const tabId = (base: string, id: string) => `${base}-tab-${id}`;
export const panelId = (base: string, id: string) => `${base}-panel-${id}`;
