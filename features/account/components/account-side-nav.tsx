"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FileText,
  HelpCircle,
  MessageSquareText,
  Settings,
  Shield,
  Star,
  UserRound,
} from "lucide-react";
import { authNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    title: "내 활동",
    items: [
      {
        href: authNav.mypage,
        label: "마이페이지",
        icon: UserRound,
        exact: true as const,
      },
      { href: authNav.myReports, label: "방문 기록", icon: MessageSquareText },
      { href: authNav.myFavorites, label: "즐겨찾기", icon: Star },
    ],
  },
  {
    title: "계정",
    items: [
      { href: authNav.profile, label: "내 정보 관리", icon: UserRound },
      { href: authNav.settings, label: "설정", icon: Settings },
    ],
  },
  {
    title: "고객지원",
    items: [
      { href: authNav.notices, label: "공지사항", icon: Bell },
      { href: authNav.help, label: "자주 묻는 질문", icon: HelpCircle },
      { href: authNav.terms, label: "이용약관", icon: FileText },
      { href: authNav.privacy, label: "개인정보 처리방침", icon: Shield },
    ],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  if (href === authNav.notices) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountSideNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex flex-col gap-5", className)}
      aria-label="계정 메뉴"
    >
      {navGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="text-muted-foreground px-2 text-xs font-medium">
            {group.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(
                pathname,
                item.href,
                "exact" in item ? Boolean(item.exact) : false,
              );
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="size-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
