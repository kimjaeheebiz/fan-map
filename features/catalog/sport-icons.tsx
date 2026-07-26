"use client";

import { addIcon, Icon } from "@iconify/react/offline";
import {
  Gamepad2,
  LandPlot,
  MapPin,
  Volleyball,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import { sportAccentColor } from "@/features/catalog/sport-colors";
import {
  iconifyDataBySport,
  iconifyNameBySport,
} from "@/features/catalog/sport-icon-svg";
import type { SportId } from "@/features/catalog/types";
import { cn } from "@/lib/utils";

for (const [sportId, data] of Object.entries(iconifyDataBySport)) {
  addIcon(
    iconifyNameBySport[sportId as keyof typeof iconifyNameBySport],
    data,
  );
}

const lucideBySport = {
  volleyball: Volleyball,
  esports: Gamepad2,
  other: LandPlot,
} as const satisfies Partial<Record<SportId, LucideIcon>>;

type SportIconProps = {
  sportId: SportId;
  className?: string;
  /** 미지정 시 종목 accent 색 */
  color?: string;
} & Omit<LucideProps, "ref" | "color">;

/** 종목 아이콘 — Lucide 우선, 없을 때만 Iconify(Tabler). 기본 종목 accent 색 */
export function SportIcon({
  sportId,
  className,
  color,
  style,
  ...props
}: SportIconProps) {
  const accent = color ?? sportAccentColor[sportId];
  const mergedStyle = { color: accent, ...style };

  const LucideComp = lucideBySport[sportId as keyof typeof lucideBySport];
  if (LucideComp) {
    return (
      <LucideComp
        className={className}
        style={mergedStyle}
        aria-hidden
        {...props}
      />
    );
  }

  const iconName =
    iconifyNameBySport[sportId as keyof typeof iconifyNameBySport];
  if (!iconName) {
    return (
      <MapPin
        className={className}
        style={mergedStyle}
        aria-hidden
        {...props}
      />
    );
  }

  return (
    <Icon
      icon={iconName}
      className={cn("shrink-0", className)}
      color={accent}
      style={mergedStyle}
      aria-hidden
    />
  );
}
