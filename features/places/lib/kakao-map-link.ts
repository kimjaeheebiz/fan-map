import { addressForMapSearch } from "@/features/places/lib/naver-local-search";

/**
 * 카카오맵 — 도로명(번지까지)+상호 검색.
 * 예: "서울 송파구 백제고분로7길 24-7 펍마이마이"
 */
export function buildKakaoMapUrl(name: string, address?: string) {
  const mapAddress = address ? addressForMapSearch(address) : "";
  const query = [mapAddress, name.trim()].filter(Boolean).join(" ");
  if (!query) return undefined;
  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}
