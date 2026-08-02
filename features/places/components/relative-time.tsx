"use client";

import { formatRelativeTime } from "@/features/places/lib/place-helpers";
import { formatDateTimeMinute } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RelativeTimeProps = {
  value: string;
  className?: string;
};

/** 상대 시각 + 호버 시 절대 일시 툴팁 */
export function RelativeTime({ value, className }: RelativeTimeProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<span />}
        className={cn(
          "hover:text-foreground cursor-default underline decoration-dotted underline-offset-2",
          className,
        )}
      >
        {formatRelativeTime(value)}
      </TooltipTrigger>
      <TooltipContent>{formatDateTimeMinute(value)}</TooltipContent>
    </Tooltip>
  );
}
