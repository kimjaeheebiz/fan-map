import type { SportId } from "@/features/catalog/types";

export type ViewingReport = {
  id: string;
  placeId: string;
  sportId: SportId;
  teamId?: string;
  watchedAt: string;
  review: string;
  tagIds?: string[];
  hasScreen?: boolean;
  hasSound?: boolean;
  goodForGroup?: boolean;
  /** Base64 data URL only (max 5) */
  images: string[];
  createdAt: string;
};

export type Place = {
  id: string;
  kakaoPlaceId?: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  categoryName?: string;
  kakaoUrl?: string;
  /** 대표 이미지. 비어 있으면 첫 제보 images[0] 사용 */
  coverImageUrl?: string;
  reports: ViewingReport[];
  createdAt: string;
};
