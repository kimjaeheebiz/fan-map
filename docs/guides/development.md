# 개발 가이드

코딩 컨벤션(주석·모듈 분리): [coding.md](../conventions/coding.md)

## 메뉴 노출

`config/navigation.ts`에서 관리합니다. **기본은 노출**, 숨길 때만 `hidden: true`를 추가합니다.

```ts
{ title: "빈 페이지", href: "/blank", icon: "file", hidden: true }
```

섹션 전체 숨김도 동일합니다.

```ts
{ title: "가이드", hidden: true, items: [...] }
```

## 페이지 제목 / Breadcrumb

`config/pages.ts`에서 중앙 관리합니다.

```ts
getPageMeta("dashboard")
getUserDetailPageMeta(user)
```

페이지에서는 `PageMetaHeader`로 렌더합니다.

```tsx
<PageMetaHeader meta={getPageMeta("users")} actions={...} />
```

## 새 페이지 추가

1. `(main)` 또는 `(auth)` 아래에 `page.tsx` 생성
2. `config/pages.ts`에 제목·breadcrumb 추가
3. `PageMetaHeader` + 본문은 `PageCard`
4. 메뉴가 필요하면 `config/navigation.ts`에 항목 추가


## 새 CRUD 도메인 추가

`features/users`를 복사해 다음만 교체합니다.

1. `types.ts` — 엔티티 타입
2. `data/mock-*.ts` — Mock CRUD
3. `hooks/use-*.ts` — TanStack Query 키·훅
4. `schema.ts` + `components/*-form.tsx` — 폼
5. `app/(main)/<domain>/` — list / detail / new / edit

목록 페이지 구성 순서: SearchBox → DataTable → AppPagination

등록·수정은 동일 Form 컴포넌트를 재사용합니다.

## API 연동 시

Mock 함수(`features/*/data`)만 실제 fetch로 교체하면 됩니다.  
쿼리 키·페이지·Form 구조는 유지하세요.

## 새 UI 컴포넌트

```bash
npx shadcn@latest add <component>
```

공용 패턴이 생기면 `components/common`에 래퍼를 추가합니다.  
`components/ui`를 복제해 새 파일을 만들지 마세요.

## 확인 체크리스트

- [ ] `npm run build` 통과
- [ ] Theme 변경이 Layout/색상에 반영되는지 (`/guide/theme`)
- [ ] 목록 Empty / Loading 동작
- [ ] 등록·수정 Form 재사용
