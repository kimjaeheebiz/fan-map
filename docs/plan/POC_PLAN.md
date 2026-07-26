# Fan Map PoC 개발 계획

> 작성 기준: `PROJECT_BRIEF.md` + 현재 저장소 실측 분석  
> 작성일: 2026-07-20  
> 수정일: 2026-07-20 (네이버 지도·Local Search)  
> 상태: **지도 = 네이버** (Maps JS + Local Search)

---

## 문서 구성 제안

| 문서 | 역할 |
|------|------|
| `docs/plan/PROJECT_BRIEF.md` | 제품/PoC 요구사항 (이미 존재) |
| `docs/plan/POC_PLAN.md` | 본 문서 — 현황 분석·범위·흐름·모델·단계 계획 |
| `docs/plan/SETUP.md` *(구현 착수 시)* | 네이버 지도·검색 키·환경변수 준비 체크리스트 |
| `docs/plan/DECISIONS.md` *(후속)* | 확정 결정 기록 |
| `docs/plan/CHECKLIST.md` *(후속)* | 단계별 완료 체크리스트 |

---

## PoC 개발 원칙

빠른 PoC를 목표로 다음을 우선합니다.

1. **빠른 구현** — 화면과 핵심 흐름을 먼저 동작시킨다
2. **실제 사용자 경험 검증** — 지도·Place·제보·즐겨찾기 흐름이 브라우저에서 확인 가능해야 한다
3. **이후 리팩토링 가능** — 기능이 완성된 뒤 필요한 부분만 정리한다

**화면(UI)과 데이터 구조는 실제 서비스 수준으로 설계하되, 저장소와 서버 기능은 localStorage 기반으로 단순화하여 구현합니다.**

초기부터 과도한 추상화·복잡한 아키텍처는 지양합니다.

| PoC에서 하지 않음 (후속 확장) | PoC에서 함 |
|------------------------------|------------|
| Repository 패턴 | `features/places`에 함수·mock·localStorage 직접 작성 |
| Mapper 계층 | 네이버 응답을 Place 필드에 바로 매핑 (필요 시 작은 헬퍼 함수 1개) |
| Provider 추상화 | **네이버만** 사용 (지도 JS + Local Search) |
| 불필요한 인터페이스 분리 | 타입이 있으면 됨. 교체 지점은 함수 시그니처 수준으로만 |

---

## 참고 서비스 (디자인·UX)

UI/UX 참고 대상입니다. **복제하지 않고** Fan Map 목적에 맞게 재설계합니다.

| 서비스 | 참고할 점 |
|--------|-----------|
| **거지맵** | 지도 우선, 마커·목록 연계, **제보 시 상호명 네이버 검색→결과 선택→주소 반영**, 모바일 지도 탐색 |
| **네이버 지도** | PoC 지도 SDK·마커·현위치·재검색 UX (구현 기준) |
| **Google Maps** | 마커 선택 후 하단/사이드 상세, 정보 위계 |
| **Airbnb Map** | 지도+카드 목록 동기화, 선택 강조, 데스크톱 분할·모바일 시트 |

거지맵의 브랜드·가격·앱테크·커뮤니티·메뉴/가격 입력 UI 등은 참고하지 않습니다.  
제보의 **「상호명 검색 (네이버 결과 기준)」** 패턴만 Fan Map 관람 제보에 맞게 가져옵니다.

---

# 1. 프로젝트 현황 분석

## 1-1. 기술 스택 (실측)

| 항목 | 현재 값 |
|------|---------|
| 프레임워크 | Next.js **16.2.10** (App Router) |
| React | **19.2.4** |
| 언어 | TypeScript 5, `strict: true` |
| 패키지 매니저 | **npm** (`package-lock.json` 존재) |
| 스타일 | Tailwind CSS **v4**, `tw-animate-css`, shadcn tailwind |
| UI | shadcn (`base-luma`) + **@base-ui/react** |
| 아이콘 | lucide-react |
| 서버 상태 | @tanstack/react-query **5** |
| 폼 | react-hook-form + @hookform/resolvers + **zod 4** |
| 테마 | next-themes |
| 토스트 | sonner |
| 유틸 | clsx, tailwind-merge, class-variance-authority |
| 린트 | ESLint 9 + eslint-config-next 16.2.10 |
| 테스트 | **프로젝트 내 테스트 설정/파일 없음** |
| 환경변수 | `.env*` 파일 **없음** (`.gitignore`에 `.env*` 포함) |
| 배포 설정 | Vercel 전용 설정 없음, `next.config.ts`에 turbopack root만 지정 |

