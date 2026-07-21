import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GuideSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 border-border border-b py-8", className)}>
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function GuideNav({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <nav className="bg-muted/40 mb-6 flex flex-wrap gap-2 rounded-lg p-3 border">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="bg-background text-muted-foreground hover:text-foreground rounded-md px-2.5 py-1.5 text-xs font-medium"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
