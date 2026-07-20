import type { Sport, Team, VenueTag } from "@/features/catalog/types";

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

export const venueTags: VenueTag[] = [
  { id: "good-view", label: "시야 좋음" },
  { id: "loud-cheer", label: "응원 열기" },
  { id: "quiet", label: "조용함" },
  { id: "good-food", label: "안주 맛집" },
  { id: "big-screen", label: "큰 화면" },
];

export function getSportName(id: string) {
  return sports.find((s) => s.id === id)?.name ?? id;
}

export function getTeamName(id: string) {
  return teams.find((t) => t.id === id)?.name ?? id;
}

export function getTagLabel(id: string) {
  return venueTags.find((t) => t.id === id)?.label ?? id;
}
