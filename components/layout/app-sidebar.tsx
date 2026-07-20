"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { mainNav, getVisibleNav } from "@/config/navigation";
import { useAppConfig } from "@/providers/theme-provider";
import { getNavIcon } from "@/lib/nav-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AppSidebar() {
  const pathname = usePathname();
  const { config, setConfig } = useAppConfig();
  const collapsed = config.sidebar === "collapsed";
  const isHorizontal = config.layout === "horizontal";
  const nav = getVisibleNav(mainNav);

  if (isHorizontal) {
    return null;
  }

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-sidebar-border flex h-full flex-col border-r transition-[width] duration-200",
        "w-(--app-sidebar-width)",
      )}
    >
      <div
        className={cn(
          "flex h-(--app-header-height) items-center gap-2 px-3",
          collapsed && "justify-center px-0",
        )}
      >
        <Link
          href="/"
          className={cn(
            "text-sidebar-foreground flex min-w-0 flex-1 items-center gap-2 font-semibold",
            collapsed && "flex-none justify-center",
          )}
        >
          <span className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
            W
          </span>
          {!collapsed && <span className="truncate">{config.name}</span>}
        </Link>
        {!collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={() => setConfig({ sidebar: "collapsed" })}
            aria-label="사이드바 접기"
          >
            <PanelLeftClose />
          </Button>
        )}
      </div>
      {collapsed && (
        <div className="flex justify-center px-2 pb-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setConfig({ sidebar: "expanded" })}
            aria-label="사이드바 펼치기"
          >
            <PanelLeftOpen />
          </Button>
        </div>
      )}
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-4">
          {nav.map((section) => (
            <div key={section.title ?? "main"} className="flex flex-col gap-1">
              {section.title && !collapsed && (
                <p className="text-muted-foreground px-2 text-xs font-medium">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = getNavIcon(item.icon);
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.title : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 transition-colors",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {Icon && <Icon className="size-4 shrink-0" />}
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}
