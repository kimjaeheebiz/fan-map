import type { SportId } from "@/features/catalog/types";

/** 종목별 강조 컬러 (필터·마커) */
export const sportAccentColor: Record<SportId, string> = {
  baseball: "#0057FF",
  soccer: "#21C55D",
  basketball: "#FF6B00",
  volleyball: "#0EA5E9",
  esports: "#FF2D55",
  other: "#64748B",
};
