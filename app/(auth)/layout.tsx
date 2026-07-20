import type { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { appConfig } from "@/config/app";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-svh flex-col items-center justify-center px-4 py-10">
      <div className="mb-4 flex flex-col items-center gap-2 text-center">
        <Link href="/" className="flex items-center gap-2 font-semibold text-base">
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md">
            W
          </span>
          <span>{appConfig.name}</span>
        </Link>
        <p className="text-muted-foreground">
          서비스 설명 문구
        </p>
      </div>
      <Card className="w-full max-w-md gap-0 py-0">
        <CardContent className="p-(--card-spacing)">{children}</CardContent>
      </Card>
    </div>
  );
}