## 1-2. 현재 폴더 구조

```
fan-map/
├── app/
│   ├── layout.tsx, globals.css, error.tsx, not-found.tsx
│   ├── (auth)/             # login, register, forgot-password ※삭제 금지
│   └── (main)/             # MainShell (관리자형)
│       ├── page.tsx, dashboard/, blank/, users/
│       └── guide/          # ui, pattern, theme ※삭제 금지
├── components/ui/, common/, layout/
├── features/users/         # CRUD 샘플 패턴
├── config/, providers/, lib/, docs/plan/, public/
```

## 1-3. 진입·라우팅

| 경로 | 성격 | Fan Map PoC 처리 |
|------|------|------------------|
| `/` | 스타터 랜딩 | **교체** → 지도 홈 (Place 탐색) |
| `/dashboard`, `/blank` | 샘플 | 삭제 또는 메뉴 숨김 |
| `/users/*` | CRUD 샘플 | 삭제 후보 (패턴만 참고) |
| `/guide/*` | UI/테마 가이드 | **유지** (개발 레퍼런스). 배포 직전 삭제 여부 결정 |
| `/login` 등 `(auth)` | 인증 UI | **삭제 금지**. 메뉴·링크 비노출, PoC에서 미사용 |

`(main)`의 `MainShell`(사이드바+헤더+푸터)은 지도 우선 UX와 충돌 → Fan Map은 **지도 전용 레이아웃**을 둡니다.

## 1-4. 재사용 가능 패턴

- `features/<domain>/` 폴더 패턴 (types, schema, hooks, data, components)
- React Query + mock CRUD (`features/users` 참고)
- zod + react-hook-form
- UI: Button, Input, Select, Dialog, Sheet, **Drawer**, Badge, Tabs, Skeleton 등
- `EmptyState`, `Loading`, `SearchBox`, `FormField`, sonner toast
- CSS 변수 테마 (`globals.css`)

## 1-5. 기술적 위험

| 위험 | 대응 |
|------|------|
| 관리자 셸 ↔ 지도 UX 불일치 | `(map)` 레이아웃 신설 |
| Next.js 16 API 차이 | `node_modules/next/dist/docs/` 확인 |
| 네이버 지도 SSR | Client + `dynamic(..., { ssr: false })` |
| REST/Search 키 노출 | Route Handler 프록시 (`NAVER_SEARCH_*` 서버 전용) |
| localStorage 용량 (이미지 Base64) | 장당 리사이즈·압축, 최대 5장, 용량 초과 시 안내 |
| 테스트 부재 | 기능 완성 후 필요 시 최소 추가 |

---

# 2. 재사용·수정·삭제 대상

## 2-1. 재사용

| 대상 | 이유 |
|------|------|
| `components/ui/*` | PoC UI 직접 사용 |
| `empty-state`, `loading`, `form-field`, `search-box` | 상태·검색 |
| `providers/*` | Query / Theme / Toaster |
| `lib/utils.ts` | `cn` |
| `features/*` 패턴 | Place 도메인에 적용 |
| `globals.css` 토큰 | 색만 Fan Map에 맞게 조정 |
| Pretendard | 유지 |
| `app/(auth)/**` | **삭제하지 않음** — 미노출만 |
| `app/(main)/guide/**` | **삭제하지 않음** — 개발 레퍼런스 |

## 2-2. 수정

| 대상 | 내용 |
|------|------|
| `config/app.ts` | 서비스명 `Fan Map`, 지도용 기본값 |
| `config/navigation.ts` | auth/가이드는 개발용으로만, 지도 홈 메뉴는 최소화 |
| `app/layout.tsx` metadata | Fan Map |
| 지도 홈 레이아웃 | `MainShell` 미적용, MapShell 사용 |

## 2-3. 삭제·유지 구분 (Phase 1)

