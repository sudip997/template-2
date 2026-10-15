import Link from "next/link";
import { cn } from "@/lib/utils";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: readonly FooterLink[];
};

/**
 * Shared style for every text link in the footer (columns and legal links),
 * so the hover and focus treatment stays identical everywhere.
 */
export const footerLinkClass =
  "inline-block rounded-sm py-1 text-sm text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none";

/**
 * One titled list of links. Render several inside a single
 * `<nav aria-label="Footer">` so assistive tech announces one landmark.
 */
export function FooterNavColumn({
  title,
  links,
  className,
}: FooterColumn & { className?: string }) {
  return (
    <div className={cn(className)}>
      <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <ul role="list" className="mt-4 space-y-1">
        {links.map((link) => (
          // Keyed by label because placeholder links can share the same href.
          <li key={link.label}>
            <Link href={link.href} className={footerLinkClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
