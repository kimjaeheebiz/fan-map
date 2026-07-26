"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Star } from "lucide-react";
import { AccountPageShell } from "@/features/account/components/account-page-shell";
import { useFavoritePlaceIds } from "@/features/places/hooks/use-favorite-place-ids";
import { usePlaces } from "@/features/places/hooks/use-places";
import {
  getCoverImageUrl,
  getReportCount,
} from "@/features/places/lib/place-helpers";
import { EmptyState } from "@/components/common/empty-state";
import { Loading } from "@/components/common/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MyFavoritesPage() {
  const { data: places = [], isLoading } = usePlaces();
  const { favoritePlaceIds, toggleFavorite } = useFavoritePlaceIds();

  const favorites = useMemo(
    () => places.filter((place) => favoritePlaceIds.includes(place.id)),
    [places, favoritePlaceIds],
  );

  return (
    <AccountPageShell
      title="즐겨찾기"
      description="로그인 계정으로 저장한 장소를 모아서 봅니다."
    >
      {isLoading ? (
        <Loading label="불러오는 중..." />
      ) : favorites.length === 0 ? (
        <EmptyState
          title="즐겨찾기한 장소가 없습니다."
          description="지도나 장소 상세에서 별표를 누르면 여기에 모입니다."
          className="py-12"
          action={
            <Button render={<Link href="/" />} nativeButton={false}>
              지도 둘러보기
            </Button>
          }
        />
      ) : (
        <Card className="gap-0 divide-y py-0" size="sm">
          {favorites.map((place) => {
            const cover = getCoverImageUrl(place);
            return (
              <div
                key={place.id}
                className="flex items-center gap-3 px-(--card-spacing) py-3"
              >
                <div className="bg-muted size-12 shrink-0 overflow-hidden rounded-md">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{place.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {place.address}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    방문 경험 {getReportCount(place)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="즐겨찾기 해제"
                  onClick={() => toggleFavorite(place.id)}
                >
                  <Star className="fill-report text-report" />
                </Button>
              </div>
            );
          })}
        </Card>
      )}
    </AccountPageShell>
  );
}
