export type MapBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export function isPointInBounds(
  lat: number,
  lng: number,
  bounds: MapBounds,
) {
  return (
    lat >= bounds.minLat &&
    lat <= bounds.maxLat &&
    lng >= bounds.minLng &&
    lng <= bounds.maxLng
  );
}

export function areAnyPlacesInBounds(
  places: { lat: number; lng: number }[],
  bounds: MapBounds,
) {
  return places.some((place) =>
    isPointInBounds(place.lat, place.lng, bounds),
  );
}
