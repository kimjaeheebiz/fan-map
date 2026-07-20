import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * 페이지 본문용 카드.
 * Card 기본 py와 Content py가 중복되지 않도록 한 겹만 적용한다.
 */
export function PageCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 py-0", className)}>
      <CardContent className="p-(--card-spacing)">{children}</CardContent>
    </Card>
  );
}
