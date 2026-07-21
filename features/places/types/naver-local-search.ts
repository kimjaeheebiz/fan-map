export type LocalSearchResult = {
  naverPlaceId: string;
  name: string;
  address: string; // 도로명 주소 우선
  roadAddress: string; // 지번 주소
  lat: number;
  lng: number;
  phone?: string;
  categoryName?: string;
  naverMapUrl?: string;
};

export type PlaceSearchResult = LocalSearchResult;
