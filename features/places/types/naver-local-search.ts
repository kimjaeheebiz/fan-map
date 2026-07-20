export type LocalSearchResult = {
  naverPlaceId: string;
  name: string;
  /** 도로명 주소 우선 */
  address: string;
  /** 지번 주소 */
  roadAddress: string;
  lat: number;
  lng: number;
  phone?: string;
  categoryName?: string;
  naverMapUrl?: string;
};

export type PlaceSearchResult = LocalSearchResult;
