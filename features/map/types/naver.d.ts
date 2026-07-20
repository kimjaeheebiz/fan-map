export type NaverLatLng = {
  lat: () => number;
  lng: () => number;
};

export type NaverMap = {
  setCenter: (latlng: NaverLatLng) => void;
  setZoom: (zoom: number) => void;
  getCenter: () => NaverLatLng;
  destroy?: () => void;
};

export type NaverMarker = {
  setMap: (map: NaverMap | null) => void;
  setPosition: (latlng: NaverLatLng) => void;
  setZIndex: (z: number) => void;
};

export type NaverMapsNamespace = {
  LatLng: new (lat: number, lng: number) => NaverLatLng;
  Map: new (
    element: HTMLElement | string,
    options?: {
      center?: NaverLatLng;
      zoom?: number;
    },
  ) => NaverMap;
  Marker: new (options: {
    map?: NaverMap | null;
    position: NaverLatLng;
    zIndex?: number;
    title?: string;
  }) => NaverMarker;
  Event: {
    addListener: (
      target: object,
      eventName: string,
      listener: (...args: unknown[]) => void,
    ) => void;
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
