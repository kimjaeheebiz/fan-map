# Theme 가이드

## 설정 파일

기본값: `config/app.ts`

| 키 | 값 | 효과 |
|----|-----|------|
| `theme` | `light` \| `dark` | next-themes (`app.ts` 기본값 우선, system 미사용) |
| `primaryColor` | `blue` \| `green` \| … | `--primary` 계열 |
| `radius` | `none` \| `sm` \| `md` \| `lg` \| `xl` | `--radius` (shadcn). 화면에서 `rounded-*` 하드코딩 금지 → [CODING_CONVENTION §3](./CODING_CONVENTION.md) |
| `layout` | `vertical` \| `horizontal` | Sidebar / 상단 네비 |
| `sidebar` | `expanded` \| `collapsed` | 사이드바 너비 |
| `header` | `fixed` \| `static` | sticky 여부 |
| `footer` | `boolean` | Footer 표시 |
| `containerWidth` | `sm` \| `md` \| `lg` \| `full` | 본문 max-width |

## Typography

본문 기본 크기는 `app/globals.css`의 `body { text-sm }`입니다.  
페이지에서는 제목(`text-xl` 이상)·캡션(`text-xs`)처럼 **기본과 다를 때만** 크기를 지정합니다.

## 면 색 (globals.css)

Preset `b1aIcEaeG` 토큰 기준입니다.

| 토큰 | Light | 용도 |
|------|-------|------|
| `--background` | 흰색 (`#ffffff`) | 컴포넌트 면 (Tabs active, Switch, Outline 등) |
| `--canvas` | muted 회색 (`#f5f5f5`) | body / MainShell 전체 배경 |
| `--muted` | muted 회색 | Tabs rail, Skeleton 등 보조면 |
| `--card` | 흰색 | 페이지 콘텐츠 카드 |
| `--sidebar` | 흰색 | 사이드바 |
| 헤더 | `bg-card` | 상단 바 |

`--background`를 캔버스 색으로 바꾸면 Tabs·Switch 등이 함께 변합니다. 레이아웃 배경만 바꿀 때는 `--canvas`를 사용하세요.

## 상태 색 (Semantic)

Tailwind / shadcn 기본에는 없습니다. Starter에서 `globals.css`에 추가한 토큰입니다.

| 토큰 | Badge variant | 용도 |
|------|---------------|------|
| `--info` | `info` | 안내 |
| `--success` | `success` | 성공 |
| `--warning` | `warning` | 경고 |
| `--error` | `error` | 실패 (destructive와 유사) |
| `--wait` | `wait` | 대기 |

```tsx
<Badge variant="success">성공</Badge>
<Badge variant="wait">대기</Badge>
```

메인 본문은 `PageCard`로 감싸고, `PageHeader`는 카드 밖(캔버스)에 둡니다.


## 적용 흐름

1. `config/app.ts` 기본값 로드
2. `ThemeProvider`가 CSS 변수·`data-*` 속성 반영
3. Layout 컴포넌트가 `useAppConfig()`로 구조 변경
4. `/guide/theme`에서 런타임 오버라이드 (파일 수정 없이 미리보기)

토큰 맵: `config/theme-tokens.ts`  
적용 헬퍼: `lib/apply-theme.ts`

## 영구 변경 vs 미리보기

| 목적 | 방법 |
|------|------|
| 프로젝트 기본값 변경 | `config/app.ts` 수정 |
| 면 색 변경 | `app/globals.css` `:root` / `.dark` |
| 임시 확인 | `/guide/theme` 또는 Header 테마 토글 |

Reset 버튼은 `appConfig` 기본값으로 되돌립니다.
