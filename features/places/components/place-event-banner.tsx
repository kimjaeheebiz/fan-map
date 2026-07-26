import { Ticket } from "lucide-react";
import type { PlaceEvent } from "@/features/places/types";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type PlaceEventBannerProps = {
  event: PlaceEvent;
  className?: string;
};

/** 상세 상단 프로모 배너 */
export function PlaceEventBanner({ event, className }: PlaceEventBannerProps) {
  const period = `${formatDate(event.startsAt)} ~ ${formatDate(event.endsAt)}`;

  return (
    <div
      className={cn(
        "border-primary/20 bg-primary/5 flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
        className,
      )}
      role="status"
    >
      <span className="bg-primary text-primary-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
        <Ticket className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{event.title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{period}</p>
      </div>
    </div>
  );
}
