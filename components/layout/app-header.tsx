"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { mainNav, getVisibleNav } from "@/config/navigation";
import { useAppConfig } from "@/providers/theme-provider";
import { getNavIcon } from "@/lib/nav-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/common/theme-switcher";
import { NotificationButton } from "@/components/common/notification-button";
import { UserMenu } from "@/components/common/user-menu";

export function AppHeader() {
  const pathname = usePathname();
  const { config } = useAppConfig();
  const isHorizontal = config.layout === "horizontal";
  const isFixed = config.header === "fixed";
  const nav = getVisibleNav(mainNav);

  return (
    <header
      className={cn(
        "bg-card border-border flex h-(--app-header-height) items-center gap-3 border-b px-4",
        isFixed && "sticky top-0 z-40",
      )}
    >
      <div className="flex items-center gap-2 lg:hidden">
        <MobileNav />
      </div>

      {isHorizontal && (
        <>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              W
            </span>
            <span className="hidden sm:inline">{config.name}</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.flatMap((section) =>
              section.items.map((item) => {
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
                    className={cn(
                      "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors",
                      active
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    {Icon && <Icon className="size-4" />}
                    {item.title}
                  </Link>
                );
              }),
            )}
          </nav>
        </>
      )}

      {!isHorizontal && (
        <p className="text-muted-foreground">{config.name}</p>
      )}

      <div className="ml-auto flex items-center gap-1">
        <ThemeSwitcher />
        <NotificationButton />
        <UserMenu />
      </div>
    </header>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const { config } = useAppConfig();
  const nav = getVisibleNav(mainNav);

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="메뉴 열기" />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="flex w-72 flex-col p-0">
        <SheetHeader className="px-4 py-3 text-left">
          <SheetTitle>{config.name}</SheetTitle>
        </SheetHeader>
        <Separator />
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
          {nav.map((section) => (
            <div key={section.title ?? "main"} className="flex flex-col gap-1">
              {section.title && (
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
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2",
                      active
                        ? "bg-muted font-medium"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    {Icon && <Icon className="size-4" />}
                    {item.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
