"use client";

import { useRouter } from "next/navigation";
import {
  Bell,
  FileText,
  HelpCircle,
  LogOut,
  MessageSquareText,
  Settings,
  Shield,
  Star,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authProviderLabels } from "@/features/auth/types";
import { authNav } from "@/config/navigation";
import {
  AccountMenuList,
  type AccountMenuItem,
} from "@/features/account/components/account-menu-list";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { PageCard } from "@/components/common/page-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format-date";
import { nicknameInitial } from "@/lib/nickname";

const activityItems: AccountMenuItem[] = [
  {
    href: authNav.myReports,
    label: "방문 기록",
    icon: MessageSquareText,
  },
  {
    href: authNav.myFavorites,
    label: "즐겨찾기",
    icon: Star,
  },
];

const accountItems: AccountMenuItem[] = [
  {
    href: authNav.profile,
    label: "내 정보 관리",
    icon: UserRound,
  },
  {
    href: authNav.settings,
    label: "설정",
    icon: Settings,
  },
];

const supportItems: AccountMenuItem[] = [
  {
    href: authNav.notices,
    label: "공지사항",
    icon: Bell,
  },
  {
    href: authNav.help,
    label: "자주 묻는 질문",
    icon: HelpCircle,
  },
  {
    href: authNav.terms,
    label: "이용약관",
    icon: FileText,
  },
  {
    href: authNav.privacy,
    label: "개인정보 처리방침",
    icon: Shield,
  },
];

export default function MyPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (!user) {
    return (
      <AccountPageShell title="마이페이지" backHref="/">
        {null}
      </AccountPageShell>
    );
  }

  return (
    <AccountPageShell
      title="마이페이지"
      description="계정과 내 활동을 관리합니다."
      backHref="/"
    >
      <PageCard>
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>{nicknameInitial(user.nickname)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-medium">{user.nickname}</p>
              <Badge variant="secondary">
                {authProviderLabels[user.provider]}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              마지막 로그인{" "}
              {formatDateTime(user.lastLoginAt ?? user.createdAt)}
            </p>
          </div>
        </div>
      </PageCard>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-muted-foreground px-1 text-xs font-medium">
            내 활동
          </p>
          <AccountMenuList items={activityItems} />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground px-1 text-xs font-medium">계정</p>
          <AccountMenuList items={accountItems} />
        </div>

        <div className="space-y-2 md:col-span-2">
          <p className="text-muted-foreground px-1 text-xs font-medium">
            고객지원
          </p>
          <AccountMenuList items={supportItems} />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleLogout}
        >
          <LogOut data-icon="inline-start" />
          로그아웃
        </Button>
      </div>
    </AccountPageShell>
  );
}
