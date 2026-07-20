import type { PrimaryColor, RadiusSize } from "@/config/app";
import { primaryColorTokens, radiusTokens } from "@/config/theme-tokens";

type ThemeScheme = "light" | "dark";

/**
 * documentElement에 primary / radius CSS 변수를 반영한다.
 * next-themes의 light|dark 클래스와 함께 사용한다.
 */
export function applyThemeTokens(options: {
  primaryColor: PrimaryColor;
  radius: RadiusSize;
  scheme: ThemeScheme;
  target?: HTMLElement;
}) {
  const { primaryColor, radius, scheme, target = document.documentElement } =
    options;
  const colors = primaryColorTokens[primaryColor][scheme];

  target.style.setProperty("--primary", colors.primary);
  target.style.setProperty("--primary-foreground", colors.primaryForeground);
  target.style.setProperty("--sidebar-primary", colors.sidebarPrimary);
  target.style.setProperty(
    "--sidebar-primary-foreground",
    colors.sidebarPrimaryForeground,
  );
  target.style.setProperty("--radius", radiusTokens[radius]);
}