| 대상 | 처리 |
|------|------|
| `dashboard`, `blank`, `users` | 삭제 또는 메뉴 숨김 가능 |
| `app/(auth)/**` | **삭제 금지** — 네비/홈 링크만 제거 |
| `guide/**` | **삭제 금지** — 유지. 배포 직전 재결정 |
| 사이드바 `MainShell` | 가이드·샘플용으로 유지, `/`에는 미사용 |

## 2-4. 패키지

| 구분 | 내용 |
|------|------|
| 활용 | next, react, tanstack-query, rhf, zod, shadcn/Base UI, sonner, lucide |
| 네이버 지도 | JS SDK 스크립트 로드 — **추가 npm 없어도 가능** |
| 네이버 Local Search | 제보 상호명 검색 — 서버 프록시 |
| 후속 | S3 / R2 / Supabase Storage, 인증 등 |

---

# 3. Fan Map PoC 범위

## 핵심 구조 (Place 중심)

```
지도 (탐색·마커)
  ↓
Place (장소 — 화면·데이터의 중심)
  ↓
ViewingReport (관람 제보 — Place의 하위 정보)
```

지도는 Place를 찾고, Place 상세에서 ViewingReport를 보여 주고 추가합니다.

## 3-1. 요구사항 분류

### PoC 필수

| ID | 기능 |
|----|------|
| M1 | 지도 중심 홈 |
| M2 | 이동·줌, 현재 위치, 영역 재검색 |
| M3 | Place 마커 + 선택 강조 |
| M4 | Place 요약/상세 (기본정보 + 하위 제보 목록) |
| M5 | 검색 + 필터: 종목 / 최근 제보 / 즐겨찾기 |
| M6 | **네이버 Local Search**로 상호명 검색 → 결과 선택 → ViewingReport 등록 |
| M7 | 제보 필수: 종목, 관람일, 후기 / 선택: 팀, 태그, **사진(최대 5장)** |
| M8 | 즐겨찾기 (localStorage) |
| M9 | 신뢰 카피 (“관람 제보”, 매장 확인 안내) |
| M10 | 로딩·빈결과·위치거부·오류 |
| M11 | **사진**: 선택·미리보기·localStorage 저장·새로고침 유지 |

### PoC 권장

| ID | 기능 |
|----|------|
| R1 | 장소 유형 필터 |
| R2 | 팀 필터 (종목 종속) |
| R3 | 모바일 바텀시트, 목록/지도 전환 |
| R4 | 화면/소리/단체적합 옵션 |
| R5 | guide 유지 (개발용) |

### 후속 확장

| ID | 기능 |
|----|------|
| F1 | 로그인·서버 즐겨찾기·본인 제보 |
| F2 | 이미지 서버 업로드 (S3 / Cloudflare R2 / Supabase Storage) |
| F3 | 신고·운영 어드민 |
| F4 | **League**·경기 마스터·상영 스케줄 |
| F5 | Repository / Mapper / Provider 추상화 |
| F6 | 푸시·커뮤니티·포인트 |

### 이번 범위 제외

- 거지맵식 가격·출석·광고·핫딜·메뉴/가격 입력
- “공식 중계 매장” 단정 표현
- 네이버 검색 없이 주소·상호 수동 생성
- **League** 모델·UI
- Repository / Mapper / Provider 계층
- 서버 이미지 업로드
- 인증 기능 활성화 (코드는 유지, 미사용)

## 3-2. 필터 우선순위

1. 종목 (Sport)
2. 최근 관람 제보 있음
3. 즐겨찾기만
4. *(권장)* 장소 유형, Team

---

# 4. 사용자 흐름

흐름은 모두 **Place**를 기준으로 합니다.

## 4-1. 주변 Place 탐색

1. 홈 → 지도 로드  
2. 위치 허용 시 현위치 / 거부 시 기본 좌표(예: 잠실 야구장 근처 mock 중심)
3. 영역 내 Place 마커 표시  
4. “이 지역 재검색”

## 4-2. 검색·필터로 Place 찾기

1. 장소명·지역 검색  
2. 필터 → 마커·목록 동시 갱신  
3. 0건 → EmptyState

