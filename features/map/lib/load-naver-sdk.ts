const SCRIPT_ID = "naver-maps-sdk";

function buildSdkUrl(clientId: string) {
  return `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(clientId)}&submodules=gl`;
}

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

  const sdkUrl = buildSdkUrl(clientId);
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

  // GL 서브모듈 없이 로드된 이전 스크립트는 제거하고 다시 로드
  if (existing && !existing.src.includes("submodules=gl")) {
    existing.remove();
    // 이미 초기화된 네임스페이스는 페이지 새로고침 없이는 교체가 어려움
    if (window.naver?.maps) {
      return Promise.reject(
        new Error(
          "지도 SDK를 GL 모드로 다시 로드하려면 페이지를 새로고침해 주세요.",
        ),
      );
    }
  }

  if (window.naver?.maps) {
    return Promise.resolve();
  }

  const scriptEl = document.getElementById(SCRIPT_ID);
  if (scriptEl) {
    return new Promise((resolve, reject) => {
      scriptEl.addEventListener("load", () => {
        if (window.naver?.maps) resolve();
        else reject(new Error("네이버 지도 SDK를 초기화할 수 없습니다."));
      });
      scriptEl.addEventListener("error", () =>
        reject(new Error("네이버 지도 스크립트 로드에 실패했습니다.")),
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    // NCP Maps v3 — Client ID를 ncpKeyId로 전달, Style Editor용 GL 서브모듈 포함
    script.src = sdkUrl;
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
