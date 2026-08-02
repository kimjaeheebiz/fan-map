"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  UserPen,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { authProviderLabels } from "@/features/auth/types";
import { authNav } from "@/config/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function nicknameInitial(nickname: string) {
  return nickname.trim().slice(0, 1) || "?";
}

export function UserMenu() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Button
        variant="outline"
        size="sm"
        render={<Link href={authNav.login} />}
        nativeButton={false}
      >
        로그인
      </Button>
    );
  }

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="overflow-hidden p-0"
            aria-label="계정 메뉴"
          />
        }
      >
        <Avatar className="size-full after:hidden">
          <AvatarFallback>{nicknameInitial(user.nickname)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="text-foreground font-medium">
                {user.nickname}
              </span>
              <span className="text-muted-foreground text-xs">
                {user.email ?? `${authProviderLabels[user.provider]} 계정`}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link href={authNav.mypage} />}
          nativeButton={false}
        >
          <UserRound />
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuItem
          render={<Link href={authNav.profile} />}
          nativeButton={false}
        >
          <UserPen />
          내 정보 관리
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