## 4-3. Place 마커 선택

1. 마커 탭 → 해당 Place 강조  
2. 모바일: 하단 요약 / 바텀시트  
3. 데스크톱: 목록 동기화 + 상세

## 4-4. Place 상세

1. Place 기본정보 + `coverImageUrl`  
2. 하위 **ViewingReport** 목록 (최신순)  
3. 원본 지도 링크, 면책 문구

## 4-5. 즐겨찾기

1. Place 단위 토글 → localStorage  
2. 필터로 모아보기

## 4-6. ViewingReport 제보 (Place에 추가)

거지맵 「상호명 검색 (네이버 결과 기준)」과 같은 선택 흐름을 사용합니다.

1. “제보하기”
2. 상호명 입력 → **네이버 Local Search** (서버 프록시)
3. 검색 결과(최대 N건)에서 장소 선택 — 도로명·지번 확인
4. 선택 시 Place 이름·주소·좌표 반영 (신규면 Place 생성)
5. 종목·관람일·후기(+ 팀·태그·**사진 ≤5**)
6. 제출 → Place의 `reports`에 추가 → 집계·커버 이미지 갱신

## 4-7. 제보 후 반영

1. Place `reports`에 ViewingReport 추가 (제보 수·최근 관람일은 `reports`에서 계산)  
2. `coverImageUrl`가 비어 있고 새 제보에 사진이 있으면 → 아래 커버 규칙 적용  
3. 마커·상세 즉시 반영

---

# 5. 화면 및 기능 구조

## 5-1. 화면 목록

### A. 지도 홈 (`/`) — Place 탐색

| 항목 | 내용 |
|------|------|
| 목적 | Place를 지도에서 찾고 고른다 |
| 컴포넌트 | MapShell, MapView, PlaceMarkers, SearchBar, FilterChips, PlaceList, PlaceSummary, ReportFab |
| 데이터 | Place[], 선택 placeId, 필터, 내 위치 |
| 모바일 | 지도 풀스크린, 상단 검색·필터, 하단 Place 요약 |
| 데스크톱 | 좌 Place 목록 / 우 지도 |
| 상태 | 로딩, 빈 영역, 위치 거부, 오류 |

### B. Place 상세 (시트/패널)

| 항목 | 내용 |
|------|------|
| 목적 | Place 정보 + 하위 ViewingReport |
| 표시 | 이름, 카테고리, 주소, coverImage, 제보수, 종목/팀, 태그, 후기·사진, 즐겨찾기, 원본 링크 |
| 상태 | 로딩, not found |

### C. 제보 (Place에 ViewingReport 추가)

| 항목 | 내용 |
|------|------|
| 목적 | 네이버 Local Search로 실제 장소를 고른 뒤 관람 경험 등록 |
| 컴포넌트 | PlacePicker (Local Search), ReportForm, ImagePicker |
| 참고 UX | 거지맵 제보의 상호명 검색·결과 목록·선택 주소 반영 |
| 상태 | 검색 전 안내, 검색 중, 결과 N건, 결과 없음, 제출 중, 이미지 용량 오류 |

## 5-2. 신뢰 카피

- “이 장소에서 경기를 봤어요” / “최근 관람 제보”
- “경기별 상영 여부는 달라질 수 있어요”
- “관람 가능 여부는 방문 전 매장에 확인해 주세요”
- 금지: “공식 중계”, “항상 상영”

---

# 6. 데이터 모델 초안 (단순화)

DB 정규화보다 **화면 구현**을 우선합니다.  
PoC에서는 Place 하나에 제보 목록을 붙여 다루는 방식을 권장합니다.

```ts
// 개념적 구조 (Place 중심)
type Place = {
  // ...장소 필드
  reports: ViewingReport[]; // 하위 정보
};
```

저장 시 localStorage에 `Place[]`로 두고, 목록·상세·마커가 같은 객체를 쓰면 됩니다.  
(나중에 서버 API로 바꿀 때는 Place 조회/제보 추가 함수만 교체.)

## 6-1. Place (중심)

