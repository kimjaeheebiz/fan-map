export type Notice = {
  id: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
  pinned?: boolean;
};

/** PoC용 공지 Mock */
export const mockNotices: Notice[] = [
  {
    id: "n1",
    title: "Fan Map PoC 오픈 안내",
    summary: "응원 장소 탐색·방문 경험 기능을 미리 체험해 보세요.",
    body: `안녕하세요, Fan Map입니다.

응원·방문 장소를 지도에서 찾고, 다녀온 경험을 공유하는 PoC 서비스가 열렸습니다.

현재는 카카오 로그인(Mock), 방문 경험, 즐겨찾기 등 핵심 흐름을 확인할 수 있습니다.
실제 카카오 OAuth·서버 저장은 이후 단계에서 연동될 예정입니다.

이용해 주셔서 감사합니다.`,
    publishedAt: "2026-07-20",
    pinned: true,
  },
  {
    id: "n2",
    title: "방문 경험은 회원만 이용 가능합니다",
    summary: "로그인 후 남겨 주세요.",
    body: `방문 경험은 회원 전용 기능입니다.

비회원도 지도에서 장소를 탐색하고 상세 정보를 볼 수 있지만,
방문 경험 등록은 카카오 로그인 후 이용할 수 있습니다.
헤더의 다녀왔어요 버튼으로 시작할 수 있습니다.

남길 때 상호명은 네이버 지역 검색 결과에서 선택해 주세요.`,
    publishedAt: "2026-07-22",
  },
  {
    id: "n3",
    title: "서비스 점검 예정 안내 (Mock)",
    summary: "점검 시간에는 일시적으로 이용이 제한될 수 있습니다.",
    body: `아래 시간대에 점검이 예정되어 있습니다. (Mock 공지)

일시: 추후 공지
영향: 지도·방문 경험·로그인 일부 기능

점검이 끝나면 정상 이용이 가능합니다.`,
    publishedAt: "2026-07-25",
  },
];

export function getNoticeById(id: string) {
  return mockNotices.find((notice) => notice.id === id) ?? null;
}
