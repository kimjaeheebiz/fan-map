# 프로젝트 구조

## 디렉터리

```
app/
  (main)/          # Sidebar + Header Layout
  (auth)/          # 로그인 계열 (Sidebar/Header 없음)
  layout.tsx       # Root + Providers
  not-found.tsx    # 404
  error.tsx        # 500
components/
  ui/              # shadcn 컴포넌트 (직접 수정 최소화)
  common/          # Starter 공통 조합 컴포넌트
  layout/          # Sidebar, Header, Footer, Container, MainShell
config/
  app.ts           # Theme / Layout 기본 설정
  theme-tokens.ts  # Primary / Radius / Container 토큰
  navigation.ts    # 메뉴 정의
features/
  users/           # User CRUD (types, mock, hooks, form)
lib/               # utils, theme 적용 헬퍼
providers/         # Theme, Query, AppProviders
docs/              # 문서
```

## 라우트 그룹

| 그룹 | Layout | 페이지 |
|------|--------|--------|
| `(main)` | MainShell | `/`, `/dashboard`, `/blank`, `/users/*`, `/guide/*` |
| `(auth)` | 중앙 카드만 | `/login`, `/register`, `/forgot-password` |

## Import Alias

`@/*` → 프로젝트 루트 (`tsconfig.json`)

## 레이어 규칙

1. `components/ui` — shadcn 생성물
2. `components/common` — ui를 조합한 재사용 컴포넌트
3. `components/layout` — Main Layout 전용
4. `features/*` — 도메인 타입·Mock·훅·폼