| 필드 | 필수 | PoC | 설명 |
|------|------|-----|------|
| id | Y | Y | Fan Map id |
| naverPlaceId | N | Y | Local Search/지도 연동 식별자. mock은 임의 문자열 가능 |
| name | Y | Y | |
| address | Y | Y | 도로명 우선, 지번 보조 가능 |
| lat, lng | Y | Y | |
| phone | N | Y | |
| categoryName | N | Y | |
| naverMapUrl | N | Y | 원본 네이버 지도/장소 링크 (선택) |
| coverImageUrl | N | Y | 대표 이미지 (Base64 또는 이후 URL). 자동 규칙은 아래 참고 |
| sportIds | N | Y | 제보에서 모아도 됨 (저장 필드는 선택 — UI에서 reports로부터 계산 가능) |
| teamIds | N | Y | 동일 |
| tagIds | N | Y | 동일 |
| reports | Y | Y | **ViewingReport[]** (하위) |
| createdAt | Y | Y | |

**저장하지 않는 파생 값 (화면에서 계산)**

| 표시 | 계산 |
|------|------|
| 제보 수 | `place.reports.length` |
| 최근 관람일 | 최신 `watchedAt` (예: `reports`를 날짜순 정렬 후 첫 항목, 또는 `reports.at(-1)` — 배열을 최신순으로 유지할 것) |

`reportCount`, `lastReportedAt` 필드는 **Place에 두지 않습니다.**

### coverImageUrl 자동 규칙

```text
coverImageUrl가 비어 있는 경우
  → 첫 번째 ViewingReport의 첫 번째 이미지(images[0])를 사용
  → (제보 추가 시) 해당 값을 coverImageUrl에 한 번 채울 수 있음

coverImageUrl가 이미 존재하면
  → 변경하지 않는다
```

이후 관리자가 대표 이미지를 직접 지정해도 같은 필드를 쓰면 됩니다.

네이버 검색/자체 출처를 필드명으로만 구분합니다. Provider 타입·계층은 두지 않습니다.

## 6-2. ViewingReport (Place 하위)

| 필드 | 필수 | PoC | 설명 |
|------|------|-----|------|
| id | Y | Y | |
| placeId | Y | Y | 부모 Place |
| sportId | Y | Y | |
| teamId | N | Y | |
| watchedAt | Y | Y | 관람일 |
| review | Y | Y | |
| tagIds | N | Y | |
| hasScreen / hasSound / goodForGroup | N | 권장 | |
| **images** | N | **Y** | `string[]` — **Base64(data URL)만**. 최대 5. Blob URL 사용 금지 |
| createdAt | Y | Y | |

- **League / leagueId / matchLabel**: PoC 제외 → **후속 확장**
- `reporterId`, 신고 status 등: 후속

## 6-3. Sport / Team / VenueTag

| 모델 | PoC | 비고 |
|------|-----|------|
| Sport | Y | id, name, order |
| Team | Y | id, sportId, name |
| VenueTag | Y | id, label |
| **League** | **후속** | PoC 모델·UI·상수 모두 제외 |

## 6-4. Favorite

`{ placeId, createdAt }[]` → localStorage (키는 아래 명세)

## 6-5. localStorage Key 명세

| Key | 값 | 설명 |
|-----|-----|------|
| `fan-map:places` | `Place[]` JSON | Place + 하위 reports·이미지(Base64) |
| `fan-map:favorites` | `{ placeId, createdAt }[]` JSON | 즐겨찾기 |

초기 로드: `fan-map:places`가 비어 있으면 mock을 시드한 뒤 저장.  
키 이름을 바꾸지 말고, 마이그레이션이 필요하면 버전 suffix를 추가합니다 (예: `fan-map:places:v2` — 후속).

## 6-6. User / 신고

타입·기능 모두 **후속**. `(auth)` 코드는 삭제하지 않음.

## 6-7. 사진 (PoC)

| 구분 | 내용 |
|------|------|
| Place | `coverImageUrl` — §6-1 자동 규칙 |
| ViewingReport | `images: string[]` (최대 5) |
| UX | 파일 선택 → 미리보기 → 제출 |
| 저장 형식 | **Base64(data URL)로 통일** — localStorage·새로고침 유지 |
| 사용 금지 | **Blob URL** (`URL.createObjectURL`) — 새로고침 후 무효 |
| 서버 업로드 | **하지 않음** |
| 이후 교체 | 화면은 `string`(src)로만 렌더 → 저장소만 S3/R2/Supabase로 교체 |

