import type { PlaceSearchResult } from "@/features/places/types/naver-local-search";

/**
 * 검색용 주소 — 번지(예: 4-27)까지만 남기고 뒤 건물명은 제거.
 * "…42길 4-27 명진빌딩" → "…42길 4-27"
 */
export function addressForMapSearch(address: string) {
  const trimmed = address.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/^(.+?\s\d+(?:-\d+)?)(?:\s+.+)?$/);
  return match?.[1] ?? trimmed;
}

/** Place ID 없이 상호명+도로명(번지까지)으로 네이버 지도 검색 페이지를 연다. */
export function buildNaverMapSearchUrl(name: string, address?: string) {
  const mapAddress = address ? addressForMapSearch(address) : "";
  const query = [name.trim(), mapAddress].filter(Boolean).join(" ");
  if (!query) return undefined;
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

export async function searchLocalPlaces(query: string): Promise<PlaceSearchResult[]> {
  const params = new URLSearchParams({ query });
  const response = await fetch(`/api/naver/local-search?${params.toString()}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(body?.error ?? "장소 검색에 실패했습니다.");
  }

  const data = (await response.json()) as { items: PlaceSearchResult[] };
  return data.items ?? [];
}

export function formatPlaceAddress(result: PlaceSearchResult) {
  if (result.address && result.roadAddress && result.address !== result.roadAddress) {
    return `${result.address} · ${result.roadAddress}`;
  }
  return result.address || result.roadAddress;
}
