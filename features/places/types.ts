import type { SportId } from "@/features/catalog/types";

/** 종목 1개 + 그 종목의 팀들 (세트) */
export type SportTeamSet = {
  sportId: SportId;
  teamIds?: string[];
};

export type ViewingReport = {
  id: string;
  placeId: string;
  authorId: string;
  authorNickname: string;
  sportTeams: SportTeamSet[]; // 종목·팀 세트 (1개 이상). 종목별로 팀을 묶음
  watchedAt: string;
  review: string;
  tagIds?: string[];
  images: string[]; // Base64 data URL only (max 5)
  createdAt: string;
};

/** 장소 프로모·이벤트 (운영 큐레이션) */
export type PlaceEvent = {
  id: string;
  title: string;
  badgeLabel?: string;
  startsAt: string;
  endsAt: string;
};

export type Place = {
  id: string;
  naverPlaceId?: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  categoryName?: string;
  coverImageUrl?: string; // 대표 이미지. 비어 있으면 첫 제보 images[0] 사용
  events?: PlaceEvent[];
  reports: ViewingReport[];
  createdAt: string;
};