용량: 선택 시 클라이언트 리사이즈(긴 변 제한) 권장. 쿼터 초과 시 저장 실패 안내.

## 6-8. Mock 데이터 전략

네이버 **Local Search 연동 이전**에도 UI·지도 마커를 검증하기 위해 mock Place를 둡니다.

| 항목 | 내용 |
|------|------|
| 수량 | **약 10~20개** Place |
| 위치 | 실제 야구장 주변 (예: 잠실, 고척 — 공개 위경도 근처) |
| 제보 | 각 Place에 ViewingReport 1~3건 |
| 이미지 | **일부 Place는 `coverImageUrl` 포함** / **일부 ViewingReport는 `images` 포함** |
| 형태 | `features/places/data/mock-places.ts` — **최종 Place 타입과 동일** |
| 교체 | Local Search 선택 결과도 같은 Place 타입으로 합침. Mapper 계층 없음 |

개발 순서: **Mock Place + 실지도(네이버) 마커 → Local Search 제보 연동**.

## 6-9. 저장 (단순)

```
초기: mock-places.ts → fan-map:places 시드
런타임: fan-map:places, fan-map:favorites
네이버 Local Search: 제보 시 상호명 검색 (Route Handler)
이미지: Base64 문자열로 Place/Report 필드에 포함
```

Repository 인터페이스는 두지 않습니다. `getPlaces()`, `savePlace()`, `addReport()` 정도의 함수면 충분합니다.

---

# 7. 기술 구조 및 폴더 구조

## 7-1. 원칙 (PoC)

- 페이지는 UI 조합, 로직은 `features/places` 등 가까운 곳에
- 지도 컴포넌트와 Place 데이터는 파일만 나누면 됨 (과도한 계층 X)
- React Query로 Place 목록/상세 캐시, 선택 id는 URL 또는 로컬 state
- **기능 완성 후** 중복이 보이면 그때 리팩토링

## 7-2. 제안 폴더 (단순)

```
app/
  (map)/
    layout.tsx              # MapShell
    page.tsx                # 지도 홈 (Place 탐색)
  (main)/guide/...          # 유지
  (auth)/...                # 유지 (미사용)
  api/naver/local-search/route.ts  # Local Search 프록시
  api/naver/...                    # 필요 시 추가
features/
  map/                      # MapView, 마커, geolocation, SDK 로드
  places/                   # ★ 중심
    types.ts                # Place, ViewingReport
    data/mock-places.ts
    data/place-storage.ts   # localStorage 읽기/쓰기
    components/             # PlaceCard, PlaceList, PlaceDetail, ImagePicker …
    hooks/                  # usePlaces, usePlace, useAddReport …
  favorites/
  catalog/                  # sports, teams, tags 상수 (League 없음)
components/layout/map-shell.tsx
config/app.ts
```

`mappers/`, `repositories/`, `providers/` 폴더는 **만들지 않음**.

## 7-3. 컴포넌트

| 단위 | 책임 |
|------|------|
| MapShell | 로고·검색 자리, 지도 슬롯, FAB |
| MapView | 지도 표시·이벤트 |
| PlaceMarkers | Place[] → 마커 |
| PlaceList / PlaceSummary / PlaceDetail | Place UI |
| ReportForm + ImagePicker | ViewingReport 작성 |
| FilterChips / FavoriteButton / StateBanner | 필터·즐겨찾기·상태 |

---

# 8. 지도 API 연동 전략

## 8-1. 네이버 지도 + Local Search (PoC)

| 구분 | 방식 |
|------|------|
| 지도 | 네이버 지도 JavaScript API (`ncpClientId`) |
| 환경변수 | 아래 SETUP 참고 |
| 제보 장소 검색 | 네이버 **검색 > 지역(Local)** → `app/api/naver/local-search` 프록시 |
| 현위치 | `navigator.geolocation` |
| 마커 | Place 좌표 기준, 선택 강조 |
| 재검색 | 버튼 우선 (호출 억제) |

## 8-2. SDK 로딩

