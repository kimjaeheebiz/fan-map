import { NextResponse } from "next/server";
import type { LocalSearchResult } from "@/features/places/types/naver-local-search";

const NAVER_LOCAL_SEARCH_URL =
  "https://openapi.naver.com/v1/search/local.json";

const MAX_RESULTS = 5;

type NaverLocalItem = {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
};

type NaverLocalResponse = {
  items?: NaverLocalItem[];
  errorMessage?: string;
  errorCode?: string;
};

function stripHtml(text: string) {
  return text.replace(/<\/?b>/gi, "").trim();
}

function parseCoordinate(value: string) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num / 10_000_000;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ error: "query가 필요합니다." }, { status: 400 });
  }

  const clientId = process.env.NAVER_SEARCH_CLIENT_ID;
  const clientSecret = process.env.NAVER_SEARCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "네이버 Local Search API 키가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  const url = new URL(NAVER_LOCAL_SEARCH_URL);
  url.searchParams.set("query", query);
  url.searchParams.set("display", String(MAX_RESULTS));
  url.searchParams.set("sort", "random");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      next: { revalidate: 0 },
    });
  } catch {
    return NextResponse.json(
      { error: "네이버 검색 서버에 연결할 수 없습니다." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "네이버 검색 요청에 실패했습니다." },
      { status: response.status },
    );
  }

  const data = (await response.json()) as NaverLocalResponse;
  const items = data.items ?? [];

  const results: LocalSearchResult[] = [];

  for (const item of items) {
    const lng = parseCoordinate(item.mapx);
    const lat = parseCoordinate(item.mapy);
    if (lng == null || lat == null) continue;

    const name = stripHtml(item.title);
    const roadAddress = item.roadAddress?.trim() ?? "";
    const address = roadAddress || item.address?.trim() || "";

    results.push({
      // Local Search에 Place ID가 없어 좌표+상호로 식별
      naverPlaceId: `${item.mapx}-${item.mapy}-${name}`,
      name,
      address,
      roadAddress: item.address?.trim() ?? "",
      lat,
      lng,
      phone: item.telephone?.trim() || undefined,
      categoryName: item.category?.trim() || undefined,
    });
  }

  return NextResponse.json({ items: results, total: results.length });
}
