import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The quiet "stage" every step preview sits on: a tinted panel with a faint
 * dot grid that fades out toward the bottom. It is not clipped, so a preview
 * can let a small element hang off its edge.
 */
export function PreviewStage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-secondary/50 p-3 sm:p-6",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-80 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

type PreviewFrameProps = {
  /** Window title, shown in the header next to the small brand mark. */
  title: string;
  /** Optional content on the right of the header. */
  meta?: ReactNode;
  /** Accessible name for the whole preview. */
  label: string;
  children: ReactNode;
  className?: string;
};

/** Product window used by all three step previews: border, header, body. */
export function PreviewFrame({
  title,
  meta,
  label,
  children,
  className,
}: PreviewFrameProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary"
          >
            <span className="size-1.5 rounded-full bg-highlight" />
          </span>
          <p className="truncate text-sm leading-tight font-semibold">
            {title}
          </p>
        </div>
        {meta}
      </div>
      {children}
    </div>
  );
}
