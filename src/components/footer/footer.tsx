import Link from "next/link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import { Container } from "@/components/container";
import { cn } from "@/lib/utils";
import {
  FooterNavColumn,
  footerLinkClass,
  type FooterColumn,
  type FooterLink,
} from "./footer-nav-column";
import { FooterSocial, type SocialLink } from "./footer-social";

/* -------------------------------------------------------------------------- */
/*  Content. Edit these to customise the brand, links and legal text. All      */
/*  links below are placeholders: `#` links go nowhere until you replace them. */
/* -------------------------------------------------------------------------- */

const content = {
  brand: { name: "Acme", href: "/" },
  description:
    "Revenue forecasting that connects to your billing, CRM and data warehouse, so every team plans from the same numbers.",
  /** Update the year when you publish; the holder appears right after it. */
  copyright: { year: 2026, holder: "Acme, Inc." },
} as const;

/** Remove an entry to hide that network. Each icon must be a Tabler icon. */
const socialLinks: SocialLink[] = [
  { label: "X", href: "https://x.com", icon: IconBrandX },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: IconBrandLinkedin,
  },
  { label: "GitHub", href: "https://github.com", icon: IconBrandGithub },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    icon: IconBrandYoutube,
  },
];

/**
 * Link columns. Add, remove or rename columns freely: the grid is three
 * columns wide from the `sm` breakpoint, so three or six columns look best.
 * Links to sections on this page use their real anchors.
 */
const columns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Integrations", href: "#" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Customers", href: "#testimonials" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help center", href: "#" },
      { label: "API reference", href: "#" },
      { label: "Community", href: "#" },
      { label: "System status", href: "#" },
    ],
  },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function Footer({ className }: { className?: string }) {
  return (
    // The footer is deliberately quiet: it sits on a faint tint with hairline
    // dividers, so the closing CTA above stays the last thing that stands out.
    <footer
      aria-labelledby="footer-heading"
      className={cn("border-t bg-muted/40", className)}
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <Container>
        {/*
          Mobile: brand first, then the link columns below it. Desktop: the
          brand takes the left third and the links sit in an offset block to
          its right, with an empty column between them for breathing room.
        */}
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          <div className="lg:col-span-4">
            <Link
              href={content.brand.href}
              className="inline-flex items-center gap-2 rounded-md font-heading text-lg font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span
                aria-hidden="true"
                className="size-2.5 rounded-[3px] bg-highlight"
              />
              {content.brand.name}
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-pretty text-muted-foreground">
              {content.description}
            </p>

            <FooterSocial links={socialLinks} className="mt-6" />
          </div>

          {/* Two columns on phones (the third wraps below), three from `sm` */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6"
          >
            {columns.map((column) => (
              <FooterNavColumn key={column.title} {...column} />
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {content.copyright.year} {content.copyright.holder} All
            rights reserved.
          </p>

          <nav aria-label="Legal">
            <ul role="list" className="flex items-center gap-x-5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
