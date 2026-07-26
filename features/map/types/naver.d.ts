export type NaverSize = {
  width: number;
  height: number;
};

export type NaverPoint = {
  x: number;
  y: number;
};

export type NaverMarkerIcon = {
  content: string;
  size: NaverSize;
  anchor: NaverPoint;
};

export type NaverLatLng = {
  lat: () => number;
  lng: () => number;
};

export type NaverLatLngBounds = {
  getSW: () => NaverLatLng;
  getNE: () => NaverLatLng;
  hasLatLng: (latlng: NaverLatLng) => boolean;
};

export type NaverMap = {
  setCenter: (latlng: NaverLatLng) => void;
  setZoom: (zoom: number) => void;
  getCenter: () => NaverLatLng;
  getZoom: () => number;
  getBounds: () => NaverLatLngBounds;
  destroy?: () => void;
};

export type NaverMarker = {
  setMap: (map: NaverMap | null) => void;
  setPosition: (latlng: NaverLatLng) => void;
  setZIndex: (z: number) => void;
  setIcon: (icon: NaverMarkerIcon) => void;
};

export type NaverMapsNamespace = {
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Map: new (
    element: HTMLElement | string,
    options?: {
      center?: NaverLatLng;
      zoom?: number;
      gl?: boolean; // GL 벡터맵 활성화 (Style Editor 커스텀 스타일용)
      customStyleId?: string; // Style Editor My Style ID
    },
  ) => NaverMap;
  Marker: new (options: {
    map?: NaverMap | null;
    position: NaverLatLng;
    zIndex?: number;
    title?: string;
    icon?: NaverMarkerIcon;
  }) => NaverMarker;
  Size: new (width: number, height: number) => NaverSize;
  Point: new (x: number, y: number) => NaverPoint;
  Event: {
    addListener: (
      target: object,
      eventName: string,
      listener: (...args: unknown[]) => void,
    ) => unknown;
    removeListener: (listener: unknown) => void;
  };
};

declare global {
  interface Window {
    naver?: {
      maps: NaverMapsNamespace;
    };
  }
}

export {};
