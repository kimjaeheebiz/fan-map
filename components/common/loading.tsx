import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingProps = {
  label?: string;
  className?: string;
  fullPage?: boolean;
};

export function Loading({
  label = "불러오는 중...",
  className,
  fullPage = false,
}: LoadingProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex flex-col items-center justify-center gap-3",
        fullPage ? "min-h-[50vh]" : "py-16",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-6 animate-spin" />
      <p>{label}</p>
    </div>
  );
}
