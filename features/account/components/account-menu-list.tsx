import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type AccountMenuItem = {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  destructive?: boolean;
};

type AccountMenuListProps = {
  items: AccountMenuItem[];
  className?: string;
};

export function AccountMenuList({ items, className }: AccountMenuListProps) {
  return (
    <Card className={cn("gap-0 divide-y py-0", className)} size="sm">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "hover:bg-muted/50 flex items-center gap-3 px-(--card-spacing) py-3 transition-colors",
              item.destructive && "text-destructive",
            )}
          >
            {Icon ? (
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  item.destructive
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{item.label}</p>
              {item.description ? (
                <p className="text-muted-foreground truncate text-xs">
                  {item.description}
                </p>
              ) : null}
            </div>
            <ChevronRight className="text-muted-foreground size-4 shrink-0" />
          </Link>
        );
      })}
    </Card>
  );
}
