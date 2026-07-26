"use client";

import Link from "next/link";
import {
  Bell,
  FileText,
  HelpCircle,
  Menu,
  Shield,
} from "lucide-react";
import { authNav } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const supportItems = [
  { href: authNav.notices, label: "공지사항", icon: Bell },
  { href: authNav.help, label: "자주 묻는 질문", icon: HelpCircle },
  { href: authNav.terms, label: "이용약관", icon: FileText },
  { href: authNav.privacy, label: "개인정보 처리방침", icon: Shield },
] as const;

/** 헤더 — 고객지원·약관 등 부가 메뉴 */
export function MoreMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            aria-label="메뉴"
          />
        }
      >
        <Menu />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
            고객지원
          </DropdownMenuLabel>
          {supportItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem
                key={item.href}
                render={<Link href={item.href} />}
                nativeButton={false}
              >
                <Icon />
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
