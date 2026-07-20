/**
 * Sidebar / Header 메뉴 정의.
 * href는 App Router 경로와 일치시킨다.
 *
 * 노출 규칙
 * - 기본: 노출
 * - 숨김: `hidden: true` 추가
 */
export type NavItem = {
  title: string;
  href: string;
  icon?: string;
  /** true면 메뉴에서 숨김 (기본 노출) */
  hidden?: boolean;
  items?: NavItem[];
};

export type NavSection = {
  title?: string;
  /** true면 섹션 전체 숨김 (기본 노출) */
  hidden?: boolean;
  items: NavItem[];
};

export const mainNav: NavSection[] = [
  {
    title: "개요",
    // PoC: 지도 홈은 (map) 셸 사용. 샘플 페이지는 메뉴에서 숨김 (라우트·파일은 유지)
    hidden: true,
    items: [
      { title: "홈", href: "/", icon: "home" },
      { title: "대시보드", href: "/dashboard", icon: "layout-dashboard" },
      { title: "빈 페이지", href: "/blank", icon: "file" },
    ],
  },
  {
    title: "사용자",
    hidden: true,
    items: [
      { title: "사용자 목록", href: "/users", icon: "users" },
      { title: "사용자 등록", href: "/users/new", icon: "user-plus" },
    ],
  },
  {
    title: "가이드",
    // 개발 레퍼런스 — 삭제하지 않음. /guide/* 직접 접근 또는 이 메뉴로 이동
    items: [
      { title: "UI", href: "/guide/ui", icon: "palette" },
      { title: "패턴", href: "/guide/pattern", icon: "layers" },
      { title: "테마", href: "/guide/theme", icon: "sun-moon" },
    ],
  },
];

/** hidden이 아닌 메뉴만 반환 */
export function getVisibleNav(sections: NavSection[] = mainNav): NavSection[] {
  return sections
    .filter((section) => !section.hidden)
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.hidden),
    }))
    .filter((section) => section.items.length > 0);
}

export const authNav = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
} as const;
