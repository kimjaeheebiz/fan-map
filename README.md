# Fan Map

응원·방문 장소를 지도에서 찾고, 다녀온 경험을 공유하는 지도 서비스 (PoC).

## 시작하기

```bash
npm install
npm run dev
```

`.env.local`에 네이버 지도·검색 키를 넣은 뒤 [http://localhost:3000](http://localhost:3000) 을 엽니다.

### 환경변수

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | 네이버 지도 JS SDK |
| `NAVER_SEARCH_CLIENT_ID` | 지역 검색 (서버) |
| `NAVER_SEARCH_CLIENT_SECRET` | 지역 검색 (서버) |

자세한 키 설명은 [PoC 계획](docs/plan/POC_PLAN.md)을 참고하세요.

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint |

## 문서

```
docs/
  specs/         # 제품·기능 명세
  conventions/   # 코딩·작성 규칙
  guides/        # 개발·구조·UI 가이드
  plan/          # 기획·PoC 계획
```

| 구분 | 문서 | 설명 |
|------|------|------|
| Specs | [features.md](docs/specs/features.md) | 현재 구현 기준 기능 명세 |
| Conventions | [coding.md](docs/conventions/coding.md) | 주석·모듈 분리·border radius |
| Guides | [development.md](docs/guides/development.md) | 페이지·CRUD·API 연동 |
| | [components.md](docs/guides/components.md) | 공통·UI 컴포넌트 |
| | [theme.md](docs/guides/theme.md) | 테마·레이아웃 토큰 |
| | [structure.md](docs/guides/structure.md) | 디렉터리·레이어 |
| Plan | [PROJECT_BRIEF.md](docs/plan/PROJECT_BRIEF.md) | 제품 개요·요구사항 |
| | [POC_PLAN.md](docs/plan/POC_PLAN.md) | PoC 범위·단계·환경변수 |

## 기술 스택

- Next.js · React · TypeScript
- Tailwind CSS · shadcn/ui
- TanStack Query · Zod · React Hook Form
- 네이버 지도 · Local Search