- 클라이언트에서 네이버 지도 스크립트 1회 로드
- 지도 영역 `dynamic(..., { ssr: false })`
- 타입은 최소 ambient 선언

## 8-3. Local Search → Place (제보)

거지맵과 같이 **상호명 검색 → 결과 선택**만 허용합니다.

1. 사용자가 상호명(+ 지역 키워드) 입력
2. 서버가 Local Search 호출 (Client ID/Secret 미노출)
3. 결과 목록에 상호·도로명·지번 표시 (PoC에서 건수 상한 예: 5건)
4. 선택 시 이름·주소·좌표를 Place에 반영
5. `naverPlaceId`(가능 시) 저장 → 같은 장소 재제보는 기존 Place에 report만 추가

좌표가 검색 응답에 없으면 Geocoding 등 보조 API는 **후속**으로 두고, PoC는 응답에 있는 필드로 충분할 때 진행합니다. *(확인 필요)*

---

# 9. 네이버 API · 개발 준비 (SETUP)

구현·교체 전 필수 준비입니다. 상세는 `docs/plan/SETUP.md`로 분리해도 됩니다.

### 필수 체크리스트

- [ ] [네이버 클라우드 플랫폼](https://www.ncloud.com/) Application 생성
- [ ] **Maps** (Dynamic Map) 활성화 · Web 서비스 URL에 `http://localhost:3000` 등록
- [ ] Maps **Client ID** / **Client Secret** 발급
- [ ] **검색 > 지역(Local)** API용 Application (또는 동일 앱에 검색 API) Client ID / Secret 발급
- [ ] 프로젝트 루트 `.env.local` 설정

### 환경 변수

```env
# NAVER Maps
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=
NAVER_MAP_CLIENT_SECRET=

# NAVER Local Search
NAVER_SEARCH_CLIENT_ID=
NAVER_SEARCH_CLIENT_SECRET=
```

| 변수 | 용도 | 노출 |
|------|------|------|
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | 지도 JavaScript (`ncpClientId`) | 클라이언트 (공개) |
| `NAVER_MAP_CLIENT_SECRET` | Maps 관련 REST (필요 시) | **서버만** |
| `NAVER_SEARCH_CLIENT_ID` | Local Search (제보 상호명 검색) | **서버만** |
| `NAVER_SEARCH_CLIENT_SECRET` | Local Search | **서버만** |

- `.env.local`은 git에 커밋하지 않음

### 개발 순서와의 관계

1. Phase 1: 셸 (키 불필요)  
2. Phase 2: **Maps Client ID** — Mock 좌표를 **실제 네이버 지도** 위 마커로 표시  
3. **Local Search** 키: 제보 상호명 검색·선택 (Phase 5~6)

---

# 10. 단계별 개발 계획

각 단계는 브라우저에서 확인 가능해야 합니다.

## Phase 0 — 계획 검토

- 본 문서 승인 / 코드 변경 없음

## Phase 1 — Fan Map 골격

| 항목 | 내용 |
|------|------|
| 목표 | 지도용 풀스크린 셸, `/` 진입 |
| 구현 | MapShell, 앱명, metadata. auth·guide **삭제하지 않음** (링크·메뉴만 정리) |
| 완료 | 사이드바 없는 Fan Map 홈 |
| 확인 | 모바일/데스크톱 |

## Phase 2 — Mock Place + 실지도 마커

| 항목 | 내용 |
|------|------|
| 목표 | 야구장 주변 Place 10~20 mock을 **실제 네이버 지도** 위에 마커로 표시 + 목록·상세·선택 |
| 선행 | `.env.local`에 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`, Web 서비스 URL 등록 |
| 완료 | 지도에서 mock Place 마커 확인, 클릭 시 상세에 reports·이미지 표시 |
| 비고 | Place 타입·mock은 이후 Local Search 선택 결과와 동일 형태. 플레이스홀더 지도는 쓰지 않음 |

## Phase 3 — 지도 상호작용 보강

| 항목 | 내용 |
|------|------|
| 목표 | 줌/팬, 현위치, 선택 강조, 재검색 UI, 마커 ↔ 목록 동기화 |
| 완료 | Phase 2 지도 위에서 탐색 UX 완성 |

## Phase 4 — Place 상세 완성

| 항목 | 내용 |
|------|------|
| 목표 | M4 + 신뢰 카피 + coverImage 규칙 + 하위 reports |
| 완료 | 상세에서 제보·사진 확인 (`reports.length` 등 파생 표시) |

## Phase 5 — 검색·필터

| 항목 | 내용 |
|------|------|
| 목표 | 필터 3종 + (홈 검색 UX). Local Search 프록시는 제보(Phase 6)와 공유 가능 |
| 완료 | 필터 시 Place 마커 변화 |

## Phase 6 — ViewingReport 제보 + 사진

| 항목 | 내용 |
|------|------|
| 목표 | **상호명 Local Search → 결과 선택** → 폼 → images ≤5 (Base64) → `fan-map:places` 갱신 |
| 완료 | 새로고침 후에도 제보·사진 유지, coverImage 규칙 반영 |
| UX | 거지맵형: 검색 안내 → 결과 N건 → 선택 주소 적용 → 관람 정보 입력 |

## Phase 7 — 즐겨찾기

| 항목 | 내용 |
|------|------|
| 목표 | Place 즐겨찾기 (`fan-map:favorites`) + 필터 |
| 완료 | 새로고침 유지 |

## Phase 8 — 반응형

| 항목 | 내용 |
|------|------|
| 목표 | Drawer, 목록/지도 전환, FAB |
| 완료 | 375px / 1280px |

## Phase 9 — 상태·오류

| 항목 | 내용 |
|------|------|
| 목표 | M10 + 이미지 용량 실패 안내 |
| 완료 | 수동 QA |

## Phase 10 — 빌드·배포 준비

| 항목 | 내용 |
|------|------|
| 목표 | build 성공, SETUP 문서화, guide/auth 배포 시 노출 정책 결정 |
| 완료 | `npm run build` |

---

# 11. 리스크 및 확인 필요 사항

| # | 항목 | 상태 | 액션 |
|---|------|------|------|
| 1 | 네이버 Maps Client ID · Web URL 등록 | 키 입력됨 | localhost 지도 로드 검증 |
| 2 | Local Search 키 · 제보 검색 | 키 입력됨 | 프록시·결과 선택 UX |
| 3 | Local Search 좌표/ID 필드 | 확인 필요 | 네이버 API 응답 스펙 |
| 4 | Next 16 + 네이버 지도 SDK | 검증 필요 | `npm run dev` |
| 5 | localStorage 이미지 용량 | 위험 | 리사이즈·5장 제한 |
| 6 | 기본 지도 중심 | 미정 | mock 야구장 좌표 우선 |
| 7 | guide / auth | 유지 | 삭제 금지, 배포 직전 재결정 |

---

# 12. 첫 번째 개발 단계(Phase 1) 작업 목록

승인 후 코드 수정 시 체크리스트입니다. (**지금은 실행하지 않음**)

1. [ ] `package.json` name → `fan-map`  
2. [ ] `config/app.ts` → Fan Map, 지도용 기본값  
3. [ ] `app/layout.tsx` metadata  
4. [ ] `app/(map)/layout.tsx` + MapShell (`h-dvh`, 사이드바 없음)  
5. [ ] `(map)/page.tsx`를 `/` 진입으로  
6. [ ] dashboard/blank/users — 삭제 또는 메뉴 숨김  
7. [ ] `(auth)` — **삭제하지 않음**, 네비·홈 링크만 제거  
8. [ ] `guide` — **삭제하지 않음**, 개발 시 직접 URL로 접근  
9. [ ] 지도 영역 자리(빈 Map 슬롯)로 브라우저에서 셸 확인 — 실지도는 Phase 2  
10. [ ] 네이버 Maps / Local Search 키 준비 (§9) — **완료 시 체크**  
11. [ ] `npm run build` 확인  

**Phase 1 완료**: Fan Map 지도 셸이 `/`에 보이고, auth·guide 코드는 저장소에 남아 있음.

---

## 다음 대기

지도 SDK는 **네이버**로 교체했습니다.  
다음은 제보 흐름에 **Local Search**(거지맵형 상호명 검색)를 붙이는 작업입니다.
