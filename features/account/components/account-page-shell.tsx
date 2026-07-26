"use client";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AccountSideNav } from "@/features/account/components/account-side-nav";
import { authNav } from "@/config/navigation";
import { AppContainer } from "@/components/layout/app-container";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/common/loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type AccountPageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** false면 비로그인도 접근 (약관·공지 등) */
  requireAuth?: boolean;
  backHref?: string;
  className?: string;
};

export function AccountPageShell({
  title,
  description,
  children,
  requireAuth = true,
  backHref,
  className,
}: AccountPageShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isReady } = useAuth();

  useEffect(() => {
    if (!requireAuth || !isReady || isAuthenticated) return;
    router.replace(
      `${authNav.login}?returnUrl=${encodeURIComponent(pathname || authNav.mypage)}`,
    );
  }, [requireAuth, isReady, isAuthenticated, pathname, router]);

  if (requireAuth && (!isReady || !isAuthenticated)) {
    return <Loading label="계정 불러오는 중..." className="h-full" />;
  }

  const resolvedBack = backHref ?? authNav.mypage;

  return (
    <div className="bg-canvas flex h-full min-h-0">
      <aside className="border-border bg-card hidden h-full w-80 shrink-0 flex-col border-r md:flex lg:w-96">
        <ScrollArea className="min-h-0 flex-1 px-2 py-3">
          <AccountSideNav />
        </ScrollArea>
      </aside>

      <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
        <AppContainer className={cn("max-w-5xl gap-5", className)}>
          <div className="flex items-start gap-2 md:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="mt-0.5 shrink-0 md:hidden"
              aria-label="뒤로"
              render={<Link href={resolvedBack} />}
              nativeButton={false}
            >
              <ArrowLeft />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
              {description ? (
                <p className="text-muted-foreground mt-0.5 text-sm">
                  {description}
                </p>
              ) : null}
            </div>
          </div>
          {children}
        </AppContainer>
      </div>
    </div>
  );
}
