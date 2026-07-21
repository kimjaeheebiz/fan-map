# 컴포넌트 가이드

## 사용 원칙

- UI 원본은 `components/ui`만 사용합니다.
- 화면 패턴에 반복되는 조합은 `components/common`에 둡니다.
- 도메인 전용 UI는 `features/<domain>/components`에 둡니다.

## 공통 컴포넌트 (`components/common`)

| 컴포넌트 | 역할 |
|----------|------|
| `PageHeader` | 제목, 설명, Breadcrumb, 액션 |
| `AppBreadcrumb` | ui/breadcrumb 래퍼 |
| `SearchBox` | 검색 입력 |
| `DataTable` | 컬럼 정의 기반 테이블 + Loading/Empty |
| `FormField` | RHF 래퍼 (`required` `*`, `tooltip` `?`) |
| `AppPagination` | 페이지 번호 UI |
| `ConfirmDialog` | 확인/취소 Dialog (`size`, `variant`) |
| `AlertDialog` | 확인만 있는 Alert Dialog |
| `EmptyState` | 빈 상태 |
| `Loading` | 로딩 표시 |
| `AppSkeleton` / `Skeleton` | 스켈레톤 |
| `ThemeSwitcher` | 헤더: Light↔Dark 토글 / `variant="group"`: Light·Dark |
| `NotificationButton` | 알림 드롭다운 (목 데이터) |
| `UserMenu` | 아바타 · 계정 정보 · 마이 페이지 · 로그아웃 |

## DataTable

```tsx
<DataTable
  columns={[
    { id: "name", header: "Name", cell: (row) => row.name },
  ]}
  data={items}
  getRowId={(row) => row.id}
  loading={isLoading}
/>
```

`@tanstack/react-table` 없이 컬럼 배열만으로 구성합니다.

## Select (Base UI)

`SelectValue`는 기본적으로 **value 원문**을 표시합니다.  
라벨을 보이려면 Root에 `items`를 넘기세요.

```tsx
<Select
  defaultValue="apple"
  items={[
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
  ]}
>
  <SelectTrigger>
    <SelectValue placeholder="선택" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>
```

## FormField

```tsx
<FormField
  control={control}
  name="role"
  label="역할"
  required
  tooltip="관리자는 전체 권한, 편집자는 수정, 뷰어는 조회만 가능합니다."
>
  {(field) => <Input {...field} />}
</FormField>
```

| prop | 설명 |
|------|------|
| `required` | 라벨 옆 `*` |
| `tooltip` | 라벨 옆 `?` 아이콘 툴팁 |
| `description` | 입력란 아래 보조 설명 (에러 없을 때만) |

## Dialog

`DialogContent`에 `size`를 지정합니다. 폼은 그리드 열 수에 맞춰 고릅니다.  
좌우 여백은 `w-[calc(100%-2rem)]`로 **모든 화면 크기에서 1rem씩** 유지됩니다.

| size | max-width | 용도 |
|------|-----------|------|
| `sm` | `sm` (24rem) | 1열 폼 · Confirm / Alert (기본값) |
| `md` | `2xl` (42rem) | 2열 폼 |
| `lg` | `5xl` (64rem) | 3열 폼 |
| `xl` | 88rem | 4열 폼 |
| `full` | `100% - 2rem` | 전체 |

### 백드롭(바깥) 클릭으로 닫기

| 유형 | 백드롭 닫기 | 설정 |
|------|-------------|------|
| 일반 Dialog (안내·미리보기) | 허용 | 기본값 |
| 폼이 있는 Dialog | **불가** | `disablePointerDismissal` |
| `ConfirmDialog` / `AlertDialog` | **불가** | 공통 컴포넌트에 기본 적용 |

의도치 않은 입력 손실·확인 우회를 막기 위해, 폼·확인·알림은 버튼으로만 닫습니다.  
`ConfirmDialog` / `AlertDialog`는 이미 `disablePointerDismissal`이 켜져 있습니다. 폼 Dialog를 직접 만들 때도 동일하게 적용하세요.

```tsx
{/* 폼 Dialog */}
<Dialog open={open} onOpenChange={setOpen} disablePointerDismissal>
  <DialogContent size="lg">...</DialogContent>
</Dialog>

<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="삭제할까요?"
  variant="destructive"
  onConfirm={handleDelete}
/>

<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="저장되었습니다."
  confirmLabel="확인"
/>
```

Input은 `readOnly` / `disabled` HTML 속성을 지원합니다.

## 예제 화면

실제 렌더링은 `/guide/ui`에서 확인합니다.
