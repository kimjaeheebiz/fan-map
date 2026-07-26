"use client";

import Link from "next/link";
import { Pin } from "lucide-react";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { mockNotices } from "@/features/account/data/mock-notices";
import { authNav } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/format-date";

export default function NoticesPage() {
  return (
    <AccountPageShell
      title="공지사항"
      description="서비스 소식과 안내를 확인합니다."
      requireAuth={false}
      backHref={authNav.mypage}
    >
      <Card className="gap-0 divide-y py-0" size="sm">
        {mockNotices.map((notice) => (
          <Link
            key={notice.id}
            href={`${authNav.notices}/${notice.id}`}
            className="hover:bg-muted/50 block px-(--card-spacing) py-3 transition-colors"
          >
            <div className="flex items-center gap-2">
              {notice.pinned ? (
                <Badge
                  variant="secondary"
                  className="size-5 justify-center px-0"
                  aria-label="고정"
                >
                  <Pin className="size-3 fill-current" aria-hidden />
                </Badge>
              ) : null}
              <p className="truncate text-sm font-medium">{notice.title}</p>
            </div>
            <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
              {notice.summary}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {formatDate(notice.publishedAt)}
            </p>
          </Link>
        ))}
      </Card>
    </AccountPageShell>
  );
}
