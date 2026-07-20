import type { BreadcrumbCrumb } from "@/components/common/app-breadcrumb";

/**
 * 페이지 제목·설명·Breadcrumb 중앙 정의.
 * 메뉴명(navigation.ts)과 맞춰 한글로 관리한다.
 */
export type PageMeta = {
  title: string;
  description?: string;
  breadcrumb: BreadcrumbCrumb[];
};

const crumb = {
  home: { label: "홈", href: "/" } satisfies BreadcrumbCrumb,
  users: { label: "사용자", href: "/users" } satisfies BreadcrumbCrumb,
  guide: { label: "가이드" } satisfies BreadcrumbCrumb,
};

/** 정적 페이지 메타 */
export const pages = {
  dashboard: {
    title: "대시보드",
    description: "프로젝트 현황을 한눈에 확인합니다.",
    breadcrumb: [crumb.home, { label: "대시보드" }],
  },
  blank: {
    title: "빈 페이지",
    description: "새 화면을 시작할 때 사용하는 빈 페이지입니다.",
    breadcrumb: [crumb.home, { label: "빈 페이지" }],
  },
  users: {
    title: "사용자 목록",
    description: "사용자 목록을 검색하고 관리합니다.",
    breadcrumb: [crumb.home, { label: "사용자" }],
  },
  usersNew: {
    title: "사용자 등록",
    description: "새 사용자를 등록합니다.",
    breadcrumb: [crumb.home, crumb.users, { label: "등록" }],
  },
  usersNotFound: {
    title: "사용자를 찾을 수 없습니다.",
    breadcrumb: [crumb.home, crumb.users, { label: "없음" }],
  },
  guideUi: {
    title: "UI 가이드",
    description: "Starter에서 사용하는 UI 컴포넌트 예제입니다.",
    breadcrumb: [crumb.home, crumb.guide, { label: "UI" }],
  },
  guidePattern: {
    title: "패턴 가이드",
    description: "실제 프로젝트에서 바로 재사용할 수 있는 화면 패턴입니다.",
    breadcrumb: [crumb.home, crumb.guide, { label: "패턴" }],
  },
  guideTheme: {
    title: "테마 가이드",
    description: "설정을 바꾸면 전체 UI에 즉시 반영됩니다. 기본값은 config/app.ts입니다.",
    breadcrumb: [crumb.home, crumb.guide, { label: "테마" }],
  },
} as const satisfies Record<string, PageMeta>;

export type StaticPageKey = keyof typeof pages;

export function getPageMeta(key: StaticPageKey): PageMeta {
  return pages[key];
}

/** 사용자 상세 — title/breadcrumb 끝 라벨은 동적 */
export function getUserDetailPageMeta(user: {
  name: string;
  email: string;
}): PageMeta {
  return {
    title: user.name,
    description: user.email,
    breadcrumb: [crumb.home, crumb.users, { label: user.name }],
  };
}

/** 사용자 수정 */
export function getUserEditPageMeta(user: {
  id: string;
  name: string;
  email: string;
}): PageMeta {
  return {
    title: "사용자 수정",
    description: user.email,
    breadcrumb: [
      crumb.home,
      crumb.users,
      { label: user.name, href: `/users/${user.id}` },
      { label: "수정" },
    ],
  };
}
