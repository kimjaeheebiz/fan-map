import { Ticket } from "lucide-react";
import type { PlaceEvent } from "@/features/places/types";
import { cn } from "@/lib/utils";

type PlaceEventBadgeProps = {
  event: PlaceEvent;
  className?: string;
};

/** 목록 썸네일용 이벤트 뱃지 */
export function PlaceEventBadge({ event, className }: PlaceEventBadgeProps) {
  const label = event.badgeLabel ?? "이벤트";

  return (
    <span
      className={cn(
        "bg-primary text-primary-foreground absolute top-1 right-1 flex size-6 items-center justify-center rounded-full shadow-xs",
        className,
      )}
      aria-label={label}
      title={event.title}
    >
      <Ticket className="size-3.5" aria-hidden />
    </span>
  );
}
