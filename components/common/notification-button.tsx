"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockNotifications = [
  { id: "1", title: "새 사용자 등록", time: "방금 전" },
  { id: "2", title: "시스템 점검 안내", time: "1시간 전" },
  { id: "3", title: "주간 리포트가 준비되었습니다.", time: "어제" },
];

export function NotificationButton() {
  const hasUnread = mockNotifications.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative"
            aria-label="알림"
          />
        }
      >
        <Bell />
        {hasUnread && (
          <span className="bg-destructive absolute top-1.5 right-1.5 size-1.5 rounded-full" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="text-foreground font-medium">
          알림
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockNotifications.map((item) => (
          <DropdownMenuItem key={item.id} className="flex-col items-start gap-0.5">
            <span>{item.title}</span>
            <span className="text-muted-foreground text-xs font-normal">
              {item.time}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
