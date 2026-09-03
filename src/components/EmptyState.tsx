import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border px-6 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
        {icon}
      </span>
      <div className="space-y-1.5">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="mx-auto max-w-[42ch] text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
