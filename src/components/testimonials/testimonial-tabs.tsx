"use client";

import { useRef, type KeyboardEvent } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "./motion";
import { panelId, tabId, type Testimonial } from "./types";

type TestimonialTabsProps = {
  items: Testimonial[];
  activeIndex: number;
  onChange: (index: number) => void;
  /** Shared prefix from `useId`, used to build matching tab and panel ids. */
  baseId: string;
  className?: string;
};

/**
 * A quiet index of the customers, one column each, that doubles as the story
 * switcher. It follows the WAI-ARIA tabs pattern: a single tab stop, arrow
 * keys (and Home / End) move between customers, and the story changes as
 * focus moves.
 */
export function TestimonialTabs({
  items,
  activeIndex,
  onChange,
  baseId,
  className,
}: TestimonialTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = items.length - 1;
    let next: number;

    switch (event.key) {
      case "ArrowRight":
        next = activeIndex === last ? 0 : activeIndex + 1;
        break;
      case "ArrowLeft":
        next = activeIndex === 0 ? last : activeIndex - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    onChange(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Customer stories"
      onKeyDown={handleKeyDown}
      className={cn("grid grid-cols-3 border-t", className)}
    >
      {items.map((item, index) => {
        const selected = index === activeIndex;

        return (
          <button
            key={item.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={tabId(baseId, item.id)}
            aria-selected={selected}
            aria-controls={panelId(baseId, item.id)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(index)}
            className={cn(
              "group relative flex min-w-0 flex-col items-start gap-3 rounded-b-lg pt-5 pr-3 pb-1 text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex-row sm:items-center sm:gap-4 sm:pr-6",
            )}
          >
            {/* Amber marker that glides to the selected customer */}
            {selected && (
              <motion.span
                layoutId={`${baseId}-marker`}
                aria-hidden="true"
                transition={{ duration: 0.5, ease: EASE_OUT }}
                className="absolute inset-x-0 -top-px h-0.5 bg-highlight"
              />
            )}

            <span
              className={cn(
                "relative size-9 shrink-0 overflow-hidden rounded-lg border bg-muted transition-opacity duration-300 sm:size-11",
                selected ? "opacity-100" : "opacity-60 group-hover:opacity-100",
              )}
            >
              <Image
                src={item.portrait}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>

            <span className="min-w-0">
              <span
                className={cn(
                  "block truncate text-sm font-medium transition-colors duration-300",
                  selected
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                {item.name}
              </span>
              <span className="mt-0.5 hidden truncate text-sm text-muted-foreground sm:block">
                {item.company}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
