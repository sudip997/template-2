import Image from "next/image";
import { cn } from "@/lib/utils";
import { panelId, tabId, type Testimonial } from "./types";

/**
 * Two stylised opening quotation marks, drawn as SVG so they stay crisp and
 * take their colour from the surrounding text.
 */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 28"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="9.5" cy="19.5" r="8.5" />
      <path d="M1 19.5C1 8.5 6 2.5 15 .5l1.2 3.5C11 5.5 9 9 9.5 14Z" />
      <circle cx="33.5" cy="19.5" r="8.5" />
      <path d="M25 19.5C25 8.5 30 2.5 39 .5l1.2 3.5C35 5.5 33 9 33.5 14Z" />
    </svg>
  );
}

/** Renders the quote, wrapping the optional highlight phrase in an amber underlay. */
function QuoteText({ text, highlight }: { text: string; highlight?: string }) {
  const start = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || start === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, start)}
      <span className="-mx-0.5 rounded-xs bg-[linear-gradient(transparent_62%,var(--highlight-soft)_62%)] px-0.5 box-decoration-clone">
        {highlight}
      </span>
      {text.slice(start + highlight.length)}
    </>
  );
}

type TestimonialPanelProps = {
  testimonial: Testimonial;
  /** Shared prefix from `useId`, used to build matching tab and panel ids. */
  baseId: string;
  active: boolean;
  className?: string;
};

/**
 * One customer story: a large pull quote, the customer's portrait, their
 * attribution and one headline result.
 *
 * Desktop: a 12-column editorial layout. The portrait takes the left four
 * columns, and the quote and attribution sit to its right, separated by a
 * hairline.
 * Mobile: the quote comes first, then a small portrait beside the attribution,
 * then the result.
 *
 * All panels are stacked in the same grid cell by the parent, so the section
 * never changes height when the visitor switches stories. Inactive panels are
 * hidden from view, from assistive technology and from the tab order.
 */
export function TestimonialPanel({
  testimonial,
  baseId,
  active,
  className,
}: TestimonialPanelProps) {
  const { id, quote, highlight, name, role, company, portrait, result } =
    testimonial;

  return (
    <div
      role="tabpanel"
      id={panelId(baseId, id)}
      aria-labelledby={tabId(baseId, id)}
      aria-hidden={!active}
      inert={!active}
      className={cn(
        // All panels share one grid cell. They cross-fade, and the incoming
        // one waits briefly so the two never overlap at full strength.
        "col-start-1 row-start-1 transition-[opacity,translate,visibility] motion-reduce:transition-none",
        active
          ? "visible translate-y-0 opacity-100 delay-200 duration-500"
          : "pointer-events-none invisible translate-y-3 opacity-0 duration-300 motion-reduce:translate-y-0",
        className,
      )}
    >
      <figure className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-8 sm:gap-x-5 lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
        {/* Quote */}
        <blockquote className="col-span-2 row-start-1 lg:col-span-7 lg:col-start-6 lg:pb-12 xl:pb-16">
          <QuoteMark className="mb-6 h-6 w-auto text-highlight lg:mb-8 lg:h-8" />
          <p className="font-heading text-2xl leading-[1.3] font-medium tracking-tight text-balance sm:text-3xl lg:text-[2rem] xl:text-4xl xl:leading-[1.25]">
            <QuoteText text={quote} highlight={highlight} />
          </p>
        </blockquote>

        {/* Portrait. A quiet amber outline sits offset behind it on desktop. */}
        <div className="relative col-start-1 row-start-2 w-16 self-start sm:w-20 lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-full">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden translate-x-3 translate-y-3 rounded-2xl border border-highlight/40 lg:block"
          />
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted lg:aspect-[4/5] lg:rounded-2xl">
            <Image
              src={portrait}
              alt={`Portrait of ${name}`}
              fill
              sizes="(min-width: 1024px) 33vw, 80px"
              className={cn(
                "object-cover transition-transform duration-1000 ease-out motion-reduce:transition-none",
                active ? "scale-100" : "scale-105",
              )}
            />
          </div>
        </div>

        {/* Hairline that separates the quote from the attribution (desktop only) */}
        <span
          aria-hidden="true"
          className="hidden self-start border-t lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:block"
        />

        {/* Attribution */}
        <figcaption className="col-start-2 row-start-2 min-w-0 self-center lg:col-span-4 lg:col-start-6 lg:self-end lg:pt-6">
          <p className="font-heading text-lg font-semibold tracking-tight lg:text-xl">
            {name}
          </p>
          <p className="mt-1 text-sm leading-snug text-muted-foreground lg:text-base">
            {role}, <span className="font-medium text-foreground">{company}</span>
          </p>
        </figcaption>

        {/* Headline result */}
        <p className="col-span-2 row-start-3 flex items-baseline gap-3 border-t pt-5 lg:col-span-3 lg:col-start-10 lg:row-start-2 lg:block lg:self-end lg:border-t-0 lg:pt-6 lg:text-right">
          <span className="block font-heading text-3xl leading-none font-semibold tracking-tight text-highlight-foreground tabular-nums lg:text-4xl">
            {result.value}
          </span>
          <span className="block text-sm leading-snug text-muted-foreground lg:mt-2">
            {result.label}
          </span>
        </p>
      </figure>
    </div>
  );
}
