import { Flame, History } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportActivityIconProps = {
  variant: "today" | "recent";
  className?: string;
  /** 목록·상세 강조용 원형 뱃지. 필터 칩은 bare. */
  appearance?: "badge" | "bare";
};

/** 오늘·핫(Flame) / 그 외 최근(History) */
export function ReportActivityIcon({
  variant,
  className,
  appearance = "badge",
}: ReportActivityIconProps) {
  const Icon = variant === "today" ? Flame : History;

  if (appearance === "bare") {
    return (
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          variant === "today" && "fill-current",
          className,
        )}
        aria-hidden
      />
    );
  }

  return (
    <span
      className={cn(
        "bg-report text-report-foreground inline-flex size-5 shrink-0 items-center justify-center rounded-full",
        className,
      )}
      aria-hidden
    >
      <Icon
        className={cn("size-3", variant === "today" && "fill-current")}
      />
    </span>
  );
}
