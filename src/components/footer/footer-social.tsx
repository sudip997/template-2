import type { Icon } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type SocialLink = {
  /** Network name, used for the accessible label. Example: "LinkedIn". */
  label: string;
  href: string;
  icon: Icon;
};

/**
 * Row of icon-only links to your social profiles. Each link opens in a new
 * tab, and says so in its accessible name since there is no visible text.
 */
export function FooterSocial({
  links,
  label = "Social media",
  className,
}: {
  links: readonly SocialLink[];
  /** Accessible name for the list. */
  label?: string;
  className?: string;
}) {
  return (
    <ul
      role="list"
      aria-label={label}
      className={cn("flex items-center gap-2", className)}
    >
      {links.map(({ label: network, href, icon: NetworkIcon }) => (
        <li key={network}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${network} (opens in a new tab)`}
            className="flex size-9 items-center justify-center rounded-lg border text-muted-foreground outline-none transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
          >
            <NetworkIcon
              aria-hidden="true"
              className="size-[18px]"
              stroke={1.75}
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
