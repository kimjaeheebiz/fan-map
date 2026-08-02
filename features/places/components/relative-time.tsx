"use client";

import { Popover } from "@base-ui/react/popover";
import { formatRelativeTime } from "@/features/places/lib/place-helpers";
import { formatDateTimeMinute } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type RelativeTimeProps = {
  value: string;
  className?: string;
};

/** 상대 시각 — 축약 표기일 때만 PC 호버·모바일 탭으로 절대 일시 */
export function RelativeTime({ value, className }: RelativeTimeProps) {
  const absolute = formatDateTimeMinute(value);
  const label = formatRelativeTime(value);
  const isAbbreviated = label !== absolute;

  if (!isAbbreviated) {
    return <span className={cn("text-xs", className)}>{label}</span>;
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover
        delay={0}
        closeDelay={0}
        className={cn(
          "hover:text-foreground inline cursor-pointer border-0 bg-transparent p-0 font-inherit text-xs underline decoration-dotted underline-offset-2",
          className,
        )}
        aria-label={absolute}
      >
        {label}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          sideOffset={4}
          className="isolate z-[120]"
        >
          <Popover.Popup
            initialFocus={false}
            className="data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 z-[120] inline-flex w-fit max-w-xs origin-(--transform-origin) items-center rounded-md bg-foreground px-3 py-1.5 text-xs text-background"
          >
            {absolute}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
