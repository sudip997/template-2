"use client";

import { useId, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  IconBell,
  IconChevronDown,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import { Avatar } from "@/components/hero/avatar";
import { cn } from "@/lib/utils";
import { tween } from "./motion";
import { PreviewFrame, PreviewStage } from "./preview-frame";

/* -------------------------------------------------------------------------- */
/*  Content and mock data. Replace with your own teams and copy.              */
/* -------------------------------------------------------------------------- */

const content = {
  title: "Share Q4 forecast",
  invitePlaceholder: "Add people or teams",
  invite: "Invite",
  alertTitle: "Alert everyone when numbers move",
  alertDescription: "Sent when the forecast changes by more than 5%.",
  toast: { headline: "Forecast up 4.2%", detail: "Finance notified" },
} as const;

const ROLES = ["Can edit", "Can view"] as const;
type Role = (typeof ROLES)[number];

type Team = { id: string; name: string; detail: string; role: Role };

/** The owner is fixed. Teams get a role the viewer can change. */
const owner = { name: "Maya Rao", detail: "You", initials: "MR" } as const;

const teams: Team[] = [
  { id: "finance", name: "Finance", detail: "6 people", role: "Can edit" },
  { id: "sales", name: "Sales", detail: "14 people", role: "Can view" },
  {
    id: "leadership",
    name: "Leadership",
    detail: "5 people",
    role: "Can view",
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function SharePreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const uid = useId();

  const [roles, setRoles] = useState<Record<string, Role>>(() =>
    Object.fromEntries(teams.map((team) => [team.id, team.role])),
  );
  const [notify, setNotify] = useState(true);

  const show = inView || Boolean(reduceMotion);
  const rowMotion = (index: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: show ? 1 : 0, y: show ? 0 : 8 },
    transition: tween(reduceMotion, 0.5, 0.2 + index * 0.12),
  });

  return (
    <div ref={ref}>
      <PreviewStage>
        <PreviewFrame
          label="Sharing and alerts preview"
          title={content.title}
          meta={
            <p className="shrink-0 text-xs text-muted-foreground">
              {teams.length + 1} with access
            </p>
          }
        >
          {/* Invite row. A static mock, so it is hidden from assistive technology. */}
          <div
            aria-hidden="true"
            className="flex items-center gap-2 px-4 pt-4 sm:px-5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm text-muted-foreground">
              <IconUserPlus className="size-4 shrink-0" stroke={1.75} />
              <span className="truncate">{content.invitePlaceholder}</span>
            </div>
            <span className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
              {content.invite}
            </span>
          </div>

          {/* Who has access */}
          <ul className="mt-4 divide-y border-y">
            <motion.li
              {...rowMotion(0)}
              className="flex items-center gap-3 px-4 py-3 sm:px-5"
            >
              <Avatar
                initials={owner.initials}
                tone="amber"
                className="size-8 ring-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm leading-tight font-medium">
                  {owner.name}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {owner.detail}
                </p>
              </div>
              <span className="shrink-0 pr-1 text-xs text-muted-foreground">
                Owner
              </span>
            </motion.li>

            {teams.map((team, index) => (
              <motion.li
                key={team.id}
                {...rowMotion(index + 1)}
                className="flex items-center gap-3 px-4 py-3 sm:px-5"
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
                >
                  <IconUsers className="size-4" stroke={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm leading-tight font-medium">
                    {team.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {team.detail}
                  </p>
                </div>
                <span className="relative inline-flex shrink-0">
                  <select
                    aria-label={`${team.name} access`}
                    value={roles[team.id]}
                    onChange={(event) =>
                      setRoles((current) => ({
                        ...current,
                        [team.id]: event.target.value as Role,
                      }))
                    }
                    className="cursor-pointer appearance-none rounded-md border bg-card py-1 pr-7 pl-2.5 text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 text-muted-foreground"
                  />
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Alerts */}
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
            <div className="min-w-0">
              <p id={`${uid}-alert`} className="text-sm font-medium">
                {content.alertTitle}
              </p>
              <p
                id={`${uid}-alert-description`}
                className="mt-0.5 text-xs text-muted-foreground"
              >
                {content.alertDescription}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notify}
              aria-labelledby={`${uid}-alert`}
              aria-describedby={`${uid}-alert-description`}
              onClick={() => setNotify((current) => !current)}
              className={cn(
                "relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-300 outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                notify ? "border-highlight bg-highlight" : "bg-muted",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-0.5 left-0.5 size-[1.125rem] rounded-full bg-white shadow-sm transition-transform duration-300 motion-reduce:transition-none",
                  notify ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
          </div>
        </PreviewFrame>

        {/* The alert, hanging off the corner. It goes away when alerts are turned off. */}
        <motion.p
          aria-hidden="true"
          className="absolute -bottom-9 left-3 z-10 hidden items-center gap-2.5 rounded-lg border bg-card py-2 pr-3.5 pl-2 text-xs shadow-md shadow-black/5 sm:flex sm:left-8 dark:shadow-black/30"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: show && notify ? 1 : 0,
            y: show && notify ? 0 : 8,
          }}
          transition={tween(reduceMotion, 0.5, show && notify ? 1.4 : 0)}
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-highlight-soft text-highlight-foreground">
            <IconBell className="size-4" stroke={1.75} />
          </span>
          <span>
            <span className="font-medium">{content.toast.headline}</span>
            <span className="text-muted-foreground">
              {" "}
              · {content.toast.detail}
            </span>
          </span>
        </motion.p>
      </PreviewStage>
    </div>
  );
}
