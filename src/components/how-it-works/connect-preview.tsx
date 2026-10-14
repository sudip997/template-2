"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  IconCheck,
  IconCreditCard,
  IconDatabase,
  IconLoader2,
  IconReceipt2,
  IconUsers,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { tween } from "./motion";
import { PreviewFrame, PreviewStage } from "./preview-frame";

/* -------------------------------------------------------------------------- */
/*  Content and mock data. Replace with your own sources and copy.            */
/*  Generic categories on purpose, so no real brand logos are needed.         */
/* -------------------------------------------------------------------------- */

const content = {
  title: "Data sources",
  importing: "Importing history…",
  imported: "24 months of history imported",
} as const;

type Source = {
  id: string;
  label: string;
  detail: string;
  /** Records imported once the source is connected. */
  records: number;
  icon: Icon;
};

const sources: Source[] = [
  {
    id: "payments",
    label: "Payments",
    detail: "Card and bank payments",
    records: 12480,
    icon: IconCreditCard,
  },
  {
    id: "billing",
    label: "Billing",
    detail: "Subscriptions and invoices",
    records: 3920,
    icon: IconReceipt2,
  },
  {
    id: "crm",
    label: "CRM",
    detail: "Accounts and pipeline",
    records: 8115,
    icon: IconUsers,
  },
  {
    id: "warehouse",
    label: "Warehouse",
    detail: "Product usage events",
    records: 41260,
    icon: IconDatabase,
  },
];

/* Timing (ms), measured from when the preview scrolls into view. */
const FIRST_DONE = 900; // first source finishes syncing
const STEP = 1000; // time between sources

const numberFormat = new Intl.NumberFormat("en-US");

type Status = "waiting" | "syncing" | "connected";

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ConnectPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [connected, setConnected] = useState(0);

  // The sources connect one after another, once, when the preview appears.
  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timers = sources.map((_, index) =>
      window.setTimeout(
        () => setConnected(index + 1),
        FIRST_DONE + index * STEP,
      ),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [inView, reduceMotion]);

  // People who prefer reduced motion get the finished state straight away.
  const completed = reduceMotion ? sources.length : connected;
  const started = inView || Boolean(reduceMotion);
  const finished = completed === sources.length;
  const importedRecords = sources
    .slice(0, completed)
    .reduce((total, source) => total + source.records, 0);

  const statusOf = (index: number): Status => {
    if (index < completed) return "connected";
    if (index === completed && started) return "syncing";
    return "waiting";
  };

  return (
    <div ref={ref}>
      <PreviewStage>
        <PreviewFrame
          label="Connecting data sources preview"
          title={content.title}
          meta={
            <p
              aria-hidden="true"
              className="shrink-0 text-xs text-muted-foreground tabular-nums"
            >
              {completed} of {sources.length} connected
            </p>
          }
        >
          <p className="sr-only">
            {`Sources: ${sources.map((source) => source.label).join(", ")}. ${content.imported}.`}
          </p>

          <div aria-hidden="true">
            <ul className="divide-y">
              {sources.map((source, index) => {
                const status = statusOf(index);
                const SourceIcon = source.icon;
                return (
                  <li
                    key={source.id}
                    className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
                  >
                    <span
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-lg border bg-background transition-[color,border-color] duration-500",
                        status === "connected"
                          ? "border-highlight/40 text-highlight-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      <SourceIcon className="size-[1.125rem]" stroke={1.75} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm leading-tight font-medium">
                        {source.label}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground tabular-nums">
                        {status === "connected"
                          ? `${numberFormat.format(source.records)} records`
                          : source.detail}
                      </p>
                    </div>

                    {/* Fixed width, so the row never shifts as the status changes */}
                    <div className="flex w-[5.5rem] shrink-0 justify-end">
                      <motion.span
                        key={status}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={tween(reduceMotion, 0.35)}
                        className="inline-flex"
                      >
                        {status === "connected" && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-highlight-soft px-2 py-0.5 text-[0.6875rem] font-medium text-highlight-foreground">
                            <IconCheck className="size-3" stroke={2.5} />
                            Connected
                          </span>
                        )}
                        {status === "syncing" && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <IconLoader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
                            Syncing
                          </span>
                        )}
                        {status === "waiting" && (
                          <span className="text-xs text-muted-foreground">
                            Waiting
                          </span>
                        )}
                      </motion.span>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* History import progress */}
            <div className="border-t bg-muted/40 px-4 py-3.5 sm:px-5">
              <div className="flex items-center justify-between gap-3 text-xs">
                <p className="font-medium">
                  {finished ? content.imported : content.importing}
                </p>
                <p className="text-muted-foreground tabular-nums">
                  {numberFormat.format(importedRecords)} records
                </p>
              </div>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full bg-highlight"
                  initial={{ width: "0%" }}
                  animate={{
                    width: `${(completed / sources.length) * 100}%`,
                  }}
                  transition={tween(reduceMotion, 0.7)}
                />
              </div>
            </div>
          </div>
        </PreviewFrame>
      </PreviewStage>
    </div>
  );
}
