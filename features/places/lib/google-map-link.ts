import { addressForMapSearch } from "@/features/places/lib/naver-local-search";

/**
 * 구글맵 — 도로명(번지까지)+상호 검색.
 * 예: "서울 송파구 백제고분로7길 24-7 펍마이마이"
 */
export function buildGoogleMapUrl(name: string, address?: string) {
  const mapAddress = address ? addressForMapSearch(address) : "";
  const query = [mapAddress, name.trim()].filter(Boolean).join(" ");
  if (!query) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
