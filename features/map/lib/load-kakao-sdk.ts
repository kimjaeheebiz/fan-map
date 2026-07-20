const SCRIPT_ID = "kakao-maps-sdk";

export function loadKakaoMapsSdk(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Kakao Maps SDK는 브라우저에서만 로드됩니다."));
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
  if (!appKey) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_KAKAO_MAP_KEY가 설정되지 않았습니다."),
    );
  }

  if (window.kakao?.maps) {
    return new Promise((resolve) => {
      window.kakao!.maps.load(() => resolve());
    });
  }

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        window.kakao?.maps.load(() => resolve());
      });
      existing.addEventListener("error", () =>
        reject(new Error("카카오맵 스크립트 로드에 실패했습니다.")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error("카카오맵 SDK를 초기화할 수 없습니다."));
        return;
      }
      window.kakao.maps.load(() => resolve());
    };
    script.onerror = () =>
      reject(new Error("카카오맵 스크립트 로드에 실패했습니다."));
    document.head.appendChild(script);
  });
}
