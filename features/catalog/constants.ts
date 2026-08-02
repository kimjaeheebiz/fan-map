import type {
  Sport,
  Team,
  VenueTag,
  VenueTagCategory,
} from "@/features/catalog/types";

export const sports: Sport[] = [
  { id: "baseball", name: "야구", order: 1 },
  { id: "soccer", name: "축구", order: 2 },
  { id: "basketball", name: "농구", order: 3 },
  { id: "volleyball", name: "배구", order: 4 },
  { id: "esports", name: "e스포츠", order: 5 },
  { id: "other", name: "기타", order: 6 },
];

export const teams: Team[] = [
  { id: "lg-twins", sportId: "baseball", name: "LG 트윈스", shortName: "LG" },
  { id: "doosan-bears", sportId: "baseball", name: "두산 베어스", shortName: "두산" },
  { id: "kiwoom-heroes", sportId: "baseball", name: "키움 히어로즈", shortName: "키움" },
  { id: "kt-wiz", sportId: "baseball", name: "KT 위즈", shortName: "KT" },
  { id: "fc-seoul", sportId: "soccer", name: "FC 서울", shortName: "서울" },
];

/** 시설 → 분위기 → 음식 → 시야 → 기타 */
export const venueTagCategoryOrder: VenueTagCategory[] = [
  "facility",
  "atmosphere",
  "food",
  "view",
  "other",
];

export const venueTagCategoryLabels: Record<VenueTagCategory, string> = {
  facility: "시설",
  atmosphere: "분위기",
  food: "음식",
  view: "시야",
  other: "기타",
};

export const venueTags: VenueTag[] = [
  { id: "big-screen", label: "대형 스크린", category: "facility" },
  { id: "match-sound", label: "경기 음향", category: "facility" },
  { id: "group-seating", label: "단체석", category: "facility" },
  { id: "loud-cheer", label: "응원 열기", category: "atmosphere" },
  { id: "quiet", label: "조용함", category: "atmosphere" },
  { id: "good-food", label: "안주 맛집", category: "food" },
  { id: "good-beer", label: "맥주 맛집", category: "food" },
  { id: "good-view", label: "시야 좋음", category: "view" },
];

const venueTagById = new Map(venueTags.map((tag) => [tag.id, tag]));
const venueTagIndex = new Map(venueTags.map((tag, index) => [tag.id, index]));

export function getSportName(id: string) {
  return sports.find((s) => s.id === id)?.name ?? id;
}

export function getTeamName(id: string) {
  return teams.find((t) => t.id === id)?.name ?? id;
}

export function getTagLabel(id: string) {
  return venueTagById.get(id)?.label ?? id;
}

/** 카테고리 우선순위 → catalog 선언 순 */
export function sortTagIdsByPriority(tagIds: string[]) {
  return [...tagIds].sort((a, b) => {
    const tagA = venueTagById.get(a);
    const tagB = venueTagById.get(b);
    const catA = tagA
      ? venueTagCategoryOrder.indexOf(tagA.category)
      : venueTagCategoryOrder.length;
    const catB = tagB
      ? venueTagCategoryOrder.indexOf(tagB.category)
      : venueTagCategoryOrder.length;
    if (catA !== catB) return catA - catB;
    return (venueTagIndex.get(a) ?? 99) - (venueTagIndex.get(b) ?? 99);
  });
}

/** 목록 카드용 — 우선순위 상위 limit개 + 초과 수 */
export function selectListTags(tagIds: string[], limit = 3) {
  const sorted = sortTagIdsByPriority(tagIds);
  return {
    tags: sorted.slice(0, limit).map((id) => ({
      id,
      label: getTagLabel(id),
    })),
    overflow: Math.max(0, sorted.length - limit),
  };
}
