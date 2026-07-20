const SCRIPT_ID = "naver-maps-sdk";

export function loadNaverMapsSdk(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("네이버 지도 SDK는 브라우저에서만 로드됩니다."));
  }

  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  if (!clientId) {
    return Promise.reject(
      new Error("NEXT_PUBLIC_NAVER_MAP_CLIENT_ID가 설정되지 않았습니다."),
    );
  }

  if (window.naver?.maps) {
    return Promise.resolve();
  }

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => {
        if (window.naver?.maps) resolve();
        else reject(new Error("네이버 지도 SDK를 초기화할 수 없습니다."));
      });
      existing.addEventListener("error", () =>
        reject(new Error("네이버 지도 스크립트 로드에 실패했습니다.")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    // NCP Maps v3 — Client ID를 ncpKeyId로 전달
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}`;
    script.onload = () => {
      if (!window.naver?.maps) {
        reject(new Error("네이버 지도 SDK를 초기화할 수 없습니다."));
        return;
      }
      resolve();
    };
    script.onerror = () =>
      reject(new Error("네이버 지도 스크립트 로드에 실패했습니다."));
    document.head.appendChild(script);
  });
}
