export type KakaoLatLng = {
  getLat: () => number;
  getLng: () => number;
};

export type KakaoMap = {
  setCenter: (latlng: KakaoLatLng) => void;
  setLevel: (level: number) => void;
  getCenter: () => KakaoLatLng;
  relayout: () => void;
};

export type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
  setPosition: (latlng: KakaoLatLng) => void;
  setZIndex: (z: number) => void;
};

export type KakaoMapsNamespace = {
  load: (callback: () => void) => void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMap;
  Marker: new (options: {
    map?: KakaoMap;
    position: KakaoLatLng;
    zIndex?: number;
    title?: string;
  }) => KakaoMarker;
  event: {
    addListener: (
      target: object,
      type: string,
      handler: (...args: unknown[]) => void,
    ) => void;
  };
};

declare global {
  interface Window {
    kakao?: {
      maps: KakaoMapsNamespace;
    };
  }
}

export {};
