import { Suspense } from "react";
import { MapHome } from "@/features/places/components/map-home";
import { Loading } from "@/components/common/loading";

/**
 * Fan Map 홈 — Mock Place + 네이버 지도 마커
 */
export default function MapHomePage() {
  return (
    <Suspense fallback={<Loading label="지도 불러오는 중..." className="h-full" />}>
      <MapHome />
    </Suspense>
  );
}
