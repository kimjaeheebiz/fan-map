# 코딩 컨벤션

코드·주석·모듈 분리·radius 규칙. 신규·수정 시 이 문서를 따른다.

---

# 1. 주석

## 1.1 공통

| 구분 | 규칙 |
| --- | --- |
| 문체 | 명사구·규칙 중심. 나열은 쉼표, 복합 용어는 가운뎃점 (본 문서와 동일). 서술형 `~합니다`, `~한다` 지양 |
| 지양 | 필드명 반복, 작업 메모, 변경 가능한 API, 스펙, 구현 상세 |
| 개발 인계 | `TODO:` 최소 기재 |

## 1.2 블록 주석 (`/** ... */`)

export 대상(`type`, `interface`, `const`, 컴포넌트) 선언 바로 위 1줄

```tsx
/** 목록 행 타입 */
export interface ListItem { ... }

/** 목록 패널 */
export const ListPanel = memo(() => { ... });
```

## 1.3 인라인 주석 (`//`)

목록형 선언(`interface`, `type`, Props, enum 등) 개별 항목 우측. 맥락, 제약, 용도 위주

```tsx
/** 폼 다이얼로그 프로퍼티 */
export interface FormDialogProps {
  mode: "create" | "edit"; // 등록·수정 모드
  target: Entity | null; // 수정 대상 (등록 시 null)
  siblings: Entity[]; // 중복 검사용 기존 목록
  onClose: () => void; // 닫기 콜백
  onSave: (item: Entity) => void; // 저장 콜백
}
```

| 구분 | 블록 (`/** */`) | 인라인 (`//`) |
| --- | --- | --- |
| 위치 | 선언 위 (별도 행) | 항목 우측 (같은 행) |
| 단위 | export, 타입, 컴포넌트 전체 | 목록 내 개별 항목 |

---

# 2. 파일·모듈 분리

| 기준 | 처리 |
| --- | --- |
| 단일 사용처 상수·헬퍼 | 사용처 파일 내 인라인 |
| 다중 사용처·복잡도 증가 | 함수, 파일 분리 |
| 미사용 파일·빈 디렉터리 | 제거 |

**mock** (API 미연동 시 임시 반환·더미 데이터)

| 규모 | 처리 |
| --- | --- |
| 소량 | API 함수 본문 임시 반환값 |
| 대량 | 파일 분리 |
| 전환 플래그 | 연동 후 제거 부담 시 미도입 |

---

# 3. Border radius

기준값: `config/app.ts` → `radius` → CSS `--radius` (shadcn).  
화면(`features`, `app` 페이지)에서 패널·카드용 `rounded-*`를 임의 지정하지 않는다.

| 타입 | 클래스 | 대상 |
| --- | --- | --- |
| 블럭 | `rounded-lg` (`--radius`) | Card, Dialog, Drawer, Table, Dropdown/Select 팝오버, Sonner, BottomSheet(`rounded-t-lg`) |
| 개별 요소 | `rounded-md` (`--radius` × 0.8) | Input, Textarea, Select 트리거, Badge, Tooltip, 이미지·썸네일 래퍼, **텍스트 Button** (`default`/`xs`/`sm`/`lg`) |
| 원형 | `rounded-full` | 아바타, 칩 레일, 핸들, **아이콘 Button** (`icon`/`icon-xs`/`icon-sm`/`icon-lg`) |
| 풀블리드 | `rounded-none` | 지도 스켈레톤 등 |

**`rounded-full` 예외** (필·원형 CTA — `className`으로 명시)

| 대상 | 예 |
| --- | --- |
| 헤더 CTA | 다녀왔어요, 로그인, 지도(비홈) |
| 방문 CTA | 상세·빈 목록「다녀왔어요」 |
| 지도 플로팅 | 「이 지역 검색」 |
| 필터 칩 | 종목·이벤트·즐겨찾기 레일 |

- 패널·모달은 `Card` / `Dialog` 등 UI를 조합해 radius를 상속
- `app.ts`의 `radius`만 바꾸면 스케일 전체가 함께 변함
- Button: base에 `rounded-*`를 두지 않고 size별 지정. `className`은 `cn(buttonVariants(...), className)`으로 병합
