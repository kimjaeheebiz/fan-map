# 프로젝트 구조

## 디렉터리

```
app/
  (map)/           # Fan Map 셸 (지도 홈·마이페이지·고객지원)
  (auth)/          # 로그인·가입
  (main)/          # 스타터/가이드 (대시보드·users·guide) — 메뉴 대부분 숨김
  api/             # Route Handler (네이버 Local Search 등)
components/
  ui/              # shadcn / Base UI
  common/          # 공통 조합 컴포넌트
  layout/          # MapShell, MainShell 등
config/            # app·navigation·theme 토큰
features/
  places/          # 장소·방문 경험·랭킹
  map/             # 네이버 지도·마커·컨트롤
  catalog/         # 종목·팀·태그
  auth/            # 세션·로그인 Mock
  account/         # 마이페이지 셸·메뉴
  users/           # 스타터 User CRUD
lib/               # utils, format-date 등
providers/         # Theme, Query
docs/
  specs/           # 기능 명세
  conventions/     # 코딩 규칙
  guides/          # 개발·구조·UI
  plan/            # 기획·PoC 계획
```

주요 문서: [기능 명세](../specs/features.md) · [코딩 컨벤션](../conventions/coding.md) · [개발 가이드](./development.md) · [컴포넌트](./components.md) · [테마](./theme.md)

## 라우트 그룹

| 그룹 | Layout | 주요 페이지 |
|------|--------|-------------|
| `(map)` | MapShell | `/`, `/mypage/*`, `/notices`, `/help`, `/terms`, `/privacy` |
| `(auth)` | 중앙 카드 | `/login`, `/register`, `/forgot-password` |
| `(main)` | MainShell | `/dashboard`, `/users/*`, `/guide/*` (개발용) |

## Import Alias

`@/*` → 프로젝트 루트 (`tsconfig.json`)

## 레이어 규칙

1. `components/ui` — shadcn / Base UI 생성물
2. `components/common` — ui 조합 재사용
3. `components/layout` — 셸·레이아웃
4. `features/*` — 도메인 타입·저장·훅·UI
