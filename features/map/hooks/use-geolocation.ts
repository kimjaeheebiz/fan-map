"use client";

import { useCallback, useState } from "react";

export type GeolocationStatus =
  | "idle"
  | "loading"
  | "ready"
  | "denied"
  | "unavailable";

export type GeoPosition = {
  lat: number;
  lng: number;
};

export function useGeolocation() {
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("unavailable");
      setErrorMessage("이 브라우저에서는 위치 정보를 사용할 수 없습니다.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        const next = {
          lat: result.coords.latitude,
          lng: result.coords.longitude,
        };
        setPosition(next);
        setStatus("ready");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setStatus("denied");
          setErrorMessage("위치 권한이 거부되었습니다. 브라우저 설정을 확인해 주세요.");
          return;
        }
        setStatus("unavailable");
        setErrorMessage("현재 위치를 가져오지 못했습니다.");
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 60_000,
      },
    );
  }, []);

  return {
    status,
    position,
    errorMessage,
    requestLocation,
  };
}
