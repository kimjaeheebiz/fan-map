"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAppConfig } from "@/providers/theme-provider";
import type { ThemeMode } from "@/config/app";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const modes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "light", icon: Sun },
  { value: "dark", label: "dark", icon: Moon },
  { value: "system", label: "system", icon: Monitor },
];

/**
 * variant="toggle" — 헤더용 단일 아이콘 (light ↔ dark)
 * variant="group" — 라이트 / 다크 / 시스템 버튼 그룹 (가이드용)
 */
export function ThemeSwitcher({
  className,
  variant = "toggle",
}: {
  className?: string;
  variant?: "toggle" | "group";
}) {
  if (variant === "group") {
    return <ThemeModeGroup className={className} />;
  }

  return <ThemeModeToggle className={className} />;
}

function ThemeModeToggle({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const { setConfig } = useAppConfig();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title={isDark ? "라이트 모드" : "다크 모드"}
      onClick={() => setConfig({ theme: isDark ? "light" : "dark" })}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}

function ThemeModeGroup({ className }: { className?: string }) {
  const { config, setConfig } = useAppConfig();

  return (
    <div
      className={cn(
        "bg-muted inline-flex items-center gap-1 rounded-lg p-1",
        className,
      )}
      role="group"
      aria-label="테마 전환"
    >
      {modes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          type="button"
          size="icon-sm"
          variant={config.theme === value ? "default" : "ghost"}
          onClick={() => setConfig({ theme: value })}
          aria-pressed={config.theme === value}
          aria-label={label}
          title={label}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
}
