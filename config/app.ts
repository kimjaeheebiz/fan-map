export type ThemeMode = "light" | "dark";
export type PrimaryColor =
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "violet"
  | "rose"
  | "zinc";
export type RadiusSize = "none" | "sm" | "md" | "lg" | "xl";
export type LayoutMode = "vertical" | "horizontal";
export type SidebarMode = "expanded" | "collapsed";
export type HeaderMode = "fixed" | "static";
export type ContainerWidth = "sm" | "md" | "lg" | "full";

export type AppConfig = {
  name: string;
  theme: ThemeMode;
  primaryColor: PrimaryColor;
  radius: RadiusSize;
  layout: LayoutMode;
  sidebar: SidebarMode;
  header: HeaderMode;
  footer: boolean;
  containerWidth: ContainerWidth;
};

/**
 * 프로젝트 전역 UI 설정.
 * Theme Guide(/guide/theme)에서 런타임으로 오버라이드할 수 있다.
 */
export const appConfig: AppConfig = {
  name: "Fan Map",
  theme: "light",
  primaryColor: "blue",
  radius: "lg",
  layout: "vertical",
  sidebar: "expanded",
  header: "fixed",
  footer: false,
  containerWidth: "full",
};
