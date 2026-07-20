import {
  File,
  Home,
  Layers,
  LayoutDashboard,
  Palette,
  SunMoon,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  "layout-dashboard": LayoutDashboard,
  file: File,
  users: Users,
  "user-plus": UserPlus,
  palette: Palette,
  layers: Layers,
  "sun-moon": SunMoon,
};

export function getNavIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] ?? null;
}
