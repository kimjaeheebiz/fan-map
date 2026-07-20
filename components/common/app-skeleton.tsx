import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type AppSkeletonProps = {
  rows?: number;
  className?: string;
};

/** 목록/카드 자리 표시용 Skeleton 패턴 */
export function AppSkeleton({ rows = 5, className }: AppSkeletonProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-10 w-full max-w-sm" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export { Skeleton };
