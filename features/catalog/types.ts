export type SportId =
  | "baseball"
  | "soccer"
  | "basketball"
  | "volleyball"
  | "esports"
  | "other";

export type Sport = {
  id: SportId;
  name: string;
  order: number;
};

export type Team = {
  id: string;
  sportId: SportId;
  name: string;
  shortName?: string;
};

/** 장소 태그 카테고리 — 목록 노출 우선순위 순 */
export type VenueTagCategory =
  | "facility"
  | "atmosphere"
  | "food"
  | "view"
  | "other";

export type VenueTag = {
  id: string;
  label: string;
  category: VenueTagCategory;
};
