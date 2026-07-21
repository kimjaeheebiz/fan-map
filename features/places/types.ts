import type { SportId } from "@/features/catalog/types";

/** 종목 1개 + 그 종목의 팀들 (세트) */
export type SportTeamSet = {
  sportId: SportId;
  teamIds?: string[];
};

export type ViewingReport = {
  id: string;
  placeId: string;
  sportTeams: SportTeamSet[]; // 종목·팀 세트 (1개 이상). 종목별로 팀을 묶음
  watchedAt: string;
  review: string;
  tagIds?: string[];
  hasScreen?: boolean;
  hasSound?: boolean;
  goodForGroup?: boolean;
  images: string[]; // Base64 data URL only (max 5)
  createdAt: string;
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
  naverMapUrl?: string;
  coverImageUrl?: string; // 대표 이미지. 비어 있으면 첫 제보 images[0] 사용
  reports: ViewingReport[];
  createdAt: string;
};
