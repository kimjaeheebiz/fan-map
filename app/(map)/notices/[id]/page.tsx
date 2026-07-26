"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pin } from "lucide-react";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { getNoticeById } from "@/features/account/data/mock-notices";
import { authNav } from "@/config/navigation";
import { PageCard } from "@/components/common/page-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format-date";

type NoticeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = use(params);
  const notice = getNoticeById(id);

  if (!notice) {
    notFound();
  }

  return (
    <AccountPageShell
      title={notice.title}
      requireAuth={false}
      backHref={authNav.notices}
    >
      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
        {notice.pinned ? (
          <Badge
            variant="secondary"
            className="size-5 justify-center px-0"
            aria-label="고정"
          >
            <Pin className="size-3 fill-current" aria-hidden />
          </Badge>
        ) : null}
        <span>{formatDate(notice.publishedAt)}</span>
      </div>
      <PageCard>
        <article className="whitespace-pre-wrap text-sm leading-relaxed">
          {notice.body}
        </article>
      </PageCard>
      <div>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          render={<Link href={authNav.notices} />}
          nativeButton={false}
        >
          <ArrowLeft data-icon="inline-start" />
          목록으로
        </Button>
      </div>
    </AccountPageShell>
  );
}
