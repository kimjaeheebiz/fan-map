"use client";

import { useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Drama,
  Mic2,
  SportShoe,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/** 서비스 모드 ID */
export type ServiceModeId = "sports" | "artist" | "brand" | "culture";

type ServiceMode = {
  id: ServiceModeId;
  label: string;
  icon: LucideIcon;
  available: boolean; // false면 준비 중
};

const SERVICE_MODES: ServiceMode[] = [
  { id: "sports", label: "스포츠", icon: SportShoe, available: true },
  { id: "artist", label: "아티스트", icon: Mic2, available: false },
  { id: "brand", label: "브랜드", icon: Building2, available: false },
  { id: "culture", label: "문화", icon: Drama, available: false },
];

const DEFAULT_MODE: ServiceModeId = "sports";

const COMING_SOON_MESSAGE = "준비 중인 서비스입니다.";

/** 헤더 — 서비스 모드 전환 (스포츠만 활성) */
export function ServiceModeSwitcher({ className }: { className?: string }) {
  const [mode, setMode] = useState<ServiceModeId>(DEFAULT_MODE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const current = SERVICE_MODES.find((m) => m.id === mode) ?? SERVICE_MODES[0];
  const CurrentIcon = current.icon;

  function selectMode(next: ServiceMode) {
    if (!next.available) {
      toast.message(COMING_SOON_MESSAGE);
      return;
    }
    setMode(next.id);
    setDrawerOpen(false);
  }

  return (
    <>
      {/* 데스크톱 — Dropdown */}
      <div className={cn("hidden md:block", className)}>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="gap-1.5 font-medium"
                aria-label={`서비스 모드: ${current.label}`}
              />
            }
          >
            <ModeTriggerLabel mode={current} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>서비스 모드</DropdownMenuLabel>
              {SERVICE_MODES.map((item) => (
                <ModeMenuItem
                  key={item.id}
                  mode={item}
                  selected={item.id === mode}
                  onSelect={() => selectMode(item)}
                />
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 모바일 — Drawer (아이콘만) */}
      <div className={cn("md:hidden", className)}>
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          showSwipeHandle
        >
          <DrawerTrigger
            render={
              <Button
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label={`서비스 모드: ${current.label}`}
                title={current.label}
              />
            }
          >
            <CurrentIcon />
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>서비스 모드</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col gap-1 p-4 pt-2">
              {SERVICE_MODES.map((item) => (
                <ModeDrawerItem
                  key={item.id}
                  mode={item}
                  selected={item.id === mode}
                  onSelect={() => selectMode(item)}
                />
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
}

function ModeTriggerLabel({ mode }: { mode: ServiceMode }) {
  const Icon = mode.icon;

  return (
    <>
      <Icon className="size-4" />
      <span>{mode.label}</span>
      <ChevronDown className="size-3.5 opacity-60" data-icon="inline-end" />
    </>
  );
}

function ModeMenuItem({
  mode,
  selected,
  onSelect,
}: {
  mode: ServiceMode;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = mode.icon;

  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={cn(!mode.available && "opacity-70")}
    >
      <Icon />
      <span className="flex-1">{mode.label}</span>
      {mode.available ? (
        selected ? (
          <Check className="text-foreground size-4" />
        ) : null
      ) : (
        <Badge variant="wait">준비 중</Badge>
      )}
    </DropdownMenuItem>
  );
}

function ModeDrawerItem({
  mode,
  selected,
  onSelect,
}: {
  mode: ServiceMode;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = mode.icon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        selected && mode.available && "bg-accent text-accent-foreground",
        !mode.available && "opacity-70",
      )}
      aria-current={selected && mode.available ? "true" : undefined}
    >
      <Icon className="size-4 shrink-0" />
      <span className="flex-1 text-left">{mode.label}</span>
      {mode.available ? (
        selected ? (
          <Check className="size-4" />
        ) : null
      ) : (
        <Badge variant="wait">준비 중</Badge>
      )}
    </button>
  );
}
